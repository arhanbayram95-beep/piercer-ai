import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import AppLogo from '../components/common/AppLogo';
import FadeInView from '../components/common/FadeInView';
import PrimaryButton from '../components/common/PrimaryButton';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

// The dedicated first-time landing moment after the paywall, before
// handing off to the Analyze hub (the app's actual home base — there is
// no separate main-menu/dashboard screen).
export default function WelcomeScreen() {
  const goToScreen = useAppStore((s) => s.goToScreen);
  const t = useTranslation();
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 1600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1600, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  return (
    <View style={styles.container} testID="welcome-screen">
      <FadeInView style={styles.content}>
        <Animated.View style={{ transform: [{ scale: pulse }] }}>
          <AppLogo size="lg" />
        </Animated.View>
        <Text style={styles.headline}>{t('welcome.headline')}</Text>
        <Text style={styles.subtitle}>{t('welcome.subtitle')}</Text>
      </FadeInView>

      <View style={styles.footer}>
        <PrimaryButton label={t('welcome.cta')} onPress={() => goToScreen('analyze')} />
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.containerPadding,
    gap: Theme.spacing.sm,
  },
  headline: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.accent.goldSecondary,
    textAlign: 'center',
    marginTop: Theme.spacing.sm,
  },
  subtitle: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingBottom: Theme.spacing.lg,
    alignItems: 'center',
  },
});
