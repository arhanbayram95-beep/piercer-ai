import { Platform } from 'react-native';
import { getStoreListingUrl } from './storeLinks';

describe('getStoreListingUrl', () => {
  afterEach(() => {
    Platform.OS = 'ios';
  });

  it('returns an App Store URL on iOS', () => {
    Platform.OS = 'ios';
    expect(getStoreListingUrl()).toMatch(/^https:\/\/apps\.apple\.com\/app\/id/);
  });

  it('returns a Play Store URL on Android', () => {
    Platform.OS = 'android';
    expect(getStoreListingUrl()).toMatch(/^https:\/\/play\.google\.com\/store\/apps\/details\?id=/);
  });
});
