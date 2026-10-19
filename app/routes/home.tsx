import { featuredCollection } from "../data/collections";
import { collectionCards, portfolioSections } from "../lib/property-data";
import { featuredTravelerStories } from "../lib/traveler-stories";
import type { Route } from "./+types/home";

const homepageHeroImage =
  "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/2eel4s41k15j9anvu6kp927m2e/800?angle=0";

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const hasLegacyInquiryQuery = url.searchParams.get("popup") === "start" || ["note", "fullName", "email"].some(key => url.searchParams.has(key));
  if (hasLegacyInquiryQuery) {
    const destination = new URL("/quote", url.origin);
    destination.searchParams.set("origin", "legacy-popup");
    for (const key of ["note", "fullName", "email"]) {
      const value = url.searchParams.get(key)?.trim();
      if (value) destination.searchParams.set(key, value);
    }
    return Response.redirect(destination.toString(), 301);
  }

  return null;
}

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Premier Resort Travel | Luxury Resorts, Family Escapes & Adults-Only Getaways" },
    { tagName: "link", rel: "canonical", href: "https://premierresorttravels.com/" },

    {
      name: "description",
      content:
        "Plan a luxury beach escape, family resort stay, or iconic hotel getaway with curated recommendations designed to make booking easier.",
    },
    { name: "robots", content: "index,follow" },
    { property: "og:title", content: "Premier Resort Travel" },
    {
      property: "og:description",
      content:
        "Browse beachfront resorts, adults-only retreats, family escapes, and iconic city stays curated for memorable travel.",
    },
  ];
}

const propertyHrefByName = new Map(
  portfolioSections.flatMap((section) =>
    section.properties.map((property) => [property.name, `/properties/${property.slug}`])
  )
);

type SearchDestination = {
  id: number;
  name: string;
  country: string;
  region: string | null;
  description: string | null;
  image_url: string | null;
  price_tier: string;
  tags: string | null;
  avg_rating: number | null;
};

type SearchResponse = {
  destinations: SearchDestination[];
  query: string;
  region: string;
  tier: string;
};

function formatTags(tags: string | null) {
  if (!tags) {
    return "bespoke travel";
  }

  try {
    const parsed = JSON.parse(tags) as string[];
    return parsed.join(" · ");
  } catch {
    return tags;
  }
}

const searchIdeas = ["all-inclusive", "adults-only", "family", "diving", "venice", "wellness"];
const catalogImage = (name: string) => `/images/catalog/${name}`;

const searchPaths = [
  {
    label: "Adults-only escapes",
    detail: "Quiet luxury, spa rituals, and polished beachfront stays.",
    value: "adults-only Cancun",
  },
  {
    label: "Family flagship resorts",
    detail: "Larger-format resorts with suites, activities, and built-in ease.",
    value: "family beach resort",
  },
  {
    label: "European city hotels",
    detail: "Romantic addresses and iconic stays for culture-rich itineraries.",
    value: "Venice hotel",
  },
  {
    label: "Spa and wellness retreats",
    detail: "Resorts where dining, service, and slower pacing lead the trip.",
    value: "wellness retreat",
  },
];

const proofPoints = [
  {
    value: "19",
    label: "remarkable stays",
    detail: "A curated collection of resorts and hotels worth narrowing down first.",
  },
  {
    value: "Couples, family, Europe",
    label: "trip styles covered",
    detail: "Built for adults-only escapes, family resort weeks, and iconic city stays.",
  },
  {
    value: "Advisor-ready",
    label: "next step built in",
    detail: "Browse, compare, and move into a real trip request without starting over.",
  },
];

const trustPoints = [
  {
    title: "Recommendations matched to the traveler",
    body: "We help narrow the right fit based on who is going, how the trip should feel, and what would make it easier to book with confidence.",
  },
  {
    title: "A shorter path from inspiration to shortlist",
    body: "Instead of sending people through endless options, the site is designed to surface the strongest resort style, region, and property match faster.",
  },
  {
    title: "Planning support that keeps momentum going",
    body: "When a stay looks promising, the next step is already in place: save the idea, send a note, or move straight into a trip inquiry.",
  },
];

