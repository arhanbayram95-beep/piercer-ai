import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import FadeInView from '../components/common/FadeInView';
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
// per the product brief. One question at a time (not the original single
// long scrollable list — that read as messy) with a dot progress indicator
// (same visual language as OnboardingScreen's), a Next button gated on the
// current question being answered, and a Back link to revisit a previous
// answer without losing later ones.
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

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, PersonalityArchetype>>({});
  const [result, setResult] = useState<PersonalityArchetype | null>(null);

  const currentQuestion = QUIZ_QUESTIONS[stepIndex];
  const currentAnswer = answers[currentQuestion.id];
  const isLastQuestion = stepIndex === QUIZ_QUESTIONS.length - 1;

  const handleSelect = (archetype: PersonalityArchetype) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: archetype }));
  };

  const handleNext = () => {
    if (!currentAnswer) return;
    if (isLastQuestion) {
      setResult(computeArchetype(Object.values(answers)));
      return;
    }
    setStepIndex((index) => index + 1);
  };

  const handleBack = () => {
    if (stepIndex === 0) return;
    setStepIndex((index) => index - 1);
  };

  const handleRetake = () => {
    setAnswers({});
    setStepIndex(0);
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

        <View style={styles.dots} accessibilityLabel="Quiz progress">
          {QUIZ_QUESTIONS.map((question, index) => (
            <View key={question.id} style={[styles.dot, index === stepIndex && styles.dotActive]} />
          ))}
        </View>
        <Text style={styles.progressText} testID="quiz-progress-text">
          {t('quiz.progress', { current: stepIndex + 1, total: QUIZ_QUESTIONS.length })}
        </Text>
      </View>

      <View style={styles.content}>
        <FadeInView key={currentQuestion.id} style={styles.questionSection}>
          <Text style={styles.questionText}>{t(currentQuestion.questionKey)}</Text>
          <View style={styles.optionsGrid}>
            {currentQuestion.options.map((option) => {
              const isSelected = currentAnswer === option.archetype;
              return (
                <Pressable
                  key={option.archetype}
                  onPress={() => handleSelect(option.archetype)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  testID={`quiz-option-${currentQuestion.id}-${option.archetype}`}
                  style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {t(option.labelKey)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </FadeInView>
      </View>

      <View style={styles.footer}>
        {stepIndex > 0 && (
          <Pressable onPress={handleBack} accessibilityRole="button" testID="quiz-back-button" style={styles.backLink}>
            <Text style={styles.backLinkText}>{t('quiz.back')}</Text>
          </Pressable>
        )}
        <PrimaryButton
          label={isLastQuestion ? t('quiz.continue') : t('quiz.next')}
          onPress={handleNext}
          disabled={!currentAnswer}
          testID="quiz-next-button"
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
    gap: Theme.spacing.xs,
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
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Theme.spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Theme.radius.full,
    backgroundColor: 'rgba(255, 223, 158, 0.25)',
  },
  dotActive: {
    width: 20,
    backgroundColor: Theme.colors.accent.crimsonPrimary,
  },
  progressText: {
    ...Theme.typography.labelSm,
    fontSize: 11,
    color: Theme.colors.text.muted,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.containerPadding,
  },
  questionSection: {
    gap: Theme.spacing.sm,
  },
  questionText: {
    ...Theme.typography.headlineMd,
    fontSize: 20,
    color: Theme.colors.text.primary,
  },
  optionsGrid: {
    gap: Theme.spacing.xs,
    marginTop: Theme.spacing.xs,
  },
  optionChip: {
    borderWidth: 1,
    borderColor: Theme.colors.surface.metallicBorder,
    borderRadius: Theme.radius.md,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 14,
  },
  optionChipSelected: {
    backgroundColor: Theme.colors.accent.electricPurple,
    borderColor: Theme.colors.accent.electricPurple,
  },
  optionText: {
    ...Theme.typography.bodyMd,
    fontSize: 15,
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
    gap: Theme.spacing.sm,
  },
  backLink: {
    alignSelf: 'center',
    paddingVertical: 4,
  },
  backLinkText: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
    textDecorationLine: 'underline',
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
