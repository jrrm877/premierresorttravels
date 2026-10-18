export function loader() {
  return new Response("User-agent: *\nAllow: /\nDisallow: /advisor/\nDisallow: /api/\nSitemap: https://premierresorttravels.com/sitemap.xml\n", { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
