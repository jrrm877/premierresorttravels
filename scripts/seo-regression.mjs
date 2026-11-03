const base = new URL(process.env.TEST_BASE_URL ?? "http://127.0.0.1:8787");
const canonicalOrigin = "https://premierresorttravels.com";
const failures = [];

function fail(message) {
  failures.push(message);
  console.error(`FAIL ${message}`);
}

function decodeHtml(value) {
  return value.replaceAll("&amp;", "&").replaceAll("&#39;", "'").replaceAll("&quot;", '"');
}

function schemaTypes(value, types = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) schemaTypes(item, types);
    return types;
  }
  if (!value || typeof value !== "object") return types;
  const type = value["@type"];
  if (Array.isArray(type)) type.forEach(item => types.add(item));
  else if (typeof type === "string") types.add(type);
  for (const child of Object.values(value)) schemaTypes(child, types);
  return types;
}

function requiredSchemaTypes(pathname) {
  if (pathname === "/") return ["WebSite", "TravelAgency"];
  if (pathname === "/about") return ["TravelAgency"];
  if (pathname === "/contact") return ["ContactPage", "TravelAgency", "ContactPoint", "BreadcrumbList"];
  if (["/privacy-policy", "/accessibility", "/terms-and-conditions"].includes(pathname)) return ["WebPage", "BreadcrumbList"];
  if (pathname === "/destinations") return ["CollectionPage", "ItemList", "BreadcrumbList"];
  if (pathname === "/collections") return ["CollectionPage", "ItemList", "BreadcrumbList"];
  if (pathname.startsWith("/collections/")) return ["CollectionPage", "ItemList", "BreadcrumbList", "FAQPage"];
  if (pathname === "/journal") return ["CollectionPage", "ItemList", "BreadcrumbList"];
  if (pathname.startsWith("/journal/")) return ["BlogPosting", "BreadcrumbList"];
  if (pathname.startsWith("/properties/")) return ["WebPage", "Resort", "BreadcrumbList"];
  if (pathname === "/quote") return ["ContactPage", "Service", "TravelAgency"];
  return [];
}

function localUrl(value, pageUrl) {
  if (!value || value.startsWith("#") || /^(mailto:|tel:|javascript:)/i.test(value)) return null;
  const url = new URL(decodeHtml(value), pageUrl);
  if (url.origin !== base.origin) return null;
  url.hash = "";
  return url;
}

async function request(value) {
  const url = value instanceof URL ? value : new URL(value, base);
  return fetch(url, { redirect: "manual", headers: { "User-Agent": "PremierResortTravel-SEO-Regression" } });
}

async function assertRedirect(path, expectedPath) {
  const response = await request(path);
  if (response.status !== 301) {
    fail(`${path} expected 301, received ${response.status}`);
    return;
  }
  const location = response.headers.get("location");
  if (!location) {
    fail(`${path} has no Location header`);
    return;
  }
  const target = new URL(location, base);
  if (`${target.pathname}${target.search}` !== expectedPath) {
    fail(`${path} redirects to ${target.pathname}${target.search}, expected ${expectedPath}`);
  }
}

async function assertNoRedirectLoop(value) {
  let current = value instanceof URL ? value : new URL(value, base);
  const visited = new Set();
  for (let hop = 0; hop < 8; hop++) {
    const key = current.toString();
    if (visited.has(key)) {
      fail(`redirect loop detected at ${key}`);
      return;
    }
    visited.add(key);
    const response = await request(current);
    if (response.status < 300 || response.status >= 400) return;
    const location = response.headers.get("location");
    if (!location) return;
    current = new URL(location, current);
  }
  fail(`redirect chain exceeded 8 hops from ${value}`);
}

const sitemapResponse = await request("/sitemap.xml");
if (sitemapResponse.status !== 200) fail(`/sitemap.xml returned ${sitemapResponse.status}`);
const sitemapXml = await sitemapResponse.text();
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]));
const sitemapEntries = [...sitemapXml.matchAll(/<url><loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod><\/url>/g)]
  .map(match => ({ url: new URL(match[1]), lastmod: match[2] }));
