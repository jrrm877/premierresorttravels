import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { collectionCards, portfolioSections } from "../lib/property-data";
import { featuredTravelerStories } from "../lib/traveler-stories";
import type { Route } from "./+types/home";

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  return {
    initialInquiryNote: url.searchParams.get("note")?.trim() ?? "",
    initialInquiryName: url.searchParams.get("fullName")?.trim() ?? "",
    initialInquiryEmail: url.searchParams.get("email")?.trim() ?? "",
  };
}

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Premier Resort Travel | Luxury Resorts, Family Escapes & Adults-Only Getaways" },
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
    href: "/collections/adults-only-resorts",
  },
  {
    label: "Family flagship",
    name: "Moon Palace The Grand - Cancun",
    image: collectionCards[1]?.image,
    href: "/collections/family-flagship-resorts",
  },
  {
    label: "European icon",
    name: "Baglioni Hotel Luna",
    image: collectionCards[2]?.image,
    href: "/collections/european-icon-hotels",
  },
];

const travelerOptions = ["Couple", "Family", "Friends", "Group", "Destination Wedding"];
const groupSizeOptions = ["2", "3-4", "5-6", "7+"];
const tripPopupDelayMs = 60000;
const popupBenefits = [
  "Handpicked resort recommendations",
  "Exclusive perks when available",
  "Personalized itineraries",
  "Expert advice from a travel advisor",
  "No obligation to book",
];

const travelStyleCards = [
  {
    title: "Adults Only",
    image: "/images/home-style-adults-only.jpg",
    icon: "Palm",
    priority: "Relaxation",
    traveler: "Couple",
  },
  {
    title: "Family",
    image: "/images/home-style-family-beach.jpg",
    icon: "Family",
    priority: "Kids Activities",
    traveler: "Family",
  },
  {
    title: "Europe",
    image: "/images/home-style-europe.jpg",
    icon: "Hotel",
    priority: "Food & Dining",
    traveler: "Couple",
  },
  {
    title: "Romance",
    image: "/images/home-style-romantic-dinner.jpg",
    icon: "Heart",
    priority: "Romance",
    traveler: "Couple",
  },
  {
    title: "Spa & Wellness",
    image: "/images/home-style-spa.jpg",
    icon: "Spa",
    priority: "Spa",
    traveler: "Couple",
  },
  {
    title: "Food & Drink",
    image: "/images/home-style-food.jpg",
    icon: "Dining",
    priority: "Food & Dining",
    traveler: "Friends",
  },
  {
    title: "Adventure",
    image: "/images/home-style-adventure.jpg",
    icon: "Dive",
    priority: "Beach",
    traveler: "Friends",
  },
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
    image: "/images/logo-palace-resorts-clean.png",
    className: "partner-logo-palace-resorts",
  },
  {
    name: "Baglioni Hotels & Resorts",
    image: "/images/logo-baglioni-warm.svg",
    className: "partner-logo-baglioni",
  },
];
const homepageStories = featuredTravelerStories(6);

