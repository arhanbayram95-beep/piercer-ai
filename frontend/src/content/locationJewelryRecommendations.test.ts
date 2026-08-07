import { PIERCING_LOCATION_IDS } from './piercingLocations';
import { recommendedJewelryFor } from './locationJewelryRecommendations';

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
});
