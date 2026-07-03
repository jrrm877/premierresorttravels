import { createHash } from "node:crypto";
import { copyFile, mkdir, readdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { palaceMediaConfig } from "./palace-media-config";

const resorts = [
  "moon-palace-cancun",
  "moon-palace-jamaica",
  "le-blanc-cancun",
  "le-blanc-los-cabos",
  "le-blanc-jamaica",
  "baglioni",
  "palace-resorts",
] as const;

const categories = [
  "hero",
  "rooms",
  "pools",
  "beach",
  "dining",
  "activities",
  "spa",
  "weddings",
  "family",
  "maps",
  "logos",
] as const;

type Resort = (typeof resorts)[number];
type Category = (typeof categories)[number];

type OrganizeLog = {
  sourcePath: string;
  outputPath?: string;
  status: "organized" | "skipped" | "duplicate" | "identical-existing";
  reason?: string;
  hash?: string;
  resort?: Resort;
  category?: Category;
};

const resortPatterns: Array<[Resort, RegExp]> = [
  ["moon-palace-cancun", /moon[-_\s]?palace|the[-_\s]?grand|cancun|nizuc|sunrise/i],
  ["moon-palace-jamaica", /moon[-_\s]?palace[-_\s]?jamaica|jamaica|ocho[-_\s]?rios/i],
  ["le-blanc-cancun", /le[-_\s]?blanc.*cancun|cancun.*le[-_\s]?blanc/i],
  ["le-blanc-los-cabos", /le[-_\s]?blanc.*(los[-_\s]?cabos|cabo)|los[-_\s]?cabos.*le[-_\s]?blanc/i],
  ["le-blanc-jamaica", /le[-_\s]?blanc.*jamaica|jamaica.*le[-_\s]?blanc/i],
  ["baglioni", /baglioni|regina|luna|masseria|maldives|sardinia|venice|roma|rome|milan|puglia/i],
  ["palace-resorts", /palace|cozumel|playacar|beach[-_\s]?palace|sun[-_\s]?palace/i],
];

const categoryPatterns: Array<[Category, RegExp]> = [
  ["logos", /logo|brand|mark|wordmark/i],
  ["maps", /map|site[-_\s]?plan|floor[-_\s]?plan/i],
  ["weddings", /wedding|bride|groom|ceremony|romance/i],
  ["family", /family|kids|children|teen|water[-_\s]?park/i],
  ["spa", /spa|wellness|massage|hydrotherapy|salon/i],
  ["dining", /dining|restaurant|bar|food|drink|culinary|breakfast|dinner/i],
  ["rooms", /room|suite|villa|bedroom|bathroom|guest[-_\s]?room/i],
  ["pools", /pool|swim|cabana/i],
  ["beach", /beach|ocean|sea|sand|shore|coast/i],
  ["activities", /activity|golf|snorkel|dive|excursion|kayak|fitness|entertainment/i],
  ["hero", /hero|exterior|aerial|resort|lobby|arrival/i],
];

function resolveFromProject(relativePath: string) {
  return path.resolve(process.cwd(), relativePath);
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

async function listFiles(directory: string): Promise<string[]> {
  if (!(await fileExists(directory))) return [];

  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
    })
  );

  return files.flat();
}

function allowedImage(filePath: string) {
  const extension = path.extname(filePath).replace(".", "").toLowerCase();
  return palaceMediaConfig.allowedExtensions.includes(extension);
}

function classifyResort(searchText: string): Resort {
  return resortPatterns.find(([, pattern]) => pattern.test(searchText))?.[0] ?? "palace-resorts";
}

function classifyCategory(searchText: string): Category {
  return categoryPatterns.find(([, pattern]) => pattern.test(searchText))?.[0] ?? "hero";
}

function organizedFilename(filePath: string, hash: string) {
  const parsed = path.parse(filePath);
  const extension = parsed.ext.toLowerCase();
  const name = slugify(parsed.name.replace(/[_-]?(copy|final|image|asset)$/i, ""));
  return `${name || "palace-media"}-${hash.slice(0, 8)}${extension}`;
}

async function uniqueDestination(destination: string, hash: string) {
  if (!(await fileExists(destination))) return { path: destination, status: "new" as const };

  const existingHash = hashBuffer(await readFile(destination));
  if (existingHash === hash) return { path: destination, status: "identical" as const };

  const parsed = path.parse(destination);
  return { path: path.join(parsed.dir, `${parsed.name}-${hash.slice(0, 8)}${parsed.ext}`), status: "renamed" as const };
}

