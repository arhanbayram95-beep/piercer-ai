import { GoogleGenAI } from '@google/genai';

// Narrow interface — readingService only ever needs models.generateContent,
// so tests can inject a mock without pulling in the real Gemini SDK.
export interface ReadingModelClient {
  models: {
    generateContent: GoogleGenAI['models']['generateContent'];
  };
}

export function createGeminiClient(apiKey: string): ReadingModelClient {
  return new GoogleGenAI({ apiKey });
}
