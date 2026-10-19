export const photoCategories = ["rooms", "pools", "beach", "dining", "activities", "spa", "weddings", "family", "facilities", "other"] as const;
export type ResortPhoto = { key: string; category: string; alt: string; url: string; published: boolean };
export async function listResortPhotos(bucket: R2Bucket, slug: string, publicOnly = false): Promise<ResortPhoto[]> {
  const photos: ResortPhoto[] = [];
  let cursor: string | undefined;
  do {
    const page = await bucket.list({ prefix: `resorts/${slug}/`, cursor, limit: 500 });
    for (const listed of page.objects) {
      // R2 list does not expose custom metadata in the installed Worker types.
      const object = await bucket.head(listed.key);
      if (!object) continue;
      const published = object.customMetadata?.published === "true";
      if (publicOnly && !published) continue;
      const category = object.customMetadata?.category || object.key.split("/")[2] || "other";
      const originalName = object.customMetadata?.originalName || "";
      const decodedName = (() => { try { return decodeURIComponent(originalName); } catch { return originalName; } })();
      const alt = decodedName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim() || `${slug.replace(/-/g, " ")} ${category}`;
      photos.push({ key: object.key, category, alt, url: `/resort-photo?key=${encodeURIComponent(object.key)}`, published });
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  return photos.sort((a, b) => a.key.localeCompare(b.key));
}
