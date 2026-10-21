import { useMemo, useState } from "react";
import { requireAdvisorAccess } from "../lib/advisor-access";
import type { Route } from "./+types/advisor.inquiries";

type InquiryRecord = {
  id: number;
  full_name: string;
  email: string;
  destination_interest: string | null;
  trip_style: string | null;
  travel_window: string | null;
  notes: string | null;
  created_at: string;
};

function formatInquiryTime(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function isQuickNoteLead(inquiry: InquiryRecord) {
  return (
    inquiry.trip_style === "about-page-quick-note" ||
    inquiry.destination_interest === "Premier Resort Travel quick note"
  );
}

function leadAttribution(inquiry: InquiryRecord) {
  const notes = inquiry.notes ?? "";
  const origin = notes.match(/^Lead origin: (.+)$/m)?.[1]?.trim();
  const resort = notes.match(/^Originally selected resort: (.+)$/m)?.[1]?.trim();
  return { origin: origin === "Resort detail page" ? "Resort detail page" : origin === "General quote page" ? "General quote page" : "Unattributed", resort: origin === "Resort detail page" ? resort : null };
}

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdvisorAccess(request, context.cloudflare.env);
  const { DB } = context.cloudflare.env;

  const [{ results: inquiries }, { results: stats }] = await Promise.all([
    DB.prepare(
      `SELECT id, full_name, email, destination_interest, trip_style, travel_window, notes, created_at
       FROM travel_inquiries
       ORDER BY created_at DESC, id DESC`
    ).all<InquiryRecord>(),
    DB.prepare(
      `SELECT
         COUNT(*) AS total_inquiries,
         COUNT(DISTINCT email) AS unique_travelers
       FROM travel_inquiries`
    ).all<{ total_inquiries: number; unique_travelers: number }>(),
  ]);

  return {
    inquiries: inquiries ?? [],
    stats: stats?.[0] ?? { total_inquiries: 0, unique_travelers: 0 },
  };
}

export function meta(_: Route.MetaArgs) {
  return [{ title: "Advisor Inquiries | Premier Resort Travel" }];
}

