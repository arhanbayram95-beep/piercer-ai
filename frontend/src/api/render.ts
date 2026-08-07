import { JewelryFinish, JewelryItem, JewelryType } from '../state/slices/studioSlice';
import { API_BASE_URL, USE_MOCK_API } from './config';

// The only file allowed to talk to the backend for the piercing render flow
// (module boundary, CLAUDE.md) — screens/components must go through this,
// never call fetch directly. Mirrors backend/src/services/renderSchema.ts's
// RenderRequest/RenderResult shapes; no shared package between frontend/
// backend, so a change to either side's shape has to land in both by hand.
export interface RenderPreviewRequest {
  photo: string;
  jewelryType: JewelryType;
  finish: JewelryFinish;
  // Pro-only "multi-piercing stacking" (studioSlice.ts) — additional pieces
  // rendered alongside the primary jewelryType/finish selection above.
  additionalItems?: JewelryItem[];
}

export interface RenderPreviewResult {
  renderedImage: string;
  mimeType: string;
}

export class RenderApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

// Stands in for a running backend/AI key during local development and
// testing (EXPO_PUBLIC_USE_MOCK_API=true, see api/config.ts) — echoes the
// original photo back as the "rendered" result so the full capture ->
// studio -> preview flow is exercisable end to end without either.
function mockRenderPreview(request: RenderPreviewRequest): Promise<RenderPreviewResult> {
  return Promise.resolve({ renderedImage: request.photo, mimeType: 'image/jpeg' });
}

export async function renderPreview(request: RenderPreviewRequest): Promise<RenderPreviewResult> {
  if (USE_MOCK_API) return mockRenderPreview(request);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/v1/render/preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  } catch {
    throw new RenderApiError('Could not reach the piercer.ai server. Check your connection and try again.');
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new RenderApiError(body?.error ?? 'Something went wrong generating your preview.', response.status);
  }

  return response.json();
}
