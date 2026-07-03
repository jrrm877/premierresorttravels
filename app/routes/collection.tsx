import {
  featuredCollections,
  findFeaturedCollectionBySlug,
  findJournalPostBySlug,
} from "../lib/property-data";
import { storiesForCollection } from "../lib/traveler-stories";
import type { Route } from "./+types/collection";

export async function loader({ params }: Route.LoaderArgs) {
  const collection = findFeaturedCollectionBySlug(params.slug);

  if (!collection) {
    throw new Response("Not Found", { status: 404 });
  }

  const journalPost = collection.journalSlug
    ? findJournalPostBySlug(collection.journalSlug) ?? null
    : null;

  const relatedCollections = featuredCollections
    .filter((candidate) => candidate.slug !== collection.slug)
    .slice(0, 3);

  return { collection, journalPost, relatedCollections, travelerStories: storiesForCollection(collection, 4) };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [{ title: "Collection Not Found | Premier Resort Travel" }];
  }

  return [
    { title: `${data.collection.title} | Premier Resort Travel` },
    {
      name: "description",
      content: data.collection.description,
    },
  ];
}

export default function CollectionPage({ loaderData }: Route.ComponentProps) {
  const { collection, journalPost, relatedCollections, travelerStories } = loaderData;
  const collectionSnapshot = [
    {
      label: "Properties in this collection",
      value: String(collection.properties.length),
      detail: "A cleaner shortlist of matching stays to compare first.",
    },
    {
      label: "Best for",
      value: collection.idealFor[0] ?? "Luxury travel",
      detail: collection.idealFor.slice(1, 3).join(" · ") || "Tailored traveler fit",
    },
    {
      label: "Why travelers choose it",
      value: collection.highlights[0] ?? "Curated luxury",
      detail: collection.highlights[1] ?? "Helpful next-step clarity",
    },
  ];

  return (
    <main className="page-shell">
      <section className="collection-hero">
        <div className="collection-hero-image">
          <img
            src={collection.image}
            alt={collection.title}
            decoding="async"
            sizes="(max-width: 1100px) 100vw, 52vw"
          />
        </div>
        <div className="collection-hero-copy">
          <p className="eyebrow">{collection.eyebrow}</p>
          <h1>{collection.title}</h1>
          <p className="lede">{collection.description}</p>
          <div className="collection-highlight-list" aria-label="Collection highlights">
            {collection.highlights.map((highlight) => (
              <span key={highlight} className="feature-badge">
                {highlight}
              </span>
            ))}
          </div>
          <div className="collection-highlight-list" aria-label="Ideal for">
            {collection.idealFor.map((item) => (
              <span key={item} className="tier-pill">
                {item}
              </span>
            ))}
          </div>
          <div className="hero-actions">
            <a className="button button-primary" href="#collection-properties">
              View all stays
            </a>
            <a className="button button-secondary" href="/#plan-trip">
              Request a quote
            </a>
          </div>
        </div>
      </section>

      <section className="property-details">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Collection Snapshot</p>
            <h2>How this collection helps narrow the right stay faster</h2>
          </div>
          <p className="section-copy">
            Use this page as the cleaner planning layer between broad inspiration and individual
            resort details.
          </p>
        </div>

        <div className="collection-summary-grid">
          {collectionSnapshot.map((item) => (
            <article key={item.label} className="collection-summary-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="property-details">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">What To Know</p>
            <h2>How travelers usually choose within this collection</h2>
          </div>
          <p className="section-copy">
            Use these planning notes to guide the conversation and narrow the strongest-fit
            properties before you dive deeper into each stay.
          </p>
        </div>

        <div className="planning-grid">
          {collection.planningNotes.map((note) => (
            <article key={note.title} className="planning-card">
              <h3>{note.title}</h3>
              <p>{note.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="portfolio-section accent-gold" id="collection-properties">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Featured Stays</p>
            <h2>Start with the strongest-fit properties in this travel style</h2>
          </div>
          <p className="section-copy">
            Compare standout options, open the full property page, and move into the right stay
            with much less guesswork.
          </p>
        </div>

        <div className="portfolio-grid">
          {collection.properties.map((property) => (
            <article key={property.slug} className="portfolio-card">
              <div className="portfolio-image-shell">
                <img
                  className="destination-image"
                  src={property.image}
                  alt={property.name}
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 1100px) 100vw, 25vw"
                />
              </div>
              <div className="portfolio-meta">
                <span className="feature-badge">{property.tag}</span>
                <p className="card-region">{property.location}</p>
              </div>
              <h3>{property.name}</h3>
              <p>{property.highlight}</p>
                <div className="card-actions card-actions-inline">
                  <a className="button button-secondary" href={`/properties/${property.slug}`}>
                    Explore property
                  </a>
                </div>
              </article>
            ))}
          </div>
      </section>

      <section className="collections-section">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Who It Works For</p>
            <h2>Traveler goals this collection tends to serve best</h2>
          </div>
          <p className="section-copy">
            These are the kinds of trips and traveler priorities that most often point back to
            this collection.
          </p>
        </div>

        <div className="collection-summary-grid">
          {collection.idealFor.map((item) => (
            <article key={item} className="collection-summary-card collection-summary-card-pill">
              <span>Ideal for</span>
              <strong>{item}</strong>
              <p>Use this as a quick way to test whether the collection matches the trip mood.</p>
            </article>
          ))}
        </div>
      </section>

      {travelerStories.length ? (
        <section className="collections-section">
          <div className="section-heading section-heading-stack">
            <div>
              <p className="eyebrow">Traveler Experiences</p>
              <h2>Real trips that match this collection</h2>
            </div>
            <a className="text-link" href="/traveler-stories">
              View all stories
            </a>
          </div>

          <div className="traveler-story-grid traveler-story-grid-compact">
            {travelerStories.map((story) => (
              <a key={story.slug} className="traveler-story-card" href={`/traveler-stories/${story.slug}`}>
                <div className="traveler-story-image">
                  <img src={story.featuredImage} alt="" loading="lazy" decoding="async" />
                </div>
                <div className="traveler-story-copy">
                  <div className="traveler-story-meta">
                    <span>{story.tripType}</span>
                    <span>{story.travelDate}</span>
                  </div>
                  <h3>{story.travelerName} in {story.destination}</h3>
                  <p>{story.resort}</p>
                  <span className="text-link">View Story -&gt;</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {journalPost ? (
        <section className="collections-section">
          <div className="section-heading section-heading-stack">
            <div>
              <p className="eyebrow">Travel Guide</p>
              <h2>Helpful reading for travelers still comparing options</h2>
            </div>
            <p className="section-copy">{journalPost.description}</p>
          </div>

          <article className="collection-feature collection-feature-wide">
            <div className="collection-feature-image">
              <img
                src={journalPost.image}
                alt={journalPost.title}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 1100px) 100vw, 40vw"
              />
            </div>
            <div className="collection-feature-copy">
              <p className="eyebrow">{journalPost.eyebrow}</p>
              <h3>{journalPost.title}</h3>
              <p>{journalPost.description}</p>
              <a className="text-link" href={`/journal/${journalPost.slug}`}>
                {journalPost.cta}
              </a>
            </div>
          </article>
        </section>
      ) : null}

      <section className="property-details">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Keep Comparing</p>
            <h2>Other collections travelers often consider alongside this one</h2>
          </div>
          <p className="section-copy">
            When the fit is close, these neighboring collections are usually the next-best places
            to compare before sending the inquiry.
          </p>
        </div>

        <div className="collection-nearby-grid">
          {relatedCollections.map((item) => (
            <a key={item.slug} className="collection-nearby-card" href={`/collections/${item.slug}`}>
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 1100px) 100vw, 26vw"
              />
              <div className="collection-nearby-copy">
                <p className="eyebrow">{item.eyebrow}</p>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="quote-section">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Questions Travelers Ask</p>
            <h2>Answers that make the next step easier</h2>
          </div>
        </div>

        <div className="inquiry-list">
          {collection.faqs.map((item) => (
            <article key={item.question} className="planning-card">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