const sitemapKeys = sitemapUrls.map(url => url.toString());
if (new Set(sitemapKeys).size !== sitemapKeys.length) fail("sitemap contains duplicate URLs");
if (sitemapUrls.some(url => url.origin !== canonicalOrigin)) fail("sitemap contains a non-canonical hostname");
if (sitemapUrls.some(url => url.pathname.startsWith("/advisor/") || url.pathname.startsWith("/api/"))) fail("sitemap exposes a private route");
if (sitemapUrls.some(url => url.pathname === "/guides/le-blanc-cancun-vs-los-cabos")) fail("sitemap contains the legacy Le Blanc comparison URL");
if (sitemapEntries.length !== sitemapUrls.length) fail("every sitemap URL must have one lastmod value");
const today = new Date().toISOString().slice(0, 10);
for (const entry of sitemapEntries) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.lastmod) || Number.isNaN(Date.parse(`${entry.lastmod}T00:00:00Z`))) {
    fail(`${entry.url.pathname} has invalid lastmod ${entry.lastmod}`);
  }
  if (entry.lastmod > today) fail(`${entry.url.pathname} has future lastmod ${entry.lastmod}`);
}
if (new Set(sitemapEntries.map(entry => entry.lastmod)).size < 3) fail("sitemap lastmod values appear to be blanket timestamps");
const reviewedGuide = sitemapEntries.find(entry => entry.url.pathname === "/journal/le-blanc-cancun-vs-le-blanc-los-cabos");
if (reviewedGuide?.lastmod !== "2026-11-03") fail("reviewed Le Blanc guide does not use its real review date");
const legacyResortDate = sitemapEntries.find(entry => entry.url.pathname === "/properties/le-blanc-spa-resort-cancun");
if (legacyResortDate?.lastmod !== "2026-07-02") fail("resort page lastmod was replaced with a blanket current date");

const discoveredPages = new Map();
const discoveredAssets = new Map();
for (const canonicalUrl of sitemapUrls) {
  const local = new URL(`${canonicalUrl.pathname}${canonicalUrl.search}`, base);
  const response = await request(local);
  if (response.status !== 200) {
    fail(`sitemap URL ${canonicalUrl.pathname} returned ${response.status}`);
    continue;
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) continue;
  const html = await response.text();
  const schemaValues = [];
  for (const match of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      schemaValues.push(JSON.parse(match[1]));
    } catch {
      fail(`${canonicalUrl.pathname} contains invalid JSON-LD`);
    }
  }
  const presentSchemaTypes = schemaTypes(schemaValues);
  for (const type of requiredSchemaTypes(canonicalUrl.pathname)) {
    if (!presentSchemaTypes.has(type)) fail(`${canonicalUrl.pathname} is missing ${type} structured data`);
  }
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1]
    ?? html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1];
  if (!canonical) {
    fail(`${canonicalUrl.pathname} is missing a canonical tag`);
  } else {
    const parsed = new URL(decodeHtml(canonical), canonicalOrigin);
    if (parsed.origin !== canonicalOrigin || parsed.pathname !== canonicalUrl.pathname) {
      fail(`${canonicalUrl.pathname} canonical points to ${parsed.toString()}`);
    }
  }
  if (/\?popup=start/i.test(html)) fail(`${canonicalUrl.pathname} contains a crawlable popup URL`);

  for (const match of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)) {
    const url = localUrl(match[1], local);
    if (url) discoveredPages.set(url.toString(), url);
  }
  for (const match of html.matchAll(/<(?:img|source)\b[^>]*\bsrc=["']([^"']+)["']/gi)) {
    const url = localUrl(match[1], local);
    if (url) discoveredAssets.set(url.toString(), url);
  }
}

for (const url of discoveredPages.values()) {
  const response = await request(url);
  if (response.status !== 200) fail(`internal link ${url.pathname}${url.search} returned ${response.status}`);
  await assertNoRedirectLoop(url);
}

for (const url of discoveredAssets.values()) {
  const response = await request(url);
  if (response.status !== 200) fail(`local asset ${url.pathname} returned ${response.status}`);
}

