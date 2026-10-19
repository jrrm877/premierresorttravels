import { useState, type ChangeEvent, type DragEvent } from "react";
import { requireAdvisorAccess } from "../lib/advisor-access";
import { fallbackProperties } from "../lib/catalog";
import type { Route } from "./+types/advisor.photos";

const categories = ["rooms", "pools", "beach", "dining", "activities", "spa", "weddings", "family", "facilities", "other"];
const maxImageBytes = 12 * 1024 * 1024;

export async function loader({ request, context }: Route.LoaderArgs) {
  await requireAdvisorAccess(request, context.cloudflare.env);
  return { resorts: fallbackProperties().map(p => ({ slug: p.slug, name: p.name })) };
}

export async function action({ request, context }: Route.ActionArgs) {
  await requireAdvisorAccess(request, context.cloudflare.env);
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (origin !== url.origin) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  const bucket = context.cloudflare.env.RESORT_PHOTOS;
  if (!bucket) return Response.json({ error: "Photo storage is not configured." }, { status: 503 });
  const resort = url.searchParams.get("resort") ?? "";
  const category = url.searchParams.get("category") ?? "";
  if (!fallbackProperties().some(p => p.slug === resort) || !categories.includes(category)) {
    return Response.json({ error: "Choose a valid resort and category." }, { status: 400 });
  }
  const type = request.headers.get("Content-Type") ?? "";
  if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(type)) {
    return Response.json({ error: "Only JPEG, PNG, WebP and AVIF images are supported." }, { status: 415 });
  }
  const length = Number(request.headers.get("Content-Length") ?? 0);
  if (length > maxImageBytes) return Response.json({ error: "Image exceeds 12 MB." }, { status: 413 });
  const data = await request.arrayBuffer();
  if (!data.byteLength || data.byteLength > maxImageBytes) return Response.json({ error: "Image is empty or exceeds 12 MB." }, { status: 413 });
  const ext = type === "image/jpeg" ? "jpg" : type.split("/")[1];
  const key = `resorts/${resort}/${category}/${crypto.randomUUID()}.${ext}`;
  await bucket.put(key, data, { httpMetadata: { contentType: type }, customMetadata: { resort, category, originalName: (request.headers.get("X-Photo-Name") ?? "").slice(0, 200) } });
  return Response.json({ key }, { headers: { "Cache-Control": "no-store" } });
}

export function meta() {
  return [{ title: "Photo Import | Premier Resort Travel" }, { name: "robots", content: "noindex, nofollow" }];
}

export default function AdvisorPhotos({ loaderData }: Route.ComponentProps) {
  const [resort, setResort] = useState(loaderData.resorts[0]?.slug ?? "");
  const [category, setCategory] = useState("rooms");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  async function addFiles(incoming: FileList | File[]) {
    const { default: JSZip } = await import("jszip");
    const selected: File[] = [];
    const problems: string[] = [];
    for (const file of Array.from(incoming)) {
      if (/\.zip$/i.test(file.name)) {
        try {
          const zip = await JSZip.loadAsync(file);
          for (const entry of Object.values(zip.files)) {
            if (entry.dir || entry.name.startsWith("__MACOSX/") || /(^|\/)\./.test(entry.name)) continue;
            const name = entry.name.split("/").pop() ?? "";
            const mime = mimeFor(name);
            if (!mime) continue;
            const blob = await entry.async("blob");
            if (blob.size > maxImageBytes) { problems.push(`${name}: over 12 MB`); continue; }
            selected.push(new File([blob], name, { type: mime }));
            if (selected.length >= 250) break;
          }
        } catch { problems.push(`${file.name}: ZIP could not be opened`); }
      } else if (mimeFor(file.name) && file.size <= maxImageBytes) {
        selected.push(new File([file], file.name, { type: mimeFor(file.name) }));
      } else {
        problems.push(`${file.name}: unsupported format or over 12 MB`);
      }
      if (selected.length >= 250) { problems.push("Limit: 250 photos per batch."); break; }
    }
    setFiles(selected);
    setDone(0);
    setErrors(problems);
  }
  function mimeFor(name: string) {
    const ext = name.toLowerCase().split(".").pop();
    return ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "avif" ? "image/avif" : "";
  }
  async function upload() {
    setBusy(true); setDone(0);
    const problems: string[] = [];
    let completed = 0;
    for (const file of files) {
      try {
        const params = new URLSearchParams({ resort, category });
        const response = await fetch(`/advisor/photos?${params}`, { method: "POST", headers: { "Content-Type": file.type, "X-Photo-Name": encodeURIComponent(file.name) }, body: file });
        if (!response.ok) {
          const result = await response.json() as { error?: string };
          throw new Error(result.error ?? `HTTP ${response.status}`);
        }
        completed++; setDone(completed);
      } catch (error) { problems.push(`${file.name}: ${error instanceof Error ? error.message : "Upload failed"}`); }
    }
    setErrors(problems); setBusy(false);
    if (!problems.length) setFiles([]);
  }
  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault(); setDragging(false);
    if (!busy) void addFiles(event.dataTransfer.files);
  }
  function choose(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) void addFiles(event.target.files);
  }
  return <main className="page-shell"><section className="property-details" style={{ maxWidth: 850, margin: "3rem auto" }}>
    <p className="eyebrow">Private advisor tools</p>
    <h1>Import resort photography</h1>
    <p>Drag a Canto ZIP or individual resort photos here. Images are stored privately until a gallery publishing workflow is enabled.</p>
    <div style={{ display: "grid", gap: 16, marginBottom: 20 }}>
      <label>Resort <select value={resort} onChange={e => setResort(e.target.value)} disabled={busy}>{loaderData.resorts.map(p => <option key={p.slug} value={p.slug}>{p.name}</option>)}</select></label>
      <label>Photo category <select value={category} onChange={e => setCategory(e.target.value)} disabled={busy}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></label>
    </div>
    <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={drop} style={{ border: "2px dashed currentColor", borderRadius: 16, padding: 32, background: dragging ? "rgba(0,0,0,.06)" : "transparent" }}>
      <p><strong>Drop ZIP files or photos here</strong></p>
      <input aria-label="Choose photo ZIP or images" type="file" accept=".zip,image/jpeg,image/png,image/webp,image/avif" multiple onChange={choose} disabled={busy} />
    </div>
    <p role="status">{files.length ? `${files.length} photos ready · ${done} uploaded` : done ? `${done} photos uploaded to private storage` : "No photos selected"}</p>
    <button className="button button-primary" type="button" onClick={() => void upload()} disabled={busy || !files.length || !resort}>{busy ? `Uploading ${done} of ${files.length}…` : `Upload ${files.length} photos`}</button>
    {errors.length > 0 && <div role="alert"><h2>Items needing attention</h2><ul>{errors.slice(0, 20).map((e, i) => <li key={i}>{e}</li>)}</ul></div>}
    <p><a href="/advisor/properties">Return to advisor properties</a></p>
  </section></main>;
}
