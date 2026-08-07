import { Modality } from '@google/genai';
import { VisionModelClient } from './geminiClient';
import { assembleRenderPrompt } from './renderPrompt';
import { RenderRequest, RenderResult } from './renderSchema';

// Image-EDITING model, deliberately distinct from PROJECT_SPEC.md §4's
// `gemini-flash-latest` (a text/vision-in, text-out model used for the old
// reading feature's JSON responses). `gemini-flash-latest` cannot return
// image bytes — Gemini's image generation/editing capability lives on a
// separate model family. Verified against @google/genai@2.13.0's own type
// definitions (GenerateContentConfig.responseModalities: Modality[], with
// Modality.IMAGE present in the enum) plus Google's current model docs
// before picking this over guessing: `gemini-2.5-flash-image` ("nano
// banana") is the production image generation/editing model as of
// 2026-08-07. Unlike `gemini-flash-latest`, there is no publicly documented
// auto-updating alias for the image model as of this writing — pin the
// dated name and revisit if Google introduces one, same reasoning
// PROJECT_SPEC.md §4 gives for preferring aliases where they exist.
const IMAGE_MODEL = 'gemini-2.5-flash-image';

// Structured-JSON output (config.responseSchema) is mutually exclusive with
// image-output modalities in the Gemini API — this call uses
// responseModalities instead, requesting both so the model can (optionally)
// return an explanatory text part alongside the edited image; only the
// image part is used by this service, per RenderResult's shape.
async function callGeminiForRender(
  client: VisionModelClient,
  request: RenderRequest
): Promise<{ data: string; mimeType: string } | null> {
  const prompt = assembleRenderPrompt(request.jewelryType, request.finish);

  const response = await client.models.generateContent({
    model: IMAGE_MODEL,
    contents: [
      {
        role: 'user',
        parts: [{ inlineData: { mimeType: 'image/jpeg', data: request.photo } }, { text: prompt }],
      },
    ],
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((part) => part.inlineData?.data);
  if (!imagePart?.inlineData?.data) return null;

  return {
    data: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType ?? 'image/png',
  };
}

export class RenderGenerationError extends Error {}

// Business logic only, no req/reply — per CLAUDE.md's backend/src/services/
// module-boundary rule. `request.photo` is never written to disk or a
// database (process-and-discard, PROJECT_SPEC.md §3) — it only ever exists
// as this in-memory string for the duration of the call.
export async function generateRender(client: VisionModelClient, request: RenderRequest): Promise<RenderResult> {
  const result = await callGeminiForRender(client, request);
  if (!result) {
    throw new RenderGenerationError('The AI model did not return a rendered image.');
  }

  return { renderedImage: result.data, mimeType: result.mimeType };
}
