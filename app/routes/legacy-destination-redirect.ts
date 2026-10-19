import type { Route } from "./+types/legacy-destination-redirect";

const destinationRedirects: Record<string, string> = {
  cancun: "/destinations",
};

export function loader({ params, request }: Route.LoaderArgs) {
  const path = params.slug ? destinationRedirects[params.slug] : undefined;
  if (!path) {
    throw new Response("Not Found", { status: 404 });
  }

  const source = new URL(request.url);
  const destination = new URL(path, source.origin);
  destination.search = source.search;
  return Response.redirect(destination.toString(), 301);
}
