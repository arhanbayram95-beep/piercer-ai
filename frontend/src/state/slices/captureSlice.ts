import { StateCreator } from 'zustand';
import { ReadingModuleId } from '../../api/types';

// In-memory only, per PROJECT_SPEC.md §3 process-and-discard architecture —
// never persisted, and must be cleared once the backend response returns.
// A plain ordered array rather than a fixed rest/grin/stern record because
// the photo count and meaning of each slot now vary per module (see
// MODULE_PHOTO_COUNTS in api/types.ts) — Character Analysis captures 3,
// Relationship Harmony 2, Career Match 1.
export interface CaptureSlice {
  images: string[];
  addImage: (base64: string) => void;
  clearImages: () => void;
  // Which reading module the current capture session is for — set by
  // AnalyzeScreen before navigating into capture, read by CaptureScreen to
  // pick the right step sequence and by AnalyzingScreen when it calls the
  // backend. Defaults to the original module so any screen that skips
  // selection (e.g. a future direct-entry point) still gets a sensible
  // reading.
  selectedModule: ReadingModuleId;
  setSelectedModule: (module: ReadingModuleId) => void;
}

export const createCaptureSlice: StateCreator<CaptureSlice> = (set) => ({
  images: [],
  addImage: (base64) => set((state) => ({ images: [...state.images, base64] })),
  clearImages: () => set({ images: [] }),
  selectedModule: 'three-expression',
  setSelectedModule: (module) => set({ selectedModule: module }),
});
