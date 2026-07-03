import { APPROVED_PROPERTY_NAME_SET } from "../lib/approved-properties";
import type { Route } from "./+types/api.search";
import { upscaleResortImage } from "../lib/image-utils";

const fallbackDestinations = [
  {
    id: 1,
    name: "Le Blanc Spa Resort Cancun",
    country: "Mexico",
    region: "North America",
    description:
      "Adults-only beachfront luxury with spa rituals, polished service, and a calmer all-inclusive mood.",
    image_url:
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/637bgbt7q51510amjja22f7o2b/240?angle=0",
    price_tier: "ultra-luxury",
    tags: '["adults-only","spa","all-inclusive","beach"]',
    avg_rating: 4.9,
  },
  {
    id: 2,
    name: "Moon Palace The Grand - Cancun",
    country: "Mexico",
    region: "North America",
    description:
      "A family-forward flagship with a water park, broad dining lineup, and resort-within-a-resort energy.",
    image_url:
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/4parh4uc8p5gj5t9vpsd4n3j34/240?angle=0",
    price_tier: "ultra-luxury",
    tags: '["all-inclusive","family","water-park","cancun"]',
    avg_rating: 4.8,
  },
  {
    id: 4,
    name: "Cozumel Palace",
    country: "Mexico",
    region: "North America",
    description:
      "An island retreat known for reef access, easygoing luxury, and standout appeal for divers and snorkelers.",
    image_url:
      "https://thepalacecompany.canto.com/rest/v/PalaceProAgents/binary/image/rv80jfunu95dtd5g2ntg7thb34/240?angle=0",
    price_tier: "luxury",
    tags: '["all-inclusive","diving","snorkeling","beach"]',
    avg_rating: 4.7,
  },
];

export async function loader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query =
    url.searchParams
      .getAll("q")
      .map((value) => value.trim())
      .filter(Boolean)
      .at(-1) ?? "";
  const region = url.searchParams.get("region")?.trim();
  const tier = url.searchParams.get("tier")?.trim() || "luxury";

  try {
    const { DB } = context.cloudflare.env;
    const whereClauses = ["price_tier = ?"];
    const bindings: Array<string> = [tier];

    if (query) {
      whereClauses.push("(name LIKE ? OR country LIKE ? OR description LIKE ? OR tags LIKE ?)");
      bindings.push(`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`);
    }

    if (region) {
      whereClauses.push("region = ?");
      bindings.push(region);
    }

    const statement = DB.prepare(
      `SELECT *
       FROM destinations
       WHERE ${whereClauses.join(" AND ")}
       ORDER BY avg_rating DESC, name ASC
       LIMIT 20`
    );

    const { results } = await statement.bind(...bindings).all();

    return Response.json({
      destinations: results
        .filter((destination) => APPROVED_PROPERTY_NAME_SET.has(destination.name))
        .map((destination) => ({
          ...destination,
          image_url: upscaleResortImage(destination.image_url),
        })),
      query,
      region: region ?? "",
      tier,
      mode: "database",
    });
  } catch (error) {
    const lowerQuery = query.toLowerCase();
    const filtered = fallbackDestinations.filter((destination) => {
      if (destination.price_tier !== tier) return false;
      if (region && destination.region !== region) return false;
      if (!lowerQuery) return true;

      const haystack = [
        destination.name,
        destination.country,
        destination.description,
        destination.tags,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(lowerQuery);
    });

    return Response.json({
      destinations: filtered.map((destination) => ({
        ...destination,
        image_url: upscaleResortImage(destination.image_url),
      })),
      query,
      region: region ?? "",
      tier,
      mode: "fallback",
      warning:
        error instanceof Error
          ? "Live database is not ready yet, so preview results are using built-in sample data."
          : "Live database is not ready yet, so preview results are using built-in sample data.",
    });
  }
}
