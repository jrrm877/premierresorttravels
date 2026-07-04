import { findPropertyBySlug } from "../lib/property-data";

export type CollectionFaq = {
  question: string;
  answer: string;
};

export type ResortCollection = {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  heroImage: string;
  featuredImage: string;
  featuredBadge?: string;
  resortIds: string[];
  filters: string[];
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  faqs: CollectionFaq[];
  relatedCollectionIds: string[];
  note?: string;
};

const imageFor = (slug: string, fallback = "/images/home-about-gallery-main.jpg") =>
  findPropertyBySlug(slug)?.image ?? fallback;

const sharedFaqs = {
  fit: {
    question: "How do I know which resort in this collection is the best fit?",
    answer:
      "Start with who is traveling, the pace you want, and what would make the trip feel effortless. We use those details to narrow the collection to the strongest resort matches.",
  },
  perks: {
    question: "Can Premier Resort Travel help with perks and special requests?",
    answer:
      "Yes. When available, we help identify advisor perks, preferred room categories, special occasion notes, and planning details that can elevate the stay.",
  },
  compare: {
    question: "Can one resort belong to more than one collection?",
    answer:
      "Yes. A resort may be excellent for romance, wellness, sea views, and ultra-luxury at the same time, so collections are designed around traveler intent rather than a single label.",
  },
};

