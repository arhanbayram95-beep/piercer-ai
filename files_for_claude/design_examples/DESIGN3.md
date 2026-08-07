---
name: Obsidian Celestial
colors:
  surface: '#230c13'
  surface-dim: '#230c13'
  surface-bright: '#4e3138'
  surface-container-lowest: '#1d070e'
  surface-container-low: '#2d141b'
  surface-container: '#32181f'
  surface-container-high: '#3d2229'
  surface-container-highest: '#4a2c34'
  on-surface: '#ffd9e0'
  on-surface-variant: '#debfc1'
  inverse-surface: '#ffd9e0'
  inverse-on-surface: '#452830'
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
  tertiary: '#c7c5d1'
  on-tertiary: '#2f3039'
  tertiary-container: '#55555f'
  on-tertiary-container: '#cccad6'
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
  tertiary-fixed: '#e3e1ed'
  tertiary-fixed-dim: '#c7c5d1'
  on-tertiary-fixed: '#1a1b23'
  on-tertiary-fixed-variant: '#46464f'
  background: '#230c13'
  on-background: '#ffd9e0'
  surface-variant: '#4a2c34'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  title-md:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
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
  base: 8px
  container-padding: 24px
  gutter: 16px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 40px
---

## Brand & Style

The design system is engineered to evoke a sense of "Mystic Intelligence." It positions AI face analysis not as a clinical utility, but as a sophisticated, high-fidelity experience that blends scientific precision with an ethereal, luxury aesthetic. The target audience is discerning users who appreciate premium, fashion-forward technology.

The visual style is **Glassmorphism** evolved for high-end mobile interfaces. It utilizes deep, multi-layered depth, background blurs, and luminous accents to create a "through-the-lens" feeling. The interface should feel like a physical sheet of dark, tinted glass suspended over a cosmic nebula, with data points glowing from within the material.

## Colors

The palette is anchored in a cinematic dark-mode environment. 

- **Primary (Crimson):** Used for interactive states, glowing borders, and energetic data visualizations. It represents the "pulse" of the AI.
- **Secondary (Champagne Gold):** Reserved for high-value actions, premium badges, and hero summaries. It provides a luxurious contrast to the dark base.
- **Neutral/Background:** A deep obsidian-to-burgundy gradient provides the infinite depth necessary for glassmorphism to thrive.
- **Typography:** Warm off-whites ensure readability against dark backgrounds without the harshness of pure white, while lavender-gray handles de-emphasized metadata.

## Typography

This design system uses a triple-font strategy to balance character and utility:
- **Hanken Grotesk** (Headlines): Provides a sharp, contemporary edge for large titles.
- **Manrope** (Body): Offers a balanced, professional feel with excellent legibility in dark environments.
- **Geist** (Labels/Technical): Used for AI data points and monospaced-style labels to reinforce the "high-tech" narrative.

Avoid center-aligning large blocks of text; keep them left-aligned for a sophisticated, editorial layout.

## Layout & Spacing

The layout follows a **Fluid Grid** model optimized for mobile. 
- Use a 24px side margin to create a sense of exclusivity and "breathable" luxury.
- Elements should be grouped into cards or logical sections with a consistent 16px gutter.
- Implement "Comfortable" vertical spacing. High-fidelity designs require more white space (or "dark space") than utility apps. 
- Use the 8px base unit for all component internals.

## Elevation & Depth

Depth is achieved through **Glassmorphism** rather than traditional drop shadows:
- **Surface Layer:** 15% opacity white with a 20px - 40px Backdrop Blur.
- **Edge Definition:** 1px inner stroke using a linear gradient (Top-Left: Primary Crimson @ 40%, Bottom-Right: White @ 10%). This creates the "glowing edge" effect.
- **Layering:** Background elements should have higher blur values (60px+) to appear further away, while active modals or tooltips use lower blur (20px) to appear crisp and close.
- **Shadows:** Use colored "Ambient Glows" instead of black shadows. A soft Primary Crimson outer glow (blur 30px, opacity 20%) should emanate from active cards.

## Shapes

The design system utilizes **Rounded** shapes to soften the technical nature of the AI.
- Standard cards and buttons use a 16px (`rounded-lg`) radius.
- Small interactive elements like chips or badges use a 32px (`rounded-xl` or pill) radius.
- Avoid 0px sharp corners; they conflict with the "organic" nature of face analysis.

## Components

- **Glassmorphic Cards:** The foundational container. Must feature the 1px luminous border and backdrop blur. Background fill should be a subtle gradient of white at 5% to 12% opacity.
- **Glowing Buttons:** Primary CTAs use the Celestial Champagne Gold background with dark text. Secondary buttons use a Crimson "Inner Glow" with a transparent center.
- **Luminous Badges:** Used for AI confidence scores. These feature a solid Primary Crimson fill with a soft outer glow of the same color.
- **Input Fields:** Minimalist under-lines or subtle glass containers. The cursor and active state must glow in Secondary Champagne.
- **Scanning Reticle:** A custom component for the face analysis phase. Use thin, pulsed lines in Primary Crimson with Geist-font data readouts flickering at the corners.
- **Lists:** Separated by low-opacity (10%) dividers or distinct glass tiles with 8px vertical spacing.