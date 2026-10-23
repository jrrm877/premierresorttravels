import { useState } from "react";
import { useFetcher } from "react-router";
import { requireAdvisorAccess } from "../lib/advisor-access";
import { fallbackProperties } from "../lib/catalog";
import { listResortPhotos, type ResortPhoto } from "../lib/resort-photos";
import type { Route } from "./+types/advisor.photo-library";

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdvisorAccess(request, context.cloudflare.env);
  const resorts = fallbackProperties().map(p => ({ slug: p.slug, name: p.name }));
  const slug = new URL(request.url).searchParams.get("resort") || resorts[0]?.slug || "";
  if (!resorts.some(p => p.slug === slug)) throw new Response("Invalid resort", { status: 400 });
  const bucket = context.cloudflare.env.RESORT_PHOTOS;
  if (!bucket) throw new Response("Photo storage unavailable", { status: 503 });
  return { resorts, slug, photos: await listResortPhotos(bucket, slug) };
}
export async function action({ request, context }: Route.ActionArgs) {
  await requireAdvisorAccess(request, context.cloudflare.env);
  const origin = request.headers.get("Origin");
  if (origin !== new URL(request.url).origin) return Response.json({ error: "Invalid origin" }, { status: 403 });
  const form = await request.formData();
  const key = String(form.get("key") || "");
  const operation = String(form.get("operation") || "publish");
  const publish = form.get("publish") === "true";
  const parts = key.split("/");
  if (parts.length !== 4 || parts[0] !== "resorts" || !fallbackProperties().some(p => p.slug === parts[1]) || !/^[a-z]+$/.test(parts[2]) || !/^[a-f0-9-]+\.(jpg|png|webp|avif)$/.test(parts[3])) return Response.json({ error: "Invalid photo" }, { status: 400 });
  const bucket = context.cloudflare.env.RESORT_PHOTOS;
  if (!bucket) return Response.json({ error: "Storage unavailable" }, { status: 503 });
  const existing = await bucket.get(key);
  if (!existing) return Response.json({ error: "Photo not found" }, { status: 404 });
  if (operation === "delete") {
    await bucket.delete(key);
    return Response.json({ ok: true, deleted: true });
  }
  if (operation !== "publish") return Response.json({ error: "Invalid operation" }, { status: 400 });
  await bucket.put(key, existing.body, { httpMetadata: existing.httpMetadata, customMetadata: { ...existing.customMetadata, published: publish ? "true" : "false" } });
  return Response.json({ ok: true, published: publish });
}
export function meta() { return [{ title: "Advisor Photo Library | Premier Resort Travels" }, { name: "robots", content: "noindex,nofollow" }]; }
function PhotoCard({ photo }: { photo: ResortPhoto }) {
  const fetcher = useFetcher();
  const pending = fetcher.state !== "idle";
  const published = typeof fetcher.data?.published === "boolean" ? fetcher.data.published : photo.published;
  const deleted = fetcher.data?.deleted === true;
  if (deleted) return null;
  return <article className="advisor-photo-card">
    {published ? <img src={photo.url} alt={photo.alt} loading="lazy" /> : <div className="advisor-photo-private">Private photo — publish to preview on site</div>}
    <div className="advisor-photo-card-body"><strong>{photo.category}</strong><p title={photo.alt}>{photo.alt}</p>
    <span>{published ? "Published" : "Private"}</span>
    <fetcher.Form method="post"><input type="hidden" name="key" value={photo.key}/><input type="hidden" name="publish" value={String(!published)}/>
      <button type="submit" className="button button-secondary" disabled={pending}>{pending ? "Saving…" : published ? "Unpublish" : "Publish photo"}</button>
    </fetcher.Form>
    <fetcher.Form method="post" onSubmit={event => { if (!window.confirm("Permanently delete this photo? This cannot be undone.")) event.preventDefault(); }}>
      <input type="hidden" name="key" value={photo.key}/><input type="hidden" name="operation" value="delete"/>
      <button type="submit" className="button button-secondary" disabled={pending}>Delete photo</button>
    </fetcher.Form>
    {fetcher.data?.error && <p role="alert">{fetcher.data.error}</p>}</div>
  </article>;
}
export default function AdvisorPhotoLibrary({ loaderData }: Route.ComponentProps) {
  const [filter, setFilter] = useState("all");
  const visible = loaderData.photos.filter(p => filter === "all" || p.category === filter);
  return <main className="page-shell"><section className="property-details">
    <p className="eyebrow">Private advisor tools</p><h1>Resort photo library</h1>
    <p>Photos stay private until you publish them. Published photos appear automatically in the matching resort gallery.</p>
    <p><a href="/advisor/photos">Upload more photos</a> · <a href={`/properties/${loaderData.slug}`}>View resort page</a></p>
    <label>Resort <select value={loaderData.slug} onChange={e => { window.location.href = `/advisor/photo-library?resort=${encodeURIComponent(e.target.value)}`; }}>{loaderData.resorts.map(p => <option key={p.slug} value={p.slug}>{p.name}</option>)}</select></label>
    <label> Category <select value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All categories</option>{Array.from(new Set(loaderData.photos.map(p => p.category))).map(c => <option key={c} value={c}>{c}</option>)}</select></label>
    <p>{visible.length} photos · {loaderData.photos.filter(p => p.published).length} published</p>
    <div className="advisor-photo-grid">{visible.map(p => <PhotoCard key={p.key} photo={p}/>)}</div>
    {!visible.length && <p>No photos in this selection yet. Upload photos to get started.</p>}
  </section></main>;
}
