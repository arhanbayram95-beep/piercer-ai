import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { RenderApiError, renderPreview } from '../api/render';
import PiercingStudioDrawer from '../components/common/PiercingStudioDrawer';
import PrimaryButton from '../components/common/PrimaryButton';
import { recommendedJewelryFor } from '../content/locationJewelryRecommendations';
import { PIERCING_LOCATIONS } from '../content/piercingLocations';
import { TranslationKey } from '../i18n/translations';
import { useTranslation } from '../i18n/useTranslation';
import { FREE_RENDER_LIMIT } from '../state/slices/entitlementSlice';
import { JewelryFinish, JewelryType } from '../state/slices/studioSlice';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

const JEWELRY_TYPE_LABEL_KEYS: Record<JewelryType, TranslationKey> = {
  hoops: 'studio.jewelry.hoops',
  studs: 'studio.jewelry.studs',
  barbells: 'studio.jewelry.barbells',
  industrial: 'studio.jewelry.industrial',
  septum: 'studio.jewelry.septum',
  dermal: 'studio.jewelry.dermal',
};

const FINISH_LABEL_KEYS: Record<JewelryFinish, TranslationKey> = {
  silver: 'studio.finish.silver',
  gold: 'studio.finish.gold',
  titanium: 'studio.finish.titanium',
  blackSteel: 'studio.finish.blackSteel',
};

// Hosts the captured/uploaded photo alongside PiercingStudioDrawer's
// jewelry-type/finish picker. "Preview Jewelry" calls the render backend
// (api/render.ts) with the photo + current selection and, on success, hands
// the result to PreviewScreen via studioSlice.setRenderResult.
//
// The "body/face-type" leg of the personality/body-type matching module
// (piece 3 of its 3-piece scope) lives here as the recommendation banner
// below, per the product brief: it reuses the location the user already
// picked (chosen based on their own face/ear/body) and nudges them toward a
// suited jewelry style in this same try-on flow, rather than a new
// recommendation-output screen or AI call.
export default function StudioScreen() {
  const t = useTranslation();
  const images = useAppStore((s) => s.images);
  const goToScreen = useAppStore((s) => s.goToScreen);
  const goBack = useAppStore((s) => s.goBack);
  const selectedLocation = useAppStore((s) => s.selectedLocation);
  const selectedJewelryType = useAppStore((s) => s.selectedJewelryType);
  const selectedFinish = useAppStore((s) => s.selectedFinish);
  const setJewelryType = useAppStore((s) => s.setJewelryType);
  const setFinish = useAppStore((s) => s.setFinish);
  const stackedItems = useAppStore((s) => s.stackedItems);
  const setRenderResult = useAppStore((s) => s.setRenderResult);
  const isProActive = useAppStore((s) => s.isProActive);
  const freeRendersUsed = useAppStore((s) => s.freeRendersUsed);
  const incrementFreeRendersUsed = useAppStore((s) => s.incrementFreeRendersUsed);
  const [isRendering, setIsRendering] = useState(false);
  const [recommendationDismissed, setRecommendationDismissed] = useState(false);
  const photo = images[0];

  const locationEntry = PIERCING_LOCATIONS.find((location) => location.id === selectedLocation);
  const jewelryRecommendation = selectedLocation ? recommendedJewelryFor(selectedLocation) : null;
  const showRecommendationBanner = Boolean(locationEntry && jewelryRecommendation) && !recommendationDismissed;

  const handleApplyRecommendation = () => {
    if (!jewelryRecommendation) return;
    setJewelryType(jewelryRecommendation.jewelryType);
    setFinish(jewelryRecommendation.finish);
    setRecommendationDismissed(true);
  };

  // No free tier at all was the old face-reading app's model; piercer.ai's
  // product brief calls for a freemium hook instead — FREE_RENDER_LIMIT
  // free renders, then unlimited renders (and multi-piercing stacking,
  // gated separately in PiercingStudioDrawer) behind piercer_pro_access.
  const handlePreview = async () => {
    if (!photo || isRendering) return;
    if (!isProActive && freeRendersUsed >= FREE_RENDER_LIMIT) {
      goToScreen('paywall');
      return;
    }

    setIsRendering(true);
    try {
      const result = await renderPreview({
        photo,
        jewelryType: selectedJewelryType,
        finish: selectedFinish,
        additionalItems: stackedItems.length > 0 ? stackedItems : undefined,
      });
      setRenderResult(result);
      if (!isProActive) incrementFreeRendersUsed();
      goToScreen('preview');
    } catch (error) {
      const message = error instanceof RenderApiError ? error.message : t('studio.renderError.body');
      Alert.alert(t('studio.renderError.title'), message);
    } finally {
      setIsRendering(false);
    }
  };

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
        {showRecommendationBanner && locationEntry && jewelryRecommendation && (
          <View style={styles.recommendationBanner} testID="studio-recommendation-banner">
            <View style={styles.recommendationTextWrap}>
              <Text style={styles.recommendationTitle}>
                {t('studio.recommendation.title', { location: t(locationEntry.labelKey) })}
              </Text>
              <Text style={styles.recommendationBody}>
                {t('studio.recommendation.body', {
                  jewelry: t(JEWELRY_TYPE_LABEL_KEYS[jewelryRecommendation.jewelryType]),
                  finish: t(FINISH_LABEL_KEYS[jewelryRecommendation.finish]),
                })}
              </Text>
            </View>
            <Pressable
              onPress={handleApplyRecommendation}
              accessibilityRole="button"
              testID="studio-recommendation-apply"
              style={styles.recommendationApplyButton}
            >
              <Text style={styles.recommendationApplyText}>{t('studio.recommendation.apply')}</Text>
            </Pressable>
            <Pressable
              onPress={() => setRecommendationDismissed(true)}
              accessibilityRole="button"
              accessibilityLabel="Dismiss"
              testID="studio-recommendation-dismiss"
              style={styles.recommendationDismissButton}
            >
              <Text style={styles.recommendationDismissIcon}>✕</Text>
            </Pressable>
          </View>
        )}
        <PiercingStudioDrawer />
        <PrimaryButton
          label={isRendering ? t('studio.rendering') : t('studio.continue')}
          onPress={handlePreview}
          disabled={!photo || isRendering}
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
  recommendationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    backgroundColor: Theme.colors.surface.glassBackground,
    borderWidth: 1,
    borderColor: Theme.colors.accent.electricPurple,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.sm,
  },
  recommendationTextWrap: {
    flex: 1,
    gap: 2,
  },
  recommendationTitle: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.text.primary,
  },
  recommendationBody: {
    ...Theme.typography.bodyMd,
    fontSize: 12,
    color: Theme.colors.text.secondary,
  },
  recommendationApplyButton: {
    backgroundColor: Theme.colors.accent.electricPurple,
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 8,
  },
  recommendationApplyText: {
    ...Theme.typography.bodyMd,
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.text.primary,
  },
  recommendationDismissButton: {
    padding: 4,
  },
  recommendationDismissIcon: {
    color: Theme.colors.text.muted,
    fontSize: 14,
  },
});
