import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import GlassCard from '../components/common/GlassCard';
import PrimaryButton from '../components/common/PrimaryButton';
import { PIERCING_LOCATIONS } from '../content/piercingLocations';
import { ARCHETYPE_RECOMMENDATIONS, computeArchetype, PersonalityArchetype, QUIZ_QUESTIONS } from '../content/personalityQuiz';
import { TranslationKey } from '../i18n/translations';
import { useTranslation } from '../i18n/useTranslation';
import { JewelryType } from '../state/slices/studioSlice';
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

// Quiz entry point of the personality-matching module — pure client-side
// logic, no AI/backend call (see content/personalityQuiz.ts). Genuinely
// separate flow from PersonalityPhotoScreen, not a tab on a shared form,
// per the product brief.
//
// DELIBERATE EXCEPTION: no DisclaimerFooter/entertainment disclaimer is
// shown anywhere on this screen or its result view. This is an explicit,
// informed override of CLAUDE.md's usual "disclaimers are non-negotiable"
// rule, confirmed by the product owner specifically for this module — not
// an oversight. Same transparency pattern as the BIPA flag in
// backend/src/routes/legal.ts.
export default function PersonalityQuizScreen() {
  const t = useTranslation();
  const goBack = useAppStore((s) => s.goBack);
  const goToScreen = useAppStore((s) => s.goToScreen);
  const setLocation = useAppStore((s) => s.setLocation);
  const setJewelryType = useAppStore((s) => s.setJewelryType);
  const setFinish = useAppStore((s) => s.setFinish);

  const [answers, setAnswers] = useState<Record<string, PersonalityArchetype>>({});
  const [result, setResult] = useState<PersonalityArchetype | null>(null);

  const allAnswered = QUIZ_QUESTIONS.every((question) => answers[question.id]);

  const handleSelect = (questionId: string, archetype: PersonalityArchetype) => {
    setAnswers((prev) => ({ ...prev, [questionId]: archetype }));
  };

  const handleSeeResult = () => {
    setResult(computeArchetype(Object.values(answers)));
  };

  const handleRetake = () => {
    setAnswers({});
    setResult(null);
  };

  // Reuses the existing Capture -> Studio -> Preview try-on flow rather
  // than showing recommendation text and stopping — pre-selects the
  // archetype's top location + jewelry style (recommendedLocations[0],
  // guaranteed compatible per content/personalityQuiz.test.ts) so the user
  // lands straight in Capture ready to go.
  const handleTryOn = () => {
    if (!result) return;
    const recommendation = ARCHETYPE_RECOMMENDATIONS[result];
    const primary = recommendation.recommendedLocations[0];
    setLocation(primary.locationId);
    setJewelryType(primary.jewelryType);
    setFinish(recommendation.recommendedFinish);
    goToScreen('capture');
  };

  if (result) {
    const recommendation = ARCHETYPE_RECOMMENDATIONS[result];
    // Each entry names both the location AND its specific compatible
    // jewelry type — not just the location — so what's displayed can never
    // imply a pairing the app won't actually let the user build in Studio
    // (content/locationJewelryTypes.ts).
    const displayLocations = recommendation.recommendedLocations
      .map(({ locationId, jewelryType }) => {
        const location = PIERCING_LOCATIONS.find((entry) => entry.id === locationId);
        return location ? { location, jewelryType } : null;
      })
      .filter((entry): entry is { location: (typeof PIERCING_LOCATIONS)[number]; jewelryType: JewelryType } =>
        Boolean(entry)
      );

    return (
      <View style={styles.container} testID="quiz-screen">
        <View style={styles.header}>
          <Pressable
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel="Close"
            style={styles.closeButton}
            testID="quiz-close-button"
          >
            <Text style={styles.closeIcon}>✕</Text>
          </Pressable>
          <Text style={styles.title}>{t('quiz.resultTitle')}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.resultContent} showsVerticalScrollIndicator={false}>
          <GlassCard style={styles.resultCard}>
            <Text style={styles.archetypeName} testID="quiz-result-name">
              {t(recommendation.nameKey)}
            </Text>
            <Text style={styles.archetypeDescription} testID="quiz-result-description">
              {t(recommendation.descriptionKey)}
            </Text>
            <View style={styles.locationRow}>
              {displayLocations.map(({ location, jewelryType }) => (
                <Text key={location.id} style={styles.locationChip}>
                  {t(location.labelKey)} · {t(JEWELRY_TYPE_LABEL_KEYS[jewelryType])}
                </Text>
              ))}
            </View>
          </GlassCard>

          <PrimaryButton label={t('quiz.tryOnButton')} onPress={handleTryOn} testID="quiz-try-on-button" />
          <PrimaryButton
            label={t('quiz.retake')}
            variant="secondary"
            onPress={handleRetake}
            testID="quiz-retake-button"
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="quiz-screen">
      <View style={styles.header}>
        <Pressable
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={styles.closeButton}
          testID="quiz-close-button"
        >
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
        <Text style={styles.title}>{t('quiz.title')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {QUIZ_QUESTIONS.map((question) => (
          <View key={question.id} style={styles.questionSection}>
            <Text style={styles.questionText}>{t(question.questionKey)}</Text>
            <View style={styles.optionsGrid}>
              {question.options.map((option) => {
                const isSelected = answers[question.id] === option.archetype;
                return (
                  <Pressable
                    key={option.archetype}
                    onPress={() => handleSelect(question.id, option.archetype)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    testID={`quiz-option-${question.id}-${option.archetype}`}
                    style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {t(option.labelKey)}
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
          label={t('quiz.continue')}
          onPress={handleSeeResult}
          disabled={!allAnswered}
          testID="quiz-continue-button"
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
  questionSection: {
    gap: Theme.spacing.xs,
  },
  questionText: {
    ...Theme.typography.bodyMd,
    fontSize: 15,
    color: Theme.colors.text.primary,
  },
  optionsGrid: {
    gap: Theme.spacing.xs,
  },
  optionChip: {
    borderWidth: 1,
    borderColor: Theme.colors.surface.metallicBorder,
    borderRadius: Theme.radius.md,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 10,
  },
  optionChipSelected: {
    backgroundColor: Theme.colors.accent.electricPurple,
    borderColor: Theme.colors.accent.electricPurple,
  },
  optionText: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
  },
  optionTextSelected: {
    color: Theme.colors.text.primary,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingTop: Theme.spacing.sm,
    paddingBottom: Theme.spacing.lg,
  },
  resultContent: {
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingBottom: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
  resultCard: {
    gap: Theme.spacing.xs,
  },
  archetypeName: {
    ...Theme.typography.headlineLg,
    fontSize: 22,
    color: Theme.colors.accent.goldSecondary,
  },
  archetypeDescription: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
  },
  locationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.xs,
    marginTop: Theme.spacing.xs,
  },
  locationChip: {
    ...Theme.typography.labelSm,
    fontSize: 12,
    color: Theme.colors.text.primary,
    borderWidth: 1,
    borderColor: Theme.colors.surface.metallicBorder,
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 6,
    overflow: 'hidden',
  },
});
