import type { Route } from "./+types/legacy-resource-redirect";

const redirects: Record<string, string> = {
  "mexico-seaweed-sargassum-guide": "/journal/mexico-seaweed-sargassum-guide",
};

export function loader({ params, request }: Route.LoaderArgs) {
  const path = params.slug ? redirects[params.slug] : undefined;
  if (!path) throw new Response("Not Found", { status: 404 });

  const source = new URL(request.url);
  const destination = new URL(path, source.origin);
  destination.search = source.search;
  return Response.redirect(destination.toString(), 301);
}
