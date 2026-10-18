import { useState } from "react";
import { fallbackProperties, fetchDestinationsFromDb, fetchPropertyBySlug } from "../lib/catalog";
import { findCollectionHrefForProperty } from "../lib/property-data";
import { storiesForProperty } from "../lib/traveler-stories";
import type { Route } from "./+types/property";

export async function loader({ params, context }: Route.LoaderArgs) {
  try {
    const property = await fetchPropertyBySlug(context.cloudflare.env.DB, params.slug);

    if (!property) {
      throw new Response("Not Found", { status: 404 });
    }

    const related = (await fetchDestinationsFromDb(context.cloudflare.env.DB))
      .filter(
        (candidate) =>
          candidate.slug !== property.slug &&
          (candidate.brand === property.brand || candidate.region === property.region)
      )
      .slice(0, 3);

    return { property, related, source: "database", travelerStories: storiesForProperty(property, 3) };
  } catch {
    const property = fallbackProperties().find((candidate) => candidate.slug === params.slug);

    if (!property) {
      throw new Response("Not Found", { status: 404 });
    }

    const related = fallbackProperties()
      .filter(
        (candidate) =>
          candidate.slug !== property.slug &&
          (candidate.brand === property.brand || candidate.region === property.region)
      )
      .slice(0, 3);

    return { property, related, source: "fallback", travelerStories: storiesForProperty(property, 3) };
  }
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [{ title: "Property Not Found | Premier Resort Travel" }];
  }

  return [
    { title: `${data.property.name} | Resort Guide & Personalized Quotes | Premier Resort Travel` },
    { tagName: "link", rel: "canonical", href: `https://premierresorttravels.com/properties/${encodeURIComponent(data.property.slug)}` },
    {
      name: "description",
      content: `${data.property.name} in ${data.property.location}. ${data.property.description}`,
    },
  ];
}

