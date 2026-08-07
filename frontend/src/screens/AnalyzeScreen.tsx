import React from 'react';
import { Image, ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import BottomNavBar from '../components/common/BottomNavBar';
import FadeInView from '../components/common/FadeInView';
import GlassCard from '../components/common/GlassCard';
import { ReadingModuleId } from '../api/types';
import { useTranslation } from '../i18n/useTranslation';
import { TranslationKey } from '../i18n/translations';
import { AppScreen } from '../state/slices/navigationSlice';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

interface AnalysisModule {
  id: ReadingModuleId;
  titleKey: TranslationKey;
  card: ImageSourcePropType;
  targetScreen: AppScreen;
  available: boolean;
}

// Full module cards (frontend/assets/modules/) — self-contained artwork with
// background, title, description, and CTA already composed at design time,
// at a fixed 385x172 aspect ratio (the PNGs are @2x exports at 770x344 —
// source pixel density only affects sharpness; the rendered size is always
// pinned to an explicit width/height computed from the screen, see
// cardWidth/cardHeight in AnalyzeScreen below).
// Static requires, not a dynamic map lookup, because Metro needs
// require() calls to be statically analyzable.
const MODULE_CARD_ASPECT_RATIO = 385 / 172;

// Near-zero — the cards should read as almost edge-to-edge, with barely a
// sliver of margin left. Drives both the card width calculation and the
// screen's horizontal padding so the two stay in sync.
const HORIZONTAL_MARGIN = 4;
const MODULE_CARDS: Record<ReadingModuleId, ImageSourcePropType> = {
  'three-expression': require('../../assets/modules/character-analysis.png'),
  'relationship-harmony': require('../../assets/modules/relationship-harmony.png'),
  'career-match': require('../../assets/modules/career-match.png'),
};

// Add future modules here — nothing else needs to change to surface them.
// Each `id` must have a matching system prompt in
// backend/src/services/systemPrompt.ts (see READING_SYSTEM_PROMPTS).
const MODULES: AnalysisModule[] = [
  {
    id: 'three-expression',
    titleKey: 'analyze.module.threeExpression.title',
    card: MODULE_CARDS['three-expression'],
    targetScreen: 'capture',
    available: true,
  },
  {
    id: 'relationship-harmony',
    titleKey: 'analyze.module.relationshipHarmony.title',
    card: MODULE_CARDS['relationship-harmony'],
    targetScreen: 'capture',
    available: true,
  },
  {
    id: 'career-match',
    titleKey: 'analyze.module.careerMatch.title',
    card: MODULE_CARDS['career-match'],
    targetScreen: 'capture',
    available: true,
  },
];

export default function AnalyzeScreen() {
  const goToScreen = useAppStore((s) => s.goToScreen);
  const setSelectedModule = useAppStore((s) => s.setSelectedModule);
  const t = useTranslation();

  // Computed in JS rather than a `width: '100%'` style: percentage width
  // does not reliably resolve down through the ScrollView -> Animated.View
  // (FadeInView) -> Pressable -> Image chain here, and was rendering each
  // card at close to its native pixel size, overflowing off the right edge
  // of the screen instead of filling it. An explicit pixel width sidesteps
  // that chain entirely.
  const { width: windowWidth } = useWindowDimensions();
  const cardWidth = windowWidth - HORIZONTAL_MARGIN * 2;
  const cardHeight = cardWidth / MODULE_CARD_ASPECT_RATIO;

  return (
    <View style={styles.container} testID="analyze-screen">
      <View style={styles.header}>
        <Text style={styles.title}>{t('analyze.title')}</Text>
        <Text style={styles.subtitle}>{t('analyze.subtitle')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {MODULES.map((module, index) => {
          const title = t(module.titleKey);
          return (
            <FadeInView key={module.id} delay={index * 80}>
              <Pressable
                onPress={() => {
                  if (!module.available) return;
                  setSelectedModule(module.id);
                  goToScreen(module.targetScreen);
                }}
                accessibilityRole="button"
                accessibilityLabel={title}
                accessibilityState={{ disabled: !module.available }}
                testID={`analyze-module-${module.id}`}
                style={!module.available && styles.moduleCardDisabled}
              >
                <Image
                  source={module.card}
                  style={[styles.moduleCard, { width: cardWidth, height: cardHeight }]}
                  resizeMode="contain"
                />
                {!module.available && (
                  <View style={styles.comingSoonBadge}>
                    <Text style={styles.comingSoonBadgeText}>{t('analyze.comingSoonBadge')}</Text>
                  </View>
                )}
              </Pressable>
            </FadeInView>
          );
        })}

        <FadeInView delay={MODULES.length * 80}>
          <GlassCard style={styles.comingSoonCard}>
            <Text style={styles.comingSoonText}>{t('analyze.comingSoon')}</Text>
          </GlassCard>
        </FadeInView>
      </ScrollView>

      <BottomNavBar active="analyze" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.middle,
  },
  header: {
    // paddingTop stays at spacing.xl — there's no SafeAreaView in this app,
    // so this doubles as the status-bar/notch clearance on every screen,
    // not just visual breathing room. Only the padding below it (and the
    // horizontal margin, shared with the cards) gets tightened here.
    paddingTop: Theme.spacing.xl,
    paddingHorizontal: HORIZONTAL_MARGIN,
    paddingBottom: Theme.spacing.xs,
    gap: Theme.spacing.xs,
  },
  title: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.text.primary,
  },
  subtitle: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
  },
  scrollContent: {
    paddingHorizontal: HORIZONTAL_MARGIN,
    paddingBottom: 120,
    gap: 4,
  },
  // Full self-contained card artwork (background, title, description, and
  // CTA baked in at design time) — full width, edge-to-edge, like the
  // original dynamic hub cards. width/height are computed in JS (see
  // cardWidth/cardHeight above) and merged in at render time.
  moduleCard: {
    alignSelf: 'center',
  },
  moduleCardDisabled: {
    opacity: 0.55,
  },
  comingSoonBadge: {
    position: 'absolute',
    top: Theme.spacing.sm,
    right: Theme.spacing.sm,
    backgroundColor: 'rgba(235, 201, 131, 0.15)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  comingSoonBadgeText: {
    ...Theme.typography.labelSm,
    fontSize: 9,
    color: Theme.colors.accent.goldSecondary,
  },
  comingSoonCard: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
  },
  comingSoonText: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.muted,
  },
});
