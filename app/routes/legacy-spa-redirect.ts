import type { Route } from "./+types/legacy-spa-redirect";

export function loader({ request }: Route.LoaderArgs) {
  const original = new URL(request.url);
  const target = new URL("/journal/best-spa-resorts-for-couples-in-mexico", original.origin);
  return Response.redirect(target.toString(), 301);
}
