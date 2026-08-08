import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BottomNavBar from '../components/common/BottomNavBar';
import GlassCard from '../components/common/GlassCard';
import PiercingDiagram from '../components/common/PiercingDiagram';
import {
  PIERCING_CATEGORIES,
  PIERCING_CATEGORY_LABEL_KEYS,
  PiercingLocation,
  piercingLocationsByCategory,
} from '../content/piercingLocations';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

// Read-only terminology + pain-scale reference — one of the app's 3
// top-level modules, so it carries BottomNavBar (active="reference") the
// same as HomeHubScreen/MatchHubScreen/SettingsScreen, letting a user jump
// straight to another module without routing back through Home first. No
// capture/AI/entitlement logic here. The disclaimer below is deliberately
// rendered as visible on-page copy, not just a code comment — pain ratings
// are a claim a user could otherwise mistake for medical guidance, so the
// "general estimate, not medical advice" framing needs to be something
// they actually read.
//
// Cards navigate to PiercingDetailScreen.tsx on press rather than
// expanding in place (the prior interaction, from before this pass) — per
// direct user feedback, tapping a location should open a dedicated detail
// page. The pressed location's id is stashed in referenceSlice.ts's
// viewedLocationId; description/healing/aftercare content itself is
// unchanged, only where it's rendered.
export default function PiercingReferenceScreen() {
  const t = useTranslation();
  const goBack = useAppStore((s) => s.goBack);

  return (
    <View style={styles.container} testID="reference-screen">
      <View style={styles.header}>
        <Pressable
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={styles.closeButton}
          testID="reference-close-button"
        >
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
        <Text style={styles.title}>{t('reference.title')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.disclaimer} testID="reference-disclaimer">
          {t('reference.disclaimer')}
        </Text>

        {PIERCING_CATEGORIES.map((category) => (
          <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeadingRow}>
              <Text style={styles.categoryHeading}>{t(PIERCING_CATEGORY_LABEL_KEYS[category])}</Text>
              <View style={styles.categoryHeadingRule} />
            </View>
            {piercingLocationsByCategory(category).map((location) => (
              <LocationReferenceCard key={location.id} location={location} />
            ))}
          </View>
        ))}
      </ScrollView>

      <BottomNavBar active="reference" />
    </View>
  );
}

function LocationReferenceCard({ location }: { location: PiercingLocation }) {
  const t = useTranslation();
  const setViewedLocationId = useAppStore((s) => s.setViewedLocationId);
  const goToScreen = useAppStore((s) => s.goToScreen);

  const openDetail = () => {
    setViewedLocationId(location.id);
    goToScreen('locationDetail');
  };

  return (
    <Pressable
      onPress={openDetail}
      accessibilityRole="button"
      accessibilityLabel={t(location.labelKey)}
      testID={`reference-card-${location.id}`}
    >
      <GlassCard style={styles.locationCard}>
        <View style={styles.locationRow}>
          <PiercingDiagram
            locationId={location.id}
            size={64}
            style={styles.locationDiagram}
            testID={`reference-diagram-${location.id}`}
          />
          <View style={styles.locationTextCol}>
            <View style={styles.locationHeaderRow}>
              <Text style={styles.locationName}>{t(location.labelKey)}</Text>
              <Text style={styles.painBadge}>{t('reference.painLabel', { rating: location.painRating })}</Text>
            </View>
          </View>
          <Text style={styles.chevronIcon}>›</Text>
        </View>
      </GlassCard>
    </Pressable>
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
  title: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.accent.goldSecondary,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingBottom: 120,
    gap: Theme.spacing.md,
  },
  disclaimer: {
    ...Theme.typography.bodyMd,
    fontSize: 12,
    lineHeight: 18,
    color: Theme.colors.text.secondary,
  },
  categorySection: {
    gap: Theme.spacing.xs,
  },
  categoryHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    marginBottom: 2,
  },
  categoryHeading: {
    ...Theme.typography.labelSm,
    color: Theme.colors.accent.chromeSteel,
    textTransform: 'uppercase',
  },
  categoryHeadingRule: {
    flex: 1,
    height: 1,
    backgroundColor: Theme.colors.surface.glassBorder,
  },
  locationCard: {
    gap: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  locationDiagram: {
    flexShrink: 0,
  },
  locationTextCol: {
    flex: 1,
    gap: 4,
  },
  locationHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationName: {
    ...Theme.typography.headlineMd,
    fontSize: 16,
    color: Theme.colors.text.primary,
  },
  painBadge: {
    ...Theme.typography.labelSm,
    fontSize: 11,
    color: Theme.colors.accent.electricPurple,
  },
  chevronIcon: {
    color: Theme.colors.accent.chromeSteel,
    fontSize: 20,
    marginLeft: Theme.spacing.xs,
  },
});
