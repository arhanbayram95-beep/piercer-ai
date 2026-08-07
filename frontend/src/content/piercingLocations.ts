import { TranslationKey } from '../i18n/translations';

// Shared piercing-location catalog — the source of truth for both
// PiercingLocationScreen's picker (frontend/src/screens/PiercingLocationScreen.tsx)
// and, per the product brief, a future piercing-reference/info page that
// will want the same list of names/IDs without duplicating it. Deliberately
// kept to just id/category/label for now — pain-rating or description
// copy is pending a separate product decision on tone/source, don't add it
// here speculatively.
export type PiercingCategory = 'ear' | 'face' | 'body';

export const PIERCING_LOCATION_IDS = [
  'lobe',
  'helix',
  'tragus',
  'rook',
  'daith',
  'industrial',
  'septum',
  'eyebrow',
  'nipple',
  'navel',
] as const;

export type PiercingLocationId = (typeof PIERCING_LOCATION_IDS)[number];

export interface PiercingLocation {
  id: PiercingLocationId;
  category: PiercingCategory;
  labelKey: TranslationKey;
}

export const PIERCING_LOCATIONS: PiercingLocation[] = [
  { id: 'lobe', category: 'ear', labelKey: 'location.lobe' },
  { id: 'helix', category: 'ear', labelKey: 'location.helix' },
  { id: 'tragus', category: 'ear', labelKey: 'location.tragus' },
  { id: 'rook', category: 'ear', labelKey: 'location.rook' },
  { id: 'daith', category: 'ear', labelKey: 'location.daith' },
  { id: 'industrial', category: 'ear', labelKey: 'location.industrial' },
  { id: 'septum', category: 'face', labelKey: 'location.septum' },
  { id: 'eyebrow', category: 'face', labelKey: 'location.eyebrow' },
  { id: 'nipple', category: 'body', labelKey: 'location.nipple' },
  { id: 'navel', category: 'body', labelKey: 'location.navel' },
];

export const PIERCING_CATEGORIES: PiercingCategory[] = ['ear', 'face', 'body'];

export const PIERCING_CATEGORY_LABEL_KEYS: Record<PiercingCategory, TranslationKey> = {
  ear: 'location.category.ear',
  face: 'location.category.face',
  body: 'location.category.body',
};

export function piercingLocationsByCategory(category: PiercingCategory): PiercingLocation[] {
  return PIERCING_LOCATIONS.filter((location) => location.category === category);
}
