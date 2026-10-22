import { useMemo, useState } from "react";
import { Form, useNavigation } from "react-router";
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

const STATUSES = ["New", "Contacted", "Quote Sent", "Follow-Up Needed", "Booked", "Closed"] as const;
type LeadUpdate = { inquiry_id: number; status: string; follow_up_date: string | null; quote_amount: number | null; advisor_notes: string | null };
async function ensureLeadUpdates(DB: { prepare: (query: string) => { run: () => Promise<unknown> } }) {
  await DB.prepare(`CREATE TABLE IF NOT EXISTS advisor_lead_updates (
    inquiry_id INTEGER PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'New',
    follow_up_date TEXT,
    quote_amount REAL,
    advisor_notes TEXT,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
}
export async function action({ request, context }: Route.ActionArgs) {
  await requireAdvisorAccess(request, context.cloudflare.env);
  if (request.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });
  const form = await request.formData();
  const id = Number(form.get("inquiryId"));
  const status = String(form.get("status") ?? "");
  const followUp = String(form.get("followUp") ?? "").trim();
  const quoteRaw = String(form.get("quoteAmount") ?? "").trim();
  const notes = String(form.get("advisorNotes") ?? "").trim();
  if (!Number.isSafeInteger(id) || id < 1 || !STATUSES.includes(status as typeof STATUSES[number]) ||
    (followUp && !/^\d{4}-\d{2}-\d{2}$/.test(followUp)) || notes.length > 10000 ||
    (quoteRaw && (!Number.isFinite(Number(quoteRaw)) || Number(quoteRaw) < 0 || Number(quoteRaw) > 10000000))) {
    return Response.json({ error: "Invalid lead update" }, { status: 400 });
  }
  const { DB } = context.cloudflare.env;
  const exists = await DB.prepare("SELECT id FROM travel_inquiries WHERE id = ?").bind(id).first();
  if (!exists) return Response.json({ error: "Inquiry not found" }, { status: 404 });
  await ensureLeadUpdates(DB);
  await DB.prepare(`INSERT INTO advisor_lead_updates (inquiry_id,status,follow_up_date,quote_amount,advisor_notes,updated_at)
    VALUES (?,?,?,?,?,CURRENT_TIMESTAMP)
    ON CONFLICT(inquiry_id) DO UPDATE SET status=excluded.status,follow_up_date=excluded.follow_up_date,
    quote_amount=excluded.quote_amount,advisor_notes=excluded.advisor_notes,updated_at=CURRENT_TIMESTAMP`)
    .bind(id,status,followUp || null,quoteRaw ? Number(quoteRaw) : null,notes || null).run();
  return Response.json({ success: true });
}
export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdvisorAccess(request, context.cloudflare.env);
  const { DB } = context.cloudflare.env;

  await ensureLeadUpdates(DB);
  const [{ results: inquiries }, { results: stats }, { results: updates }] = await Promise.all([
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
    DB.prepare("SELECT inquiry_id,status,follow_up_date,quote_amount,advisor_notes FROM advisor_lead_updates").all<LeadUpdate>(),
  ]);

  return {
    inquiries: inquiries ?? [],
    updates: updates ?? [],
    stats: stats?.[0] ?? { total_inquiries: 0, unique_travelers: 0 },
  };
}

export function meta(_: Route.MetaArgs) {
  return [{ title: "Advisor Inquiries | Premier Resort Travel" }];
}

export default function AdvisorInquiries({ loaderData }: Route.ComponentProps) {
  const { inquiries, stats, updates } = loaderData;
  const navigation = useNavigation();
  const updateById = new Map(updates.map((update) => [update.inquiry_id, update]));
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
    const cell = (value: unknown) => {
      const text = String(value ?? "");
      const protectedText = /^[=+@\-\t\r]/.test(text) ? "'" + text : text;
      return '"' + protectedText.replace(/"/g, '""') + '"';
    };
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
                <details className="advisor-lead-editor">
                  <summary>Manage lead</summary>
                  <Form method="post" key={inquiry.id} className="advisor-lead-editor-fields">
                    <input type="hidden" name="inquiryId" value={inquiry.id} />
                    <label>Status<select name="status" defaultValue={updateById.get(inquiry.id)?.status ?? "New"}>
                      {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select></label>
                    <label>Follow-up date<input name="followUp" type="date" defaultValue={updateById.get(inquiry.id)?.follow_up_date ?? ""} /></label>
                    <label>Quote amount (USD)<input name="quoteAmount" type="number" min="0" max="10000000" step=".01" defaultValue={updateById.get(inquiry.id)?.quote_amount ?? ""} /></label>
                    <label>Private advisor notes<textarea name="advisorNotes" rows={4} maxLength={10000} defaultValue={updateById.get(inquiry.id)?.advisor_notes ?? ""} /></label>
                    <button className="button button-primary" type="submit" disabled={navigation.state !== "idle"}>Save lead details</button>
                  </Form>
                </details>
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
