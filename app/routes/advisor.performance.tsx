import { requireAdvisorAccess } from "../lib/advisor-access";
import type { Route } from "./+types/advisor.performance";

type EventRow = { resort_slug: string; event_type: string; total: number };
type InquiryRow = { notes: string | null; created_at: string };

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdvisorAccess(request, context.cloudflare.env);
  const DB = context.cloudflare.env.DB;
  const days = new URL(request.url).searchParams.get("days") === "7" ? 7 : 30;
  // This table is populated by the public aggregate-only event endpoint.
  await DB.prepare(`CREATE TABLE IF NOT EXISTS conversion_events_daily (
    day TEXT NOT NULL, resort_slug TEXT NOT NULL, event_type TEXT NOT NULL,
    event_count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (day, resort_slug, event_type)
  )`).run();
  const [events, inquiries] = await Promise.all([
    DB.prepare(`SELECT resort_slug, event_type, SUM(event_count) AS total
      FROM conversion_events_daily
      WHERE day >= date('now', ?)
      GROUP BY resort_slug, event_type`)
      .bind(`-${days - 1} days`).all<EventRow>(),
    DB.prepare(`SELECT notes, created_at FROM travel_inquiries
      WHERE date(created_at) >= date('now', ?)`)
      .bind(`-${days - 1} days`).all<InquiryRow>()
  ]);
  const rows = new Map<string, { slug: string; views: number; clicks: number; starts: number; submissions: number }>();
  const get = (slug: string) => {
    if (!rows.has(slug)) rows.set(slug, { slug, views: 0, clicks: 0, starts: 0, submissions: 0 });
    return rows.get(slug)!;
  };
  for (const e of events.results ?? []) {
    const row = get(e.resort_slug);
    if (e.event_type === "resort_view") row.views += e.total;
    if (e.event_type === "quote_click") row.clicks += e.total;
    if (e.event_type === "quote_start") row.starts += e.total;
  }
  for (const inquiry of inquiries.results ?? []) {
    const notes = inquiry.notes ?? "";
    if (!/^Lead origin: Resort detail page$/m.test(notes)) continue;
    const name = notes.match(/^Originally selected resort: (.+)$/m)?.[1]?.trim();
    if (!name) continue;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (slug) get(slug).submissions += 1;
  }
  return { days, rows: [...rows.values()].sort((a,b) => b.views - a.views), since: new Date(Date.now() - (days - 1) * 86400000).toISOString().slice(0,10) };
}

export function meta() {
  return [{ title: "Website Performance | Premier Resort Travel" }, { name: "robots", content: "noindex, nofollow" }];
}

export default function AdvisorPerformance({ loaderData }: Route.ComponentProps) {
  const { rows, days } = loaderData;
  const sum = (key: "views" | "clicks" | "starts" | "submissions") => rows.reduce((n,r) => n + r[key], 0);
  return <main className="page-shell">
    <section className="property-details" style={{ maxWidth: 1100, margin: "3rem auto" }}>
      <p className="eyebrow">Private advisor tools</p>
      <h1>Website Performance</h1>
      <p>Resort conversion activity over the last {days} days. These are event counts, not unique visitors. Submissions include tests and may predate tracking.</p>
      <div className="hero-actions"><a className="button button-secondary" href="/advisor/performance?days=7">7 days</a><a className="button button-secondary" href="/advisor/performance?days=30">30 days</a><a className="button button-secondary" href="/advisor/inquiries">Inquiry inbox</a></div>
      <div className="planning-grid">
        <article className="planning-card"><h2>{sum("views")}</h2><p>Resort page views</p></article>
        <article className="planning-card"><h2>{sum("clicks")}</h2><p>Quote button clicks</p></article>
        <article className="planning-card"><h2>{sum("starts")}</h2><p>Quote form starts</p></article>
        <article className="planning-card"><h2>{sum("submissions")}</h2><p>Resort-attributed submissions</p></article>
      </div>
      <h2>Performance by resort</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", textAlign: "left", borderSpacing: 12 }}>
          <thead><tr><th>Resort</th><th>Views</th><th>Quote clicks</th><th>Form starts</th><th>Submissions</th></tr></thead>
          <tbody>{rows.map(r => <tr key={r.slug}><th scope="row">{r.slug.replace(/-/g, " ")}</th><td>{r.views}</td><td>{r.clicks}</td><td>{r.starts}</td><td>{r.submissions}</td></tr>)}</tbody>
        </table>
      </div>
      {!rows.length && <p>No recorded activity for this period yet.</p>}
      <p><strong>Interpretation:</strong> Counts are aggregate events, not distinct sessions. Because some inquiries were received before tracking launched, do not divide submissions by page views to estimate a conversion rate until a consistent measurement window is established. Form starts are recorded only for resort-origin forms.</p>
    </section>
  </main>;
}
