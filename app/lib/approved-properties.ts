export const APPROVED_PROPERTY_NAMES = [
  "Beach Palace",
  "Cozumel Palace",
  "Playacar Palace",
  "Sun Palace",
  "Moon Palace Cancun",
  "Moon Palace The Grand - Cancun",
  "Moon Palace Jamaica",
  "Moon Palace The Grand - Punta Cana",
  "Le Blanc Spa Resort Cancun",
  "Le Blanc Spa Resort Los Cabos",
  "Turks & Caicos",
  "Baglioni Hotel Regina",
  "Baglioni Hotel Luna",
  "Casa Baglioni",
  "Palazzo Firenze",
  "Baglioni Resort Maldives",
  "Baglioni Masseria Muzza Resort & Spa",
  "Baglioni Resort Sardinia",
  "Baglioni Hotel London",
] as const;

export const APPROVED_PROPERTY_NAME_SET = new Set<string>(APPROVED_PROPERTY_NAMES);
