import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import DisclaimerFooter from '../components/common/DisclaimerFooter';
import FadeInView from '../components/common/FadeInView';
import PrimaryButton from '../components/common/PrimaryButton';
import ShareCard from '../components/common/ShareCard';
import ShareOptionsModal from '../components/common/ShareOptionsModal';
import {
  BadgeSummaryCard,
  ChecklistCard,
  HighlightCard,
  MetadataBadgeRow,
  PhotoStripCard,
  PillsCard,
  ReadingScoreCard,
} from '../components/common/ReadingCards';
import { ReadingResult, readingShareableSections } from '../api/types';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

type Translate = ReturnType<typeof useTranslation>;

// One card stack per module, in the order the reading reads best: the
// captured photos, then the hook (badge tag), then progressively more
// detail as it goes — score only survives for relationship_harmony now
// (see systemPrompt.ts). Each module's shape is guaranteed by its own
// response schema — see backend readingSchema.ts.
function readingCards(reading: ReadingResult, images: string[], t: Translate): React.ReactNode[] {
  const photos = <PhotoStripCard key="photos" images={images} testID="reveal-photos" />;

  switch (reading.module) {
    case 'character_analysis':
      return [
        photos,
        <BadgeSummaryCard key="archetype" card={reading.archetype_card} icon="🎭" testID="archetype-card" />,
        <BadgeSummaryCard
          key="facial-structure"
          card={{
            title: reading.facial_structure_card.title,
            badge_tag: reading.facial_structure_card.shape_tag,
            summary: reading.facial_structure_card.description,
          }}
          icon="📐"
          testID="facial-structure-card"
        />,
        <HighlightCard
          key="spirit-animal"
          title={reading.spirit_animal_card.title}
          icon="🐾"
          name={reading.spirit_animal_card.animal}
          description={reading.spirit_animal_card.description}
          testID="spirit-animal-card"
        />,
        <PillsCard
          key="traits"
          title={reading.traits_card.title}
          icon="✨"
          testID="traits-card"
          groups={[
            { label: t('reveal.strengths'), pills: reading.traits_card.strength_pills },
            { label: t('reveal.growthEdges'), pills: reading.traits_card.growth_pills, tone: 'caution' },
          ]}
        >
          <MetadataBadgeRow badges={reading.traits_card.metadata_badges} />
        </PillsCard>,
        <HighlightCard
          key="celebrity"
          title={reading.celebrity_match_card.title}
          icon="⭐"
          name={reading.celebrity_match_card.match_name}
          description={reading.celebrity_match_card.match_description}
          testID="celebrity-card"
        />,
      ];
    case 'relationship_harmony':
      return [
        photos,
        <BadgeSummaryCard key="vibe" card={reading.vibe_card} icon="💞" testID="archetype-card" />,
        <ReadingScoreCard
          key="score"
          card={reading.chemistry_score_card}
          overallLabel={t('reveal.overallLabel')}
          icon="🔥"
          testID="score-card"
        />,
        <PillsCard
          key="dynamics"
          title={reading.dynamics_card.title}
          icon="🌊"
          testID="dynamics-card"
          groups={[
            { label: t('reveal.bestChemistry'), pills: reading.dynamics_card.best_chemistry_pills },
            { label: t('reveal.vibesToAvoid'), pills: reading.dynamics_card.vibes_to_avoid_pills, tone: 'caution' },
          ]}
        />,
        <ChecklistCard
          key="guidance"
          title={reading.guidance_card.title}
          icon="✅"
          items={reading.guidance_card.checklist_items}
          testID="checklist-card"
        />,
      ];
    case 'career_path':
      return [
        photos,
        <BadgeSummaryCard key="work" card={reading.work_archetype_card} icon="💼" testID="archetype-card" />,
        <PillsCard
          key="domains"
          title={reading.domains_card.title}
          icon="🧭"
          testID="domains-card"
          groups={[{ pills: reading.domains_card.top_industry_pills }]}
        />,
        <ChecklistCard
          key="roles"
          title={reading.recommendations_card.title}
          icon="✅"
          items={reading.recommendations_card.checklist_items}
          testID="checklist-card"
        />,
      ];
  }
}

