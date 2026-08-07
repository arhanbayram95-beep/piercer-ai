import { PIERCING_LOCATION_IDS } from './piercingLocations';
import { PIERCING_LOCATION_JEWELRY_TYPES, validJewelryTypesFor } from './locationJewelryTypes';
import { JEWELRY_TYPES } from '../state/slices/studioSlice';

describe('PIERCING_LOCATION_JEWELRY_TYPES', () => {
  it('has a non-empty jewelry type list for every location in the catalog', () => {
    for (const id of PIERCING_LOCATION_IDS) {
      expect(PIERCING_LOCATION_JEWELRY_TYPES[id].length).toBeGreaterThan(0);
    }
  });

  it('only offers the industrial jewelry type for the Industrial location', () => {
    expect(PIERCING_LOCATION_JEWELRY_TYPES.industrial).toEqual(['industrial']);
    for (const id of PIERCING_LOCATION_IDS) {
      if (id === 'industrial') continue;
      expect(PIERCING_LOCATION_JEWELRY_TYPES[id]).not.toContain('industrial');
    }
  });

  it('does not offer an industrial barbell for a single-hole spot like Tongue', () => {
    expect(PIERCING_LOCATION_JEWELRY_TYPES.tongue).not.toContain('industrial');
  });

  it('only offers dermal jewelry for dermal-anchor-appropriate locations', () => {
    expect(PIERCING_LOCATION_JEWELRY_TYPES.dermal).toContain('dermal');
    expect(PIERCING_LOCATION_JEWELRY_TYPES.surface).toContain('dermal');
  });
});

describe('validJewelryTypesFor', () => {
  it('returns the restricted set for a known location', () => {
    expect(validJewelryTypesFor('tongue')).toEqual(['barbells']);
  });

  it('falls back to every jewelry type when no location is selected', () => {
    expect(validJewelryTypesFor(null)).toEqual([...JEWELRY_TYPES]);
  });
});
