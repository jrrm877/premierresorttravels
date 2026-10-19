import type { Route } from "./+types/legacy-wedding-redirect";

export function loader({ request }: Route.LoaderArgs) {
  const source = new URL(request.url);
  const destination = new URL("/collections/destination-weddings", source.origin);
  destination.search = source.search;
  return Response.redirect(destination.toString(), 301);
}
