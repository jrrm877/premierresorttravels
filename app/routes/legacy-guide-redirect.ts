import type { Route } from "./+types/legacy-guide-redirect";

const redirects: Record<string, string> = {
  "palace-resort-match": "/collections/palace-resorts",
  "destination-wedding-inquiry": "/collections/destination-weddings",
};

export function loader({ params, request }: Route.LoaderArgs) {
  const path = params.slug ? redirects[params.slug] : undefined;
  if (!path) throw new Response("Not Found", { status: 404 });

  const source = new URL(request.url);
  const destination = new URL(path, source.origin);
  destination.search = source.search;
  return Response.redirect(destination.toString(), 301);
}
