import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import PiercingStudioDrawer from '../components/common/PiercingStudioDrawer';
import PrimaryButton from '../components/common/PrimaryButton';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

// Hosts the captured/uploaded photo alongside PiercingStudioDrawer's
// jewelry-type/finish picker. "Preview Jewelry" is a placeholder
// destination until the AI render backend + PreviewScreen land (see
// IMPLEMENTATION_PLAN.md piece 3/4) — kept as 'settings' the same way
// CaptureScreen's own placeholder worked before this screen existed.
export default function StudioScreen() {
  const t = useTranslation();
  const images = useAppStore((s) => s.images);
  const goToScreen = useAppStore((s) => s.goToScreen);
  const goBack = useAppStore((s) => s.goBack);
  const photo = images[0];

  return (
    <View style={styles.container} testID="studio-screen">
      <View style={styles.header}>
        <Pressable
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={styles.closeButton}
          testID="studio-close-button"
        >
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
        <Text style={styles.title}>{t('studio.title')}</Text>
        <Text style={styles.subtitle}>{t('studio.subtitle')}</Text>
      </View>

      <View style={styles.photoWrap}>
        {photo ? (
          <Image source={{ uri: `data:image/jpeg;base64,${photo}` }} style={styles.photo} resizeMode="cover" />
        ) : (
          <View style={styles.noPhoto}>
            <Text style={styles.noPhotoText}>{t('studio.noPhoto')}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <PiercingStudioDrawer />
        <PrimaryButton
          label={t('studio.continue')}
          onPress={() => goToScreen('settings')}
          disabled={!photo}
          testID="studio-continue-button"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.start,
  },
  header: {
    paddingTop: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.containerPadding,
    gap: 4,
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
    zIndex: 1,
  },
  closeIcon: {
    color: Theme.colors.text.secondary,
    fontSize: 16,
  },
  title: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.accent.goldSecondary,
  },
  subtitle: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
  },
  photoWrap: {
    flex: 1,
    marginHorizontal: Theme.spacing.containerPadding,
    marginTop: Theme.spacing.md,
    borderRadius: Theme.radius.xl,
    overflow: 'hidden',
    backgroundColor: Theme.colors.surface.glassBackground,
    borderWidth: 1,
    borderColor: Theme.colors.surface.metallicBorder,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  noPhoto: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.md,
  },
  noPhotoText: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingTop: Theme.spacing.sm,
    paddingBottom: Theme.spacing.lg,
    gap: Theme.spacing.sm,
  },
});
