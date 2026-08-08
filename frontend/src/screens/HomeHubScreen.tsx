import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppLogo from '../components/common/AppLogo';
import BottomNavBar from '../components/common/BottomNavBar';
import GlassCard from '../components/common/GlassCard';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

// The app's persistent home base, reached once per session after the
// one-time Loading -> Onboarding -> Paywall -> Welcome intro sequence (see
// navigationSlice.ts's DEFAULT_SCREEN comment). Offers entry points to the
// three independent modules — piercing try-on, the reference guide, and
// personality/body-type matching — rather than funneling the user straight
// into any one of them. No close/back button, unlike the module hubs and
// sub-screens it links to: this screen IS the destination goBack() falls
// back to, not a step within a flow.
export default function HomeHubScreen() {
  const t = useTranslation();
  const goToScreen = useAppStore((s) => s.goToScreen);

  return (
    <View style={styles.container} testID="home-hub-screen">
      <View style={styles.header}>
        <AppLogo size="sm" />
        <Text style={styles.headline}>{t('home.headline')}</Text>
        <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => goToScreen('location')} testID="home-hub-try-on-option">
          <GlassCard variant="module" style={styles.optionCard}>
            <Text style={styles.optionTitle}>{t('home.tryOn.title')}</Text>
            <View style={styles.titleUnderline} />
            <Text style={styles.optionSubtitle}>{t('home.tryOn.subtitle')}</Text>
          </GlassCard>
        </Pressable>

        <Pressable onPress={() => goToScreen('reference')} testID="home-hub-reference-option">
          <GlassCard variant="module" style={styles.optionCard}>
            <Text style={styles.optionTitle}>{t('home.reference.title')}</Text>
            <View style={styles.titleUnderline} />
            <Text style={styles.optionSubtitle}>{t('home.reference.subtitle')}</Text>
          </GlassCard>
        </Pressable>

        <Pressable onPress={() => goToScreen('match')} testID="home-hub-match-option">
          <GlassCard variant="module" style={styles.optionCard}>
            <Text style={styles.optionTitle}>{t('home.match.title')}</Text>
            <View style={styles.titleUnderline} />
            <Text style={styles.optionSubtitle}>{t('home.match.subtitle')}</Text>
          </GlassCard>
        </Pressable>
      </ScrollView>

      <BottomNavBar active="home" />
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
    gap: Theme.spacing.xs,
  },
  headline: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.accent.goldSecondary,
    marginTop: Theme.spacing.sm,
  },
  subtitle: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
  },
  scrollContent: {
    padding: Theme.spacing.containerPadding,
    paddingBottom: 120,
    gap: Theme.spacing.md,
  },
  optionCard: {
    gap: 4,
  },
  optionTitle: {
    ...Theme.typography.headlineMd,
    fontSize: 18,
    color: Theme.colors.text.primary,
  },
  titleUnderline: {
    width: 28,
    height: 2,
    borderRadius: Theme.radius.sm,
    backgroundColor: Theme.colors.accent.crimsonPrimary,
    marginBottom: 2,
  },
  optionSubtitle: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.secondary,
  },
});
