import { fallbackProperties, fetchDestinationsFromDb, fetchPropertyBySlug } from "../lib/catalog";
import { findCollectionHrefForProperty } from "../lib/property-data";
import { storiesForProperty } from "../lib/traveler-stories";
import type { Route } from "./+types/property";

export async function loader({ params, context }: Route.LoaderArgs) {
  try {
    const property = await fetchPropertyBySlug(context.cloudflare.env.DB, params.slug);

    if (!property) {
      throw new Response("Not Found", { status: 404 });
    }

    const related = (await fetchDestinationsFromDb(context.cloudflare.env.DB))
      .filter(
        (candidate) =>
          candidate.slug !== property.slug &&
          (candidate.brand === property.brand || candidate.region === property.region)
      )
      .slice(0, 3);

    return { property, related, source: "database", travelerStories: storiesForProperty(property, 3) };
  } catch {
    const property = fallbackProperties().find((candidate) => candidate.slug === params.slug);

    if (!property) {
      throw new Response("Not Found", { status: 404 });
    }

    const related = fallbackProperties()
      .filter(
        (candidate) =>
          candidate.slug !== property.slug &&
          (candidate.brand === property.brand || candidate.region === property.region)
      )
      .slice(0, 3);

    return { property, related, source: "fallback", travelerStories: storiesForProperty(property, 3) };
  }
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [{ title: "Property Not Found | Premier Resort Travel" }];
  }

  return [
    { title: `${data.property.name} | Premier Resort Travel` },
    {
      name: "description",
      content: `${data.property.name} in ${data.property.location}. ${data.property.description}`,
    },
  ];
}

export default function PropertyPage({ loaderData }: Route.ComponentProps) {
  const { property, related, source, travelerStories } = loaderData;
  const collectionHref = findCollectionHrefForProperty(property.slug);

  return (
    <main className="page-shell">
      <section className="property-hero">
        <div className="property-hero-image">
          <img
            src={property.image_url || ""}
            alt={property.name}
            decoding="async"
            sizes="(max-width: 1100px) 100vw, 55vw"
          />
        </div>
        <div className="property-hero-copy">
          <p className="eyebrow">{property.brand}</p>
          <h1>{property.name}</h1>
          <p className="property-location">{property.location}</p>
          <p className="lede">{property.description}</p>
          <div className="property-pill-row">
            <span className="feature-badge">{property.tripStyle}</span>
            <span className="tier-pill">{property.region}</span>
            <span className="tier-pill">{property.brand}</span>
          </div>
          <div className="hero-actions">
            <a className="button button-primary" href="/#plan-trip">
              Request a quote
            </a>
            <a className="button button-secondary" href={collectionHref}>
              Back to collection
            </a>
          </div>
        </div>
      </section>

      {source === "fallback" ? (
        <section className="property-details">
          <div className="planning-card">
            <h3>Preview mode</h3>
            <p>This property is using curated fallback content because the live database was unavailable during this request.</p>
          </div>
        </section>
      ) : null}

      <section className="property-details">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Why Travelers Choose It</p>
            <h2>A sharper picture of the stay experience</h2>
          </div>
        </div>

        <div className="property-detail-grid">
          <article className="planning-card">
            <h3>Best for</h3>
            <p>{property.highlight}</p>
          </article>
          <article className="planning-card">
            <h3>Trip style</h3>
            <p>{property.tripStyle}</p>
          </article>
          <article className="planning-card">
            <h3>Perfect for</h3>
            <p>{property.perfectFor.join(" · ")}</p>
          </article>
        </div>
      </section>

      <section className="related-properties">
        {travelerStories.length ? (
          <>
            <div className="section-heading section-heading-stack">
              <div>
                <p className="eyebrow">Traveler Experiences</p>
                <h2>Real trips at {property.name}</h2>
              </div>
              <a className="text-link" href="/traveler-stories">
                View all stories
              </a>
            </div>

            <div className="traveler-story-grid traveler-story-grid-compact property-story-grid">
              {travelerStories.map((story) => (
                <a key={story.slug} className="traveler-story-card" href={`/traveler-stories/${story.slug}`}>
                  <div className="traveler-story-image">
                    <img src={story.featuredImage} alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="traveler-story-copy">
                    <div className="traveler-story-meta">
                      <span>{story.tripType}</span>
                      <span>{story.travelDate}</span>
                    </div>
                    <h3>{story.travelerName}'s {story.destination} trip</h3>
                    <p>"{story.favoriteMemory}"</p>
                    <span className="text-link">View Story -&gt;</span>
                  </div>
                </a>
              ))}
            </div>
          </>
        ) : null}

        <div className="section-heading">
          <div>
            <p className="eyebrow">Keep Exploring</p>
            <h2>More properties that fit a similar traveler</h2>
          </div>
        </div>

        <div className="portfolio-grid">
          {related.map((candidate) => (
            <article key={candidate.slug} className="portfolio-card">
              <div className="portfolio-image-shell">
                <img
                  className="destination-image"
                  src={candidate.image_url || ""}
                  alt={candidate.name}
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 1100px) 100vw, 25vw"
                />
              </div>
              <div className="portfolio-meta">
                <span className="feature-badge">{candidate.tag}</span>
                <p className="card-region">{candidate.location}</p>
              </div>
              <h3>{candidate.name}</h3>
              <p>{candidate.highlight}</p>
              <div className="card-actions card-actions-inline">
                <a className="button button-secondary" href={`/properties/${candidate.slug}`}>
                  View property
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
