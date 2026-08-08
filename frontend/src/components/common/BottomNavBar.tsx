import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../state/useAppStore';
import { Theme } from '../../ui/theme';

const NAV_ITEMS = [
  { key: 'home', labelKey: 'nav.home', glyph: '⌂' },
  { key: 'settings', labelKey: 'nav.settings', glyph: '⚙' },
] as const;

type NavKey = (typeof NAV_ITEMS)[number]['key'];

interface BottomNavBarProps {
  active: NavKey;
}

export default function BottomNavBar({ active }: BottomNavBarProps) {
  const goToScreen = useAppStore((s) => s.goToScreen);
  const t = useTranslation();
  // Android's edge-to-edge rendering (default since RN 0.76) draws this
  // pill behind the system navigation bar unless it's pushed clear of it —
  // confirmed on-device (3-button nav swallowed taps on the bottom ~2/3 of
  // this bar before this fix).
  const insets = useSafeAreaInsets();

  const handlePress = (key: NavKey) => {
    if (key === 'home') goToScreen('home');
    if (key === 'settings') goToScreen('settings');
  };

  return (
    <View style={[styles.bottomNav, { bottom: insets.bottom + 16 }]}>
      {NAV_ITEMS.map((item) => {
        const isActive = item.key === active;
        const label = t(item.labelKey);
        return (
          <Pressable
            key={item.key}
            onPress={() => handlePress(item.key)}
            style={[styles.navItem, isActive && styles.navItemActive]}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.navGlyph, isActive && styles.navGlyphActive]}>{item.glyph}</Text>
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: Theme.spacing.xs,
    backgroundColor: Theme.colors.surface.glassOverlay,
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.xs,
    paddingVertical: 8,
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: Theme.radius.full,
    gap: 2,
  },
  navItemActive: {
    backgroundColor: Theme.colors.accent.crimsonPrimary,
  },
  navGlyph: {
    color: Theme.colors.text.secondary,
    fontSize: 16,
  },
  navGlyphActive: {
    color: Theme.colors.accent.goldSecondary,
  },
  navLabel: {
    ...Theme.typography.labelSm,
    fontSize: 10,
    color: Theme.colors.text.secondary,
  },
  navLabelActive: {
    color: Theme.colors.accent.goldSecondary,
  },
});
