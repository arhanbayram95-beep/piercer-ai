import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import GlassCard from '../components/common/GlassCard';
import { PIERCING_CATEGORIES, PIERCING_CATEGORY_LABEL_KEYS, piercingLocationsByCategory } from '../content/piercingLocations';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

// Read-only terminology + pain-scale reference, reachable from Settings —
// not part of the main Capture flow. No capture/AI/entitlement logic here.
// The disclaimer below is deliberately rendered as visible on-page copy,
// not just a code comment — pain ratings are a claim a user could otherwise
// mistake for medical guidance, so the "general estimate, not medical
// advice" framing needs to be something they actually read.
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
            <Text style={styles.categoryHeading}>{t(PIERCING_CATEGORY_LABEL_KEYS[category])}</Text>
            {piercingLocationsByCategory(category).map((location) => (
              <GlassCard key={location.id} style={styles.locationCard} testID={`reference-card-${location.id}`}>
                <View style={styles.locationHeaderRow}>
                  <Text style={styles.locationName}>{t(location.labelKey)}</Text>
                  <Text style={styles.painBadge}>{t('reference.painLabel', { rating: location.painRating })}</Text>
                </View>
                <Text style={styles.locationDescription}>{t(location.descriptionKey)}</Text>
              </GlassCard>
            ))}
          </View>
        ))}
      </ScrollView>
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
  title: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.accent.goldSecondary,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingBottom: Theme.spacing.lg,
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
  categoryHeading: {
    ...Theme.typography.labelSm,
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  locationCard: {
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
  locationDescription: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.secondary,
  },
});
