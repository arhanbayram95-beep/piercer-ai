import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, Modal, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { readingBadgeCard, ReadingResult, ShareableSection } from '../../api/types';
import { useTranslation } from '../../i18n/useTranslation';
import { Theme } from '../../ui/theme';
import AnimatedCheckbox from './AnimatedCheckbox';
import PrimaryButton from './PrimaryButton';

interface ShareOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  reading: ReadingResult;
  sections: ShareableSection[];
  hasPhoto: boolean;
  includePhoto: boolean;
  onIncludePhotoChange: (value: boolean) => void;
  selectedSectionIds: Set<string>;
  onSelectedSectionIdsChange: (ids: Set<string>) => void;
  // The image-card path still needs the parent's off-screen ShareCard +
  // view-shot ref (see RevealScreen) — this modal only decides *what* goes
  // on the card, not how it's captured.
  onShareImage: () => void;
}

function ShareOptionRow({
  icon,
  title,
  subtitle,
  onPress,
  testID,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  testID: string;
}) {
  return (
    <Pressable style={styles.optionRow} onPress={onPress} accessibilityRole="button" testID={testID}>
      <Text style={styles.optionIcon}>{icon}</Text>
      <View style={styles.optionTextBlock}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

export default function ShareOptionsModal({
  visible,
  onClose,
  reading,
  sections,
  hasPhoto,
  includePhoto,
  onIncludePhotoChange,
  selectedSectionIds,
  onSelectedSectionIdsChange,
  onShareImage,
}: ShareOptionsModalProps) {
  const t = useTranslation();
  const [mode, setMode] = useState<'menu' | 'builder'>('menu');

  const close = () => {
    setMode('menu');
    onClose();
  };

  const toggleSection = (id: string) => {
    const next = new Set(selectedSectionIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectedSectionIdsChange(next);
  };

  const buildShareText = () => {
    const badge = readingBadgeCard(reading);
    return t('share.shareTextTemplate', { badge: badge.badge_tag, summary: badge.summary });
  };

  const handleShareImage = () => {
    close();
    onShareImage();
  };

  const handleShareText = async () => {
    close();
    try {
      await Share.share({ message: buildShareText() });
    } catch {
      // Sharing is a nice-to-have — never block the reveal flow on failure.
    }
  };

  const handleCopyText = async () => {
    await Clipboard.setStringAsync(buildShareText());
    close();
    Alert.alert(t('share.copiedTitle'), t('share.copiedBody'));
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={close}>
      <View style={styles.backdrop}>
        <View style={styles.sheet} testID="share-options-modal">
          {mode === 'menu' ? (
            <>
              <Text style={styles.title}>{t('share.modalTitle')}</Text>
              <View style={styles.options}>
                <ShareOptionRow
                  icon="🖼️"
                  title={t('share.optionImage.title')}
                  subtitle={t('share.optionImage.subtitle')}
                  onPress={() => setMode('builder')}
                  testID="share-option-image"
                />
                <ShareOptionRow
                  icon="💬"
                  title={t('share.optionText.title')}
                  subtitle={t('share.optionText.subtitle')}
                  onPress={handleShareText}
                  testID="share-option-text"
                />
                <ShareOptionRow
                  icon="📋"
                  title={t('share.optionCopy.title')}
                  subtitle={t('share.optionCopy.subtitle')}
                  onPress={handleCopyText}
                  testID="share-option-copy"
                />
              </View>
              <PrimaryButton label={t('common.close')} variant="secondary" onPress={close} testID="share-options-close" />
            </>
          ) : (
            <>
              <Text style={styles.title}>{t('share.builder.title')}</Text>
              <Text style={styles.builderSubtitle}>{t('share.builder.subtitle')}</Text>

              {hasPhoto && (
                <AnimatedCheckbox
                  checked={includePhoto}
                  onToggle={() => onIncludePhotoChange(!includePhoto)}
                  label={t('share.includePhoto')}
                  testID="share-include-photo-checkbox"
                />
              )}

              <View style={styles.sectionList}>
                {sections.map((section) => (
                  <AnimatedCheckbox
                    key={section.id}
                    checked={selectedSectionIds.has(section.id)}
                    onToggle={() => toggleSection(section.id)}
                    label={section.title}
                    testID={`share-section-${section.id}`}
                  />
                ))}
              </View>

              <PrimaryButton
                label={t('share.builder.createButton')}
                onPress={handleShareImage}
                disabled={selectedSectionIds.size === 0 && !includePhoto}
                testID="share-builder-create"
              />
              <PrimaryButton
                label={t('share.builder.back')}
                variant="secondary"
                onPress={() => setMode('menu')}
                testID="share-builder-back"
              />
            </>
          )}
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
    maxHeight: '85%',
    backgroundColor: Theme.colors.background.middle,
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  title: {
    ...Theme.typography.headlineMd,
    color: Theme.colors.accent.goldSecondary,
    textAlign: 'center',
  },
  builderSubtitle: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: -Theme.spacing.sm,
  },
  options: {
    gap: Theme.spacing.xs,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: Theme.spacing.sm,
    borderRadius: Theme.radius.lg,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
  },
  optionIcon: {
    fontSize: 26,
  },
  optionTextBlock: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    ...Theme.typography.bodyMd,
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.text.primary,
  },
  optionSubtitle: {
    ...Theme.typography.bodyMd,
    fontSize: 12,
    color: Theme.colors.text.secondary,
  },
  sectionList: {
    gap: Theme.spacing.sm,
  },
});
