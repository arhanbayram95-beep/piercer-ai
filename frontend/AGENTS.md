# Expo HAS CHANGED

This app is on **Expo SDK 57** (React Native 0.86) — upgraded from SDK 54 on
2026-07-29 to satisfy `react-native-vision-camera` v5's worklets runtime; see
`PROJECT_SPEC.md` §3 for the full cascade. Read the exact versioned docs at
https://docs.expo.dev/versions/v57.0.0/ before writing any code, and check
`package.json` for the version actually installed rather than assuming.

Two consequences of that upgrade worth knowing before you touch anything:

* **`expo-camera` is gone.** Capture runs on
  `react-native-vision-camera-face-detector`'s `<Camera>` + `usePhotoOutput`
  (`src/screens/CaptureScreen.tsx`).
* **`expo-av` is gone**, replaced by `expo-audio`'s imperative
  `createAudioPlayer` API (`src/utils/sound.ts`).

The native modules here (vision-camera, `react-native-purchases`) mean this
app no longer runs in plain Expo Go — it needs an EAS dev-client build.
