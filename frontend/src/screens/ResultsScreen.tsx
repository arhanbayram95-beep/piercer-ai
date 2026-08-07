import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BottomNavBar from '../components/common/BottomNavBar';
import FadeInView from '../components/common/FadeInView';
import GlassCard from '../components/common/GlassCard';
import PrimaryButton from '../components/common/PrimaryButton';
import { ModuleResultKind, readingBadgeCard } from '../api/types';
import { TranslationKey } from '../i18n/translations';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

// Reuses the Analyze hub's own module titles rather than adding new
// translation keys — same three modules, same names, already localized in
// all 10 languages.
const MODULE_META: Record<ModuleResultKind, { icon: string; titleKey: TranslationKey }> = {
  character_analysis: { icon: '🎭', titleKey: 'analyze.module.threeExpression.title' },
  relationship_harmony: { icon: '💞', titleKey: 'analyze.module.relationshipHarmony.title' },
  career_path: { icon: '💼', titleKey: 'analyze.module.careerMatch.title' },
};

export default function ResultsScreen() {
  const goToScreen = useAppStore((s) => s.goToScreen);
  const history = useAppStore((s) => s.history);
  const setReading = useAppStore((s) => s.setReading);
  const t = useTranslation();

  const openEntry = (readingId: string) => {
    const entry = history.find((item) => item.id === readingId);
    if (!entry) return;
    setReading(entry.reading);
    goToScreen('reveal');
  };

  return (
    <View style={styles.container} testID="results-screen">
      <View style={styles.header}>
        <Text style={styles.title}>{t('results.title')}</Text>
      </View>

      {history.length === 0 ? (
        <View style={styles.content}>
          <FadeInView style={styles.emptyState}>
            <View style={styles.emblem}>
              <Text style={styles.emblemGlyph}>▤</Text>
            </View>
            <Text style={styles.emptyTitle}>{t('results.emptyTitle')}</Text>
            <Text style={styles.emptyBody}>{t('results.emptyBody')}</Text>
            <PrimaryButton label={t('common.startAnalysis')} onPress={() => goToScreen('analyze')} />
          </FadeInView>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {history.map((entry, index) => {
            const badge = readingBadgeCard(entry.reading);
            const meta = MODULE_META[entry.reading.module];
            return (
              <FadeInView key={entry.id} delay={index * 60}>
                <Pressable onPress={() => openEntry(entry.id)} testID={`history-entry-${entry.id}`}>
                  <GlassCard style={styles.entryCard}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryIcon}>{meta.icon}</Text>
                      <View style={styles.entryHeaderText}>
                        <Text style={styles.entryModule}>{t(meta.titleKey)}</Text>
                        <Text style={styles.entryDate}>
                          {new Date(entry.completedAt).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.entryBadgeTag}>{badge.badge_tag}</Text>
                    <Text style={styles.entrySummary} numberOfLines={2}>
                      {badge.summary}
                    </Text>
                  </GlassCard>
                </Pressable>
              </FadeInView>
            );
          })}
        </ScrollView>
      )}

      <BottomNavBar active="results" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.middle,
  },
  header: {
    paddingTop: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.gutter,
    paddingBottom: Theme.spacing.sm,
  },
  title: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.text.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.containerPadding,
  },
  emptyState: {
    width: '100%',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  emblem: {
    width: 88,
    height: 88,
    borderRadius: Theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.surface.glassBackground,
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
    marginBottom: Theme.spacing.xs,
  },
  emblemGlyph: {
    fontSize: 36,
    color: Theme.colors.text.muted,
  },
  emptyTitle: {
    ...Theme.typography.headlineMd,
    color: Theme.colors.text.primary,
  },
  emptyBody: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
  },
  list: {
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingBottom: 120,
    gap: Theme.spacing.sm,
  },
  entryCard: {
    gap: 6,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  entryIcon: {
    fontSize: 20,
  },
  entryHeaderText: {
    flex: 1,
  },
  entryModule: {
    ...Theme.typography.labelSm,
    fontSize: 11,
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
  },
  entryDate: {
    ...Theme.typography.labelSm,
    fontSize: 11,
    color: Theme.colors.text.muted,
    marginTop: 2,
  },
  entryBadgeTag: {
    ...Theme.typography.headlineMd,
    fontSize: 18,
    color: Theme.colors.accent.goldSecondary,
  },
  entrySummary: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.secondary,
  },
});