const heroHighlights = [
  {
    label: "Adults-only serenity",
    name: "Le Blanc Spa Resort Cancun",
    image: collectionCards[0]?.image,
    href: "/collections/adults-only",
  },
  {
    label: "Family flagship",
    name: "Moon Palace The Grand - Cancun",
    image: collectionCards[1]?.image,
    href: "/collections/family-friendly",
  },
  {
    label: "European icon",
    name: "Baglioni Hotel Luna",
    image: collectionCards[2]?.image,
    href: "/collections/european-luxury",
  },
];

const travelStyleCards = [
  { title: "Family Vacations", image: "/images/home-style-family-beach.jpg", icon: "Family", style: "Family" },
  { title: "Adults-Only Escapes", image: "/images/home-style-adults-only.jpg", icon: "Palm", style: "Adults Only" },
  { title: "Romantic Getaways", image: "/images/home-style-romantic-dinner.jpg", icon: "Heart", style: "Romance" },
];

const partnerLogos = [
  {
    name: "Le Blanc Spa Resorts",
    image: "/images/logo-le-blanc-official.png",
    className: "partner-logo-le-blanc",
  },
  {
    name: "Moon Palace",
    image: "/images/logo-moon-palace-official.png",
    className: "partner-logo-moon-palace",
  },
  {
    name: "Palace Resorts",
    image: "/images/logo-palace-resorts-clean-240.webp",
    className: "partner-logo-palace-resorts",
  },
  {
    name: "Baglioni Hotels & Resorts",
    image: "/images/logo-baglioni-warm.svg",
    className: "partner-logo-baglioni",
  },
];
const homepageStories = featuredTravelerStories(6);

