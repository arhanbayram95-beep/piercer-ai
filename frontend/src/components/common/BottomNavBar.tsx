import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../state/useAppStore';
import { Theme } from '../../ui/theme';

// All 5 top-level destinations, not just Home/Settings — each of the app's
// three modules gets its own tab so a user can jump between them without
// routing back through Home every time. Icon-only by default, with the
// label revealed only on the active tab (see styles.navLabel's display
// toggle below) — 5 items with always-visible labels didn't fit cleanly at
// normal phone widths.
const NAV_ITEMS = [
  { key: 'home', screen: 'home', labelKey: 'nav.home', glyph: '⌂' },
  { key: 'tryOn', screen: 'location', labelKey: 'nav.tryOn', glyph: '💎' },
  { key: 'reference', screen: 'reference', labelKey: 'nav.reference', glyph: '📖' },
  { key: 'match', screen: 'match', labelKey: 'nav.match', glyph: '✨' },
  { key: 'settings', screen: 'settings', labelKey: 'nav.settings', glyph: '⚙' },
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

  return (
    <View style={[styles.bottomNav, { bottom: insets.bottom + 16 }]}>
      {NAV_ITEMS.map((item) => {
        const isActive = item.key === active;
        const label = t(item.labelKey);
        return (
          <Pressable
            key={item.key}
            onPress={() => goToScreen(item.screen)}
            style={[styles.navItem, isActive && styles.navItemActive]}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.navGlyph, isActive && styles.navGlyphActive]}>{item.glyph}</Text>
            {isActive && <Text style={styles.navLabel}>{label}</Text>}
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
    gap: 2,
    backgroundColor: Theme.colors.surface.glassOverlay,
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
    borderRadius: Theme.radius.full,
    paddingHorizontal: 6,
    paddingVertical: 8,
    maxWidth: '94%',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: Theme.radius.full,
    gap: 4,
  },
  navItemActive: {
    backgroundColor: Theme.colors.accent.crimsonPrimary,
    paddingHorizontal: 14,
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
    color: Theme.colors.accent.goldSecondary,
  },
});
