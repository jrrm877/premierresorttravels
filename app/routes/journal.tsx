import { findJournalPostBySlug, findPropertyBySlug } from "../lib/property-data";
import type { Route } from "./+types/journal";

export async function loader({ params }: Route.LoaderArgs) {
  const post = findJournalPostBySlug(params.slug);

  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }

  const featuredProperties = post.featuredPropertySlugs
    .map((slug) => findPropertyBySlug(slug))
    .filter((property) => Boolean(property));

  return { post, featuredProperties };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [{ title: "Journal Article Not Found | Premier Resort Travel" }];
  }

  return [
    { title: `${data.post.title} | Premier Resort Travel` },
    {
      name: "description",
      content: data.post.description,
    },
  ];
}

export default function JournalPage({ loaderData }: Route.ComponentProps) {
  const { post, featuredProperties } = loaderData;

  return (
    <main className="page-shell">
      <section className="collection-hero">
        <div className="collection-hero-image">
          <img
            src={post.image}
            alt={post.title}
            decoding="async"
            sizes="(max-width: 1100px) 100vw, 52vw"
          />
        </div>
        <div className="collection-hero-copy">
          <p className="eyebrow">{post.eyebrow}</p>
          <h1>{post.title}</h1>
          <p className="lede">{post.description}</p>
          <div className="collection-highlight-list">
            <span className="feature-badge">{post.readTime}</span>
            <span className="tier-pill">Luxury travel guide</span>
          </div>
          <div className="hero-actions">
            <a className="button button-primary" href="#featured-properties">
              See matching stays
            </a>
            <a className="button button-secondary" href={post.collectionHref}>
              Explore this collection
            </a>
          </div>
        </div>
      </section>

      <section className="property-details">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Why It Matters</p>
            <h2>Travel planning notes that help narrow the right stay faster</h2>
          </div>
        </div>

        <div className="planning-grid">
          {post.sections.map((section) => (
            <article key={section.title} className="planning-card">
              <h3>{section.title}</h3>
              <p>{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="portfolio-section accent-gold" id="featured-properties">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Featured Properties</p>
            <h2>Stays that fit this article best</h2>
          </div>
          <p className="section-copy">
            These are the most relevant properties to open next if this trip style matches what
            you are planning.
          </p>
        </div>

        <div className="portfolio-grid">
          {featuredProperties.map((property) => (
            <article key={property.slug} className="portfolio-card">
              <div className="portfolio-image-shell">
                <img
                  className="destination-image"
                  src={property.image}
                  alt={property.name}
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 1100px) 100vw, 25vw"
                />
              </div>
              <div className="portfolio-meta">
                <span className="feature-badge">{property.tag}</span>
                <p className="card-region">{property.location}</p>
              </div>
              <h3>{property.name}</h3>
              <p>{property.highlight}</p>
              <div className="card-actions card-actions-inline">
                <a className="button button-secondary" href={`/properties/${property.slug}`}>
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
