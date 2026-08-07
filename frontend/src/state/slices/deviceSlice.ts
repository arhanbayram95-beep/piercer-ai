import * as Crypto from 'expo-crypto';
import { StateCreator } from 'zustand';

// Regenerated each cold start — there is no persisted storage (e.g.
// AsyncStorage) in the project yet, so this anonymous ID is stable for the
// current session only, not across app launches.
export interface DeviceSlice {
  anonymousId: string;
}

export const createDeviceSlice: StateCreator<DeviceSlice> = () => ({
  anonymousId: `faceai-anon-${Crypto.randomUUID()}`,
});
