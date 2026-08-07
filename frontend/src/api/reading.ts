import { API_BASE_URL, USE_MOCK_API } from './config';
import { analyzeReadingMock } from './mockReading';
import { AnalyzeReadingPayload, ReadingResult } from './types';

export type {
  AnalyzeReadingPayload,
  CareerPathResult,
  CharacterAnalysisResult,
  ReadingModuleId,
  ReadingResult,
  RelationshipHarmonyResult,
} from './types';

// 'NO_FACE_DETECTED' is a forward-compatible hook that nothing raises yet.
// On-device detection shipped in IMPLEMENTATION_PLAN.md 6.1, but it rejects
// a faceless frame at the shutter in CaptureScreen — before any API call —
// so it never travels as an error code. This stays wired for the case where
// the backend starts reporting it: AnalyzingScreen already routes it to
// NoFaceDetectedScreen.
export type ReadingApiErrorCode = 'NO_FACE_DETECTED';

export class ReadingApiError extends Error {
  code?: ReadingApiErrorCode;

  constructor(message: string, code?: ReadingApiErrorCode) {
    super(message);
    this.code = code;
  }
}

// The only place in the app that talks to the backend, per CLAUDE.md's
// frontend/src/api/ boundary. Screens must go through this, never fetch
// directly.
export async function analyzeReading(payload: AnalyzeReadingPayload): Promise<ReadingResult> {
  if (USE_MOCK_API) {
    return analyzeReadingMock(payload);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/v1/reading/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (cause) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    throw new ReadingApiError(
      `Could not reach the Face Reader server. Check your connection and try again. (${detail})`
    );
  }

  if (!response.ok) {
    throw new ReadingApiError(`Face Reader server returned an error (${response.status}).`);
  }

  return (await response.json()) as ReadingResult;
}
