import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { Theme } from '../../ui/theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  // Strips the filled/outlined pill down to just the label (+ optional
  // icon) floating on the screen's own background — no card/block behind
  // it. Used where a solid pill reads as too heavy a block.
  flow?: boolean;
  icon?: string;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export default function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  flow = false,
  icon,
  disabled = false,
  style,
  testID,
}: PrimaryButtonProps) {
  const isPrimary = variant === 'primary';
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue: number) => {
    Animated.spring(scale, { toValue, useNativeDriver: true, speed: 30, bounciness: 10 }).start();
  };

  const buttonStyle = flow
    ? [styles.flow, disabled && styles.disabled, style]
    : [styles.button, isPrimary ? styles.primary : styles.secondary, disabled && styles.disabled, style];
  const labelStyle = flow
    ? isPrimary
      ? styles.flowPrimaryLabel
      : styles.flowSecondaryLabel
    : isPrimary
      ? styles.primaryLabel
      : styles.secondaryLabel;

  return (
    <Animated.View style={[flow ? styles.flowWrapper : styles.wrapper, { transform: [{ scale }] }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => animateTo(0.96)}
        onPressOut={() => animateTo(1)}
        testID={testID}
        style={buttonStyle}
      >
        {icon && <Text style={labelStyle}>{icon} </Text>}
        <Text style={labelStyle}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  flowWrapper: {
    flex: 1,
  },
  flow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: Theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: Theme.colors.accent.goldSecondary,
    shadowColor: Theme.colors.accent.goldSecondary,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.colors.accent.crimsonPrimary,
  },
  disabled: {
    opacity: 0.4,
  },
  primaryLabel: {
    ...Theme.typography.headlineMd,
    fontSize: 16,
    color: Theme.colors.background.start,
  },
  secondaryLabel: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.text.secondary,
  },
  flowPrimaryLabel: {
    ...Theme.typography.headlineMd,
    fontSize: 19,
    color: Theme.colors.accent.goldSecondary,
    textShadowColor: 'rgba(235, 201, 131, 0.45)',
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
  },
  flowSecondaryLabel: {
    ...Theme.typography.bodyMd,
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.text.secondary,
  },
});
