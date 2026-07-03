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

export async function loader({ context }: Route.LoaderArgs) {
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

      <section className="related-properties">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Live Submissions</p>
            <h2>Recent traveler inquiries</h2>
          </div>
        </div>

        <div className="inquiry-list">
          {inquiries.length === 0 ? (
            <article className="planning-card">
              <h3>No inquiries yet</h3>
              <p>Once travelers use the quote form, submissions will appear here.</p>
            </article>
          ) : (
            inquiries.map((inquiry) => (
              <article key={inquiry.id} className="inquiry-card">
                <div className="inquiry-card-top">
                  <div>
                    <h3>{inquiry.full_name}</h3>
                    <p className="results-summary">{inquiry.email}</p>
                  </div>
                  <span className="tier-pill">{formatInquiryTime(inquiry.created_at)}</span>
                </div>
                <div className="property-pill-row">
                  {isQuickNoteLead(inquiry) ? <span className="feature-badge">Quick note</span> : null}
                  {inquiry.destination_interest ? (
                    <span className="feature-badge">{inquiry.destination_interest}</span>
                  ) : null}
                  {inquiry.trip_style ? <span className="tier-pill">{inquiry.trip_style}</span> : null}
                  {inquiry.travel_window ? (
                    <span className="tier-pill">{inquiry.travel_window}</span>
                  ) : null}
                </div>
                <p>{inquiry.notes || "No additional notes were provided."}</p>
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
