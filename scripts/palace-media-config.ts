export type PalaceMediaConfig = {
  portalUrl: string;
  folderUrls: string[];
  outputDir: string;
  reportPath: string;
  debugDir: string;
  sessionDir: string;
  allowedExtensions: string[];
  skippedExtensions: string[];
  includeLogos: boolean;
  includeVideos: boolean;
  maxFolderDepth: number;
  maxFoldersPerRun: number;
  maxGridScrollPasses: number;
  folderTreeSelectors: string[];
  assetGridSelectors: string[];
  assetCardSelectors: string[];
  downloadButtonSelectors: string[];
  assetUrlPatterns: string[];
};

export const palaceMediaConfig: PalaceMediaConfig = {
  portalUrl: "https://thepalacecompany.canto.com/v/PalaceProAgents/",
  folderUrls: [
    // Add Canto folder URLs here when you are ready to sync specific folders.
    // Example: "https://thepalacecompany.canto.com/v/PalaceProAgents/folder/...",
  ],
  outputDir: "public/images/palace-raw",
  reportPath: "reports/palace-media-download-report.json",
  debugDir: "reports/debug",
  sessionDir: ".cache/palace-canto-profile",
  allowedExtensions: ["jpg", "jpeg", "png", "webp"],
  skippedExtensions: ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "mp4", "mov", "avi", "webm", "svg"],
  includeLogos: false,
  includeVideos: false,
  maxFolderDepth: 5,
  maxFoldersPerRun: 12,
  maxGridScrollPasses: 24,
  folderTreeSelectors: [
    '[role="tree"]',
    '[aria-label*="Library" i]',
    '[class*="folder" i]',
    '[class*="sidebar" i]',
    '[class*="navigation" i]',
  ],
  assetGridSelectors: [
    '[role="grid"]',
    '[class*="asset" i][class*="grid" i]',
    '[class*="thumbnail" i]',
    '[class*="masonry" i]',
    "main",
  ],
  assetCardSelectors: [
    ".thumbnail-list li.darg-selectable",
    ".thumbnail-list li",
    ".masonry li.darg-selectable",
    ".masonry li",
    ".thumb",
    '[role="gridcell"]',
    '[data-testid*="asset" i]',
    '[class*="asset-card" i]',
    '[class*="thumbnail" i]',
    '[class*="item" i]:has(img)',
    "figure:has(img)",
  ],
  downloadButtonSelectors: [
    '[aria-label*="Download" i]',
    '[title*="Download" i]',
    'button:has-text("Download")',
    'a:has-text("Download")',
    '[role="button"]:has-text("Download")',
    '[data-testid*="download" i]',
  ],
  assetUrlPatterns: [
    "/binary/image/",
    "/direct/image/",
    "/download/",
    "/preview/",
    "/image/",
    "canto.com",
  ],
};
