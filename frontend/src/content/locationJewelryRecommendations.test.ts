import { PIERCING_LOCATION_IDS } from './piercingLocations';
import { recommendedJewelryFor } from './locationJewelryRecommendations';
import { validJewelryTypesFor } from './locationJewelryTypes';

describe('recommendedJewelryFor', () => {
  it('has a recommendation for every piercing location in the catalog', () => {
    for (const id of PIERCING_LOCATION_IDS) {
      const recommendation = recommendedJewelryFor(id);
      expect(recommendation.jewelryType).toBeTruthy();
      expect(recommendation.finish).toBeTruthy();
    }
  });

  it('recommends a dermal anchor for the dermal location', () => {
    expect(recommendedJewelryFor('dermal')).toEqual({ jewelryType: 'dermal', finish: 'silver' });
  });

  // Regression guard for the earlier content-accuracy bug where a
  // recommendation's jewelryType didn't match what locationJewelryTypes.ts
  // considers anatomically valid for that same location (e.g. a septum
  // recommended for an Industrial-only location) — see PROJECT_SPEC.md.
  it('never recommends a jewelry type that locationJewelryTypes.ts rules out for that location', () => {
    for (const id of PIERCING_LOCATION_IDS) {
      const recommendation = recommendedJewelryFor(id);
      expect(validJewelryTypesFor(id)).toContain(recommendation.jewelryType);
    }
  });
});
