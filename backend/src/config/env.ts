import 'dotenv/config';

export interface AppEnv {
  port: number;
  geminiApiKey: string;
  revenueCatApiKey: string;
}

// Only called when the server actually starts (server.ts), never at import
// time from route/service modules — so unit tests can exercise those with a
// mocked reading model client without needing real secrets in .env.
export function loadEnv(): AppEnv {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY is not set. Copy backend/.env.example to backend/.env and fill it in.');
  }

  return {
    port: Number(process.env.PORT) || 3000,
    geminiApiKey,
    revenueCatApiKey: process.env.REVENUECAT_API_KEY ?? '',
  };
}