export const resortCollections: ResortCollection[] = [
  {
    id: "signature-collection",
    title: "Signature Collection",
    slug: "signature-collection",
    featuredBadge: "Premier Favorite",
    description:
      "Our personal favorites for exceptional luxury, service, dining, and overall experience.",
    shortDescription: "Our most trusted luxury resort shortlist.",
    heroImage: imageFor("moon-palace-the-grand-cancun"),
    featuredImage: imageFor("le-blanc-spa-resort-cancun"),
    resortIds: [
      "moon-palace-the-grand-cancun",
      "le-blanc-spa-resort-cancun",
      "le-blanc-spa-resort-los-cabos",
      "moon-palace-cancun",
      "baglioni-resort-sardinia",
    ],
    filters: ["Collection", "Luxury", "Couples", "Family Friendly"],
    tags: ["signature", "luxury", "service", "dining"],
    seoTitle: "Signature Luxury Resort Collection | Premier Resort Travel",
    seoDescription:
      "Explore Premier Resort Travel's Signature Collection of luxury resorts selected for service, dining, amenities, and overall vacation experience.",
    faqs: [
      sharedFaqs.fit,
      {
        question: "Why are these resorts in the Signature Collection?",
        answer:
          "These are the resorts we return to first when travelers want a polished experience with strong service, memorable dining, and a high-confidence luxury fit.",
      },
      sharedFaqs.perks,
    ],
    relatedCollectionIds: ["ultra-luxury", "romantic-getaways", "family-friendly"],
  },
  {
    id: "adults-only",
    title: "Adults Only",
    slug: "adults-only",
    description: "Peaceful luxury designed exclusively for adults.",
    shortDescription: "Quiet, polished escapes for adult travelers.",
    heroImage: imageFor("le-blanc-spa-resort-los-cabos"),
    featuredImage: imageFor("sun-palace"),
    resortIds: [
      "le-blanc-spa-resort-cancun",
      "le-blanc-spa-resort-los-cabos",
      "sun-palace",
      "cozumel-palace",
      "baglioni-resort-sardinia",
      "baglioni-masseria-muzza-resort-and-spa",
      "casa-baglioni",
      "baglioni-hotel-regina",
      "baglioni-hotel-luna",
    ],
    filters: ["Adults Only", "Collection", "Couples"],
    tags: ["adults-only", "romance", "spa", "quiet-luxury"],
    seoTitle: "Adults Only Luxury Resort Collection | Premier Resort Travel",
    seoDescription:
      "Browse adults-only and adult-oriented luxury resorts for peaceful service, romance, spa time, and refined travel.",
    faqs: [
      sharedFaqs.fit,
      {
        question: "Are all resorts in this collection strictly adults-only?",
        answer:
          "Some are true adults-only resorts, while others are adult-oriented luxury hotels or resorts that fit couples and grown-up escapes especially well.",
      },
      sharedFaqs.compare,
    ],
    relatedCollectionIds: ["romantic-getaways", "honeymoons", "spa-wellness"],
  },
  {
    id: "family-friendly",
    title: "Family Friendly",
    slug: "family-friendly",
    description: "Luxury vacations for every generation.",
    shortDescription: "Resorts with space, activity, and broad family appeal.",
    heroImage: imageFor("moon-palace-the-grand-cancun"),
    featuredImage: imageFor("moon-palace-jamaica"),
    resortIds: [
      "moon-palace-cancun",
      "moon-palace-the-grand-cancun",
      "moon-palace-jamaica",
      "moon-palace-the-grand-punta-cana",
      "beach-palace",
      "playacar-palace",
    ],
    filters: ["Family Friendly", "Collection"],
    tags: ["family", "multigenerational", "kids", "groups"],
    seoTitle: "Family Friendly Luxury Resort Collection | Premier Resort Travel",
    seoDescription:
      "Explore family-friendly luxury resorts with broad dining, pools, activities, and space for multigenerational vacations.",
    faqs: [
      sharedFaqs.fit,
      {
        question: "Which resorts are best for multigenerational family trips?",
        answer:
          "Moon Palace Cancun, Moon Palace The Grand Cancun, and Moon Palace Jamaica are especially strong when travelers need options for several ages at once.",
      },
      sharedFaqs.perks,
    ],
    relatedCollectionIds: ["signature-collection", "golf-escapes", "sea-views"],
  },
  {
    id: "romantic-getaways",
    title: "Romantic Getaways",
    slug: "romantic-getaways",
    description:
      "Beautiful resorts and hotels for anniversaries, quiet escapes, and time together.",
    shortDescription: "Romance-forward stays with atmosphere and service.",
    heroImage: imageFor("baglioni-hotel-luna"),
    featuredImage: imageFor("le-blanc-spa-resort-cancun"),
    resortIds: [
      "le-blanc-spa-resort-cancun",
      "le-blanc-spa-resort-los-cabos",
      "sun-palace",
      "cozumel-palace",
      "baglioni-resort-sardinia",
      "baglioni-masseria-muzza-resort-and-spa",
      "baglioni-hotel-luna",
      "moon-palace-the-grand-cancun",
    ],
    filters: ["Adults Only", "Collection", "Destination"],
    tags: ["romance", "anniversary", "couples", "dining"],
    seoTitle: "Romantic Luxury Resort Collection | Premier Resort Travel",
    seoDescription:
      "Find romantic luxury resorts and hotels for couples, anniversaries, elevated dining, spa time, and memorable getaways.",
    faqs: [
      sharedFaqs.fit,
      {
        question: "Which romantic resorts are strongest for a quiet escape?",
        answer:
          "Le Blanc Cancun, Le Blanc Los Cabos, Sun Palace, and Baglioni Hotel Luna are usually the strongest starting points for quieter romantic travel.",
      },
      sharedFaqs.compare,
    ],
    relatedCollectionIds: ["honeymoons", "adults-only", "ultra-luxury"],
  },
  {
    id: "honeymoons",
    title: "Honeymoons",
    slug: "honeymoons",
    description:
      "Resorts and hotels with the sense of occasion honeymoon travel deserves.",
    shortDescription: "Milestone-worthy stays for newlyweds.",
    heroImage: imageFor("le-blanc-spa-resort-cancun"),
    featuredImage: imageFor("baglioni-resort-sardinia"),
    resortIds: [
      "le-blanc-spa-resort-cancun",
      "le-blanc-spa-resort-los-cabos",
      "sun-palace",
      "baglioni-hotel-luna",
      "baglioni-resort-sardinia",
      "baglioni-masseria-muzza-resort-and-spa",
      "cozumel-palace",
    ],
    filters: ["Adults Only", "Collection", "Destination"],
    tags: ["honeymoon", "romance", "spa", "sea-view"],
    seoTitle: "Luxury Honeymoon Resort Collection | Premier Resort Travel",
    seoDescription:
      "Browse honeymoon-worthy luxury resorts and hotels for couples seeking romance, service, sea views, and memorable celebration travel.",
    faqs: [
      sharedFaqs.fit,
      {
        question: "Should a honeymoon resort be adults-only?",
        answer:
          "Adults-only can help if the couple wants quiet and romance, but boutique European hotels and scenic resorts can also be excellent honeymoon fits.",
      },
      sharedFaqs.perks,
    ],
    relatedCollectionIds: ["romantic-getaways", "adults-only", "sea-views"],
  },
  {
    id: "destination-weddings",
    title: "Destination Weddings",
    slug: "destination-weddings",
    description:
      "Resorts with the space, service, and guest appeal to support wedding celebrations.",
    shortDescription: "Wedding-ready resorts for couples and guests.",
    heroImage: imageFor("playacar-palace"),
    featuredImage: imageFor("moon-palace-cancun"),
    resortIds: [
      "moon-palace-cancun",
      "moon-palace-the-grand-cancun",
      "moon-palace-jamaica",
      "playacar-palace",
      "le-blanc-spa-resort-cancun",
      "le-blanc-spa-resort-los-cabos",
      "baglioni-resort-sardinia",
    ],
    filters: ["Collection", "Family Friendly", "Adults Only"],
    tags: ["weddings", "groups", "celebrations"],
    seoTitle: "Destination Wedding Resort Collection | Premier Resort Travel",
    seoDescription:
      "Explore luxury resorts for destination weddings, room blocks, guest experiences, welcome events, and celebration travel.",
    faqs: [
      {
        question: "How do we choose a destination wedding resort?",
        answer:
          "Start with the guest list. The right resort should fit the couple's style while also making travel, dining, room choice, and activities comfortable for guests.",
      },
      sharedFaqs.perks,
      sharedFaqs.compare,
    ],
    relatedCollectionIds: ["family-friendly", "romantic-getaways", "sea-views"],
  },
  {
    id: "spa-wellness",
    title: "Spa & Wellness",
    slug: "spa-wellness",
    description:
      "Restorative resorts for spa days, slower mornings, and a more balanced vacation rhythm.",
    shortDescription: "Spa-forward escapes with room to exhale.",
    heroImage: imageFor("baglioni-masseria-muzza-resort-and-spa"),
    featuredImage: imageFor("le-blanc-spa-resort-los-cabos"),
    resortIds: [
      "le-blanc-spa-resort-cancun",
      "le-blanc-spa-resort-los-cabos",
      "baglioni-masseria-muzza-resort-and-spa",
      "sun-palace",
      "moon-palace-cancun",
      "moon-palace-jamaica",
      "cozumel-palace",
    ],
    filters: ["Adults Only", "Family Friendly", "Collection"],
    tags: ["spa", "wellness", "relaxation", "service"],
    seoTitle: "Spa and Wellness Resort Collection | Premier Resort Travel",
    seoDescription:
      "Discover spa and wellness resorts for couples, families, relaxation, hydrotherapy, slower travel, and restorative luxury vacations.",
    faqs: [
      sharedFaqs.fit,
      {
        question: "Are wellness resorts only for couples?",
        answer:
          "No. Some wellness-forward resorts are perfect for couples, while others add spa and slower pacing to a larger family or group resort experience.",
      },
      sharedFaqs.perks,
    ],
    relatedCollectionIds: ["adults-only", "honeymoons", "ultra-luxury"],
  },
  {
    id: "golf-escapes",
    title: "Golf Escapes",
    slug: "golf-escapes",
    description:
      "Resorts where golf access pairs with beach time, dining, and a full vacation experience.",
    shortDescription: "Golf-friendly resorts with plenty beyond the course.",
    heroImage: imageFor("moon-palace-cancun"),
    featuredImage: imageFor("le-blanc-spa-resort-los-cabos"),
    resortIds: [
      "moon-palace-cancun",
      "moon-palace-the-grand-cancun",
      "moon-palace-jamaica",
      "moon-palace-the-grand-punta-cana",
      "le-blanc-spa-resort-los-cabos",
    ],
    filters: ["Family Friendly", "Adults Only", "Collection"],
    tags: ["golf", "groups", "active-travel"],
    seoTitle: "Luxury Golf Resort Collection | Premier Resort Travel",
    seoDescription:
      "Browse golf-friendly luxury resorts in Mexico and the Caribbean with beach time, spa, dining, and amenities for non-golfers too.",
    faqs: [
      {
        question: "Can these resorts work when not everyone golfs?",
        answer:
          "Yes. The strongest golf resort picks also have pools, dining, spa, beach time, and activities for travelers who are not playing.",
      },
      sharedFaqs.fit,
      sharedFaqs.perks,
    ],
    relatedCollectionIds: ["family-friendly", "adventure", "signature-collection"],
  },
  {
    id: "adventure",
    title: "Adventure",
    slug: "adventure",
    description:
      "Resorts that make it easy to add diving, snorkeling, island exploring, and active days.",
    shortDescription: "For travelers who want more than a lounge chair.",
    heroImage: imageFor("cozumel-palace"),
    featuredImage: imageFor("moon-palace-jamaica"),
    resortIds: [
      "cozumel-palace",
      "moon-palace-jamaica",
      "moon-palace-cancun",
      "playacar-palace",
      "baglioni-resort-sardinia",
    ],
    filters: ["Destination", "Family Friendly", "Collection"],
    tags: ["adventure", "diving", "snorkeling", "island"],
    seoTitle: "Adventure Resort Collection | Premier Resort Travel",
    seoDescription:
      "Explore resorts for active luxury trips with diving, snorkeling, excursions, island adventures, and easy resort comfort.",
    faqs: [
      {
        question: "Which adventure resort is best for diving?",
        answer:
          "Cozumel Palace is the clearest fit for travelers who want reef access, diving, and snorkeling to shape the trip.",
      },
      sharedFaqs.fit,
      sharedFaqs.compare,
    ],
    relatedCollectionIds: ["sea-views", "family-friendly", "golf-escapes"],
  },
  {
    id: "sea-views",
    title: "Sea Views",
    slug: "sea-views",
    description:
      "Resorts selected for ocean scenery, beachfront settings, and the feeling of waking up near the water.",
    shortDescription: "Ocean-forward stays where the view matters.",
    heroImage: imageFor("le-blanc-spa-resort-cancun"),
    featuredImage: imageFor("baglioni-resort-sardinia"),
    resortIds: [
      "le-blanc-spa-resort-cancun",
      "le-blanc-spa-resort-los-cabos",
      "moon-palace-cancun",
      "moon-palace-the-grand-cancun",
      "moon-palace-jamaica",
      "moon-palace-the-grand-punta-cana",
      "beach-palace",
      "sun-palace",
      "cozumel-palace",
      "playacar-palace",
      "baglioni-resort-sardinia",
    ],
    filters: ["Destination", "Family Friendly", "Adults Only", "Collection"],
    tags: ["sea-view", "beachfront", "beach", "ocean"],
    note:
      "Beach conditions vary seasonally. Contact us for personalized recommendations based on your travel dates.",
    seoTitle: "Sea View Luxury Resort Collection | Premier Resort Travel",
    seoDescription:
      "Browse luxury resorts with sea views, beachfront settings, ocean scenery, and advisor guidance on seasonal beach conditions.",
    faqs: [
      {
        question: "Are sea views guaranteed at every resort?",
        answer:
          "No. Room category, resort layout, and availability matter. We can help identify the right room type and set expectations for your dates.",
      },
      {
        question: "Do beach conditions change?",
        answer:
          "Yes. Beach and water conditions can vary by season, weather, and destination. We recommend asking for current guidance before booking.",
      },
      sharedFaqs.fit,
    ],
    relatedCollectionIds: ["honeymoons", "family-friendly", "adventure"],
  },
  {
    id: "european-luxury",
    title: "European Luxury",
    slug: "european-luxury",
    description:
      "Elegant European hotels and resorts for culture, romance, food, and coastal style.",
    shortDescription: "City icons and Mediterranean resort escapes.",
    heroImage: imageFor("baglioni-hotel-luna"),
    featuredImage: imageFor("casa-baglioni"),
    resortIds: [
      "baglioni-hotel-luna",
      "casa-baglioni",
      "baglioni-hotel-regina",
      "palazzo-firenze",
      "baglioni-resort-sardinia",
      "baglioni-masseria-muzza-resort-and-spa",
    ],
    filters: ["Destination", "Country", "Collection"],
    tags: ["europe", "italy", "culture", "city-hotels"],
    seoTitle: "European Luxury Hotel Collection | Premier Resort Travel",
    seoDescription:
      "Explore European luxury hotels and resorts in Venice, Milan, Rome, Florence, Sardinia, and Puglia with Premier Resort Travel.",
    faqs: [
      {
        question: "Can European hotels be combined with beach resorts?",
        answer:
          "Yes. Many travelers pair Venice, Rome, Milan, or Florence with Sardinia or Puglia for a trip that balances culture and rest.",
      },
      sharedFaqs.fit,
      sharedFaqs.compare,
    ],
    relatedCollectionIds: ["ultra-luxury", "romantic-getaways", "honeymoons"],
  },
  {
    id: "ultra-luxury",
    title: "Ultra Luxury",
    slug: "ultra-luxury",
    description:
      "The most elevated resort and hotel options for travelers prioritizing service, design, dining, and atmosphere.",
    shortDescription: "High-touch stays for exceptional trips.",
    heroImage: imageFor("le-blanc-spa-resort-los-cabos"),
    featuredImage: imageFor("baglioni-resort-sardinia"),
    resortIds: [
      "le-blanc-spa-resort-cancun",
      "le-blanc-spa-resort-los-cabos",
      "moon-palace-the-grand-cancun",
      "baglioni-resort-sardinia",
      "baglioni-masseria-muzza-resort-and-spa",
      "casa-baglioni",
      "baglioni-hotel-regina",
      "baglioni-hotel-luna",
    ],
    filters: ["Adults Only", "Destination", "Country", "Collection"],
    tags: ["ultra-luxury", "service", "design", "fine-dining"],
    seoTitle: "Ultra Luxury Resort and Hotel Collection | Premier Resort Travel",
    seoDescription:
      "Browse ultra-luxury resorts and hotels selected for exceptional service, dining, design, spa, and unforgettable travel experiences.",
    faqs: [
      sharedFaqs.fit,
      {
        question: "What makes a resort ultra luxury?",
        answer:
          "For our purposes, ultra luxury means a stronger combination of service, atmosphere, dining, design, room quality, and overall trip memory.",
      },
      sharedFaqs.perks,
    ],
    relatedCollectionIds: ["signature-collection", "european-luxury", "adults-only"],
  },
];

