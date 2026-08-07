import { GoogleGenAI } from '@google/genai';

// Narrow interface — callers only ever need models.generateContent, so
// tests can inject a mock without pulling in the real Gemini SDK.
export interface VisionModelClient {
  models: {
    generateContent: GoogleGenAI['models']['generateContent'];
  };
}

export function createGeminiClient(apiKey: string): VisionModelClient {
  return new GoogleGenAI({ apiKey });
}
