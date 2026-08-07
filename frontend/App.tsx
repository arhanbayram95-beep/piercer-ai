import { StatusBar } from 'expo-status-bar';
import { LogBox, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { Theme } from './src/ui/theme';

// react-native-vision-camera-face-detector's native session reconfigures
// (unbind + rebind) after every capturePhoto() call as part of its own
// internal capture-mode handling — independent of anything this app's
// CaptureScreen does, confirmed via on-device logcat (it fires even between
// identical-camera-facing steps, with no relevant prop change on our end).
// That reconfigure occasionally races the tail end of the just-completed
// capture's native teardown and throws
// "ImageCaptureException: Camera is closed" from inside the library's own
// coroutine — a promise this app never has a handle on, so it can't be
// caught with a try/catch here. The photo itself is already safely
// retrieved before this fires; it's a benign, known-noisy teardown race,
// not a functional failure. Suppressed so it doesn't hijack the screen with
// a full LogBox red-box on every capture in dev/dev-client builds.
LogBox.ignoreLogs(['ImageCaptureException', 'Camera is closed']);

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <AppNavigator />
        <StatusBar style="light" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.start,
  },
});
