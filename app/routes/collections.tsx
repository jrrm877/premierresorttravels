import { collectionIndexCollections } from "../data/collections";
import { resortsForCollection } from "../data/resorts";
import type { Route } from "./+types/collections";

export function loader(_: Route.LoaderArgs) {
  return { collections: collectionIndexCollections };
}

export function meta(_: Route.MetaArgs) {
  const title = "Luxury Resort Collections | Premier Resort Travel";
  const description = "Browse Premier Resort Travel hotel collections including Palace Resorts, Le Blanc, Moon Palace, Baglioni Hotels, and Baglioni Resorts.";
  const url = "https://premierresorttravels.com/collections";
  const image = "https://premierresorttravels.com/images/catalog/family-resort-pool.jpg";
  return [
    { title },
    { tagName: "link", rel: "canonical", href: url },
    { name: "description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Premier Resort Travel" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:alt", content: "A luxury resort collection curated by Premier Resort Travel" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
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
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: collectionIndexCollections.length,
      itemListElement: collectionIndexCollections.map((collection, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: collection.title,
        url: `https://premierresorttravels.com/collections/${collection.slug}`,
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

      <section className="collections-style-section" aria-labelledby="vacation-style-heading">
        <div className="section-heading section-heading-stack">
          <p className="eyebrow">Start With Your Vacation Style</p>
          <h2 id="vacation-style-heading">What kind of getaway are you dreaming of?</h2>
          <p className="section-copy">You don't need to know a resort name. Choose the experience you want and we'll help match you with the right stay.</p>
        </div>
        <div className="resort-collections-grid">
          {[
            { title: "Family Vacations", description: "Pools, activities and space for everyone.", href: "/collections/family-friendly" },
            { title: "Adults-Only Escapes", description: "Relaxed retreats, couples' time and elevated dining.", href: "/collections/adults-only" },
            { title: "Honeymoons & Romance", description: "Celebrate together with a stay designed for two.", href: "/collections/honeymoons" },
            { title: "Destination Weddings", description: "Explore resort celebrations with advisor guidance.", href: "/collections/destination-weddings" },
            { title: "Luxury All-Inclusive", description: "Discover premium resort experiences and inclusions.", href: "/collections/ultra-luxury" },
          ].map((style) => (
            <a className="planning-card" key={style.title} href={style.href} style={{ display: "flex", flexDirection: "column", gap: "0.7rem", minHeight: 170 }}>
              <h3 style={{ margin: 0 }}>{style.title}</h3>
              <p style={{ margin: 0, flex: 1 }}>{style.description}</p>
              <span className="text-link">Explore options →</span>
            </a>
          ))}
        </div>
      </section>

      <section className="collections-style-section" aria-labelledby="collections-grid-heading">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Curated Collections</p>
            <h2 id="collections-grid-heading">Find your perfect resort collection.</h2>
          </div>
          <p className="section-copy">
            Explore five carefully selected hotel and resort collections. Choose a brand to discover destinations, properties, and personalized travel options.
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
        <a className="button button-primary" href="/quote?origin=collections">
          Start Planning
        </a>
      </section>
    </main>
  );
}
