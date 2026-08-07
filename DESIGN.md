# Design System & UI/UX Specification: piercer.ai
**Version:** 3.0.0  
**Target Platform:** Mobile (iOS / Android — Expo React Native)  
**Core Theme:** Tattoo & Piercing Parlor — Matte Charcoal Studio x Polished Chrome x Neon Flash

---

## 1. Visual Identity & Brand Philosophy

piercer.ai combines advanced multimodal AI vision with a sleek, modern tattoo/piercing studio aesthetic. The interface is designed as an effortless studio-counter ritual: dark matte charcoal surfaces, polished chrome/steel accents, and neon crimson and electric-purple glow reminiscent of flash-sheet art and studio signage.

### Key Principles
* **Studio Tray Depth:** Panel surfaces read like flash sheets and metal instrument trays — matte charcoal fills with a subtle polished-chrome/steel border glow, rather than translucent glassmorphism.
* **Tactile & Auditory Rituals:** Every capture phase features distinct haptic feedback and custom audio cues (mechanical shutter clicks, buzzer-adjacent tones, subtle metallic chimes).
* **Parity Across Platforms:** Pixel-perfect visual identity on both iOS and Android using unified theme tokens.

---

## 2. Design Tokens (`frontend/src/ui/theme.ts`)

```typescript
export const Theme = {
  colors: {
    // Background Gradients — matte studio charcoal/slate
    background: {
      start: '#16161A', // Matte Charcoal
      middle: '#131316', // Studio Slate
      end: '#0F0F12',    // Deep Matte Slate
    },

    // Card Surfaces (Flash-Sheet / Metal Tray Panels)
    surface: {
      glassBackground: 'rgba(203, 213, 225, 0.05)', // chrome-tinted tray panel fill
      glassBorder: 'rgba(148, 163, 184, 0.35)',      // steel border glow (#94A3B8)
      glassOverlay: 'rgba(15, 15, 18, 0.75)',
      metallicBorder: 'rgba(203, 213, 225, 0.45)',   // brighter chrome edge highlight for flash-sheet cards
    },

    // Accents & Typography
    accent: {
      crimsonPrimary: '#E11D48',    // Neon crimson glow
      goldSecondary: '#CBD5E1',     // Polished chrome/silver highlight
      iridescentShimmer: '#A855F7', // Electric purple (kept key name for compatibility)
      electricPurple: '#A855F7',    // Primary CTA / active state
      chromeSteel: '#94A3B8',       // Secondary steel accent
    },

    text: {
      primary: '#F1F5F9',   // Bright chrome white
      secondary: '#94A3B8', // Steel gray
      accentGold: '#CBD5E1', // Chrome/silver accent text (kept key name for compatibility)
      muted: '#52525B',
    },

    // Status & Utility
    status: {
      error: '#E11D48',
      success: '#4ADE80',
    }
  },

  // Gradients for LinearGradient-style tray-panel / neon-edge surfaces
  gradients: {
    trayPanel: ['#1C1C21', '#0F0F12'],
    neonEdge: ['#E11D48', '#A855F7'],
  },
};
```

Note: `accent.goldSecondary` and `text.accentGold` retain their original key
names from the earlier "cosmic mystic" palette (all ~15 existing screens and
components reference these exact paths) but now resolve to polished
chrome/silver values instead of champagne gold, per the tattoo/piercing
parlor re-skin. `accent.iridescentShimmer` likewise keeps its key but now
resolves to the electric-purple CTA color; new code should prefer the
explicit `accent.electricPurple` alias for clarity.
