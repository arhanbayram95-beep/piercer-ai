import { StateCreator } from 'zustand';

// Age gate + image-processing consent per PROJECT_SPEC.md §2.1 — both are
// required before the capture flow may start; neither may be bypassed.
export interface ConsentSlice {
  ageVerified: boolean;
  imageConsentGiven: boolean;
  setAgeVerified: (value: boolean) => void;
  setImageConsentGiven: (value: boolean) => void;
}

export const createConsentSlice: StateCreator<ConsentSlice> = (set) => ({
  ageVerified: false,
  imageConsentGiven: false,
  setAgeVerified: (value) => set({ ageVerified: value }),
  setImageConsentGiven: (value) => set({ imageConsentGiven: value }),
});
