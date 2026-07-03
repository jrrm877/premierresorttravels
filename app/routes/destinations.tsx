import type { CSSProperties } from "react";
import { findPropertyBySlug } from "../lib/property-data";
import type { Route } from "./+types/destinations";

const imageFor = (slug: string, fallback: string) => findPropertyBySlug(slug)?.image ?? fallback;

const destinationCards = [
  {
    name: "Cancun, Mexico",
    count: "6 resorts",
    image: imageFor("moon-palace-the-grand-cancun", "/images/home-style-family-beach.jpg"),
    resorts: ["Moon Palace", "Beach Palace", "Sun Palace", "Le Blanc Cancun"],
    href: "/collections/palace-resorts",
  },
  {
    name: "Riviera Maya",
    subtitle: "Playa del Carmen",
    count: "1 resort",
    image: imageFor("playacar-palace", "/images/home-about-gallery-coast.jpg"),
    resorts: ["Playacar Palace"],
    href: "/properties/playacar-palace",
  },
  {
    name: "Cozumel, Mexico",
    count: "1 resort",
    image: imageFor("cozumel-palace", "/images/home-style-adventure.jpg"),
    resorts: ["Cozumel Palace"],
    href: "/properties/cozumel-palace",
  },
  {
    name: "Jamaica",
    count: "1 resort",
    image: imageFor("moon-palace-jamaica", "/images/home-style-family-beach.jpg"),
    resorts: ["Moon Palace Jamaica"],
    href: "/properties/moon-palace-jamaica",
  },
  {
    name: "Punta Cana",
    subtitle: "Dominican Republic",
    count: "1 resort",
    image: imageFor("moon-palace-the-grand-punta-cana", "/images/home-style-adults-only.jpg"),
    resorts: ["Moon Palace The Grand Punta Cana"],
    href: "/properties/moon-palace-the-grand-punta-cana",
  },
  {
    name: "Los Cabos, Mexico",
    count: "1 resort",
    image: imageFor("le-blanc-spa-resort-los-cabos", "/images/home-about-gallery-coast.jpg"),
    resorts: ["Le Blanc Spa Resort Los Cabos"],
    href: "/properties/le-blanc-spa-resort-los-cabos",
  },
  {
    name: "Italy",
    count: "Baglioni Collection",
    image: imageFor("baglioni-hotel-luna", "/images/home-style-europe.jpg"),
    resorts: ["Venice", "Rome", "Milan", "Puglia", "Sardinia"],
    href: "/collections/european-icon-hotels",
  },
  {
    name: "Maldives",
    count: "Baglioni Collection",
    image: imageFor("baglioni-resort-maldives", "/images/home-about-gallery-coast.jpg"),
    resorts: ["Baglioni Resort Maldives"],
    href: "/properties/baglioni-resort-maldives",
  },
];

const brandCards = [
  {
    name: "Moon Palace",
    label: "Family Luxury",
    image: imageFor("moon-palace-the-grand-cancun", "/images/home-style-family-beach.jpg"),
    copy: "Big-resort energy with broad dining, activities, and unforgettable memories.",
    href: "/collections/moon-palace",
  },
  {
    name: "Le Blanc",
    label: "Adults Only Luxury",
    image: imageFor("le-blanc-spa-resort-cancun", "/images/home-style-spa.jpg"),
    copy: "Elevated adults-only resorts with service, spa, and fine dining.",
    href: "/collections/le-blanc-spa-resorts",
  },
  {
    name: "Palace Resorts",
    label: "Classic All-Inclusive",
    image: imageFor("beach-palace", "/images/home-style-adults-only.jpg"),
    copy: "Timeless resorts in iconic beach destinations with everything you need.",
    href: "/collections/palace-resorts",
  },
  {
    name: "Baglioni",
    label: "European & Island Escapes",
    image: imageFor("baglioni-hotel-luna", "/images/home-style-europe.jpg"),
    copy: "Luxury hotels in captivating cities, coastlines, and islands.",
    href: "/collections/baglioni-city-hotels",
  },
];

const resortMatches = [
  ["Traveling with Kids", "Moon Palace The Grand Cancun", "/properties/moon-palace-the-grand-cancun"],
  ["Adults Only Escape", "Le Blanc Cancun", "/properties/le-blanc-spa-resort-cancun"],
  ["Best for Diving", "Cozumel Palace", "/properties/cozumel-palace"],
  ["Closest to Airport", "Beach Palace", "/properties/beach-palace"],
  ["Playa del Carmen Access", "Playacar Palace", "/properties/playacar-palace"],
  ["Newest in Punta Cana", "Moon Palace The Grand Punta Cana", "/properties/moon-palace-the-grand-punta-cana"],
];

