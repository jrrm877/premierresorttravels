import { allResortCollections } from "../data/collections";
import { resorts } from "../data/resorts";
import { journalPosts } from "../lib/property-data";
import { publishedTravelerStories } from "../lib/traveler-stories";

const origin = "https://premierresorttravels.com";
const staticPaths = ["/", "/about", "/quote", "/destinations", "/collections", "/journal", "/traveler-stories"];

export function loader() {
  const paths = [
    ...staticPaths,
    ...allResortCollections.map(item => `/collections/${item.slug}`),
    ...resorts.map(item => `/properties/${item.slug}`),
    ...journalPosts.map(item => `/journal/${item.slug}`),
    ...publishedTravelerStories().map(item => `/traveler-stories/${item.slug}`),
  ];
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    [...new Set(paths)].map(path => `<url><loc>${origin}${path}</loc></url>`).join("\n") + '\n</urlset>';
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
