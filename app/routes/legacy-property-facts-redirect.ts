import { findPropertyBySlug } from "../lib/property-data";
import type { Route } from "./+types/legacy-property-facts-redirect";

export function loader({ params, request }: Route.LoaderArgs) {
  const property = params.slug ? findPropertyBySlug(params.slug) : undefined;
  if (!property) {
    throw new Response("Not Found", { status: 404 });
  }

  const source = new URL(request.url);
  const destination = new URL(`/properties/${property.slug}`, source.origin);
  destination.search = source.search;
  return Response.redirect(destination.toString(), 301);
}
