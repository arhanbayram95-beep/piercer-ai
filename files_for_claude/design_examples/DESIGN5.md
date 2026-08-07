---
name: Aetheric Precision
colors:
  surface: '#1b1011'
  surface-dim: '#1b1011'
  surface-bright: '#443637'
  surface-container-lowest: '#160b0c'
  surface-container-low: '#24191a'
  surface-container: '#281d1e'
  surface-container-high: '#342728'
  surface-container-highest: '#3f3132'
  on-surface: '#f3ddde'
  on-surface-variant: '#debfc1'
  inverse-surface: '#f3ddde'
  inverse-on-surface: '#3a2d2e'
  outline: '#a58a8c'
  outline-variant: '#574143'
  surface-tint: '#ffb2b9'
  primary: '#ffb2b9'
  on-primary: '#67001f'
  primary-container: '#9e2941'
  on-primary-container: '#ffb9bf'
  inverse-primary: '#aa3249'
  secondary: '#e4c27d'
  on-secondary: '#3f2e00'
  secondary-container: '#5d460b'
  on-secondary-container: '#d5b470'
  tertiary: '#86d7aa'
  on-tertiary: '#003822'
  tertiary-container: '#00633f'
  on-tertiary-container: '#8bdcaf'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdadc'
  primary-fixed-dim: '#ffb2b9'
  on-primary-fixed: '#400010'
  on-primary-fixed-variant: '#891833'
  secondary-fixed: '#ffdf9e'
  secondary-fixed-dim: '#e4c27d'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5a4309'
  tertiary-fixed: '#a2f4c5'
  tertiary-fixed-dim: '#86d7aa'
  on-tertiary-fixed: '#002112'
  on-tertiary-fixed-variant: '#005233'
  background: '#1b1011'
  on-background: '#f3ddde'
  surface-variant: '#3f3132'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
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
  container-max: 1200px
  gutter: 20px
---

## Brand & Style

The design system is engineered to evoke a sense of "Technological Mysticism." It targets a high-end audience seeking sophisticated AI insights into facial aesthetics and health. The personality is authoritative yet ethereal, blending the precision of biometric data with a luxurious, cosmic aesthetic.

The visual style is a hybrid of **Dark Glassmorphism** and **High-Contrast Luxe**. It utilizes deep, atmospheric gradients to create infinite depth, punctuated by sharp, glowing interactive elements that feel like biological or celestial markers. The emotional response is one of discovery, exclusivity, and advanced intelligence.

## Colors

The palette is anchored in a deep, obsidian-burgundy void. 
- **Primary (Crimson Glow):** Used for accent glows, status indicators, and subtle backlighting. It represents the "pulse" of the AI.
- **Secondary (Celestial Gold):** Reserved for high-priority interactive elements, call-to-actions, and fine biometric details.
- **Surface:** A semi-transparent white (5% opacity) creates the glass effect, allowing the background gradient to bleed through.
- **Typography:** Warm off-white for maximum legibility against dark backgrounds, with lavender-gray for secondary hierarchy to maintain the cosmic tone.

## Typography

This design system utilizes a tiered sans-serif approach to balance modern tech with readability.
- **Manrope** is used for headlines to provide a balanced, professional, and slightly tech-forward feel.
- **Hanken Grotesk** serves as the body face, offering exceptional clarity and a contemporary sharp edge.
- **Geist** is utilized for labels and biometric data readouts, providing a precise, monospaced-adjacent aesthetic that feels like developer-grade output.

Headers should always use the primary off-white color, while body text uses the lavender-gray to reduce visual fatigue.

## Layout & Spacing

The layout follows a **Fluid Grid** model with generous internal safe areas to mimic the spaciousness of cosmic environments.
- **Grid:** A 12-column layout for desktop, transitioning to 4 columns for mobile.
- **Margins:** Desktop margins are set to a minimum of 64px (xl) to maintain a premium, airy feel. Mobile margins are 20px.
- **Rhythm:** An 8px linear scale is used for component internal spacing, while layout blocks use a 24px (md) or 40px (lg) gap to ensure distinct separation of data modules.

## Elevation & Depth

Depth is achieved through **Dark Glassmorphism** rather than traditional drop shadows.
- **Surfaces:** Use a `backdrop-filter: blur(12px)` combined with a background of `rgba(255, 255, 255, 0.05)`.
- **Borders:** Every surface container must have a 1px border. Use a linear gradient for the border: `linear-gradient(135deg, #9E2941, #EBC983)`. Set the border opacity to 30% for inactive states and 80% for active/focused states.
- **Glows:** Higher-level elements (modals, active chips) feature a soft `box-shadow: 0 0 30px rgba(158, 41, 65, 0.15)`.

## Shapes

The shape language is "Sophisticated Geometric." We avoid hyper-rounded "bubbly" shapes to maintain a premium feel. 
- **Standard Elements:** 8px (0.5rem) radius provides a modern, professional look.
- **Interactive Triggers:** Buttons and inputs use a consistent 8px radius.
- **Data Visualizations:** Biometric overlays on face maps should use 0px (sharp) or 2px radii to emphasize technical precision.

## Components

### Buttons
- **Primary:** Solid Celestial Gold (#EBC983) with dark text (#1A050B). No shadow, but a subtle outer glow on hover.
- **Secondary:** Glassmorphic background with a glowing Crimson border. Text in off-white.

### Input Fields
- Transparent backgrounds with a bottom-only border in lavender-gray. On focus, the border transitions to a Crimson-Gold gradient and a subtle inner glow appears.

### Cards & Modules
- Always glassmorphic. Cards should appear to "float" over the background gradient. Titles within cards use the `label-caps` style in Gold.

### Biometric Chips
- Small, pill-shaped markers used to highlight facial features. These use the primary Crimson with a high-intensity blur behind them to appear as "hotspots" on the face analysis.

### Selection Controls
- **Checkboxes/Radios:** Square with 2px radius. When selected, they fill with a Gold-to-Crimson gradient.

### AI Scanning Progress
- A thin, horizontal line (1px) that traverses the UI. It should be a pure Celestial Gold beam with a trailing Crimson Gaussian blur.