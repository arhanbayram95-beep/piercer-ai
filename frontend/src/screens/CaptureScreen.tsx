import { fromByteArray } from 'base64-js';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Camera, useCameraPermission, usePhotoOutput } from 'react-native-vision-camera';
import PrimaryButton from '../components/common/PrimaryButton';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';
import { playCaptureChime } from '../utils/sound';

const CAPTURE_TIMEOUT_MS = 6000;

// capturePhoto()/getFileDataAsync() can hang indefinitely — neither
// resolving nor rejecting — when the native camera session's internal
// reconfigure races the request (the same instability behind the
// "ImageCaptureException: Camera is closed" teardown noise, just
// manifesting as a stall instead of a throw). Without this, a hang leaves
// isCapturing stuck true forever, silently soft-locking the shutter with no
// error and nothing to catch — confirmed on-device via adb: three
// consecutive shutter taps produced zero logcat activity after a stall.
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Capture timed out after ${ms}ms`)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

// Placeholder single-photo capture flow — piercing-specific multi-step
// capture (body part selection, guide overlays, etc.) is a later phase.
export default function CaptureScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isCapturing, setIsCapturing] = useState(false);
  // usePhotoOutput/outputs must stay reference-stable across renders — a
  // fresh options object or array literal here reconfigures (unbinds and
  // rebinds) the native camera session on every re-render, including the
  // one right after a capture. That races with the native pipeline still
  // tearing down the just-completed capture and throws
  // "ImageCaptureException: Camera is closed" as an unhandled rejection.
  const photoOutput = usePhotoOutput(
    useMemo(() => ({ containerFormat: 'jpeg' as const, quality: 0.6 }), [])
  );
  const cameraOutputs = useMemo(() => [photoOutput], [photoOutput]);
  const flash = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  const addImage = useAppStore((s) => s.addImage);
  const clearImages = useAppStore((s) => s.clearImages);
  const goToScreen = useAppStore((s) => s.goToScreen);
  const goBack = useAppStore((s) => s.goBack);
  const t = useTranslation();

  // Discards whatever's been captured so far in this session (never
  // partial-submitted — process-and-discard applies to an abandoned
  // capture same as a completed one) and returns wherever the user came
  // from, same as the permission-denied view's close button.
  const handleCancel = () => {
    clearImages();
    goBack();
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  const handleCapture = async () => {
    if (isCapturing) return;

    setIsCapturing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    playCaptureChime();

    Animated.sequence([
      Animated.timing(flash, { toValue: 1, duration: 80, useNativeDriver: true }),
      Animated.timing(flash, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();

    // No catch-less finally here on purpose: a failed capturePhoto()/
    // getFileDataAsync() (the same underlying native camera instability as
    // the "Camera is closed" teardown race) must NOT navigate onward — a
    // try/finally alone would do that regardless of success.
    //
    // The very first capturePhoto() per screen mount reliably races a
    // one-time native session reconfigure (confirmed via on-device logcat:
    // the library rebinds use-cases the instant a real capture is
    // requested, and that reconfigure's own unbind step aborts the request
    // that triggered it — "ImageCaptureException: Camera is closed",
    // ~100ms, independent of performanceMode). By the time it fails, that
    // reconfigure has already completed, so an immediate retry hits an
    // already-stabilized session — confirmed on-device this succeeds where
    // a single attempt doesn't. Retrying automatically here, rather than
    // making the user tap the shutter again, since the first failure is a
    // known one-time cost, not a signal anything is actually wrong.
    const MAX_CAPTURE_ATTEMPTS = 2;
    let succeeded = false;
    let lastError: unknown;
    for (let attempt = 1; attempt <= MAX_CAPTURE_ATTEMPTS && !succeeded; attempt++) {
      try {
        const photo = await withTimeout(photoOutput.capturePhoto({}, {}), CAPTURE_TIMEOUT_MS);
        const data = await withTimeout(photo.getFileDataAsync(), CAPTURE_TIMEOUT_MS);
        addImage(fromByteArray(new Uint8Array(data)));
        photo.dispose();
        succeeded = true;
      } catch (error) {
        lastError = error;
        console.error(`Photo capture failed (attempt ${attempt}/${MAX_CAPTURE_ATTEMPTS}):`, error);
        if (attempt < MAX_CAPTURE_ATTEMPTS) {
          // The reconfigure the failed attempt triggered is still rebinding
          // at this point (confirmed on-device: retrying immediately hits a
          // *different*, earlier-stage error — "Not bound to a valid
          // Camera" — because the use case isn't reattached yet). The full
          // unbind-to-onCameraControlReady cycle measured ~100-150ms on
          // this device; wait past that before retrying.
          await new Promise((resolve) => setTimeout(resolve, 400));
        }
      }
    }

    if (!succeeded) {
      console.error('Photo capture failed after retry:', lastError);
      setIsCapturing(false);
      Alert.alert(t('capture.error.title'), t('capture.error.body'));
      return;
    }

    setIsCapturing(false);
    // Placeholder destination — piercing preview flow is a later phase.
    goToScreen('settings');
  };

  if (!hasPermission) {
    return (
      <View style={[styles.container, styles.permissionContainer]} testID="capture-screen">
        <Pressable
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={styles.closeButton}
          testID="capture-close-button"
        >
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
        <Text style={styles.headline}>{t('capture.permission.headline')}</Text>
        <Text style={styles.body}>{t('capture.permission.body')}</Text>
        <PrimaryButton label={t('capture.permission.button')} onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="capture-screen">
      <Camera
        style={StyleSheet.absoluteFill}
        isActive
        device="back"
        outputs={cameraOutputs}
        onError={(error) => console.error('Camera error:', error)}
      />

      <Animated.View pointerEvents="none" style={[styles.flashOverlay, { opacity: flash }]} />

      <View style={styles.overlay}>
        <Pressable
          onPress={handleCancel}
          accessibilityRole="button"
          accessibilityLabel={t('capture.cancelButton')}
          style={styles.closeButton}
          testID="capture-cancel-button"
        >
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>

        <View style={styles.guideWrap}>
          <Animated.View style={[styles.guideRing, { transform: [{ scale: pulse }] }]} />
        </View>

        <View style={styles.footer}>
          <Pressable
            onPress={handleCapture}
            disabled={isCapturing}
            accessibilityRole="button"
            accessibilityLabel="Capture photo"
            testID="shutter-button"
            style={styles.shutterOuter}
          >
            <View style={styles.shutterInner} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.start,
  },
  permissionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.containerPadding,
  },
  closeButton: {
    position: 'absolute',
    top: Theme.spacing.xl,
    right: Theme.spacing.gutter,
    width: 40,
    height: 40,
    borderRadius: Theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  closeIcon: {
    color: Theme.colors.text.secondary,
    fontSize: 16,
  },
  headline: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.accent.goldSecondary,
    textAlign: 'center',
  },
  body: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
  },
  flashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#FFFFFF',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(26, 5, 11, 0.15)',
  },
  guideWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideRing: {
    width: 300,
    height: 370,
    borderRadius: 170,
    borderWidth: 2,
    borderColor: Theme.colors.accent.goldSecondary,
    shadowColor: Theme.colors.accent.goldSecondary,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  footer: {
    alignItems: 'center',
    gap: Theme.spacing.xs,
    paddingBottom: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.containerPadding,
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: Theme.radius.full,
    borderWidth: 3,
    borderColor: Theme.colors.accent.goldSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: Theme.radius.full,
    backgroundColor: Theme.colors.accent.goldSecondary,
  },
});
