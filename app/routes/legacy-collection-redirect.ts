import { findCollectionBySlug } from "../data/collections";
import type { Route } from "./+types/legacy-collection-redirect";

export function loader({ params, request }: Route.LoaderArgs) {
  const collection = findCollectionBySlug(params.slug);
  if (!collection) {
    throw new Response("Not Found", { status: 404 });
  }

  const url = new URL(request.url);
  const destination = new URL(`/collections/${collection.slug}`, url.origin);
  destination.search = url.search;
  return Response.redirect(destination.toString(), 301);
}
