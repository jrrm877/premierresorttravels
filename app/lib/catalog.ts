import { APPROVED_PROPERTY_NAME_SET } from "./approved-properties";
import { allProperties, findPropertyBySlug } from "./property-data";
import { upscaleResortImage } from "./image-utils";

export type DestinationRecord = {
  id: number;
  name: string;
  country: string;
  region: string | null;
  description: string | null;
  image_url: string | null;
  price_tier: string;
  tags: string | null;
  avg_rating: number | null;
};

export type EnrichedProperty = DestinationRecord & {
  slug: string;
  brand: string;
  location: string;
  highlight: string;
  tag: string;
  tripStyle: string;
  perfectFor: string[];
};

export function slugifyPropertyName(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function enrichDestination(destination: DestinationRecord): EnrichedProperty {
  const fallback = findPropertyBySlug(slugifyPropertyName(destination.name));

  return {
    ...destination,
    slug: fallback?.slug ?? slugifyPropertyName(destination.name),
    brand: fallback?.brand ?? "Luxury Collection",
    location: fallback?.location ?? `${destination.country}${destination.region ? ` · ${destination.region}` : ""}`,
    highlight: fallback?.highlight ?? destination.description ?? "Luxury stay details coming soon.",
    tag: fallback?.tag ?? destination.price_tier,
    tripStyle: fallback?.tripStyle ?? "Luxury Escape",
    perfectFor: fallback?.perfectFor ?? ["Luxury travel", "Tailored escapes"],
    image_url: upscaleResortImage(destination.image_url),
  };
}

export async function fetchDestinationsFromDb(DB: D1Database) {
  const { results } = await DB.prepare(
    `SELECT id, name, country, region, description, image_url, price_tier, tags, avg_rating
     FROM destinations
     ORDER BY avg_rating DESC, name ASC`
  ).all<DestinationRecord>();

  return (results ?? [])
    .filter((destination) => APPROVED_PROPERTY_NAME_SET.has(destination.name))
    .map(enrichDestination);
}

export async function fetchPropertyBySlug(DB: D1Database, slug: string) {
  const destinations = await fetchDestinationsFromDb(DB);
  return destinations.find((destination) => destination.slug === slug) ?? null;
}

export function fallbackProperties() {
  return allProperties
    .filter((property) => APPROVED_PROPERTY_NAME_SET.has(property.name))
    .map((property, index) => ({
    id: index + 1,
    name: property.name,
    country: property.country,
    region: property.region,
    description: property.description,
    image_url: property.image,
    price_tier: "luxury",
    tags: JSON.stringify(property.perfectFor),
    avg_rating: null,
    slug: property.slug,
    brand: property.brand,
    location: property.location,
    highlight: property.highlight,
    tag: property.tag,
    tripStyle: property.tripStyle,
    perfectFor: property.perfectFor,
    }));
}