export const featuredCollection = resortCollections.find(
  (collection) => collection.id === "signature-collection"
)!;

export const brandCollections: ResortCollection[] = [
  {
    id: "palace-resorts",
    title: "Palace Resorts",
    slug: "palace-resorts",
    description:
      "All-inclusive luxury resorts for families, couples, groups, destination weddings, and easy beach vacations.",
    shortDescription: "Classic all-inclusive beach resorts with broad traveler appeal.",
    heroImage: imageFor("beach-palace"),
    featuredImage: imageFor("playacar-palace"),
    resortIds: ["beach-palace", "cozumel-palace", "playacar-palace", "sun-palace"],
    filters: ["Brand", "Family Friendly", "Adults Only", "All-Inclusive"],
    tags: ["palace-resorts", "all-inclusive", "beach", "groups"],
    seoTitle: "Palace Resorts Collection | Premier Resort Travel",
    seoDescription:
      "Explore Palace Resorts with Premier Resort Travel, including Beach Palace, Cozumel Palace, Playacar Palace, and Sun Palace.",
    faqs: [
      sharedFaqs.fit,
      {
        question: "Who are Palace Resorts best for?",
        answer:
          "Palace Resorts are strong for travelers who want all-inclusive ease, beach destinations, broad dining, and resort experiences that can work for couples, families, and groups.",
      },
      sharedFaqs.perks,
    ],
    relatedCollectionIds: ["moon-palace", "le-blanc-spa-resorts", "baglioni"],
  },
  {
    id: "le-blanc-spa-resorts",
    title: "Le Blanc",
    slug: "le-blanc-spa-resorts",
    description:
      "Adults-only, all-inclusive luxury resorts where tranquility, polished service, spa, and dining come together.",
    shortDescription: "Adults-only luxury with refined service, spa, and dining.",
    heroImage: imageFor("le-blanc-spa-resort-los-cabos"),
    featuredImage: imageFor("le-blanc-spa-resort-cancun"),
    resortIds: ["le-blanc-spa-resort-cancun", "le-blanc-spa-resort-los-cabos"],
    filters: ["Brand", "Adults Only", "All-Inclusive", "Luxury"],
    tags: ["le-blanc", "adults-only", "spa", "couples"],
    seoTitle: "Le Blanc Spa Resorts Collection | Premier Resort Travel",
    seoDescription:
      "Compare Le Blanc Cancun and Le Blanc Los Cabos for adults-only luxury, spa, dining, romance, and polished all-inclusive service.",
    faqs: [
      sharedFaqs.fit,
      {
        question: "Which Le Blanc resort should we choose?",
        answer:
          "Le Blanc Cancun is usually best for classic Caribbean beachfront ease, while Le Blanc Los Cabos feels more contemporary, scenic, and wellness-forward.",
      },
      sharedFaqs.perks,
    ],
    relatedCollectionIds: ["palace-resorts", "moon-palace", "baglioni"],
  },
  {
    id: "moon-palace",
    title: "Moon Palace",
    slug: "moon-palace",
    description:
      "Exceptional all-inclusive resorts with expansive amenities, family appeal, dining range, entertainment, and elevated vacation experiences.",
    shortDescription: "Big-resort energy with family-friendly luxury and endless amenities.",
    heroImage: imageFor("moon-palace-the-grand-cancun"),
    featuredImage: imageFor("moon-palace-jamaica"),
    resortIds: [
      "moon-palace-cancun",
      "moon-palace-the-grand-cancun",
      "moon-palace-jamaica",
      "moon-palace-the-grand-punta-cana",
    ],
    filters: ["Brand", "Family Friendly", "All-Inclusive", "Groups"],
    tags: ["moon-palace", "family", "all-inclusive", "water-park"],
    seoTitle: "Moon Palace Resorts Collection | Premier Resort Travel",
    seoDescription:
      "Explore Moon Palace resorts for family vacations, groups, water parks, dining, entertainment, golf, and all-inclusive luxury.",
    faqs: [
      sharedFaqs.fit,
      {
        question: "Why choose Moon Palace?",
        answer:
          "Moon Palace is usually strongest when travelers want the resort itself to be the main event, with more dining, activities, pools, and built-in entertainment.",
      },
      sharedFaqs.perks,
    ],
    relatedCollectionIds: ["palace-resorts", "le-blanc-spa-resorts", "baglioni"],
  },
  {
    id: "baglioni",
    title: "Baglioni",
    slug: "baglioni",
    description:
      "Luxury hotels and resorts in captivating cities, coastlines, and islands.",
    shortDescription: "European and island escapes with timeless Italian elegance.",
    heroImage: imageFor("baglioni-hotel-luna"),
    featuredImage: imageFor("baglioni-resort-sardinia"),
    resortIds: [
      "baglioni-hotel-luna",
      "baglioni-hotel-regina",
      "casa-baglioni",
      "palazzo-firenze",
      "baglioni-resort-sardinia",
      "baglioni-masseria-muzza-resort-and-spa",
    ],
    filters: ["Brand", "Country", "European Luxury", "City Hotels", "Resorts"],
    tags: ["baglioni", "italy", "city-hotels", "resorts", "europe"],
    seoTitle: "Baglioni Hotels & Resorts Collection | Premier Resort Travel",
    seoDescription:
      "Explore Baglioni hotels and resorts in Venice, Rome, Milan, Florence, Sardinia, and Puglia with Premier Resort Travel.",
    faqs: [
      sharedFaqs.fit,
      {
        question: "When should travelers choose Baglioni?",
        answer:
          "Baglioni is ideal when travelers want the hotel or resort to be part of the destination experience, with Italian elegance, memorable settings, dining, and a polished sense of place.",
      },
      {
        question: "Can Baglioni hotels and resorts be combined in one trip?",
        answer:
          "Yes. Many Italy trips pair Venice, Rome, Milan, or Florence with Sardinia or Puglia for a beautiful city-to-resort itinerary.",
      },
      sharedFaqs.compare,
    ],
    relatedCollectionIds: ["le-blanc-spa-resorts", "moon-palace", "palace-resorts"],
  },
];

export const collectionIndexCollections = brandCollections;
export const allResortCollections = [...brandCollections, ...resortCollections];

const collectionSlugAliases: Record<string, string> = {
  "adults-only-resorts": "adults-only",
  "family-flagship-resorts": "family-friendly",
  "european-icon-hotels": "european-luxury",
  "baglioni-city-hotels": "baglioni",
  "baglioni-hotels": "baglioni",
  "baglioni-resorts": "baglioni",
};

export function findCollectionBySlug(slug: string) {
  const canonicalSlug = collectionSlugAliases[slug] ?? slug;

  return allResortCollections.find((collection) => collection.slug === canonicalSlug);
}

export function findCollectionById(id: string) {
  return allResortCollections.find((collection) => collection.id === id);
}

export function getRelatedCollections(collection: ResortCollection) {
  return collection.relatedCollectionIds
    .map((id) => findCollectionById(id))
    .filter((item): item is ResortCollection => Boolean(item));
}

export const resortCollectionIdsByResortId = allResortCollections.reduce<Record<string, string[]>>(
  (acc, collection) => {
    collection.resortIds.forEach((resortId) => {
      acc[resortId] = [...(acc[resortId] ?? []), collection.id];
    });

    return acc;
  },
  {}
);
