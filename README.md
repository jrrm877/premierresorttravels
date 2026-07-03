# Premier Resort Travel

Official website for Premier Resort Travel featuring luxury all-inclusive resorts, destination guides, travel journals, traveler stories, and personalized vacation planning.

## What is included

- React Router framework-mode structure with SSR enabled
- Vite build setup for Cloudflare Workers
- `wrangler.jsonc` with a `DB` D1 binding placeholder
- Resort, collection, destination, journal, and traveler story pages
- Lead capture form with D1 inquiry storage
- Starter `api/search` loader route
- `app/schema.sql` for destinations, user preferences, inquiries, and search history
- `app/seed.sql` with luxury destination records for local testing

## Finish setup locally

1. Install dependencies:
   `npm install`
2. Create the D1 database:
   `npx wrangler d1 create luxury-travel-db`
3. Replace `REPLACE_WITH_YOUR_D1_DATABASE_ID` in `wrangler.jsonc` with the returned database ID.
4. Apply the schema locally:
   `npx wrangler d1 execute luxury-travel-db --local --file=./app/schema.sql`
5. Load starter destination data:
   `npx wrangler d1 execute luxury-travel-db --local --file=./app/seed.sql`
6. Start the app:
   `npm run dev`

## Cloudflare deployment

Use these Cloudflare deployment settings:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Path: `/`
- Non-production branch deploy command: `npx wrangler deploy`

## Palace/Canto media sync

The project includes local tooling for downloading approved Palace/Canto media, organizing it for the website, and generating an image registry.

### Configure folders

Edit `scripts/palace-media-config.ts` and add the Canto folder URLs you want to sync to `folderUrls`.

If Playwright reports that Chromium is missing on first use, install the browser once:

`npx playwright install chromium`

Raw downloads go to:

`public/images/palace-raw/`

Organized images go to:

`public/images/resorts/`

The generated registry is written to:

`src/data/resortImages.ts`

### Download approved media

Run:

`npm run download:palace`

If Canto requires login, run:

`npm run download:palace -- --login`

A browser window will open. Log in manually, navigate if needed, then press Enter in Terminal. The session is saved in `.cache/palace-canto-profile` so you should not need to log in every time.

To also attempt clicking visible Canto download buttons one by one, run:

`npm run download:palace -- --click-downloads`

### Organize downloaded media

Run:

`npm run organize:palace`

This scans `public/images/palace-raw/`, removes raw duplicates by file hash, renames files using lowercase hyphenated names, organizes images by resort and category, and regenerates `src/data/resortImages.ts`.

### Download and organize together

Run:

`npm run sync:palace`

### Safety notes

- Raw downloads and the sync report are ignored by Git.
- Organized images are never overwritten unless the existing file is identical.
- Downloaded, skipped, duplicate, and failed files are logged in `reports/palace-media-download-report.json`.
- PDFs, documents, videos, SVGs, and logos are skipped by default unless enabled in `scripts/palace-media-config.ts`.

## Inquiry delivery setup

The site saves inquiries to D1 and can also notify you in real time through email or a webhook.

### Option 1: Email notifications with Resend

Set these Cloudflare Worker secrets:

`npx wrangler secret put RESEND_API_KEY`

`npx wrangler secret put INQUIRY_NOTIFY_FROM`

`npx wrangler secret put INQUIRY_NOTIFY_TO`

Recommended values:

- `INQUIRY_NOTIFY_FROM`: something like `Premier Resort Travel <inquiries@yourdomain.com>`
- `INQUIRY_NOTIFY_TO`: the inbox where you want new leads delivered

### Option 2: Send inquiries to Zapier, Make, or another CRM webhook

Set these secrets if you want to push each inquiry into an automation:

`npx wrangler secret put INQUIRY_WEBHOOK_URL`

Optional:

`npx wrangler secret put INQUIRY_WEBHOOK_BEARER_TOKEN`

`npx wrangler secret put INQUIRY_WEBHOOK_SECRET`

The webhook receives JSON with:

- `inquiryId`
- `source`
- `fullName`
- `email`
- `destinationInterest`
- `tripStyle`
- `travelWindow`
- `notes`
- `submittedAt`
- `siteBaseUrl`

### Optional site URL

If you want the webhook payload to include your production site URL, add:

`npx wrangler secret put SITE_BASE_URL`

### Delivery behavior

- Inquiries are always saved to D1 first.
- Notification delivery runs after the save.
- If email or webhook delivery fails, the lead is still preserved in the database and visible in the advisor inquiries view.
