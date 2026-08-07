---
name: Aetheric Interface
colors:
  surface: '#121126'
  surface-dim: '#121126'
  surface-bright: '#38374e'
  surface-container-lowest: '#0d0c21'
  surface-container-low: '#1a192f'
  surface-container: '#1e1d33'
  surface-container-high: '#29283e'
  surface-container-highest: '#34324a'
  on-surface: '#e3dffe'
  on-surface-variant: '#d0c5b4'
  inverse-surface: '#e3dffe'
  inverse-on-surface: '#2f2e45'
  outline: '#999080'
  outline-variant: '#4d4639'
  surface-tint: '#e4c27d'
  primary: '#ffe7b9'
  on-primary: '#3f2e00'
  primary-container: '#ebc983'
  on-primary-container: '#6c5319'
  inverse-primary: '#745b20'
  secondary: '#ffb2b9'
  on-secondary: '#67001f'
  secondary-container: '#891833'
  on-secondary-container: '#ff97a3'
  tertiary: '#ffe2e7'
  on-tertiary: '#452830'
  tertiary-container: '#eec2cb'
  on-tertiary-container: '#6f4e56'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdf9e'
  primary-fixed-dim: '#e4c27d'
  on-primary-fixed: '#261a00'
  on-primary-fixed-variant: '#5a4309'
  secondary-fixed: '#ffdadc'
  secondary-fixed-dim: '#ffb2b9'
  on-secondary-fixed: '#400010'
  on-secondary-fixed-variant: '#891833'
  tertiary-fixed: '#ffd9e0'
  tertiary-fixed-dim: '#e7bbc4'
  on-tertiary-fixed: '#2d141b'
  on-tertiary-fixed-variant: '#5d3e46'
  background: '#121126'
  on-background: '#e3dffe'
  surface-variant: '#34324a'
typography:
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  container-padding: 20px
  gutter: 16px
---

## Brand & Style
The design system embodies "Modern AI Mysticism"—a fusion of advanced generative technology and celestial elegance. It is designed for an audience that seeks both high-tech precision and an evocative, premium experience. 

The visual language utilizes **Glassmorphism** and **High-Contrast** elements to create a sense of depth and digital ritual. The atmosphere is quiet, dark, and focused, utilizing deep obsidian voids and glowing energetic borders to guide the user through the AI experience. The interface should feel like a sophisticated instrument, avoiding any "magic wand" or medieval clichés in favor of cosmic, scientific, and futuristic aesthetics.

## Colors
The palette is centered on deep, immersive darks contrasted with radiant accents.
- **Surface:** The primary background is a vertical gradient from Obsidian (#1A050B) to Dark Crimson (#2D0A12), creating a sense of infinite depth.
- **Primary (Champagne Gold):** Reserved for the most important interactive elements and high-level highlights. It represents the "spark" of AI intelligence.
- **Secondary (Crimson/Burgundy):** Used for interactive states, progress indicators, and subtle glowing borders. It provides a warm, energetic pulse to the UI.
- **Typography:** Headlines use a warm off-white to maintain high legibility against dark backgrounds, while body text uses a soft lavender-gray to reduce eye strain and establish hierarchy.

## Typography
The system uses a combination of modern sans-serifs and a technical monospace for utility.
- **Headlines (Manrope):** Chosen for its geometric precision and modern, balanced feel. It conveys a sense of high-end technology.
- **Body (Plus Jakarta Sans):** A friendly yet clean font that ensures readability in long-form descriptions or AI results.
- **Labels (JetBrains Mono):** Used sparingly for metadata, technical readouts, or small buttons to lean into the "AI engine" aspect of the brand.

## Layout & Spacing
This design system uses a **Fluid Grid** model optimized for mobile-first interactions.
- **Margins:** A standard 20px horizontal margin is maintained for all main content containers.
- **Rhythm:** Spacing follows a 4px/8px baseline shift to ensure mathematical harmony.
- **Grid:** Use a 4-column layout for mobile, scaling to 8 columns for tablet. 
- **Transitions:** Layout shifts should feel organic. Use generous vertical whitespace (40px+) between major sections to maintain the "Minimalist" and "Celestial" atmosphere.

## Elevation & Depth
Depth is achieved through layering and transparency rather than traditional shadows.
- **Backdrop Blurs:** Use a 12px to 20px blur on container backgrounds with a 10-15% opacity fill of the secondary crimson color.
- **Glowing Outlines:** Instead of shadows, use 1px solid or gradient borders. For active elements, use a 1px border of #EBC983 with a 4px outer glow (0.3 opacity).
- **Z-Index Hierarchy:** 
  - Level 1: Background Gradient.
  - Level 2: Glassmorphic Cards (Backdrop blur).
  - Level 3: Interactive floating elements and CTAs.

## Shapes
Shapes are "Rounded" to soften the technical nature of the AI.
- **Standard Radius:** 0.5rem (8px) for cards and input fields.
- **Large Radius:** 1.5rem (24px) for prominent containers and modal sheets.
- **Interactive Elements:** Buttons should use a 1rem radius to distinguish them from structural layout containers.

## Components
- **Buttons:** 
  - *Primary:* Celestial Champagne Gold (#EBC983) background with Obsidian text. No border, slight outer glow.
  - *Secondary:* Transparent background, 1px Crimson (#9E2941) border, soft lavender text.
- **Cards:** Use a semi-transparent dark fill with a 20px backdrop blur. Apply a 1px top-left highlight border in a lighter crimson to simulate light hitting the edge.
- **Inputs:** Dark, recessed fields with a 1px subtle border (#B3B0CD at 0.2 opacity). Upon focus, the border transitions to a glowing Crimson (#9E2941).
- **Chips/Labels:** Use the JetBrains Mono font. Backgrounds should be very dark crimson with 40% opacity and no border.
- **Progress Bars:** Thin, 2px lines using a gradient from Crimson to Gold to signify active AI processing/generation.
- **Lists:** Separated by low-opacity Crimson dividers (0.1 alpha) with 16px vertical padding per item.