import { findJournalPostBySlug, findPropertyBySlug } from "../lib/property-data";
import type { Route } from "./+types/journal";

const siteOrigin = "https://premierresorttravels.com";

function absoluteUrl(value: string) {
  return new URL(value, siteOrigin).toString();
}

export async function loader({ params }: Route.LoaderArgs) {
  const post = findJournalPostBySlug(params.slug);

  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }

  const featuredProperties = post.featuredPropertySlugs
    .map((slug) => findPropertyBySlug(slug))
    .filter((property): property is NonNullable<typeof property> => property !== undefined);
  const relatedPosts = (post.relatedPostSlugs ?? [])
    .map((slug) => findJournalPostBySlug(slug))
    .filter((related): related is NonNullable<typeof related> => related !== undefined);

  return { post, featuredProperties, relatedPosts };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [{ title: "Journal Article Not Found | Premier Resort Travel" }];
  }

  const isLeBlancComparison = data.post.slug === "le-blanc-cancun-vs-le-blanc-los-cabos";
  const canonical = `${siteOrigin}/journal/${data.post.slug}`;
  const title = data.post.seoTitle
    ? `${data.post.seoTitle} | Premier Resort Travel`
    : isLeBlancComparison
    ? "Le Blanc Cancun vs Los Cabos: Which Is Better? | Premier Resort Travel"
    : `${data.post.title} | Premier Resort Travel`;
  const description = data.post.seoDescription
    ?? (isLeBlancComparison
    ? "Compare Le Blanc Cancun and Le Blanc Los Cabos for beach, pools, spa, dining, climate, transfers, and honeymoon fit before choosing your resort."
    : data.post.description);

  return [
    { title },
    { tagName: "link", rel: "canonical", href: canonical },
    { name: "description", content: description },
    { property: "og:type", content: "article" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: canonical },
    { property: "og:image", content: absoluteUrl(data.post.image) },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: absoluteUrl(data.post.image) },
  ];
}

