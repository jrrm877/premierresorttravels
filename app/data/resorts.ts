import { findPropertyBySlug } from "../lib/property-data";
import { resortCollectionIdsByResortId } from "./collections";

export type Resort = {
  id: string;
  name: string;
  slug: string;
  destination: string;
  country: string;
  brand: string;
  image: string;
  collections: string[];
  tags: string[];
  adultsOnly: boolean;
  familyFriendly: boolean;
  beachfront: boolean;
  seaView: boolean;
  seasonalBeachNote?: string;
  description: string;
  highlight: string;
};

type ResortMetadata = {
  id: string;
  tags: string[];
  adultsOnly: boolean;
  familyFriendly: boolean;
  beachfront: boolean;
  seaView: boolean;
  seasonalBeachNote?: string;
};

const seaViewNote =
  "Beach conditions vary seasonally. Contact us for personalized recommendations based on your travel dates.";

const resortMetadata: ResortMetadata[] = [
  {
    id: "moon-palace-the-grand-cancun",
    tags: ["family", "water-park", "golf", "signature", "sea-view"],
    adultsOnly: false,
    familyFriendly: true,
    beachfront: true,
    seaView: true,
    seasonalBeachNote: seaViewNote,
  },
  {
    id: "le-blanc-spa-resort-cancun",
    tags: ["adults-only", "honeymoon", "spa", "ultra-luxury", "sea-view"],
    adultsOnly: true,
    familyFriendly: false,
    beachfront: true,
    seaView: true,
    seasonalBeachNote: seaViewNote,
  },
  {
    id: "le-blanc-spa-resort-los-cabos",
    tags: ["adults-only", "honeymoon", "spa", "golf", "ultra-luxury", "sea-view"],
    adultsOnly: true,
    familyFriendly: false,
    beachfront: true,
    seaView: true,
    seasonalBeachNote: seaViewNote,
  },
  {
    id: "moon-palace-cancun",
    tags: ["family", "golf", "wellness", "sea-view"],
    adultsOnly: false,
    familyFriendly: true,
    beachfront: true,
    seaView: true,
    seasonalBeachNote: seaViewNote,
  },
  {
    id: "baglioni-resort-sardinia",
    tags: ["europe", "romance", "ultra-luxury", "sea-view", "mediterranean"],
    adultsOnly: false,
    familyFriendly: true,
    beachfront: true,
    seaView: true,
    seasonalBeachNote: seaViewNote,
  },
  {
    id: "sun-palace",
    tags: ["adults-only", "romance", "honeymoon", "spa", "sea-view"],
    adultsOnly: true,
    familyFriendly: false,
    beachfront: true,
    seaView: true,
    seasonalBeachNote: seaViewNote,
  },
  {
    id: "cozumel-palace",
    tags: ["diving", "adventure", "romance", "wellness", "sea-view"],
    adultsOnly: false,
    familyFriendly: true,
    beachfront: true,
    seaView: true,
    seasonalBeachNote: seaViewNote,
  },
  {
    id: "baglioni-masseria-muzza-resort-and-spa",
    tags: ["europe", "italy", "spa", "honeymoon", "ultra-luxury"],
    adultsOnly: false,
    familyFriendly: true,
    beachfront: false,
    seaView: false,
  },
  {
    id: "casa-baglioni",
    tags: ["europe", "italy", "city-hotel", "ultra-luxury", "adults"],
    adultsOnly: false,
    familyFriendly: false,
    beachfront: false,
    seaView: false,
  },
  {
    id: "baglioni-hotel-regina",
    tags: ["europe", "italy", "city-hotel", "ultra-luxury", "rome"],
    adultsOnly: false,
    familyFriendly: false,
    beachfront: false,
    seaView: false,
  },
  {
    id: "baglioni-hotel-luna",
    tags: ["europe", "italy", "venice", "honeymoon", "romance", "ultra-luxury"],
    adultsOnly: false,
    familyFriendly: false,
    beachfront: false,
    seaView: false,
  },
  {
    id: "moon-palace-jamaica",
    tags: ["family", "jamaica", "adventure", "golf", "wellness", "sea-view"],
    adultsOnly: false,
    familyFriendly: true,
    beachfront: true,
    seaView: true,
    seasonalBeachNote: seaViewNote,
  },
  {
    id: "moon-palace-the-grand-punta-cana",
    tags: ["family", "puntacana", "golf", "sea-view"],
    adultsOnly: false,
    familyFriendly: true,
    beachfront: true,
    seaView: true,
    seasonalBeachNote: seaViewNote,
  },
  {
    id: "beach-palace",
    tags: ["family", "cancun", "beachfront", "sea-view"],
    adultsOnly: false,
    familyFriendly: true,
    beachfront: true,
    seaView: true,
    seasonalBeachNote: seaViewNote,
  },
  {
    id: "playacar-palace",
    tags: ["family", "playa-del-carmen", "weddings", "adventure", "sea-view"],
    adultsOnly: false,
    familyFriendly: true,
    beachfront: true,
    seaView: true,
    seasonalBeachNote: seaViewNote,
  },
  {
    id: "palazzo-firenze",
    tags: ["europe", "italy", "florence", "city-hotel", "culture"],
    adultsOnly: false,
    familyFriendly: false,
    beachfront: false,
    seaView: false,
  },
];

export const resorts: Resort[] = resortMetadata.map((metadata) => {
  const property = findPropertyBySlug(metadata.id);

  return {
    id: metadata.id,
    name: property?.name ?? metadata.id,
    slug: property?.slug ?? metadata.id,
    destination: property?.location ?? "",
    country: property?.country ?? "",
    brand: property?.brand ?? "Premier Resort Travel",
    image: property?.image ?? "/images/home-about-gallery-main.jpg",
    collections: resortCollectionIdsByResortId[metadata.id] ?? [],
    tags: metadata.tags,
    adultsOnly: metadata.adultsOnly,
    familyFriendly: metadata.familyFriendly,
    beachfront: metadata.beachfront,
    seaView: metadata.seaView,
    seasonalBeachNote: metadata.seasonalBeachNote,
    description:
      property?.description ?? "A polished luxury stay selected for Premier Resort Travel clients.",
    highlight: property?.highlight ?? "A curated luxury resort fit for thoughtful travel planning.",
  };
});

export function findResortById(id: string) {
  return resorts.find((resort) => resort.id === id);
}

export function findResortBySlug(slug: string) {
  return resorts.find((resort) => resort.slug === slug);
}

export function resortsForCollection(resortIds: string[]) {
  return resortIds
    .map((resortId) => findResortById(resortId))
    .filter((resort): resort is Resort => Boolean(resort));
}