export default function RevealScreen() {
  const reading = useAppStore((s) => s.reading);
  const images = useAppStore((s) => s.images);
  const clearImages = useAppStore((s) => s.clearImages);
  const goToScreen = useAppStore((s) => s.goToScreen);
  const t = useTranslation();
  const shareCardRef = useRef<View>(null);
  const insets = useSafeAreaInsets();
  const [shareOptionsVisible, setShareOptionsVisible] = useState(false);
  const [includePhotoInCard, setIncludePhotoInCard] = useState(false);
  const [selectedSectionIds, setSelectedSectionIds] = useState<Set<string>>(new Set());

  // The captured photos are still in memory when this screen mounts (never
  // persisted, per PROJECT_SPEC.md §3) — shown at the top of the card stack
  // below, then purged the moment the user leaves, however they leave.
  useEffect(() => clearImages, [clearImages]);

  // Every section starts selected — the builder is an opt-out picker, not
  // an opt-in one, so a user who never opens it still gets the full card.
  useEffect(() => {
    if (reading) setSelectedSectionIds(new Set(readingShareableSections(reading).map((section) => section.id)));
  }, [reading]);

  // The off-screen ShareCard below already re-renders with the current
  // includePhotoInCard/images state, so capturing it here always reflects
  // whatever the user picked in ShareOptionsModal — no extra plumbing
  // needed between the toggle and the capture.
  const handleShareImage = async () => {
    if (!shareCardRef.current) return;
    try {
      const uri = await captureRef(shareCardRef, { format: 'png', quality: 0.9 });
      await Share.share({ url: uri });
    } catch {
      // Sharing is a nice-to-have — never block the reveal flow on failure.
    }
  };

  if (!reading) {
    return (
      <View style={styles.container} testID="reveal-screen">
        <PrimaryButton label={t('reveal.doneButton')} onPress={() => goToScreen('review')} />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="reveal-screen">
      <View style={styles.header}>
        <Text style={styles.title}>{t('reveal.title')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {readingCards(reading, images, t).map((card, index) => (
          <FadeInView key={index} delay={index * 70}>
            {card}
          </FadeInView>
        ))}
        <DisclaimerFooter />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Theme.spacing.sm + insets.bottom }]}>
        <PrimaryButton
          label={t('reveal.shareButton')}
          variant="secondary"
          flow
          icon="⤴"
          onPress={() => setShareOptionsVisible(true)}
          testID="share-reading-button"
        />
        <PrimaryButton label={t('reveal.doneButton')} flow icon="✓" onPress={() => goToScreen('review')} />
      </View>

      <View style={styles.offscreen} pointerEvents="none">
        <ShareCard
          ref={shareCardRef}
          sections={readingShareableSections(reading).filter((section) => selectedSectionIds.has(section.id))}
          photo={includePhotoInCard ? images[0] : undefined}
        />
      </View>

      <ShareOptionsModal
        visible={shareOptionsVisible}
        onClose={() => setShareOptionsVisible(false)}
        reading={reading}
        sections={readingShareableSections(reading)}
        hasPhoto={images.length > 0}
        includePhoto={includePhotoInCard}
        onIncludePhotoChange={setIncludePhotoInCard}
        selectedSectionIds={selectedSectionIds}
        onSelectedSectionIdsChange={setSelectedSectionIds}
        onShareImage={handleShareImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.start,
  },
  header: {
    paddingTop: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.gutter,
    paddingBottom: Theme.spacing.sm,
  },
  title: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.accent.goldSecondary,
  },
  // Tighter than Theme.spacing.containerPadding (20) — the reveal cards
  // read bigger and closer to the design_examples reference with less
  // margin eating into their width.
  scrollContent: {
    paddingHorizontal: 8,
    paddingBottom: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingBottom: Theme.spacing.sm,
    gap: Theme.spacing.sm,
  },
  offscreen: {
    position: 'absolute',
    top: 0,
    left: -9999,
  },
});
