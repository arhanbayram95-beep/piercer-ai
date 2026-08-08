import React, { useRef, useState } from 'react';
import { Image, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import DisclaimerFooter from '../components/common/DisclaimerFooter';
import PrimaryButton from '../components/common/PrimaryButton';
import { TranslationKey } from '../i18n/translations';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

type SliderKey = 'positionX' | 'positionY' | 'rotation' | 'scale';

interface SliderConfig {
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
}

// Placement adjustment is pure client-side UI state for now, per
// IMPLEMENTATION_PLAN.md piece 4 — it doesn't re-request a re-rendered
// image from the backend yet, just lets the user get a feel for nudging the
// jewelry's position/rotation/scale. Plain +/- steppers rather than a real
// slider widget since no slider library is installed yet (would need a new
// PROJECT_SPEC.md dependency entry) and a stepper covers the same "pure UI
// state" requirement without one.
const SLIDER_CONFIG: Record<SliderKey, SliderConfig> = {
  positionX: { min: -50, max: 50, step: 5, defaultValue: 0, unit: '%' },
  positionY: { min: -50, max: 50, step: 5, defaultValue: 0, unit: '%' },
  rotation: { min: -45, max: 45, step: 5, defaultValue: 0, unit: '°' },
  scale: { min: 50, max: 150, step: 10, defaultValue: 100, unit: '%' },
};

const SLIDER_ORDER: SliderKey[] = ['positionX', 'positionY', 'rotation', 'scale'];

const SLIDER_LABEL_KEYS: Record<SliderKey, TranslationKey> = {
  positionX: 'preview.slider.positionX',
  positionY: 'preview.slider.positionY',
  rotation: 'preview.slider.rotation',
  scale: 'preview.slider.scale',
};

function defaultAdjustments(): Record<SliderKey, number> {
  return {
    positionX: SLIDER_CONFIG.positionX.defaultValue,
    positionY: SLIDER_CONFIG.positionY.defaultValue,
    rotation: SLIDER_CONFIG.rotation.defaultValue,
    scale: SLIDER_CONFIG.scale.defaultValue,
  };
}

// Before/after toggle + placement tweaks + share/export for the render
// result StudioScreen just produced (studioSlice.renderResult). Reuses the
// react-native-view-shot + native Share pattern the old (deleted)
// RevealScreen used for its share card.
export default function PreviewScreen() {
  const t = useTranslation();
  const images = useAppStore((s) => s.images);
  const renderResult = useAppStore((s) => s.renderResult);
  const goToScreen = useAppStore((s) => s.goToScreen);
  const clearImages = useAppStore((s) => s.clearImages);
  const setRenderResult = useAppStore((s) => s.setRenderResult);
  const clearStackedItems = useAppStore((s) => s.clearStackedItems);
  const setLocation = useAppStore((s) => s.setLocation);

  const [showAfter, setShowAfter] = useState(true);
  const [adjustments, setAdjustments] = useState<Record<SliderKey, number>>(defaultAdjustments);
  const captureTargetRef = useRef<View>(null);

  const originalPhoto = images[0];

  const adjustSlider = (key: SliderKey, direction: 1 | -1) => {
    const config = SLIDER_CONFIG[key];
    setAdjustments((prev) => ({
      ...prev,
      [key]: Math.min(config.max, Math.max(config.min, prev[key] + direction * config.step)),
    }));
  };

  const handleShare = async () => {
    if (!captureTargetRef.current) return;
    try {
      const uri = await captureRef(captureTargetRef, { format: 'png', quality: 0.9 });
      await Share.share({ url: uri });
    } catch {
      // Sharing is a nice-to-have — never block the preview flow on failure.
    }
  };

  const handleDone = () => {
    clearImages();
    setRenderResult(null);
    clearStackedItems();
    setLocation(null);
    // Home, not Welcome — Welcome is a once-per-session intro screen, not a
    // destination to revisit after finishing a flow (see
    // navigationSlice.ts's DEFAULT_SCREEN comment).
    goToScreen('home');
  };

  if (!renderResult || !originalPhoto) {
    return (
      <View style={[styles.container, styles.emptyContainer]} testID="preview-screen">
        <Text style={styles.noResultText}>{t('preview.noResult')}</Text>
        <PrimaryButton label={t('preview.done')} onPress={handleDone} testID="preview-done-button" />
      </View>
    );
  }

  const displayedPhoto = showAfter ? renderResult.renderedImage : originalPhoto;
  const displayedMime = showAfter ? renderResult.mimeType : 'image/jpeg';

  return (
    <View style={styles.container} testID="preview-screen">
      <Text style={styles.title}>{t('preview.title')}</Text>

      <View ref={captureTargetRef} collapsable={false} style={styles.photoWrap} testID="preview-capture-target">
        <Image
          source={{ uri: `data:${displayedMime};base64,${displayedPhoto}` }}
          style={styles.photo}
          resizeMode="cover"
        />
      </View>

      <View style={styles.toggleRow}>
        <Pressable
          onPress={() => setShowAfter(false)}
          accessibilityRole="button"
          accessibilityState={{ selected: !showAfter }}
          testID="preview-toggle-before"
          style={[styles.toggleButton, !showAfter && styles.toggleButtonActive]}
        >
          <Text style={[styles.toggleLabel, !showAfter && styles.toggleLabelActive]}>{t('preview.before')}</Text>
        </Pressable>
        <Pressable
          onPress={() => setShowAfter(true)}
          accessibilityRole="button"
          accessibilityState={{ selected: showAfter }}
          testID="preview-toggle-after"
          style={[styles.toggleButton, showAfter && styles.toggleButtonActive]}
        >
          <Text style={[styles.toggleLabel, showAfter && styles.toggleLabelActive]}>{t('preview.after')}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.slidersWrap} showsVerticalScrollIndicator={false}>
        {SLIDER_ORDER.map((key) => (
          <View key={key} style={styles.sliderRow}>
            <Text style={styles.sliderLabel}>{t(SLIDER_LABEL_KEYS[key])}</Text>
            <View style={styles.stepperRow}>
              <Pressable
                onPress={() => adjustSlider(key, -1)}
                accessibilityRole="button"
                testID={`preview-slider-${key}-decrement`}
                style={styles.stepperButton}
              >
                <Text style={styles.stepperGlyph}>−</Text>
              </Pressable>
              <Text style={styles.sliderValue} testID={`preview-slider-${key}-value`}>
                {adjustments[key]}
                {SLIDER_CONFIG[key].unit}
              </Text>
              <Pressable
                onPress={() => adjustSlider(key, 1)}
                accessibilityRole="button"
                testID={`preview-slider-${key}-increment`}
                style={styles.stepperButton}
              >
                <Text style={styles.stepperGlyph}>+</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label={t('preview.share')} onPress={handleShare} testID="preview-share-button" />
        <PrimaryButton
          label={t('preview.done')}
          variant="secondary"
          onPress={handleDone}
          testID="preview-done-button"
        />
        <DisclaimerFooter />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.start,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.containerPadding,
  },
  noResultText: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
  },
  title: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.accent.goldSecondary,
    textAlign: 'center',
    marginTop: Theme.spacing.xl,
  },
  photoWrap: {
    marginHorizontal: Theme.spacing.containerPadding,
    marginTop: Theme.spacing.md,
    aspectRatio: 1,
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
  toggleRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: Theme.spacing.sm,
    backgroundColor: Theme.colors.surface.glassOverlay,
    borderRadius: Theme.radius.full,
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
    padding: 4,
    gap: 4,
  },
  toggleButton: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 8,
    borderRadius: Theme.radius.full,
  },
  toggleButtonActive: {
    backgroundColor: Theme.colors.accent.electricPurple,
  },
  toggleLabel: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.secondary,
  },
  toggleLabelActive: {
    color: Theme.colors.text.primary,
    fontWeight: '600',
  },
  slidersWrap: {
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingTop: Theme.spacing.md,
    gap: Theme.spacing.xs,
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  sliderLabel: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.primary,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  stepperButton: {
    width: 28,
    height: 28,
    borderRadius: Theme.radius.full,
    borderWidth: 1,
    borderColor: Theme.colors.surface.metallicBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperGlyph: {
    color: Theme.colors.text.primary,
    fontSize: 16,
    lineHeight: 18,
  },
  sliderValue: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.secondary,
    minWidth: 44,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingTop: Theme.spacing.sm,
    paddingBottom: Theme.spacing.md,
    gap: Theme.spacing.xs,
  },
});
