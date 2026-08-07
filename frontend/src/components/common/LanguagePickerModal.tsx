import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '../../i18n/useTranslation';
import { SUPPORTED_LANGUAGES } from '../../state/slices/localeSlice';
import { useAppStore } from '../../state/useAppStore';
import { Theme } from '../../ui/theme';

interface LanguagePickerModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function LanguagePickerModal({ visible, onClose }: LanguagePickerModalProps) {
  const languageCode = useAppStore((s) => s.languageCode);
  const setLanguageCode = useAppStore((s) => s.setLanguageCode);
  const t = useTranslation();

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet} testID="language-picker-modal">
          <Text style={styles.title}>{t('settings.row.language')}</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {SUPPORTED_LANGUAGES.map((language) => {
              const selected = language.code === languageCode;
              return (
                <Pressable
                  key={language.code}
                  onPress={() => {
                    setLanguageCode(language.code);
                    onClose();
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  testID={`language-option-${language.code}`}
                  style={styles.row}
                >
                  <View style={styles.rowLeft}>
                    <Text style={styles.flag}>{language.flag}</Text>
                    <View>
                      <Text style={styles.rowLabel}>{language.englishName}</Text>
                      <Text style={styles.rowSubLabel}>{language.nativeName}</Text>
                    </View>
                  </View>
                  {selected && <Text style={styles.checkmark}>✓</Text>}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 7, 27, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.containerPadding,
  },
  sheet: {
    width: '100%',
    maxHeight: '75%',
    backgroundColor: Theme.colors.background.middle,
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.md,
  },
  title: {
    ...Theme.typography.headlineMd,
    color: Theme.colors.accent.goldSecondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Theme.colors.surface.glassBorder,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flag: {
    fontSize: 22,
  },
  rowLabel: {
    ...Theme.typography.bodyMd,
    fontSize: 15,
    color: Theme.colors.text.primary,
  },
  rowSubLabel: {
    ...Theme.typography.bodyMd,
    fontSize: 12,
    color: Theme.colors.text.secondary,
  },
  checkmark: {
    color: Theme.colors.accent.goldSecondary,
    fontSize: 16,
  },
});
