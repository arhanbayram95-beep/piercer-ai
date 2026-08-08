import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BottomNavBar from '../components/common/BottomNavBar';
import GlassCard from '../components/common/GlassCard';
import PiercingVisual from '../components/common/PiercingVisual';
import { PIERCING_LOCATIONS } from '../content/piercingLocations';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

// Dedicated detail page for a single reference-page location, reached by
// tapping a card on PiercingReferenceScreen.tsx. Replaces that screen's
// earlier expand-in-place card interaction per direct user feedback —
// tapping a card now navigates here instead of toggling local expand
// state. `viewedLocationId` lives in referenceSlice.ts (not studioSlice —
// see that slice's module comment for why this is deliberately a separate,
// smaller piece of state from the Try On flow's selectedLocation).
//
// Shows everything the old expanded card showed (diagram, pain rating,
// description, healing time, aftercare) plus a close button, and carries
// BottomNavBar (active="reference") like every other post-onboarding
// screen. Falls back to goBack() -> PiercingReferenceScreen if somehow
// reached with no viewedLocationId set (shouldn't happen via normal
// navigation, but avoids a blank/crashing screen if it ever is).
export default function PiercingDetailScreen() {
  const t = useTranslation();
  const goBack = useAppStore((s) => s.goBack);
  const viewedLocationId = useAppStore((s) => s.viewedLocationId);

  const location = PIERCING_LOCATIONS.find((loc) => loc.id === viewedLocationId) ?? null;

  return (
    <View style={styles.container} testID="location-detail-screen">
      <View style={styles.header}>
        <Pressable
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={styles.closeButton}
          testID="location-detail-close-button"
        >
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
      </View>

      {location ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <GlassCard style={styles.card}>
            <PiercingVisual
              locationId={location.id}
              size={140}
              style={styles.diagram}
              testID={`location-detail-diagram-${location.id}`}
            />
            <Text style={styles.title}>{t(location.labelKey)}</Text>
            <Text style={styles.painBadge}>{t('reference.painLabel', { rating: location.painRating })}</Text>

            <Text style={styles.description}>{t(location.descriptionKey)}</Text>

            <View style={styles.healingBlock}>
              <Text style={styles.healingLabel} testID={`location-detail-healing-${location.id}`}>
                {t('reference.healingLabel', { time: t(location.healingTimeKey) })}
              </Text>
            </View>

            <View style={styles.aftercareBlock}>
              <Text style={styles.aftercareHeading}>{t('reference.aftercareHeading')}</Text>
              <Text style={styles.aftercareText} testID={`location-detail-aftercare-${location.id}`}>
                {t(location.aftercareKey)}
              </Text>
            </View>
          </GlassCard>

          <Text style={styles.disclaimer} testID="location-detail-disclaimer">
            {t('reference.disclaimer')}
          </Text>
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>{t('reference.title')}</Text>
        </View>
      )}

      <BottomNavBar active="reference" />
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
    paddingBottom: Theme.spacing.sm,
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
  scrollContent: {
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingBottom: 120,
    gap: Theme.spacing.md,
  },
  card: {
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  diagram: {
    marginBottom: Theme.spacing.sm,
  },
  title: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.text.primary,
    textAlign: 'center',
  },
  painBadge: {
    ...Theme.typography.labelSm,
    fontSize: 12,
    color: Theme.colors.accent.electricPurple,
  },
  description: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: Theme.spacing.sm,
  },
  healingBlock: {
    marginTop: Theme.spacing.sm,
    paddingTop: Theme.spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Theme.colors.surface.glassBorder,
    width: '100%',
    alignItems: 'center',
  },
  healingLabel: {
    ...Theme.typography.labelSm,
    color: Theme.colors.accent.chromeSteel,
  },
  aftercareBlock: {
    marginTop: Theme.spacing.sm,
    paddingTop: Theme.spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Theme.colors.surface.glassBorder,
    width: '100%',
    gap: 4,
  },
  aftercareHeading: {
    ...Theme.typography.labelSm,
    fontSize: 11,
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  aftercareText: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
  },
  disclaimer: {
    ...Theme.typography.bodyMd,
    fontSize: 12,
    lineHeight: 18,
    color: Theme.colors.text.secondary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 120,
  },
  emptyText: {
    ...Theme.typography.headlineMd,
    color: Theme.colors.text.secondary,
  },
});
