import React, { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AnimatedCheckbox from '../components/common/AnimatedCheckbox';
import FadeInView from '../components/common/FadeInView';
import GlassCard from '../components/common/GlassCard';
import PrimaryButton from '../components/common/PrimaryButton';
import SwipeablePager from '../components/common/SwipeablePager';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';
import { PRIVACY_POLICY_URL } from '../utils/legalLinks';

const STEP_COUNT = 2;

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const ageVerified = useAppStore((s) => s.ageVerified);
  const imageConsentGiven = useAppStore((s) => s.imageConsentGiven);
  const setAgeVerified = useAppStore((s) => s.setAgeVerified);
  const setImageConsentGiven = useAppStore((s) => s.setImageConsentGiven);
  const goToScreen = useAppStore((s) => s.goToScreen);
  const t = useTranslation();

  const canContinue = step === 0 || (ageVerified && imageConsentGiven);

  const handlePrimaryPress = () => {
    if (step < STEP_COUNT - 1) {
      setStep(step + 1);
      return;
    }
    if (!canContinue) return;
    goToScreen('paywall');
  };

  return (
    <View style={styles.container} testID="onboarding-screen">
      <View style={styles.content}>
        <GlassCard style={styles.card}>
          <View style={styles.dots} accessibilityLabel="Onboarding progress">
            {Array.from({ length: STEP_COUNT }).map((_, index) => (
              <View key={index} style={[styles.dot, index === step && styles.dotActive]} />
            ))}
          </View>

          <SwipeablePager index={step} onIndexChange={setStep} style={styles.pager}>
            <FadeInView key="step-0" style={styles.textBlock}>
              <Text style={styles.headline}>{t('onboarding.step0.headline')}</Text>
              <Text style={styles.body}>{t('onboarding.step0.body')}</Text>
            </FadeInView>

            <FadeInView key="step-1" style={styles.textBlock}>
              <Text style={styles.headline}>{t('onboarding.step1.headline')}</Text>
              <Text style={styles.body}>{t('onboarding.step1.body')}</Text>

              <AnimatedCheckbox
                checked={ageVerified}
                onToggle={() => setAgeVerified(!ageVerified)}
                label={t('onboarding.ageCheckbox')}
                testID="age-gate-checkbox"
              />

              <AnimatedCheckbox
                checked={imageConsentGiven}
                onToggle={() => setImageConsentGiven(!imageConsentGiven)}
                label={t('onboarding.consentCheckbox')}
                testID="consent-checkbox"
              />

              <Pressable onPress={() => Linking.openURL(PRIVACY_POLICY_URL)} accessibilityRole="link">
                <Text style={styles.privacyLink}>{t('onboarding.privacyLink')}</Text>
              </Pressable>
            </FadeInView>
          </SwipeablePager>
        </GlassCard>
      </View>

      <View style={[styles.footer, { paddingBottom: Theme.spacing.lg + insets.bottom }]}>
        <PrimaryButton
          label={step < STEP_COUNT - 1 ? t('onboarding.next') : t('onboarding.getStarted')}
          onPress={handlePrimaryPress}
          disabled={!canContinue}
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.containerPadding,
  },
  card: {
    gap: Theme.spacing.md,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Theme.radius.full,
    backgroundColor: 'rgba(255, 223, 158, 0.4)',
  },
  dotActive: {
    width: 10,
    height: 10,
    backgroundColor: Theme.colors.accent.crimsonPrimary,
  },
  pager: {
    height: 320,
  },
  textBlock: {
    gap: Theme.spacing.sm,
  },
  headline: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.accent.goldSecondary,
    textAlign: 'center',
  },
  body: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
  },
  privacyLink: {
    ...Theme.typography.labelSm,
    color: Theme.colors.accent.goldSecondary,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  footer: {
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingBottom: Theme.spacing.lg,
    alignItems: 'center',
  },
});