export default function AdvisorInquiries({ loaderData }: Route.ComponentProps) {
  const { inquiries, stats } = loaderData;
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const visibleInquiries = useMemo(() => inquiries.filter((inquiry) => {
    const needle = search.trim().toLowerCase();
    const searchable = [inquiry.full_name, inquiry.email, inquiry.destination_interest, inquiry.trip_style, inquiry.travel_window, inquiry.notes].join(" ").toLowerCase();
    if (needle && !searchable.includes(needle)) return false;
    if (sourceFilter === "quick") return isQuickNoteLead(inquiry);
    if (sourceFilter === "resort") return leadAttribution(inquiry).origin === "Resort detail page";
    if (sourceFilter === "general") return leadAttribution(inquiry).origin === "General quote page";
    return true;
  }), [inquiries, search, sourceFilter]);
  function downloadCsv() {
    const header = ["Inquiry ID","Received","Name","Email","Destination","Trip Style","Travel Window","Notes"];
    const cell = (value: unknown) => '"' + String(value ?? "").replace(/"/g, '""').replace(/^[=+@\\-]/, "'  const { inquiries, stats } = loaderData;") + '"';
    const rows = visibleInquiries.map((inquiry) => [inquiry.id, inquiry.created_at, inquiry.full_name, inquiry.email, inquiry.destination_interest, inquiry.trip_style, inquiry.travel_window, inquiry.notes]);
    const csv = [header, ...rows].map((row) => row.map(cell).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "premier-resort-inquiries.csv";
    link.click();
    URL.revokeObjectURL(url);
  }


  const [groupByTraveler, setGroupByTraveler] = useState(true);
  const groupedInquiries = useMemo(() => {
    const groups = new Map<string, InquiryRecord[]>();
    for (const inquiry of visibleInquiries) {
      const key = inquiry.email.trim().toLowerCase();
      groups.set(key, [...(groups.get(key) ?? []), inquiry]);
    }
    return [...groups.values()].sort((a, b) => new Date(b[0].created_at).getTime() - new Date(a[0].created_at).getTime());
  }, [visibleInquiries]);
  const displayedInquiries = groupByTraveler ? groupedInquiries.map((group) => group[0]) : visibleInquiries;
  const groupedCounts = new Map(groupedInquiries.map((group) => [group[0].email.trim().toLowerCase(), group.length]));

  const sources = inquiries.map(leadAttribution);
  const resortCounts = new Map<string, number>();
  for (const source of sources) if (source.resort) resortCounts.set(source.resort, (resortCounts.get(source.resort) ?? 0) + 1);
  const topResorts = [...resortCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const resortLeads = sources.filter(source => source.origin === "Resort detail page").length;
  const generalLeads = sources.filter(source => source.origin === "General quote page").length;

  return (
    <main className="page-shell">
      <section className="property-details">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Advisor Backend</p>
            <h2>Inquiry inbox</h2>
          </div>
          <div className="hero-actions">
            <a className="button button-secondary" href="/advisor/properties">
              View properties
            </a>
            <a className="button button-secondary" href="/">
              Back to site
            </a>
          </div>
        </div>

        <div className="planning-grid">
          <article className="planning-card">
            <h3>{stats.total_inquiries}</h3>
            <p>Total quote requests received</p>
          </article>
          <article className="planning-card">
            <h3>{stats.unique_travelers}</h3>
            <p>Unique traveler emails captured</p>
          </article>
          <article className="planning-card">
            <h3>{inquiries[0]?.travel_window || "Flexible"}</h3>
            <p>Most recent travel window submitted</p>
          </article>
        </div>
      </section>

      <section className="property-details">
        <div className="section-heading section-heading-stack">
          <div><p className="eyebrow">Lead Sources</p><h2>Which resorts generate inquiries?</h2>
            <p>These are submitted inquiry counts, not visitor conversion rates. Older inquiries may lack attribution.</p>
          </div>
        </div>
        <div className="planning-grid">
          <article className="planning-card"><h3>{resortLeads}</h3><p>From resort pages</p></article>
          <article className="planning-card"><h3>{generalLeads}</h3><p>From general quote page</p></article>
          <article className="planning-card"><h3>{sources.length - resortLeads - generalLeads}</h3><p>Unattributed or older leads</p></article>
        </div>
        <article className="planning-card" style={{ marginTop: 20 }}>
          <h3>Resorts generating leads</h3>
          {topResorts.length ? <ol>{topResorts.map(([resort, count]) => <li key={resort}>{resort}: {count} {count === 1 ? "inquiry" : "inquiries"}</li>)}</ol> : <p>No resort-attributed inquiries yet.</p>}
        </article>
      </section>

      <section className="related-properties">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Live Submissions</p>
            <h2>Recent traveler inquiries</h2>
          </div>
        </div>

        <div className="advisor-lead-controls">
          <label>Search inquiries
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, email, resort, notes…" />
          </label>
          <label>Source
            <select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}>
              <option value="all">All inquiries</option>
              <option value="resort">Resort pages</option>
              <option value="general">General quote form</option>
              <option value="quick">Quick notes</option>
            </select>
          </label>
          <label className="advisor-group-toggle"><input type="checkbox" checked={groupByTraveler} onChange={(event) => setGroupByTraveler(event.target.checked)} /> Group by traveler</label>
          <button type="button" className="button button-secondary" onClick={downloadCsv} disabled={!visibleInquiries.length}>Export {visibleInquiries.length} inquiries (CSV)</button>
        </div>
        <p className="results-summary" aria-live="polite">Showing {groupByTraveler ? groupedInquiries.length + " travelers" : visibleInquiries.length + " inquiries"} across {visibleInquiries.length} matching submissions ({inquiries.length} total). Stored securely in the website database.</p>
        <div className="inquiry-list">
          {visibleInquiries.length === 0 ? (
            <article className="planning-card">
              <h3>No inquiries yet</h3>
              <p>Once travelers use the quote form, submissions will appear here.</p>
            </article>
          ) : (
            displayedInquiries.map((inquiry) => (
              <article key={inquiry.id} className="inquiry-card">
                <div className="inquiry-card-top">
                  <div>
                    <h3>{inquiry.full_name}</h3>
                    {groupByTraveler && (groupedCounts.get(inquiry.email.trim().toLowerCase()) ?? 0) > 1 ? <p className="results-summary">{groupedCounts.get(inquiry.email.trim().toLowerCase())} submissions from this traveler</p> : null}
                    <p className="results-summary">{inquiry.email}</p>
                  </div>
                  <span className="tier-pill">{formatInquiryTime(inquiry.created_at)}</span>
                </div>
                <div className="property-pill-row">
                  {isQuickNoteLead(inquiry) ? <span className="feature-badge">Quick note</span> : null}
                  <span className="tier-pill">{leadAttribution(inquiry).origin}</span>
                  {inquiry.destination_interest ? (
                    <span className="feature-badge">{inquiry.destination_interest}</span>
                  ) : null}
                  {inquiry.trip_style ? <span className="tier-pill">{inquiry.trip_style}</span> : null}
                  {inquiry.travel_window ? (
                    <span className="tier-pill">{inquiry.travel_window}</span>
                  ) : null}
                </div>
                <button type="button" className="advisor-lead-details-toggle" aria-expanded={expandedIds.includes(inquiry.id)} onClick={() => setExpandedIds((ids) => ids.includes(inquiry.id) ? ids.filter((id) => id !== inquiry.id) : [...ids, inquiry.id])}>{expandedIds.includes(inquiry.id) ? "Hide submitted details" : "View submitted details"}</button>
                {expandedIds.includes(inquiry.id) ? <pre className="advisor-lead-notes">{inquiry.notes || "No additional notes were provided."}</pre> : null}
                {groupByTraveler && (groupedCounts.get(inquiry.email.trim().toLowerCase()) ?? 0) > 1 && expandedIds.includes(inquiry.id) ? (
                  <div className="advisor-traveler-history">
                    <strong>Earlier requests from this traveler</strong>
                    <ul>{(groupedInquiries.find((group) => group[0].email.trim().toLowerCase() === inquiry.email.trim().toLowerCase()) ?? []).slice(1).map((older) => (
                      <li key={older.id}><strong>#{older.id}</strong> · {formatInquiryTime(older.created_at)} · {older.destination_interest || "Destination undecided"} · {older.trip_style || "Style undecided"}
                        <pre className="advisor-lead-notes">{older.notes || "No additional notes"}</pre>
                      </li>
                    ))}</ul>
                  </div>
                ) : null}
                <div className="card-actions card-actions-inline">
                  <a className="button button-secondary" href={`mailto:${encodeURIComponent(inquiry.email)}`}>
                    Reply by email
                  </a>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
