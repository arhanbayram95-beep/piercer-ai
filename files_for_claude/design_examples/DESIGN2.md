---
name: Obsidian Crimson & Gold
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
  tertiary: '#f6b6bf'
  on-tertiary: '#4d242b'
  tertiary-container: '#784850'
  on-tertiary-container: '#fabac3'
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
  tertiary-fixed: '#ffd9dd'
  tertiary-fixed-dim: '#f6b6bf'
  on-tertiary-fixed: '#340f17'
  on-tertiary-fixed-variant: '#673941'
  background: '#230c13'
  on-background: '#ffd9e0'
  surface-variant: '#4a2c34'
typography:
  display-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Bricolage Grotesque
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Bricolage Grotesque
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
  label-sm:
    fontFamily: Geist
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
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system embodies a "Luxury Cosmic" aesthetic, blending the deep, mysterious allure of dark burgundy with the prestige of champagne gold. It is tailored for a high-end AI experience that feels both futuristic and exclusive.

The visual style is rooted in **Dark Glassmorphism**. Interfaces utilize deep obsidian layers with frosted transparency, allowing vibrant crimson glows to permeate from beneath the surface. Every element is finished with 1px precision borders that simulate a soft luminous wireframe, creating a sense of sophisticated technical craftsmanship. The emotional response is one of power, precision, and indulgence.

## Colors
The palette is dominated by an ultra-dark burgundy base that borders on obsidian, providing a high-contrast canvas for metallic and jewel-toned accents.

- **Primary (Crimson):** Used for critical actions, active states, and primary brand glows. It represents the "heart" of the AI.
- **Secondary (Champagne Gold):** Reserved for luxury accents, premium features, and high-fidelity borders. It provides a warm, reflective contrast to the cool dark base.
- **Surface Tones:** Backgrounds transition between `#1A050B` and `#2D0A12`.
- **Typography:** Main text uses an off-white with a hint of lavender to maintain the cosmic temperature, while subtext uses a muted lavender-gray to recede into the background.

## Typography
The typography strategy balances character with technical clarity. **Bricolage Grotesque** is used for headlines to provide a unique, slightly eccentric personality that feels "designed." 

For body copy, **Hanken Grotesk** offers high readability and a contemporary feel. Technical data and labels utilize **Geist**, a monospaced-influenced sans-serif that reinforces the AI/developer-tool precision of the product. All labels should be set with increased letter spacing to enhance the "luxury" feel.

## Layout & Spacing
The design system uses a **Fluid Grid** model centered on an 8px scale. Layouts should feel expansive, with generous vertical rhythm to allow the glassmorphic effects "room to breathe."

- **Desktop:** 12-column grid with 24px gutters. Elements typically span 4, 6, or 8 columns to maintain centered focus.
- **Mobile:** 4-column grid with 16px margins.
- **Containment:** Use large internal padding (minimum 32px) within cards to emphasize the "floating" nature of the glass panels.

## Elevation & Depth
Depth is created through **Glassmorphism** and selective illumination rather than traditional drop shadows.

1.  **The Void (Level 0):** The base background `#1A050B`.
2.  **Glass Panels (Level 1):** Background: `rgba(45, 10, 18, 0.6)` with a `20px` backdrop-blur. 
3.  **Luminous Borders:** 1px solid or gradient strokes. Use a linear gradient from Crimson to Gold for primary containers.
4.  **Outer Glows:** Instead of black shadows, use soft, diffused glows (e.g., `box-shadow: 0 0 30px rgba(158, 41, 65, 0.2)`) to simulate light escaping from under the UI components.

## Shapes
This design system utilizes a **Rounded** shape language to soften the "tech" edge of the AI.

- **Standard Components:** 0.5rem (8px) radius for buttons and input fields.
- **Large Containers:** 1rem (16px) radius for main dashboard cards and modals.
- **Interactive Triggers:** Small chips or tags may use the `rounded-xl` (1.5rem) setting to appear more pill-like and inviting.

## Components

### Buttons
- **Primary:** Solid Champagne Gold `#EBC983` background with dark burgundy text. It features a `0 0 15px rgba(235, 201, 131, 0.4)` glow on hover.
- **Secondary:** Glass background with a 1px Crimson `#9E2941` border. Text is Off-white.

### Glassmorphic Cards
Cards are the primary container. They must feature a `backdrop-filter: blur(20px)` and a thin, 1px gradient border (Top-left: Champagne Gold, Bottom-right: Crimson). Use a subtle inner-glow to define the top edge.

### Input Fields
Inputs are dark, semi-transparent wells (`rgba(0,0,0,0.3)`) with a 1px Lavender-gray border. Upon focus, the border transitions to Champagne Gold with a soft outer glow.

### Chips & Badges
Small, high-contrast elements. Use Crimson backgrounds with white text for "Live" or "AI Active" states. Use Gold borders for "Premium" statuses.

### Lists
List items are separated by subtle horizontal rules using a 10% opacity Champagne Gold. Hovering over a list item should trigger a faint Crimson background tint (`rgba(158, 41, 65, 0.1)`).