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
  'flat',
  'auricle',
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
  'nefertiti',
  'rhino',
  'nasallang',
  'verticalLabret',
  'antiEyebrow',
  'navel',
  'nipple',
  'surface',
  'dermal',
  'nape',
  'hip',
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
  // Same "general estimate, not medical advice" framing extends to these
  // two — a healing-time range and one aftercare tip, both generic
  // industry-standard guidance, never personalized. See
  // PiercingReferenceScreen's visible disclaimer copy.
  healingTimeKey: TranslationKey;
  aftercareKey: TranslationKey;
}

export const PIERCING_LOCATIONS: PiercingLocation[] = [
  // Ear
  {
    id: 'lobe',
    category: 'ear',
    labelKey: 'location.lobe',
    painRating: 2,
    descriptionKey: 'location.desc.lobe',
    healingTimeKey: 'location.healing.lobe',
    aftercareKey: 'location.aftercare.lobe',
  },
  {
    id: 'upperLobe',
    category: 'ear',
    labelKey: 'location.upperLobe',
    painRating: 3,
    descriptionKey: 'location.desc.upperLobe',
    healingTimeKey: 'location.healing.upperLobe',
    aftercareKey: 'location.aftercare.upperLobe',
  },
  {
    id: 'helix',
    category: 'ear',
    labelKey: 'location.helix',
    painRating: 5,
    descriptionKey: 'location.desc.helix',
    healingTimeKey: 'location.healing.helix',
    aftercareKey: 'location.aftercare.helix',
  },
  {
    id: 'forwardHelix',
    category: 'ear',
    labelKey: 'location.forwardHelix',
    painRating: 5,
    descriptionKey: 'location.desc.forwardHelix',
    healingTimeKey: 'location.healing.forwardHelix',
    aftercareKey: 'location.aftercare.forwardHelix',
  },
  {
    id: 'tragus',
    category: 'ear',
    labelKey: 'location.tragus',
    painRating: 5,
    descriptionKey: 'location.desc.tragus',
    healingTimeKey: 'location.healing.tragus',
    aftercareKey: 'location.aftercare.tragus',
  },
  {
    id: 'antiTragus',
    category: 'ear',
    labelKey: 'location.antiTragus',
    painRating: 6,
    descriptionKey: 'location.desc.antiTragus',
    healingTimeKey: 'location.healing.antiTragus',
    aftercareKey: 'location.aftercare.antiTragus',
  },
  {
    id: 'rook',
    category: 'ear',
    labelKey: 'location.rook',
    painRating: 6,
    descriptionKey: 'location.desc.rook',
    healingTimeKey: 'location.healing.rook',
    aftercareKey: 'location.aftercare.rook',
  },
  {
    id: 'daith',
    category: 'ear',
    labelKey: 'location.daith',
    painRating: 6,
    descriptionKey: 'location.desc.daith',
    healingTimeKey: 'location.healing.daith',
    aftercareKey: 'location.aftercare.daith',
  },
  {
    id: 'conch',
    category: 'ear',
    labelKey: 'location.conch',
    painRating: 5,
    descriptionKey: 'location.desc.conch',
    healingTimeKey: 'location.healing.conch',
    aftercareKey: 'location.aftercare.conch',
  },
  {
    id: 'snug',
    category: 'ear',
    labelKey: 'location.snug',
    painRating: 7,
    descriptionKey: 'location.desc.snug',
    healingTimeKey: 'location.healing.snug',
    aftercareKey: 'location.aftercare.snug',
  },
  {
    id: 'industrial',
    category: 'ear',
    labelKey: 'location.industrial',
    painRating: 6,
    descriptionKey: 'location.desc.industrial',
    healingTimeKey: 'location.healing.industrial',
    aftercareKey: 'location.aftercare.industrial',
  },
  {
    id: 'orbital',
    category: 'ear',
    labelKey: 'location.orbital',
    painRating: 5,
    descriptionKey: 'location.desc.orbital',
    healingTimeKey: 'location.healing.orbital',
    aftercareKey: 'location.aftercare.orbital',
  },
  {
    id: 'flat',
    category: 'ear',
    labelKey: 'location.flat',
    painRating: 5,
    descriptionKey: 'location.desc.flat',
    healingTimeKey: 'location.healing.flat',
    aftercareKey: 'location.aftercare.flat',
  },
  {
    id: 'auricle',
    category: 'ear',
    labelKey: 'location.auricle',
    painRating: 5,
    descriptionKey: 'location.desc.auricle',
    healingTimeKey: 'location.healing.auricle',
    aftercareKey: 'location.aftercare.auricle',
  },
  // Face
  {
    id: 'eyebrow',
    category: 'face',
    labelKey: 'location.eyebrow',
    painRating: 4,
    descriptionKey: 'location.desc.eyebrow',
    healingTimeKey: 'location.healing.eyebrow',
    aftercareKey: 'location.aftercare.eyebrow',
  },
  {
    id: 'bridge',
    category: 'face',
    labelKey: 'location.bridge',
    painRating: 5,
    descriptionKey: 'location.desc.bridge',
    healingTimeKey: 'location.healing.bridge',
    aftercareKey: 'location.aftercare.bridge',
  },
  {
    id: 'nostril',
    category: 'face',
    labelKey: 'location.nostril',
    painRating: 4,
    descriptionKey: 'location.desc.nostril',
    healingTimeKey: 'location.healing.nostril',
    aftercareKey: 'location.aftercare.nostril',
  },
  {
    id: 'highNostril',
    category: 'face',
    labelKey: 'location.highNostril',
    painRating: 5,
    descriptionKey: 'location.desc.highNostril',
    healingTimeKey: 'location.healing.highNostril',
    aftercareKey: 'location.aftercare.highNostril',
  },
  {
    id: 'septum',
    category: 'face',
    labelKey: 'location.septum',
    painRating: 5,
    descriptionKey: 'location.desc.septum',
    healingTimeKey: 'location.healing.septum',
    aftercareKey: 'location.aftercare.septum',
  },
  {
    id: 'philtrumMedusa',
    category: 'face',
    labelKey: 'location.philtrumMedusa',
    painRating: 5,
    descriptionKey: 'location.desc.philtrumMedusa',
    healingTimeKey: 'location.healing.philtrumMedusa',
    aftercareKey: 'location.aftercare.philtrumMedusa',
  },
  {
    id: 'labret',
    category: 'face',
    labelKey: 'location.labret',
    painRating: 5,
    descriptionKey: 'location.desc.labret',
    healingTimeKey: 'location.healing.labret',
    aftercareKey: 'location.aftercare.labret',
  },
  {
    id: 'monroe',
    category: 'face',
    labelKey: 'location.monroe',
    painRating: 5,
    descriptionKey: 'location.desc.monroe',
    healingTimeKey: 'location.healing.monroe',
    aftercareKey: 'location.aftercare.monroe',
  },
  {
    id: 'tongue',
    category: 'face',
    labelKey: 'location.tongue',
    painRating: 5,
    descriptionKey: 'location.desc.tongue',
    healingTimeKey: 'location.healing.tongue',
    aftercareKey: 'location.aftercare.tongue',
  },
  {
    id: 'cheekDimple',
    category: 'face',
    labelKey: 'location.cheekDimple',
    painRating: 6,
    descriptionKey: 'location.desc.cheekDimple',
    healingTimeKey: 'location.healing.cheekDimple',
    aftercareKey: 'location.aftercare.cheekDimple',
  },
  {
    id: 'nefertiti',
    category: 'face',
    labelKey: 'location.nefertiti',
    painRating: 6,
    descriptionKey: 'location.desc.nefertiti',
    healingTimeKey: 'location.healing.nefertiti',
    aftercareKey: 'location.aftercare.nefertiti',
  },
  {
    id: 'rhino',
    category: 'face',
    labelKey: 'location.rhino',
    painRating: 6,
    descriptionKey: 'location.desc.rhino',
    healingTimeKey: 'location.healing.rhino',
    aftercareKey: 'location.aftercare.rhino',
  },
  {
    id: 'nasallang',
    category: 'face',
    labelKey: 'location.nasallang',
    painRating: 7,
    descriptionKey: 'location.desc.nasallang',
    healingTimeKey: 'location.healing.nasallang',
    aftercareKey: 'location.aftercare.nasallang',
  },
  {
    id: 'verticalLabret',
    category: 'face',
    labelKey: 'location.verticalLabret',
    painRating: 5,
    descriptionKey: 'location.desc.verticalLabret',
    healingTimeKey: 'location.healing.verticalLabret',
    aftercareKey: 'location.aftercare.verticalLabret',
  },
  {
    id: 'antiEyebrow',
    category: 'face',
    labelKey: 'location.antiEyebrow',
    painRating: 6,
    descriptionKey: 'location.desc.antiEyebrow',
    healingTimeKey: 'location.healing.antiEyebrow',
    aftercareKey: 'location.aftercare.antiEyebrow',
  },
  // Body (non-genital scope only)
  {
    id: 'navel',
    category: 'body',
    labelKey: 'location.navel',
    painRating: 4,
    descriptionKey: 'location.desc.navel',
    healingTimeKey: 'location.healing.navel',
    aftercareKey: 'location.aftercare.navel',
  },
  {
    id: 'nipple',
    category: 'body',
    labelKey: 'location.nipple',
    painRating: 6,
    descriptionKey: 'location.desc.nipple',
    healingTimeKey: 'location.healing.nipple',
    aftercareKey: 'location.aftercare.nipple',
  },
  {
    id: 'surface',
    category: 'body',
    labelKey: 'location.surface',
    painRating: 7,
    descriptionKey: 'location.desc.surface',
    healingTimeKey: 'location.healing.surface',
    aftercareKey: 'location.aftercare.surface',
  },
  {
    id: 'dermal',
    category: 'body',
    labelKey: 'location.dermal',
    painRating: 6,
    descriptionKey: 'location.desc.dermal',
    healingTimeKey: 'location.healing.dermal',
    aftercareKey: 'location.aftercare.dermal',
  },
  {
    id: 'nape',
    category: 'body',
    labelKey: 'location.nape',
    painRating: 6,
    descriptionKey: 'location.desc.nape',
    healingTimeKey: 'location.healing.nape',
    aftercareKey: 'location.aftercare.nape',
  },
  {
    id: 'hip',
    category: 'body',
    labelKey: 'location.hip',
    painRating: 6,
    descriptionKey: 'location.desc.hip',
    healingTimeKey: 'location.healing.hip',
    aftercareKey: 'location.aftercare.hip',
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
