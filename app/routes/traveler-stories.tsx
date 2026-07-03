import { publishedTravelerStories } from "../lib/traveler-stories";
import type { Route } from "./+types/traveler-stories";

export function loader() {
  const stories = publishedTravelerStories();
  const featuredStories = stories.slice(0, 6);
  const memoryBoard = stories
    .flatMap((story) =>
      [story.featuredImage, ...story.gallery].map((image, index) => ({
        image,
        alt: `${story.travelerName}'s ${story.destination} memory`,
        storySlug: story.slug,
        travelerName: story.travelerName,
        destination: story.destination,
        index,
      }))
    )
    .filter((memory, index, list) => list.findIndex((item) => item.image === memory.image) === index)
    .slice(0, 12);

  return {
    stories: featuredStories,
    quotes: stories.slice(0, 6),
    memoryBoard,
  };
}

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Traveler Stories | Premier Resort Travel" },
    {
      name: "description",
      content:
        "Real traveler stories, review quotes, and vacation memories from Premier Resort Travel clients.",
    },
    { property: "og:title", content: "Traveler Stories | Premier Resort Travel" },
    {
      property: "og:description",
      content: "Real travelers, real vacations, and real memories from curated resort and hotel trips.",
    },
  ];
}

export default function TravelerStoriesIndex({ loaderData }: Route.ComponentProps) {
  const { stories, quotes, memoryBoard } = loaderData;
  const heroStory = stories[0];

  return (
    <main className="page-shell traveler-stories-page">
      <section className="traveler-stories-hero">
        <div className="traveler-stories-hero-copy">
          <p className="eyebrow">Traveler Stories</p>
          <h1>Real trips, told through the moments people remember.</h1>
          <p className="lede">
            A growing collection of resort stays, family vacations, anniversaries, dive trips,
            honeymoons, and Europe escapes planned with a more personal point of view.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/?popup=start">
              Plan a similar trip
            </a>
            <a className="button button-secondary" href="#story-reviews">
              Read reviews
            </a>
          </div>
        </div>

        {heroStory ? (
          <a className="traveler-stories-featured-card" href={`/traveler-stories/${heroStory.slug}`}>
            <img
              src={heroStory.featuredImage}
              alt={`${heroStory.travelerName}'s trip to ${heroStory.destination}`}
              decoding="async"
              sizes="(max-width: 900px) 100vw, 44vw"
            />
            <div>
              <span className="story-rating" aria-label={`${heroStory.rating} star rating`}>
                {"★★★★★"}
              </span>
              <h2>{heroStory.travelerName}'s {heroStory.tripType.toLowerCase()} escape</h2>
              <p>{heroStory.resort} · {heroStory.destination}</p>
              <strong>View Story -&gt;</strong>
            </div>
          </a>
        ) : null}
      </section>

      <section className="traveler-stories-review-strip" id="story-reviews" aria-label="Traveler review quotes">
        {quotes.slice(0, 3).map((story) => (
          <figure key={story.slug}>
            <div className="story-rating" aria-label={`${story.rating} star rating`}>
              {"★★★★★"}
            </div>
            <blockquote>"{story.favoriteMemory}"</blockquote>
            <figcaption>
              {story.travelerName} · {story.resort}
            </figcaption>
          </figure>
        ))}
      </section>

      <section className="traveler-memory-board-section" aria-labelledby="memory-board-heading">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Memory Board</p>
            <h2 id="memory-board-heading">A scrapbook of favorite vacation moments</h2>
          </div>
          <p className="section-copy">
            Resort views, beach days, dinners, spa time, and the small details that make a trip feel
            like it belonged to the traveler.
          </p>
        </div>

        <div className="traveler-memory-board">
          {memoryBoard.map((memory, index) => (
            <a
              key={`${memory.image}-${index}`}
              className={index % 5 === 0 ? "is-large" : ""}
              href={`/traveler-stories/${memory.storySlug}`}
            >
              <img src={memory.image} alt={memory.alt} loading="lazy" decoding="async" />
              <span>{memory.travelerName} · {memory.destination}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="traveler-story-grid-section" aria-labelledby="featured-story-heading">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Featured Stories</p>
            <h2 id="featured-story-heading">Read the trip notes</h2>
          </div>
          <p className="section-copy">
            Each story includes why the resort fit, favorite experiences, dining notes, travel tips,
            and an advisor recommendation.
          </p>
        </div>

        <div className="traveler-story-grid">
          {stories.map((story) => (
            <a key={story.slug} className="traveler-story-card" href={`/traveler-stories/${story.slug}`}>
              <div className="traveler-story-image">
                <img
                  src={story.featuredImage}
                  alt={`${story.travelerName}'s trip to ${story.destination}`}
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 900px) 100vw, 33vw"
                />
              </div>
              <div className="traveler-story-copy">
                <div className="traveler-story-meta">
                  <span>{story.tripType}</span>
                  <span>{story.travelDate}</span>
                </div>
                <h3>{story.travelerName} at {story.resort}</h3>
                <p className="card-region">{story.destination}, {story.country}</p>
                <p>"{story.favoriteMemory}"</p>
                <div className="story-rating" aria-label={`${story.rating} star rating`}>
                  {"★★★★★"}
                </div>
                <span className="text-link">View Story -&gt;</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="traveler-stories-cta" aria-label="Plan a similar trip">
        <p className="eyebrow">Your Story Next</p>
        <h2>Tell us what kind of vacation you want to remember.</h2>
        <a className="button button-primary" href="/?popup=start">
          Start Planning
        </a>
      </section>
    </main>
  );
}
