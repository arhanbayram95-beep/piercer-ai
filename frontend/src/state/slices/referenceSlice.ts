import { StateCreator } from 'zustand';
import { PiercingLocationId } from '../../content/piercingLocations';

// Deliberately its own tiny slice rather than folded into studioSlice —
// this is "which location card did the user tap on the reference page,"
// unrelated to studioSlice's "which location/jewelry is the user actively
// trying on." Conflating the two would mean opening a reference detail page
// could silently overwrite an in-progress Try On selection, or vice versa.
export interface ReferenceSlice {
  viewedLocationId: PiercingLocationId | null;
  setViewedLocationId: (locationId: PiercingLocationId | null) => void;
}

export const createReferenceSlice: StateCreator<ReferenceSlice> = (set) => ({
  viewedLocationId: null,
  setViewedLocationId: (locationId) => set({ viewedLocationId: locationId }),
});
