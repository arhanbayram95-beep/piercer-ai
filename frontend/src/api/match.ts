import { PiercingLocationId } from '../content/piercingLocations';
import { API_BASE_URL, USE_MOCK_API } from './config';

// The only file allowed to talk to the backend for the photo-based
// personality/body-type matching flow (module boundary, CLAUDE.md).
// Mirrors backend/src/services/matchSchema.ts's MatchRequest/MatchResult
// shapes; no shared package between frontend/backend, so a change to
// either side's shape has to land in both by hand.
export interface MatchPhotoRequest {
  photo: string;
}

export interface MatchRecommendation {
  locationId: PiercingLocationId;
  reason: string;
}

export interface MatchPhotoResult {
  recommendations: MatchRecommendation[];
}

export class MatchApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

// Stands in for a running backend/AI key during local development and
// testing (EXPO_PUBLIC_USE_MOCK_API=true, see api/config.ts) — returns a
// couple of fixed recommendations so the photo-matching flow is exercisable
// end to end without either.
function mockMatchPhoto(): Promise<MatchPhotoResult> {
  return Promise.resolve({
    recommendations: [
      { locationId: 'helix', reason: 'Your ear shape frames a helix piercing nicely.' },
      { locationId: 'septum', reason: 'A septum ring would suit your look.' },
    ],
  });
}

export async function matchPhoto(request: MatchPhotoRequest): Promise<MatchPhotoResult> {
  if (USE_MOCK_API) return mockMatchPhoto();

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/v1/match/photo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  } catch {
    throw new MatchApiError('Could not reach the piercer.ai server. Check your connection and try again.');
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new MatchApiError(body?.error ?? 'Something went wrong finding your matches.', response.status);
  }

  return response.json();
}
