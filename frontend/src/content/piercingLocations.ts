import { TranslationKey } from '../i18n/translations';

// Shared piercing-location catalog — the source of truth for both
// PiercingLocationScreen's picker (frontend/src/screens/PiercingLocationScreen.tsx)
// and PiercingReferenceScreen's terminology/pain reference. `painRating` is
// a general, industry-consensus 1-10 estimate (1 = mildest, 10 = most
// intense) — NOT a medical claim; see PiercingReferenceScreen for the
// visible on-page framing copy that says so (deliberately not just a code
// comment, since this is user-facing content making an implicit claim).
// Non-genital scope only, matching the app's existing jewelry catalog
// (studioSlice.ts's JEWELRY_TYPES has no genital-piercing support either).
export type PiercingCategory = 'ear' | 'face' | 'body';

export const PIERCING_LOCATION_IDS = [
  'lobe',
  'upperLobe',
  'helix',
  'forwardHelix',
  'tragus',
  'antiTragus',
  'rook',
  'daith',
  'conch',
  'snug',
  'industrial',
  'orbital',
  'eyebrow',
  'bridge',
  'nostril',
  'highNostril',
  'septum',
  'philtrumMedusa',
  'labret',
  'monroe',
  'tongue',
  'cheekDimple',
  'navel',
  'nipple',
  'surface',
  'dermal',
] as const;

export type PiercingLocationId = (typeof PIERCING_LOCATION_IDS)[number];

export interface PiercingLocation {
  id: PiercingLocationId;
  category: PiercingCategory;
  labelKey: TranslationKey;
  // General estimate per the reference page's pain-scale framing — see the
  // module comment above.
  painRating: number;
  descriptionKey: TranslationKey;
}

export const PIERCING_LOCATIONS: PiercingLocation[] = [
  // Ear
  { id: 'lobe', category: 'ear', labelKey: 'location.lobe', painRating: 2, descriptionKey: 'location.desc.lobe' },
  {
    id: 'upperLobe',
    category: 'ear',
    labelKey: 'location.upperLobe',
    painRating: 3,
    descriptionKey: 'location.desc.upperLobe',
  },
  { id: 'helix', category: 'ear', labelKey: 'location.helix', painRating: 5, descriptionKey: 'location.desc.helix' },
  {
    id: 'forwardHelix',
    category: 'ear',
    labelKey: 'location.forwardHelix',
    painRating: 5,
    descriptionKey: 'location.desc.forwardHelix',
  },
  {
    id: 'tragus',
    category: 'ear',
    labelKey: 'location.tragus',
    painRating: 5,
    descriptionKey: 'location.desc.tragus',
  },
  {
    id: 'antiTragus',
    category: 'ear',
    labelKey: 'location.antiTragus',
    painRating: 6,
    descriptionKey: 'location.desc.antiTragus',
  },
  { id: 'rook', category: 'ear', labelKey: 'location.rook', painRating: 6, descriptionKey: 'location.desc.rook' },
  { id: 'daith', category: 'ear', labelKey: 'location.daith', painRating: 6, descriptionKey: 'location.desc.daith' },
  { id: 'conch', category: 'ear', labelKey: 'location.conch', painRating: 5, descriptionKey: 'location.desc.conch' },
  { id: 'snug', category: 'ear', labelKey: 'location.snug', painRating: 7, descriptionKey: 'location.desc.snug' },
  {
    id: 'industrial',
    category: 'ear',
    labelKey: 'location.industrial',
    painRating: 6,
    descriptionKey: 'location.desc.industrial',
  },
  {
    id: 'orbital',
    category: 'ear',
    labelKey: 'location.orbital',
    painRating: 5,
    descriptionKey: 'location.desc.orbital',
  },
  // Face
  {
    id: 'eyebrow',
    category: 'face',
    labelKey: 'location.eyebrow',
    painRating: 4,
    descriptionKey: 'location.desc.eyebrow',
  },
  {
    id: 'bridge',
    category: 'face',
    labelKey: 'location.bridge',
    painRating: 5,
    descriptionKey: 'location.desc.bridge',
  },
  {
    id: 'nostril',
    category: 'face',
    labelKey: 'location.nostril',
    painRating: 4,
    descriptionKey: 'location.desc.nostril',
  },
  {
    id: 'highNostril',
    category: 'face',
    labelKey: 'location.highNostril',
    painRating: 5,
    descriptionKey: 'location.desc.highNostril',
  },
  {
    id: 'septum',
    category: 'face',
    labelKey: 'location.septum',
    painRating: 5,
    descriptionKey: 'location.desc.septum',
  },
  {
    id: 'philtrumMedusa',
    category: 'face',
    labelKey: 'location.philtrumMedusa',
    painRating: 5,
    descriptionKey: 'location.desc.philtrumMedusa',
  },
  {
    id: 'labret',
    category: 'face',
    labelKey: 'location.labret',
    painRating: 5,
    descriptionKey: 'location.desc.labret',
  },
  {
    id: 'monroe',
    category: 'face',
    labelKey: 'location.monroe',
    painRating: 5,
    descriptionKey: 'location.desc.monroe',
  },
  {
    id: 'tongue',
    category: 'face',
    labelKey: 'location.tongue',
    painRating: 5,
    descriptionKey: 'location.desc.tongue',
  },
  {
    id: 'cheekDimple',
    category: 'face',
    labelKey: 'location.cheekDimple',
    painRating: 6,
    descriptionKey: 'location.desc.cheekDimple',
  },
  // Body (non-genital scope only)
  { id: 'navel', category: 'body', labelKey: 'location.navel', painRating: 4, descriptionKey: 'location.desc.navel' },
  {
    id: 'nipple',
    category: 'body',
    labelKey: 'location.nipple',
    painRating: 6,
    descriptionKey: 'location.desc.nipple',
  },
  {
    id: 'surface',
    category: 'body',
    labelKey: 'location.surface',
    painRating: 7,
    descriptionKey: 'location.desc.surface',
  },
  {
    id: 'dermal',
    category: 'body',
    labelKey: 'location.dermal',
    painRating: 6,
    descriptionKey: 'location.desc.dermal',
  },
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
