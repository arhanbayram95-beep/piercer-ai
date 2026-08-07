import { Schema, Type } from '@google/genai';

// Request/response contract for POST /api/v1/match/photo — the photo-based
// entry point of the personality/body-type piercing matching module (see
// PROJECT_SPEC.md for the 3-piece scope this belongs to). Unlike render.ts's
// endpoint, this one returns structured JSON (recommended locations + why),
// not an image — so it uses Gemini's actual structured-output mechanism
// (config.responseSchema + responseMimeType: 'application/json'), the same
// pattern the original face-reading feature used before the pivot. See
// matchService.ts for the model choice (gemini-flash-latest, not the image
// model render.ts uses).
//
// PIERCING_LOCATION_IDS below mirrors frontend/src/content/piercingLocations.ts's
// id list exactly — no shared package between frontend/backend (same
// tradeoff already made for renderSchema.ts's jewelry catalog), so a change
// to either list has to land in both by hand.
export const PIERCING_LOCATION_IDS = [
  'lobe',
  'upperLobe',
  'helix',
  'forwardHelix',
  'tragus',
  'antiTragus',
  'rook',
  'daith',
  'conch',
  'snug',
  'industrial',
  'orbital',
  'eyebrow',
  'bridge',
  'nostril',
  'highNostril',
  'septum',
  'philtrumMedusa',
  'labret',
  'monroe',
  'tongue',
  'cheekDimple',
  'navel',
  'nipple',
  'surface',
  'dermal',
] as const;

export type PiercingLocationId = (typeof PIERCING_LOCATION_IDS)[number];

export function isPiercingLocationId(value: unknown): value is PiercingLocationId {
  return typeof value === 'string' && (PIERCING_LOCATION_IDS as readonly string[]).includes(value);
}

export interface MatchRequest {
  // Base64-encoded JPEG, no data-URL prefix — same convention as render.ts.
  photo: string;
}

export interface MatchRecommendation {
  locationId: PiercingLocationId;
  reason: string;
}

export interface MatchResult {
  recommendations: MatchRecommendation[];
}

const MAX_RECOMMENDATIONS = 3;

export function isValidRecommendations(value: unknown): value is MatchRecommendation[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_RECOMMENDATIONS) return false;
  return value.every((entry) => {
    if (typeof entry !== 'object' || entry === null) return false;
    const candidate = entry as Record<string, unknown>;
    return isPiercingLocationId(candidate.locationId) && typeof candidate.reason === 'string';
  });
}

// Gemini's native structured-output schema (OpenAPI-subset via the Type
// enum) — passed as config.responseSchema alongside
// responseMimeType: 'application/json' in matchService.ts. locationId is
// enum-constrained to PIERCING_LOCATION_IDS so the model can't return a
// value the frontend catalog doesn't recognize.
export const MATCH_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    recommendations: {
      type: Type.ARRAY,
      minItems: '1',
      maxItems: String(MAX_RECOMMENDATIONS),
      items: {
        type: Type.OBJECT,
        properties: {
          locationId: { type: Type.STRING, enum: [...PIERCING_LOCATION_IDS] },
          reason: { type: Type.STRING },
        },
        required: ['locationId', 'reason'],
      },
    },
  },
  required: ['recommendations'],
};