export default function PropertyPage({ loaderData }: Route.ComponentProps) {
  const { property, related, source, travelerStories } = loaderData;
  const [photoOpen, setPhotoOpen] = useState(false);
  const collectionHref = findCollectionHrefForProperty(property.slug);
  const quoteHref = `/quote?resort=${encodeURIComponent(property.name)}&origin=property`;
  const comparisonGuides: Record<string, { href: string; title: string }[]> = {
    "moon-palace-the-grand-cancun": [
      { href: "/journal/moon-palace-the-grand-vs-moon-palace-cancun", title: "Moon Palace The Grand vs. Moon Palace Cancun" },
      { href: "/journal/moon-palace-the-grand-cancun-family-guide", title: "Moon Palace The Grand Cancun family guide" },
      { href: "/journal/best-all-inclusive-resorts-in-cancun-for-families", title: "Compare Cancun family resorts" },
    ],
    "moon-palace-cancun": [
      { href: "/journal/moon-palace-the-grand-vs-moon-palace-cancun", title: "Moon Palace The Grand vs. Moon Palace Cancun" },
      { href: "/journal/best-all-inclusive-resorts-in-cancun-for-families", title: "Compare Cancun family resorts" },
    ],
    "le-blanc-spa-resort-cancun": [
      { href: "/journal/le-blanc-cancun-vs-le-blanc-los-cabos", title: "Le Blanc Cancun vs. Los Cabos" },
      { href: "/journal/best-adults-only-resorts-in-cancun-for-honeymoons", title: "Adults-only Cancun honeymoon guide" },
    ],
    "le-blanc-spa-resort-los-cabos": [
      { href: "/journal/le-blanc-cancun-vs-le-blanc-los-cabos", title: "Le Blanc Cancun vs. Los Cabos" },
    ],
  };
  const comparisonLinks = comparisonGuides[property.slug] ?? [];


  return (
    <main className="page-shell">
      <section className="property-hero">
        <div className="property-hero-image">
          <button type="button" className="resort-photo-trigger" onClick={() => setPhotoOpen(true)} aria-label={`Enlarge photo of ${property.name}`}>
            <img
              src={property.image_url || ""}
              alt={property.name}
              decoding="async"
              sizes="(max-width: 1100px) 100vw, 55vw"
            />
            <span className="resort-photo-hint">View larger photo ↗</span>
          </button>
        </div>
        <div className="property-hero-copy">
          <p className="eyebrow">{property.brand}</p>
          <h1>{property.name}</h1>
          <p className="property-location">{property.location}</p>
          <p className="lede">{property.description}</p>
          <div className="property-pill-row">
            <span className="feature-badge">{property.tripStyle}</span>
            <span className="tier-pill">{property.region}</span>
            <span className="tier-pill">{property.brand}</span>
          </div>
          <div className="hero-actions">
            <a className="button button-primary" href={quoteHref}>
              Get My Free Vacation Quote
            </a>
            <a className="button button-secondary" href={collectionHref}>
              Back to collection
            </a>
          </div>
          <p style={{ fontSize: "0.9rem", marginTop: "0.75rem" }}>Free, personalized guidance. Your resort choice is included automatically, and there is no obligation to book.</p>
        </div>
      </section>

      {photoOpen ? (
        <div className="resort-photo-overlay" role="presentation" onClick={() => setPhotoOpen(false)}>
          <div className="resort-photo-modal" role="dialog" aria-modal="true" aria-label={`Photo of ${property.name}`} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => { if (event.key === "Escape") setPhotoOpen(false); }}>
            <button type="button" className="resort-photo-close" onClick={() => setPhotoOpen(false)} aria-label="Close enlarged photo">×</button>
            <img src={property.image_url || ""} alt={property.name} />
            <p>{property.name} · {property.location}</p>
          </div>
        </div>
      ) : null}


      {property.slug === "le-blanc-spa-resort-cancun" && (
        <section className="property-details leblanc-tour" aria-labelledby="leblanc-tour-heading">
          <div className="section-heading section-heading-stack">
            <p className="eyebrow">Your Resort Walkthrough</p>
            <h2 id="leblanc-tour-heading">Experience Le Blanc Cancun before you book</h2>
            <p>Explore the moments that matter most to your vacation. We'll help confirm room categories, inclusions and current amenities when you request a quote.</p>
          </div>
          <nav className="leblanc-tour-nav" aria-label="Resort tour sections">
            <a href="#tour-arrival">Arrival</a>
            <a href="#tour-room">Your room</a>
            <a href="#tour-experiences">Your days</a>
            <a href="#tour-fit">Your fit</a>
          </nav>
          <div className="leblanc-tour-feature" id="tour-arrival">
            <img src={property.image_url || ""} alt={property.name + " resort view"} loading="lazy" />
            <div>
              <p className="eyebrow">01 · Arrive</p>
              <h3>Imagine your first afternoon</h3>
              <p>Start with the setting: an adults-only Cancun retreat designed around a more relaxed, polished getaway. Take in the resort view and decide whether this is the atmosphere you want.</p>
              <button type="button" className="button button-secondary" onClick={() => setPhotoOpen(true)}>Enlarge Resort Photo</button>
            </div>
          </div>
          <div className="leblanc-tour-grid">
            <article id="tour-room">
              <p className="eyebrow">02 · Unpack</p>
              <h3>Find the room that feels right</h3>
              <p>Think about your preferred view, room layout and sleeping arrangements. Categories and views differ, so ask us to compare options available for your dates.</p>
              <a className="text-link" href={quoteHref}>Ask about room options →</a>
            </article>
            <article id="tour-experiences">
              <p className="eyebrow">03 · Explore</p>
              <h3>Make the days your own</h3>
              <p>Would you spend more time by the pool, enjoying dining experiences or relaxing at the spa? We can confirm the latest dining, wellness and activity details.</p>
              <a className="text-link" href={quoteHref}>Explore amenities with an advisor →</a>
            </article>
            <article id="tour-fit">
              <p className="eyebrow">04 · Decide</p>
              <h3>Is Le Blanc Cancun your match?</h3>
              <p><strong>Best suited to:</strong> adults who want a couples-focused, quieter luxury vacation.</p>
              <p><strong>Consider another resort:</strong> if you're traveling with children or want a family-activity-centered stay.</p>
              <a className="text-link" href="/journal/le-blanc-cancun-vs-le-blanc-los-cabos">Compare Le Blanc resorts →</a>
            </article>
          </div>
          <div className="leblanc-tour-cta">
            <div><h3>Ready to picture your stay?</h3><p>Share your dates and priorities for a personalized resort recommendation.</p></div>
            <a className="button button-primary" href={quoteHref}>Get My Free Vacation Quote</a>
          </div>
        </section>
      )}


      {["moon-palace-the-grand-cancun", "moon-palace-cancun", "moon-palace-jamaica"].includes(property.slug) && (
        <section className="property-details leblanc-tour" aria-labelledby="moon-palace-tour-heading">
          <div className="section-heading section-heading-stack">
            <p className="eyebrow">Explore Your Resort</p>
            <h2 id="moon-palace-tour-heading">Picture your Moon Palace vacation</h2>
            <p>Explore the setting, accommodations, family activities and practical details that help you choose the right Moon Palace resort.</p>
          </div>
          <nav className="leblanc-tour-nav" aria-label="Explore this resort">
            <a href="#moon-tour-arrival">Arrive</a>
            <a href="#moon-tour-room">Stay</a>
            <a href="#moon-tour-fun">Explore</a>
            <a href="#moon-tour-fit">Compare</a>
          </nav>
          <div className="leblanc-tour-feature" id="moon-tour-arrival">
            <img src={property.image_url || ""} alt={property.name + " resort photography"} loading="lazy" decoding="async" />
            <div>
              <p className="eyebrow">01 · Arrive</p>
              <h3>See the setting for your stay</h3>
              <p>{property.description} Imagine the pace of your first day and whether the resort feels right for everyone traveling.</p>
              <button type="button" className="button button-secondary" onClick={() => setPhotoOpen(true)}>Enlarge Resort Photo</button>
            </div>
          </div>
          <div className="leblanc-tour-grid">
            <article id="moon-tour-room">
              <p className="eyebrow">02 · Settle In</p>
              <h3>Find room options for your group</h3>
              <p>Compare room configurations, sleeping arrangements, and location within the resort. Ask about connecting rooms or larger accommodations if your party needs extra space.</p>
              <a className="text-link" href={quoteHref}>Compare rooms for my dates →</a>
            </article>
            <article id="moon-tour-fun">
              <p className="eyebrow">03 · Enjoy</p>
              <h3>Plan the days around your travelers</h3>
              <p>Review pools, dining, entertainment and age-appropriate activities. Availability, fees and access privileges depend on the resort and booking terms; we'll help confirm the details.</p>
              <a className="text-link" href={quoteHref}>Ask about included experiences →</a>
            </article>
            <article id="moon-tour-fit">
              <p className="eyebrow">04 · Choose</p>
              <h3>Is this your best match?</h3>
              <p><strong>Especially worth considering:</strong> {property.perfectFor.join(", ")}.</p>
              <p>Compare total costs, walking distances, beach conditions and which amenities your reservation includes before choosing.</p>
              <a className="text-link" href="/journal/moon-palace-the-grand-vs-moon-palace-cancun">Compare Cancun Moon Palace options →</a>
            </article>
          </div>
          <div className="leblanc-tour-cta">
            <div><h3>Let's find your family's best fit</h3><p>Get resort options matched to your dates, travelers and priorities.</p></div>
            <a className="button button-primary" href={quoteHref}>Get My Free Vacation Quote</a>
          </div>
        </section>
      )}

      <section className="property-details resort-conversion" aria-labelledby="resort-conversion-heading">
        <div className="section-heading section-heading-stack">
          <p className="eyebrow">Find Your Perfect Stay</p>
          <h2 id="resort-conversion-heading">Is {property.name} right for your vacation?</h2>
          <p>Explore what makes this resort appealing, then let us help you compare options and get a personalized quote for your dates.</p>
        </div>
        <div className="property-detail-grid">
          <article className="planning-card">
            <h3>Best for</h3>
            <p>{property.perfectFor.join(" · ")}</p>
          </article>
          <article className="planning-card">
            <h3>What stands out</h3>
            <p>{property.highlight}</p>
          </article>
          <article className="planning-card">
            <h3>What we'll confirm</h3>
            <p>Room options, current pricing, available amenities and inclusions for your travel dates.</p>
          </article>
        </div>
        <div className="leblanc-tour-cta">
          <div>
            <h3>Ready to explore your options?</h3>
            <p>Tell us a little about your trip. We'll help you find the right fit with no obligation to book.</p>
          </div>
          <a className="button button-primary" href={quoteHref}>Get My Free Vacation Quote</a>
        </div>
      </section>

      {source === "fallback" ? (
        <section className="property-details">
          <div className="planning-card">
            <h3>Preview mode</h3>
            <p>This property is using curated fallback content because the live database was unavailable during this request.</p>
          </div>
        </section>
      ) : null}

      <section className="property-details">
        <div className="section-heading section-heading-stack">
          <div>
            <p className="eyebrow">Why Travelers Choose It</p>
            <h2>A sharper picture of the stay experience</h2>
          </div>
        </div>

        <div className="property-detail-grid">
          <article className="planning-card">
            <h3>Best for</h3>
            <p>{property.highlight}</p>
          </article>
          <article className="planning-card">
            <h3>Trip style</h3>
            <p>{property.tripStyle}</p>
          </article>
          <article className="planning-card">
            <h3>Perfect for</h3>
            <p>{property.perfectFor.join(" · ")}</p>
          </article>
        </div>
      </section>

      {comparisonLinks.length > 0 ? (
        <section className="property-details" aria-label="Resort comparison guides">
          <div className="section-heading section-heading-stack">
            <div>
              <p className="eyebrow">Compare Before You Book</p>
              <h2>Find the right fit for your vacation</h2>
            </div>
          </div>
          <div className="property-detail-grid">
            {comparisonLinks.map((guide) => (
              <article className="planning-card" key={guide.href}>
                <h3>{guide.title}</h3>
                <p>Explore this guide before choosing your resort.</p>
                <a className="text-link" href={guide.href}>Read the guide</a>
              </article>
            ))}
            <article className="planning-card">
              <h3>Ready to compare prices for your trip?</h3>
              <p>Request personalized options with your resort already selected. Rates and availability are confirmed when quoted.</p>
              <a className="button button-primary" href={quoteHref}>Request a Quote</a>
            </article>
          </div>
        </section>
      ) : null}

      <section className="related-properties">
        {travelerStories.length ? (
          <>
            <div className="section-heading section-heading-stack">
              <div>
                <p className="eyebrow">Traveler Experiences</p>
                <h2>Real trips at {property.name}</h2>
              </div>
              <a className="text-link" href="/traveler-stories">
                View all stories
              </a>
            </div>

            <div className="traveler-story-grid traveler-story-grid-compact property-story-grid">
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
                    <h3>{story.travelerName}'s {story.destination} trip</h3>
                    <p>"{story.favoriteMemory}"</p>
                    <span className="text-link">View Story -&gt;</span>
                  </div>
                </a>
              ))}
            </div>
          </>
        ) : null}

        <div className="section-heading">
          <div>
            <p className="eyebrow">Keep Exploring</p>
            <h2>More properties that fit a similar traveler</h2>
          </div>
        </div>

        <div className="portfolio-grid">
          {related.map((candidate) => (
            <article key={candidate.slug} className="portfolio-card">
              <div className="portfolio-image-shell">
                <img
                  className="destination-image"
                  src={candidate.image_url || ""}
                  alt={candidate.name}
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 1100px) 100vw, 25vw"
                />
              </div>
              <div className="portfolio-meta">
                <span className="feature-badge">{candidate.tag}</span>
                <p className="card-region">{candidate.location}</p>
              </div>
              <h3>{candidate.name}</h3>
              <p>{candidate.highlight}</p>
              <div className="card-actions card-actions-inline">
                <a className="button button-secondary" href={`/properties/${candidate.slug}`}>
                  View property
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
