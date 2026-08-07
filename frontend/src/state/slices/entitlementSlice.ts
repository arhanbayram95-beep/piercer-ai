import { StateCreator } from 'zustand';

// Derived from RevenueCat customer-info hooks once RevenueCat is wired up
// (Phase 5.1) — until then this stays a plain flag set by the paywall UI.
export interface EntitlementSlice {
  isProActive: boolean;
  setProActive: (value: boolean) => void;
}

export const createEntitlementSlice: StateCreator<EntitlementSlice> = (set) => ({
  isProActive: false,
  setProActive: (value) => set({ isProActive: value }),
});