export default function Home({ loaderData }: Route.ComponentProps) {
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadDestination, setLeadDestination] = useState("");
  const [leadTraveler, setLeadTraveler] = useState(travelerOptions[0]);
  const [leadGroupSize, setLeadGroupSize] = useState(groupSizeOptions[0]);
  const [leadPriorities, setLeadPriorities] = useState("Relaxation");
  const [showTripPopup, setShowTripPopup] = useState(false);
  const fetcher = useFetcher<SearchResponse>();
  const leadFetcher = useFetcher<{ success?: boolean; message?: string }>();
  const inquiryFetcher = useFetcher<{ success?: boolean; message?: string }>();
  const results = fetcher.data?.destinations ?? [];
  const hasSearch = fetcher.state !== "idle" || fetcher.data;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (loaderData.initialInquiryNote || new URLSearchParams(window.location.search).get("popup") === "start") {
      setShowTripPopup(true);
      return;
    }

    if (window.sessionStorage.getItem("trip-popup-dismissed") === "true") {
      return;
    }

    const timer = window.setTimeout(() => {
      setShowTripPopup(true);
    }, tripPopupDelayMs);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (leadFetcher.data?.success) {
      setLeadName("");
      setLeadEmail("");
      setLeadDestination("");
      setLeadTraveler(travelerOptions[0]);
      setLeadGroupSize(groupSizeOptions[0]);
      setLeadPriorities("Relaxation");
      setShowTripPopup(false);

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("trip-popup-dismissed", "true");
      }
    }
  }, [leadFetcher.data]);

  function closeTripPopup() {
    setShowTripPopup(false);

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("trip-popup-dismissed", "true");
    }
  }

  function openTripPopup() {
    setShowTripPopup(true);
  }

  function openStylePlanner(style: (typeof travelStyleCards)[number]) {
    setLeadTraveler(style.traveler);
    setLeadGroupSize(style.traveler === "Family" ? "3-4" : style.traveler === "Group" ? "7+" : "2");
    setLeadPriorities(style.priority);
    setShowTripPopup(true);
  }

  return (
    <main className="luxe-home">
      <section
        className="luxe-hero"
        aria-label="Premier Resort Travel homepage"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(5, 15, 15, 0.86) 0%, rgba(12, 23, 23, 0.58) 42%, rgba(12, 23, 23, 0.1) 100%), url(${collectionCards[0]?.image})`,
        }}
      >
        <div className="luxe-hero-copy">
          <h1>
            Travel planning,
            <span>made personal.</span>
          </h1>
          <p>Thoughtful recommendations. Exclusive perks. Unforgettable vacations chosen around you.</p>
          <button className="button button-primary luxe-hero-cta" type="button" onClick={openTripPopup}>
            Start Planning
          </button>
        </div>
      </section>

      <section className="luxe-style-section" id="travel-styles" aria-labelledby="travel-styles-heading">
        <p className="eyebrow">Browse By Experience</p>
        <h2 id="travel-styles-heading">Find the perfect kind of escape.</h2>
        <div className="luxe-style-grid">
          {travelStyleCards.map((style) => (
            <button
              key={style.title}
              className="luxe-style-card"
              type="button"
              onClick={() => openStylePlanner(style)}
              aria-label={`Start planning a ${style.title} trip`}
            >
              <img src={style.image} alt="" loading="lazy" decoding="async" />
              <span className="luxe-style-icon" aria-hidden="true">{style.icon}</span>
              <strong>{style.title}</strong>
            </button>
          ))}
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
        <div>
          <p className="eyebrow">Featured Collections</p>
          <h2 id="luxe-featured-heading">Handpicked. Unforgettable.</h2>
          <p>Explore our favorite resorts and destinations.</p>
        </div>
        <a className="button button-secondary luxe-outline-button" href="/collections">
          View All Collections
        </a>
      </section>

      {showTripPopup ? (
        <div className="trip-popup-backdrop" role="presentation">
          <section
            className="trip-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="trip-popup-title"
          >
            <div className="trip-popup-visual">
              <div className="trip-popup-visual-copy">
                <h2>Let's build your <em>perfect</em> vacation.</h2>
                <p>Share the essentials and we'll follow up with resort recommendations shaped around your trip.</p>
              </div>
              <div className="trip-popup-benefits" aria-label="When you inquire, you will receive">
                {popupBenefits.map((benefit) => (
                  <span key={benefit}>{benefit}</span>
                ))}
              </div>
            </div>

            <leadFetcher.Form className="trip-popup-form" method="post" action="/api/inquiry">
              <button
                className="trip-popup-close"
                type="button"
                aria-label="Close trip planner"
                onClick={closeTripPopup}
              >
                ×
              </button>

              <p className="eyebrow">Start Planning</p>
              <h2 id="trip-popup-title">Tell us about your dream trip.</h2>

              <label className="trip-popup-field">
                <span>Where would you like to go?</span>
                <input
                  name="destinationInterest"
                  type="text"
                  placeholder="Cancun, Italy, Hawaii..."
                  value={leadDestination}
                  onChange={(event) => setLeadDestination(event.target.value)}
                  required
                />
              </label>

              <div className="trip-popup-divider" />

              <fieldset className="trip-popup-options">
                <legend>Who's traveling?</legend>
                <div>
                  {travelerOptions.map((option) => (
                    <button
                      key={option}
                      className={leadTraveler === option ? "is-selected" : ""}
                      type="button"
                      onClick={() => setLeadTraveler(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="trip-popup-divider" />

              <fieldset className="trip-popup-options">
                <legend>Approximate group size</legend>
                <div>
                  {groupSizeOptions.map((option) => (
                    <button
                      key={option}
                      className={leadGroupSize === option ? "is-selected" : ""}
                      type="button"
                      onClick={() => setLeadGroupSize(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="trip-popup-divider" />

              <label className="trip-popup-field">
                <span>What matters most to you?</span>
                <input
                  name="tripPriorities"
                  type="text"
                  placeholder="Relaxation, beach, food, kids activities..."
                  value={leadPriorities}
                  onChange={(event) => setLeadPriorities(event.target.value)}
                />
              </label>

              <div className="trip-popup-divider" />

              <div className="trip-popup-contact">
                <label className="trip-popup-field">
                  <span>Your name</span>
                  <input
                    name="fullName"
                    type="text"
                    placeholder="First and last name"
                    value={leadName}
                    onChange={(event) => setLeadName(event.target.value)}
                    required
                  />
                </label>
                <label className="trip-popup-field">
                  <span>Email address</span>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={leadEmail}
                    onChange={(event) => setLeadEmail(event.target.value)}
                    required
                  />
                </label>
              </div>

              <input type="hidden" name="tripStyle" value={leadTraveler} />
              <input type="hidden" name="travelWindow" value="" />
              <input
                type="hidden"
                name="notes"
                value={`${loaderData.initialInquiryNote ? `${loaderData.initialInquiryNote} ` : ""}Popup lead capture. Traveler type: ${leadTraveler}. Approximate group size: ${leadGroupSize}. Priorities: ${
                  leadPriorities.trim() || "Not selected"
                }.`}
              />
              <input type="hidden" name="source" value="homepage-trip-popup" />

              <button className="button button-primary trip-popup-submit" type="submit">
                {leadFetcher.state === "submitting"
                  ? "Sending..."
                  : "Get my personalized recommendations"}
                <span aria-hidden="true">-&gt;</span>
              </button>

              {leadFetcher.data?.message ? (
                <p className="form-status">{leadFetcher.data.message}</p>
              ) : null}

              <div className="trip-popup-trust" aria-label="Planning assurances">
                <span>Your information is never shared</span>
                <span>Palace Pro Agency trusted advisor</span>
                <span>No planning fee for qualifying bookings</span>
              </div>
            </leadFetcher.Form>
          </section>
        </div>
      ) : null}
    </main>
  );
}