export default function JournalPage({ loaderData }: Route.ComponentProps) {
  const { post, featuredProperties, relatedPosts } = loaderData;
  const isLeBlancComparison = post.slug === "le-blanc-cancun-vs-le-blanc-los-cabos";
  const showMoonPalaceComparison = post.slug === "best-all-inclusive-resorts-in-cancun-for-families";
  const inquiryNote = `I read "${post.title}" and would like help comparing resorts and planning a trip.`;
  const journalDestination = post.slug.includes("cancun") ? "Cancun" : post.slug.includes("los-cabos") ? "Los Cabos" : post.slug.includes("jamaica") ? "Jamaica" : post.slug.includes("cozumel") ? "Cozumel" : post.slug.includes("italy") ? "Italy" : post.slug.includes("maldives") ? "Maldives" : "";
  const inquiryHref = isLeBlancComparison
    ? `/quote?origin=journal&destination=${encodeURIComponent("Cancun or Los Cabos")}&note=${encodeURIComponent("I am comparing Le Blanc Spa Resort Cancun and Le Blanc Spa Resort Los Cabos. Please help me compare total pricing for my dates, room preferences, and travel party.")}`
    : `/quote?origin=journal&destination=${encodeURIComponent(journalDestination)}&note=${encodeURIComponent(inquiryNote)}`;
  const canonical = `${siteOrigin}/journal/${post.slug}`;
  const reviewedLabel = post.reviewedOn
    ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${post.reviewedOn}T00:00:00Z`))
    : null;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: absoluteUrl(post.image),
    mainEntityOfPage: canonical,
    author: { "@type": "Organization", name: "Premier Resort Travel", url: `${siteOrigin}/about` },
    ...(post.reviewedOn ? { dateModified: post.reviewedOn } : {}),
    publisher: {
      "@type": "Organization",
      name: "Premier Resort Travel",
      url: siteOrigin,
      logo: { "@type": "ImageObject", url: `${siteOrigin}/images/brand/premier-resort-travel-horizontal-logo.png` },
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteOrigin}/` },
      { "@type": "ListItem", position: 2, name: "Travel Journal", item: `${siteOrigin}/journal` },
      { "@type": "ListItem", position: 3, name: post.title, item: canonical },
    ],
  };

  return (
    <main className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
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
          <p className="journal-byline">
            Written and reviewed by <a href="/about#editorial-standards">Premier Resort Travel</a>
            {reviewedLabel ? <span> · Reviewed {reviewedLabel}</span> : null}
          </p>
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

      {isLeBlancComparison ? (
        <section className="property-details le-blanc-comparison" aria-labelledby="le-blanc-comparison-heading">
          <div className="section-heading section-heading-stack">
            <p className="eyebrow">Quick Answer</p>
            <h2 id="le-blanc-comparison-heading">Cancun for the Caribbean beach; Los Cabos for pools, spa, and desert-coast scenery</h2>
            <p>Both are polished adults-only all-inclusive resorts. Le Blanc Cancun is usually the better match when the beach is central to the trip. Le Blanc Los Cabos is often the stronger choice when resort atmosphere, pool time, wellness, and dramatic scenery matter most.</p>
          </div>
          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <caption>Le Blanc Cancun and Le Blanc Los Cabos at a glance</caption>
              <thead>
                <tr><th scope="col">Compare</th><th scope="col">Le Blanc Cancun</th><th scope="col">Le Blanc Los Cabos</th></tr>
              </thead>
              <tbody>
                <tr><th scope="row">Overall setting</th><td>Caribbean beachfront in Cancun's Hotel Zone</td><td>Contemporary desert-meets-ocean resort corridor</td></tr>
                <tr><th scope="row">Best fit</th><td>Couples prioritizing turquoise-water beach time and classic Cancun ease</td><td>Couples prioritizing pools, spa time, design, and a quieter coastal mood</td></tr>
                <tr><th scope="row">Beach experience</th><td>The beach is a larger part of the resort decision; conditions still vary by season and weather</td><td>Dramatic oceanfront scenery; confirm current swimming conditions before planning beach time</td></tr>
                <tr><th scope="row">Climate</th><td>Warmer, greener, and more humid Caribbean climate</td><td>Drier desert climate with cooler evenings during parts of the year</td></tr>
                <tr><th scope="row">Arrival airport</th><td>Cancun International Airport (CUN)</td><td>Los Cabos International Airport (SJD)</td></tr>
                <tr><th scope="row">Choose it when</th><td>Your ideal trip starts with the beach itself</td><td>Your ideal trip centers on the resort, pools, spa, and scenery</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {!isLeBlancComparison && post.quickAnswer ? (
        <section className="property-details journal-quick-answer" aria-labelledby="journal-quick-answer-heading">
          <div className="section-heading section-heading-stack">
            <p className="eyebrow">Quick Answer</p>
            <h2 id="journal-quick-answer-heading">What should travelers prioritize?</h2>
            <p>{post.quickAnswer}</p>
          </div>
        </section>
      ) : null}

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
      {relatedPosts.length ? (
        <section className="property-details" aria-labelledby="related-journal-guides-heading">
          <div className="section-heading section-heading-stack">
            <p className="eyebrow">Continue Planning</p>
            <h2 id="related-journal-guides-heading">Related resort guides</h2>
          </div>
          <div className="planning-grid">
            {relatedPosts.map((related) => (
              <article className="planning-card" key={related.slug}>
                <h3>{related.title}</h3>
                <p>{related.description}</p>
                <a className="text-link" href={`/journal/${related.slug}`}>Read the guide →</a>
              </article>
            ))}
          </div>
        </section>
      ) : null}
      <section className="property-details journal-editorial-standards" aria-labelledby="journal-editorial-heading">
        <div className="section-heading section-heading-stack">
          <p className="eyebrow">How We Review Resorts</p>
          <h2 id="journal-editorial-heading">Recommendations built around trip fit, not a universal ranking</h2>
          <p>Premier Resort Travel compares the details that change a vacation: traveler type, setting and transfer logistics, room needs, dining, activities, beach and pool priorities, wellness, and total value for the actual dates. Resort policies and inclusions can change, so current availability, access rules, age requirements, and pricing are confirmed during the quote process.</p>
          <a className="text-link" href="/about#editorial-standards">Read our experience and editorial standards →</a>
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
