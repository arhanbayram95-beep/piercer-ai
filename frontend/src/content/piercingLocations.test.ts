import { translate } from '../i18n/translations';
import { PIERCING_LOCATIONS } from './piercingLocations';

describe('PIERCING_LOCATIONS', () => {
  it('has a healing time and an aftercare tip for every location, each resolving to real copy', () => {
    for (const location of PIERCING_LOCATIONS) {
      const healingText = translate(location.healingTimeKey, 'en');
      const aftercareText = translate(location.aftercareKey, 'en');
      expect(healingText.length).toBeGreaterThan(0);
      expect(aftercareText.length).toBeGreaterThan(0);
      // Aftercare should read as actual guidance, not a copy-paste placeholder
      // repeated identically across every location.
      expect(aftercareText).not.toBe(healingText);
    }
  });

  it('gives every location a distinct aftercare tip rather than one generic tip reused everywhere', () => {
    const aftercareTexts = PIERCING_LOCATIONS.map((location) => translate(location.aftercareKey, 'en'));
    const uniqueTexts = new Set(aftercareTexts);
    // A handful of closely related spots (e.g. lobe/upperLobe) may
    // legitimately share near-identical guidance, but the catalog as a
    // whole should not collapse to just one or two tips.
    expect(uniqueTexts.size).toBeGreaterThan(PIERCING_LOCATIONS.length / 2);
  });
});
