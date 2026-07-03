import { featuredCollections, findPropertyBySlug } from "./property-data";

export type TravelerStory = {
  slug: string;
  title: string;
  travelerName: string;
  destination: string;
  country: string;
  resort: string;
  resortSlug?: string;
  brand: string;
  tripType: string;
  travelerType: string;
  travelDate: string;
  length: string;
  featuredImage: string;
  gallery: string[];
  story: {
    whyWeChose: string;
    favoriteExperiences: string;
    dining: string;
    excursions: string;
    travelTips: string;
    wouldWeReturn: string;
  };
  advisorRecommendation: string;
  favoriteRestaurant: string;
  favoriteExcursion: string;
  favoriteMemory: string;
  wouldReturn: boolean;
  rating: number;
  featured: boolean;
  published: boolean;
  tags: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
};

const propertyImage = (slug: string, fallback: string) => findPropertyBySlug(slug)?.image ?? fallback;

export const travelerStories: TravelerStory[] = [
  {
    slug: "emily-le-blanc-cancun-anniversary",
    title: "An anniversary week that felt quiet, polished, and easy",
    travelerName: "Emily",
    destination: "Cancun",
    country: "Mexico",
    resort: "Le Blanc Spa Resort Cancun",
    resortSlug: "le-blanc-spa-resort-cancun",
    brand: "Le Blanc",
    tripType: "Adults Only",
    travelerType: "Couple",
    travelDate: "April 2026",
    length: "5 nights",
    featuredImage: propertyImage("le-blanc-spa-resort-cancun", "/images/home-style-adults-only.jpg"),
    gallery: [
      propertyImage("le-blanc-spa-resort-cancun", "/images/home-style-adults-only.jpg"),
      "/images/home-style-spa.jpg",
      "/images/home-style-romantic-dinner.jpg",
      "/images/home-about-gallery-coast.jpg",
    ],
    story: {
      whyWeChose:
        "We wanted adults-only, calm, great food, and a resort where we did not have to over-plan every hour. Le Blanc felt like the right match because the service style was more polished and the beach setting still felt classic Cancun.",
      favoriteExperiences:
        "Our favorite moments were slow mornings by the water, the spa hydrotherapy circuit, and having dinner reservations handled without turning the trip into a project.",
      dining:
        "The dining felt elevated for an all-inclusive stay. We liked having enough variety without needing to leave the resort every night.",
      excursions:
        "We kept excursions light and chose one relaxed boat day so the trip still felt restorative.",
      travelTips:
        "Book spa time early, leave space in the schedule, and choose an ocean-view room if the view is part of what makes the trip feel special.",
      wouldWeReturn:
        "Yes. We would return for another anniversary or recommend it to couples who want quiet luxury without losing the beach.",
    },
    advisorRecommendation:
      "This is a strong fit for couples prioritizing service, spa time, and a calmer Cancun experience. I would match it carefully against Los Cabos when travelers want an even more contemporary mood.",
    favoriteRestaurant: "Lumiere",
    favoriteExcursion: "Private boat afternoon",
    favoriteMemory: "Sunset drinks after a spa day",
    wouldReturn: true,
    rating: 5,
    featured: true,
    published: true,
    tags: ["adults-only", "romance", "spa", "luxury", "cancun"],
    coordinates: { lat: 21.089, lng: -86.77 },
  },
  {
    slug: "anderson-family-moon-palace-grand",
    title: "A family resort week where every age had something to do",
    travelerName: "Sarah",
    destination: "Cancun",
    country: "Mexico",
    resort: "Moon Palace The Grand - Cancun",
    resortSlug: "moon-palace-the-grand-cancun",
    brand: "Moon Palace",
    tripType: "Family Resort",
    travelerType: "Family",
    travelDate: "June 2026",
    length: "6 nights",
    featuredImage: propertyImage("moon-palace-the-grand-cancun", "/images/home-style-family-beach.jpg"),
    gallery: [
      propertyImage("moon-palace-the-grand-cancun", "/images/home-style-family-beach.jpg"),
      "/images/home-style-family-beach.jpg",
      "/images/home-about-gallery-main.jpg",
      "/images/home-style-food.jpg",
    ],
    story: {
      whyWeChose:
        "We needed a resort with enough built-in activities for kids, grandparents, and parents who still wanted a little breathing room. The Grand gave us scale without feeling like we had to leave the property to keep everyone happy.",
      favoriteExperiences:
        "The water park was the clear winner for the kids, but the adults loved having multiple dinner options and room to split up during the day.",
      dining:
        "Having several restaurants made the week easier. We could keep casual meals simple and still have a few dinners that felt more special.",
      excursions:
        "We chose one half-day excursion and spent the rest of the week using the resort amenities.",
      travelTips:
        "Plan a few anchor meals, but do not overschedule. The resort itself is part of the vacation.",
      wouldWeReturn:
        "Yes. For a multigenerational family trip, the range of activities made the whole week smoother.",
    },
    advisorRecommendation:
      "This is one of the strongest fits when families want the resort to be the main event. I would recommend it for travelers who value options, dining variety, and kid-friendly amenities.",
    favoriteRestaurant: "Jade",
    favoriteExcursion: "Family snorkeling day",
    favoriteMemory: "The kids racing back to the water park every morning",
    wouldReturn: true,
    rating: 5,
    featured: true,
    published: true,
    tags: ["family", "water park", "cancun", "groups", "luxury"],
    coordinates: { lat: 20.988, lng: -86.83 },
  },
  {
    slug: "michael-cozumel-palace-diving",
    title: "A reef-first trip with easy resort comfort",
    travelerName: "Michael",
    destination: "Cozumel",
    country: "Mexico",
    resort: "Cozumel Palace",
    resortSlug: "cozumel-palace",
    brand: "Palace Resorts",
    tripType: "Scuba",
    travelerType: "Friends",
    travelDate: "March 2026",
    length: "4 nights",
    featuredImage: propertyImage("cozumel-palace", "/images/home-style-adventure.jpg"),
    gallery: [
      propertyImage("cozumel-palace", "/images/home-style-adventure.jpg"),
      "/images/home-style-adventure.jpg",
      "/images/about-north-america-cozumel-south-dive.jpeg",
      "/images/about-activity-snorkeling.png",
    ],
    story: {
      whyWeChose:
        "The goal was simple: easy reef access, a comfortable resort, and enough convenience that the divers and non-divers could both enjoy the trip.",
      favoriteExperiences:
        "Morning dives were the highlight, followed by low-key afternoons back at the resort.",
      dining:
        "We kept meals relaxed and appreciated not having to coordinate transportation after long dive days.",
      excursions:
        "The reef was the reason for the trip. We also added one island drive for a change of scenery.",
      travelTips:
        "Build in a non-dive day before flying home and keep the schedule flexible for weather.",
      wouldWeReturn:
        "Yes, especially for another dive-focused trip with friends.",
    },
    advisorRecommendation:
      "Cozumel Palace is a natural shortlist option when water access matters more than a giant resort footprint.",
    favoriteRestaurant: "Turquesa",
    favoriteExcursion: "Palancar Reef dive",
    favoriteMemory: "Seeing the reef wall on the first morning",
    wouldReturn: true,
    rating: 5,
    featured: true,
    published: true,
    tags: ["scuba", "cozumel", "adventure", "friends", "snorkeling"],
    coordinates: { lat: 20.501, lng: -86.958 },
  },
  {
    slug: "natalie-baglioni-venice-romance",
    title: "A Venice arrival that felt like part of the story",
    travelerName: "Natalie",
    destination: "Venice",
    country: "Italy",
    resort: "Baglioni Hotel Luna",
    resortSlug: "baglioni-hotel-luna",
    brand: "Baglioni",
    tripType: "Europe",
    travelerType: "Couple",
    travelDate: "September 2025",
    length: "3 nights",
    featuredImage: propertyImage("baglioni-hotel-luna", "/images/home-style-europe.jpg"),
    gallery: [
      propertyImage("baglioni-hotel-luna", "/images/home-style-europe.jpg"),
      "/images/home-style-europe.jpg",
      "/images/home-style-romantic-dinner.jpg",
      "/images/about-europe-lochau-austria.jpg",
    ],
    story: {
      whyWeChose:
        "We wanted the hotel to feel like part of Venice, not just a place to sleep. The location and heritage made the arrival feel special.",
      favoriteExperiences:
        "Walking out early before the city got busy, then coming back to a hotel that felt calm and classic.",
      dining:
        "We balanced hotel breakfasts with small neighborhood dinners and one more formal romantic meal.",
      excursions:
        "A private walking tour helped us understand the city without feeling rushed.",
      travelTips:
        "Stay close to the places you care about most, and leave unplanned time for wandering.",
      wouldWeReturn:
        "Yes, especially as the opening stop for a longer Italy itinerary.",
    },
    advisorRecommendation:
      "This works beautifully for couples who want a cinematic Venice stay and value location, heritage, and atmosphere.",
    favoriteRestaurant: "Canova",
    favoriteExcursion: "Private Venice walking tour",
    favoriteMemory: "Arriving by water and feeling like the trip had truly started",
    wouldReturn: true,
    rating: 5,
    featured: true,
    published: true,
    tags: ["europe", "romance", "venice", "city hotel", "italy"],
    coordinates: { lat: 45.434, lng: 12.337 },
  },
  {
    slug: "jessica-sun-palace-adults-only",
    title: "A short adults-only escape with just enough Cancun energy",
    travelerName: "Jessica",
    destination: "Cancun",
    country: "Mexico",
    resort: "Sun Palace",
    resortSlug: "sun-palace",
    brand: "Palace Resorts",
    tripType: "Adults Only",
    travelerType: "Couple",
    travelDate: "February 2026",
    length: "4 nights",
    featuredImage: propertyImage("sun-palace", "/images/home-style-romantic-dinner.jpg"),
    gallery: [
      propertyImage("sun-palace", "/images/home-style-romantic-dinner.jpg"),
      "/images/home-style-romantic-dinner.jpg",
      "/images/home-about-gallery-coast.jpg",
      "/images/home-style-spa.jpg",
    ],
    story: {
      whyWeChose:
        "We wanted adults-only but not overly formal. Sun Palace felt like an easy, romantic beach trip without too many moving parts.",
      favoriteExperiences:
        "The best part was having beach time, dinner, and quiet evenings all feel close at hand.",
      dining:
        "Dinner for two was easy to plan, and the resort had enough variety for a shorter stay.",
      excursions:
        "We skipped big excursions and kept the focus on rest.",
      travelTips:
        "This is a good fit for a shorter reset when you want the travel logistics to stay simple.",
      wouldWeReturn:
        "Yes, for a quick couples trip.",
    },
    advisorRecommendation:
      "Sun Palace can be a smart option when travelers want adults-only Cancun but do not need the highest-touch Le Blanc experience.",
    favoriteRestaurant: "Fuego",
    favoriteExcursion: "Beach day",
    favoriteMemory: "A slow dinner with no schedule for the next morning",
    wouldReturn: true,
    rating: 5,
    featured: true,
    published: true,
    tags: ["adults-only", "couples", "cancun", "romance"],
    coordinates: { lat: 21.047, lng: -86.782 },
  },
  {
    slug: "lauren-baglioni-puglia-spa",
    title: "A slower Italy stay built around spa time and small towns",
    travelerName: "Lauren",
    destination: "Puglia",
    country: "Italy",
    resort: "Baglioni Masseria Muzza Resort & Spa",
    resortSlug: "baglioni-masseria-muzza-resort-and-spa",
    brand: "Baglioni",
    tripType: "Spa",
    travelerType: "Friends",
    travelDate: "May 2026",
    length: "5 nights",
    featuredImage: propertyImage("baglioni-masseria-muzza-resort-and-spa", "/images/home-style-spa.jpg"),
    gallery: [
      propertyImage("baglioni-masseria-muzza-resort-and-spa", "/images/home-style-spa.jpg"),
      "/images/home-style-spa.jpg",
      "/images/home-about-gallery-room.jpg",
      "/images/home-about-gallery-coast.jpg",
    ],
    story: {
      whyWeChose:
        "We wanted Italy, but not a packed city itinerary. Puglia gave us food, villages, spa time, and a slower pace.",
      favoriteExperiences:
        "The best moments were unhurried: spa mornings, long lunches, and exploring nearby towns without a checklist.",
      dining:
        "Food was a major reason for the trip, from simple local dishes to more elevated resort meals.",
      excursions:
        "We loved having a driver for village days so no one had to navigate.",
      travelTips:
        "This is not the trip to rush. Build in downtime and let the region unfold.",
      wouldWeReturn:
        "Yes, especially as part of a longer southern Italy itinerary.",
    },
    advisorRecommendation:
      "This is a strong match for travelers who want Europe with a restorative rhythm instead of constant sightseeing.",
    favoriteRestaurant: "Local masseria dinner",
    favoriteExcursion: "Otranto and coastal villages",
    favoriteMemory: "A long lunch after a spa morning",
    wouldReturn: true,
    rating: 5,
    featured: true,
    published: true,
    tags: ["spa", "europe", "italy", "friends", "luxury"],
    coordinates: { lat: 40.147, lng: 18.486 },
  },
  {
    slug: "danielle-moon-palace-jamaica",
    title: "A lively Jamaica family trip with easy adventure nearby",
    travelerName: "Danielle",
    destination: "Ocho Rios",
    country: "Jamaica",
    resort: "Moon Palace Jamaica",
    resortSlug: "moon-palace-jamaica",
    brand: "Moon Palace",
    tripType: "Family Resort",
    travelerType: "Family",
    travelDate: "July 2025",
    length: "5 nights",
    featuredImage: propertyImage("moon-palace-jamaica", "/images/home-style-family-beach.jpg"),
    gallery: [
      propertyImage("moon-palace-jamaica", "/images/home-style-family-beach.jpg"),
      "/images/home-style-family-beach.jpg",
      "/images/about-caribbean-haiti.jpg",
      "/images/home-style-adventure.jpg",
    ],
    story: {
      whyWeChose:
        "We wanted a family resort but also wanted Jamaica to feel like part of the trip. Ocho Rios made it easy to add adventure.",
      favoriteExperiences:
        "The kids loved the beach and pool time, while the adults liked having nearby excursions to choose from.",
      dining:
        "Casual meals worked best for our group, and having options at the resort made evenings easier.",
      excursions:
        "A waterfall day was the highlight and gave the trip a strong sense of place.",
      travelTips:
        "Plan one or two island experiences, then leave resort time open.",
      wouldWeReturn:
        "Yes. It worked well for a family that wanted more than just the resort.",
    },
    advisorRecommendation:
      "I like this for families who want the ease of Moon Palace with a stronger island-adventure layer.",
    favoriteRestaurant: "Pier 8",
    favoriteExcursion: "Waterfall adventure",
    favoriteMemory: "The kids talking about the waterfall all week",
    wouldReturn: true,
    rating: 5,
    featured: false,
    published: true,
    tags: ["family", "jamaica", "adventure", "beach"],
    coordinates: { lat: 18.407, lng: -77.104 },
  },
  {
    slug: "kevin-baglioni-maldives-honeymoon",
    title: "A honeymoon where the island pace did the work",
    travelerName: "Kevin",
    destination: "Maldives",
    country: "Maldives",
    resort: "Baglioni Resort Maldives",
    resortSlug: "baglioni-resort-maldives",
    brand: "Baglioni",
    tripType: "Honeymoon",
    travelerType: "Couple",
    travelDate: "November 2025",
    length: "7 nights",
    featuredImage: propertyImage("baglioni-resort-maldives", "/images/home-about-gallery-coast.jpg"),
    gallery: [
      propertyImage("baglioni-resort-maldives", "/images/home-about-gallery-coast.jpg"),
      "/images/home-about-gallery-coast.jpg",
      "/images/home-style-adventure.jpg",
      "/images/home-style-romantic-dinner.jpg",
    ],
    story: {
      whyWeChose:
        "We wanted a honeymoon that felt removed from everyday life. The Maldives gave us a true exhale after the wedding.",
      favoriteExperiences:
        "Lagoon time, quiet breakfasts, and dinners that felt like occasions without needing much planning.",
      dining:
        "We liked having a mix of romantic dinners and casual meals between beach and water time.",
      excursions:
        "Snorkeling was the main add-on, but the best part was not needing to do much.",
      travelTips:
        "Stay long enough to justify the travel time and let the first full day be slow.",
      wouldWeReturn:
        "Yes, for a milestone anniversary.",
    },
    advisorRecommendation:
      "Best for couples who want the destination itself to provide the sense of occasion and privacy.",
    favoriteRestaurant: "Beachfront dinner",
    favoriteExcursion: "Lagoon snorkeling",
    favoriteMemory: "The first morning opening the door to the water",
    wouldReturn: true,
    rating: 5,
    featured: false,
    published: true,
    tags: ["honeymoon", "maldives", "romance", "luxury"],
    coordinates: { lat: 2.891, lng: 72.949 },
  },
];