const memoryImages = [
  imageFor("sun-palace", "/images/home-style-romantic-dinner.jpg"),
  "/images/home-about-gallery-coast.jpg",
  "/images/about-north-america-cozumel-south-dive.jpeg",
  "/images/home-style-romantic-dinner.jpg",
  "/images/home-style-family-beach.jpg",
  imageFor("moon-palace-jamaica", "/images/home-about-gallery-main.jpg"),
];

const bookingBenefits = [
  {
    icon: "islands",
    title: "Resort Matching",
    copy: "We match you with the perfect resort that fits your style and budget.",
  },
  {
    icon: "gift",
    title: "Exclusive Perks",
    copy: "We monitor promotions and unlock advisor perks when available.",
  },
  {
    icon: "diamond",
    title: "VIP Connections",
    copy: "Access added-value benefits and preferred resort relationships.",
  },
  {
    icon: "support",
    title: "Support Every Step",
    copy: "We're here before, during, and after your trip for total peace of mind.",
  },
  {
    icon: "toast",
    title: "Weddings & Groups",
    copy: "From intimate weddings to large group travel, we make it seamless.",
  },
  {
    icon: "globe",
    title: "Travel Made Personal",
    copy: "Every itinerary is curated with care, based on what matters to you.",
  },
];

const mapDestinations = [
  { ...destinationCards[0], dotX: "25.9%", dotY: "38.4%" },
  { ...destinationCards[1], dotX: "25.8%", dotY: "38.5%" },
  { ...destinationCards[2], dotX: "25.9%", dotY: "38.7%" },
  { ...destinationCards[3], dotX: "28.5%", dotY: "39.9%" },
  { ...destinationCards[4], dotX: "31%", dotY: "39.7%" },
  { ...destinationCards[5], dotX: "19.5%", dotY: "37.3%" },
  { ...destinationCards[6], dotX: "53.5%", dotY: "26.2%" },
  { ...destinationCards[7], dotX: "70.3%", dotY: "48.2%" },
];

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Destinations | Premier Resort Travel" },
    {
      name: "description",
      content:
        "Explore curated resort destinations across Cancun, Riviera Maya, Cozumel, Jamaica, Punta Cana, Los Cabos, Italy, and the Maldives.",
    },
  ];
}

function BookingBenefitIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "gift":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M7 18h34v23H7z" />
          <path d="M5 12h38v8H5zM24 12v29M15 12c-4-6 4-10 9 0M33 12c4-6-4-10-9 0" />
        </svg>
      );
    case "diamond":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M8 17 16 8h16l8 9-16 23Z" />
          <path d="M8 17h32M16 8l8 9 8-9M16 17l8 23 8-23" />
        </svg>
      );
    case "support":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M12 27v-5a12 12 0 0 1 24 0v5" />
          <path d="M12 27h-2a4 4 0 0 1 0-8h2v12M36 27h2a4 4 0 0 0 0-8h-2v12M31 34c-2 3-5 5-9 5h-3" />
          <path d="M18 22c2-3 6-3 8 0 2-3 7-1 7 3 0 5-7 9-11 12-4-3-11-7-11-12 0-4 5-6 7-3Z" />
        </svg>
      );
    case "toast":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M15 11h10l-2 16a5 5 0 0 1-10 0Z" />
          <path d="M20 32v8M15 40h10M31 11h10l-2 16a5 5 0 0 1-10 0Z" />
          <path d="M36 32v8M31 40h10M25 18c3 0 5 2 6 4" />
        </svg>
      );
    case "globe":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="17" />
          <path d="M7 24h34M24 7c5 5 8 11 8 17s-3 12-8 17M24 7c-5 5-8 11-8 17s3 12 8 17" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M10 35c8-5 20-5 28 0M12 31c4-7 8-14 12-21 4 7 8 14 12 21" />
          <path d="M24 10v21M14 20c3-2 7-2 10 0 3-2 7-2 10 0" />
          <path d="M8 38h32" />
        </svg>
      );
  }
}

