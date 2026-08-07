import { StateCreator } from 'zustand';

// In-memory only, per PROJECT_SPEC.md §3 process-and-discard architecture —
// never persisted, and must be cleared once the backend response returns.
export interface CaptureSlice {
  images: string[];
  addImage: (base64: string) => void;
  clearImages: () => void;
}

export const createCaptureSlice: StateCreator<CaptureSlice> = (set) => ({
  images: [],
  addImage: (base64) => set((state) => ({ images: [...state.images, base64] })),
  clearImages: () => set({ images: [] }),
});
