export type PalaceMediaConfig = {
  portalUrl: string;
  folderUrls: string[];
  outputDir: string;
  reportPath: string;
  sessionDir: string;
  allowedExtensions: string[];
  skippedExtensions: string[];
  includeLogos: boolean;
  includeVideos: boolean;
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
  sessionDir: ".cache/palace-canto-profile",
  allowedExtensions: ["jpg", "jpeg", "png", "webp"],
  skippedExtensions: ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "mp4", "mov", "avi", "webm", "svg"],
  includeLogos: false,
  includeVideos: false,
  downloadButtonSelectors: [
    '[aria-label*="Download" i]',
    'button:has-text("Download")',
    'a:has-text("Download")',
  ],
  assetUrlPatterns: [
    "/binary/image/",
    "/direct/image/",
    "/download/",
  ],
};
