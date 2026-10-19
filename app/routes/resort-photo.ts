import { fallbackProperties } from "../lib/catalog";
import type { Route } from "./+types/resort-photo";

export async function loader({ request, context }: Route.LoaderArgs) {
  const key = new URL(request.url).searchParams.get("key") ?? "";
  const parts = key.split("/");
  if (parts.length !== 4 || parts[0] !== "resorts" || !fallbackProperties().some(p => p.slug === parts[1]) || !/^[a-z]+$/.test(parts[2]) || !/^[a-f0-9-]+\.(jpg|png|webp|avif)$/.test(parts[3])) {
    throw new Response("Not Found", { status: 404 });
  }
  const bucket = context.cloudflare.env.RESORT_PHOTOS;
  if (!bucket) throw new Response("Unavailable", { status: 503 });
  const object = await bucket.get(key);
  if (!object || object.customMetadata?.published !== "true") throw new Response("Not Found", { status: 404 });
  return new Response(object.body, { headers: {
    "Content-Type": object.httpMetadata?.contentType || "application/octet-stream",
    "Cache-Control": "public, max-age=300",
    "X-Content-Type-Options": "nosniff",
  } });
}
