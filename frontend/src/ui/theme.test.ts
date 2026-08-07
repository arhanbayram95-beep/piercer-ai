import { Theme } from './theme';

describe('Theme', () => {
  it('locks the required brand colors from DESIGN.md', () => {
    expect(Theme.colors.background.start).toBe('#16161A');
    expect(Theme.colors.accent.crimsonPrimary).toBe('#E11D48');
    expect(Theme.colors.accent.goldSecondary).toBe('#CBD5E1');
    expect(Theme.colors.accent.electricPurple).toBe('#A855F7');
  });
});