export function publishedTravelerStories() {
  return travelerStories.filter((story) => story.published);
}

export function featuredTravelerStories(limit = 6) {
  return publishedTravelerStories()
    .filter((story) => story.featured)
    .slice(0, limit);
}

export function findTravelerStoryBySlug(slug: string) {
  return publishedTravelerStories().find((story) => story.slug === slug);
}

export function storyDateLabel(story: TravelerStory) {
  return story.travelDate;
}

export function storyQuote(story: TravelerStory) {
  return story.favoriteMemory;
}

export function storyMonth(story: TravelerStory) {
  return story.travelDate.split(" ")[0] ?? story.travelDate;
}

export function uniqueStoryValues(key: keyof Pick<TravelerStory, "destination" | "country" | "resort" | "brand" | "tripType" | "travelerType">) {
  return Array.from(new Set(publishedTravelerStories().map((story) => String(story[key])))).sort();
}

export function uniqueStoryMonths() {
  return Array.from(new Set(publishedTravelerStories().map(storyMonth))).sort();
}

export function uniqueStoryTags() {
  return Array.from(new Set(publishedTravelerStories().flatMap((story) => story.tags))).sort();
}

export function filterTravelerStories(filters: {
  query?: string;
  destination?: string;
  country?: string;
  resort?: string;
  brand?: string;
  tripType?: string;
  travelerType?: string;
  month?: string;
  tag?: string;
}) {
  const query = filters.query?.trim().toLowerCase() ?? "";

  return publishedTravelerStories().filter((story) => {
    const haystack = [
      story.title,
      story.travelerName,
      story.destination,
      story.country,
      story.resort,
      story.brand,
      story.tripType,
      story.travelerType,
      story.favoriteMemory,
      story.advisorRecommendation,
      story.tags.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!query || haystack.includes(query)) &&
      (!filters.destination || story.destination === filters.destination) &&
      (!filters.country || story.country === filters.country) &&
      (!filters.resort || story.resort === filters.resort) &&
      (!filters.brand || story.brand === filters.brand) &&
      (!filters.tripType || story.tripType === filters.tripType) &&
      (!filters.travelerType || story.travelerType === filters.travelerType) &&
      (!filters.month || storyMonth(story) === filters.month) &&
      (!filters.tag || story.tags.includes(filters.tag))
    );
  });
}

