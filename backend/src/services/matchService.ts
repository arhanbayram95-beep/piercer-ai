import { VisionModelClient } from './geminiClient';
import { assembleMatchPrompt } from './matchPrompt';
import { isValidRecommendations, MATCH_RESPONSE_SCHEMA, MatchRequest, MatchResult } from './matchSchema';

// Text/vision-in, JSON-out model — the SAME model family PROJECT_SPEC.md §4
// originally documented (`gemini-flash-latest`), unlike render.ts's
// `gemini-2.5-flash-image`. This endpoint returns structured JSON
// (recommended location IDs + reasons), not an image, so Gemini's
// responseSchema/responseMimeType mechanism applies directly — no model-
// capability mismatch to work around here.
const MATCH_MODEL = 'gemini-flash-latest';

export class MatchGenerationError extends Error {}

// Business logic only, no req/reply — per CLAUDE.md's backend/src/services/
// module-boundary rule. `request.photo` is never written to disk or a
// database (process-and-discard, PROJECT_SPEC.md §3).
export async function generateMatch(client: VisionModelClient, request: MatchRequest): Promise<MatchResult> {
  const prompt = assembleMatchPrompt();

  const response = await client.models.generateContent({
    model: MATCH_MODEL,
    contents: [
      {
        role: 'user',
        parts: [{ inlineData: { mimeType: 'image/jpeg', data: request.photo } }, { text: prompt }],
      },
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: MATCH_RESPONSE_SCHEMA,
    },
  });

  const rawText = response.text;
  if (!rawText) {
    throw new MatchGenerationError('The AI model did not return any recommendations.');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new MatchGenerationError('The AI model returned a response that could not be parsed.');
  }

  const recommendations = (parsed as { recommendations?: unknown } | null)?.recommendations;
  if (!isValidRecommendations(recommendations)) {
    throw new MatchGenerationError('The AI model returned recommendations in an unexpected shape.');
  }

  return { recommendations };
}