export default function DestinationsPage() {
  return (
    <main className="destinations-page">
      <section
        className="destinations-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(255, 252, 247, 0.72), rgba(255, 252, 247, 0.1)), url(${imageFor("le-blanc-spa-resort-cancun", "/images/home-style-adults-only.jpg")})`,
        }}
      >
        <div>
          <p className="eyebrow">Destinations</p>
          <h1>The Premier Resort Travel collection</h1>
          <p>Mexico. The Caribbean. Europe. Island escapes. Resort stays chosen around the way you want the trip to feel.</p>
          <a className="button button-primary" href="#destination-grid">Find Your Resort</a>
        </div>
      </section>

      <section className="destinations-panel" id="destination-grid" aria-labelledby="destination-grid-heading">
        <div className="destinations-side-heading">
          <p className="eyebrow">Browse By Destination</p>
          <h2 id="destination-grid-heading">Where will your next vacation take you?</h2>
        </div>
        <div className="destination-tile-grid">
          {destinationCards.map((destination) => (
            <a key={destination.name} className="destination-tile-card" href={destination.href}>
              <img src={destination.image} alt="" loading="lazy" decoding="async" />
              <div>
                <h3>{destination.name}</h3>
                {destination.subtitle ? <p className="destination-subtitle">{destination.subtitle}</p> : null}
                <span>{destination.count}</span>
                <p>{destination.resorts.join(" · ")}</p>
                <strong>Explore -&gt;</strong>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="destinations-panel destinations-brand-panel" aria-labelledby="destination-brands-heading">
        <div className="destinations-side-heading">
          <p className="eyebrow">Browse By Brand</p>
          <h2 id="destination-brands-heading">Four brands. Endless experiences.</h2>
        </div>
        <div className="destination-brand-grid">
          {brandCards.map((brand) => (
            <a key={brand.name} className="destination-brand-card" href={brand.href}>
              <img src={brand.image} alt="" loading="lazy" decoding="async" />
              <div>
                <h3>{brand.name}</h3>
                <strong>{brand.label}</strong>
                <p>{brand.copy}</p>
                <span>Explore Collection -&gt;</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="destinations-panel destinations-match-panel" aria-labelledby="destination-match-heading">
        <div className="destinations-side-heading">
          <p className="eyebrow">Find The Right Resort For You</p>
          <h2 id="destination-match-heading">Which resort is right for your trip?</h2>
        </div>
        <div className="destination-match-grid">
          {resortMatches.map(([label, resort, href]) => (
            <a key={label} href={href}>
              <span>{label}</span>
              <strong>{resort}</strong>
            </a>
          ))}
        </div>
      </section>

      <section className="destinations-map-section" aria-labelledby="destinations-map-heading">
        <div className="destinations-side-heading">
          <p className="eyebrow">Explore The Collection</p>
          <h2 id="destinations-map-heading">Our resorts around the world</h2>
          <p>Hover a destination in the live site to explore the available resort collection.</p>
        </div>
        <div className="destinations-map-card" aria-label="Destination map overview">
          {mapDestinations.map((destination) => (
            <a
              key={destination.name}
              className="map-dot"
              href={destination.href}
              style={{
                "--dot-x": destination.dotX,
                "--dot-y": destination.dotY,
              } as CSSProperties}
              aria-label={`Explore ${destination.name}`}
            />
          ))}
          <div className="map-legend" aria-label="Mapped destinations">
            {mapDestinations.map((destination) => (
              <a key={destination.name} href={destination.href} className="map-legend-item">
                <img src={destination.image} alt="" loading="lazy" decoding="async" />
                <span>{destination.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="destinations-memories" aria-labelledby="destination-memories-heading">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Real Guests, Real Memories</p>
            <h2 id="destination-memories-heading">Life at the resorts</h2>
          </div>
          <a className="button button-secondary" href="/traveler-stories">View More Stories</a>
        </div>
        <div className="destinations-memory-row">
          {memoryImages.map((image, index) => (
            <img key={`${image}-${index}`} src={image} alt="" loading="lazy" decoding="async" />
          ))}
        </div>
      </section>

      <section className="destinations-booking-panel" aria-label="Why book with Premier Resort Travel">
        <div className="destinations-booking-hero">
          <div className="destinations-booking-copy">
            <p className="eyebrow">Why Book With Premier Resort Travel?</p>
            <div className="booking-ornament" aria-hidden="true">
              <span />
              <strong>palm</strong>
              <span />
            </div>
            <h2>Personalized service. Unforgettable vacations.</h2>
            <p>
              We take the time to understand how you travel, then match you with the perfect resort
              and elevate every detail of your trip.
            </p>
            <em>You dream it. We make it effortless.</em>
          </div>
          <img
            src="/images/home-style-family-beach.jpg"
            alt="Family enjoying a beach vacation"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="destinations-benefit-grid">
          {bookingBenefits.map((benefit) => (
            <article key={benefit.title}>
              <div className="booking-benefit-icon">
                <BookingBenefitIcon icon={benefit.icon} />
              </div>
              <h3>{benefit.title}</h3>
              <span aria-hidden="true" />
              <p>{benefit.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="destinations-final-cta">
        <img src="/images/home-about-gallery-coast.jpg" alt="" loading="lazy" decoding="async" />
        <div>
          <h2>Still not sure which resort is right?</h2>
          <p>Tell us about your trip and we will help you choose the right destination and resort from the Premier Resort Travel collection.</p>
          <a className="button button-primary" href="/?popup=start">Plan My Trip</a>
        </div>
      </section>
    </main>
  );
}
