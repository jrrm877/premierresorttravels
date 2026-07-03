import { journalPosts } from "../lib/property-data";

type ResourceIcon = "suitcase" | "kids" | "family" | "heart" | "pin" | "calendar" | "checklist" | "passport" | "people" | "badge" | "gift";

const resourceCategories = [
  {
    title: "Packing Lists",
    body: "Printable packing checklists for every type of trip.",
    image: "/images/home-trip-popup-reference.png",
    icon: "suitcase" as const,
  },
  {
    title: "Kids Resort Search & Find",
    body: "Find the best resorts for kids of all ages.",
    image: "/images/home-style-family.jpg",
    icon: "kids" as const,
  },
  {
    title: "Family Tips & Tricks",
    body: "Stress-free travel advice for families that really works.",
    image: "/images/home-style-family-beach.jpg",
    icon: "family" as const,
  },
  {
    title: "Romantic Bucket List",
    body: "Ideas for dreamy escapes and once-in-a-lifetime moments.",
    image: "/images/home-style-romantic-dinner.jpg",
    icon: "heart" as const,
  },
  {
    title: "Destination Guides",
    body: "Insider guides to help you explore with confidence.",
    image: "/images/home-style-europe.jpg",
    icon: "pin" as const,
  },
  {
    title: "Travel Tips & Planning",
    body: "Helpful tips to plan smarter and travel better.",
    image: "/images/about-better-recommendations-graphic.png",
    icon: "calendar" as const,
  },
];

const popularResources = [
  {
    category: "Packing Lists",
    title: "The Ultimate All-Inclusive Packing List",
    body: "Don't forget a thing. Our printable checklist has you covered.",
    image: "/images/home-trip-popup-reference.png",
    readTime: "6 min read",
  },
  {
    category: "Family Travel",
    title: "10 Best All-Inclusive Resorts for Families in Mexico",
    body: "Resorts kids love and parents actually relax at.",
    image: "/images/home-style-family.jpg",
    readTime: "7 min read",
  },
  {
    category: "Travel Tips",
    title: "Flying with Kids: Tips from Experience",
    body: "From packing to the plane, here's how to survive and enjoy the trip.",
    image: "/images/home-style-family-beach.jpg",
    readTime: "5 min read",
  },
  {
    category: "Romance",
    title: "50 Romantic Things to Do on Vacation with Your Partner",
    body: "Create unforgettable memories together, wherever you go.",
    image: "/images/home-style-romance.jpg",
    readTime: "4 min read",
  },
];

const tools = [
  {
    icon: "checklist" as const,
    title: "Packing Checklist Generator",
    body: "Tell us where you're going and we'll build a custom packing list just for you.",
    cta: "Get Started",
    tone: "blue",
  },
  {
    icon: "pin" as const,
    title: "Kids Resort Finder",
    body: "Answer a few quick questions and we'll match you with the perfect family resorts.",
    cta: "Find Resorts",
    tone: "sand",
  },
  {
    icon: "calendar" as const,
    title: "Best Time to Travel",
    body: "See the best months to visit your dream destinations based on weather and events.",
    cta: "Explore",
    tone: "mist",
  },
  {
    icon: "passport" as const,
    title: "Travel Documents Guide",
    body: "Passport, visas, and entry requirements, everything you need to know.",
    cta: "Learn More",
    tone: "gold",
  },
];

const trustItems = [
  {
    icon: "people" as const,
    title: "Personalized Service",
    body: "We take the time to understand your travel style and goals.",
  },
  {
    icon: "badge" as const,
    title: "Expert Advice",
    body: "Our firsthand experience helps you travel with confidence.",
  },
  {
    icon: "heart" as const,
    title: "Memories That Last",
    body: "We plan the details so you can focus on what matters most.",
  },
  {
    icon: "gift" as const,
    title: "We're With You",
    body: "Before, during, and after your trip, we've got you.",
  },
];

export function meta() {
  return [
    { title: "Travel Resources | Premier Resort Travel" },
    {
      name: "description",
      content:
        "Explore Premier Resort Travel resources, packing lists, family resort tips, romantic vacation ideas, destination guides, and travel planning tools.",
    },
  ];
}

