// Design tokens per DESIGN.md §2. Colors are locked — do not introduce new
// hex values outside this file; reference Theme.colors.* everywhere else.
export const Theme = {
  colors: {
    background: {
      start: '#1A050B', // Deep Obsidian Crimson
      middle: '#2D0A12', // Dark Burgundy
      end: '#0A071B', // Midnight Violet Tint
    },
    surface: {
      glassBackground: 'rgba(255, 255, 255, 0.05)',
      glassBorder: 'rgba(158, 41, 65, 0.35)',
      glassOverlay: 'rgba(26, 5, 11, 0.75)',
    },
    accent: {
      crimsonPrimary: '#9E2941',
      goldSecondary: '#EBC983',
      iridescentShimmer: '#C792EA',
    },
    text: {
      primary: '#F5F3FF',
      secondary: '#B3B0CD',
      accentGold: '#EBC983',
      muted: '#6E6A8A',
    },
    status: {
      error: '#E57373',
      success: '#81C784',
    },
  },
  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 40,
    xl: 64,
    containerPadding: 20,
    gutter: 16,
  },
  radius: {
    sm: 4,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    headlineLg: { fontSize: 26, fontWeight: '700' as const, letterSpacing: -0.3 },
    headlineMd: { fontSize: 24, fontWeight: '600' as const },
    bodyLg: { fontSize: 18, fontWeight: '400' as const, lineHeight: 28 },
    bodyMd: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
    labelSm: { fontSize: 12, fontWeight: '500' as const, letterSpacing: 1.2 },
  },
} as const;

export type ThemeColors = typeof Theme.colors;
