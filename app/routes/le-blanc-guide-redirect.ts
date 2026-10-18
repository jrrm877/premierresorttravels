import type { Route } from "./+types/le-blanc-guide-redirect";

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const destination = new URL("/journal/le-blanc-cancun-vs-le-blanc-los-cabos", url.origin);
  destination.search = url.search;
  return Response.redirect(destination.toString(), 301);
}
