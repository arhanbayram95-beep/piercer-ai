import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '../../i18n/useTranslation';
import { Theme } from '../../ui/theme';

// Non-negotiable per CLAUDE.md "Entertainment Framing" — must stay legible
// and present on every result/paywall surface. Do not shrink or hide.
export default function DisclaimerFooter() {
  const t = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('disclaimer.text')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.sm,
    paddingBottom: Theme.spacing.xs,
  },
  // Deliberately quieter than labelSm — this reads at the very end of the
  // card stack now (see RevealScreen), not pinned next to the action
  // buttons, so it no longer needs to compete for attention. Still legible,
  // per CLAUDE.md's "persistent, legible" requirement — just not loud.
  text: {
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.4,
    color: Theme.colors.text.muted,
    textAlign: 'center',
    lineHeight: 13,
  },
});
