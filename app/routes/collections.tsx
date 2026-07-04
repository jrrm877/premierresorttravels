import { collectionIndexCollections } from "../data/collections";
import { resortsForCollection } from "../data/resorts";
import type { Route } from "./+types/collections";

export function loader(_: Route.LoaderArgs) {
  return { collections: collectionIndexCollections };
}

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Luxury Resort Collections | Premier Resort Travel" },
    {
      name: "description",
      content:
        "Browse Premier Resort Travel hotel collections including Palace Resorts, Le Blanc, Moon Palace, Baglioni Hotels, and Baglioni Resorts.",
    },
    { property: "og:title", content: "Luxury Resort Collections | Premier Resort Travel" },
    {
      property: "og:description",
      content:
        "Explore our focused collection of trusted luxury resort and hotel brands for all-inclusive beach vacations and European luxury stays.",
    },
    { property: "og:image", content: collectionIndexCollections[0]?.heroImage ?? "/images/home-about-gallery-main.jpg" },
  ];
}

export default function CollectionsIndexPage({ loaderData }: Route.ComponentProps) {
  const collections = loaderData?.collections ?? collectionIndexCollections;
  const heroCollections = collectionIndexCollections.slice(0, 3);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Luxury Resort Collections",
    description:
      "Curated Premier Resort Travel resort collections organized by trusted hotel brand.",
    url: "https://premierresorttravels.com/collections",
    hasPart: collectionIndexCollections.map((collection) => ({
      "@type": "CollectionPage",
      name: collection.title,
      url: `https://premierresorttravels.com/collections/${collection.slug}`,
    })),
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
    ],
  };

  return (
    <main className="collections-page page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="collections-index-hero" aria-labelledby="collections-title">
        <div className="collections-index-hero-copy">
          <p className="eyebrow">Resort Collections</p>
          <h1 id="collections-title">Explore our trusted hotel collections.</h1>
          <p className="lede">
            A focused edit of the brands we know, love, and trust: Palace Resorts, Le Blanc,
            Moon Palace, Baglioni Hotels, and Baglioni Resorts.
          </p>
          <a className="button button-primary" href="#collections-grid-heading">
            View Collections
          </a>
        </div>
        <div className="collections-index-hero-grid" aria-label="Featured resort collections">
          {heroCollections.map((collection) => (
            <a key={collection.id} className="collections-index-hero-card" href={`/collections/${collection.slug}`}>
              <img src={collection.featuredImage} alt="" decoding="async" />
              <span>{collection.title}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="collections-finder" aria-labelledby="collections-filter-heading">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Hotel Collections</p>
            <h2 id="collections-filter-heading">Five collection families. A clearer place to start.</h2>
          </div>
          <p className="section-copy">
            Instead of overwhelming travelers with every possible trip style, this page now keeps
            the collection layer centered on the brand families Premier Resort Travel works with most.
          </p>
        </div>
      </section>

      <section className="collections-style-section" aria-labelledby="collections-grid-heading">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Curated Collections</p>
            <h2 id="collections-grid-heading">Browse the hotel families we recommend first.</h2>
          </div>
          <p className="section-copy">
            Every card opens a dedicated collection page with resort matches, FAQs, related
            collections, and a simple inquiry path.
          </p>
        </div>

        <div className="resort-collections-grid">
          {collections.map((collection) => {
            const collectionResorts = resortsForCollection(collection.resortIds);

            return (
              <a key={collection.id} className="resort-collection-card" href={`/collections/${collection.slug}`}>
                <div className="resort-collection-card-image">
                  <img
                    src={collection.featuredImage}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 760px) 100vw, (max-width: 1180px) 50vw, 33vw"
                  />
                  {collection.featuredBadge ? <span>{collection.featuredBadge}</span> : null}
                </div>
                <div className="resort-collection-card-copy">
                  <p className="eyebrow">{collection.filters[0] ?? "Collection"}</p>
                  <h3>{collection.title}</h3>
                  <p>{collection.shortDescription}</p>
                  <div className="resort-collection-card-meta">
                    <span>{collectionResorts.length} resorts</span>
                    <strong>Explore -&gt;</strong>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <section className="hotel-collections-cta" aria-label="Plan a collection trip">
        <div className="hotel-collections-cta-icon" aria-hidden="true">✦</div>
        <div>
          <h2>Not sure which collection is right for you?</h2>
          <p>Tell us how you travel and we will narrow the right resort style, destination, and stay.</p>
        </div>
        <a className="button button-primary" href="/?popup=start">
          Start Planning
        </a>
      </section>
    </main>
  );
}
