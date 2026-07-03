import { useEffect, useMemo, useState } from "react";
import { useFetcher } from "react-router";
import type { Route } from "./+types/about";

const travelerTypes = [
  {
    title: "Couples planning an adults-only beach escape",
    body: "Private, relaxing escapes designed for connection and calm.",
    icon: "beach",
  },
  {
    title: "Families comparing larger all-inclusive resorts",
    body: "Options that balance fun for everyone with comfort for you.",
    icon: "family",
  },
  {
    title: "Travelers looking for spa-forward luxury",
    body: "Restorative stays where wellness, service, and serenity come first.",
    icon: "spa",
  },
  {
    title: "Guests pairing Europe city stays with resort time",
    body: "Seamless add-on resorts that elevate your full itinerary.",
    icon: "europe",
  },
];

const supportHighlights = [
  { label: "Thoughtful guidance", icon: "chat" },
  { label: "Curated collection", icon: "badge" },
  { label: "Seamless planning", icon: "calendar" },
  { label: "Dedicated support", icon: "heart" },
];

const activityCards = [
  {
    title: "Destination Wedding",
    image: "/images/about-north-america-cozumel-palace.jpeg",
    note: "I'm interested in planning a destination wedding.",
  },
  {
    title: "Scuba Diving",
    image: "/images/about-north-america-cozumel-south-dive.jpeg",
    note: "I'm interested in a trip with scuba diving.",
  },
  {
    title: "Snorkeling",
    image: "/images/about-activity-snorkeling.png",
    note: "I'm interested in a trip with snorkeling.",
  },
  {
    title: "Whale Sharks",
    image: "/images/about-activity-whale-sharks.jpeg",
    note: "I'm interested in a trip with whale shark experiences.",
  },
  {
    title: "Sea Turtles",
    image: "/images/about-activity-sea-turtles.jpeg",
    note: "I'm interested in a trip with sea turtle experiences.",
  },
  {
    title: "Deep Sea Fishing",
    image: "/images/about-activity-deep-sea-fishing.jpeg",
    note: "I'm interested in a trip with deep sea fishing.",
  },
  {
    title: "Stingrays",
    image: "/images/about-activity-stingray.png",
    note: "I'm interested in a trip with a stingray experience.",
  },
  {
    title: "Submarine",
    image: "/images/about-activity-submarine.png",
    note: "I'm interested in a trip with a submarine excursion.",
  },
  {
    title: "Princess Spa",
    image: "/images/about-activity-princess-spa.jpeg",
    note: "I'm interested in Princess Spa options.",
  },
  {
    title: "Private Golf Lesson",
    image: "/images/about-activity-private-golf-lesson.jpg",
    note: "I'm interested in a private golf lesson during the trip.",
  },
];

type MapCoordinates = {
  lat: number;
  lng: number;
  nudgeX?: number;
  nudgeY?: number;
};

type ExperienceStop = {
  id: string;
  heroImage: string;
  imagePosition?: string;
  photoLocation: string;
  mapLabel: string;
  mapPosition: {
    top: string;
    left: string;
  };
};

