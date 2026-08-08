import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../ui/theme';

interface AppLogoProps {
  size?: 'sm' | 'lg';
  // Icon-only by default — the full icon+wordmark lockup is reserved for
  // the handful of once-per-session brand moments (first launch, the
  // post-onboarding welcome, the externally-shared card) where it's
  // explicitly opted into. Everywhere the user revisits constantly (the
  // capture flow, onboarding, every single capture) showing the full
  // wordmark every time read as repetitive.
  showWordmark?: boolean;
  // 'row' (default) sits the wordmark beside the icon, matching the
  // share-card lockup. 'stacked' sits it below the icon on two lines, for
  // the loading screen's centered splash moment.
  layout?: 'row' | 'stacked';
}

export default function AppLogo({ size = 'sm', showWordmark = false, layout = 'row' }: AppLogoProps) {
  const isLarge = size === 'lg';
  const isStacked = layout === 'stacked';
  return (
    <View style={[styles.container, isStacked && styles.containerStacked]}>
      <Image
        source={require('../../../assets/logo-badge-transparent.png')}
        style={[styles.badge, isLarge && styles.badgeLg]}
        resizeMode="contain"
      />
      {showWordmark && (
        <Text style={[styles.wordmark, isLarge && styles.wordmarkLg, isStacked && styles.wordmarkStacked]}>
          {isStacked ? 'piercer\n.ai' : 'piercer.ai'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  containerStacked: {
    flexDirection: 'column',
    gap: 12,
  },
  badge: {
    width: 60,
    height: 60,
  },
  // Kept smaller than LoadingScreen's ripple rings (128px at rest) so the
  // expanding "waves" animation doesn't visually collide with the icon.
  badgeLg: {
    width: 108,
    height: 108,
  },
  wordmark: {
    ...Theme.typography.headlineMd,
    fontSize: 18,
    color: Theme.colors.accent.goldSecondary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  wordmarkLg: {
    ...Theme.typography.headlineLg,
    fontSize: 26,
    letterSpacing: 4,
  },
  wordmarkStacked: {
    textAlign: 'center',
    lineHeight: 30,
  },
});