async function ensureFolderTree(baseDir: string) {
  await Promise.all(
    resorts.flatMap((resort) => categories.map((category) => mkdir(path.join(baseDir, resort, category), { recursive: true })))
  );
}

async function updateReport(logs: OrganizeLog[]) {
  const reportPath = resolveFromProject(palaceMediaConfig.reportPath);
  let report: Record<string, unknown> = {};

  if (await fileExists(reportPath)) {
    report = JSON.parse(await readFile(reportPath, "utf8"));
  }

  report.organizedAt = new Date().toISOString();
  report.organize = {
    organized: logs.filter((item) => item.status === "organized"),
    skipped: logs.filter((item) => item.status === "skipped"),
    duplicates: logs.filter((item) => item.status === "duplicate"),
    identicalExisting: logs.filter((item) => item.status === "identical-existing"),
  };

  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}

async function buildRegistry(baseDir: string) {
  const registry: Record<Resort, Record<Category, string[]>> = Object.fromEntries(
    resorts.map((resort) => [resort, Object.fromEntries(categories.map((category) => [category, []]))])
  ) as Record<Resort, Record<Category, string[]>>;

  for (const resort of resorts) {
    for (const category of categories) {
      const directory = path.join(baseDir, resort, category);
      const files = (await listFiles(directory)).filter(allowedImage).sort();
      registry[resort][category] = files.map((file) => `/${path.relative(path.join(process.cwd(), "public"), file).replaceAll(path.sep, "/")}`);
    }
  }

  const registryPath = resolveFromProject("src/data/resortImages.ts");
  await mkdir(path.dirname(registryPath), { recursive: true });

  const file = `export type ResortImageCategory = ${categories.map((category) => JSON.stringify(category)).join(" | ")};
export type ResortImageRegistry = Record<string, Record<ResortImageCategory, string[]>>;

export const resortImages = ${JSON.stringify(registry, null, 2)} as const satisfies ResortImageRegistry;
`;

  await writeFile(registryPath, file);
}

async function main() {
  const rawDir = resolveFromProject(palaceMediaConfig.outputDir);
  const organizedDir = resolveFromProject("public/images/resorts");
  await ensureFolderTree(organizedDir);

  const logs: OrganizeLog[] = [];
  const seenHashes = new Map<string, string>();
  const files = (await listFiles(rawDir)).filter(allowedImage);

  for (const filePath of files) {
    const relativeSource = path.relative(process.cwd(), filePath);
    const buffer = await readFile(filePath);
    const hash = hashBuffer(buffer);

    if (seenHashes.has(hash)) {
      await unlink(filePath);
      logs.push({
        sourcePath: relativeSource,
        status: "duplicate",
        reason: `duplicate of ${seenHashes.get(hash)}`,
        hash,
      });
      continue;
    }

    seenHashes.set(hash, relativeSource);

    const searchText = `${relativeSource} ${path.basename(filePath)}`;
    const resort = classifyResort(searchText);
    const category = classifyCategory(searchText);
    const destination = path.join(organizedDir, resort, category, organizedFilename(filePath, hash));
    const finalDestination = await uniqueDestination(destination, hash);

    if (finalDestination.status === "identical") {
      logs.push({
        sourcePath: relativeSource,
        outputPath: path.relative(process.cwd(), finalDestination.path),
        status: "identical-existing",
        reason: "organized image already exists with identical hash",
        hash,
        resort,
        category,
      });
      continue;
    }

    await copyFile(filePath, finalDestination.path);
    logs.push({
      sourcePath: relativeSource,
      outputPath: path.relative(process.cwd(), finalDestination.path),
      status: "organized",
      hash,
      resort,
      category,
    });
  }

  await buildRegistry(organizedDir);
  await updateReport(logs);

  console.log(`Organized ${logs.filter((item) => item.status === "organized").length} image(s).`);
  console.log(`Removed ${logs.filter((item) => item.status === "duplicate").length} duplicate raw file(s).`);
  console.log(`Registry written to src/data/resortImages.ts`);
  console.log(`Report written to ${palaceMediaConfig.reportPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
