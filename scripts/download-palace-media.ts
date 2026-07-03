import { createHash } from "node:crypto";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";
import { chromium } from "playwright";

import { palaceMediaConfig } from "./palace-media-config";

type DownloadLog = {
  sourceUrl: string;
  outputPath?: string;
  status: "downloaded" | "skipped" | "duplicate" | "failed";
  reason?: string;
  hash?: string;
};

type DownloadReport = {
  startedAt: string;
  finishedAt?: string;
  portalUrl: string;
  folderUrls: string[];
  downloaded: DownloadLog[];
  skipped: DownloadLog[];
  duplicates: DownloadLog[];
  failed: DownloadLog[];
};

const args = new Set(process.argv.slice(2));
const waitForLogin = args.has("--login") || args.has("--wait-for-login");
const clickDownloads = args.has("--click-downloads");
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
    const ext = path.extname(parsed.pathname).replace(".", "").toLowerCase();
    return ext;
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

function shouldSkipUrl(url: string) {
  const lower = url.toLowerCase();
  const ext = normalizeExtension(extensionFromUrl(url));

  if (!palaceMediaConfig.includeLogos && lower.includes("logo")) {
    return "logos are skipped unless includeLogos is true";
  }

  if (!palaceMediaConfig.includeVideos && /\.(mp4|mov|avi|webm)(\?|$)/i.test(lower)) {
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

async function collectAssetUrls(page: any) {
  const urls = await page.evaluate(() => {
    const values = new Set<string>();

    document.querySelectorAll("img, source, a").forEach((element) => {
      ["src", "srcset", "href", "data-src", "data-original"].forEach((attribute) => {
        const value = element.getAttribute(attribute);
        if (!value) return;

        value.split(",").forEach((item) => {
          const candidate = item.trim().split(/\s+/)[0];
          if (candidate) values.add(new URL(candidate, window.location.href).href);
        });
      });
    });

    return Array.from(values);
  });

  return urls.filter((url: string) => isLikelyAssetUrl(url));
}

async function scrollAndCollect(page: any) {
  const allUrls = new Set<string>();
  let previousHeight = 0;

  for (let pass = 0; pass < 8; pass += 1) {
    for (const url of await collectAssetUrls(page)) {
      allUrls.add(url);
    }

    const currentHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    if (currentHeight === previousHeight && pass > 1) break;
    previousHeight = currentHeight;

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(900);
  }

  return Array.from(allUrls);
}

async function downloadAsset(context: any, url: string, outputDir: string): Promise<DownloadLog> {
  const skipReason = shouldSkipUrl(url);
  if (skipReason) {
    return { sourceUrl: url, status: "skipped", reason: skipReason };
  }

  try {
    const response = await context.request.get(url, { timeout: 45_000 });
    if (!response.ok()) {
      return { sourceUrl: url, status: "failed", reason: `HTTP ${response.status()}` };
    }

    const contentType = response.headers()["content-type"] ?? "";
    if (!contentType.startsWith("image/")) {
      return { sourceUrl: url, status: "skipped", reason: `not an image response (${contentType || "unknown content type"})` };
    }

    const extension = normalizeExtension(extensionFromContentType(contentType) || extensionFromUrl(url) || "jpg");
    if (!palaceMediaConfig.allowedExtensions.includes(extension)) {
      return { sourceUrl: url, status: "skipped", reason: `.${extension} is not allowed` };
    }

    const body = Buffer.from(await response.body());
    const hash = hashBuffer(body);
    const initialPath = path.join(outputDir, filenameFromUrl(url, extension));
    const finalPath = await uniquePathFor(initialPath, hash);

    if ((await fileExists(finalPath)) && hashBuffer(await readFile(finalPath)) === hash) {
      return { sourceUrl: url, outputPath: path.relative(process.cwd(), finalPath), status: "duplicate", hash };
    }

    await writeFile(finalPath, body);
    return { sourceUrl: url, outputPath: path.relative(process.cwd(), finalPath), status: "downloaded", hash };
  } catch (error) {
    return { sourceUrl: url, status: "failed", reason: error instanceof Error ? error.message : String(error) };
  }
}

async function clickDownloadButtons(page: any, outputDir: string, report: DownloadReport) {
  for (const selector of palaceMediaConfig.downloadButtonSelectors) {
    const buttons = page.locator(selector);
    const count = await buttons.count().catch(() => 0);

    for (let index = 0; index < count; index += 1) {
      const button = buttons.nth(index);
      if (!(await button.isVisible().catch(() => false))) continue;

      try {
        const [download] = await Promise.all([
          page.waitForEvent("download", { timeout: 20_000 }),
          button.click(),
        ]);
        const suggestedName = safeDownloadedFilename(download.suggestedFilename());
        const suggestedExtension = normalizeExtension(path.extname(suggestedName));
        const skipReason = shouldSkipUrl(suggestedName);

        if (skipReason || !palaceMediaConfig.allowedExtensions.includes(suggestedExtension)) {
          report.skipped.push({
            sourceUrl: page.url(),
            status: "skipped",
            reason: skipReason || `.${suggestedExtension} is not allowed`,
          });
          continue;
        }

        const tempPath = path.join(outputDir, suggestedName);
        await download.saveAs(tempPath);

        const buffer = await readFile(tempPath);
        const hash = hashBuffer(buffer);
        const finalPath = await uniquePathFor(tempPath, hash);
        if (finalPath !== tempPath) await rename(tempPath, finalPath);

        report.downloaded.push({
          sourceUrl: page.url(),
          outputPath: path.relative(process.cwd(), finalPath),
          status: "downloaded",
          hash,
        });
      } catch (error) {
        report.failed.push({
          sourceUrl: page.url(),
          status: "failed",
          reason: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }
}

async function askForLoginIfNeeded() {
  if (!waitForLogin) return;
  const readline = createInterface({ input, output });
  await readline.question("Log in or navigate to the desired Canto folder in the opened browser, then press Enter here to continue...");
  readline.close();
}

async function writeReport(report: DownloadReport) {
  const reportPath = resolveFromProject(palaceMediaConfig.reportPath);
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}

async function main() {
  const outputDir = resolveFromProject(palaceMediaConfig.outputDir);
  const sessionDir = resolveFromProject(palaceMediaConfig.sessionDir);
  await mkdir(outputDir, { recursive: true });
  await mkdir(sessionDir, { recursive: true });

  const report: DownloadReport = {
    startedAt: new Date().toISOString(),
    portalUrl: palaceMediaConfig.portalUrl,
    folderUrls: palaceMediaConfig.folderUrls,
    downloaded: [],
    skipped: [],
    duplicates: [],
    failed: [],
  };

  const context = await chromium.launchPersistentContext(sessionDir, {
    acceptDownloads: true,
    headless,
    viewport: { width: 1440, height: 1000 },
  });

  try {
    const page = context.pages()[0] ?? (await context.newPage());
    await page.goto(palaceMediaConfig.portalUrl, { waitUntil: "domcontentloaded" });
    await askForLoginIfNeeded();

    const folderUrls = palaceMediaConfig.folderUrls.length > 0 ? palaceMediaConfig.folderUrls : [page.url()];

    for (const folderUrl of folderUrls) {
      console.log(`Opening Canto folder: ${folderUrl}`);
      await page.goto(folderUrl, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1500);

      if (clickDownloads) {
        await clickDownloadButtons(page, outputDir, report);
      }

      const urls = await scrollAndCollect(page);
      console.log(`Found ${urls.length} candidate image URLs.`);

      for (const url of urls) {
        const log = await downloadAsset(context, url, outputDir);
        if (log.status === "downloaded") report.downloaded.push(log);
        if (log.status === "skipped") report.skipped.push(log);
        if (log.status === "duplicate") report.duplicates.push(log);
        if (log.status === "failed") report.failed.push(log);
        console.log(`${log.status}: ${log.outputPath ?? url}${log.reason ? ` (${log.reason})` : ""}`);
      }
    }
  } finally {
    report.finishedAt = new Date().toISOString();
    await writeReport(report);
    await context.close();
  }

  console.log(`Report written to ${palaceMediaConfig.reportPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
