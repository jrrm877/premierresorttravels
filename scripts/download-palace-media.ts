import { createHash } from "node:crypto";
import { mkdir, readFile, rename, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";
import { chromium, type BrowserContext, type Download, type Locator, type Page } from "playwright";

import { palaceMediaConfig } from "./palace-media-config";

type DownloadStatus = "downloaded" | "skipped" | "duplicate" | "failed";

type DownloadLog = {
  sourceUrl: string;
  folderName?: string;
  outputPath?: string;
  status: DownloadStatus;
  reason?: string;
  hash?: string;
};

type FolderLog = {
  name: string;
  url: string;
  screenshots: string[];
  assetCardsFound: number;
  imageUrlsFound: number;
  downloaded: number;
  skipped: number;
  duplicates: number;
  failed: number;
  skippedReasons: Record<string, number>;
};

type DownloadReport = {
  startedAt: string;
  finishedAt?: string;
  portalUrl: string;
  folderUrls: string[];
  folders: FolderLog[];
  downloaded: DownloadLog[];
  skipped: DownloadLog[];
  duplicates: DownloadLog[];
  failed: DownloadLog[];
};

type AssetCardRef = {
  selector: string;
  index: number;
};

type FolderCandidate = {
  url: string;
  name: string;
};

type CrawlState = {
  visited: Set<string>;
  foldersProcessed: number;
};

const args = new Set(process.argv.slice(2));
const waitForLogin = args.has("--login") || args.has("--wait-for-login");
const clickDownloads = !args.has("--no-click-downloads");
const headless = args.has("--headless") && !waitForLogin;

function resolveFromProject(relativePath: string) {
  return path.resolve(process.cwd(), relativePath);
}

function normalizeExtension(value: string) {
  return value.replace(/^\./, "").toLowerCase();
}

function extensionFromContentType(contentType: string | null) {
  if (!contentType) return "";
  if (contentType.includes("jpeg")) return "jpg";
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  return "";
}

function extensionFromUrl(url: string) {
  try {
    const parsed = new URL(url);
    return path.extname(parsed.pathname).replace(".", "").toLowerCase();
  } catch {
    return "";
  }
}

function filenameFromUrl(url: string, extension: string) {
  const parsed = new URL(url);
  const pathname = decodeURIComponent(parsed.pathname);
  const base = path.basename(pathname).replace(/\.[a-z0-9]+$/i, "") || "palace-media";
  return `${slugify(base)}.${extension}`;
}

function safeDownloadedFilename(value: string) {
  const parsed = path.parse(value);
  return `${slugify(parsed.name)}${parsed.ext.toLowerCase()}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-") || "palace-media";
}

function hashBuffer(buffer: Buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function fileExists(filePath: string) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function uniquePathFor(filePath: string, hash: string) {
  if (!(await fileExists(filePath))) return filePath;

  const existingHash = hashBuffer(await readFile(filePath));
  if (existingHash === hash) return filePath;

  const parsed = path.parse(filePath);
  return path.join(parsed.dir, `${parsed.name}-${hash.slice(0, 8)}${parsed.ext}`);
}

function shouldSkipCandidate(source: string, folderName: string) {
  const lowerSource = source.toLowerCase();
  const lowerFolder = folderName.toLowerCase();
  const ext = normalizeExtension(extensionFromUrl(source) || path.extname(source));

  if (
    !palaceMediaConfig.includeLogos &&
    /(^|[^a-z0-9])(logo|logos|brand[\s_-]*logos?|brand[\s_-]*guidelines?|branding|logomark|wordmark)(?=$|[^a-z0-9])/i.test(`${lowerFolder} ${lowerSource}`)
  ) {
    return "logo/brand assets are skipped unless includeLogos is true";
  }

  if (!palaceMediaConfig.includeVideos && /\.(mp4|mov|avi|webm)(\?|$)/i.test(lowerSource)) {
    return "videos are skipped unless includeVideos is true";
  }

  if (ext && palaceMediaConfig.skippedExtensions.includes(ext)) {
    return `.${ext} files are skipped`;
  }

  return "";
}

function isLikelyAssetUrl(url: string) {
  const lower = url.toLowerCase();
  const ext = normalizeExtension(extensionFromUrl(lower));

  if (ext && palaceMediaConfig.allowedExtensions.includes(ext)) return true;
  return palaceMediaConfig.assetUrlPatterns.some((pattern) => lower.includes(pattern.toLowerCase()));
}

function addToReport(report: DownloadReport, folderLog: FolderLog, log: DownloadLog) {
  if (log.status === "downloaded") {
    report.downloaded.push(log);
    folderLog.downloaded += 1;
  }
  if (log.status === "skipped") {
    report.skipped.push(log);
    folderLog.skipped += 1;
    folderLog.skippedReasons[log.reason ?? "unknown"] = (folderLog.skippedReasons[log.reason ?? "unknown"] ?? 0) + 1;
  }
  if (log.status === "duplicate") {
    report.duplicates.push(log);
    folderLog.duplicates += 1;
  }
  if (log.status === "failed") {
    report.failed.push(log);
    folderLog.failed += 1;
  }
}

function shouldSkipFolder(name: string) {
  if (!palaceMediaConfig.includeLogos && /(^|[^a-z0-9])(logo|logos|brand[\s_-]*logos?|brand[\s_-]*guidelines?|branding|wordmark|logomark)(?=$|[^a-z0-9])/i.test(name)) {
    return "logo/brand folder skipped unless includeLogos is true";
  }

  if (!palaceMediaConfig.includeVideos && /\b(video|videos|film|reels?)\b/i.test(name)) {
    return "video folder skipped unless includeVideos is true";
  }

  return "";
}

async function debugScreenshot(page: Page, folderLog: FolderLog, step: string) {
  const debugDir = resolveFromProject(palaceMediaConfig.debugDir);
  await mkdir(debugDir, { recursive: true });

  const fileName = `${String(folderLog.screenshots.length + 1).padStart(2, "0")}-${slugify(folderLog.name)}-${slugify(step)}.png`;
  const absolutePath = path.join(debugDir, fileName);
  await page.screenshot({ path: absolutePath, fullPage: false });

  const relativePath = path.relative(process.cwd(), absolutePath);
  folderLog.screenshots.push(relativePath);
  return relativePath;
}

async function askForLoginIfNeeded() {
  if (!waitForLogin) return;
  const readline = createInterface({ input, output });
  await readline.question("Log in to Canto in the opened browser, navigate if needed, then press Enter here to continue...");
  readline.close();
}

async function writeReport(report: DownloadReport) {
  const reportPath = resolveFromProject(palaceMediaConfig.reportPath);
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}

async function clickIfVisible(locator: Locator) {
  if (!(await locator.isVisible().catch(() => false))) return false;
  await locator.click({ timeout: 5_000 }).catch(() => undefined);
  return true;
}

async function ensurePageEvaluateHelpers(page: Page) {
  await page.evaluate("window.__name = (value) => value").catch(() => undefined);
}

async function expandFolderTree(page: Page) {
  await ensurePageEvaluateHelpers(page);

  for (let depth = 0; depth < palaceMediaConfig.maxFolderDepth; depth += 1) {
    const closedFolders = page.locator(
      [
        '[role="tree"] [aria-expanded="false"]',
        '[aria-label*="Library" i] [aria-expanded="false"]',
        '[class*="folder" i] [aria-expanded="false"]',
      ].join(", "),
    );
    const count = await closedFolders.count().catch(() => 0);
    if (count === 0) break;

    let opened = 0;
    for (let index = 0; index < Math.min(count, 80); index += 1) {
      const folder = closedFolders.nth(index);
      if (await clickIfVisible(folder)) {
        opened += 1;
        await page.waitForTimeout(250);
      }
    }

    if (opened === 0) break;
    await page.waitForTimeout(600);
  }
}

async function discoverFolderUrls(page: Page) {
  await ensurePageEvaluateHelpers(page);
  await expandFolderTree(page);

  const urls = await page.evaluate((portalUrl) => {
    const portal = new URL(portalUrl);
    const found = new Map<string, string>();
    const folderPattern = /(folder|album|library|collection|view|assets)/i;

    document.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;

      const url = new URL(href, window.location.href);
      if (url.host !== portal.host) return;
      if (!folderPattern.test(url.href)) return;

      const text = (link.textContent || link.getAttribute("aria-label") || "").trim();
      found.set(url.href, text || url.pathname);
    });

    return Array.from(found, ([url, name]) => ({ url, name }));
  }, palaceMediaConfig.portalUrl);

  return urls;
}

async function discoverClickableFolders(page: Page) {
  await expandFolderTree(page);

  const folderSelectors = [
    '[role="treeitem"]',
    '[aria-label*="folder" i]',
    '[class*="folder" i]',
  ];
  const refs: { selector: string; index: number; name: string }[] = [];

  for (const selector of folderSelectors) {
    const locator = page.locator(selector);
    const count = await locator.count().catch(() => 0);
    for (let index = 0; index < Math.min(count, 120); index += 1) {
      const item = locator.nth(index);
      if (!(await item.isVisible().catch(() => false))) continue;

      const name = (await item.innerText().catch(() => "")) || (await item.getAttribute("aria-label").catch(() => "")) || "";
      const cleanName = name.replace(/\s+/g, " ").trim();
      if (!cleanName || cleanName.length > 90) continue;
      refs.push({ selector, index, name: cleanName });
    }
    if (refs.length > 0) break;
  }

  return refs;
}

async function getBestGridLocator(page: Page) {
  for (const selector of palaceMediaConfig.assetGridSelectors) {
    const locator = page.locator(selector).first();
    if (await locator.isVisible().catch(() => false)) return locator;
  }
  return page.locator("body");
}

async function scrollAssetGrid(page: Page, folderLog: FolderLog) {
  await ensurePageEvaluateHelpers(page);
  const grid = await getBestGridLocator(page);
  let previousCardCount = -1;
  let stablePasses = 0;

  for (let pass = 0; pass < palaceMediaConfig.maxGridScrollPasses; pass += 1) {
    const cardCount = (await collectAssetCardRefs(page)).length;
    if (cardCount === previousCardCount) stablePasses += 1;
    if (cardCount > previousCardCount) stablePasses = 0;

    previousCardCount = cardCount;

    await grid.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    }).catch(() => undefined);
    await page.mouse.wheel(0, 1600).catch(() => undefined);
    await page.waitForTimeout(700);

    if (stablePasses >= 3) break;
  }

  await debugScreenshot(page, folderLog, "grid scrolled");
}

async function collectAssetCardRefs(page: Page) {
  for (const selector of palaceMediaConfig.assetCardSelectors) {
    const locator = page.locator(selector);
    const count = await locator.count().catch(() => 0);
    const refs: AssetCardRef[] = [];

    for (let index = 0; index < Math.min(count, 500); index += 1) {
      const item = locator.nth(index);
      if (!(await item.isVisible().catch(() => false))) continue;
      const box = await item.boundingBox().catch(() => null);
      if (!box || box.width < 60 || box.height < 60) continue;
      refs.push({ selector, index });
    }

    if (refs.length > 0) return refs;
  }

  return [];
}

async function collectImageUrlsFromPage(page: Page) {
  await ensurePageEvaluateHelpers(page);
  const urls = await page.evaluate(() => {
    const values = new Set<string>();

    function addUrl(value: string | null) {
      if (!value) return;
      value.split(",").forEach((item) => {
        const candidate = item.trim().split(/\s+/)[0];
        if (!candidate || candidate.startsWith("data:")) return;
        values.add(new URL(candidate, window.location.href).href);
      });
    }

    document.querySelectorAll("img, source, a").forEach((element) => {
      ["src", "srcset", "href", "data-src", "data-original", "data-download-url", "data-url"].forEach((attribute) => {
        addUrl(element.getAttribute(attribute));
      });
    });

    document.querySelectorAll<HTMLElement>("[style]").forEach((element) => {
      const style = window.getComputedStyle(element);
      const match = style.backgroundImage.match(/url\(["']?(.+?)["']?\)/);
      addUrl(match?.[1] ?? null);
    });

    return Array.from(values);
  });

  return urls.filter((url) => isLikelyAssetUrl(url));
}

async function collectImageUrlsFromCard(page: Page, card: Locator) {
  await ensurePageEvaluateHelpers(page);
  const urls = await card.evaluate((element) => {
    const values = new Set<string>();

    function addUrl(value: string | null) {
      if (!value) return;
      value.split(",").forEach((item) => {
        const candidate = item.trim().split(/\s+/)[0];
        if (!candidate || candidate.startsWith("data:")) return;
        values.add(new URL(candidate, window.location.href).href);
      });
    }

    element.querySelectorAll("img, source, a").forEach((child) => {
      ["src", "srcset", "href", "data-src", "data-original", "data-download-url", "data-url"].forEach((attribute) => {
        addUrl(child.getAttribute(attribute));
      });
    });

    const style = window.getComputedStyle(element);
    const match = style.backgroundImage.match(/url\(["']?(.+?)["']?\)/);
    addUrl(match?.[1] ?? null);

    return Array.from(values);
  }).catch(() => []);

  return urls.filter((url) => isLikelyAssetUrl(url));
}

async function downloadAsset(context: BrowserContext, url: string, outputDir: string, folderName: string): Promise<DownloadLog> {
  const skipReason = shouldSkipCandidate(url, folderName);
  if (skipReason) {
    return { sourceUrl: url, folderName, status: "skipped", reason: skipReason };
  }

  try {
    const response = await context.request.get(url, { timeout: 45_000 });
    if (!response.ok()) {
      return { sourceUrl: url, folderName, status: "failed", reason: `HTTP ${response.status()}` };
    }

    const contentType = response.headers()["content-type"] ?? "";
    if (!contentType.startsWith("image/")) {
      return { sourceUrl: url, folderName, status: "skipped", reason: `not an image response (${contentType || "unknown content type"})` };
    }

    const extension = normalizeExtension(extensionFromContentType(contentType) || extensionFromUrl(url) || "jpg");
    if (!palaceMediaConfig.allowedExtensions.includes(extension)) {
      return { sourceUrl: url, folderName, status: "skipped", reason: `.${extension} is not allowed` };
    }

    const body = Buffer.from(await response.body());
    const hash = hashBuffer(body);
    const initialPath = path.join(outputDir, filenameFromUrl(url, extension));
    const finalPath = await uniquePathFor(initialPath, hash);

    if ((await fileExists(finalPath)) && hashBuffer(await readFile(finalPath)) === hash) {
      return { sourceUrl: url, folderName, outputPath: path.relative(process.cwd(), finalPath), status: "duplicate", hash };
    }

    await writeFile(finalPath, body);
    return { sourceUrl: url, folderName, outputPath: path.relative(process.cwd(), finalPath), status: "downloaded", hash };
  } catch (error) {
    return { sourceUrl: url, folderName, status: "failed", reason: error instanceof Error ? error.message : String(error) };
  }
}

async function savePlaywrightDownload(download: Download, outputDir: string, folderName: string): Promise<DownloadLog> {
  const suggestedName = safeDownloadedFilename(download.suggestedFilename());
  const suggestedExtension = normalizeExtension(path.extname(suggestedName));
  const skipReason = shouldSkipCandidate(suggestedName, folderName);

  if (skipReason || !palaceMediaConfig.allowedExtensions.includes(suggestedExtension)) {
    await download.cancel().catch(() => undefined);
    return {
      sourceUrl: download.url(),
      folderName,
      status: "skipped",
      reason: skipReason || `.${suggestedExtension || "unknown"} is not allowed`,
    };
  }

  const tempPath = path.join(outputDir, `.download-${Date.now()}-${suggestedName}`);
  const targetPath = path.join(outputDir, suggestedName);
  await download.saveAs(tempPath);

  const buffer = await readFile(tempPath);
  const hash = hashBuffer(buffer);
  const finalPath = await uniquePathFor(targetPath, hash);

  if ((await fileExists(finalPath)) && hashBuffer(await readFile(finalPath)) === hash) {
    await unlink(tempPath).catch(() => undefined);
    return {
      sourceUrl: download.url(),
      folderName,
      outputPath: path.relative(process.cwd(), finalPath),
      status: "duplicate",
      hash,
    };
  }

  await rename(tempPath, finalPath);

  return {
    sourceUrl: download.url(),
    folderName,
    outputPath: path.relative(process.cwd(), finalPath),
    status: "downloaded",
    hash,
  };
}

async function clickDownloadButtons(page: Page, outputDir: string, folderName: string) {
  const logs: DownloadLog[] = [];

  for (const selector of palaceMediaConfig.downloadButtonSelectors) {
    const buttons = page.locator(selector);
    const count = await buttons.count().catch(() => 0);

    for (let index = 0; index < Math.min(count, 8); index += 1) {
      const button = buttons.nth(index);
      if (!(await button.isVisible().catch(() => false))) continue;

      try {
        const downloadPromise = page.waitForEvent("download", { timeout: 12_000 });
        await button.click({ timeout: 5_000 });
        const download = await downloadPromise;
        logs.push(await savePlaywrightDownload(download, outputDir, folderName));
        return logs;
      } catch {
        await page.waitForTimeout(700);
      }
    }
  }

  return logs;
}

async function processAssetCard(
  page: Page,
  context: BrowserContext,
  outputDir: string,
  report: DownloadReport,
  folderLog: FolderLog,
  ref: AssetCardRef,
): Promise<FolderCandidate | undefined> {
  const card = page.locator(ref.selector).nth(ref.index);
  if (!(await card.isVisible().catch(() => false))) return;

  const cardName = ((await card.innerText().catch(() => "")) || "Canto folder").replace(/\s+/g, " ").trim();
  const folderSkipReason = shouldSkipFolder(cardName);
  if (folderSkipReason) {
    const log: DownloadLog = {
      sourceUrl: page.url(),
      folderName: folderLog.name,
      status: "skipped",
      reason: `${folderSkipReason}: ${cardName}`,
    };
    addToReport(report, folderLog, log);
    console.log(`skipped: ${cardName} (${log.reason})`);
    return;
  }

  const cardUrls = await collectImageUrlsFromCard(page, card);
  for (const url of cardUrls) {
    const log = await downloadAsset(context, url, outputDir, folderLog.name);
    addToReport(report, folderLog, log);
    console.log(`${log.status}: ${log.outputPath ?? url}${log.reason ? ` (${log.reason})` : ""}`);
  }

  const previousUrl = page.url();
  await card.scrollIntoViewIfNeeded().catch(() => undefined);
  await card.click({ timeout: 8_000 }).catch(() => undefined);
  await page.waitForTimeout(1200);

  if (page.url() !== previousUrl && /\/folder\//i.test(page.url())) {
    const child = {
      url: page.url(),
      name: cardName.replace(/^\./, "") || page.url(),
    };
    console.log(`queued child folder: ${child.name}`);
    await page.goBack({ waitUntil: "domcontentloaded", timeout: 10_000 }).catch(() => undefined);
    await page.waitForTimeout(800);
    return child;
  }

  if (clickDownloads) {
    await debugScreenshot(page, folderLog, "download started");
    for (const log of await clickDownloadButtons(page, outputDir, folderLog.name)) {
      addToReport(report, folderLog, log);
      console.log(`${log.status}: ${log.outputPath ?? log.sourceUrl}${log.reason ? ` (${log.reason})` : ""}`);
    }
  }

  const openedUrls = await collectImageUrlsFromPage(page);
  folderLog.imageUrlsFound += openedUrls.length;
  for (const url of openedUrls) {
    const log = await downloadAsset(context, url, outputDir, folderLog.name);
    addToReport(report, folderLog, log);
    console.log(`${log.status}: ${log.outputPath ?? url}${log.reason ? ` (${log.reason})` : ""}`);
  }

  if (page.url() !== previousUrl) {
    await page.goBack({ waitUntil: "domcontentloaded", timeout: 10_000 }).catch(() => undefined);
    await page.waitForTimeout(800);
  } else {
    await page.keyboard.press("Escape").catch(() => undefined);
    await page.waitForTimeout(400);
  }
}

async function processCurrentFolder(
  page: Page,
  context: BrowserContext,
  outputDir: string,
  report: DownloadReport,
  folderName: string,
): Promise<FolderCandidate[]> {
  const folderLog: FolderLog = {
    name: folderName,
    url: page.url(),
    screenshots: [],
    assetCardsFound: 0,
    imageUrlsFound: 0,
    downloaded: 0,
    skipped: 0,
    duplicates: 0,
    failed: 0,
    skippedReasons: {},
  };
  report.folders.push(folderLog);

  console.log(`\nFolder: ${folderLog.name}`);
  await debugScreenshot(page, folderLog, "folder opened");
  await scrollAssetGrid(page, folderLog);

  const cards = await collectAssetCardRefs(page);
  folderLog.assetCardsFound = cards.length;
  console.log(`Asset cards found: ${cards.length}`);

  const pageUrls = await collectImageUrlsFromPage(page);
  folderLog.imageUrlsFound += pageUrls.length;
  console.log(`Image URLs found before opening cards: ${pageUrls.length}`);
  await debugScreenshot(page, folderLog, "assets detected");

  for (const url of pageUrls) {
    const log = await downloadAsset(context, url, outputDir, folderLog.name);
    addToReport(report, folderLog, log);
    console.log(`${log.status}: ${log.outputPath ?? url}${log.reason ? ` (${log.reason})` : ""}`);
  }

  const childFolders: FolderCandidate[] = [];
  for (const ref of cards) {
    const child = await processAssetCard(page, context, outputDir, report, folderLog, ref);
    if (child) childFolders.push(child);
  }

  console.log(
    `Folder summary: ${folderLog.downloaded} downloaded, ${folderLog.duplicates} duplicate, ${folderLog.skipped} skipped, ${folderLog.failed} failed.`,
  );
  return childFolders;
}

async function processFolderQueue(
  page: Page,
  context: BrowserContext,
  outputDir: string,
  report: DownloadReport,
  seedFolders: FolderCandidate[],
  state: CrawlState = { visited: new Set<string>(), foldersProcessed: 0 },
) {
  const queue: FolderCandidate[] = [...seedFolders];

  while (queue.length > 0 && state.foldersProcessed < palaceMediaConfig.maxFoldersPerRun) {
    const folder = queue.shift();
    if (!folder || state.visited.has(folder.url)) continue;
    state.visited.add(folder.url);

    const folderSkipReason = shouldSkipFolder(folder.name);
    if (folderSkipReason) {
      console.log(`Skipping folder: ${folder.name} (${folderSkipReason})`);
      continue;
    }

    console.log(`Opening Canto folder URL: ${folder.url}`);
    await page.goto(folder.url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    state.foldersProcessed += 1;
    const childFolders = await processCurrentFolder(page, context, outputDir, report, folder.name);
    for (const child of childFolders) {
      if (!state.visited.has(child.url)) queue.push(child);
    }
  }

  if (queue.length > 0) {
    console.log(`Stopped at maxFoldersPerRun=${palaceMediaConfig.maxFoldersPerRun}. Increase it in palace-media-config.ts for a deeper sync.`);
  }
}

async function main() {
  const outputDir = resolveFromProject(palaceMediaConfig.outputDir);
  const sessionDir = resolveFromProject(palaceMediaConfig.sessionDir);
  await mkdir(outputDir, { recursive: true });
  await mkdir(sessionDir, { recursive: true });
  await mkdir(resolveFromProject(palaceMediaConfig.debugDir), { recursive: true });

  const report: DownloadReport = {
    startedAt: new Date().toISOString(),
    portalUrl: palaceMediaConfig.portalUrl,
    folderUrls: palaceMediaConfig.folderUrls,
    folders: [],
    downloaded: [],
    skipped: [],
    duplicates: [],
    failed: [],
  };

  const context = await chromium.launchPersistentContext(sessionDir, {
    acceptDownloads: true,
    headless,
    viewport: { width: 1500, height: 1000 },
  });

  try {
    const page = context.pages()[0] ?? (await context.newPage());
    await page.addInitScript("window.__name = (value) => value");
    await page.goto(palaceMediaConfig.portalUrl, { waitUntil: "domcontentloaded" });
    await ensurePageEvaluateHelpers(page);

    const portalLog: FolderLog = {
      name: "portal",
      url: page.url(),
      screenshots: [],
      assetCardsFound: 0,
      imageUrlsFound: 0,
      downloaded: 0,
      skipped: 0,
      duplicates: 0,
      failed: 0,
      skippedReasons: {},
    };
    report.folders.push(portalLog);
    await debugScreenshot(page, portalLog, "portal loaded");

    await askForLoginIfNeeded();
    await page.waitForTimeout(1500);

    const configuredFolders = palaceMediaConfig.folderUrls.map((url) => ({ url, name: url }));
    const discoveredFolders = configuredFolders.length > 0 ? configuredFolders : await discoverFolderUrls(page);
    const folderUrls = discoveredFolders.length > 0 ? discoveredFolders : [{ url: page.url(), name: "Current Canto view" }];
    report.folderUrls = folderUrls.map((folder) => folder.url);
    const crawlState: CrawlState = { visited: new Set<string>(), foldersProcessed: 0 };

    if (folderUrls.length === 1 && folderUrls[0].url === page.url()) {
      const clickableFolders = await discoverClickableFolders(page);
      if (clickableFolders.length > 0) {
        for (const folder of clickableFolders) {
          if (crawlState.foldersProcessed >= palaceMediaConfig.maxFoldersPerRun) {
            console.log(`Stopped at maxFoldersPerRun=${palaceMediaConfig.maxFoldersPerRun}. Increase it in palace-media-config.ts for a deeper sync.`);
            break;
          }

          console.log(`Opening Canto tree folder: ${folder.name}`);
          await page.goto(palaceMediaConfig.portalUrl, { waitUntil: "domcontentloaded" });
          await page.waitForTimeout(900);
          const item = page.locator(folder.selector).nth(folder.index);
          if (await clickIfVisible(item)) {
            await page.waitForTimeout(1500);
            crawlState.foldersProcessed += 1;
            const childFolders = await processCurrentFolder(page, context, outputDir, report, folder.name);
            await processFolderQueue(page, context, outputDir, report, childFolders, crawlState);
          }
        }
      } else {
        await processCurrentFolder(page, context, outputDir, report, folderUrls[0].name);
      }
    } else {
      await processFolderQueue(page, context, outputDir, report, folderUrls, crawlState);
    }
  } finally {
    report.finishedAt = new Date().toISOString();
    await writeReport(report);
    await context.close();
  }

  console.log(`\nReport written to ${palaceMediaConfig.reportPath}`);
  console.log(`Debug screenshots written to ${palaceMediaConfig.debugDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