// The SVG map below and the pins share this equirectangular coordinate space.
const experienceMapBounds = {
  west: -180,
  east: 180,
  north: 84,
  south: -58,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function projectMapPosition({ lat, lng }: MapCoordinates) {
  const { west, east, north, south } = experienceMapBounds;
  const left = clamp(((lng - west) / (east - west)) * 100, 2, 98);
  const top = clamp(((north - lat) / (north - south)) * 100, 4, 96);

  return {
    top: `${top.toFixed(2)}%`,
    left: `${left.toFixed(2)}%`,
  };
}

const experienceStops: ExperienceStop[] = [
  {
    id: "north-pole",
    heroImage: "/images/about-north-pole-santa.jpeg",
    photoLocation: "North Pole",
    mapLabel: "North Pole",
    mapPosition: { top: "8.8%", left: "49.4%" },
  },
  {
    id: "san-francisco",
    heroImage: "/images/about-north-america-san-francisco.JPG",
    photoLocation: "Golden Gate Bridge, San Francisco, California",
    mapLabel: "San Francisco, California",
    mapPosition: projectMapPosition({ lat: 37.8199, lng: -122.4783, nudgeX: 0.7, nudgeY: 1.1 }),
  },
  {
    id: "montana",
    heroImage: "/images/about-north-america-montana.jpg",
    photoLocation: "Montana",
    mapLabel: "Montana",
    mapPosition: projectMapPosition({ lat: 46.8797, lng: -110.3626, nudgeX: 0.4, nudgeY: 0.8 }),
  },
  {
    id: "wyoming",
    heroImage: "/images/about-north-america-wyoming.jpg",
    photoLocation: "Wyoming",
    mapLabel: "Wyoming",
    mapPosition: projectMapPosition({ lat: 43.076, lng: -107.2903, nudgeX: 0.2, nudgeY: 0.5 }),
  },
  {
    id: "chicago",
    heroImage: "/images/about-north-america-chicago.JPG",
    photoLocation: "Chicago, Illinois",
    mapLabel: "Chicago, Illinois",
    mapPosition: projectMapPosition({ lat: 41.8781, lng: -87.6298, nudgeX: -0.1, nudgeY: 0.2 }),
  },
  {
    id: "milwaukee",
    heroImage: "/images/about-north-america-milwaukee-brewers.jpg",
    photoLocation: "American Family Field, Milwaukee, Wisconsin",
    mapLabel: "Milwaukee, Wisconsin",
    mapPosition: projectMapPosition({ lat: 43.028, lng: -87.9712, nudgeX: 1.3, nudgeY: -0.3 }),
  },
  {
    id: "canada-mandarin-buffet",
    heroImage: "/images/about-north-america-canada-mandarin-buffet.jpg",
    imagePosition: "center top",
    photoLocation: "Mandarin Restaurant, Ontario, Canada",
    mapLabel: "Ontario, Canada",
    mapPosition: projectMapPosition({ lat: 43.6532, lng: -79.3832, nudgeX: 0.4, nudgeY: -1.2 }),
  },
  {
    id: "st-louis",
    heroImage: "/images/about-north-america-st-louis.jpg",
    photoLocation: "Gateway Arch, St. Louis, Missouri",
    mapLabel: "St. Louis, Missouri",
    mapPosition: projectMapPosition({ lat: 38.6247, lng: -90.1848, nudgeX: 0.6, nudgeY: 0.8 }),
  },
  {
    id: "creighton-university",
    heroImage: "/images/about-north-america-creighton-university.jpg",
    photoLocation: "Creighton University, Omaha, Nebraska",
    mapLabel: "Omaha, Nebraska",
    mapPosition: projectMapPosition({ lat: 41.2658, lng: -95.9345, nudgeX: -0.2, nudgeY: 0.5 }),
  },
  {
    id: "branson",
    heroImage: "/images/about-north-america-branson.jpg",
    photoLocation: "Branson, Missouri",
    mapLabel: "Branson, Missouri",
    mapPosition: projectMapPosition({ lat: 36.6437, lng: -93.2185, nudgeX: 1.3, nudgeY: 1.2 }),
  },
  {
    id: "table-rock-lake",
    heroImage: "/images/about-north-america-table-rock-lake.jpeg",
    photoLocation: "Table Rock Lake, Missouri",
    mapLabel: "Table Rock Lake, Missouri",
    mapPosition: projectMapPosition({ lat: 36.5862, lng: -93.3012, nudgeX: 2.4, nudgeY: 2.2 }),
  },
  {
    id: "colorado",
    heroImage: "/images/about-north-america-pikes-peak.png",
    photoLocation: "Pikes Peak, Colorado Springs, Colorado",
    mapLabel: "Colorado Springs, Colorado",
    mapPosition: projectMapPosition({ lat: 38.8409, lng: -105.0423, nudgeX: 0.7, nudgeY: 0.7 }),
  },
  {
    id: "hoosier-pass",
    heroImage: "/images/about-north-america-hoosier-pass.jpg",
    photoLocation: "Hoosier Pass, Colorado",
    mapLabel: "Hoosier Pass, Colorado",
    mapPosition: projectMapPosition({ lat: 39.3603, lng: -106.0614, nudgeX: -0.2, nudgeY: -0.2 }),
  },
  {
    id: "santa-fe",
    heroImage: "/images/about-north-america-santa-fe.jpg",
    photoLocation: "Santa Fe, New Mexico",
    mapLabel: "Santa Fe, New Mexico",
    mapPosition: projectMapPosition({ lat: 35.687, lng: -105.9378, nudgeX: 0.9, nudgeY: 1.5 }),
  },
  {
    id: "white-rock-new-mexico",
    heroImage: "/images/about-north-america-white-rock-new-mexico.jpg",
    photoLocation: "White Rock, New Mexico",
    mapLabel: "White Rock, New Mexico",
    mapPosition: projectMapPosition({ lat: 35.8275, lng: -106.2039, nudgeX: -0.5, nudgeY: -1.0 }),
  },
  {
    id: "grand-canyon-arizona",
    heroImage: "/images/about-north-america-grand-canyon-arizona.jpg",
    photoLocation: "Grand Canyon National Park, Arizona",
    mapLabel: "Grand Canyon National Park, Arizona",
    mapPosition: projectMapPosition({ lat: 36.2679, lng: -112.3535, nudgeX: 0.4, nudgeY: 0.9 }),
  },
  {
    id: "las-vegas",
    heroImage: "/images/about-north-america-las-vegas.jpg",
    photoLocation: "Las Vegas, Nevada",
    mapLabel: "Las Vegas, Nevada",
    mapPosition: projectMapPosition({ lat: 36.1699, lng: -115.1398, nudgeX: 0.4, nudgeY: 1.1 }),
  },
  {
    id: "boulder-city-nevada",
    heroImage: "/images/about-north-america-boulder-city-nevada.jpg",
    photoLocation: "Boulder City, Nevada",
    mapLabel: "Boulder City, Nevada",
    mapPosition: projectMapPosition({ lat: 35.9786, lng: -114.8325, nudgeX: 1.1, nudgeY: 1.5 }),
  },
  {
    id: "lake-tahoe-nevada",
    heroImage: "/images/about-north-america-lake-tahoe-nevada.png",
    photoLocation: "Lake Tahoe, Nevada",
    mapLabel: "Lake Tahoe, Nevada",
    mapPosition: projectMapPosition({ lat: 39.0968, lng: -120.0324, nudgeX: 0.4, nudgeY: 0.8 }),
  },
  {
    id: "reno-nevada",
    heroImage: "/images/about-north-america-reno-nevada.jpg",
    photoLocation: "Reno, Nevada",
    mapLabel: "Reno, Nevada",
    mapPosition: projectMapPosition({ lat: 39.5296, lng: -119.8138, nudgeX: 0.7, nudgeY: -0.4 }),
  },
  {
    id: "houston",
    heroImage: "/images/about-north-america-houston.jpeg",
    photoLocation: "Houston, Texas",
    mapLabel: "Houston, Texas",
    mapPosition: projectMapPosition({ lat: 29.7604, lng: -95.3698, nudgeX: -0.2, nudgeY: 1.3 }),
  },
  {
    id: "cabo",
    heroImage: "/images/about-north-america-cabo.jpeg",
    photoLocation: "Land's End, Cabo San Lucas, Mexico",
    mapLabel: "Cabo San Lucas, Mexico",
    mapPosition: projectMapPosition({ lat: 22.8818, lng: -109.8921, nudgeX: 0.9, nudgeY: 0.8 }),
  },
  {
    id: "cozumel-dolphin-swim",
    heroImage: "/images/about-north-america-cozumel-dolphin-swim.jpg",
    photoLocation: "Dolphin swim, Cozumel, Mexico",
    mapLabel: "Cozumel, Mexico",
    mapPosition: projectMapPosition({ lat: 20.4229, lng: -86.9223, nudgeX: 0.4, nudgeY: 0.9 }),
  },
  {
    id: "cozumel-south-dive",
    heroImage: "/images/about-north-america-cozumel-south-dive.jpeg",
    photoLocation: "Off the southern tip of Cozumel, Mexico",
    mapLabel: "South Cozumel dive site",
    mapPosition: projectMapPosition({ lat: 20.2707, lng: -86.9856, nudgeX: 1.7, nudgeY: 2.2 }),
  },
  {
    id: "san-jose-del-cabo",
    heroImage: "/images/about-north-america-san-jose-del-cabo.jpg",
    photoLocation: "San Jose del Cabo, Baja California Sur, Mexico",
    mapLabel: "San Jose del Cabo, Mexico",
    mapPosition: projectMapPosition({ lat: 23.0614, lng: -109.6977, nudgeX: 2.3, nudgeY: 0.1 }),
  },
  {
    id: "isla-mujeres",
    heroImage: "/images/about-north-america-isla-mujeres.jpg",
    photoLocation: "Isla Mujeres, Quintana Roo, Mexico",
    mapLabel: "Isla Mujeres, Mexico",
    mapPosition: projectMapPosition({ lat: 21.2311, lng: -86.731, nudgeX: 1.7, nudgeY: -1.6 }),
  },
  {
    id: "cancun-sun-palace",
    heroImage: "/images/about-north-america-cancun-sun-palace.jpg",
    photoLocation: "Sun Palace Resort, Cancun, Mexico",
    mapLabel: "Sun Palace Cancun",
    mapPosition: projectMapPosition({ lat: 21.0474, lng: -86.7838, nudgeX: -0.2, nudgeY: -0.4 }),
  },
  {
    id: "cancun-moon-palace-sunrise",
    heroImage: "/images/about-north-america-cancun-moon-palace-sunrise.jpeg",
    photoLocation: "Moon Palace Sunrise, Cancun, Mexico",
    mapLabel: "Moon Palace Sunrise Cancun",
    mapPosition: projectMapPosition({ lat: 20.9937, lng: -86.8327, nudgeX: -1.2, nudgeY: 0.9 }),
  },
  {
    id: "chichen-itza",
    heroImage: "/images/about-north-america-chichen-itza.JPG",
    photoLocation: "Chichen Itza, Yucatan, Mexico",
    mapLabel: "Chichen Itza, Mexico",
    mapPosition: projectMapPosition({ lat: 20.6843, lng: -88.5678, nudgeX: -0.4, nudgeY: 1.1 }),
  },
  {
    id: "haiti",
    heroImage: "/images/about-caribbean-haiti.jpg",
    photoLocation: "Haiti",
    mapLabel: "Haiti",
    mapPosition: projectMapPosition({ lat: 18.5944, lng: -72.3074, nudgeX: 0.8, nudgeY: 0.1 }),
  },
  {
    id: "munich",
    heroImage: "/images/about-europe-germany.jpg",
    photoLocation: "Munich, Germany",
    mapLabel: "Munich, Germany",
    mapPosition: projectMapPosition({ lat: 48.1351, lng: 11.582, nudgeX: 0.3, nudgeY: 0.2 }),
  },
  {
    id: "stuttgart",
    heroImage: "/images/about-europe-stuttgart-mercedes-museum.jpeg",
    photoLocation: "Mercedes-Benz Museum, Stuttgart, Germany",
    mapLabel: "Stuttgart, Germany",
    mapPosition: projectMapPosition({ lat: 48.7758, lng: 9.1829, nudgeX: -0.5, nudgeY: -0.5 }),
  },
  {
    id: "rottweil",
    heroImage: "/images/about-europe-rottweil-germany.jpg",
    photoLocation: "Rottweil, Germany",
    mapLabel: "Rottweil, Germany",
    mapPosition: projectMapPosition({ lat: 48.1678, lng: 8.6272, nudgeX: -1.0, nudgeY: 1.4 }),
  },
  {
    id: "lochau",
    heroImage: "/images/about-europe-lochau-austria.jpg",
    photoLocation: "Lochau, Austria",
    mapLabel: "Lochau, Austria",
    mapPosition: projectMapPosition({ lat: 47.5167, lng: 9.75, nudgeX: 0.9, nudgeY: 0.9 }),
  },
  {
    id: "jerusalem",
    heroImage: "/images/about-middle-east-jerusalem.JPG",
    photoLocation: "Temple Mount, Jerusalem",
    mapLabel: "Jerusalem",
    mapPosition: projectMapPosition({ lat: 31.778, lng: 35.235, nudgeX: -0.1, nudgeY: 0.2 }),
  },
  {
    id: "petra",
    heroImage: "/images/about-middle-east-petra.png",
    photoLocation: "Petra, Jordan",
    mapLabel: "Petra, Jordan",
    mapPosition: projectMapPosition({ lat: 30.3285, lng: 35.4444, nudgeX: 1.0, nudgeY: 2.0 }),
  },
  {
    id: "pyongyang-monument",
    heroImage: "/images/about-asia-korea.png",
    photoLocation: "Pyongyang, North Korea",
    mapLabel: "Pyongyang, North Korea",
    mapPosition: projectMapPosition({ lat: 39.0392, lng: 125.7625, nudgeX: 0.3, nudgeY: -1.0 }),
  },
  {
    id: "pyongyang-skyline",
    heroImage: "/images/about-asia-pyongyang-skyline.jpg",
    photoLocation: "Pyongyang, North Korea",
    mapLabel: "Pyongyang skyline",
    mapPosition: projectMapPosition({ lat: 39.0392, lng: 125.7625, nudgeX: 1.7, nudgeY: 1.3 }),
  },
];

function AboutLineIcon({ name }: { name: string }) {
  switch (name) {
    case "beach":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <path d="M17 39c6-4 12-4 18 0 5 3 10 3 15 0" />
          <path d="M14 47c6-3 12-3 18 0 6 3 12 3 18 0" />
          <path d="M25 38l5-23" />
          <path d="M16 20c6-5 13-4 18 1-8-1-13 1-18 8 0-4 0-6 0-9Z" />
          <path d="M30 15c7 0 12 5 13 13-5-6-10-8-17-6 1-3 2-5 4-7Z" />
          <path d="M47 14v7M47 31v7M36 26h7M51 26h7" />
        </svg>
      );
    case "family":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <circle cx="25" cy="20" r="6" />
          <circle cx="40" cy="22" r="5" />
          <circle cx="17" cy="31" r="4.5" />
          <path d="M16 49V38c0-5 4-9 9-9s9 4 9 9v11" />
          <path d="M34 49V37c0-4 3-7 7-7s7 3 7 7v12" />
          <path d="M9 49V39c0-3 3-6 7-6" />
          <path d="M49 32h7v17h-7z" />
        </svg>
      );
    case "spa":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <path d="M32 13c8 8 10 17 0 27-10-10-8-19 0-27Z" />
          <path d="M31 43c-12 0-20-6-24-18 12 0 20 6 24 18Z" />
          <path d="M33 43c12 0 20-6 24-18-12 0-20 6-24 18Z" />
          <path d="M16 51h32" />
        </svg>
      );
    case "europe":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <path d="M13 51h20" />
          <path d="M17 51l8-36 8 36" />
          <path d="M20 31h10M18 40h14" />
          <path d="M40 51V27l10-7 10 7v24" />
          <path d="M45 51V39c0-3 2-5 5-5s5 2 5 5v12" />
          <path d="M42 31h16" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <path d="M13 18h38c4 0 7 3 7 7v15c0 4-3 7-7 7H29l-13 8 3-8h-6c-4 0-7-3-7-7V25c0-4 3-7 7-7Z" />
          <path d="M22 32h1M32 32h1M42 32h1" />
        </svg>
      );
    case "badge":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <path d="M32 7l6 8 10 1 2 10 7 6-7 6-2 10-10 1-6 8-6-8-10-1-2-10-7-6 7-6 2-10 10-1 6-8Z" />
          <path d="M24 33l5 5 12-13" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <path d="M14 14h36c3 0 5 2 5 5v31c0 3-2 5-5 5H14c-3 0-5-2-5-5V19c0-3 2-5 5-5Z" />
          <path d="M9 26h46M20 9v10M44 9v10" />
          <path d="M21 36h4M31 36h4M41 36h4M21 45h4M31 45h4M41 45h4" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <path d="M32 53S11 40 11 24c0-7 5-12 12-12 4 0 7 2 9 5 2-3 5-5 9-5 7 0 12 5 12 12 0 16-21 29-21 29Z" />
        </svg>
      );
    case "clipboard":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <path d="M21 15h22c3 0 5 2 5 5v33c0 3-2 5-5 5H21c-3 0-5-2-5-5V20c0-3 2-5 5-5Z" />
          <path d="M25 15v-3h14v3" />
          <path d="M25 29l3 3 6-7M25 40l3 3 6-7" />
          <path d="M38 29h7M38 40h7" />
          <circle cx="46" cy="50" r="8" />
          <path d="M42 50l3 3 6-7" />
        </svg>
      );
    case "hotel":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <path d="M18 56V18h28v38" />
          <path d="M13 56h38" />
          <path d="M24 26h4M36 26h4M24 35h4M36 35h4M24 44h4M36 44h4" />
          <path d="M29 56V46h6v10" />
          <path d="M22 14h20" />
          <path d="M21 61l2-3 2 3 2-3 2 3 2-3 2 3 2-3 2 3 2-3 2 3 2-3 2 3" />
        </svg>
      );
    case "plane":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <path d="M10 35l44-22-14 42-10-18-20-2Z" />
          <path d="M30 37l24-24" />
        </svg>
      );
    default:
      return null;
  }
}

