import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("api/search", "routes/api.search.ts"),
  route("api/inquiry", "routes/api.inquiry.ts"),
  route("advisor/inquiries", "routes/advisor.inquiries.tsx"),
  route("advisor/properties", "routes/advisor.properties.tsx"),
  route("about", "routes/about.tsx"),
  route("destinations", "routes/destinations.tsx"),
  route("collections", "routes/collections.tsx"),
  route("collections/:slug", "routes/collection.tsx"),
  route("journal", "routes/journal-index.tsx"),
  route("journal/:slug", "routes/journal.tsx"),
  route("properties/:slug", "routes/property.tsx"),
  route("traveler-stories", "routes/traveler-stories.tsx"),
  route("traveler-stories/:slug", "routes/traveler-story.tsx"),
];
