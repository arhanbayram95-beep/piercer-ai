// Design tokens per DESIGN.md §2. Colors are locked — do not introduce new
// hex values outside this file; reference Theme.colors.* everywhere else.
export const Theme = {
  colors: {
    background: {
      start: '#16161A', // Matte Charcoal
      middle: '#131316', // Studio Slate
      end: '#0F0F12', // Deep Matte Slate
    },
    surface: {
      glassBackground: 'rgba(203, 213, 225, 0.05)', // chrome-tinted tray panel fill
      glassBorder: 'rgba(148, 163, 184, 0.35)', // steel border glow
      glassOverlay: 'rgba(15, 15, 18, 0.75)',
      metallicBorder: 'rgba(203, 213, 225, 0.45)', // brighter chrome edge highlight for flash-sheet cards
    },
    accent: {
      crimsonPrimary: '#E11D48', // neon crimson glow
      goldSecondary: '#CBD5E1', // polished chrome/silver
      iridescentShimmer: '#A855F7', // electric purple, primary CTA / active state
      electricPurple: '#A855F7',
      chromeSteel: '#94A3B8',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
      accentGold: '#CBD5E1', // chrome/silver accent text
      muted: '#52525B',
    },
    status: {
      error: '#E11D48',
      success: '#4ADE80',
    },
  },
  gradients: {
    // For LinearGradient-style surfaces on flash-sheet / metal-tray cards.
    trayPanel: ['#1C1C21', '#0F0F12'] as const,
    neonEdge: ['#E11D48', '#A855F7'] as const,
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
