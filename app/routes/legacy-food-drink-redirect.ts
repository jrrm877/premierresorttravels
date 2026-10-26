import type { Route } from "./+types/legacy-food-drink-redirect";

export function loader({ request }: Route.LoaderArgs) {
  const original = new URL(request.url);
  const target = new URL("/journal/best-all-inclusive-resorts-for-food-lovers", original.origin);
  target.search = original.search;
  return Response.redirect(target.toString(), 301);
}
