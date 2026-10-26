import { useMemo, useState } from "react";
import { Form, useFetcher, useNavigation } from "react-router";
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
  return { origin: origin || "Unattributed", resort: origin === "Resort detail page" ? resort : null };
}

const STATUSES = ["Lead", "Needs Reply", "Quote Sent", "Negotiations", "Booked Trip", "Past Client", "Closed / Not Booking"] as const;
const LEGACY_STATUS: Record<string, string> = { New: "Lead", Contacted: "Needs Reply", "Follow-Up Needed": "Needs Reply", Booked: "Booked Trip", Closed: "Closed / Not Booking" };
const LEAD_HEALTH = ["Unqualified", "Warm", "Hot", "Not Interested"] as const;
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
type LeadVisibility = { inquiry_id: number; visibility: string };
async function ensureLeadVisibility(DB: { prepare: (query: string) => { run: () => Promise<unknown> } }) {
  await DB.prepare(`CREATE TABLE IF NOT EXISTS advisor_lead_visibility (
    inquiry_id INTEGER PRIMARY KEY,
    visibility TEXT NOT NULL DEFAULT 'active',
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
}
export async function action({ request, context }: Route.ActionArgs) {
  await requireAdvisorAccess(request, context.cloudflare.env);
  if (request.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });
  const form = await request.formData();
  const id = Number(form.get("inquiryId"));
  const testAction = String(form.get("testAction") ?? "");
  if (testAction) {
    if (!Number.isSafeInteger(id) || id < 1 || !["mark", "unmark"].includes(testAction))
      return Response.json({ error: "Invalid test classification" }, { status: 400 });
    const { DB } = context.cloudflare.env;
    const exists = await DB.prepare("SELECT id FROM travel_inquiries WHERE id = ?").bind(id).first();
    if (!exists) return Response.json({ error: "Inquiry not found" }, { status: 404 });
    await DB.prepare(`CREATE TABLE IF NOT EXISTS advisor_inquiry_tests (
      inquiry_id INTEGER PRIMARY KEY, is_test INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`).run();
    await DB.prepare(`INSERT INTO advisor_inquiry_tests(inquiry_id,is_test,updated_at)
      VALUES (?,?,CURRENT_TIMESTAMP)
      ON CONFLICT(inquiry_id) DO UPDATE SET is_test=excluded.is_test,updated_at=CURRENT_TIMESTAMP`)
      .bind(id, testAction === "mark" ? 1 : 0).run();
    return Response.json({ success: true, isTest: testAction === "mark" });
  }
  const visibilityAction = String(form.get("visibilityAction") ?? "");
  if (visibilityAction) {
    if (!Number.isSafeInteger(id) || id < 1 || !["archive", "trash", "restore"].includes(visibilityAction)) {
      return Response.json({ error: "Invalid inquiry action" }, { status: 400 });
    }
    const { DB } = context.cloudflare.env;
    const exists = await DB.prepare("SELECT id FROM travel_inquiries WHERE id = ?").bind(id).first();
    if (!exists) return Response.json({ error: "Inquiry not found" }, { status: 404 });
    await ensureLeadVisibility(DB);
    const visibility = visibilityAction === "restore" ? "active" : visibilityAction === "archive" ? "archived" : "trash";
    await DB.prepare(`INSERT INTO advisor_lead_visibility (inquiry_id,visibility,updated_at)
      VALUES (?,?,CURRENT_TIMESTAMP)
      ON CONFLICT(inquiry_id) DO UPDATE SET visibility=excluded.visibility,updated_at=CURRENT_TIMESTAMP`)
      .bind(id,visibility).run();
    return Response.json({ success: true, visibility });
  }
  if (form.get("cleanupAction") === "delete-jazmin-tests") {
    if (form.get("confirmation") !== "DELETE JAZMIN TESTS") {
      return Response.json({ error: "Confirmation phrase does not match" }, { status: 400 });
    }
    const { DB } = context.cloudflare.env;
    const normalized = "jazmin morrison";
    const matches = await DB.prepare(`SELECT id FROM travel_inquiries
      WHERE lower(trim(full_name)) = ? ORDER BY id`).bind(normalized).all<{ id: number }>();
    const ids = (matches.results ?? []).map((row) => row.id);
    const expected = String(form.get("expectedIds") ?? "");
    if (ids.join(",") !== expected || ids.length === 0) {
      return Response.json({ error: "Matching records changed. Refresh and review before deleting." }, { status: 409 });
    }
    // All deletes use the same exact normalized name predicate, and dependent
    // advisor data is removed in the same D1 batch.
    await DB.batch([
      DB.prepare(`DELETE FROM advisor_lead_updates WHERE inquiry_id IN
        (SELECT id FROM travel_inquiries WHERE lower(trim(full_name)) = ?)`).bind(normalized),
      DB.prepare(`DELETE FROM advisor_lead_health WHERE inquiry_id IN
        (SELECT id FROM travel_inquiries WHERE lower(trim(full_name)) = ?)`).bind(normalized),
      DB.prepare(`DELETE FROM advisor_lead_visibility WHERE inquiry_id IN
        (SELECT id FROM travel_inquiries WHERE lower(trim(full_name)) = ?)`).bind(normalized),
      DB.prepare("DELETE FROM travel_inquiries WHERE lower(trim(full_name)) = ?").bind(normalized),
    ]);
    return Response.json({ success: true, deleted: ids.length });
  }
  const status = String(form.get("status") ?? "");
  const quick = form.get("quickStage") === "1";
  const health = String(form.get("leadHealth") ?? "Unqualified");
  const followUp = String(form.get("followUp") ?? "").trim();
  const quoteRaw = String(form.get("quoteAmount") ?? "").trim();
  const notes = String(form.get("advisorNotes") ?? "").trim();
  if (!Number.isSafeInteger(id) || id < 1 || !STATUSES.includes(status as typeof STATUSES[number]) ||
    (!quick && !LEAD_HEALTH.includes(health as typeof LEAD_HEALTH[number])) ||
    (followUp && !/^\d{4}-\d{2}-\d{2}$/.test(followUp)) || notes.length > 10000 ||
    (quoteRaw && (!Number.isFinite(Number(quoteRaw)) || Number(quoteRaw) < 0 || Number(quoteRaw) > 10000000))) {
    return Response.json({ error: "Invalid lead update" }, { status: 400 });
  }
  const { DB } = context.cloudflare.env;
  const exists = await DB.prepare("SELECT id FROM travel_inquiries WHERE id = ?").bind(id).first();
  if (!exists) return Response.json({ error: "Inquiry not found" }, { status: 404 });
  await ensureLeadUpdates(DB);
  if (quick) {
    await DB.prepare(`INSERT INTO advisor_lead_updates (inquiry_id,status,updated_at) VALUES (?,?,CURRENT_TIMESTAMP)
      ON CONFLICT(inquiry_id) DO UPDATE SET status=excluded.status,updated_at=CURRENT_TIMESTAMP`)
      .bind(id,status).run();
    return Response.json({ success: true });
  }
  await DB.prepare(`CREATE TABLE IF NOT EXISTS advisor_lead_health (
    inquiry_id INTEGER PRIMARY KEY, health TEXT NOT NULL DEFAULT 'Unqualified'
  )`).run();
  await DB.prepare(`INSERT INTO advisor_lead_health (inquiry_id,health) VALUES (?,?)
    ON CONFLICT(inquiry_id) DO UPDATE SET health=excluded.health`).bind(id,health).run();
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
  await ensureLeadVisibility(DB);
  await DB.prepare(`CREATE TABLE IF NOT EXISTS advisor_lead_health (
    inquiry_id INTEGER PRIMARY KEY, health TEXT NOT NULL DEFAULT 'Unqualified'
  )`).run();
  await DB.prepare(`CREATE TABLE IF NOT EXISTS advisor_inquiry_tests (
    inquiry_id INTEGER PRIMARY KEY, is_test INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
  const [{ results: inquiries }, { results: stats }, { results: updates }, { results: healthRows }, { results: visibilityRows }, { results: testRows }] = await Promise.all([
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
    DB.prepare("SELECT inquiry_id,health FROM advisor_lead_health").all<{inquiry_id:number;health:string}>(),
    DB.prepare("SELECT inquiry_id,visibility FROM advisor_lead_visibility").all<LeadVisibility>(),
    DB.prepare("SELECT inquiry_id,is_test FROM advisor_inquiry_tests").all<{inquiry_id:number;is_test:number}>(),
  ]);

  return {
    inquiries: inquiries ?? [],
    testInquiryIds: (inquiries ?? []).filter((inquiry) => inquiry.full_name.trim().toLowerCase() === "jazmin morrison").map((inquiry) => inquiry.id),
    updates: updates ?? [],
    healthRows: healthRows ?? [],
    visibilityRows: visibilityRows ?? [],
    testRows: testRows ?? [],
    stats: stats?.[0] ?? { total_inquiries: 0, unique_travelers: 0 },
  };
}

export function meta(_: Route.MetaArgs) {
  return [{ title: "Advisor Inquiries | Premier Resort Travel" }];
}

function QuickStage({ id, current }: { id: number; current: string }) {
  const fetcher = useFetcher();
  const stage = fetcher.formData?.get("status")?.toString() ?? current;
  return <div className="advisor-quick-stage" aria-label="Follow-up stage">
    <span className="advisor-stage-label">Follow-up stage:</span>
    {STATUSES.map((value) => <fetcher.Form method="post" key={value}>
      <input type="hidden" name="inquiryId" value={id} />
      <input type="hidden" name="status" value={value} />
      <input type="hidden" name="quickStage" value="1" />
      <button type="submit" aria-pressed={stage === value} className={stage === value ? "advisor-stage-button selected" : "advisor-stage-button"} disabled={fetcher.state !== "idle"}>{value}</button>
    </fetcher.Form>)}
  </div>;
}
function VisibilityActions({ id, visibility }: { id: number; visibility: string }) {
  const fetcher = useFetcher();
  const pending = fetcher.state !== "idle";
  return <div className="advisor-visibility-actions">
    {visibility === "active" ? <>
      <fetcher.Form method="post"><input type="hidden" name="inquiryId" value={id} /><input type="hidden" name="visibilityAction" value="archive" /><button type="submit" disabled={pending} className="advisor-stage-button">Archive</button></fetcher.Form>
      <fetcher.Form method="post" onSubmit={(event) => { if (!window.confirm("Move this inquiry to Trash? You can restore it later.")) event.preventDefault(); }}><input type="hidden" name="inquiryId" value={id} /><input type="hidden" name="visibilityAction" value="trash" /><button type="submit" disabled={pending} className="advisor-stage-button">Move to Trash</button></fetcher.Form>
    </> : <fetcher.Form method="post"><input type="hidden" name="inquiryId" value={id} /><input type="hidden" name="visibilityAction" value="restore" /><button type="submit" disabled={pending} className="advisor-stage-button">Restore to Active</button></fetcher.Form>}
  </div>;
}
function TestFlagControl({ id, isTest }: { id: number; isTest: boolean }) {
  const fetcher = useFetcher<{ success?: boolean; isTest?: boolean }>();
  const current = fetcher.data?.success ? fetcher.data.isTest === true : isTest;
  return <fetcher.Form method="post">
    <input type="hidden" name="inquiryId" value={id} />
    <input type="hidden" name="testAction" value={current ? "unmark" : "mark"} />
    <button type="submit" className="button button-secondary" disabled={fetcher.state !== "idle"}>
      {current ? "Marked as test — Restore to leads" : "Mark as Test"}
    </button>
  </fetcher.Form>;
}

export default function AdvisorInquiries({ loaderData }: Route.ComponentProps) {
  const { inquiries, stats, updates, healthRows, visibilityRows, testInquiryIds, testRows } = loaderData;
  const [cleanupPhrase, setCleanupPhrase] = useState("");
  const cleanupFetcher = useFetcher();
  const visibilityById = new Map(visibilityRows.map((row) => [row.inquiry_id, row.visibility]));
  const testById = new Map(testRows.map(row => [row.inquiry_id, row.is_test === 1]));
  const [visibilityFilter, setVisibilityFilter] = useState("active");
  const healthById = new Map(healthRows.map((row) => [row.inquiry_id, row.health]));
  const navigation = useNavigation();
  const updateById = new Map(updates.map((update) => [update.inquiry_id, update]));
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const visibleInquiries = useMemo(() => inquiries.filter((inquiry) => {
    if ((visibilityById.get(inquiry.id) ?? "active") !== visibilityFilter) return false;
    const needle = search.trim().toLowerCase();
    const searchable = [inquiry.full_name, inquiry.email, inquiry.destination_interest, inquiry.trip_style, inquiry.travel_window, inquiry.notes].join(" ").toLowerCase();
    if (needle && !searchable.includes(needle)) return false;
    if (sourceFilter === "quick") return isQuickNoteLead(inquiry);
    if (sourceFilter === "resort") return leadAttribution(inquiry).origin === "Resort detail page";
    if (sourceFilter === "general") return leadAttribution(inquiry).origin === "General quote page";
    if (sourceFilter === "content") return ["Travel journal", "Traveler stories index", "Traveler story"].includes(leadAttribution(inquiry).origin);
    if (sourceFilter === "other") return !["Resort detail page", "General quote page", "Travel journal", "Traveler stories index", "Traveler story"].includes(leadAttribution(inquiry).origin);
    return true;
  }), [inquiries, search, sourceFilter, visibilityFilter, visibilityRows]);
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
  const contentLeads = sources.filter(source => ["Travel journal", "Traveler stories index", "Traveler story"].includes(source.origin)).length;

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
          <article className="planning-card"><h3>{contentLeads}</h3><p>From journals and traveler stories</p></article>
          <article className="planning-card"><h3>{sources.length - resortLeads - generalLeads - contentLeads}</h3><p>Unattributed or older leads</p></article>
        </div>
        <article className="planning-card" style={{ marginTop: 20 }}>
          <h3>Resorts generating leads</h3>
          {topResorts.length ? <ol>{topResorts.map(([resort, count]) => <li key={resort}>{resort}: {count} {count === 1 ? "inquiry" : "inquiries"}</li>)}</ol> : <p>No resort-attributed inquiries yet.</p>}
        </article>
      </section>

      <section className="property-details" aria-label="Test inquiry cleanup">
        <details className="advisor-test-cleanup">
          <summary>Clean up test inquiries ({testInquiryIds.length})</summary>
          <p>Only inquiries whose submitted name exactly matches <strong>Jazmin Morrison</strong> (ignoring capitalization and surrounding spaces) are eligible. Other customer records will not be touched.</p>
          <p><strong>Matching inquiry IDs:</strong> {testInquiryIds.length ? testInquiryIds.join(", ") : "None"}</p>
          <p>Permanent deletion removes the matching inquiries and their advisor notes, stages, and follow-up details. This cannot be undone.</p>
          {testInquiryIds.length > 0 ? <cleanupFetcher.Form method="post" className="advisor-cleanup-form">
            <input type="hidden" name="cleanupAction" value="delete-jazmin-tests" />
            <input type="hidden" name="expectedIds" value={testInquiryIds.join(",")} />
            <label>Type DELETE JAZMIN TESTS to confirm
              <input type="text" name="confirmation" value={cleanupPhrase} onChange={(event) => setCleanupPhrase(event.target.value)} autoComplete="off" />
            </label>
            <button type="submit" className="button button-secondary" disabled={cleanupPhrase !== "DELETE JAZMIN TESTS" || cleanupFetcher.state !== "idle"}>Permanently delete {testInquiryIds.length} test inquiries</button>
          </cleanupFetcher.Form> : null}
          {cleanupFetcher.data && <p role="status">{(cleanupFetcher.data as {success?:boolean;error?:string;deleted?:number}).success ? "Test records deleted. Refresh to update counts." : (cleanupFetcher.data as {error?:string}).error}</p>}
        </details>
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
              <option value="content">Journal and traveler stories</option>
              <option value="other">Other / unattributed</option>
              <option value="quick">Quick notes</option>
            </select>
          </label>
          <label>Inbox
            <select value={visibilityFilter} onChange={(event) => setVisibilityFilter(event.target.value)}>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="trash">Trash</option>
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
                <TestFlagControl id={inquiry.id} isTest={testById.get(inquiry.id) ?? false} />
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
                <VisibilityActions id={inquiry.id} visibility={visibilityById.get(inquiry.id) ?? "active"} />
                <QuickStage id={inquiry.id} current={LEGACY_STATUS[updateById.get(inquiry.id)?.status ?? ""] ?? updateById.get(inquiry.id)?.status ?? "Lead"} />
                <details className="advisor-lead-editor">
                  <summary>Manage lead</summary>
                  <Form method="post" key={inquiry.id} className="advisor-lead-editor-fields">
                    <input type="hidden" name="inquiryId" value={inquiry.id} />
                    <label>Status<select name="status" defaultValue={LEGACY_STATUS[updateById.get(inquiry.id)?.status ?? ""] ?? updateById.get(inquiry.id)?.status ?? "Lead"}>
                      {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select></label>
                    <label>Lead status<select name="leadHealth" defaultValue={healthById.get(inquiry.id) ?? "Unqualified"}>
                      {LEAD_HEALTH.map((value) => <option key={value} value={value}>{value}</option>)}
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