function ResourceLineIcon({ name }: { name: ResourceIcon }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" focusable="false">
      {name === "suitcase" && (
        <>
          <path {...common} d="M15 16v-4c0-3 2-5 5-5h8c3 0 5 2 5 5v4" />
          <rect {...common} x="9" y="16" width="30" height="25" rx="3" />
          <path {...common} d="M18 16v25M30 16v25" />
        </>
      )}
      {name === "kids" && (
        <>
          <circle {...common} cx="17" cy="16" r="5" />
          <circle {...common} cx="31" cy="16" r="5" />
          <path {...common} d="M8 38c1.8-7 5-10.5 9-10.5S24.2 31 26 38M22 38c1.8-7 5-10.5 9-10.5S38.2 31 40 38" />
        </>
      )}
      {name === "family" && (
        <>
          <circle {...common} cx="18" cy="15" r="5" />
          <circle {...common} cx="32" cy="17" r="4" />
          <path {...common} d="M8 39c2-7.5 5.4-11.2 10-11.2S26 31.5 28 39M26 39c1.6-6 4-9 7-9s5.5 3 7 9" />
        </>
      )}
      {name === "heart" && (
        <path {...common} d="M24 39S9 30.5 9 18.8C9 13.5 12.4 10 17 10c2.8 0 5.4 1.5 7 4 1.6-2.5 4.2-4 7-4 4.6 0 8 3.5 8 8.8C39 30.5 24 39 24 39Z" />
      )}
      {name === "pin" && (
        <>
          <path {...common} d="M24 42s13-12.4 13-24a13 13 0 0 0-26 0c0 11.6 13 24 13 24Z" />
          <circle {...common} cx="24" cy="18" r="4" />
        </>
      )}
      {name === "calendar" && (
        <>
          <rect {...common} x="9" y="12" width="30" height="27" rx="3" />
          <path {...common} d="M16 8v8M32 8v8M9 20h30M17 27h.1M24 27h.1M31 27h.1M17 33h.1M24 33h.1M31 33h.1" />
        </>
      )}
      {name === "checklist" && (
        <>
          <rect {...common} x="11" y="9" width="26" height="32" rx="3" />
          <path {...common} d="M18 19h12M18 27h12M18 35h12M14 19l1.5 1.5 3-3M14 27l1.5 1.5 3-3" />
        </>
      )}
      {name === "passport" && (
        <>
          <rect {...common} x="13" y="7" width="23" height="34" rx="3" />
          <circle {...common} cx="24.5" cy="22" r="6" />
          <path {...common} d="M18.5 22h12M24.5 16c2 2 3 4 3 6s-1 4-3 6c-2-2-3-4-3-6s1-4 3-6ZM18 33h13" />
        </>
      )}
      {name === "people" && (
        <>
          <circle {...common} cx="17" cy="17" r="5" />
          <circle {...common} cx="31" cy="17" r="5" />
          <path {...common} d="M6 38c2-7 5.7-10.5 11-10.5S26 31 28 38M20 38c2-7 5.7-10.5 11-10.5S40 31 42 38" />
        </>
      )}
      {name === "badge" && (
        <>
          <path {...common} d="M24 5 30 9l7 .9 1.1 6.9L42 23l-3.9 6.2-1.1 6.9-7 .9-6 4-6-4-7-.9-1.1-6.9L6 23l3.9-6.2 1.1-6.9 7-.9 6-4Z" />
          <path {...common} d="m17.5 24 4.2 4.2 8.8-9" />
        </>
      )}
      {name === "gift" && (
        <>
          <path {...common} d="M8 18h32v22H8zM6 18h36v8H6zM24 18v22" />
          <path {...common} d="M24 18c-7 0-10-2-10-5 0-2 1.7-4 4-4 3 0 5 4 6 9ZM24 18c7 0 10-2 10-5 0-2-1.7-4-4-4-3 0-5 4-6 9Z" />
        </>
      )}
    </svg>
  );
}

