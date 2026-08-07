import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useTranslation } from '../../i18n/useTranslation';
import { JewelryFinish, JEWELRY_FINISHES, JewelryType, JEWELRY_TYPES } from '../../state/slices/studioSlice';
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
  const selectedJewelryType = useAppStore((s) => s.selectedJewelryType);
  const setJewelryType = useAppStore((s) => s.setJewelryType);
  const selectedFinish = useAppStore((s) => s.selectedFinish);
  const setFinish = useAppStore((s) => s.setFinish);

  return (
    <GlassCard style={styles.drawer} testID="piercing-studio-drawer">
      <Text style={styles.sectionHeading}>{t('studio.jewelryType.heading')}</Text>
      <ChipRow
        options={JEWELRY_TYPES}
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
});