export default function Home() {
  return (
    <main className="luxe-home">
      <section
        className="luxe-hero"
        aria-label="Premier Resort Travel homepage"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(5, 15, 15, 0.86) 0%, rgba(12, 23, 23, 0.58) 42%, rgba(12, 23, 23, 0.1) 100%), url(${homepageHeroImage})`,
        }}
      >
        <div className="luxe-hero-copy">
          <h1>
            Your dream vacation,
            <span>without the planning stress.</span>
          </h1>
          <p>Tell us where you want to go—or let us help you decide. Get personalized resort options with no obligation to book.</p>
          <a className="button button-primary luxe-hero-cta" href="/quote">
            Get My Free Vacation Quote
          </a>
        </div>
      </section>

      <section className="luxe-style-section" id="travel-styles" aria-labelledby="travel-styles-heading">
        <p className="eyebrow">Browse By Experience</p>
        <h2 id="travel-styles-heading">Find the perfect kind of escape.</h2>
        <div className="luxe-style-grid">
          {travelStyleCards.map((style) => (
            <a
              key={style.title}
              className="luxe-style-card"
              href={`/quote?style=${encodeURIComponent(style.style)}`}
              aria-label={`Request a quote for ${style.title}`}
            >
              <picture>
              <source type="image/webp" srcSet={`${style.image.replace(/\.jpg$/, "")}-480.webp 480w, ${style.image.replace(/\.jpg$/, "")}-960.webp 960w`} sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 32vw" />
              <img src={style.image} alt="" loading="lazy" decoding="async" sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 32vw" />
            </picture>
              <span className="luxe-style-card-content"><strong>{style.title}</strong><span>Plan this getaway →</span></span>
            </a>
          ))}
        </div>
        <p style={{ textAlign: "center", marginTop: 24 }}><a href="/collections">Explore all resort collections →</a></p>
      </section>

      <section className="property-details luxe-home-searches" aria-labelledby="popular-resort-searches">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Start With Your Destination</p>
            <h2 id="popular-resort-searches">Find the right all-inclusive resort for your vacation</h2>
            <p>Compare family-friendly Cancun resorts, adults-only escapes, and romantic stays. Browse real resort details before requesting a personalized quote.</p>
          </div>
        </div>
        <div className="property-detail-grid">
          <article className="planning-card">
            <h3>Family-friendly Cancun resorts</h3>
            <p>Explore resorts with room options, activities, and amenities designed for families traveling together.</p>
            <a className="text-link" href="/collections/family-friendly">Explore family resorts →</a>
          </article>
          <article className="planning-card">
            <h3>Adults-only all-inclusive resorts</h3>
            <p>Discover couples-focused stays and relaxing resort experiences, including Le Blanc Spa Resort Cancun.</p>
            <a className="text-link" href="/collections/adults-only">Explore adults-only resorts →</a>
          </article>
          <article className="planning-card">
            <h3>Compare resorts before you book</h3>
            <p>Browse our resort collection, then share your dates and preferences for a tailored vacation quote.</p>
            <a className="text-link" href="/destinations">Browse destinations →</a>
          </article>
        </div>
      </section>

      <section className="luxe-partners" aria-label="Preferred partners">
        <p className="eyebrow">Preferred Partners</p>
        <div>
          {partnerLogos.map((partner) => (
            <span key={partner.name} className={partner.className}>
              <img src={partner.image} alt={partner.name} loading="lazy" decoding="async" />
            </span>
          ))}
        </div>
      </section>

      <section className="luxe-about-band" aria-labelledby="luxe-about-heading">
        <div className="luxe-about-copy">
          <p className="eyebrow">Why Work With Us</p>
          <h2 id="luxe-about-heading">
            More than booking.
            <span>It's personal.</span>
          </h2>
          <p>
            We take the time to understand what matters most to you, then handpick experiences that
            fit just right.
          </p>
          <ul>
            <li>Personalized recommendations</li>
            <li>Exclusive amenities and perks</li>
            <li>Expert guidance every step of the way</li>
          </ul>
          <a className="button button-secondary luxe-outline-button" href="/about">
            Learn More About Us
          </a>
        </div>
        <div className="luxe-about-gallery" aria-hidden="true">
          <img className="luxe-about-gallery-main" src="/images/home-about-gallery-main.jpg" alt="" loading="lazy" decoding="async" />
          <img src="/images/home-about-gallery-room.jpg" alt="" loading="lazy" decoding="async" />
          <img src="/images/home-about-gallery-coast.jpg" alt="" loading="lazy" decoding="async" />
        </div>
      </section>

      <section className="homepage-stories-section" aria-labelledby="homepage-stories-heading">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Traveler Stories</p>
            <h2 id="homepage-stories-heading">Real travelers. Real vacations. Real memories.</h2>
          </div>
          <a className="button button-secondary luxe-outline-button" href="/traveler-stories">
            View All Stories
          </a>
        </div>

        <div className="story-carousel" aria-label="Featured traveler stories">
          <div className="story-carousel-track">
            {[...homepageStories, ...homepageStories].map((story, index) => (
              <a
                key={`${story.slug}-${index}`}
                className="traveler-story-card traveler-story-card-carousel"
                href={`/traveler-stories/${story.slug}`}
              >
                <div className="traveler-story-image">
                  <img
                    src={story.featuredImage}
                    alt={`${story.travelerName}'s trip to ${story.destination}`}
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 900px) 80vw, 26vw"
                  />
                </div>
                <div className="traveler-story-copy">
                  <div className="traveler-story-meta">
                    <span>{story.tripType}</span>
                    <span>{story.travelDate}</span>
                  </div>
                  <h3>{story.travelerName}</h3>
                  <p className="card-region">{story.resort}</p>
                  <p>{story.destination}, {story.country}</p>
                  <div className="story-rating" aria-label={`${story.rating} star rating`}>
                    {"★★★★★"}
                  </div>
                  <p>"{story.favoriteMemory}"</p>
                  <span className="text-link">View Story -&gt;</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="luxe-featured" aria-labelledby="luxe-featured-heading">
        <div className="luxe-featured-copy">
          <p className="eyebrow">Featured Collections</p>
          <h2 id="luxe-featured-heading">Handpicked. Unforgettable.</h2>
          <p>Explore our favorite resorts and destinations by the way you want to travel.</p>
          <a className="button button-secondary luxe-outline-button" href="/collections">
            View All Collections
          </a>
        </div>
        <a className="luxe-signature-collection" href={`/collections/${featuredCollection.slug}`}>
          <img
            src={featuredCollection.featuredImage}
            alt={`${featuredCollection.title} luxury resort collection`}
            loading="lazy"
          />
          <span className="luxe-signature-badge">
            {featuredCollection.featuredBadge ?? "Featured Collection"}
          </span>
          <div>
            <h3>{featuredCollection.title}</h3>
            <p>{featuredCollection.shortDescription}</p>
            <span>{featuredCollection.resortIds.length} resorts -&gt;</span>
          </div>
        </a>
      </section>

    </main>
  );
}
