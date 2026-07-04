import {
  findCollectionBySlug,
  getRelatedCollections,
  resortCollections,
} from "../data/collections";
import { resortsForCollection } from "../data/resorts";
import type { Route } from "./+types/collection";

export async function loader({ params }: Route.LoaderArgs) {
  const collection = findCollectionBySlug(params.slug);

  if (!collection) {
    throw new Response("Not Found", { status: 404 });
  }

  const resorts = resortsForCollection(collection.resortIds);
  const relatedCollections = getRelatedCollections(collection);

  return { collection, resorts, relatedCollections };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [{ title: "Collection Not Found | Premier Resort Travel" }];
  }

  return [
    { title: data.collection.seoTitle },
    {
      name: "description",
      content: data.collection.seoDescription,
    },
    { property: "og:title", content: data.collection.seoTitle },
    { property: "og:description", content: data.collection.seoDescription },
    { property: "og:image", content: data.collection.heroImage },
  ];
}

export default function CollectionPage({ loaderData, params }: Route.ComponentProps) {
  const fallbackCollection = params.slug ? findCollectionBySlug(params.slug) : undefined;
  const collection = loaderData?.collection ?? fallbackCollection;

  if (!collection) {
    return (
      <main className="page-shell">
        <section className="collection-hero-copy">
          <p className="eyebrow">Collection Not Found</p>
          <h1>We could not find that collection.</h1>
          <a className="button button-primary" href="/collections">
            Browse Collections
          </a>
        </section>
      </main>
    );
  }

  const resorts = loaderData?.resorts ?? resortsForCollection(collection.resortIds);
  const relatedCollections = loaderData?.relatedCollections ?? getRelatedCollections(collection);
  const collectionUrl = `https://premierresorttravels.com/collections/${collection.slug}`;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.title,
    description: collection.seoDescription,
    url: collectionUrl,
    image: collection.heroImage,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: resorts.map((resort, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Resort",
          name: resort.name,
          image: resort.image,
          address: {
            "@type": "PostalAddress",
            addressCountry: resort.country,
            addressLocality: resort.destination,
          },
          url: `https://premierresorttravels.com/properties/${resort.slug}`,
        },
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://premierresorttravels.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Collections",
        item: "https://premierresorttravels.com/collections",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: collection.title,
        item: collectionUrl,
      },
    ],
  };

  return (
    <main className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="collection-hero">
        <div className="collection-hero-image">
          <img
            src={collection.heroImage}
            alt={collection.title}
            decoding="async"
            sizes="(max-width: 1100px) 100vw, 52vw"
          />
        </div>
        <div className="collection-hero-copy">
          <p className="eyebrow">{collection.featuredBadge ?? "Resort Collection"}</p>
          <h1>{collection.title}</h1>
          <p className="lede">{collection.description}</p>
          <div className="collection-highlight-list" aria-label="Collection tags">
            {collection.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="feature-badge">
                {tag.replaceAll("-", " ")}
              </span>
            ))}
          </div>
          <div className="hero-actions">
            <a className="button button-primary" href="#collection-resorts">
              View Resorts
            </a>
            <a className="button button-secondary" href="/?popup=start">
              Plan This Style
            </a>
          </div>
        </div>
      </section>

      <section className="property-details">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Overview</p>
            <h2>Why this collection helps narrow the right resort faster</h2>
          </div>
          <p className="section-copy">
            Instead of browsing by map alone, this collection starts with how the trip should feel
            and then surfaces resorts that naturally fit that style.
          </p>
        </div>

        <div className="collection-summary-grid">
          <article className="collection-summary-card">
            <span>Resorts</span>
            <strong>{resorts.length}</strong>
            <p>Curated stays in this travel style.</p>
          </article>
          <article className="collection-summary-card">
            <span>Best First Filter</span>
            <strong>{collection.filters[0] ?? "Style"}</strong>
            <p>Use this lens to start comparing resort fit.</p>
          </article>
          <article className="collection-summary-card">
            <span>Related Style</span>
            <strong>{relatedCollections[0]?.title ?? resortCollections[0].title}</strong>
            <p>A nearby collection worth comparing before you inquire.</p>
          </article>
        </div>

        {collection.note ? <p className="collection-note">{collection.note}</p> : null}
      </section>

      <section className="portfolio-section accent-gold" id="collection-resorts">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Resort Matches</p>
            <h2>Featured resorts in this collection</h2>
          </div>
          <p className="section-copy">
            Open a resort page for more detail, or start planning and we will help identify the
            strongest fit for your dates and travelers.
          </p>
        </div>

        <div className="portfolio-grid">
          {resorts.map((resort) => (
            <article key={resort.id} className="portfolio-card">
              <div className="portfolio-image-shell">
                <img
                  className="destination-image"
                  src={resort.image}
                  alt={resort.name}
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 1100px) 100vw, 25vw"
                />
              </div>
              <div className="portfolio-meta">
                <span className="feature-badge">{resort.brand}</span>
                <p className="card-region">{resort.destination}</p>
              </div>
              <h3>{resort.name}</h3>
              <p>{resort.highlight}</p>
              <div className="collection-highlight-list">
                {resort.adultsOnly ? <span className="tier-pill">Adults Only</span> : null}
                {resort.familyFriendly ? <span className="tier-pill">Family Friendly</span> : null}
                {resort.seaView ? <span className="tier-pill">Sea View</span> : null}
              </div>
              <div className="card-actions card-actions-inline">
                <a className="button button-secondary" href={`/properties/${resort.slug}`}>
                  Explore Resort
                </a>
                <a className="text-link" href={`/?popup=start&note=${encodeURIComponent(collection.title)}`}>
                  Start Planning
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="quote-section">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Questions Travelers Ask</p>
            <h2>Helpful answers before you choose a resort</h2>
          </div>
        </div>

        <div className="inquiry-list">
          {collection.faqs.map((item) => (
            <article key={item.question} className="planning-card">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="property-details">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Keep Comparing</p>
            <h2>Related collections</h2>
          </div>
          <p className="section-copy">
            The best fit is often one collection over. Compare these before narrowing the final
            resort shortlist.
          </p>
        </div>

        <div className="collection-nearby-grid">
          {relatedCollections.map((item) => (
            <a key={item.id} className="collection-nearby-card" href={`/collections/${item.slug}`}>
              <img
                src={item.featuredImage}
                alt=""
                loading="lazy"
                decoding="async"
                sizes="(max-width: 1100px) 100vw, 26vw"
              />
              <div className="collection-nearby-copy">
                <p className="eyebrow">{item.filters[0] ?? "Collection"}</p>
                <strong>{item.title}</strong>
                <span>{item.shortDescription}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="hotel-collections-cta" aria-label="Plan a collection trip">
        <div className="hotel-collections-cta-icon" aria-hidden="true">✦</div>
        <div>
          <h2>Want help choosing within {collection.title}?</h2>
          <p>We will compare the best-fit resorts around your dates, travelers, and priorities.</p>
        </div>
        <a className="button button-primary" href={`/?popup=start&note=${encodeURIComponent(collection.title)}`}>
          Start Planning
        </a>
      </section>
    </main>
  );
}
