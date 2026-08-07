import { Schema, Type } from '@google/genai';
import { ReadingModelClient } from './geminiClient';
import {
  MODULE_PHOTO_COUNTS,
  MODULE_RESULT_KIND,
  READING_SCHEMAS,
  ReadingModuleId,
  ReadingResult,
} from './readingSchema';
import { READING_SYSTEM_PROMPTS } from './systemPrompt';

export class ReadingServiceError extends Error {}

// 2026-07-28: gemini-2.5-flash returns a 404 ("no longer available to new
// users") on newly-created API keys/projects — confirmed via a live
// generateContent call, not a guess. gemini-flash-latest is Google's
// auto-updating alias for the current recommended flash model, chosen over
// pinning another specific version so this doesn't need another manual
// swap next time a dated model gets deprecated. See PROJECT_SPEC.md §4.
const MODEL = 'gemini-flash-latest';

// Product ask (2026-07-28): open-ended picks (celebrity matches, spirit
// animals, archetype tags) were clustering on the model's own "safe"
// defaults at the API's default temperature. Pushed up (valid range is
// (0, 2] per the SDK) to genuinely widen the pool — paired with
// VARIETY_GUIDANCE in systemPrompt.ts, which does the same job in words.
const READING_TEMPERATURE = 1.3;

// process-and-discard per PROJECT_SPEC.md §3: this function never persists
// the incoming base64 strings anywhere (no disk, no db, no in-memory cache
// outside its own call stack), and holds no reference to them after it
// returns. That is the extent "memory clearing" means in a Node/JS
// process — there is no secure-wipe primitive to reach for here.
export async function generateReading(
  client: ReadingModelClient,
  photos: string[],
  moduleId: ReadingModuleId = 'three-expression'
): Promise<ReadingResult> {
  const expectedCount = MODULE_PHOTO_COUNTS[moduleId];
  if (photos.length !== expectedCount) {
    throw new ReadingServiceError(
      `The ${moduleId} reading needs exactly ${expectedCount} photo(s), got ${photos.length}.`
    );
  }

  let responseText: string | undefined;
  try {
    const response = await client.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            ...photos.map((data) => ({ inlineData: { mimeType: 'image/jpeg', data } })),
            { text: `These are ${photos.length} photo(s) captured for this reading, in order. Generate the reading now.` },
          ],
        },
      ],
      config: {
        systemInstruction: READING_SYSTEM_PROMPTS[moduleId],
        responseMimeType: 'application/json',
        responseSchema: READING_SCHEMAS[moduleId],
        temperature: READING_TEMPERATURE,
      },
    });
    responseText = response.text;
  } catch (cause) {
    throw new ReadingServiceError('Failed to reach the Gemini API.', { cause });
  }

  if (!responseText) {
    throw new ReadingServiceError('Gemini response did not include any text output.');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(responseText);
  } catch (cause) {
    throw new ReadingServiceError('Gemini response was not valid JSON.', { cause });
  }

  return validateReadingResult(parsed, moduleId);
}

// Walks the module's own responseSchema (readingSchema.ts) recursively,
// rather than a hand-maintained list of top-level keys — Gemini's
// `responseSchema` is a strong constraint but not a guarantee, and the
// frontend's card renderers (ReadingCards.tsx) call .map() on nested arrays
// like `domains_card.top_industry_pills` with no defensive fallback, per
// this project's "validate at the boundary, trust it past that point"
// convention (CLAUDE.md). A response missing a nested array must fail here
// as a clean 502, not reach RevealScreen as a render crash.
function assertConformsToSchema(value: unknown, schema: Schema, path: string): void {
  switch (schema.type) {
    case Type.OBJECT: {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new ReadingServiceError(`Gemini response ${path} was not an object.`);
      }
      const body = value as Record<string, unknown>;
      for (const key of schema.required ?? []) {
        if (!(key in body)) {
          throw new ReadingServiceError(`Gemini response ${path} was missing "${key}".`);
        }
        const propSchema = schema.properties?.[key];
        if (propSchema) {
          assertConformsToSchema(body[key], propSchema, `${path}.${key}`);
        }
      }
      return;
    }
    case Type.ARRAY: {
      if (!Array.isArray(value)) {
        throw new ReadingServiceError(`Gemini response ${path} was not an array.`);
      }
      if (schema.items) {
        value.forEach((item, index) => assertConformsToSchema(item, schema.items as Schema, `${path}[${index}]`));
      }
      return;
    }
    default:
      // STRING/INTEGER/etc. leaves: the schema already constrains their
      // shape and enum values at generation time — only presence is worth
      // re-checking here.
      if (value === undefined || value === null) {
        throw new ReadingServiceError(`Gemini response ${path} was missing.`);
      }
  }
}

function validateReadingResult(input: unknown, moduleId: ReadingModuleId): ReadingResult {
  assertConformsToSchema(input, READING_SCHEMAS[moduleId], 'body');

  // Stamped here rather than trusted from the model: the module that was
  // asked for is the authoritative answer to which shape came back.
  return { ...(input as Record<string, unknown>), module: MODULE_RESULT_KIND[moduleId] } as ReadingResult;
}
