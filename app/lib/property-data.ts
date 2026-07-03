import { upscaleResortImage } from "./image-utils";

export type CollectionCard = {
  title: string;
  description: string;
  image: string;
  cta: string;
  href: string;
};

export type JournalPost = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  readTime: string;
  collectionHref: string;
  cta: string;
  featuredPropertySlugs: string[];
  sections: {
    title: string;
    body: string;
  }[];
};

export type PortfolioProperty = {
  slug: string;
  name: string;
  location: string;
  country: string;
  region: string;
  highlight: string;
  description: string;
  image: string;
  tag: string;
  brand: string;
  tripStyle: string;
  perfectFor: string[];
};

export type PortfolioSection = {
  id: string;
  tab: string;
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  href: string;
  properties: PortfolioProperty[];
};

export const collectionCards: CollectionCard[] = [
  {
    title: "Adults-only sanctuaries",
    description:
      "Sophisticated beach stays with polished dining, spa rituals, and a quieter rhythm for couples and celebratory escapes.",
    image: upscaleResortImage(
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/637bgbt7q51510amjja22f7o2b/240?angle=0"
    )!,
    cta: "Explore adults-only stays",
    href: "/collections/adults-only-resorts",
  },
  {
    title: "Family resorts with range",
    description:
      "Large-format resorts with water parks, suites, broad dining, and enough energy for multigenerational trips.",
    image: upscaleResortImage(
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/4parh4uc8p5gj5t9vpsd4n3j34/240?angle=0"
    )!,
    cta: "See family favorites",
    href: "/collections/family-flagship-resorts",
  },
  {
    title: "European icons and hideaways",
    description:
      "Romantic grand hotels, design-led city stays, and Mediterranean resorts for culture-rich itineraries.",
    image: upscaleResortImage(
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/416ej5192t3u12ehio6ks1me4m/240?angle=0"
    )!,
    cta: "Browse European stays",
    href: "/collections/european-icon-hotels",
  },
];

export const journalPosts: JournalPost[] = [
  {
    slug: "best-adults-only-all-inclusive-resorts-for-couples",
    eyebrow: "Couples Escapes",
    title: "Best adults-only all-inclusive resorts for couples who want a polished beach escape",
    description:
      "A closer look at the adults-only stays that work best for romance, spa days, elevated dining, and an easier luxury beach rhythm.",
    image: upscaleResortImage(
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/2eel4s41k15j9anvu6kp927m2e/240?angle=0"
    )!,
    readTime: "4 min read",
    collectionHref: "/collections/adults-only-resorts",
    cta: "Read the couples guide",
    featuredPropertySlugs: ["sun-palace", "le-blanc-spa-resort-cancun", "le-blanc-spa-resort-los-cabos"],
    sections: [
      {
        title: "What travelers usually want from an adults-only stay",
        body:
          "Most couples are looking for a resort that feels quieter, more service-led, and easier to settle into without sacrificing dining, spa access, or a strong beachfront setting.",
      },
      {
        title: "Where Cancun and Los Cabos feel different",
        body:
          "Cancun tends to appeal to travelers prioritizing classic beachfront energy and all-inclusive ease, while Los Cabos often suits guests who prefer a more contemporary coastal mood and a design-led feel.",
      },
      {
        title: "How to narrow the right fit faster",
        body:
          "Start with trip mood first: romance, celebration, spa time, or pure rest. Once that is clear, the right adults-only resort usually becomes much easier to identify.",
      },
    ],
  },
  {
    slug: "best-family-all-inclusive-resorts-for-multigenerational-trips",
    eyebrow: "Family Travel",
    title: "Best family all-inclusive resorts for multigenerational trips, water parks, and longer stays",
    description:
      "See which family-oriented resorts work best when travelers want big amenities, broad dining, and enough range to keep every age group happy.",
    image: upscaleResortImage(
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/oe0r882lrt1u506d70ulkn7s35/240?angle=0"
    )!,
    readTime: "5 min read",
    collectionHref: "/collections/family-flagship-resorts",
    cta: "Read the family guide",
    featuredPropertySlugs: [
      "moon-palace-the-grand-cancun",
      "moon-palace-cancun",
      "moon-palace-jamaica",
    ],
    sections: [
      {
        title: "Why bigger resorts can work better for families",
        body:
          "When travelers are juggling different ages, appetites, and activity levels, larger resorts often win because they offer more built-in choice without adding planning friction.",
      },
      {
        title: "The difference between classic family resorts and flagship resorts",
        body:
          "Flagship resorts tend to have more dining, larger activity zones, bigger pool footprints, and stronger appeal for travelers treating the resort itself as the main event.",
      },
      {
        title: "The easiest way to match the right family stay",
        body:
          "Lead with the traveler profile: toddlers, teens, grandparents, or mixed-age groups. That lens is usually more useful than comparing square footage alone.",
      },
    ],
  },
  {
    slug: "best-luxury-city-hotels-in-italy-for-romantic-itineraries",
    eyebrow: "European City Stays",
    title: "Best luxury city hotels in Italy for romantic itineraries, culture trips, and iconic arrivals",
    description:
      "From Venice to Rome and Milan, these city hotels are the strongest options for travelers building a Europe itinerary around romance, food, design, and culture.",
    image: upscaleResortImage(
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/8clg2ggog92c3fe5139cap356q/240?angle=0"
    )!,
    readTime: "4 min read",
    collectionHref: "/collections/european-icon-hotels",
    cta: "Read the Europe guide",
    featuredPropertySlugs: ["baglioni-hotel-luna", "baglioni-hotel-regina", "casa-baglioni"],
    sections: [
      {
        title: "Why travelers choose city icons over generic luxury hotels",
        body:
          "For many Europe trips, the hotel is part of the experience itself. Arrival, neighborhood feel, architecture, and atmosphere matter just as much as room finish and service.",
      },
      {
        title: "How Venice, Rome, and Milan serve different trip moods",
        body:
          "Venice leans cinematic and romantic, Rome feels grand and heritage-rich, and Milan often appeals most to travelers who want style, dining, and a more contemporary pace.",
      },
      {
        title: "When to add a city hotel to a wider beach or resort itinerary",
        body:
          "A strong city stay works especially well as the opening or closing act of a larger trip, giving travelers contrast between cultural immersion and a slower resort finish.",
      },
    ],
  },
];

