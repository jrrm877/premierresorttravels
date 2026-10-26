import type { Route } from "./+types/api.conversion-event";

const allowedEvents = new Set(["resort_view", "quote_click", "quote_start"]);

export async function action({ request, context }: Route.ActionArgs) {
  if (request.method !== "POST") return new Response(null, { status: 405 });
  const origin = request.headers.get("Origin");
  if (origin !== new URL(request.url).origin) return new Response(null, { status: 403 });
  if (Number(request.headers.get("Content-Length") || 0) > 512) return new Response(null, { status: 413 });
  let input: { event?: unknown; resort?: unknown };
  try { input = await request.json(); } catch { return new Response(null, { status: 400 }); }
  const event = input.event;
  const resort = input.resort;
  if (typeof event !== "string" || !allowedEvents.has(event) ||
      typeof resort !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(resort) || resort.length > 100) {
    return new Response(null, { status: 400 });
  }
  try {
    const db = context.cloudflare.env.DB;
    await db.prepare(`CREATE TABLE IF NOT EXISTS conversion_events_daily (
      day TEXT NOT NULL, resort_slug TEXT NOT NULL, event_type TEXT NOT NULL,
      event_count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (day, resort_slug, event_type)
    )`).run();
    await db.prepare(`INSERT INTO conversion_events_daily(day,resort_slug,event_type,event_count)
      VALUES (date('now'),?,?,1)
      ON CONFLICT(day,resort_slug,event_type) DO UPDATE SET event_count=event_count+1`)
      .bind(resort,event).run();
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch {
    return new Response(null, { status: 503 });
  }
}
