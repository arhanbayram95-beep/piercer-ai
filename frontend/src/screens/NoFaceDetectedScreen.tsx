import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/common/PrimaryButton';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

// Destination for the on-device face-check (IMPLEMENTATION_PLAN.md 6.1).
// Two routes land here, both having already discarded the captured photos:
// CaptureScreen, when the shutter is pressed with no face in frame (the
// live path), and AnalyzingScreen, if a ReadingApiError('NO_FACE_DETECTED')
// ever comes back from the API (wired, but nothing raises that code yet).
export default function NoFaceDetectedScreen() {
  const goToScreen = useAppStore((s) => s.goToScreen);
  const t = useTranslation();

  return (
    <View style={styles.container} testID="no-face-detected-screen">
      <Text style={styles.headline}>{t('noFaceDetected.headline')}</Text>
      <Text style={styles.body}>{t('noFaceDetected.body')}</Text>

      <View style={styles.actions}>
        <PrimaryButton
          label={t('noFaceDetected.retry')}
          onPress={() => goToScreen('capture')}
          testID="no-face-detected-retry-button"
        />
        <PrimaryButton
          label={t('noFaceDetected.backHome')}
          variant="secondary"
          onPress={() => goToScreen('analyze')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.start,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.containerPadding,
    gap: Theme.spacing.sm,
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
    marginBottom: Theme.spacing.sm,
  },
  actions: {
    width: '100%',
    gap: Theme.spacing.xs,
    marginTop: Theme.spacing.sm,
  },
});
