import { PiercingLocationId } from './piercingLocations';
import { JewelryFinish, JewelryType } from '../state/slices/studioSlice';

// Static, rule-based jewelry-style suggestion per piercing location — the
// "body/face-type" leg of the personality/body-type matching module (piece
// 3 of the module's 3-piece scope). Per the product brief, this leg
// deliberately does NOT introduce a new recommendation-output screen or AI
// call: it reuses the location the user already picked (which was itself
// chosen based on their own face/ear/body) and nudges them toward trying a
// suited jewelry style in the existing Studio/Preview try-on flow — see
// StudioScreen.tsx's recommendation banner. Sibling file to
// piercingLocations.ts rather than folding into it, since this is styling
// guidance, not identity/pain-reference data.
export interface JewelryRecommendation {
  jewelryType: JewelryType;
  finish: JewelryFinish;
}

export const LOCATION_JEWELRY_RECOMMENDATIONS: Record<PiercingLocationId, JewelryRecommendation> = {
  lobe: { jewelryType: 'studs', finish: 'silver' },
  upperLobe: { jewelryType: 'studs', finish: 'gold' },
  helix: { jewelryType: 'hoops', finish: 'silver' },
  forwardHelix: { jewelryType: 'studs', finish: 'titanium' },
  tragus: { jewelryType: 'hoops', finish: 'gold' },
  antiTragus: { jewelryType: 'studs', finish: 'silver' },
  rook: { jewelryType: 'hoops', finish: 'titanium' },
  daith: { jewelryType: 'hoops', finish: 'gold' },
  conch: { jewelryType: 'hoops', finish: 'silver' },
  snug: { jewelryType: 'barbells', finish: 'blackSteel' },
  industrial: { jewelryType: 'industrial', finish: 'blackSteel' },
  orbital: { jewelryType: 'hoops', finish: 'silver' },
  eyebrow: { jewelryType: 'barbells', finish: 'titanium' },
  bridge: { jewelryType: 'barbells', finish: 'silver' },
  nostril: { jewelryType: 'studs', finish: 'gold' },
  highNostril: { jewelryType: 'studs', finish: 'silver' },
  septum: { jewelryType: 'hoops', finish: 'blackSteel' },
  philtrumMedusa: { jewelryType: 'studs', finish: 'silver' },
  labret: { jewelryType: 'studs', finish: 'blackSteel' },
  monroe: { jewelryType: 'studs', finish: 'gold' },
  tongue: { jewelryType: 'barbells', finish: 'titanium' },
  cheekDimple: { jewelryType: 'studs', finish: 'silver' },
  navel: { jewelryType: 'barbells', finish: 'gold' },
  nipple: { jewelryType: 'barbells', finish: 'silver' },
  surface: { jewelryType: 'barbells', finish: 'titanium' },
  dermal: { jewelryType: 'dermal', finish: 'silver' },
};

export function recommendedJewelryFor(locationId: PiercingLocationId): JewelryRecommendation {
  return LOCATION_JEWELRY_RECOMMENDATIONS[locationId];
}
