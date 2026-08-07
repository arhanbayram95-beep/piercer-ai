import { Theme } from './theme';

describe('Theme', () => {
  it('locks the required brand colors from DESIGN.md', () => {
    expect(Theme.colors.background.start).toBe('#1A050B');
    expect(Theme.colors.accent.crimsonPrimary).toBe('#9E2941');
    expect(Theme.colors.accent.goldSecondary).toBe('#EBC983');
  });
});
