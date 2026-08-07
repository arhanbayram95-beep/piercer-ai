import { PiercingLocationId, PIERCING_LOCATION_IDS } from './matchSchema';

// Short, prompt-only descriptors — not user-facing copy (the frontend's own
// i18n labels in content/piercingLocations.ts are what the user actually
// sees), just enough context for the model to reason about anatomy when
// picking locations. Keep in sync with PIERCING_LOCATION_IDS.
const LOCATION_DESCRIPTORS: Record<PiercingLocationId, string> = {
  lobe: 'lobe (classic earlobe)',
  upperLobe: 'upperLobe (higher on the fleshy lobe)',
  helix: 'helix (upper outer ear cartilage)',
  forwardHelix: 'forwardHelix (cartilage ridge in front of the ear, near the temple)',
  tragus: 'tragus (small flap over the ear canal)',
  antiTragus: 'antiTragus (cartilage bump opposite the tragus)',
  rook: 'rook (cartilage ridge above the tragus)',
  daith: 'daith (innermost cartilage fold)',
  conch: 'conch (broad cartilage in the center of the ear)',
  snug: 'snug (cartilage ridge parallel to the outer rim)',
  industrial: 'industrial (two ear piercings joined by one barbell)',
  orbital: 'orbital (two ear piercing holes joined by one ring)',
  eyebrow: 'eyebrow (skin along the brow ridge)',
  bridge: 'bridge (skin at the top of the nose, between the eyes)',
  nostril: 'nostril (side of the nose)',
  highNostril: 'highNostril (nostril, placed higher up)',
  septum: 'septum (tissue between the nostrils)',
  philtrumMedusa: 'philtrumMedusa (above the upper lip, below the nose)',
  labret: 'labret (below the lower lip, above the chin)',
  monroe: 'monroe (off-center above the upper lip)',
  tongue: 'tongue (center of the tongue)',
  cheekDimple: 'cheekDimple (cheek, dimple placement)',
  navel: 'navel (rim of the belly button)',
  nipple: 'nipple (base of the nipple)',
  surface: 'surface (flat area of skin, not through a fold)',
  dermal: 'dermal (single-point anchor, usable almost anywhere)',
};

// Deliberately NO disclaimer/entertainment-framing instruction here — an
// explicit, documented exception to CLAUDE.md's usual "disclaimers are
// non-negotiable" rule, confirmed by the product owner for this specific
// module (see PersonalityPhotoScreen.tsx's matching code comment for the
// same note on the frontend side). Still keeps the app's baseline tone
// (light, fun, non-clinical, no negative commentary about the person) since
// that constraint was never waived, just the disclaimer requirement.
const TONE_RULES = [
  'Keep the tone light, fun, and encouraging — like a friendly stylist, never clinical or diagnostic.',
  'Never comment negatively on the person\'s appearance, and never guess their age, identity, or personal details.',
  'Base recommendations only on visible anatomy (ear shape, face shape, visible piercable areas) and general style fit — not on assumptions about the person.',
].join(' ');

// Pure function — no AI provider SDK in the loop — per CLAUDE.md's "Pure
// Functions" convention, testable without mocking anything.
export function assembleMatchPrompt(): string {
  const locationList = PIERCING_LOCATION_IDS.map((id) => LOCATION_DESCRIPTORS[id]).join(', ');

  return [
    'Look at this photo and recommend 1 to 3 piercing locations that would suit the person well, based on their visible ear/face/body shape and general style.',
    `Choose only from this exact set of location IDs: ${locationList}.`,
    'For each recommendation, give a short, upbeat one-sentence reason.',
    TONE_RULES,
  ].join(' ');
}
