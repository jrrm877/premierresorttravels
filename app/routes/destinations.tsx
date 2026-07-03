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
        <div>
          <p className="eyebrow">Why Book With Premier Resort Travel?</p>
          <h2>Personalized service. Unforgettable vacations.</h2>
        </div>
        <div className="destinations-benefit-grid">
          <span>Resort matching that fits your travel style</span>
          <span>Promotions and perks when available</span>
          <span>VIP connections and insider knowledge</span>
          <span>Support before, during, and after your trip</span>
          <span>Weddings and groups made simple</span>
          <span>Travel planning made personal</span>
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
