import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { validJewelryTypesFor } from '../../content/locationJewelryTypes';
import { useTranslation } from '../../i18n/useTranslation';
import {
  JewelryFinish,
  JEWELRY_FINISHES,
  JewelryType,
  MAX_STACKED_ITEMS,
} from '../../state/slices/studioSlice';
import { useAppStore } from '../../state/useAppStore';
import { TranslationKey } from '../../i18n/translations';
import { Theme } from '../../ui/theme';
import GlassCard from './GlassCard';

const JEWELRY_TYPE_LABEL_KEYS: Record<JewelryType, TranslationKey> = {
  hoops: 'studio.jewelry.hoops',
  studs: 'studio.jewelry.studs',
  barbells: 'studio.jewelry.barbells',
  industrial: 'studio.jewelry.industrial',
  septum: 'studio.jewelry.septum',
  dermal: 'studio.jewelry.dermal',
};

const FINISH_LABEL_KEYS: Record<JewelryFinish, TranslationKey> = {
  silver: 'studio.finish.silver',
  gold: 'studio.finish.gold',
  titanium: 'studio.finish.titanium',
  blackSteel: 'studio.finish.blackSteel',
};

interface ChipRowProps<T extends string> {
  options: readonly T[];
  labelKeys: Record<T, TranslationKey>;
  selected: T;
  onSelect: (value: T) => void;
  testIDPrefix: string;
}

function ChipRow<T extends string>({ options, labelKeys, selected, onSelect, testIDPrefix }: ChipRowProps<T>) {
  const t = useTranslation();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
      {options.map((option) => {
        const isSelected = option === selected;
        return (
          <Text
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            testID={`${testIDPrefix}-${option}`}
            onPress={() => onSelect(option)}
            style={[styles.chip, isSelected && styles.chipSelected]}
          >
            {t(labelKeys[option])}
          </Text>
        );
      })}
    </ScrollView>
  );
}

// Bottom-of-screen picker for jewelry type + finish — hosted by
// StudioScreen, which owns the captured-photo preview above it. Selections
// are read/written straight to the studioSlice (module boundary allows
// components to touch the store directly, just not `fetch`), so
// StudioScreen's "Preview Jewelry" CTA can read the current selection
// without any prop plumbing.
export default function PiercingStudioDrawer() {
  const t = useTranslation();
  const selectedLocation = useAppStore((s) => s.selectedLocation);
  const selectedJewelryType = useAppStore((s) => s.selectedJewelryType);
  const setJewelryType = useAppStore((s) => s.setJewelryType);
  const selectedFinish = useAppStore((s) => s.selectedFinish);
  const setFinish = useAppStore((s) => s.setFinish);
  const stackedItems = useAppStore((s) => s.stackedItems);
  const addStackedItem = useAppStore((s) => s.addStackedItem);
  const removeStackedItem = useAppStore((s) => s.removeStackedItem);
  const isProActive = useAppStore((s) => s.isProActive);
  const goToScreen = useAppStore((s) => s.goToScreen);

  // Only offer jewelry types that anatomically fit the picked location
  // (content/locationJewelryTypes.ts) — falls back to every type if
  // somehow no location is selected, same defensive pattern
  // CaptureScreen's guide copy already uses.
  const validJewelryTypes = validJewelryTypesFor(selectedLocation);

  // If the location changes to one where the currently-selected jewelry
  // type is no longer valid (or a location with no prior selection at all
  // narrows the options), auto-correct to the first valid type rather than
  // leaving an invalid type selected with no chip showing it as selected.
  useEffect(() => {
    if (!validJewelryTypes.includes(selectedJewelryType)) {
      setJewelryType(validJewelryTypes[0]);
    }
    // Deliberately keyed only on selectedLocation, not selectedJewelryType
    // or validJewelryTypes — re-running this on every jewelry-type change
    // would fight a user's own in-place selection instead of only reacting
    // to a location change.
  }, [selectedLocation]);

  // "Multi-piercing stacking" is a piercer_pro_access-gated capability
  // (entitlementSlice.ts) — a non-Pro user tapping this is routed straight
  // to the paywall, same pattern SettingsScreen's "Manage Subscription" row
  // already uses for a Pro-gated action.
  const handleAddAnotherPiece = () => {
    if (!isProActive) {
      goToScreen('paywall');
      return;
    }
    if (stackedItems.length >= MAX_STACKED_ITEMS) return;
    addStackedItem({ jewelryType: selectedJewelryType, finish: selectedFinish });
  };

  return (
    <GlassCard style={styles.drawer} testID="piercing-studio-drawer">
      <Text style={styles.sectionHeading}>{t('studio.jewelryType.heading')}</Text>
      <ChipRow
        options={validJewelryTypes}
        labelKeys={JEWELRY_TYPE_LABEL_KEYS}
        selected={selectedJewelryType}
        onSelect={setJewelryType}
        testIDPrefix="jewelry-type-chip"
      />

      <Text style={[styles.sectionHeading, styles.finishHeading]}>{t('studio.finish.heading')}</Text>
      <ChipRow
        options={JEWELRY_FINISHES}
        labelKeys={FINISH_LABEL_KEYS}
        selected={selectedFinish}
        onSelect={setFinish}
        testIDPrefix="jewelry-finish-chip"
      />

      {stackedItems.length > 0 && (
        <>
          <Text style={[styles.sectionHeading, styles.finishHeading]}>{t('studio.stackedPieces.heading')}</Text>
          <View style={styles.stackedRow} testID="stacked-items-row">
            {stackedItems.map((item, index) => (
              <View key={`${item.jewelryType}-${item.finish}-${index}`} style={styles.stackedChip}>
                <Text style={styles.stackedChipText}>
                  {t(JEWELRY_TYPE_LABEL_KEYS[item.jewelryType])} · {t(FINISH_LABEL_KEYS[item.finish])}
                </Text>
                <Pressable
                  onPress={() => removeStackedItem(index)}
                  accessibilityRole="button"
                  accessibilityLabel="Remove"
                  testID={`stacked-item-remove-${index}`}
                >
                  <Text style={styles.stackedChipRemove}>×</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </>
      )}

      <Pressable
        onPress={handleAddAnotherPiece}
        accessibilityRole="button"
        testID="add-another-piece-button"
        style={styles.addAnotherButton}
      >
        <Text style={styles.addAnotherText}>{t('studio.addAnotherPiece')}</Text>
      </Pressable>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  drawer: {
    gap: Theme.spacing.xs,
  },
  sectionHeading: {
    ...Theme.typography.labelSm,
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
  },
  finishHeading: {
    marginTop: Theme.spacing.xs,
  },
  chipRow: {
    gap: Theme.spacing.xs,
    paddingVertical: 4,
  },
  chip: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
    borderWidth: 1,
    borderColor: Theme.colors.surface.metallicBorder,
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  chipSelected: {
    color: Theme.colors.text.primary,
    backgroundColor: Theme.colors.accent.electricPurple,
    borderColor: Theme.colors.accent.electricPurple,
    fontWeight: '600',
  },
  stackedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.xs,
  },
  stackedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: Theme.colors.accent.electricPurple,
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 6,
  },
  stackedChipText: {
    ...Theme.typography.bodyMd,
    fontSize: 12,
    color: Theme.colors.text.primary,
  },
  stackedChipRemove: {
    color: Theme.colors.text.secondary,
    fontSize: 16,
    lineHeight: 16,
  },
  addAnotherButton: {
    marginTop: Theme.spacing.xs,
    alignSelf: 'flex-start',
  },
  addAnotherText: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.accent.electricPurple,
    fontWeight: '600',
  },
});
