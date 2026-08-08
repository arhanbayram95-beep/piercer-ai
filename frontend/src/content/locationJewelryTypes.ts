import { JewelryType, JEWELRY_TYPES } from '../state/slices/studioSlice';
import { PiercingLocationId } from './piercingLocations';

// Which jewelry types are anatomically sensible per piercing location —
// e.g. an Industrial barbell only makes sense for the Industrial location
// (a two-hole, one-barbell piercing), not for a single-hole spot like
// Tongue. Sibling file to piercingLocations.ts (not folded into it) since
// this needs JewelryType from studioSlice.ts, which itself imports
// PiercingLocationId from piercingLocations.ts — importing JewelryType
// there directly would create a circular import.
//
// Not aiming for piercing-industry precision — just ruling out the
// obviously-wrong combos (an Industrial barbell for Tongue, etc.), per the
// product owner's explicit "don't stress over perfect precision" guidance.
export const PIERCING_LOCATION_JEWELRY_TYPES: Record<PiercingLocationId, JewelryType[]> = {
  // Ear
  lobe: ['studs', 'hoops'],
  upperLobe: ['studs', 'hoops'],
  helix: ['studs', 'hoops', 'barbells'],
  forwardHelix: ['studs', 'hoops'],
  tragus: ['studs', 'hoops'],
  antiTragus: ['studs', 'hoops'],
  rook: ['hoops', 'barbells', 'studs'],
  daith: ['hoops', 'barbells'],
  conch: ['studs', 'hoops'],
  snug: ['hoops', 'barbells'],
  industrial: ['industrial'],
  orbital: ['hoops'],
  flat: ['studs', 'barbells'],
  auricle: ['studs', 'hoops'],
  // Face
  eyebrow: ['barbells', 'studs'],
  bridge: ['barbells', 'studs'],
  nostril: ['studs', 'hoops'],
  highNostril: ['studs', 'hoops'],
  septum: ['septum', 'hoops'],
  philtrumMedusa: ['studs'],
  labret: ['studs', 'barbells'],
  monroe: ['studs'],
  tongue: ['barbells'],
  cheekDimple: ['studs', 'barbells'],
  nefertiti: ['barbells', 'studs'],
  rhino: ['barbells', 'studs'],
  nasallang: ['barbells'],
  verticalLabret: ['barbells', 'studs'],
  antiEyebrow: ['dermal', 'barbells'],
  // Body (non-genital scope only)
  navel: ['barbells', 'hoops'],
  nipple: ['barbells', 'hoops'],
  surface: ['dermal', 'barbells'],
  dermal: ['dermal'],
  nape: ['dermal', 'barbells'],
  hip: ['dermal', 'barbells'],
};

// Falls back to every jewelry type rather than crashing or showing nothing
// if somehow called with no location selected — shouldn't happen post the
// piercing-selection-first reorder, but PiercingStudioDrawer follows the
// same defensive-fallback pattern CaptureScreen already uses for its
// location-aware guide copy.
export function validJewelryTypesFor(locationId: PiercingLocationId | null): JewelryType[] {
  if (!locationId) return [...JEWELRY_TYPES];
  return PIERCING_LOCATION_JEWELRY_TYPES[locationId] ?? [...JEWELRY_TYPES];
}