export default function JournalIndexPage() {
  const journalResourceCards = journalPosts;
  const scrollingJournalCards = [...journalResourceCards, ...journalResourceCards];

  return (
    <main className="resources-page">
      <section className="resources-hero" aria-labelledby="resources-title">
        <div className="resources-hero-copy">
          <p className="eyebrow">Travel Resources</p>
          <h1 id="resources-title">Everything you need for an unforgettable trip.</h1>
          <p>
            Expert guides, packing lists, resort tips, and insider advice designed to make planning
            your perfect vacation easier and a lot more fun.
          </p>
          <form className="resources-search" action="/journal" role="search">
            <label className="sr-only" htmlFor="resource-search">
              Search travel resources
            </label>
            <span aria-hidden="true">⌕</span>
            <input id="resource-search" name="q" placeholder="Search resources, tips, or guides..." />
            <button type="submit">Search</button>
          </form>
        </div>
        <div className="resources-hero-image">
          <img src="/images/home-trip-popup-reference.png" alt="Packed suitcase with beach vacation essentials" />
        </div>
      </section>

      <section className="resources-categories" aria-labelledby="resources-categories-heading">
        <div className="resources-section-title">
          <h2 id="resources-categories-heading">Browse By Category</h2>
        </div>
        <div className="resources-category-grid">
          {resourceCategories.map((category) => (
            <a key={category.title} className="resources-category-card" href="#popular-resources">
              <div className="resources-category-icon">
                <ResourceLineIcon name={category.icon} />
              </div>
              <h3>{category.title}</h3>
              <p>{category.body}</p>
              <img src={category.image} alt="" loading="lazy" decoding="async" />
            </a>
          ))}
        </div>
        <a className="button button-secondary resources-centered-button" href="#popular-resources">
          View All Categories
        </a>
      </section>

      <section className="resources-popular" id="popular-resources" aria-labelledby="resources-popular-heading">
        <div className="resources-section-header">
          <h2 id="resources-popular-heading">Popular Resources</h2>
          <a href="/journal">View All Resources -&gt;</a>
        </div>
        <div className="resources-card-grid">
          {popularResources.map((resource) => (
            <article key={resource.title} className="resources-article-card">
              <img src={resource.image} alt="" loading="lazy" decoding="async" />
              <div>
                <p className="eyebrow">{resource.category}</p>
                <h3>{resource.title}</h3>
                <p>{resource.body}</p>
                <span>{resource.readTime}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {journalResourceCards.length > 0 ? (
        <section className="resources-popular resources-journal-strip" aria-labelledby="resources-journal-heading">
          <div className="resources-section-header">
            <h2 id="resources-journal-heading">From The Travel Journal</h2>
            <a href="/collections">Browse Collections -&gt;</a>
          </div>
          <div className="resources-journal-carousel" aria-label="Travel journal articles">
            <div className="resources-journal-track">
              {scrollingJournalCards.map((post, index) => (
                <a
                  key={`${post.slug}-${index}`}
                  className="resources-article-card resources-journal-card"
                  href={`/journal/${post.slug}`}
                >
                  <img src={post.image} alt="" loading="lazy" decoding="async" />
                  <div>
                    <p className="eyebrow">{post.eyebrow}</p>
                    <h3>{post.title}</h3>
                    <p>{post.description}</p>
                    <span>{post.readTime} -&gt;</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="resources-tools" aria-labelledby="resources-tools-heading">
        <div className="resources-section-title">
          <h2 id="resources-tools-heading">Featured Tools & Guides</h2>
        </div>
        <div className="resources-tool-grid">
          {tools.map((tool) => (
            <a key={tool.title} className={`resources-tool-card ${tool.tone}`} href="/?popup=start">
              <div className="resources-tool-icon">
                <ResourceLineIcon name={tool.icon} />
              </div>
              <h3>{tool.title}</h3>
              <p>{tool.body}</p>
              <span>{tool.cta} -&gt;</span>
            </a>
          ))}
        </div>
      </section>

      <section className="resources-subscribe" aria-label="Subscribe for travel resources">
        <img src="/images/home-about-gallery-coast.jpg" alt="" loading="lazy" decoding="async" />
        <div>
          <p className="eyebrow">Stay Inspired</p>
          <h2>Get exclusive travel tips, packing lists, and resort highlights delivered to your inbox.</h2>
        </div>
        <form className="resources-subscribe-form">
          <label className="sr-only" htmlFor="resource-email">
            Email address
          </label>
          <input id="resource-email" type="email" placeholder="Enter your email address" />
          <button type="submit">Subscribe</button>
          <p>No spam, just helpful travel inspiration.</p>
        </form>
      </section>

      <section className="resources-trust-band" aria-label="Why plan with Premier Resort Travel">
        {trustItems.map((item) => (
          <article key={item.title}>
            <div>
              <ResourceLineIcon name={item.icon} />
            </div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
