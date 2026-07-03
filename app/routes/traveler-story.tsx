import { useState } from "react";
import {
  findTravelerStoryBySlug,
  relatedTravelerStories,
  storyQuote,
} from "../lib/traveler-stories";
import type { Route } from "./+types/traveler-story";

export function loader({ params }: Route.LoaderArgs) {
  const story = findTravelerStoryBySlug(params.slug);

  if (!story) {
    throw new Response("Not Found", { status: 404 });
  }

  return {
    story,
    relatedStories: relatedTravelerStories(story, 4),
  };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [{ title: "Traveler Story Not Found | Premier Resort Travel" }];
  }

  const description = `${data.story.travelerName}'s ${data.story.tripType.toLowerCase()} trip to ${data.story.resort} in ${data.story.destination}. ${storyQuote(data.story)}`;

  return [
    { title: `${data.story.title} | Traveler Stories | Premier Resort Travel` },
    { name: "description", content: description },
    { property: "og:title", content: `${data.story.title} | Premier Resort Travel` },
    { property: "og:description", content: description },
    { property: "og:image", content: data.story.featuredImage },
  ];
}

export default function TravelerStoryPage({ loaderData }: Route.ComponentProps) {
  const { story, relatedStories } = loaderData;
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const snapshot = [
    ["Destination", `${story.destination}, ${story.country}`],
    ["Resort", story.resort],
    ["Length", story.length],
    ["Traveler Type", story.travelerType],
    ["Favorite Restaurant", story.favoriteRestaurant],
    ["Favorite Excursion", story.favoriteExcursion],
    ["Best For", story.tags.slice(0, 3).join(" · ")],
    ["Rating", `${story.rating}/5 stars`],
  ];
  const sections = [
    ["Why We Chose This Resort", story.story.whyWeChose],
    ["Favorite Experiences", story.story.favoriteExperiences],
    ["Dining", story.story.dining],
    ["Excursions", story.story.excursions],
    ["Travel Tips", story.story.travelTips],
    ["Would We Return?", story.story.wouldWeReturn],
    ["Advisor Recommendation", story.advisorRecommendation],
  ];
  const storySchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "LodgingBusiness",
      name: story.resort,
      address: `${story.destination}, ${story.country}`,
    },
    author: {
      "@type": "Person",
      name: story.travelerName,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: story.rating,
      bestRating: 5,
    },
    reviewBody: story.favoriteMemory,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Traveler Stories", item: "/traveler-stories" },
      { "@type": "ListItem", position: 3, name: story.title, item: `/traveler-stories/${story.slug}` },
    ],
  };

  return (
    <main className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storySchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <nav className="story-breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span>/</span>
        <a href="/traveler-stories">Traveler Stories</a>
        <span>/</span>
        <span>{story.travelerName}</span>
      </nav>

      <section className="traveler-story-hero">
        <img src={story.featuredImage} alt={`${story.destination} vacation at ${story.resort}`} decoding="async" />
        <div className="traveler-story-hero-copy">
          <p className="eyebrow">Traveler Story</p>
          <h1>{story.title}</h1>
          <div className="traveler-story-hero-meta">
            <span>{story.travelerName}</span>
            <span>{story.destination}</span>
            <span>{story.resort}</span>
            <span>{story.tripType}</span>
            <span>{story.travelDate}</span>
          </div>
          <a className="button button-primary" href={`/?popup=start&note=${encodeURIComponent(`I liked ${story.travelerName}'s story at ${story.resort}.`)}`}>
            Plan a Similar Trip
          </a>
        </div>
      </section>

      <div className="traveler-story-layout">
        <article className="traveler-story-article">
          <p className="story-pullquote">"{story.favoriteMemory}"</p>
          {sections.map(([title, body]) => (
            <section key={title}>
              <h2>{title}</h2>
              <p>{body}</p>
            </section>
          ))}
        </article>

        <aside className="story-snapshot">
          <p className="eyebrow">Trip Snapshot</p>
          <dl>
            {snapshot.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      <section className="story-gallery-section">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Photo Gallery</p>
            <h2>Moments from the trip</h2>
          </div>
          <p className="section-copy">Tap any image to open a larger view.</p>
        </div>

        <div className="story-masonry-gallery">
          {story.gallery.map((image, index) => (
            <button key={`${image}-${index}`} type="button" onClick={() => setActiveImage(image)}>
              <img
                src={image}
                alt={`${story.travelerName}'s vacation gallery image ${index + 1}`}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 900px) 100vw, 33vw"
              />
            </button>
          ))}
        </div>
      </section>

      {activeImage ? (
        <div className="story-lightbox" role="dialog" aria-modal="true" aria-label="Traveler story photo">
          <button type="button" aria-label="Close gallery image" onClick={() => setActiveImage(null)}>
            ×
          </button>
          <img src={activeImage} alt="" />
        </div>
      ) : null}

      <section className="related-properties">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Similar Trips</p>
            <h2>More traveler stories with a related feel</h2>
          </div>
          <a className="text-link" href="/traveler-stories">View all stories</a>
        </div>

        <div className="traveler-story-grid traveler-story-grid-compact">
          {relatedStories.map((related) => (
            <a key={related.slug} className="traveler-story-card" href={`/traveler-stories/${related.slug}`}>
              <div className="traveler-story-image">
                <img src={related.featuredImage} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="traveler-story-copy">
                <div className="traveler-story-meta">
                  <span>{related.tripType}</span>
                  <span>{related.travelDate}</span>
                </div>
                <h3>{related.travelerName} in {related.destination}</h3>
                <p>{related.resort}</p>
                <span className="text-link">View Story -&gt;</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