export function meta(_: Route.MetaArgs) {
  return [
    { title: "About Us | Premier Resort Travel" },
    {
      name: "description",
      content:
        "Learn more about Premier Resort Travel, a family-led travel brand focused on matching travelers with standout resorts and luxury hotel stays.",
    },
  ];
}

export default function AboutPage() {
  const quickNoteFetcher = useFetcher<{ success?: boolean; message?: string }>();
  const [email, setEmail] = useState("");
  const [activeStopId, setActiveStopId] = useState(experienceStops[0]?.id ?? "");
  const continueHref = useMemo(() => {
    const params = new URLSearchParams();

    if (email.trim()) {
      params.set("email", email.trim());
    }

    const query = params.toString();
    return `/${query ? `?${query}` : ""}#plan-trip`;
  }, [email]);

  useEffect(() => {
    if (quickNoteFetcher.data?.success) {
      setEmail("");
    }
  }, [quickNoteFetcher.data]);

  const activeStop = experienceStops.find((stop) => stop.id === activeStopId) ?? experienceStops[0];

  return (
    <main className="page-shell">
      <section className="about-postcard-hero" aria-label="About Premier Resort Travel postcard">
        <div className="about-postcard-hero-frame">
          <div className="about-postcard-hero-image">
            <img
              className="about-postcard-finished"
              src="/images/about-postcard-family-updated.png"
              alt="Premier Resort Travel about postcard with family photo and about-us message"
              decoding="async"
              sizes="(max-width: 1100px) 100vw, 1200px"
            />
            <span className="about-postcard-popout-zone" aria-hidden="true" />
            <a
              className="about-postcard-hotspot about-postcard-hotspot-plan"
              href="/#plan-trip"
              aria-label="Plan your trip"
            />
            <a
              className="about-postcard-hotspot about-postcard-hotspot-collections"
              href="/collections"
              aria-label="Explore collections"
            />
            <img
              className="about-postcard-popout"
              src="/images/about-postcard-closeup.png"
              alt=""
              aria-hidden="true"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="property-details about-section about-section-experience">
        <div className="about-experience-explorer">
          <div className="about-experience-explorer-copy">
            <h3>Explore our Travel Experiences</h3>
            <p>Explore where our travels have taken us.</p>
          </div>

          <div className="about-experience-map-shell" aria-label="Interactive travel map">
            <div className="about-experience-map-canvas">
              <img
                className="about-experience-map-backdrop"
                src="/images/about-experience-map-projected.svg?v=2"
                alt=""
                aria-hidden="true"
                decoding="async"
              />

              {experienceStops.map((stop) => (
                <button
                  key={stop.id}
                  type="button"
                  className={`about-experience-map-pin ${
                    activeStop?.id === stop.id ? "is-active" : ""
                  }`}
                  style={stop.mapPosition}
                  onClick={() => setActiveStopId(stop.id)}
                  onMouseEnter={() => setActiveStopId(stop.id)}
                  onFocus={() => setActiveStopId(stop.id)}
                  aria-label={stop.mapLabel}
                >
                  <span />
                  <strong>{stop.mapLabel}</strong>
                </button>
              ))}
            </div>

            <article className="about-experience-map-card" aria-live="polite">
              <img
                src={activeStop?.heroImage}
                alt={activeStop?.photoLocation}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 900px) 100vw, 420px"
                style={{ objectPosition: activeStop?.imagePosition ?? "center" }}
              />
              <div className="about-experience-map-card-copy">
                <h4>{activeStop?.photoLocation}</h4>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="about-activities-section" aria-labelledby="about-activities-heading">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Activities We Have Done</p>
            <h2 id="about-activities-heading">Experiences we can help you plan around</h2>
          </div>
          <p className="section-copy">
            Click an activity to start a trip request with that experience already noted.
          </p>
        </div>

        <div className="about-activities-grid">
          {activityCards.map((activity) => (
            <a
              key={activity.title}
              className="about-activity-card"
              href={`/?note=${encodeURIComponent(activity.note)}#plan-trip`}
              aria-label={`Plan a trip with ${activity.title}`}
            >
              <img src={activity.image} alt="" loading="lazy" decoding="async" />
              <span>{activity.title}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="about-reasons-graphic-section" aria-label="Why travelers work with us">
        <img
          className="about-reasons-graphic-image"
          src="/images/about-better-recommendations-graphic.png"
          alt="Why travelers work with us: better recommendations start with a better understanding of the trip, with three planning support cards and a resort photo."
          loading="lazy"
          decoding="async"
          sizes="(max-width: 1220px) calc(100vw - 2rem), 1220px"
        />
      </section>

      <section className="about-bottom-panel" aria-labelledby="about-traveler-heading">
        <div className="about-help-header">
          <div className="about-help-title">
            <p className="eyebrow">Who We Help Best</p>
            <h2 id="about-traveler-heading">
              Planning support built for the kinds of trips people actually take
            </h2>
          </div>
          <div className="about-help-rule" aria-hidden="true" />
          <p>
            We are especially helpful when the traveler wants a strong recommendation, not just a
            long list of every possible option.
          </p>
        </div>

        <div className="about-help-grid">
          {travelerTypes.map((traveler) => (
            <article key={traveler.title} className="about-help-card">
              <span className="about-help-card-icon">
                <AboutLineIcon name={traveler.icon} />
              </span>
              <span className="about-help-card-divider" aria-hidden="true" />
              <span className="about-help-card-copy">
                <h3>{traveler.title}</h3>
                <p>{traveler.body}</p>
              </span>
            </article>
          ))}
        </div>

        <div className="about-plan-panel">
          <div className="about-plan-copy">
            <p className="eyebrow">Ready To Plan</p>
            <h2>Tell us what kind of trip you want, and we will help narrow the right stay.</h2>
            <div className="about-plan-supports" aria-label="Planning support">
              {supportHighlights.map((support) => (
                <span key={support.label}>
                  <AboutLineIcon name={support.icon} />
                  {support.label}
                </span>
              ))}
            </div>
          </div>

          <quickNoteFetcher.Form className="about-note-card" method="post" action="/api/inquiry">
            <div className="about-note-heading">
              <span className="about-note-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M4 6h16v12H4z" />
                  <path d="M4 7l8 6 8-6" />
                </svg>
              </span>
              <h3>Send us a note</h3>
            </div>
            <p>
              In a hurry? Send a quick note and we will do the rest. Add your email below, then
              either submit it now or continue to the full trip planner.
            </p>

            <label className="about-note-field">
              <span>Email address</span>
              <input
                name="email"
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <input type="hidden" name="fullName" value="Name pending" />
            <input type="hidden" name="notes" value="About page quick note request from compact planner panel." />
            <input type="hidden" name="tripStyle" value="about-page-quick-note" />
            <input type="hidden" name="destinationInterest" value="Premier Resort Travel quick note" />
            <input type="hidden" name="source" value="about-quick-note" />

            <div className="about-note-actions">
              <button className="button button-primary" type="submit">
                {quickNoteFetcher.state === "submitting" ? "Sending..." : "Send Note"}
              </button>
              <a className="button button-secondary" href={continueHref}>
                Continue To Planner
              </a>
            </div>

            {quickNoteFetcher.data?.message ? (
              <p className="form-status">{quickNoteFetcher.data.message}</p>
            ) : null}
          </quickNoteFetcher.Form>
        </div>
      </section>
    </main>
  );
}
