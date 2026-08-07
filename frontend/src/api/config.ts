// Backend runs on port 3000 (see backend/.env.example / CLAUDE.md).
// localhost works from a simulator; a physical device needs the dev
// machine's LAN IP — set EXPO_PUBLIC_API_BASE_URL in that case.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

// Pseudo-API mode for testing the full capture -> analyzing -> reveal flow
// without a running backend or AI provider key configured — set
// EXPO_PUBLIC_USE_MOCK_API=true in the environment (e.g. `eas build` env,
// or `EXPO_PUBLIC_USE_MOCK_API=true npx expo start`). Defaults to off, so
// production builds always hit the real backend unless this is set
// explicitly. Remove before public release.
export const USE_MOCK_API = process.env.EXPO_PUBLIC_USE_MOCK_API === 'true';
