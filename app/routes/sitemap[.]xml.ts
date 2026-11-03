import { allResortCollections } from "../data/collections";
import { resorts } from "../data/resorts";
import { journalPosts } from "../lib/property-data";
import { publishedTravelerStories } from "../lib/traveler-stories";

const origin = "https://premierresorttravels.com";
const staticEntries = [
  { path: "/", lastmod: "2026-10-18" },
  { path: "/about", lastmod: "2026-11-03" },
  { path: "/contact", lastmod: "2026-11-03" },
  { path: "/quote", lastmod: "2026-10-18" },
  { path: "/destinations", lastmod: "2026-10-18" },
  { path: "/collections", lastmod: "2026-11-03" },
  { path: "/journal", lastmod: "2026-11-03" },
  { path: "/traveler-stories", lastmod: "2026-07-02" },
];

const journalSourceDates: Record<string, string> = {
  "best-adults-only-all-inclusive-resorts-for-couples": "2026-07-02",
  "best-family-all-inclusive-resorts-for-multigenerational-trips": "2026-07-02",
  "best-luxury-city-hotels-in-italy-for-romantic-itineraries": "2026-07-02",
  "moon-palace-the-grand-vs-moon-palace-cancun": "2026-10-18",
};

function journalLastModified(slug: string, reviewedOn?: string) {
  return reviewedOn ?? journalSourceDates[slug] ?? "2026-07-03";
}

function xmlEscape(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

export function loader() {
  const entries = [
    ...staticEntries,
    ...allResortCollections.map(item => ({ path: `/collections/${item.slug}`, lastmod: item.updatedOn ?? "2026-07-03" })),
    ...resorts.map(item => ({ path: `/properties/${item.slug}`, lastmod: item.updatedOn })),
    ...journalPosts.map(item => ({ path: `/journal/${item.slug}`, lastmod: journalLastModified(item.slug, item.reviewedOn) })),
    ...publishedTravelerStories().map(item => ({ path: `/traveler-stories/${item.slug}`, lastmod: item.updatedOn })),
  ];
  const uniqueEntries = [...new Map(entries.map(entry => [entry.path, entry])).values()];
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    uniqueEntries.map(({ path, lastmod }) => `<url><loc>${xmlEscape(`${origin}${path}`)}</loc><lastmod>${lastmod}</lastmod></url>`).join("\n") + '\n</urlset>';
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
