import type { Route } from "./+types/legacy-trip-type-redirect";

const redirects: Record<string, string> = {
  "adults-only": "/collections/adults-only",
  family: "/collections/family-friendly",
  europe: "/collections/european-luxury",
  romance: "/collections/romantic-getaways",
  "spa-wellness": "/collections/spa-wellness",
  "food-drink": "/journal/best-all-inclusive-resorts-for-food-lovers",
  adventure: "/collections/adventure",
  wedding: "/collections/destination-weddings",
};

export function loader({ params, request }: Route.LoaderArgs) {
  const path = params.slug ? redirects[params.slug] : undefined;
  if (!path) throw new Response("Not Found", { status: 404 });

  const source = new URL(request.url);
  const destination = new URL(path, source.origin);
  destination.search = source.search;
  return Response.redirect(destination.toString(), 301);
}
