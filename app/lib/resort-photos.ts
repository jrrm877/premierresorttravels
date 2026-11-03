export const photoCategories = ["rooms", "pools", "beach", "dining", "activities", "spa", "weddings", "family", "facilities", "other"] as const;
export type ResortPhoto = { key: string; category: string; alt: string; url: string; published: boolean };

// Cloudflare R2 can return custom metadata with the list response. The
// installed Workers types predate the `include` option even though the runtime
// supports it, so keep the compatibility cast isolated here.
type R2ListOptionsWithMetadata = R2ListOptions & {
  include: ["customMetadata"];
};

export async function listResortPhotos(bucket: R2Bucket, slug: string, publicOnly = false): Promise<ResortPhoto[]> {
  const photos: ResortPhoto[] = [];
  let cursor: string | undefined;
  do {
    const page = await bucket.list({
      prefix: `resorts/${slug}/`,
      cursor,
      limit: 500,
      include: ["customMetadata"],
    } as R2ListOptionsWithMetadata);
    for (const listed of page.objects) {
      const published = listed.customMetadata?.published === "true";
      if (publicOnly && !published) continue;
      const category = listed.customMetadata?.category || listed.key.split("/")[2] || "other";
      const originalName = listed.customMetadata?.originalName || "";
      const decodedName = (() => { try { return decodeURIComponent(originalName); } catch { return originalName; } })();
      const alt = decodedName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim() || `${slug.replace(/-/g, " ")} ${category}`;
      photos.push({ key: listed.key, category, alt, url: `/resort-photo?key=${encodeURIComponent(listed.key)}`, published });
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  return photos.sort((a, b) => a.key.localeCompare(b.key));
}
