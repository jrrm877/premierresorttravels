export type ResortImageCategory = "hero" | "rooms" | "pools" | "beach" | "dining" | "activities" | "spa" | "weddings" | "family" | "maps" | "logos";
export type ResortImageRegistry = Record<string, Record<ResortImageCategory, string[]>>;

export const resortImages = {
  "moon-palace-cancun": {
    "hero": [],
    "rooms": [],
    "pools": [],
    "beach": [],
    "dining": [],
    "activities": [],
    "spa": [],
    "weddings": [],
    "family": [],
    "maps": [],
    "logos": []
  },
  "moon-palace-jamaica": {
    "hero": [],
    "rooms": [],
    "pools": [],
    "beach": [],
    "dining": [],
    "activities": [],
    "spa": [],
    "weddings": [],
    "family": [],
    "maps": [],
    "logos": []
  },
  "le-blanc-cancun": {
    "hero": [],
    "rooms": [],
    "pools": [],
    "beach": [],
    "dining": [],
    "activities": [],
    "spa": [],
    "weddings": [],
    "family": [],
    "maps": [],
    "logos": []
  },
  "le-blanc-los-cabos": {
    "hero": [],
    "rooms": [],
    "pools": [],
    "beach": [],
    "dining": [],
    "activities": [],
    "spa": [],
    "weddings": [],
    "family": [],
    "maps": [],
    "logos": []
  },
  "le-blanc-jamaica": {
    "hero": [],
    "rooms": [],
    "pools": [],
    "beach": [],
    "dining": [],
    "activities": [],
    "spa": [],
    "weddings": [],
    "family": [],
    "maps": [],
    "logos": []
  },
  "baglioni": {
    "hero": [],
    "rooms": [],
    "pools": [],
    "beach": [],
    "dining": [],
    "activities": [],
    "spa": [],
    "weddings": [],
    "family": [],
    "maps": [],
    "logos": []
  },
  "palace-resorts": {
    "hero": [],
    "rooms": [],
    "pools": [],
    "beach": [],
    "dining": [],
    "activities": [],
    "spa": [],
    "weddings": [],
    "family": [],
    "maps": [],
    "logos": []
  }
} as const satisfies ResortImageRegistry;
