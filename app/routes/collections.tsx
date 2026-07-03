import { collectionCards, featuredCollections, portfolioSections } from "../lib/property-data";
import type { Route } from "./+types/collections";

const collectionFinderPaths = [
  {
    title: "Adults only",
    eyebrow: "Couples & Calm",
    body: "Quiet beachfront service, spa days, romance, and more polished dining.",
    href: "/collections/adults-only-resorts",
    image: "/images/home-style-adults-only.jpg",
  },
  {
    title: "Family resort week",
    eyebrow: "Kids, Groups & Ease",
    body: "Larger resorts with pools, activities, suites, and enough range for every age.",
    href: "/collections/family-flagship-resorts",
    image: "/images/home-style-family-beach.jpg",
  },
  {
    title: "Europe itinerary",
    eyebrow: "Cities & Icons",
    body: "Heritage hotels, cinematic arrivals, culture, food, and grand city stays.",
    href: "/collections/european-icon-hotels",
    image: "/images/home-style-europe.jpg",
  },
  {
    title: "Spa and reset",
    eyebrow: "Wellness Pace",
    body: "Restorative properties where service, slower mornings, and spa rhythm matter.",
    href: "/collections/le-blanc-spa-resorts",
    image: "/images/home-style-spa.jpg",
  },
];

const planningMoods = [
  {
    label: "Romance",
    detail: "Anniversaries, honeymoons, and quiet adults-only escapes.",
    href: "/collections/adults-only-resorts",
  },
  {
    label: "Family",
    detail: "Water parks, larger suites, broad dining, and easier group planning.",
    href: "/collections/family-flagship-resorts",
  },
  {
    label: "Beach",
    detail: "Classic all-inclusive resorts with strong coastal settings.",
    href: "/collections/palace-resorts",
  },
  {
    label: "Culture",
    detail: "European hotels where the city and the stay shape the memory.",
    href: "/collections/baglioni-city-hotels",
  },
  {
    label: "Luxury reset",
    detail: "Spa-forward stays and scenic resorts with a slower rhythm.",
    href: "/collections/baglioni-resorts",
  },
  {
    label: "Adventure",
    detail: "Diving, snorkeling, excursions, and destination-led beach trips.",
    href: "/collections/palace-resorts",
  },
];

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Travel Collections | Premier Resort Travel" },
    {
      name: "description",
      content:
        "Browse curated resort and hotel collections for adults-only escapes, family resorts, Palace Resorts, Moon Palace, Le Blanc, Baglioni city hotels, and Mediterranean stays.",
    },
  ];
}

