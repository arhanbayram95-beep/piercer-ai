import { StateCreator } from 'zustand';
import { ReadingResult } from '../../api/reading';

export interface ResultSlice {
  reading: ReadingResult | null;
  setReading: (reading: ReadingResult | null) => void;
}

export const createResultSlice: StateCreator<ResultSlice> = (set) => ({
  reading: null,
  setReading: (reading) => set({ reading }),
});