const robotsResponse = await request("/robots.txt");
const robots = await robotsResponse.text();
if (robotsResponse.status !== 200) fail(`/robots.txt returned ${robotsResponse.status}`);
if (!/Disallow:\s*\/advisor\//i.test(robots)) fail("robots.txt does not block /advisor/");
if (!/Disallow:\s*\/api\//i.test(robots)) fail("robots.txt does not intentionally block /api/inquiry");

const advisorResponse = await request("/advisor/photos");
if (![301, 302, 303, 401, 403].includes(advisorResponse.status)) fail(`/advisor/photos is not protected (${advisorResponse.status})`);
const loginResponse = await request("/advisor/login");
if (loginResponse.status === 200) {
  const loginHtml = await loginResponse.text();
  if (!/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(loginHtml)) fail("advisor login is missing noindex");
}

await assertRedirect("/destinations/cancun?source=seo-test", "/destinations?source=seo-test");
await assertRedirect("/properties/moon-palace-jamaica/facts?source=seo-test", "/properties/moon-palace-jamaica?source=seo-test");
await assertRedirect("/guides/le-blanc-cancun-vs-los-cabos?source=seo-test", "/journal/le-blanc-cancun-vs-le-blanc-los-cabos?source=seo-test");
await assertRedirect("/trip-types?source=seo-test", "/collections?source=seo-test");
await assertRedirect("/trip-types/adults-only?source=seo-test", "/collections/adults-only?source=seo-test");
await assertRedirect("/trip-types/family?source=seo-test", "/collections/family-friendly?source=seo-test");
await assertRedirect("/trip-types/europe?source=seo-test", "/collections/european-luxury?source=seo-test");
await assertRedirect("/trip-types/romance?source=seo-test", "/collections/romantic-getaways?source=seo-test");
await assertRedirect("/trip-types/spa-wellness?source=seo-test", "/collections/spa-wellness?source=seo-test");
await assertRedirect("/trip-types/food-drink?source=seo-test", "/journal/best-all-inclusive-resorts-for-food-lovers?source=seo-test");
await assertRedirect("/trip-types/adventure?source=seo-test", "/collections/adventure?source=seo-test");
await assertRedirect("/trip-types/wedding?source=seo-test", "/collections/destination-weddings?source=seo-test");
await assertRedirect("/resources?source=seo-test", "/journal?source=seo-test");
await assertRedirect("/resources/mexico-seaweed-sargassum-guide?source=seo-test", "/journal/mexico-seaweed-sargassum-guide?source=seo-test");
await assertRedirect("/guides/palace-resort-match?source=seo-test", "/collections/palace-resorts?source=seo-test");
await assertRedirect("/guides/destination-wedding-inquiry?source=seo-test", "/collections/destination-weddings?source=seo-test");
await assertRedirect("/collections/le-blanc?source=seo-test", "/collections/le-blanc-spa-resorts?source=seo-test");
await assertRedirect("/collections/first-time-mexico?source=seo-test", "/journal/best-first-all-inclusive-resort-vacation?source=seo-test");
const leBlancComparisonResponse = await request("/journal/le-blanc-cancun-vs-le-blanc-los-cabos");
if (leBlancComparisonResponse.status !== 200) {
  fail(`/journal/le-blanc-cancun-vs-le-blanc-los-cabos returned ${leBlancComparisonResponse.status}`);
} else {
  const leBlancComparisonHtml = await leBlancComparisonResponse.text();
  if (!/Le Blanc Cancun vs Los Cabos: Which Is Better\?/i.test(leBlancComparisonHtml)) fail("Le Blanc comparison is missing its focused search title");
  if (!/\"@type\":\"BlogPosting\"/i.test(leBlancComparisonHtml)) fail("Le Blanc comparison is missing BlogPosting structured data");
}
const priorityJournalPages = [
  ["best-adults-only-all-inclusive-resorts-for-couples", "Best Adults-Only All-Inclusive Resorts for Couples"],
  ["best-family-all-inclusive-resorts-for-multigenerational-trips", "Best All-Inclusive Resorts for Multigenerational Families"],
  ["best-resorts-for-teens-and-tweens-in-mexico", "Best All-Inclusive Resorts for Teens in Mexico"],
  ["moon-palace-the-grand-vs-moon-palace-cancun", "Moon Palace The Grand vs Moon Palace Cancun"],
  ["best-caribbean-family-resorts-with-water-parks", "Best Caribbean Family Resorts With Water Parks"],
  ["best-spa-resorts-for-couples-in-mexico", "Best Spa Resorts in Mexico for Couples"],
];
for (const [slug, expectedTitle] of priorityJournalPages) {
  const response = await request(`/journal/${slug}`);
  if (response.status !== 200) {
    fail(`/journal/${slug} returned ${response.status}`);
    continue;
  }
  const html = decodeHtml(await response.text());
  if (!html.includes(`<title>${expectedTitle} | Premier Resort Travel</title>`)) fail(`/journal/${slug} is missing its focused SEO title`);
  if (!html.includes("Quick Answer")) fail(`/journal/${slug} is missing its quick answer`);
  if (!html.includes("Related resort guides")) fail(`/journal/${slug} is missing related-guide links`);
  if (!html.includes("Written and reviewed by")) fail(`/journal/${slug} is missing its author and reviewer byline`);
  if (!html.includes('"dateModified":"2026-11-03"')) fail(`/journal/${slug} is missing an accurate review date in structured data`);
}
const aboutResponse = await request("/about");
if (aboutResponse.status !== 200) {
  fail(`/about returned ${aboutResponse.status}`);
} else {
  const aboutHtml = decodeHtml(await aboutResponse.text());
  if (!aboutHtml.includes("Experience &amp; Editorial Standards") && !aboutHtml.includes("Experience & Editorial Standards")) fail("about page is missing editorial standards");
  if (!aboutHtml.includes('"@type":"TravelAgency"')) fail("about page is missing TravelAgency structured data");
}
const contactResponse = await request("/contact");
if (contactResponse.status !== 200) {
  fail(`/contact returned ${contactResponse.status}`);
} else {
  const contactHtml = decodeHtml(await contactResponse.text());
  if (!contactHtml.includes("Pleasantville, Iowa")) fail("contact page is missing the verified public business location");
  if (!contactHtml.includes("serving travelers nationwide")) fail("contact page is missing the verified nationwide service area");
  if (!contactHtml.includes('"addressLocality":"Pleasantville"')) fail("contact page schema is missing the verified locality");
  if (contactHtml.includes("P.O. Box") || contactHtml.includes("PO Box")) fail("contact page exposes the non-public P.O. box");
}
for (const [path, heading] of [["/privacy-policy", "Privacy Policy"], ["/accessibility", "Accessibility Statement"], ["/terms-and-conditions", "Terms and Conditions"]]) {
  const response = await request(path);
  if (response.status !== 200) {
    fail(`${path} returned ${response.status}`);
    continue;
  }
  const html = decodeHtml(await response.text());
  if (!html.includes(`<h1>${heading}</h1>`)) fail(`${path} is missing its primary heading`);
  if (!html.includes('<link rel="canonical" href="https://premierresorttravels.com/')) fail(`${path} is missing its canonical URL`);
  if (html.includes("(312) 544-9940") || html.includes("relax@premierresorttravels.com")) fail(`${path} contains stale contact details`);
}
const privacyResponse = await request("/privacy-policy");
if (privacyResponse.status === 200) {
  const privacyHtml = decodeHtml(await privacyResponse.text());
  if (!privacyHtml.includes("Cloudflare D1") || !privacyHtml.includes("Resend")) fail("privacy policy does not describe the site's actual inquiry providers");
  if (!privacyHtml.includes("does not currently include Google Analytics, Meta Pixel")) fail("privacy policy does not accurately disclose the absence of advertising analytics");
}
const quoteResponse = await request("/quote");
if (quoteResponse.status === 200) {
  const quoteHtml = decodeHtml(await quoteResponse.text());
  if (!quoteHtml.includes('href="/privacy-policy"') || !quoteHtml.includes('href="/terms-and-conditions"')) fail("quote form is missing legal policy links");
}
for (const path of ["/", "/about", "/destinations", "/collections", "/journal", "/contact", "/quote"]) {
  const response = await request(path);
  if (response.status !== 200) continue;
  const html = decodeHtml(await response.text());
  if (!html.includes('property="og:image" content="https://premierresorttravels.com/')) fail(`${path} is missing an absolute Open Graph share image`);
  if (!html.includes('name="twitter:card" content="summary_large_image"')) fail(`${path} is missing a large-image social card`);
  if (!html.includes('property="og:site_name" content="Premier Resort Travel"')) fail(`${path} is missing the Open Graph site name`);
}
const destinationWeddingResponse = await request("/collections/destination-weddings");
if (destinationWeddingResponse.status !== 200) {
  fail(`/collections/destination-weddings returned ${destinationWeddingResponse.status}`);
} else {
  const destinationWeddingHtml = decodeHtml(await destinationWeddingResponse.text());
  if (!destinationWeddingHtml.includes("<h1>All-Inclusive Destination Weddings</h1>")) fail("destination wedding collection is missing its focused heading");
  if (!destinationWeddingHtml.includes("Destination wedding resort starting points")) fail("destination wedding collection is missing its resort comparison");
  if (!destinationWeddingHtml.includes('"@type":"FAQPage"')) fail("destination wedding collection is missing FAQ structured data");
  if (destinationWeddingHtml.includes("Baglioni Resort Sardinia")) fail("destination wedding collection includes a non-all-inclusive resort");
}
await assertRedirect("/collections/baglioni-resorts?source=seo-test", "/collections/baglioni?source=seo-test");
await assertRedirect("/?popup=start&note=Family%20trip", "/quote?origin=legacy-popup&note=Family+trip");
await assertRedirect("/traveler-stories", "/journal");
await assertRedirect("/traveler-stories/retired-story", "/journal");

const publicShellResponse = await request("/");
if (publicShellResponse.status === 200) {
  const publicShellHtml = decodeHtml(await publicShellResponse.text());
  if (publicShellHtml.includes('href="/traveler-stories"')) fail("Traveler Stories remains visible in public navigation or homepage content");
}

for (const path of ["/destinations/not-a-real-place", "/properties/not-a-resort/facts", "/trip-types/not-a-real-type", "/resources/not-a-real-resource", "/guides/not-a-real-guide"]) {
  const response = await request(path);
  if (response.status !== 404) fail(`${path} should remain a real 404, received ${response.status}`);
}

if (failures.length) {
  console.error(`\nSEO regression checks failed: ${failures.length}`);
  process.exit(1);
}

console.log(`SEO regression checks passed: ${sitemapUrls.length} sitemap URLs, ${discoveredPages.size} internal links, ${discoveredAssets.size} local assets.`);
