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
  seoTitle?: string;
  seoDescription?: string;
  quickAnswer?: string;
  reviewedOn?: string;
  image: string;
  readTime: string;
  collectionHref: string;
  cta: string;
  featuredPropertySlugs: string[];
  relatedPostSlugs?: string[];
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

const catalogImage = (name: string) => `/images/catalog/${name}`;

export const collectionCards: CollectionCard[] = [
  {
    title: "Adults-only sanctuaries",
    description:
      "Sophisticated beach stays with polished dining, spa rituals, and a quieter rhythm for couples and celebratory escapes.",
    image: upscaleResortImage(
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/637bgbt7q51510amjja22f7o2b/240?angle=0"
    )!,
    cta: "Explore adults-only stays",
    href: "/collections/adults-only",
  },
  {
    title: "Family resorts with range",
    description:
      "Large-format resorts with water parks, suites, broad dining, and enough energy for multigenerational trips.",
    image: upscaleResortImage(
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/4parh4uc8p5gj5t9vpsd4n3j34/240?angle=0"
    )!,
    cta: "See family favorites",
    href: "/collections/family-friendly",
  },
  {
    title: "European icons and hideaways",
    description:
      "Romantic grand hotels, design-led city stays, and Mediterranean resorts for culture-rich itineraries.",
    image: upscaleResortImage(
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/416ej5192t3u12ehio6ks1me4m/240?angle=0"
    )!,
    cta: "Browse European stays",
    href: "/collections/european-luxury",
  },
];

