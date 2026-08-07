import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import AppLogo from '../components/common/AppLogo';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

const AUTO_ADVANCE_MS = 2600;
const RIPPLE_DURATION_MS = 2200;

function useRipple(delay: number) {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(value, {
        toValue: 1,
        duration: RIPPLE_DURATION_MS,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    );
    const timeout = setTimeout(() => animation.start(), delay);
    return () => {
      clearTimeout(timeout);
      animation.stop();
    };
  }, [value, delay]);

  return value;
}

export default function LoadingScreen() {
  const goToScreen = useAppStore((s) => s.goToScreen);
  const pulse = useRef(new Animated.Value(1)).current;
  const ripple1 = useRipple(0);
  const ripple2 = useRipple(RIPPLE_DURATION_MS / 2);

  useEffect(() => {
    const timeout = setTimeout(() => goToScreen('onboarding'), AUTO_ADVANCE_MS);
    return () => clearTimeout(timeout);
  }, [goToScreen]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.05, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  const rippleStyle = (value: Animated.Value) => ({
    transform: [{ scale: value.interpolate({ inputRange: [0, 1], outputRange: [1, 2.4] }) }],
    opacity: value.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0.5, 0.15, 0] }),
  });

  return (
    <View style={styles.container} testID="loading-screen">
      <Animated.View style={[styles.brand, { transform: [{ scale: pulse }] }]}>
        <Animated.View style={[styles.ripple, rippleStyle(ripple1)]} />
        <Animated.View style={[styles.ripple, rippleStyle(ripple2)]} />
        <AppLogo size="lg" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.start,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: Theme.radius.full,
    borderWidth: 1.5,
    borderColor: Theme.colors.accent.goldSecondary,
  },
});
