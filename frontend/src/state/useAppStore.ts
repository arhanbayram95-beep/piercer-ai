import { create } from 'zustand';
import { CaptureSlice, createCaptureSlice } from './slices/captureSlice';
import { ConsentSlice, createConsentSlice } from './slices/consentSlice';
import { createDeviceSlice, DeviceSlice } from './slices/deviceSlice';
import { createEntitlementSlice, EntitlementSlice } from './slices/entitlementSlice';
import { createLocaleSlice, LocaleSlice } from './slices/localeSlice';
import { NavigationSlice, createNavigationSlice } from './slices/navigationSlice';
import { createStudioSlice, StudioSlice } from './slices/studioSlice';

type AppStore = NavigationSlice &
  ConsentSlice &
  CaptureSlice &
  EntitlementSlice &
  LocaleSlice &
  DeviceSlice &
  StudioSlice;

export const useAppStore = create<AppStore>()((...args) => ({
  ...createNavigationSlice(...args),
  ...createConsentSlice(...args),
  ...createCaptureSlice(...args),
  ...createEntitlementSlice(...args),
  ...createLocaleSlice(...args),
  ...createDeviceSlice(...args),
  ...createStudioSlice(...args),
}));
