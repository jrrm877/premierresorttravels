import { findPropertyBySlug } from "../lib/property-data";
import type { Route } from "./+types/collections";

type IconName = "star" | "badge" | "headset" | "heart" | "palm" | "gift" | "gem" | "globe";

const hotelCollections = [
  {
    title: "Palace Resorts",
    logo: "/images/logo-palace-resorts-clean.png",
    alt: "Palace Resorts",
    body: "All-inclusive luxury resorts for families, couples, and groups in paradise.",
    href: "/collections/palace-resorts",
    tone: "sage",
  },
  {
    title: "Le Blanc Spa Resorts",
    logo: "/images/logo-le-blanc-official.png",
    alt: "Le Blanc Spa Resorts",
    body: "Adults-only, all-inclusive resorts where luxury, tranquility, and service come together.",
    href: "/collections/le-blanc-spa-resorts",
    tone: "linen",
  },
  {
    title: "Moon Palace The Grand",
    logo: "/images/logo-moon-palace-official.png",
    alt: "Moon Palace",
    body: "Exceptional all-inclusive resorts with endless amenities and elevated experiences.",
    href: "/collections/moon-palace",
    tone: "mist",
  },
  {
    title: "Baglioni Hotels & Resorts",
    logo: "/images/logo-baglioni-warm.svg",
    alt: "Baglioni Hotels & Resorts",
    body: "Timeless Italian elegance in the world's most captivating destinations.",
    href: "/collections/baglioni-city-hotels",
    tone: "rose",
  },
  {
    title: "Bella Gio Resorts",
    wordmark: "Bella Gio Resorts",
    body: "Luxury all-inclusive resorts with a passion for unforgettable experiences.",
    href: "/collections/palace-resorts",
    tone: "sand",
  },
  {
    title: "Cozumel Palace",
    wordmark: "Cozumel Palace",
    body: "A family-friendly all-inclusive resort on the beautiful island of Cozumel.",
    href: "/properties/cozumel-palace",
    tone: "blue",
  },
];

const bookingReasons: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "star",
    title: "Preferred Partner",
    body: "We are preferred partners with these top hotel collections.",
  },
  {
    icon: "badge",
    title: "Exclusive Perks",
    body: "Enjoy added value such as room upgrades, resort credits, and more.",
  },
  {
    icon: "headset",
    title: "Expert Guidance",
    body: "We know these brands inside and out and will match you perfectly.",
  },
  {
    icon: "heart",
    title: "Personalized Service",
    body: "Your vacation is tailored to you, from start to finish.",
  },
];

const collectionFilters = ["All Collections", "Palace Resorts", "Le Blanc", "Moon Palace", "Baglioni", "Bella Gio", "Cozumel Palace"];

const featuredResortSlugs = [
  "moon-palace-the-grand-cancun",
  "le-blanc-spa-resort-los-cabos",
  "moon-palace-jamaica",
  "baglioni-hotel-regina",
];

const featuredResorts = featuredResortSlugs.map((slug) => {
  const property = findPropertyBySlug(slug);

  return {
    slug,
    name: property?.name ?? slug,
    brand: property?.brand ?? "Premier Resort Travel",
    location: property?.location ?? "",
    description: property?.description ?? "A polished luxury stay selected for Premier Resort Travel clients.",
    image: property?.image ?? "/images/home-about-gallery-main.jpg",
  };
});

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Hotel Collections | Premier Resort Travel" },
    {
      name: "description",
      content:
        "Explore Premier Resort Travel's curated hotel collections, including Palace Resorts, Le Blanc, Moon Palace, Baglioni, Cozumel Palace, and luxury resort brands.",
    },
  ];
}

function CollectionIcon({ name }: { name: IconName }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" focusable="false">
      {name === "star" && (
        <path {...common} d="m24 6 5.3 10.8 12 1.7-8.7 8.5 2.1 12-10.7-5.6L13.3 39l2.1-12-8.7-8.5 12-1.7L24 6Z" />
      )}
      {name === "badge" && (
        <>
          <path {...common} d="M24 5 30 9l7 .9 1.1 6.9L42 23l-3.9 6.2-1.1 6.9-7 .9-6 4-6-4-7-.9-1.1-6.9L6 23l3.9-6.2 1.1-6.9 7-.9 6-4Z" />
          <path {...common} d="m17.5 24 4.2 4.2 8.8-9" />
        </>
      )}
      {name === "headset" && (
        <>
          <path {...common} d="M10 26v-4a14 14 0 0 1 28 0v4" />
          <path {...common} d="M10 26c0-2.2 1.8-4 4-4h2v12h-2c-2.2 0-4-1.8-4-4v-4ZM38 26c0-2.2-1.8-4-4-4h-2v12h2c2.2 0 4-1.8 4-4v-4Z" />
          <path {...common} d="M32 38h-5" />
        </>
      )}
      {name === "heart" && (
        <path {...common} d="M24 39S9 30.5 9 18.8C9 13.5 12.4 10 17 10c2.8 0 5.4 1.5 7 4 1.6-2.5 4.2-4 7-4 4.6 0 8 3.5 8 8.8C39 30.5 24 39 24 39Z" />
      )}
      {name === "palm" && (
        <>
          <path {...common} d="M24 41c1.2-8.8.9-17.2-1-25" />
          <path {...common} d="M23 16c-5.5-4.8-10.2-5.9-14-3.2 5.1.2 9.8 1.9 14 5.2" />
          <path {...common} d="M23 16c-1.6-6 1.1-9.8 8.2-11.3-2.1 4.6-4.8 8.3-8.2 11.3" />
          <path {...common} d="M24 17c5.7-4.1 10.7-4.5 15-1.2-5.6-.1-10.6 1.2-15 4" />
          <path {...common} d="M23 18c-6.2 1-10.1 4.3-11.7 9.8 5.7-4.3 10.2-6.1 13.7-5.5" />
        </>
      )}
      {name === "gift" && (
        <>
          <path {...common} d="M8 18h32v22H8zM6 18h36v8H6zM24 18v22" />
          <path {...common} d="M24 18c-7 0-10-2-10-5 0-2 1.7-4 4-4 3 0 5 4 6 9ZM24 18c7 0 10-2 10-5 0-2-1.7-4-4-4-3 0-5 4-6 9Z" />
        </>
      )}
      {name === "gem" && (
        <>
          <path {...common} d="m8 17 8-9h16l8 9-16 24L8 17Z" />
          <path {...common} d="M8 17h32M16 8l8 33 8-33" />
        </>
      )}
      {name === "globe" && (
        <>
          <circle {...common} cx="24" cy="24" r="16" />
          <path {...common} d="M8 24h32M24 8c5 4.4 7.5 9.7 7.5 16S29 35.6 24 40c-5-4.4-7.5-9.7-7.5-16S19 12.4 24 8Z" />
        </>
      )}
    </svg>
  );
}

