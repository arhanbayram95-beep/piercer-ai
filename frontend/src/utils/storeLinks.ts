import { Platform } from 'react-native';

// TODO: replace once Face Reader has a real App Store Connect / Google Play
// Console listing (see app.json, which has no ios.bundleIdentifier or
// android.package yet either) - these placeholders keep "Rate on App Store"
// wired to real navigation logic now, without pretending a listing exists.
const IOS_APP_STORE_ID = 'REPLACE_WITH_REAL_APP_STORE_ID';
const ANDROID_PACKAGE_NAME = 'REPLACE_WITH_REAL_PACKAGE_NAME';

export function getStoreListingUrl(): string {
  if (Platform.OS === 'ios') {
    return `https://apps.apple.com/app/id${IOS_APP_STORE_ID}`;
  }
  if (Platform.OS === 'android') {
    return `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}`;
  }
  return `https://apps.apple.com/app/id${IOS_APP_STORE_ID}`;
}
