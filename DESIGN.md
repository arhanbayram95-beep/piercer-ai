# Design System & UI/UX Specification: Face Reader - AI Physiognomy Tool / Ilm-i Sima
**Version:** 2.0.0  
**Target Platform:** Mobile (iOS / Android — Expo React Native)  
**Core Theme:** Modern AI Mysticism x High-End Glassmorphic UX (Sleek, Cosmic, Modern AI Vibe)

---

## 1. Visual Identity & Brand Philosophy

Face Reader combines advanced multimodal AI vision with a sleek, modern "vibe reading" aesthetic. The interface is designed as an effortless, high-tech camera ritual with deep dark themes, glowing subtle accents, and fluid glassmorphic cards.

### Key Principles
* **Glassmorphic Depth:** Translucent surfaces, subtle blurred overlays, and soft glowing crimson/gold borders create a multi-layered modern UI.
* **Tactile & Auditory Rituals:** Every capture phase features distinct haptic feedback and custom audio cues (light shutter, cosmic chimes, subtle ambient shimmer).
* **Parity Across Platforms:** Pixel-perfect visual identity on both iOS and Android using unified theme tokens.

---

## 2. Design Tokens (`frontend/src/ui/theme.ts`)

```typescript
export const Theme = {
  colors: {
    // Background Gradients
    background: {
      start: '#1A050B', // Deep Obsidian Crimson
      middle: '#2D0A12', // Dark Burgundy
      end: '#0A071B',    // Midnight Violet Tint
    },

    // Card Surfaces (Glassmorphism)
    surface: {
      glassBackground: 'rgba(255, 255, 255, 0.05)',
      glassBorder: 'rgba(158, 41, 65, 0.35)', // Subtle crimson glow border (#9E2941)
      glassOverlay: 'rgba(26, 5, 11, 0.75)',
    },

    // Accents & Typography
    accent: {
      crimsonPrimary: '#9E2941', // Primary Crimson Accent
      goldSecondary: '#EBC983',  // Champagne Gold Highlight
      iridescentShimmer: '#C792EA',
    },

    text: {
      primary: '#F5F3FF',   // Warm Off-White
      secondary: '#B3B0CD', // Soft Lavender Gray
      accentGold: '#EBC983',
      muted: '#6E6A8A',
    },

    // Status & Utility
    status: {
      error: '#E57373',
      success: '#81C784',
    }
  }
};
