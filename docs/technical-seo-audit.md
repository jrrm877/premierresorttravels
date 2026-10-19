# Technical SEO repair audit

## Broken and legacy URL decisions

| URL | Before | Resolution | Reason |
| --- | --- | --- | --- |
| `/destinations/cancun` | 404 | 301 to `/destinations` | The destinations page contains the maintained Cancun discovery experience; no separate Cancun page exists. Query parameters are preserved. |
| `/properties/moon-palace-jamaica/facts` | 404 | 301 to `/properties/moon-palace-jamaica` | The resort page is the maintained replacement for the retired facts subpage. The same rule applies only to valid property slugs. |
| `/terms-and-conditions` | 404 | Remains 404 | There is no approved terms document or genuinely equivalent page. A placeholder or homepage redirect would be misleading. Mislabelled footer links to the journal were removed. |
| `/journal/moon-palace-the-grand-cancun-family-guide` | 200 | Keep | This is a current journal article and remains in the sitemap. |
| `/journal/le-blanc-cancun-vs-le-blanc-los-cabos` | 200 | Keep as canonical | This URL contains the maintained comparison article. |
| `/guides/le-blanc-cancun-vs-los-cabos` | 301 to the journal article | Keep | The redirect is relevant, direct, permanent, and preserves query parameters. Reversing it would create the wrong canonical direction. |
| `/traveler-stories` | 200 | Keep and add canonical | The index and its published story detail pages are valid public content. Story detail pages are now included in the sitemap. |
| `/?popup=start&note=…` | 200 duplicate homepage URL | 301 to `/quote?origin=legacy-popup&note=…` | The quote flow is the genuine replacement. Internal links now point directly to `/quote`, while note/name/email attribution remains prefilled. |
| `/collections/baglioni-resorts` and other collection aliases | 200 with canonical tag | 301 to canonical collection slug | Removes duplicate crawlable collection pages and avoids relying on canonical consolidation for internally generated aliases. |
| HTTP and `www` URLs | 200 duplicates | 301 to HTTPS non-`www` | Establishes one protocol and hostname while preserving path and query parameters. |

Unknown destination slugs, unknown property facts URLs, and unrelated missing content continue to return 404.

## Internal discovery and sitemap changes

- Added all canonical brand collections to the sitemap, including Palace Resorts, Moon Palace, Le Blanc, and Baglioni.
- Added all published traveler-story detail pages to the sitemap.
- Added direct, descriptive destination-page links to Moon Palace The Grand Cancun, Moon Palace Cancun, Le Blanc Cancun, Le Blanc Los Cabos, and Moon Palace Jamaica.
- Replaced internal collection-alias links with their canonical collection URLs.
- Replaced crawlable popup query links with direct quote links that preserve inquiry context.
- Added canonical tags to the homepage, About, Destinations, Collections, Journal index, Traveler Stories index, and traveler-story detail pages.
- Kept `/api/inquiry` and all `/advisor/` routes blocked by robots; advisor pages remain authenticated and `noindex`.

## Automated regression coverage

`npm run test:seo` checks a running Worker for:

- every sitemap URL returning HTTP 200 without a redirect;
- missing or incorrect canonical tags;
- broken internal links and local image references;
- redirect loops and expected legacy redirect targets;
- query-parameter preservation;
- popup URLs leaking into rendered links;
- accidental sitemap exposure or indexing of advisor routes;
- the intentional `/api/` robots exclusion;
- genuine 404 behavior for unrelated missing content.

## Validation record

Before repair, production returned 404 for the Cancun destination and Moon Palace Jamaica facts URLs, served HTTP and `www` as duplicate 200 pages, and exposed homepage popup query links internally. The two specified journal URLs and Traveler Stories were already valid HTTP 200 pages.

The pull request validation runs the locked install, TypeScript checks, production build, Worker runtime smoke test, and the new SEO regression suite. Production results are recorded in the pull request after deployment.

## Manual Google Search Console follow-up

After production deployment:

1. Resubmit `https://premierresorttravels.com/sitemap.xml`.
2. Use URL Inspection on the five priority resort pages and request indexing where Google has not recently crawled them.
3. Validate the affected 404 issue after Google observes the new redirects.
4. Allow existing alternate-canonical reports to age out; do not request removal for legitimate parameter consolidation.
5. Monitor the Page Indexing and Crawl Stats reports for old popup URLs and collection aliases. No bulk removal is required because they now redirect to relevant canonical pages.
