import type { Route } from "./+types/legacy-moon-palace-cancun-redirect";

export function loader({ request }: Route.LoaderArgs) {
  const source = new URL(request.url);
  const destination = new URL("/properties/moon-palace-cancun", source.origin);
  destination.search = source.search;
  return Response.redirect(destination.toString(), 301);
}