export const portfolioSections: PortfolioSection[] = [
  {
    id: "palace-resorts",
    tab: "Palace Resorts",
    eyebrow: "Beachfront Classics",
    title: "Palace Resorts for easy all-inclusive beach stays",
    description:
      "These resorts are strong for travelers who want a familiar luxury beach experience with a polished all-inclusive format, convenient locations, and broad appeal.",
    accent: "accent-coral",
    href: "/collections/palace-resorts",
    properties: [
      {
        slug: "beach-palace",
        name: "Beach Palace",
        location: "Cancun, Mexico",
        country: "Mexico",
        region: "North America",
        highlight: "Family-friendly beachfront resort with sea views and easy all-inclusive value.",
        description:
          "A polished Cancun beachfront resort designed for easy family escapes, sea views, and classic all-inclusive convenience.",
        image:
          "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/3lverrm7gl48r759qtvus92n1e/240?angle=0",
        tag: "Family Beach",
        brand: "Palace Resorts",
        tripStyle: "Family Beach Escape",
        perfectFor: ["Families", "Beach days", "Easy all-inclusive planning"],
      },
      {
        slug: "cozumel-palace",
        name: "Cozumel Palace",
        location: "Cozumel, Mexico",
        country: "Mexico",
        region: "North America",
        highlight: "A natural fit for divers and snorkelers who want quick reef access and island ease.",
        description:
          "An island retreat in Cozumel known for reef access, easygoing luxury, and standout appeal for divers and snorkelers.",
        image:
          "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/rv80jfunu95dtd5g2ntg7thb34/240?angle=0",
        tag: "Diving Escape",
        brand: "Palace Resorts",
        tripStyle: "Water Adventure",
        perfectFor: ["Divers", "Snorkelers", "Island lovers"],
      },
      {
        slug: "playacar-palace",
        name: "Playacar Palace",
        location: "Playa del Carmen, Mexico",
        country: "Mexico",
        region: "North America",
        highlight: "Walkable setting near town paired with beachfront comfort and family-ready amenities.",
        description:
          "A Playa del Carmen base that blends walkable location, beachfront relaxation, and family-friendly resort comforts.",
        image:
          "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/grr1mp7f6h1q569etitj2r0f3m/240?angle=0",
        tag: "Town + Beach",
        brand: "Palace Resorts",
        tripStyle: "Walkable Beach Escape",
        perfectFor: ["Couples", "Families", "Playa del Carmen access"],
      },
      {
        slug: "sun-palace",
        name: "Sun Palace",
        location: "Cancun, Mexico",
        country: "Mexico",
        region: "North America",
        highlight: "Adults-only oceanfront suites with a slower pace for couples and romantic stays.",
        description:
          "An adults-only Cancun stay built around oceanfront suites, couples escapes, and a more serene all-inclusive pace.",
        image:
          "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/2eel4s41k15j9anvu6kp927m2e/240?angle=0",
        tag: "Adults-Only",
        brand: "Palace Resorts",
        tripStyle: "Romantic Escape",
        perfectFor: ["Couples", "Anniversaries", "Adults-only getaways"],
      },
    ],
  },
  {
    id: "moon-palace",
    tab: "Moon Palace",
    eyebrow: "Big-Experience Resorts",
    title: "Moon Palace for family energy, space, and variety",
    description:
      "This collection is ideal for travelers who want larger resorts, broader dining, and enough amenities to keep every age group engaged.",
    accent: "accent-gold",
    href: "/collections/moon-palace",
    properties: [
      {
        slug: "moon-palace-cancun",
        name: "Moon Palace Cancun",
        location: "Cancun, Mexico",
        country: "Mexico",
        region: "North America",
        highlight: "A large-scale stay across Sunrise and Nizuc with pools, golf, and family appeal.",
        description:
          "A large-scale Cancun resort spanning the Sunrise and Nizuc sections, with broad dining, pools, and family appeal.",
        image:
          "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/oe0r882lrt1u506d70ulkn7s35/240?angle=0",
        tag: "Flagship Resort",
        brand: "Moon Palace",
        tripStyle: "Family Mega-Resort",
        perfectFor: ["Families", "Golf travelers", "Multigenerational groups"],
      },
      {
        slug: "moon-palace-the-grand-cancun",
        name: "Moon Palace The Grand - Cancun",
        location: "Cancun, Mexico",
        country: "Mexico",
        region: "North America",
        highlight: "Elevated family luxury with a major water park, numerous restaurants, and extra space.",
        description:
          "An elevated Moon Palace experience with a major water park, numerous dining venues, and extra space for multigenerational trips.",
        image:
          "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/4parh4uc8p5gj5t9vpsd4n3j34/240?angle=0",
        tag: "Water Park",
        brand: "Moon Palace",
        tripStyle: "Luxury Family Escape",
        perfectFor: ["Families", "Groups", "Long resort stays"],
      },
      {
        slug: "moon-palace-jamaica",
        name: "Moon Palace Jamaica",
        location: "Ocho Rios, Jamaica",
        country: "Jamaica",
        region: "Caribbean",
        highlight: "A lively beachfront base with family-friendly energy and quick access to island adventures.",
        description:
          "A lively Ocho Rios resort mixing beachfront ease, family-friendly energy, and quick access to island adventures.",
        image:
          "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/c52nfg6ckt4lr1r36pdi96fd7u/240?angle=0",
        tag: "Island Family",
        brand: "Moon Palace",
        tripStyle: "Jamaica Family Escape",
        perfectFor: ["Families", "Island explorers", "Beach lovers"],
      },
      {
        slug: "moon-palace-the-grand-punta-cana",
        name: "Moon Palace The Grand - Punta Cana",
        location: "Punta Cana, Dominican Republic",
        country: "Dominican Republic",
        region: "Caribbean",
        highlight: "A major upcoming family resort opening in Spring 2026 with expansive amenities.",
        description:
          "A Punta Cana flagship positioned for splashy family travel and expansive resort amenities ahead of its Spring 2026 opening.",
        image:
          "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/q98qi1u5v96claikiqb4pkb83l/240?angle=0",
        tag: "Coming 2026",
        brand: "Moon Palace",
        tripStyle: "Next-Generation Family Resort",
        perfectFor: ["Future planners", "Families", "Large resort fans"],
      },
    ],
  },
  {
    id: "le-blanc",
    tab: "Le Blanc",
    eyebrow: "Refined Wellness Escapes",
    title: "Le Blanc for adults-only luxury with a serene edge",
    description:
      "Le Blanc suits travelers prioritizing elevated dining, spa-led relaxation, and a more sophisticated all-inclusive atmosphere.",
    accent: "accent-sage",
    href: "/collections/le-blanc-spa-resorts",
    properties: [
      {
        slug: "le-blanc-spa-resort-cancun",
        name: "Le Blanc Spa Resort Cancun",
        location: "Cancun, Mexico",
        country: "Mexico",
        region: "North America",
        highlight: "Sophisticated adults-only beachfront luxury with a deeply polished service experience.",
        description:
          "A refined adults-only Cancun address focused on spa-driven relaxation, elevated dining, and a more sophisticated beachfront mood.",
        image:
          "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/637bgbt7q51510amjja22f7o2b/240?angle=0",
        tag: "Signature Spa",
        brand: "Le Blanc",
        tripStyle: "Adults-Only Wellness",
        perfectFor: ["Couples", "Spa travelers", "Celebratory escapes"],
      },
      {
        slug: "le-blanc-spa-resort-los-cabos",
        name: "Le Blanc Spa Resort Los Cabos",
        location: "Los Cabos, Mexico",
        country: "Mexico",
        region: "North America",
        highlight: "A contemporary sanctuary with quieter luxury, wellness touches, and indulgent coastal design.",
        description:
          "A Los Cabos sanctuary with contemporary design, indulgent wellness touches, and a quieter luxury all-inclusive atmosphere.",
        image:
          "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/lslu08vvvl1qdfuqoa06ptdn59/240?angle=0",
        tag: "Coastal Wellness",
        brand: "Le Blanc",
        tripStyle: "Wellness by the Sea",
        perfectFor: ["Adults-only travelers", "Spa lovers", "Contemporary luxury fans"],
      },
    ],
  },
  {
    id: "baglioni-cities",
    tab: "Baglioni Cities",
    eyebrow: "Urban European Icons",
    title: "Baglioni city stays for culture, design, and classic arrival moments",
    description:
      "These properties work well for travelers building European itineraries around romance, architecture, museums, fashion, and heritage-rich neighborhoods.",
    accent: "accent-plum",
    href: "/collections/baglioni-city-hotels",
    properties: [
      {
        slug: "baglioni-hotel-regina",
        name: "Baglioni Hotel Regina",
        location: "Rome, Italy",
        country: "Italy",
        region: "Europe",
        highlight: "Grand Roman glamour with refined service and access to one of the city’s most elegant districts.",
        description:
          "A grand Roman city hotel for travelers who want classic luxury, central access, and a more residential take on Rome.",
        image:
          "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/8clg2ggog92c3fe5139cap356q/240?angle=0",
        tag: "Rome Icon",
        brand: "Baglioni",
        tripStyle: "European City Stay",
        perfectFor: ["Culture itineraries", "City breaks", "Classic luxury lovers"],
      },
      {
        slug: "baglioni-hotel-luna",
        name: "Baglioni Hotel Luna",
        location: "Venice, Italy",
        country: "Italy",
        region: "Europe",
        highlight: "Romantic Venetian heritage and one of the most cinematic arrivals in the portfolio.",
        description:
          "A landmark Venice stay pairing heritage interiors, romantic atmosphere, and a deeply cinematic sense of arrival.",
        image:
          "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/416ej5192t3u12ehio6ks1me4m/240?angle=0",
        tag: "Venice Legend",
        brand: "Baglioni",
        tripStyle: "Romantic City Escape",
        perfectFor: ["Couples", "Venice lovers", "Heritage hotel travelers"],
      },
      {
        slug: "casa-baglioni",
        name: "Casa Baglioni",
        location: "Milan, Italy",
        country: "Italy",
        region: "Europe",
        highlight: "A design-forward boutique stay for fashion, dining, and contemporary Milan energy.",
        description:
          "A Milan address with boutique polish, design-minded interiors, and a cosmopolitan base for fashion and culture trips.",
        image:
          "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/as7tii2iqd69324ohduqbqrt3g/240?angle=0",
        tag: "Design Stay",
        brand: "Baglioni",
        tripStyle: "Design-Led City Break",
        perfectFor: ["Design travelers", "Fashion trips", "Dining weekends"],
      },
      {
        slug: "palazzo-firenze",
        name: "Palazzo Firenze",
        location: "Florence, Italy",
        country: "Italy",
        region: "Europe",
        highlight: "An art-rich city base for walkable discovery and heritage architecture.",
        description:
          "A Florence urban stay for art-rich itineraries, walkable discovery, and travelers drawn to heritage architecture.",
        image:
          "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/2vd98eos8d5kn25d8oahntlh2r/240?angle=0",
        tag: "Art Escape",
        brand: "Baglioni",
        tripStyle: "Art & Culture Stay",
        perfectFor: ["Art lovers", "Walkable city stays", "Historic ambience"],
      },
      {
        slug: "baglioni-hotel-london",
        name: "Baglioni Hotel London",
        location: "London, United Kingdom",
        country: "United Kingdom",
        region: "Europe",
        highlight: "A polished residential-style London base near parks, museums, and classic cultural stops.",
        description:
          "A London base that leans residential and polished, suited to travelers wanting refined service near major museums and parks.",
        image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad",
        tag: "London Address",
        brand: "Baglioni",
        tripStyle: "Classic London Stay",
        perfectFor: ["Museum lovers", "Long weekends", "Family city travel"],
      },
    ],
  },
  {
    id: "baglioni-resorts",
    tab: "Baglioni Resorts",
    eyebrow: "Mediterranean & Island Retreats",
    title: "Baglioni resorts for Mediterranean charm and island glamour",
    description:
      "For travelers leaning toward slower luxury, these stays balance beautiful settings with a more boutique, destination-driven point of view.",
    accent: "accent-blue",
    href: "/collections/baglioni-resorts",
    properties: [
      {
        slug: "baglioni-resort-maldives",
        name: "Baglioni Resort Maldives",
        location: "Maldives",
        country: "Maldives",
        region: "Indian Ocean",
        highlight: "Overwater style, lagoon calm, and polished barefoot luxury in an all-inclusive island setting.",
        description:
          "An all-inclusive island resort combining overwater style, lagoon calm, and a polished version of barefoot luxury.",
        image:
          "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/u1b14u1cj57qrb4trvcjtuiq4p/240?angle=0",
        tag: "Island Escape",
        brand: "Baglioni",
        tripStyle: "Barefoot Luxury",
        perfectFor: ["Honeymoons", "Private-island lovers", "Maldives travelers"],
      },
      {
        slug: "baglioni-masseria-muzza-resort-and-spa",
        name: "Baglioni Masseria Muzza Resort & Spa",
        location: "Puglia, Italy",
        country: "Italy",
        region: "Europe",
        highlight: "Countryside calm, spa indulgence, and access to southern Italy’s coast and villages.",
        description:
          "A Puglia retreat that balances countryside calm, spa indulgence, and easy access to southern Italy's coast.",
        image:
          "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/4ane9h7het27r4kh6drrljtn6f/240?angle=0",
        tag: "Puglia Retreat",
        brand: "Baglioni",
        tripStyle: "Countryside Escape",
        perfectFor: ["Slow travel", "Spa weekends", "Southern Italy itineraries"],
      },
      {
        slug: "baglioni-resort-sardinia",
        name: "Baglioni Resort Sardinia",
        location: "Sardinia, Italy",
        country: "Italy",
        region: "Europe",
        highlight: "A Mediterranean summer resort with beach days, family appeal, and coastal glamour.",
        description:
          "A Sardinian coastal resort with Mediterranean glamour, beach days, and family-friendly summer luxury.",
        image:
          "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/horpei73k14d7a86lks4gkvg0l/240?angle=0",
        tag: "Mediterranean Coast",
        brand: "Baglioni",
        tripStyle: "Mediterranean Resort",
        perfectFor: ["Summer holidays", "Beach travelers", "Family luxury escapes"],
      },
    ],
  },
].map((section) => ({
  ...section,
  properties: section.properties.map((property) => ({
    ...property,
    image: upscaleResortImage(property.image)!,
  })),
}));

