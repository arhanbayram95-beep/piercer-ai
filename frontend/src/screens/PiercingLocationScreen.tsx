import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BottomNavBar from '../components/common/BottomNavBar';
import PrimaryButton from '../components/common/PrimaryButton';
import {
  PIERCING_CATEGORIES,
  PIERCING_CATEGORY_LABEL_KEYS,
  piercingLocationsByCategory,
} from '../content/piercingLocations';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

// First step of the flow, ahead of Capture — the user picks which piercing
// location they want to preview jewelry on before the camera ever opens, so
// CaptureScreen can show a location-specific guide prompt (e.g. "clearly
// see your helix") instead of the old generic body-part framing copy.
// Locations come from content/piercingLocations.ts, shared with a future
// piercing-reference page per the product brief.
//
// Carries BottomNavBar (active="tryOn") per explicit user feedback that the
// nav bar should be universal, not just on hub-style screens — tapping
// another module here does NOT clear selectedLocation/images/studio state;
// only the explicit Close (X) button does, via goBack(). See
// navigationSlice.ts / BottomNavBar.tsx for the same reasoning applied
// across every screen that got this treatment.
export default function PiercingLocationScreen() {
  const t = useTranslation();
  const selectedLocation = useAppStore((s) => s.selectedLocation);
  const setLocation = useAppStore((s) => s.setLocation);
  const goToScreen = useAppStore((s) => s.goToScreen);
  const goBack = useAppStore((s) => s.goBack);

  return (
    <View style={styles.container} testID="location-screen">
      <View style={styles.header}>
        <Pressable
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={styles.closeButton}
          testID="location-close-button"
        >
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
        <Text style={styles.title}>{t('location.title')}</Text>
        <Text style={styles.subtitle}>{t('location.subtitle')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {PIERCING_CATEGORIES.map((category) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryHeading}>{t(PIERCING_CATEGORY_LABEL_KEYS[category])}</Text>
            <View style={styles.grid}>
              {piercingLocationsByCategory(category).map((location) => {
                const isSelected = location.id === selectedLocation;
                return (
                  <Pressable
                    key={location.id}
                    onPress={() => setLocation(location.id)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    testID={`location-chip-${location.id}`}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {t(location.labelKey)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label={t('location.continue')}
          onPress={() => goToScreen('capture')}
          disabled={!selectedLocation}
          testID="location-continue-button"
        />
      </View>

      <BottomNavBar active="tryOn" />
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
  scrollContent: {
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingTop: Theme.spacing.md,
    paddingBottom: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
  categorySection: {
    gap: Theme.spacing.xs,
  },
  categoryHeading: {
    ...Theme.typography.labelSm,
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.xs,
  },
  chip: {
    borderWidth: 1,
    borderColor: Theme.colors.surface.metallicBorder,
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 10,
  },
  chipSelected: {
    backgroundColor: Theme.colors.accent.electricPurple,
    borderColor: Theme.colors.accent.electricPurple,
  },
  chipText: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
  },
  chipTextSelected: {
    color: Theme.colors.text.primary,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingTop: Theme.spacing.sm,
    paddingBottom: 120,
  },
});
