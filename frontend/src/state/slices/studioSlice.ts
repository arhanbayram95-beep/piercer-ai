import { StateCreator } from 'zustand';

// Jewelry catalog for the Piercing Studio drawer (PiercingStudioDrawer.tsx) —
// selections here are what StudioScreen sends to POST /api/v1/render/preview
// alongside the captured photo (see api/render.ts, added in a later phase).
export const JEWELRY_TYPES = ['hoops', 'studs', 'barbells', 'industrial', 'septum', 'dermal'] as const;
export type JewelryType = (typeof JEWELRY_TYPES)[number];

export const JEWELRY_FINISHES = ['silver', 'gold', 'titanium', 'blackSteel'] as const;
export type JewelryFinish = (typeof JEWELRY_FINISHES)[number];

export interface StudioSlice {
  selectedJewelryType: JewelryType;
  selectedFinish: JewelryFinish;
  setJewelryType: (type: JewelryType) => void;
  setFinish: (finish: JewelryFinish) => void;
}

export const createStudioSlice: StateCreator<StudioSlice> = (set) => ({
  selectedJewelryType: 'hoops',
  selectedFinish: 'silver',
  setJewelryType: (type) => set({ selectedJewelryType: type }),
  setFinish: (finish) => set({ selectedFinish: finish }),
});
