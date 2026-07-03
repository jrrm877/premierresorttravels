import { fallbackProperties, fetchDestinationsFromDb } from "../lib/catalog";
import type { Route } from "./+types/advisor.properties";

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const properties = await fetchDestinationsFromDb(context.cloudflare.env.DB);
    return { properties, source: "database" };
  } catch {
    return { properties: fallbackProperties(), source: "fallback" };
  }
}

export function meta(_: Route.MetaArgs) {
  return [{ title: "Advisor Properties | Premier Resort Travel" }];
}

export default function AdvisorProperties({ loaderData }: Route.ComponentProps) {
  const { properties, source } = loaderData;

  return (
    <main className="page-shell">
      <section className="property-details">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Advisor Backend</p>
            <h2>Property inventory</h2>
          </div>
          <div className="hero-actions">
            <a className="button button-secondary" href="/advisor/inquiries">
              View inquiries
            </a>
            <a className="button button-secondary" href="/">
              Back to site
            </a>
          </div>
        </div>

        <div className="planning-grid">
          <article className="planning-card">
            <h3>{properties.length}</h3>
            <p>Approved properties currently available in the catalog</p>
          </article>
          <article className="planning-card">
            <h3>{new Set(properties.map((property) => property.brand)).size}</h3>
            <p>Approved brands represented in the collection</p>
          </article>
          <article className="planning-card">
            <h3>{source === "database" ? "Live" : "Fallback"}</h3>
            <p>Current catalog source</p>
          </article>
        </div>
      </section>

      <section className="related-properties">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Catalog Records</p>
            <h2>Browse the active approved property pages</h2>
          </div>
        </div>

        <div className="inquiry-list">
          {properties.map((property) => (
            <article key={property.slug} className="inquiry-card">
              <div className="inquiry-card-top">
                <div>
                  <h3>{property.name}</h3>
                  <p className="results-summary">{property.location}</p>
                </div>
                <span className="tier-pill">{property.price_tier}</span>
              </div>
              <div className="property-pill-row">
                <span className="feature-badge">{property.brand}</span>
                <span className="tier-pill">{property.tripStyle}</span>
                {property.avg_rating ? (
                  <span className="tier-pill">{property.avg_rating.toFixed(1)}</span>
                ) : null}
              </div>
              <p>{property.description || property.highlight}</p>
              <div className="card-actions">
                <a className="button button-secondary" href={`/properties/${property.slug}`}>
                  Open property page
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
