import { findJournalPostBySlug, findPropertyBySlug } from "../lib/property-data";
import type { Route } from "./+types/journal";

export async function loader({ params }: Route.LoaderArgs) {
  const post = findJournalPostBySlug(params.slug);

  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }

  const featuredProperties = post.featuredPropertySlugs
    .map((slug) => findPropertyBySlug(slug))
    .filter((property): property is NonNullable<typeof property> => property !== undefined);

  return { post, featuredProperties };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [{ title: "Journal Article Not Found | Premier Resort Travel" }];
  }

  return [
    { title: `${data.post.title} | Premier Resort Travel` },
    { tagName: "link", rel: "canonical", href: `https://premierresorttravels.com/journal/${data.post.slug}` },
    {
      name: "description",
      content: data.post.description,
    },
  ];
}

export default function JournalPage({ loaderData }: Route.ComponentProps) {
  const { post, featuredProperties } = loaderData;
  const isLeBlancComparison = post.slug === "le-blanc-cancun-vs-le-blanc-los-cabos";
  const showMoonPalaceComparison = post.slug === "best-all-inclusive-resorts-in-cancun-for-families";
  const inquiryNote = `I read "${post.title}" and would like help comparing resorts and planning a trip.`;
  const journalDestination = post.slug.includes("cancun") ? "Cancun" : post.slug.includes("los-cabos") ? "Los Cabos" : post.slug.includes("jamaica") ? "Jamaica" : post.slug.includes("cozumel") ? "Cozumel" : post.slug.includes("italy") ? "Italy" : post.slug.includes("maldives") ? "Maldives" : "";
  const inquiryHref = isLeBlancComparison
    ? `/quote?origin=journal&destination=${encodeURIComponent("Cancun or Los Cabos")}&note=${encodeURIComponent("I am comparing Le Blanc Spa Resort Cancun and Le Blanc Spa Resort Los Cabos. Please help me compare total pricing for my dates, room preferences, and travel party.")}`
    : `/quote?origin=journal&destination=${encodeURIComponent(journalDestination)}&note=${encodeURIComponent(inquiryNote)}`;

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
            <a className="button button-primary" href={inquiryHref}>{isLeBlancComparison ? "Compare Le Blanc prices for my dates" : "Request personalized resort options"}</a>
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

      {isLeBlancComparison ? (
        <section className="property-details" aria-label="Compare Le Blanc resorts for your trip">
          <article className="planning-card">
            <p className="eyebrow">Personalized Resort Comparison</p>
            <h2>Which Le Blanc resort fits your dates and budget?</h2>
            <p>Share your travel dates, number of guests, and preferred room type. We can help compare available options and total trip pricing without relying on generic advertised rates.</p>
            <a className="button button-primary" href={inquiryHref}>Request my Le Blanc comparison</a>
          </article>
        </section>
      ) : null}
      {showMoonPalaceComparison ? (
        <section className="property-details" aria-label="Moon Palace resort comparison">
          <article className="planning-card">
            <p className="eyebrow">Compare Two Cancun Favorites</p>
            <h2>Moon Palace The Grand Cancun vs. Moon Palace Cancun</h2>
            <p>Choosing between these two resorts? Compare room options, dining access, activities and overall trip value before you request a quote.</p>
            <a className="button button-secondary" href="/journal/moon-palace-the-grand-vs-moon-palace-cancun">Read the Moon Palace comparison</a>
          </article>
        </section>
      ) : null}
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
                <a className="text-link" href={`/quote?origin=journal&resort=${encodeURIComponent(property.name)}&note=${encodeURIComponent(`Interested in ${property.name} after reading ${post.title}`)}`}>
                  Request options
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="hotel-collections-cta" aria-label="Request personalized travel options">
        <div>
          <h2>Ready to find the right resort for your trip?</h2>
          <p>Tell us your dates, travelers, and priorities. We will help narrow the options.</p>
        </div>
        <a className="button button-primary" href={inquiryHref}>Request personalized options</a>
      </section>
    </main>
  );
}
