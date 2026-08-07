import { StateCreator } from 'zustand';

// Jewelry catalog for the Piercing Studio drawer (PiercingStudioDrawer.tsx) —
// selections here are what StudioScreen sends to POST /api/v1/render/preview
// alongside the captured photo (see api/render.ts, added in a later phase).
export const JEWELRY_TYPES = ['hoops', 'studs', 'barbells', 'industrial', 'septum', 'dermal'] as const;
export type JewelryType = (typeof JEWELRY_TYPES)[number];

export const JEWELRY_FINISHES = ['silver', 'gold', 'titanium', 'blackSteel'] as const;
export type JewelryFinish = (typeof JEWELRY_FINISHES)[number];

export interface RenderResult {
  renderedImage: string;
  mimeType: string;
}

export interface StudioSlice {
  selectedJewelryType: JewelryType;
  selectedFinish: JewelryFinish;
  setJewelryType: (type: JewelryType) => void;
  setFinish: (finish: JewelryFinish) => void;
  // Holds the last successful POST /api/v1/render/preview result (see
  // api/render.ts) so PreviewScreen can read it without re-fetching —
  // cleared whenever a fresh render is kicked off, same in-memory-only
  // lifetime as the source photo (PROJECT_SPEC.md §3, process-and-discard).
  renderResult: RenderResult | null;
  setRenderResult: (result: RenderResult | null) => void;
}

export const createStudioSlice: StateCreator<StudioSlice> = (set) => ({
  selectedJewelryType: 'hoops',
  selectedFinish: 'silver',
  renderResult: null,
  setJewelryType: (type) => set({ selectedJewelryType: type }),
  setFinish: (finish) => set({ selectedFinish: finish }),
  setRenderResult: (result) => set({ renderResult: result }),
});
