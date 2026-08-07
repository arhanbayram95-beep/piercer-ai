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

export interface JewelryItem {
  jewelryType: JewelryType;
  finish: JewelryFinish;
}

// "Multi-piercing stacking" — a piercer_pro_access-gated capability (see
// entitlementSlice.ts) letting a Pro user preview more than one jewelry
// piece in the same render. Capped so a request can't grow unbounded; the
// number itself is a product choice, not a technical limit.
export const MAX_STACKED_ITEMS = 3;

export interface StudioSlice {
  selectedJewelryType: JewelryType;
  selectedFinish: JewelryFinish;
  setJewelryType: (type: JewelryType) => void;
  setFinish: (finish: JewelryFinish) => void;
  // Additional jewelry pieces stacked on top of the primary
  // selectedJewelryType/selectedFinish — enforcement of who's allowed to
  // add to this list happens in the UI layer (PiercingStudioDrawer), since
  // this slice just holds selection state, not entitlement logic.
  stackedItems: JewelryItem[];
  addStackedItem: (item: JewelryItem) => void;
  removeStackedItem: (index: number) => void;
  clearStackedItems: () => void;
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
  stackedItems: [],
  renderResult: null,
  setJewelryType: (type) => set({ selectedJewelryType: type }),
  setFinish: (finish) => set({ selectedFinish: finish }),
  addStackedItem: (item) =>
    set((state) =>
      state.stackedItems.length >= MAX_STACKED_ITEMS ? state : { stackedItems: [...state.stackedItems, item] }
    ),
  removeStackedItem: (index) => set((state) => ({ stackedItems: state.stackedItems.filter((_, i) => i !== index) })),
  clearStackedItems: () => set({ stackedItems: [] }),
  setRenderResult: (result) => set({ renderResult: result }),
});
