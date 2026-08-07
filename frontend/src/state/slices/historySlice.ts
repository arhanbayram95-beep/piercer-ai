import { StateCreator } from 'zustand';
import * as Crypto from 'expo-crypto';
import { ReadingResult } from '../../api/types';

export interface ReadingHistoryEntry {
  id: string;
  reading: ReadingResult;
  completedAt: number;
}

// Text-only reading results, never the photos that produced them — those
// stay process-and-discard per PROJECT_SPEC.md §3 (see CaptureSlice). This
// list is in-memory only and resets on app restart: no local-storage
// dependency (e.g. AsyncStorage) is in PROJECT_SPEC.md yet, and CLAUDE.md
// requires the spec to be updated before adding one.
export interface HistorySlice {
  history: ReadingHistoryEntry[];
  logReading: (reading: ReadingResult) => void;
}

export const createHistorySlice: StateCreator<HistorySlice> = (set) => ({
  history: [],
  logReading: (reading) =>
    set((state) => ({
      history: [{ id: Crypto.randomUUID(), reading, completedAt: Date.now() }, ...state.history],
    })),
});
