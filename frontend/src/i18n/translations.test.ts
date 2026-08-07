import { SUPPORTED_LANGUAGES } from '../state/slices/localeSlice';
import { translate, translations } from './translations';

describe('translations', () => {
  it('has a non-empty string for every supported language on every key', () => {
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    const missing: string[] = [];
    for (const [key, entry] of Object.entries(translations)) {
      for (const code of codes) {
        const value = (entry as Record<string, string>)[code];
        if (!value) missing.push(`${key}:${code}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('translates a key into the requested language', () => {
    expect(translate('nav.settings', 'es')).toBe('Ajustes');
  });

  it('falls back to English for an unsupported language code', () => {
    expect(translate('nav.settings', 'xx')).toBe('Settings');
  });

  it('interpolates template variables', () => {
    expect(translate('review.starLabel', 'en', { n: 4 })).toBe('Rate 4 stars');
  });
});
