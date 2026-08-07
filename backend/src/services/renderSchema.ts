// Request/response contract for POST /api/v1/render/preview. Unlike the old
// face-reading feature's Gemini `responseSchema` (config.responseSchema +
// responseMimeType: 'application/json', a JSON-only mechanism), this
// endpoint's AI call must return an actual IMAGE — Gemini's structured-JSON-
// output mechanism is mutually exclusive with image-output modalities (see
// renderService.ts's comment for the verified capability details), so it
// doesn't apply here. This file instead defines the plain TypeScript
// request/response shapes shared between the route, the service, and their
// tests — no shared package between frontend/backend (same tradeoff already
// made for legalContent.ts), so frontend/src/api/render.ts mirrors these
// values and must be kept in sync by hand.
export const JEWELRY_TYPES = ['hoops', 'studs', 'barbells', 'industrial', 'septum', 'dermal'] as const;
export type JewelryType = (typeof JEWELRY_TYPES)[number];

export const JEWELRY_FINISHES = ['silver', 'gold', 'titanium', 'blackSteel'] as const;
export type JewelryFinish = (typeof JEWELRY_FINISHES)[number];

export function isJewelryType(value: unknown): value is JewelryType {
  return typeof value === 'string' && (JEWELRY_TYPES as readonly string[]).includes(value);
}

export function isJewelryFinish(value: unknown): value is JewelryFinish {
  return typeof value === 'string' && (JEWELRY_FINISHES as readonly string[]).includes(value);
}

export interface RenderRequest {
  // Base64-encoded JPEG, no data-URL prefix — same convention CaptureScreen
  // already uses for its image cache.
  photo: string;
  jewelryType: JewelryType;
  finish: JewelryFinish;
}

export interface RenderResult {
  renderedImage: string;
  mimeType: string;
}