export const journalPosts: JournalPost[] = [
  {
    slug: "mexico-seaweed-sargassum-guide",
    reviewedOn: "2026-11-03",
    eyebrow: "Mexico Beach Planning",
    title: "Mexico seaweed and sargassum guide for all-inclusive resort travelers",
    description: "Understand seasonal sargassum risk in Cancun and Riviera Maya, how beach conditions vary, and how to plan a Mexico resort trip with realistic backup options.",
    seoTitle: "Mexico Sargassum Guide for All-Inclusive Resorts",
    seoDescription: "Plan around Mexico sargassum with realistic guidance for Cancun, Riviera Maya, Playa Mujeres, Cozumel, resort cleanup, beach conditions, and backup options.",
    quickAnswer: "No Mexico beach is guaranteed to be seaweed-free. Conditions can change with currents, wind, storms, season, and cleanup response. Compare the exact beach and travel month, then choose a resort with pools, dining, activities, and excursions you would still enjoy if the shoreline is temporarily affected.",
    image: catalogImage("turquoise-water-aerial.jpg"),
    readTime: "7 min read",
    collectionHref: "/destinations",
    cta: "Read the sargassum guide",
    featuredPropertySlugs: ["le-blanc-spa-resort-cancun", "playacar-palace", "cozumel-palace"],
    relatedPostSlugs: [
      "cancun-vs-riviera-maya-all-inclusive-resorts",
      "best-resorts-near-cancun-airport",
      "best-first-all-inclusive-resort-vacation",
    ],
    sections: [
      {
        title: "Sargassum changes by beach, month, and weather",
        body: "There is no guaranteed seaweed-free Mexico beach. Sargassum can shift with currents, wind, storms, water temperature, and cleanup response, so the useful planning questions are risk level, beach orientation, and what alternatives would keep the trip enjoyable.",
      },
      {
        title: "Cancun, Riviera Maya, Playa Mujeres, Cozumel, and Cabo feel different",
        body: "Cancun and Riviera Maya can both experience sargassum, while islands or differently oriented beaches may fare better at particular times. Los Cabos has a different Pacific-side beach profile, but many beaches there are not suitable for swimming, so it is not a direct substitute for every traveler.",
      },
      {
        title: "Resort cleanup helps but cannot control the ocean",
        body: "Resort teams may clear beaches, communicate conditions, and offer strong pool or activity alternatives. Heavy arrival days can still affect the appearance, smell, and swimmability of the shoreline even when a resort is actively responding.",
      },
      {
        title: "Playa Mujeres is not automatically sargassum-proof",
        body: "Playa Mujeres can appeal to travelers seeking a quieter resort setting, but it should not be presented as a guaranteed escape from sargassum. Compare the exact resort beach, the travel period, and how important daily ocean swimming is to the trip.",
      },
      {
        title: "Build a trip that still works when beach conditions change",
        body: "If beach perfection is the entire goal, timing and location deserve extra weight. If pools, dining, spa, excursions, and service also matter, the vacation can still work well when conditions are temporarily imperfect.",
      },
      {
        title: "Ask the right questions before booking",
        body: "A useful Mexico shortlist should compare seasonal beach risk, pool quality, resort layout, transfer time, room category, excursions, and the resort's typical response when seaweed is present. Check current conditions close to travel rather than relying on an old photo or a permanent best-beach claim.",
      },
    ],
  },
  {
    slug: "best-adults-only-all-inclusive-resorts-for-couples",
    reviewedOn: "2026-11-03",
    eyebrow: "Couples Escapes",
    title: "Best adults-only all-inclusive resorts for couples in Cancun and Los Cabos",
    description:
      "Compare adults-only all-inclusive resorts for couples by beach, pools, spa, dining, atmosphere, room style, and special-occasion fit.",
    seoTitle: "Best Adults-Only All-Inclusive Resorts for Couples",
    seoDescription: "Compare top adults-only all-inclusive resorts for couples in Cancun and Los Cabos, including beach, pools, spa, dining, honeymoon fit, and total value.",
    quickAnswer: "Start with Le Blanc Cancun when a polished Caribbean beach is central to the trip, Le Blanc Los Cabos when pools, spa, design, and desert-coast scenery matter most, and Sun Palace when you prefer a smaller couples-focused Cancun resort. The best choice depends on trip mood, room priorities, and the complete price for your dates.",
    image: upscaleResortImage(
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/2eel4s41k15j9anvu6kp927m2e/240?angle=0"
    )!,
    readTime: "7 min read",
    collectionHref: "/collections/adults-only",
    cta: "Read the couples guide",
    featuredPropertySlugs: ["sun-palace", "le-blanc-spa-resort-cancun", "le-blanc-spa-resort-los-cabos"],
    relatedPostSlugs: [
      "le-blanc-cancun-vs-le-blanc-los-cabos",
      "best-adults-only-resorts-in-cancun-for-honeymoons",
      "best-spa-resorts-for-couples-in-mexico",
    ],
    sections: [
      {
        title: "Le Blanc Cancun for a beach-centered couples trip",
        body:
          "Le Blanc Cancun is the strongest starting point for couples who want an elevated adults-only all-inclusive with the Caribbean beach playing a major role. Compare room views, current beach conditions, spa plans, and the dining atmosphere you want for evenings.",
      },
      {
        title: "Le Blanc Los Cabos for pools, spa, and scenery",
        body:
          "Le Blanc Los Cabos often fits couples who picture more time at the resort itself. Its desert-meets-ocean setting, pool-focused days, and contemporary atmosphere can work especially well for wellness trips, anniversaries, and travelers who value scenery over swimming from the beach.",
      },
      {
        title: "Sun Palace for a smaller Cancun experience",
        body:
          "Sun Palace is worth comparing when couples want Cancun and an adults-focused atmosphere without choosing the same scale or style as Le Blanc. Confirm current age rules, room options, dining access, and the exact inclusions attached to your offer.",
      },
      {
        title: "Choose the destination mood before the resort extras",
        body:
          "Cancun is greener, more humid, and built around a Caribbean beach vacation. Los Cabos is drier and more dramatic, with pool and resort time often becoming more important. This destination difference usually matters more than a small variation in amenity lists.",
      },
      {
        title: "Compare service, dining, and spa as a full day",
        body:
          "Look beyond restaurant counts and treatment menus. Consider breakfast pace, pool service, reservation rules, dietary support, room service, hydrotherapy access, evening noise, and how much of the wellness experience is included versus separately priced.",
      },
      {
        title: "Price the same couples trip side by side",
        body:
          "Use the same dates, airport, room preferences, and transfer assumptions when comparing resorts. Then add the treatments, celebrations, and excursions you expect to book. A lower room rate is not always the better value if the setting or inclusions miss the reason for the trip.",
      },
    ],
  },
  {
    slug: "best-family-all-inclusive-resorts-for-multigenerational-trips",
    reviewedOn: "2026-11-03",
    eyebrow: "Family Travel",
    title: "Best all-inclusive resorts for multigenerational families traveling with kids, teens, and grandparents",
    description:
      "Compare family all-inclusive resorts for multigenerational trips, including mobility, room layout, dining, water parks, teen activities, and quieter spaces.",
    seoTitle: "Best All-Inclusive Resorts for Multigenerational Families",
    seoDescription: "Compare all-inclusive resorts for kids, teens, parents, and grandparents, with practical guidance on mobility, rooms, dining, activities, and resort size.",
    quickAnswer: "For a multigenerational trip, prioritize an easy resort layout, elevators or ground-floor room options, flexible dining, activities for several age groups, and rooms that can be placed near one another. Moon Palace The Grand Cancun offers the broadest activity range, while Moon Palace Cancun and Moon Palace Jamaica can suit families that want a different balance of scale, beach time, and excursions.",
    image: upscaleResortImage(
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/oe0r882lrt1u506d70ulkn7s35/240?angle=0"
    )!,
    readTime: "7 min read",
    collectionHref: "/collections/family-friendly",
    cta: "Read the family guide",
    featuredPropertySlugs: [
      "moon-palace-the-grand-cancun",
      "moon-palace-cancun",
      "moon-palace-jamaica",
    ],
    relatedPostSlugs: [
      "best-resorts-for-teens-and-tweens-in-mexico",
      "best-caribbean-family-resorts-with-water-parks",
      "best-all-inclusive-resorts-in-cancun-for-families",
      "moon-palace-the-grand-vs-moon-palace-cancun",
    ],
    sections: [
      {
        title: "Start with mobility and the resort footprint",
        body:
          "A large resort creates choice, but it can also create long walks. Ask about elevators, shuttle routes, accessible rooms, restaurant distances, and whether related rooms can be assigned in the same building. These details often matter more to grandparents and stroller users than the total amenity count.",
      },
      {
        title: "Compare room arrangements, not just room size",
        body:
          "Confirm maximum occupancy, bedding, connecting-room availability, bathroom count, and balcony safety before comparing prices. Several nearby rooms may work better than one oversized suite when adults keep different schedules or younger children need an earlier bedtime.",
      },
      {
        title: "Dining variety reduces group friction",
        body:
          "Mixed-age groups benefit from casual breakfast options, quick lunches, familiar foods, allergy support, and restaurants that do not require every meal to be planned days ahead. Ask which venues accept larger groups and how reservations work during your travel dates.",
      },
      {
        title: "Give teens freedom and younger kids structure",
        body:
          "Water features, sports, game areas, evening entertainment, and casual food help older children enjoy some independence. Younger children need age-appropriate supervised options. Review operating hours and age rules instead of relying on a general kids-club label.",
      },
      {
        title: "Protect quiet time for adults and grandparents",
        body:
          "The strongest multigenerational resorts also provide shaded seating, calmer pools, spa time, and comfortable gathering spaces. A trip works better when relatives can split into smaller groups during the day and reconnect without crossing the entire property.",
      },
      {
        title: "Questions to include with a quote request",
        body:
          "Share every traveler's age, mobility considerations, preferred room relationships, dietary needs, and must-have activities. Request comparable totals for the same dates and room setup so resort credits or headline rates do not hide meaningful differences.",
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
    collectionHref: "/collections/european-luxury",
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
  {
    slug: "moon-palace-the-grand-vs-moon-palace-cancun",
    reviewedOn: "2026-11-03",
    eyebrow: "Cancun Resort Comparison",
    title: "Moon Palace The Grand Cancun vs. Moon Palace Cancun: Which should you choose?",
    description: "Compare Moon Palace The Grand Cancun and Moon Palace Cancun for your next family vacation. Learn what to check about room categories, dining, activities, access and total trip cost before requesting a personalized quote.",
    seoTitle: "Moon Palace The Grand vs Moon Palace Cancun",
    seoDescription: "Compare Moon Palace The Grand and Moon Palace Cancun for rooms, dining access, water activities, walking distances, family fit, and total vacation cost.",
    quickAnswer: "Choose Moon Palace The Grand when the resort itself is the main event and your family wants the broadest activity and dining experience. Choose Moon Palace Cancun when you want the Moon Palace setting with a potentially simpler trip rhythm or a different total price. Access rules and inclusions depend on the exact booking, so compare both for the same dates and travelers.",
    image: "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/4parh4uc8p5gj5t9vpsd4n3j34/1600?angle=0",
    readTime: "5 min read",
    collectionHref: "/collections/moon-palace",
    cta: "Compare Moon Palace Cancun resorts",
    featuredPropertySlugs: ["moon-palace-the-grand-cancun", "moon-palace-cancun"],
    relatedPostSlugs: [
      "moon-palace-the-grand-cancun-family-guide",
      "best-all-inclusive-resorts-in-cancun-for-families",
      "best-family-all-inclusive-resorts-for-multigenerational-trips",
    ],
    sections: [
      { title: "The Grand is the higher-amenity choice", body: "Moon Palace The Grand is generally the stronger fit when families want water activities, a large pool and dining footprint, and enough on-property variety to make the resort the center of a longer vacation. That breadth can justify the upgrade for active families." },
      { title: "Moon Palace Cancun can offer a simpler fit", body: "Moon Palace Cancun can suit travelers who want a broad family resort experience without making every day about the largest possible amenity list. Compare the atmosphere, room location, and total for your dates rather than assuming bigger is automatically better." },
      { title: "Confirm access instead of assuming it", body: "These are separate booking choices within the Moon Palace family. Do not assume that every room includes the same restaurants, activities, or cross-property privileges. Ask for the current access rules in writing for the exact offer and room category you are considering." },
      { title: "Match activities to children's actual ages", body: "Compare water features, pools, sports, entertainment, and supervised programs against the ages of the children traveling. Include height requirements, operating hours, reservations, and possible extra charges in the comparison." },
      { title: "Dining convenience matters with a group", body: "Count only the restaurants your booking can use, then consider distance, reservation rules, wait times, allergy needs, and casual options. A long restaurant list is less useful when the best choices are difficult to reach with children or grandparents." },
      { title: "Compare the same trip before deciding", body: "Request both resorts using identical dates, travelers, room needs, and transfer assumptions. Then compare the total price with the experiences your family will realistically use. Availability and inclusions can change, so a side-by-side quote is more useful than a generic rate comparison." },
    ],
  },
  {
    slug: "best-all-inclusive-resorts-in-cancun-for-families",
    eyebrow: "Cancun Family Resorts",
    title: "Best all-inclusive resorts in Cancun for families who want easy beach days and big amenities",
    description:
      "Compare family-friendly Cancun resorts with water parks, dining variety, kids activities, and the kind of layout that makes multigenerational travel easier.",
    image: upscaleResortImage(
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/4parh4uc8p5gj5t9vpsd4n3j34/240?angle=0"
    )!,
    readTime: "6 min read",
    collectionHref: "/collections/family-friendly",
    cta: "Read the Cancun family guide",
    featuredPropertySlugs: ["moon-palace-the-grand-cancun", "moon-palace-cancun", "beach-palace"],
    sections: [
      {
        title: "Start with how your family travels",
        body:
          "The best all-inclusive resort in Cancun for a family is not always the biggest one. Travelers with toddlers, teens, grandparents, and mixed-age groups usually need different room locations, dining flexibility, and activity levels.",
      },
      {
        title: "Why amenities matter more on longer stays",
        body:
          "For five nights or more, families often appreciate a larger resort footprint, multiple pools, water park access, casual dining, and enough evening entertainment to keep everyone engaged without leaving the property.",
      },
      {
        title: "What to ask before booking",
        body:
          "Ask about room categories, walking distances, beach conditions, airport transfer timing, kids club ages, and whether the resort has quiet pockets for adults who still want a little calm.",
      },
    ],
  },
  {
    slug: "le-blanc-cancun-vs-le-blanc-los-cabos",
    reviewedOn: "2026-11-03",
    eyebrow: "Adults-Only Comparison",
    title: "Le Blanc Cancun vs Le Blanc Los Cabos: which adults-only luxury resort fits your trip?",
    description:
      "A practical comparison for couples choosing between Le Blanc Spa Resort Cancun and Le Blanc Spa Resort Los Cabos for romance, wellness, and polished service.",
    image: upscaleResortImage(
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/lslu08vvvl1qdfuqoa06ptdn59/240?angle=0"
    )!,
    readTime: "5 min read",
    collectionHref: "/collections/adults-only",
    cta: "Compare Le Blanc resorts",
    featuredPropertySlugs: ["le-blanc-spa-resort-cancun", "le-blanc-spa-resort-los-cabos"],
    sections: [
      {
        title: "Choose Cancun for classic beachfront ease",
        body:
          "Le Blanc Cancun is often the stronger fit for couples who want a more traditional Caribbean beach vacation, turquoise water, and an elegant resort rhythm close to the airport.",
      },
      {
        title: "Choose Los Cabos for a quieter coastal mood",
        body:
          "Le Blanc Los Cabos leans contemporary and serene, with dramatic desert-meets-sea scenery and a resort atmosphere that feels especially strong for spa-led getaways.",
      },
      {
        title: "The deciding question",
        body:
          "If the beach itself is the priority, Cancun may win. If atmosphere, design, and wellness are the center of the trip, Los Cabos deserves a closer look.",
      },
    ],
  },
  {
    slug: "best-palace-resorts-for-destination-weddings",
    eyebrow: "Destination Weddings",
    title: "Best Palace Resorts for destination weddings, welcome parties, and group travel",
    description:
      "Find the Palace and Moon Palace resorts that work best for wedding groups, room blocks, guest activities, and a smoother destination wedding week.",
    image: catalogImage("beach-wedding-white-sand.jpg"),
    readTime: "6 min read",
    collectionHref: "/collections/family-friendly",
    cta: "Read the wedding guide",
    featuredPropertySlugs: ["moon-palace-the-grand-cancun", "moon-palace-cancun", "playacar-palace"],
    sections: [
      {
        title: "Match the resort to the guest list",
        body:
          "A destination wedding resort has to work for more than the couple. It should fit families, friends, budgets, room needs, dining preferences, and guests who may treat the wedding as their main vacation.",
      },
      {
        title: "Why larger resorts often help",
        body:
          "Larger all-inclusive resorts can make wedding logistics easier because they offer more room categories, more restaurants, more gathering spaces, and more ways for guests to enjoy downtime.",
      },
      {
        title: "What couples should decide early",
        body:
          "Before comparing wedding packages, decide the mood: intimate beach ceremony, lively group celebration, family-friendly resort week, or a polished adults-focused escape.",
      },
    ],
  },
  {
    slug: "moon-palace-the-grand-cancun-family-guide",
    eyebrow: "Family Resort Guide",
    title: "Moon Palace The Grand Cancun family guide: water park, dining, rooms, and trip planning tips",
    description:
      "A planning guide for families considering Moon Palace The Grand Cancun, including who it fits best and how to make the most of a big resort stay.",
    image: upscaleResortImage(
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/4parh4uc8p5gj5t9vpsd4n3j34/240?angle=0"
    )!,
    readTime: "7 min read",
    collectionHref: "/collections/family-friendly",
    cta: "Read The Grand guide",
    featuredPropertySlugs: ["moon-palace-the-grand-cancun"],
    sections: [
      {
        title: "Who The Grand fits best",
        body:
          "Moon Palace The Grand Cancun works especially well for families who want the resort itself to be the main event, with a water park, many dining options, and a high-energy vacation pace.",
      },
      {
        title: "Plan around the footprint",
        body:
          "Big resorts reward a little strategy. Room location, preferred activities, restaurant timing, and transfer plans can make the trip feel easier once everyone arrives.",
      },
      {
        title: "Best for longer stays",
        body:
          "Because there is so much to do on property, The Grand is strongest for families staying long enough to enjoy the amenities without feeling rushed.",
      },
    ],
  },
  {
    slug: "best-adults-only-resorts-in-cancun-for-honeymoons",
    eyebrow: "Honeymoon Resorts",
    title: "Best adults-only resorts in Cancun for honeymoons, anniversaries, and romantic escapes",
    description:
      "A couples-focused guide to Cancun adults-only resorts with beach views, spa time, elevated dining, and a quieter all-inclusive experience.",
    image: catalogImage("poolside-cabana-daybed.jpg"),
    readTime: "5 min read",
    collectionHref: "/collections/adults-only",
    cta: "Read the honeymoon guide",
    featuredPropertySlugs: ["sun-palace", "le-blanc-spa-resort-cancun"],
    sections: [
      {
        title: "Romance means different things",
        body:
          "Some couples want quiet service and spa rituals, while others want beachfront cocktails, excursions, and a lively dinner scene. The right Cancun resort depends on that mood.",
      },
      {
        title: "Why adults-only matters",
        body:
          "Adults-only resorts tend to feel calmer at the pool, more polished at dinner, and easier for couples who want the trip to feel intentionally romantic.",
      },
      {
        title: "Book around the experience",
        body:
          "For honeymoons and anniversaries, prioritize room view, dining style, spa access, and the level of privacy you want before focusing only on price.",
      },
    ],
  },
  {
    slug: "best-resorts-for-teens-and-tweens-in-mexico",
    reviewedOn: "2026-11-03",
    eyebrow: "Teen Travel",
    title: "Best resorts for teens and tweens in Mexico when kids are too old for the kids club",
    description:
      "How to choose a Mexico all-inclusive resort with enough independence, activities, food choices, and space for older kids and teens.",
    seoTitle: "Best All-Inclusive Resorts for Teens in Mexico",
    seoDescription: "Compare Mexico all-inclusive resorts for teens and tweens, including water parks, sports, casual food, evening activities, room layouts, and safe independence.",
    quickAnswer: "The best Mexico resorts for teens combine active pools or water features, sports and game spaces, casual food, evening entertainment, reliable Wi-Fi, and a layout that allows safe independence. Moon Palace The Grand Cancun offers the broadest built-in activity range; Moon Palace Cancun and Moon Palace Jamaica may fit families seeking a different balance of resort scale, beach time, and off-property adventure.",
    image: catalogImage("kids-resort-waterpark.jpg"),
    readTime: "7 min read",
    collectionHref: "/collections/family-friendly",
    cta: "Read the teen resort guide",
    featuredPropertySlugs: ["moon-palace-the-grand-cancun", "moon-palace-cancun", "moon-palace-jamaica"],
    relatedPostSlugs: [
      "best-family-all-inclusive-resorts-for-multigenerational-trips",
      "best-caribbean-family-resorts-with-water-parks",
      "best-all-inclusive-resorts-in-cancun-for-families",
    ],
    sections: [
      {
        title: "Activities need to work beyond the kids club",
        body:
          "Tweens and teens often care more about pools, water features, sports, games, music, evening entertainment, and places to meet other travelers than a traditional supervised club. Verify age rules and operating hours for the specific activities they will actually use.",
      },
      {
        title: "Casual food is a major teen amenity",
        body:
          "A resort is easier with older kids when snacks, pizza, burgers, drinks, and quick lunches are available without a formal family meal. Check what is open between meals and late in the evening, especially if teens will have some freedom around the property.",
      },
      {
        title: "Choose a layout that supports safe independence",
        body:
          "The ideal layout gives teens a few clear activity zones while making it easy to agree on meeting points. Extremely spread-out properties may offer more amenities but require a stronger plan for transportation, phone access, and regrouping.",
      },
      {
        title: "Plan for evenings, not only pool hours",
        body:
          "Shows, live music, sports viewing, arcades, and age-appropriate social spaces matter after the pool closes. Ask whether entertainment is designed mostly for young children, adults, or mixed-age families so the evening does not become the weak point of the trip.",
      },
      {
        title: "Room configuration can decide the resort",
        body:
          "Confirm bedding, bathroom count, connecting-room options, maximum occupancy, and whether there is enough privacy for parents and older children. A room category that worked when children were younger may feel cramped once everyone is taller and keeps a different schedule.",
      },
      {
        title: "Ask teens for their top three priorities",
        body:
          "Before requesting quotes, have each older child choose the activities, foods, or experiences that matter most. Compare resorts against those priorities along with the adults' budget and relaxation goals instead of choosing from a generic family-resort list.",
      },
    ],
  },
  {
    slug: "cancun-vs-riviera-maya-all-inclusive-resorts",
    eyebrow: "Destination Match",
    title: "Cancun vs Riviera Maya all-inclusive resorts: how to choose the right Mexico beach vacation",
    description:
      "Compare Cancun and Riviera Maya for airport convenience, beach style, excursions, resort atmosphere, and family or couples travel.",
    image: upscaleResortImage(
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/grr1mp7f6h1q569etitj2r0f3m/240?angle=0"
    )!,
    readTime: "6 min read",
    collectionHref: "/collections/family-friendly",
    cta: "Read the destination comparison",
    featuredPropertySlugs: ["beach-palace", "moon-palace-cancun", "playacar-palace"],
    sections: [
      {
        title: "Cancun is strong for convenience",
        body:
          "Cancun usually appeals to travelers who want shorter transfers, classic beach resort energy, and easy access to a polished hotel zone vacation.",
      },
      {
        title: "Riviera Maya adds a wider sense of place",
        body:
          "Riviera Maya and Playa del Carmen can feel more spread out, with easy access to town, eco-parks, cenotes, and a more varied excursion rhythm.",
      },
      {
        title: "Choose by trip pace",
        body:
          "If you want beach and resort ease, Cancun is hard to beat. If you want more exploring built into the week, Riviera Maya may fit better.",
      },
    ],
  },
  {
    slug: "best-resorts-near-cancun-airport",
    eyebrow: "Easy Transfers",
    title: "Best resorts near Cancun airport for quick transfers and low-stress arrival days",
    description:
      "A guide to all-inclusive resorts near Cancun airport for families, couples, short stays, and travelers who want to start vacation faster.",
    image: upscaleResortImage(
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/oe0r882lrt1u506d70ulkn7s35/240?angle=0"
    )!,
    readTime: "4 min read",
    collectionHref: "/collections/family-friendly",
    cta: "Read the transfer guide",
    featuredPropertySlugs: ["moon-palace-cancun", "moon-palace-the-grand-cancun", "sun-palace"],
    sections: [
      {
        title: "Short transfer, smoother first day",
        body:
          "For families with young kids, quick weekend escapes, and late arrivals, a resort near Cancun airport can make the first day feel dramatically easier.",
      },
      {
        title: "Do not choose by distance alone",
        body:
          "The closest resort is not always the best fit. Match the transfer time with beach goals, dining expectations, family needs, and whether you plan to leave the resort.",
      },
      {
        title: "Who benefits most",
        body:
          "Short-stay travelers, multigenerational groups, and anyone with tighter flight schedules usually appreciate a resort plan that keeps transportation simple.",
      },
    ],
  },
  {
    slug: "best-first-all-inclusive-resort-vacation",
    eyebrow: "First-Time Guide",
    title: "How to choose your first all-inclusive resort vacation without feeling overwhelmed",
    description:
      "A beginner-friendly guide to choosing the right all-inclusive resort based on destination, trip style, budget, dining, beach, and activities.",
    image: catalogImage("resort-pool-aerial.jpg"),
    readTime: "6 min read",
    collectionHref: "/collections",
    cta: "Read the first-timer guide",
    featuredPropertySlugs: ["beach-palace", "moon-palace-cancun", "le-blanc-spa-resort-cancun"],
    sections: [
      {
        title: "Start with the vacation feeling",
        body:
          "Before comparing resorts, decide what you want the trip to feel like: relaxing, romantic, family-focused, adventurous, social, or polished and quiet.",
      },
      {
        title: "Understand what all-inclusive really includes",
        body:
          "Inclusions vary by resort. Dining, room service, transfers, excursions, spa, golf, and premium experiences may work differently, so it helps to know what matters before booking.",
      },
      {
        title: "Use an advisor to narrow the noise",
        body:
          "A good resort match saves time because it filters hundreds of options into a shortlist based on how you actually travel.",
      },
    ],
  },
  {
    slug: "best-all-inclusive-resorts-for-food-lovers",
    eyebrow: "Food & Drink",
    title: "Best all-inclusive resorts for food lovers who care about dining as much as the beach",
    description:
      "What to look for when choosing an all-inclusive resort with memorable restaurants, varied menus, quality cocktails, and fewer dining compromises.",
    image: catalogImage("destination-dining-table.jpg"),
    readTime: "5 min read",
    collectionHref: "/collections",
    cta: "Read the dining guide",
    featuredPropertySlugs: ["le-blanc-spa-resort-cancun", "le-blanc-spa-resort-los-cabos", "moon-palace-the-grand-cancun"],
    sections: [
      {
        title: "Dining can define the trip",
        body:
          "For many travelers, restaurants are not a side detail. A strong all-inclusive dining program can turn a beach vacation into a more complete luxury experience.",
      },
      {
        title: "Look beyond restaurant count",
        body:
          "More restaurants do not always mean better dining. Menu quality, reservation process, service style, cocktail program, and variety across the week matter more.",
      },
      {
        title: "Match food style to trip style",
        body:
          "Couples may prefer elevated tasting menus and quieter dining rooms, while families often need flexible hours, casual options, and menus that work for different ages.",
      },
    ],
  },
  {
    slug: "best-spa-resorts-for-couples-in-mexico",
    reviewedOn: "2026-11-03",
    eyebrow: "Spa & Wellness",
    title: "Best spa resorts in Mexico for couples choosing between Cancun and Los Cabos",
    description:
      "A guide to choosing a Mexico spa resort for couples, including treatment style, atmosphere, dining, rooms, and adults-only options.",
    seoTitle: "Best Spa Resorts in Mexico for Couples",
    seoDescription: "Compare couples spa resorts in Cancun and Los Cabos for hydrotherapy, treatments, adults-only atmosphere, pools, dining, rooms, and oceanfront setting.",
    quickAnswer: "Le Blanc Cancun is a strong fit for couples who want spa time paired with a Caribbean beach vacation. Le Blanc Los Cabos suits travelers who prioritize resort design, pools, wellness, and desert-coast scenery. Sun Palace can fit couples seeking a smaller adults-only Cancun experience. Confirm current spa inclusions and treatment pricing for your dates.",
    image: catalogImage("spa-hydrotherapy-pool.jpg"),
    readTime: "7 min read",
    collectionHref: "/collections/adults-only",
    cta: "Read the spa guide",
    featuredPropertySlugs: ["le-blanc-spa-resort-cancun", "le-blanc-spa-resort-los-cabos", "sun-palace"],
    relatedPostSlugs: [
      "le-blanc-cancun-vs-le-blanc-los-cabos",
      "best-adults-only-resorts-in-cancun-for-honeymoons",
      "best-adults-only-all-inclusive-resorts-for-couples",
    ],
    sections: [
      {
        title: "Start with the trip outside the treatment room",
        body:
          "A spa appointment may occupy only part of one day. Compare pool atmosphere, beach or ocean setting, room comfort, dining pace, noise level, and service style so the entire stay supports the kind of rest you want.",
      },
      {
        title: "Hydrotherapy access and treatments are different",
        body:
          "Ask what access is included, what requires a booked treatment, and whether facilities are shared or scheduled. Hydrotherapy circuits, relaxation areas, massages, and specialty treatments can have separate rules and costs that change the total value of the stay.",
      },
      {
        title: "Cancun and Los Cabos create different wellness moods",
        body:
          "Cancun pairs wellness with a greener Caribbean setting and a beach-centered vacation. Los Cabos offers a drier desert climate and dramatic coastal views that can make pool and resort time feel more central. Choose the destination mood before comparing treatment menus.",
      },
      {
        title: "Adults-only atmosphere extends the calm",
        body:
          "Adults-only resorts often feel quieter at pools and restaurants, but energy still varies by property and season. Ask about entertainment, group business, weddings, and the location of quieter rooms if a peaceful anniversary or honeymoon is the priority.",
      },
      {
        title: "Compare dining and wellness together",
        body:
          "Couples planning a wellness trip may care about lighter breakfasts, fresh options, room service, dietary accommodations, and thoughtful nonalcoholic drinks. A strong spa does not compensate for dining that misses the rest of the trip's goals.",
      },
      {
        title: "Request the complete spa-vacation total",
        body:
          "Compare the room, transfers, desired treatments, access fees, and any resort credits that truly apply. Confirm cancellation rules and appointment availability before relying on a package headline, particularly for short stays or special occasions.",
      },
    ],
  },
  {
    slug: "best-caribbean-family-resorts-with-water-parks",
    reviewedOn: "2026-11-03",
    eyebrow: "Water Park Resorts",
    title: "Best Caribbean all-inclusive resorts with water parks for families",
    description:
      "How to choose a Caribbean family resort with water features, dining variety, easy days, and enough activity for kids and adults.",
    seoTitle: "Best Caribbean Family Resorts With Water Parks",
    seoDescription: "Compare Caribbean all-inclusive resorts with water parks, slides, and splash zones by children's ages, height rules, resort layout, dining, and adult comfort.",
    quickAnswer: "The strongest family water-park resorts match the water features to children's actual ages while keeping rooms, food, shade, and calmer adult spaces nearby. Moon Palace The Grand Cancun offers a large resort-centered experience, Moon Palace Jamaica combines family amenities with island excursions, and Moon Palace The Grand Punta Cana is worth comparing for a newer large-format family trip.",
    image: upscaleResortImage(
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/c52nfg6ckt4lr1r36pdi96fd7u/240?angle=0"
    )!,
    readTime: "7 min read",
    collectionHref: "/collections/family-friendly",
    cta: "Read the water park guide",
    featuredPropertySlugs: ["moon-palace-the-grand-cancun", "moon-palace-jamaica", "moon-palace-the-grand-punta-cana"],
    relatedPostSlugs: [
      "best-family-all-inclusive-resorts-for-multigenerational-trips",
      "best-resorts-for-teens-and-tweens-in-mexico",
      "best-all-inclusive-resorts-in-cancun-for-families",
    ],
    sections: [
      {
        title: "Confirm what the resort means by water park",
        body:
          "A splash pad, several slides, and a full water-park complex create very different vacations. Review current photos and descriptions, then ask which features are operating during your dates rather than relying only on a water-park label.",
      },
      {
        title: "Match slides and pools to children's ages",
        body:
          "Younger children need shallow areas, shade, and close supervision. Older children and teens may care more about larger slides, sports, and places to socialize. Verify height, age, and swim-skill requirements before treating an attraction as a deciding feature.",
      },
      {
        title: "Location determines how often you use it",
        body:
          "Check the distance between the water features, your likely room area, restaurants, bathrooms, and quieter pools. A major attraction loses value when every visit requires a long walk or shuttle with wet children and gear.",
      },
      {
        title: "Plan for food, shade, and downtime",
        body:
          "Easy lunches, water stations, shaded seating, and nearby restrooms can matter as much as the slides. Families also benefit from a calm pool or comfortable room where younger children and adults can take a break from the busiest activity areas.",
      },
      {
        title: "Look beyond the water park for longer stays",
        body:
          "For a weeklong vacation, compare beach conditions, evening entertainment, dining variety, excursions, and rainy-day options. Water features may anchor the trip, but the rest of the resort determines whether every age group stays happy.",
      },
      {
        title: "Compare the complete family cost",
        body:
          "Confirm whether the water attractions are included, whether any premium activities cost extra, and how room occupancy affects the quote. Compare transfers, room layout, and included dining alongside the headline resort rate.",
      },
    ],
  },
  {
    slug: "cozumel-palace-scuba-diving-vacation-guide",
    eyebrow: "Scuba Travel",
    title: "Cozumel Palace scuba diving vacation guide for reef lovers and easy island escapes",
    description:
      "Why Cozumel Palace is a natural fit for divers, snorkelers, and travelers who want reef access with all-inclusive comfort.",
    image: catalogImage("turquoise-water-aerial.jpg"),
    readTime: "5 min read",
    collectionHref: "/collections/family-friendly",
    cta: "Read the Cozumel guide",
    featuredPropertySlugs: ["cozumel-palace"],
    sections: [
      {
        title: "Cozumel is built for water lovers",
        body:
          "Cozumel is one of Mexico's strongest choices for travelers who want reefs, diving, snorkeling, and a quieter island pace than mainland resort corridors.",
      },
      {
        title: "Why resort location matters",
        body:
          "Divers and snorkelers should think about boat access, gear logistics, excursion timing, and how easy it is to balance water days with relaxed evenings.",
      },
      {
        title: "Best for active beach travelers",
        body:
          "Cozumel Palace is a good match for travelers who want all-inclusive convenience but still expect the ocean to be a major part of the vacation.",
      },
    ],
  },
  {
    slug: "playacar-palace-walkable-playa-del-carmen-guide",
    eyebrow: "Walkable Mexico",
    title: "Playacar Palace guide: a walkable Playa del Carmen resort for beach, shopping, and town access",
    description:
      "How Playacar Palace fits travelers who want an all-inclusive resort with easy access to Playa del Carmen, ferry connections, and beach time.",
    image: upscaleResortImage(
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/grr1mp7f6h1q569etitj2r0f3m/240?angle=0"
    )!,
    readTime: "4 min read",
    collectionHref: "/collections/family-friendly",
    cta: "Read the Playacar guide",
    featuredPropertySlugs: ["playacar-palace"],
    sections: [
      {
        title: "Best for travelers who like to wander",
        body:
          "Playacar Palace is especially appealing for guests who want resort comfort but also like being close to shops, restaurants, nightlife, and ferry access.",
      },
      {
        title: "A different feel than a secluded resort",
        body:
          "Instead of feeling tucked away, this resort gives travelers a more connected Playa del Carmen experience while keeping the ease of an all-inclusive base.",
      },
      {
        title: "Who should consider it",
        body:
          "Couples, families with older kids, and travelers planning Cozumel day trips often appreciate the location and flexibility.",
      },
    ],
  },
  {
    slug: "beach-palace-cancun-family-beach-resort-guide",
    eyebrow: "Cancun Beach Resorts",
    title: "Beach Palace Cancun guide for families who want a classic beachfront all-inclusive stay",
    description:
      "A closer look at Beach Palace for families and couples seeking Cancun beach views, simple planning, and a polished all-inclusive format.",
    image: upscaleResortImage(
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/3lverrm7gl48r759qtvus92n1e/240?angle=0"
    )!,
    readTime: "4 min read",
    collectionHref: "/collections/family-friendly",
    cta: "Read the Beach Palace guide",
    featuredPropertySlugs: ["beach-palace"],
    sections: [
      {
        title: "Classic Cancun appeal",
        body:
          "Beach Palace fits travelers who want a recognizable Cancun beach vacation with ocean views, all-inclusive convenience, and a lively but manageable resort atmosphere.",
      },
      {
        title: "Easy for families and first-timers",
        body:
          "The resort is approachable for families and travelers new to all-inclusive vacations because the planning rhythm is simple and the destination is easy to understand.",
      },
      {
        title: "When it works best",
        body:
          "Consider Beach Palace for shorter Cancun stays, family beach weeks, and travelers who want convenience without choosing a mega-resort footprint.",
      },
    ],
  },
  {
    slug: "moon-palace-jamaica-family-resort-guide",
    eyebrow: "Jamaica Family Travel",
    title: "Moon Palace Jamaica family resort guide for Ocho Rios beach trips and island adventures",
    description:
      "A guide to Moon Palace Jamaica for families who want an all-inclusive beach base with access to Ocho Rios excursions and lively resort energy.",
    image: upscaleResortImage(
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/c52nfg6ckt4lr1r36pdi96fd7u/240?angle=0"
    )!,
    readTime: "5 min read",
    collectionHref: "/collections/family-friendly",
    cta: "Read the Jamaica guide",
    featuredPropertySlugs: ["moon-palace-jamaica"],
    sections: [
      {
        title: "Why Ocho Rios works for families",
        body:
          "Ocho Rios gives families a mix of beach time and adventure, with waterfalls, water activities, and a different island feel than Mexico resort corridors.",
      },
      {
        title: "Resort energy plus excursion access",
        body:
          "Moon Palace Jamaica works well for travelers who want all-inclusive convenience but still plan to add a few memorable island experiences.",
      },
      {
        title: "Best-fit travelers",
        body:
          "This resort is strongest for families and groups who like a lively atmosphere, active days, and a vacation that blends resort time with destination flavor.",
      },
    ],
  },
  {
    slug: "baglioni-maldives-luxury-island-resort-guide",
    eyebrow: "Maldives Luxury",
    title: "Baglioni Maldives guide for honeymoons, overwater villas, and barefoot luxury",
    description:
      "What to know when planning a Maldives luxury resort stay, from overwater villas and dining to transfer logistics and romantic trip timing.",
    image: upscaleResortImage(
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/u1b14u1cj57qrb4trvcjtuiq4p/240?angle=0"
    )!,
    readTime: "6 min read",
    collectionHref: "/collections/baglioni",
    cta: "Read the Maldives guide",
    featuredPropertySlugs: ["baglioni-resort-maldives"],
    sections: [
      {
        title: "The Maldives is about the setting",
        body:
          "For many travelers, a Maldives resort is chosen for privacy, water color, villa style, service, and the feeling of being far away from everyday life.",
      },
      {
        title: "Plan transfers carefully",
        body:
          "International arrivals, seaplane or domestic transfer timing, and first-night logistics matter more in the Maldives than in many beach destinations.",
      },
      {
        title: "Best for milestone travel",
        body:
          "Baglioni Resort Maldives is especially compelling for honeymoons, anniversaries, and luxury travelers who want a polished island escape.",
      },
    ],
  },
  {
    slug: "baglioni-italy-luxury-hotel-itinerary-guide",
    eyebrow: "Italy Itineraries",
    title: "Baglioni Italy hotel itinerary guide for Rome, Venice, Milan, Florence, and Puglia",
    description:
      "How to build a luxury Italy itinerary using Baglioni hotels and resorts for romance, art, dining, fashion, and coastal relaxation.",
    image: upscaleResortImage(
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/416ej5192t3u12ehio6ks1me4m/240?angle=0"
    )!,
    readTime: "7 min read",
    collectionHref: "/collections/european-luxury",
    cta: "Read the Italy itinerary",
    featuredPropertySlugs: ["baglioni-hotel-luna", "baglioni-hotel-regina", "casa-baglioni", "palazzo-firenze"],
    sections: [
      {
        title: "Build the trip around contrast",
        body:
          "A strong Italy itinerary often pairs a grand arrival city with a slower coastal or countryside finish, giving travelers culture first and rest later.",
      },
      {
        title: "Choose cities by personality",
        body:
          "Rome feels grand and layered, Venice is romantic and cinematic, Milan is design-focused, and Florence is ideal for art, walking, and Renaissance history.",
      },
      {
        title: "Add resort time if the trip is long enough",
        body:
          "For longer Italy vacations, a Puglia or Sardinia finish can make the itinerary feel less rushed and more restorative.",
      },
    ],
  },
  {
    slug: "how-to-plan-a-destination-wedding-at-an-all-inclusive-resort",
    eyebrow: "Wedding Planning",
    title: "How to plan a destination wedding at an all-inclusive resort without overwhelming your guests",
    description:
      "A practical destination wedding planning guide covering guest experience, room blocks, resort choice, timelines, budgets, and travel support.",
    image: catalogImage("destination-dining-table.jpg"),
    readTime: "7 min read",
    collectionHref: "/collections",
    cta: "Read the wedding planning guide",
    featuredPropertySlugs: ["moon-palace-the-grand-cancun", "playacar-palace", "le-blanc-spa-resort-cancun"],
    sections: [
      {
        title: "Lead with guest experience",
        body:
          "The best destination wedding plans consider how guests will travel, what they can comfortably spend, and whether the resort works for the full group.",
      },
      {
        title: "Room blocks need strategy",
        body:
          "Room categories, deposit deadlines, travel windows, airport transfers, and cancellation terms should be clear early so guests feel confident booking.",
      },
      {
        title: "Keep communication simple",
        body:
          "A clear planning process, one trusted travel contact, and an easy trip request form can prevent couples from becoming the help desk for every guest.",
      },
    ],
  },
  {
    slug: "when-to-book-all-inclusive-resorts-for-best-value",
    eyebrow: "Travel Planning",
    title: "When to book all-inclusive resorts for the best value, room choice, and travel perks",
    description:
      "Learn when to book all-inclusive resorts for family vacations, honeymoons, destination weddings, spring break, holidays, and peak travel weeks.",
    image: catalogImage("hotel-room-balcony.jpg"),
    readTime: "5 min read",
    collectionHref: "/collections",
    cta: "Read the booking timing guide",
    featuredPropertySlugs: ["moon-palace-cancun", "le-blanc-spa-resort-los-cabos", "baglioni-resort-maldives"],
    sections: [
      {
        title: "Popular weeks need earlier planning",
        body:
          "Spring break, holidays, summer family travel, and wedding-heavy dates can sell out sooner or lose the best room categories before travelers expect it.",
      },
      {
        title: "Value is not just the lowest rate",
        body:
          "The best value may include better room choice, advisor perks, resort credits, easier flights, and fewer compromises on the details that matter most.",
      },
      {
        title: "Use timing to protect the trip",
        body:
          "Booking earlier gives travelers more control, especially for groups, milestone trips, and resorts where specific room types or views matter.",
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
    href: "/collections/family-friendly",
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
        highlight: "A family-focused Punta Cana resort with a broad range of planned and available experiences. Confirm individual amenities before travel.",
        description:
          "An open Punta Cana resort designed for family travel. Specific facilities and experiences may vary by opening phase; ask us to confirm availability for your dates.",
        image:
          "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/q98qi1u5v96claikiqb4pkb83l/240?angle=0",
        tag: "Punta Cana",
        brand: "Moon Palace",
        tripStyle: "Next-Generation Family Resort",
        perfectFor: ["Families", "Group trips", "Large resort fans"],
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
    href: "/collections/adults-only",
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
    href: "/collections/baglioni",
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
    href: "/collections/baglioni",
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

  if (!matchingFeaturedCollection) return "/#portfolio-tabs";

  const canonicalCollectionSlug = {
    "adults-only-resorts": "adults-only",
    "baglioni-city-hotels": "baglioni",
    "baglioni-resorts": "baglioni",
  }[matchingFeaturedCollection.slug] ?? matchingFeaturedCollection.slug;

  return `/collections/${canonicalCollectionSlug}`;
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
