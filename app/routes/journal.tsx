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
  const isCouplesGuide = post.slug === "best-adults-only-all-inclusive-resorts-for-couples";
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
        <section className="property-details" aria-labelledby="le-blanc-quick-answer">
          <div className="section-heading section-heading-stack">
            <div><p className="eyebrow">At a Glance</p><h2 id="le-blanc-quick-answer">Le Blanc Cancun or Los Cabos: which is better for you?</h2></div>
          </div>
          <div className="planning-grid">
            <article className="planning-card">
              <h3>Choose Cancun for a Caribbean beach escape</h3>
              <p>Best suited to couples prioritizing turquoise Caribbean scenery and classic Cancun beach atmosphere. Sea conditions vary, so confirm current swimming guidance.</p>
              <a className="text-link" href="/properties/le-blanc-spa-resort-cancun">See Le Blanc Cancun details</a>
            </article>
            <article className="planning-card">
              <h3>Choose Los Cabos for dramatic coastal scenery</h3>
              <p>Best suited to couples drawn to desert-meets-ocean views and a resort-centered escape. Do not assume the beach is safe for swimming; check local conditions.</p>
              <a className="text-link" href="/properties/le-blanc-spa-resort-los-cabos">See Le Blanc Los Cabos details</a>
            </article>
          </div>
          <p>Neither resort is universally better. Compare the exact dates, room category, cancellation policy, transfers, and final trip total before deciding.</p>
          <div className="hero-actions"><a className="button button-primary" href={inquiryHref}>Compare Both Resorts for My Dates</a></div>
        </section>
      ) : null}
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
      {isCouplesGuide ? (
        <section className="property-details" aria-labelledby="couples-resort-comparison">
          <div className="section-heading section-heading-stack">
            <div><p className="eyebrow">Compare Adults-Only Resorts</p><h2 id="couples-resort-comparison">Which resort matches the way you want to travel?</h2></div>
            <p className="section-copy">Start with the experience you want, then confirm the specific room category, available amenities, and total price for your dates.</p>
          </div>
          <div className="planning-grid">
            <article className="planning-card"><h3>Le Blanc Spa Resort Cancun</h3><p>Consider this resort for an elegant Caribbean beachfront atmosphere and a couples-focused escape. Ask about room views, dining preferences, and spa options.</p><a className="text-link" href="/properties/le-blanc-spa-resort-cancun">Explore Le Blanc Cancun →</a></article>
            <article className="planning-card"><h3>Le Blanc Spa Resort Los Cabos</h3><p>Consider this setting for dramatic coastal scenery and a quieter, design-forward retreat. Ocean conditions vary; do not assume swimming from the beach is possible.</p><a className="text-link" href="/properties/le-blanc-spa-resort-los-cabos">Explore Le Blanc Los Cabos →</a></article>
            <article className="planning-card"><h3>Sun Palace Cancun</h3><p>Worth comparing for couples who prefer a Cancun beachfront vacation. Check current room categories, atmosphere, and package inclusions rather than assuming every adults-only stay is the same.</p><a className="text-link" href="/properties/sun-palace">Explore Sun Palace →</a></article>
          </div>
          <div className="hero-actions"><a className="button button-primary" href={inquiryHref}>Compare Adults-Only Resort Quotes</a><a className="button button-secondary" href="/journal/le-blanc-cancun-vs-le-blanc-los-cabos">Compare Cancun vs Los Cabos</a></div>
        </section>
      ) : null}
      {isLeBlancComparison ? (
        <section className="property-details" aria-labelledby="leblanc-details-heading">
          <div className="section-heading section-heading-stack">
            <div><p className="eyebrow">Side-by-Side Planning Guide</p><h2 id="leblanc-details-heading">Le Blanc Cancun vs. Los Cabos: what to compare before booking</h2></div>
          </div>
          <div className="planning-grid">
            <article className="planning-card"><h3>Beach and destination</h3><p>Cancun offers a Caribbean setting; Los Cabos has a Pacific-side desert-meets-sea landscape. Beach access and safe swimming conditions differ by location and conditions, so confirm your priorities before choosing.</p></article>
            <article className="planning-card"><h3>Rooms and total cost</h3><p>Compare the exact view, bedding configuration, cancellation terms, transfers, and total price for your dates. A similar room name does not guarantee the same experience or inclusions.</p></article>
            <article className="planning-card"><h3>Dining and wellness</h3><p>Ask which restaurants, treatments, reservations, and experiences are included with the offer you are considering. Current offerings and availability can change.</p></article>
            <article className="planning-card"><h3>Who should choose which?</h3><p>Prioritize Cancun if Caribbean beach scenery is central to your trip; compare Los Cabos if dramatic coastal landscapes and a slower resort-centered getaway appeal more.</p></article>
          </div>
          <div className="hero-actions"><a className="button button-primary" href={inquiryHref}>Compare Prices for My Dates</a><a className="button button-secondary" href="/journal/best-adults-only-all-inclusive-resorts-for-couples">Explore More Couples Resorts</a></div>
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
