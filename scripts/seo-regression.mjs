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
const sitemapKeys = sitemapUrls.map(url => url.toString());
if (new Set(sitemapKeys).size !== sitemapKeys.length) fail("sitemap contains duplicate URLs");
if (sitemapUrls.some(url => url.origin !== canonicalOrigin)) fail("sitemap contains a non-canonical hostname");
if (sitemapUrls.some(url => url.pathname.startsWith("/advisor/") || url.pathname.startsWith("/api/"))) fail("sitemap exposes a private route");

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
await assertRedirect("/collections/baglioni-resorts?source=seo-test", "/collections/baglioni?source=seo-test");
await assertRedirect("/collections/le-blanc?source=seo-test", "/collections/le-blanc-spa-resorts?source=seo-test");
await assertRedirect("/trip-types/wedding?source=seo-test", "/collections/destination-weddings?source=seo-test");
await assertRedirect("/resort-collections/palace-resorts/moon-palace-cancun?source=seo-test", "/properties/moon-palace-cancun?source=seo-test");
await assertRedirect("/?popup=start&note=Family%20trip", "/quote?origin=legacy-popup&note=Family+trip");

for (const path of ["/destinations/not-a-real-place", "/properties/not-a-resort/facts", "/resources/travel-tips", "/terms-and-conditions"]) {
  const response = await request(path);
  if (response.status !== 404) fail(`${path} should remain a real 404, received ${response.status}`);
}

if (failures.length) {
  console.error(`\nSEO regression checks failed: ${failures.length}`);
  process.exit(1);
}

console.log(`SEO regression checks passed: ${sitemapUrls.length} sitemap URLs, ${discoveredPages.size} internal links, ${discoveredAssets.size} local assets.`);
