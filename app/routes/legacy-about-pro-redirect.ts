import type { Route } from "./+types/legacy-about-pro-redirect";

export function loader({ request }: Route.LoaderArgs) {
  const source = new URL(request.url);
  const destination = new URL("/about", source.origin);
  destination.hash = "editorial-standards";
  destination.search = source.search;
  return Response.redirect(destination.toString(), 301);
}