export default function CollectionsIndexPage() {
  const brandCollections = featuredCollections.slice(0, 5);
  const styleCollections = featuredCollections.slice(5);

  return (
    <main className="page-shell collections-page">
      <section className="collections-index-hero">
        <div className="collections-index-hero-copy">
          <p className="eyebrow">Travel Collections</p>
          <h1>Choose the collection that matches the trip you want to take.</h1>
          <p className="lede">
            Compare the major resort and hotel styles in one dedicated place, then open the
            collection or property that feels like the strongest fit.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#featured-collections">
              Browse featured collections
            </a>
            <a className="button button-secondary" href="/#plan-trip">
              Request a quote
            </a>
          </div>
        </div>

        <div className="collections-index-hero-grid" aria-label="Collection highlights">
          {collectionCards.map((card) => (
            <a key={card.title} className="collections-index-hero-card" href={card.href}>
              <img src={card.image} alt={card.title} decoding="async" />
              <span>{card.title}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="collections-finder" aria-labelledby="collections-finder-heading">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Start Here</p>
            <h2 id="collections-finder-heading">Choose by the kind of trip you want</h2>
          </div>
          <p className="section-copy">
            These shortcuts are built around how travelers usually describe the vacation before they
            know the exact resort.
          </p>
        </div>

        <div className="collections-finder-grid">
          {collectionFinderPaths.map((path) => (
            <a key={path.title} className="collections-finder-card" href={path.href}>
              <img src={path.image} alt="" loading="lazy" decoding="async" />
              <div>
                <p className="eyebrow">{path.eyebrow}</p>
                <h3>{path.title}</h3>
                <p>{path.body}</p>
                <span>Explore -&gt;</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="collections-mood-section" aria-labelledby="collections-mood-heading">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Browse By Mood</p>
            <h2 id="collections-mood-heading">Not sure where to start?</h2>
          </div>
          <p className="section-copy">
            Pick the trip feeling first. The right destination or resort is easier to narrow down
            once the mood is clear.
          </p>
        </div>

        <div className="collections-mood-grid">
          {planningMoods.map((mood) => (
            <a key={mood.label} href={mood.href}>
              <strong>{mood.label}</strong>
              <span>{mood.detail}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="collections-section" id="featured-collections">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Brand Collections</p>
            <h2>Explore by preferred resort brand</h2>
          </div>
          <p className="section-copy">
            Start with the resort families and hotel groups that shape the strongest shortlist.
          </p>
        </div>

        <div className="collections-index-grid">
          {brandCollections.map((collection) => (
            <a key={collection.slug} className="collections-index-card" href={`/collections/${collection.slug}`}>
              <img
                src={collection.image}
                alt={collection.title}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 900px) 100vw, 33vw"
              />
              <div className="collections-index-card-copy">
                <p className="eyebrow">{collection.eyebrow}</p>
                <h3>{collection.title}</h3>
                <p>{collection.description}</p>
                <div className="collection-highlight-list">
                  {collection.highlights.slice(0, 2).map((highlight) => (
                    <span key={highlight} className="feature-badge">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="collections-section collections-style-section" aria-labelledby="collections-style-heading">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Trip Style Collections</p>
            <h2 id="collections-style-heading">Shortcut to the right kind of stay</h2>
          </div>
          <p className="section-copy">
            These collections cut across brands when the traveler already knows the type of escape
            they want.
          </p>
        </div>

        <div className="collections-style-grid">
          {styleCollections.map((collection) => (
            <a key={collection.slug} className="collections-style-card" href={`/collections/${collection.slug}`}>
              <img src={collection.image} alt="" loading="lazy" decoding="async" />
              <div>
                <p className="eyebrow">{collection.eyebrow}</p>
                <h3>{collection.title}</h3>
                <p>{collection.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="portfolio-tabs-shell collections-index-shelves" aria-label="All property shelves">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Property Shelves</p>
            <h2>Browse every resort and hotel shelf without the homepage scroll</h2>
          </div>
          <p className="section-copy">
            Each shelf links into a deeper collection page and gives you a quick first look at the
            properties inside it.
          </p>
        </div>

        <div className="collections-index-shelf-list">
          {portfolioSections.map((section) => (
            <article key={section.id} className={`collections-index-shelf ${section.accent}`}>
              <div className="collection-preview-header">
                <div>
                  <p className="eyebrow">{section.eyebrow}</p>
                  <h3>{section.tab}</h3>
                </div>
                <div className="collection-preview-intro">
                  <p>{section.description}</p>
                  <a className="collection-preview-link" href={section.href}>
                    Open {section.tab}
                  </a>
                </div>
              </div>

              <div className="collection-preview-grid">
                {section.properties.map((property) => (
                  <a key={property.slug} className="collection-preview-card" href={`/properties/${property.slug}`}>
                    <img
                      src={property.image}
                      alt={property.name}
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 900px) 100vw, 20vw"
                    />
                    <div className="collection-preview-copy">
                      <span>{property.tag}</span>
                      <strong>{property.name}</strong>
                      <p>{property.location}</p>
                    </div>
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="collections-planning-cta" aria-label="Personalized collection help">
        <div>
          <p className="eyebrow">Need The Shortlist?</p>
          <h2>Tell us your trip style and we will help narrow the right collection.</h2>
        </div>
        <a className="button button-primary" href="/?popup=start">
          Start Planning
        </a>
      </section>
    </main>
  );
}
