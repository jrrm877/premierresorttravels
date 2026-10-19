declare global {
  interface Env {
    DB: D1Database;
    RESORT_PHOTOS: R2Bucket;
    INQUIRY_NOTIFY_FROM?: string;
    INQUIRY_NOTIFY_TO?: string;
    INQUIRY_WEBHOOK_BEARER_TOKEN?: string;
    INQUIRY_WEBHOOK_SECRET?: string;
    INQUIRY_WEBHOOK_URL?: string;
    RESEND_API_KEY?: string;
    SITE_BASE_URL?: string;
  }
}

declare module "react-router" {
  interface AppLoadContext {
    cloudflare: {
      env: Env;
    };
  }
}

export {};