export default function CollectionsIndexPage() {
  return (
    <main className="hotel-collections-page">
      <section className="hotel-collections-hero" aria-labelledby="hotel-collections-title">
        <div className="hotel-collections-hero-copy">
          <p className="eyebrow">Hotel Collections</p>
          <h1 id="hotel-collections-title">The world's most exceptional hotel brands.</h1>
          <p className="hotel-collections-script">Curated for unforgettable stays.</p>
          <p>
            From all-inclusive luxury to boutique elegance, explore the hotel collections we know,
            love, and trust, so you can travel with confidence and experience the best.
          </p>
        </div>
        <div className="hotel-collections-hero-image">
          <img
            src="/images/home-about-gallery-main.jpg"
            alt="Luxury resort pool at sunset"
            decoding="async"
            fetchPriority="high"
          />
        </div>
      </section>

      <section className="hotel-collections-brand-section" aria-labelledby="hotel-collections-brand-heading">
        <div className="hotel-collections-section-title">
          <h2 id="hotel-collections-brand-heading">Explore Our Hotel Collections</h2>
        </div>

        <div className="hotel-collections-brand-grid">
          {hotelCollections.map((collection) => (
            <a
              key={collection.title}
              className={`hotel-collection-brand-card ${collection.tone}`}
              href={collection.href}
            >
              <div className="hotel-collection-logo-box">
                {"logo" in collection ? (
                  <img src={collection.logo} alt={collection.alt} loading="lazy" decoding="async" />
                ) : (
                  <strong>{collection.wordmark}</strong>
                )}
              </div>
              <p>{collection.body}</p>
              <span>View Collection -&gt;</span>
            </a>
          ))}
        </div>
      </section>

      <section className="hotel-collections-why" aria-labelledby="hotel-collections-why-heading">
        <div className="hotel-collections-why-copy">
          <h2 id="hotel-collections-why-heading">Why Book With Us</h2>
          <div className="hotel-collections-benefit-grid">
            {bookingReasons.map((reason) => (
              <article key={reason.title} className="hotel-collections-benefit">
                <div className="hotel-collections-benefit-icon">
                  <CollectionIcon name={reason.icon} />
                </div>
                <h3>{reason.title}</h3>
                <p>{reason.body}</p>
              </article>
            ))}
          </div>
        </div>
        <img
          className="hotel-collections-why-image"
          src="/images/home-about-gallery-coast.jpg"
          alt="Relaxing resort terrace overlooking the ocean"
          loading="lazy"
          decoding="async"
        />
      </section>

      <section className="hotel-collections-featured" aria-labelledby="hotel-collections-featured-heading">
        <div className="hotel-collections-section-title">
          <h2 id="hotel-collections-featured-heading">Featured Resorts By Collection</h2>
        </div>

        <div className="hotel-collections-filter-row" aria-label="Featured resort filters">
          {collectionFilters.map((filter, index) => (
            <button key={filter} className={index === 0 ? "is-active" : ""} type="button">
              {filter}
            </button>
          ))}
        </div>

        <div className="hotel-collections-resort-grid">
          {featuredResorts.map((resort) => (
            <a key={resort.slug} className="hotel-collections-resort-card" href={`/properties/${resort.slug}`}>
              <img src={resort.image} alt={resort.name} loading="lazy" decoding="async" />
              <div>
                <p className="eyebrow">{resort.brand}</p>
                <h3>{resort.name}</h3>
                <p>{resort.description}</p>
                <span>View Resort -&gt;</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="hotel-collections-cta" aria-label="Plan a collection trip">
        <div className="hotel-collections-cta-icon">
          <CollectionIcon name="palm" />
        </div>
        <div>
          <h2>Not sure which hotel collection is right for you?</h2>
          <p>We'll help you find the perfect resort and elevate every detail.</p>
        </div>
        <a className="button button-primary" href="/?popup=start">
          Let's Plan Together
        </a>
      </section>
    </main>
  );
}