export function relatedTravelerStories(story: TravelerStory, limit = 4) {
  return publishedTravelerStories()
    .filter((candidate) => candidate.slug !== story.slug)
    .map((candidate) => ({
      story: candidate,
      score:
        (candidate.resort === story.resort ? 5 : 0) +
        (candidate.destination === story.destination ? 4 : 0) +
        (candidate.brand === story.brand ? 3 : 0) +
        (candidate.tripType === story.tripType ? 2 : 0) +
        candidate.tags.filter((tag) => story.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.story);
}

export function storiesForProperty(property: { name: string; slug?: string; brand?: string; location?: string }, limit = 3) {
  return publishedTravelerStories()
    .filter(
      (story) =>
        story.resortSlug === property.slug ||
        story.resort === property.name ||
        (property.location ? story.destination && property.location.includes(story.destination) : false)
    )
    .slice(0, limit);
}

export function storiesForCollection(collection: { slug: string; title: string; eyebrow: string; properties: { slug: string; name: string; brand: string; tripStyle: string }[]; idealFor?: string[] }, limit = 4) {
  const propertySlugs = new Set(collection.properties.map((property) => property.slug));
  const propertyNames = new Set(collection.properties.map((property) => property.name));
  const collectionText = [collection.slug, collection.title, collection.eyebrow, ...(collection.idealFor ?? [])]
    .join(" ")
    .toLowerCase();

  return publishedTravelerStories()
    .filter((story) => {
      const storyText = [story.brand, story.tripType, story.travelerType, ...story.tags].join(" ").toLowerCase();
      return (
        propertySlugs.has(story.resortSlug ?? "") ||
        propertyNames.has(story.resort) ||
        story.tags.some((tag) => collectionText.includes(tag)) ||
        collectionText.includes(story.brand.toLowerCase()) ||
        storyText.split(" ").some((word) => word.length > 4 && collectionText.includes(word))
      );
    })
    .slice(0, limit);
}

export function storyCollectionMatches() {
  return featuredCollections.map((collection) => ({
    collection,
    stories: storiesForCollection(collection),
  }));
}