export const allProperties = portfolioSections.flatMap((section) => section.properties);

export function findPropertyBySlug(slug: string) {
  return allProperties.find((property) => property.slug === slug);
}

export function findPortfolioSectionById(id: string) {
  return portfolioSections.find((section) => section.id === id);
}

export function findCollectionHrefForProperty(slug: string) {
  const matchingFeaturedCollection = featuredCollections.find((collection) =>
    collection.properties.some((property) => property.slug === slug)
  );

  return matchingFeaturedCollection ? `/collections/${matchingFeaturedCollection.slug}` : "/#portfolio-tabs";
}

export type FeaturedCollection = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  highlights: string[];
  idealFor: string[];
  planningNotes: {
    title: string;
    body: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  journalSlug?: string;
  properties: PortfolioProperty[];
};

function propertiesBySlug(slugs: string[]) {
  return slugs
    .map((slug) => findPropertyBySlug(slug))
    .filter((property): property is PortfolioProperty => Boolean(property));
}

function sectionProperties(sectionId: string) {
  return findPortfolioSectionById(sectionId)?.properties ?? [];
}

export const featuredCollections: FeaturedCollection[] = [
  {
    slug: "palace-resorts",
    eyebrow: "Palace Resorts",
    title: "Palace Resorts for easy all-inclusive beach stays in Mexico and the Caribbean",
    description:
      "This collection is designed for travelers who want a polished all-inclusive beach trip with familiar resort flow, strong locations, and broad appeal across couples, families, and activity-led escapes.",
    image: findPropertyBySlug("beach-palace")?.image ?? collectionCards[1].image,
    highlights: [
      "Classic all-inclusive beach resort format",
      "Easy fits for families, couples, and water-focused travelers",
      "Strong starting point for Cancun, Cozumel, and Playa del Carmen",
    ],
    idealFor: ["Beach vacations", "Family escapes", "Couples trips", "Diving and snorkeling add-ons"],
    planningNotes: [
      {
        title: "Lead with destination first",
        body:
          "Within Palace Resorts, the city or coastline usually narrows the choice fastest. Cancun, Cozumel, and Playa del Carmen each serve a different pace and traveler expectation.",
      },
      {
        title: "Use trip purpose to split family and adults-only needs",
        body:
          "Beach Palace and Playacar Palace often work well when ease and location matter, while Sun Palace stands out when the traveler wants adults-only calm.",
      },
      {
        title: "Water access can be the deciding factor",
        body:
          "For travelers prioritizing reef time, snorkeling, or diving access, Cozumel Palace usually rises quickly to the top of the shortlist.",
      },
    ],
    faqs: [
      {
        question: "Which Palace Resort is best for a classic Cancun beach stay?",
        answer:
          "Beach Palace is often the easiest fit for travelers who want a polished Cancun all-inclusive with family appeal and a familiar beachfront rhythm.",
      },
      {
        question: "Which one is strongest for diving and snorkeling?",
        answer:
          "Cozumel Palace is the natural standout for travelers who want quick reef access and an island-focused trip built around the water.",
      },
    ],
    properties: sectionProperties("palace-resorts"),
  },
  {
    slug: "moon-palace",
    eyebrow: "Moon Palace",
    title: "Moon Palace resorts for bigger family energy, flagship amenities, and longer stays",
    description:
      "Moon Palace is best for travelers who want the resort itself to be a major part of the trip, with larger footprints, broad dining, and enough range to keep every age group engaged.",
    image: findPropertyBySlug("moon-palace-the-grand-cancun")?.image ?? collectionCards[1].image,
    highlights: [
      "Large-format all-inclusive resorts with broad amenity range",
      "Strong for multigenerational groups and longer family stays",
      "Ideal when water parks, suites, and variety matter most",
    ],
    idealFor: ["Multigenerational travel", "Long weekends with kids", "Flagship resort stays", "Travelers who want everything on site"],
    planningNotes: [
      {
        title: "Start with how much activity the trip needs",
        body:
          "Moon Palace works best when the traveler wants a high-energy resort environment with enough dining, pools, and built-in entertainment to keep the whole group engaged.",
      },
      {
        title: "Differentiate between broad family appeal and flagship appeal",
        body:
          "Moon Palace Cancun is strong for scale and ease, while Moon Palace The Grand - Cancun rises when the traveler wants a more elevated flagship feel and a bigger amenity story.",
      },
      {
        title: "Traveler makeup matters more than room category alone",
        body:
          "A family with toddlers, teens, or grandparents may land on a different Moon Palace property even when the destination is similar.",
      },
    ],
    faqs: [
      {
        question: "Which Moon Palace property is best for the biggest flagship experience?",
        answer:
          "Moon Palace The Grand - Cancun is usually the standout when travelers want the broadest amenity set, extra dining, and a major water-park-style family experience.",
      },
      {
        question: "Is Moon Palace only for families?",
        answer:
          "Not at all. It is strongest for families and groups, but it can also work well for celebratory trips and travelers who want the resort itself to provide the main entertainment.",
      },
    ],
    properties: sectionProperties("moon-palace"),
  },
  {
    slug: "le-blanc-spa-resorts",
    eyebrow: "Le Blanc",
    title: "Le Blanc Spa Resorts for adults-only luxury, polished service, and spa-led beach stays",
    description:
      "Le Blanc is designed for travelers who want a calmer, more sophisticated all-inclusive experience with elevated dining, attentive service, and a stronger wellness rhythm.",
    image: findPropertyBySlug("le-blanc-spa-resort-cancun")?.image ?? collectionCards[0].image,
    highlights: [
      "Adults-only atmosphere with a quieter luxury pace",
      "High-touch service and spa-forward planning appeal",
      "Strong fit for romance, celebration, and refined beach time",
    ],
    idealFor: ["Couples", "Anniversaries", "Spa lovers", "Travelers upgrading from classic all-inclusive"],
    planningNotes: [
      {
        title: "Le Blanc works best when mood leads the decision",
        body:
          "Travelers choosing Le Blanc are usually prioritizing atmosphere first: service, serenity, romance, and a more elevated resort pace.",
      },
      {
        title: "Use destination to split beachfront style",
        body:
          "Cancun often appeals to travelers who want a classic beachfront arrival, while Los Cabos tends to resonate with guests seeking a more contemporary coastal mood.",
      },
      {
        title: "A shorter shortlist performs better here",
        body:
          "For adults-only travelers, comparing just the strongest two or three options usually creates more clarity than a larger list of nearly similar stays.",
      },
    ],
    faqs: [
      {
        question: "Which Le Blanc property is strongest for romance?",
        answer:
          "Both can work beautifully, but Le Blanc Spa Resort Cancun often stands out for travelers seeking a classic beachfront romance setting with polished all-inclusive ease.",
      },
      {
        question: "Who usually chooses Le Blanc over a larger resort?",
        answer:
          "Travelers who want a more refined, quieter, and service-led adults-only atmosphere often lean toward Le Blanc over larger family-forward properties.",
      },
    ],
    properties: sectionProperties("le-blanc"),
  },
  {
    slug: "baglioni-city-hotels",
    eyebrow: "Baglioni Cities",
    title: "Baglioni city hotels for romance, culture, and iconic arrivals across Europe",
    description:
      "This city collection is strongest for travelers building Europe itineraries around atmosphere, design, grand-hotel arrival, and neighborhoods that feel like part of the trip itself.",
    image: findPropertyBySlug("baglioni-hotel-luna")?.image ?? collectionCards[2].image,
    highlights: [
      "Grand-hotel city stays with strong sense of place",
      "Ideal for Venice, Rome, Milan, Florence, and London itineraries",
      "A refined fit for romance, food, culture, and iconic arrival moments",
    ],
    idealFor: ["Romantic Europe travel", "Art and culture itineraries", "Multi-city stays", "Travelers who want hotel atmosphere"],
    planningNotes: [
      {
        title: "Choose the city before the room category",
        body:
          "Venice, Rome, Milan, Florence, and London all support a different traveler mood. Getting that right tends to clarify the best hotel very quickly.",
      },
      {
        title: "City hotels perform best when they feel like part of the itinerary",
        body:
          "The strongest Baglioni city stays are not only comfortable; they also shape the arrival, neighborhood identity, and memory of the trip itself.",
      },
      {
        title: "Pair these stays with slower coastal time when possible",
        body:
          "Many travelers benefit from opening or closing a longer trip with one of these city hotels before shifting into a resort or countryside rhythm.",
      },
    ],
    faqs: [
      {
        question: "Which Baglioni hotel is best for Venice?",
        answer:
          "Baglioni Hotel Luna is often the clearest Venice choice for travelers prioritizing romance, atmosphere, and one of the most cinematic city arrivals in the portfolio.",
      },
      {
        question: "Can these hotels work beyond couples trips?",
        answer:
          "Absolutely. They are also strong for food-focused Europe itineraries, design travel, milestone celebrations, and travelers who care deeply about hotel atmosphere.",
      },
    ],
    properties: sectionProperties("baglioni-cities"),
  },
  {
    slug: "baglioni-resorts",
    eyebrow: "Baglioni Resorts",
    title: "Baglioni resorts for Mediterranean coastlines, island glamour, and slower luxury rhythm",
    description:
      "This resort collection is ideal for travelers who want a more scenic, design-led luxury pace across the Maldives, Puglia, and Sardinia.",
    image: findPropertyBySlug("baglioni-resort-maldives")?.image ?? collectionCards[2].image,
    highlights: [
      "Mediterranean and Indian Ocean resort settings",
      "Strong for slower luxury and scenery-led itineraries",
      "A natural fit for summer escapes and elevated beach time",
    ],
    idealFor: ["Island vacations", "Mediterranean summer trips", "Luxury beach recovery", "Romantic resort stays"],
    planningNotes: [
      {
        title: "Lead with scenery and pace",
        body:
          "These resorts usually resonate when the traveler wants the destination itself to do the emotional heavy lifting: sea views, slower rhythm, and a more scenic kind of luxury.",
      },
      {
        title: "Use geography to set expectations",
        body:
          "The Maldives, Puglia, and Sardinia each create a very different version of resort time, so the destination should frame the shortlist early.",
      },
      {
        title: "These stays often work best as the restorative part of a wider itinerary",
        body:
          "Baglioni resorts pair especially well with earlier city time, creating contrast between cultural pace and slower coastal relaxation.",
      },
    ],
    faqs: [
      {
        question: "Which Baglioni resort is best for an island-style escape?",
        answer:
          "Baglioni Resort Maldives is the strongest fit when the traveler wants a true island reset with a more cinematic, far-flung luxury mood.",
      },
      {
        question: "Are the Italy resorts more romantic or family-friendly?",
        answer:
          "They can work for both, but they are especially strong for travelers drawn to slower Mediterranean luxury, design, and destination-driven beach time.",
      },
    ],
    properties: sectionProperties("baglioni-resorts"),
  },
  {
    slug: "adults-only-resorts",
    eyebrow: "Adults-Only Escapes",
    title: "Adults-only resorts for spa days, romance, and a quieter luxury pace",
    description:
      "This collection is built for couples, celebratory trips, and travelers who want polished beachfront service with a more serene atmosphere.",
    image: findPropertyBySlug("le-blanc-spa-resort-cancun")?.image ?? collectionCards[0].image,
    highlights: [
      "Refined all-inclusive luxury",
      "Spa-forward resort experiences",
      "Strong fits for couples and celebratory travel",
    ],
    idealFor: ["Couples trips", "Anniversaries", "Spa-centered escapes", "Calmer beachfront stays"],
    planningNotes: [
      {
        title: "Start with the mood, not just the map",
        body:
          "Adults-only travelers are usually choosing between romance, celebration, wellness, or pure rest. That mood is often more useful than destination alone.",
      },
      {
        title: "Use service level as the real differentiator",
        body:
          "Once travelers know they want adults-only, the next deciding factor is usually whether they want a classic beach atmosphere or a more elevated, spa-led experience.",
      },
      {
        title: "Shorter lists convert better",
        body:
          "For couples travel, offering two or three strong-fit properties typically performs better than presenting every available option at once.",
      },
    ],
    faqs: [
      {
        question: "Which adults-only properties are strongest for couples?",
        answer:
          "Le Blanc Spa Resort Cancun, Le Blanc Spa Resort Los Cabos, and Sun Palace are the strongest fits when romance, service, and a quieter resort pace are the priority.",
      },
      {
        question: "Are these better for spa travel or beach travel?",
        answer:
          "They work for both, but the best-fit choice depends on whether the traveler wants polished beachfront energy, a spa-led rhythm, or a more contemporary coastal atmosphere.",
      },
    ],
    journalSlug: "best-adults-only-all-inclusive-resorts-for-couples",
    properties: propertiesBySlug([
      "le-blanc-spa-resort-cancun",
      "le-blanc-spa-resort-los-cabos",
      "sun-palace",
    ]),
  },
  {
    slug: "family-flagship-resorts",
    eyebrow: "Family Flagship Resorts",
    title: "Family-friendly flagship resorts with range, energy, and easy planning",
    description:
      "These are the strongest choices for families and multigenerational groups who want bigger amenities, broad dining, and plenty to do without leaving the resort.",
    image: findPropertyBySlug("moon-palace-the-grand-cancun")?.image ?? collectionCards[1].image,
    highlights: [
      "Water parks, pools, and all-day activity",
      "Family-ready suites and broad dining",
      "High-appeal options for group travel",
    ],
    idealFor: ["Multigenerational trips", "School-break travel", "Longer resort stays", "Water-park families"],
    planningNotes: [
      {
        title: "Think in terms of range",
        body:
          "Family travelers respond well to resorts that can handle multiple ages at once, with enough dining, activity, and room flexibility to keep the trip smooth.",
      },
      {
        title: "Flagship usually means less friction",
        body:
          "When the resort itself is the destination, bigger family properties tend to make planning easier because more of the entertainment and variety is already built in.",
      },
      {
        title: "Lead with who is traveling",
        body:
          "Families with toddlers, older kids, teens, and grandparents often need different things. Matching by traveler makeup usually narrows the right property fastest.",
      },
    ],
    faqs: [
      {
        question: "Which property is best for a true family flagship experience?",
        answer:
          "Moon Palace The Grand - Cancun is the strongest flagship option when travelers want the broadest amenity set, a water park, and extra space for longer stays.",
      },
      {
        question: "Are these good for multigenerational groups?",
        answer:
          "Yes. Moon Palace Cancun, Moon Palace The Grand - Cancun, and Moon Palace Jamaica are especially strong when travelers need wide appeal across age groups.",
      },
    ],
    journalSlug: "best-family-all-inclusive-resorts-for-multigenerational-trips",
    properties: propertiesBySlug([
      "moon-palace-the-grand-cancun",
      "moon-palace-cancun",
      "moon-palace-jamaica",
      "beach-palace",
      "playacar-palace",
    ]),
  },
  {
    slug: "european-icon-hotels",
    eyebrow: "European Icon Hotels",
    title: "European icon hotels for romance, culture, and cinematic city stays",
    description:
      "This group is designed for travelers planning heritage-rich itineraries, romantic city breaks, and design-led arrivals across Italy and London.",
    image: findPropertyBySlug("baglioni-hotel-luna")?.image ?? collectionCards[2].image,
    highlights: [
      "Landmark addresses and heritage settings",
      "Strong fits for romance and culture travel",
      "Elegant bases for multi-city Europe itineraries",
    ],
    idealFor: ["Romantic Europe trips", "Art and culture travel", "Heritage hotel lovers", "Multi-city itineraries"],
    planningNotes: [
      {
        title: "The hotel should feel like part of the trip",
        body:
          "For city stays like Venice, Rome, and Milan, the best-performing properties tend to be the ones that add atmosphere, arrival, and neighborhood identity to the itinerary.",
      },
      {
        title: "Pair city icons with resort recovery",
        body:
          "These hotels work especially well at the front or back end of a wider Europe or beach trip, creating contrast between cultural pace and resort ease.",
      },
      {
        title: "City choice changes traveler intent",
        body:
          "Venice leans romance, Rome leans heritage, and Milan leans style. Starting there makes the right hotel choice much clearer.",
      },
    ],
    faqs: [
      {
        question: "Which hotel is best for a romantic Venice stay?",
        answer:
          "Baglioni Hotel Luna is the strongest Venice fit for travelers prioritizing atmosphere, heritage, and one of the most cinematic arrivals in the collection.",
      },
      {
        question: "Are these only for couples trips?",
        answer:
          "No. They are also strong for art-driven itineraries, luxury city breaks, food-focused travel, and travelers combining multiple iconic European destinations.",
      },
    ],
    journalSlug: "best-luxury-city-hotels-in-italy-for-romantic-itineraries",
    properties: propertiesBySlug([
      "baglioni-hotel-luna",
      "baglioni-hotel-regina",
      "casa-baglioni",
      "palazzo-firenze",
      "baglioni-hotel-london",
    ]),
  },
];

export function findFeaturedCollectionBySlug(slug: string) {
  return featuredCollections.find((collection) => collection.slug === slug);
}

export function findJournalPostBySlug(slug: string) {
  return journalPosts.find((post) => post.slug === slug);
}
