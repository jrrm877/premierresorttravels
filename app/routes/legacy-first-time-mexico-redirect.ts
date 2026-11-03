import type { Route } from "./+types/legacy-first-time-mexico-redirect";

export function loader({ request }: Route.LoaderArgs) {
  const source = new URL(request.url);
  const destination = new URL("/journal/best-first-all-inclusive-resort-vacation", source.origin);
  destination.search = source.search;
  return Response.redirect(destination.toString(), 301);
}
