import { StateCreator } from 'zustand';

// Derived from RevenueCat customer-info hooks once RevenueCat is wired up
// (Phase 5.1) — until then this stays a plain flag set by the paywall UI.
// `piercer_pro_access` (utils/purchases.ts) is the RevenueCat entitlement
// identifier this flag tracks. Unlike the old face-reading app (no free
// tier at all — paywall gated every screen past onboarding), piercer.ai's
// product brief calls for a freemium hook: a small number of free renders,
// then unlimited renders + multi-piercing stacking (studioSlice.ts) behind
// piercer_pro_access. See StudioScreen.tsx for where this is enforced.
export const FREE_RENDER_LIMIT = 1;

export interface EntitlementSlice {
  isProActive: boolean;
  setProActive: (value: boolean) => void;
  // In-memory only, resets on app restart — same as every other session-
  // scoped piece of state here (PROJECT_SPEC.md §3). Good enough for a
  // soft "try it once" hook; a real per-account free-tier counter would
  // need server-side tracking, out of scope for this pass.
  freeRendersUsed: number;
  incrementFreeRendersUsed: () => void;
}

export const createEntitlementSlice: StateCreator<EntitlementSlice> = (set) => ({
  isProActive: false,
  setProActive: (value) => set({ isProActive: value }),
  freeRendersUsed: 0,
  incrementFreeRendersUsed: () => set((state) => ({ freeRendersUsed: state.freeRendersUsed + 1 })),
});
