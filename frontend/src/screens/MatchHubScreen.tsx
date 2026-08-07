import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import GlassCard from '../components/common/GlassCard';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

// Landing screen for the personality/body-type piercing matching module —
// offers two genuinely separate entry points (quiz vs. photo), not a
// combined picker/dropdown, per the product brief. Each option routes to
// its own dedicated screen/flow; this hub is pure navigation, not a shared
// form. Reachable from Settings, same discoverability pattern as
// PiercingReferenceScreen.
export default function MatchHubScreen() {
  const t = useTranslation();
  const goToScreen = useAppStore((s) => s.goToScreen);
  const goBack = useAppStore((s) => s.goBack);

  return (
    <View style={styles.container} testID="match-hub-screen">
      <View style={styles.header}>
        <Pressable
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={styles.closeButton}
          testID="match-hub-close-button"
        >
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
        <Text style={styles.title}>{t('match.title')}</Text>
        <Text style={styles.subtitle}>{t('match.subtitle')}</Text>
      </View>

      <View style={styles.options}>
        <Pressable onPress={() => goToScreen('matchQuiz')} testID="match-hub-quiz-option">
          <GlassCard style={styles.optionCard}>
            <Text style={styles.optionTitle}>{t('match.quizCta')}</Text>
            <Text style={styles.optionSubtitle}>{t('match.quizSubtitle')}</Text>
          </GlassCard>
        </Pressable>

        <Pressable onPress={() => goToScreen('matchPhoto')} testID="match-hub-photo-option">
          <GlassCard style={styles.optionCard}>
            <Text style={styles.optionTitle}>{t('match.photoCta')}</Text>
            <Text style={styles.optionSubtitle}>{t('match.photoSubtitle')}</Text>
          </GlassCard>
        </Pressable>
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
  options: {
    padding: Theme.spacing.containerPadding,
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
  optionSubtitle: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.secondary,
  },
});
