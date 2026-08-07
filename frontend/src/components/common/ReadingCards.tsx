import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { BadgeCard, ChecklistItem, MetadataBadge, MetricIcon, ScoreCard } from '../../api/types';
import { Theme } from '../../ui/theme';
import GlassCard from './GlassCard';
import SwipeablePager from './SwipeablePager';

// The presentational half of a reading. Every module's reveal is assembled
// from these cards (see RevealScreen) — they take already-fetched data as
// props and never touch the store or the API, per CLAUDE.md's components/
// boundary.

// The photos that produced this reading — shown first, above the badge
// card, since they're part of the "brief and catchy" opening beat. A single
// photo (Career Match) fills the row at full size. Multiple photos
// (Character Analysis, Relationship Harmony) page through one at a time at
// that same large size instead of squeezing side by side — swipeable, with
// progress dots, same pattern as the onboarding carousel.
export function PhotoStripCard({ images, testID }: { images: string[]; testID?: string }) {
  const [index, setIndex] = useState(0);

  if (images.length <= 1) {
    return (
      <View style={styles.photoStrip} testID={testID}>
        {images.map((photo, i) => (
          <Image key={i} source={{ uri: `data:image/jpeg;base64,${photo}` }} style={styles.photoThumb} resizeMode="cover" />
        ))}
      </View>
    );
  }

  return (
    <View testID={testID}>
      <SwipeablePager index={index} onIndexChange={setIndex}>
        {images.map((photo, i) => (
          <Image
            key={i}
            source={{ uri: `data:image/jpeg;base64,${photo}` }}
            style={styles.photoLarge}
            resizeMode="cover"
          />
        ))}
      </SwipeablePager>
      <View style={styles.photoDots} accessibilityLabel="Photo progress">
        {images.map((_, i) => (
          <View key={i} style={[styles.photoDot, i === index && styles.photoDotActive]} />
        ))}
      </View>
    </View>
  );
}

// The backend constrains metric icons to exactly these names so a reading
// can never ask for a glyph that isn't here.
const METRIC_GLYPHS: Record<MetricIcon, string> = {
  eye: '👁',
  sparkles: '✨',
  flame: '🔥',
  target: '🎯',
  heart: '❤️',
  chat: '💬',
  shield: '🛡️',
  zap: '⚡',
  compass: '🧭',
  briefcase: '💼',
  lightbulb: '💡',
};

// Every card leads with a bold icon + title, rather than a small uppercase
// label — the fun, energetic header style the reveal screen is going for
// (see files_for_claude/design_examples), while keeping the app's own
// dark/crimson/gold palette rather than borrowing the reference's light
// theme.
function CardHeader({ icon, title }: { icon?: string; title: string }) {
  return (
    <View style={styles.cardHeader}>
      {icon && <Text style={styles.cardHeaderIcon}>{icon}</Text>}
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  );
}

export function BadgeSummaryCard({ card, icon, testID }: { card: BadgeCard; icon?: string; testID?: string }) {
  return (
    <GlassCard style={styles.card} testID={testID}>
      <CardHeader icon={icon} title={card.title} />
      <View style={styles.badgeChip}>
        <Text style={styles.badgeChipText}>{card.badge_tag}</Text>
      </View>
      <Text style={styles.summary}>{card.summary}</Text>
    </GlassCard>
  );
}

export function ReadingScoreCard({
  card,
  overallLabel,
  icon,
  testID,
}: {
  card: ScoreCard;
  overallLabel: string;
  icon?: string;
  testID?: string;
}) {
  return (
    <GlassCard style={styles.card} testID={testID}>
      <CardHeader icon={icon} title={card.title} />

      <View style={styles.dial} testID="score-dial">
        <Text style={styles.dialScore}>{card.overall_score}</Text>
        <Text style={styles.dialCaption}>{overallLabel}</Text>
      </View>

      <View style={styles.metricGrid}>
        {card.breakdown_metrics.map((metric) => (
          <View key={metric.label} style={styles.metric}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricGlyph}>{METRIC_GLYPHS[metric.icon]}</Text>
              <Text style={styles.metricLabel} numberOfLines={1}>
                {metric.label}
              </Text>
              <Text style={styles.metricScore}>{metric.score}</Text>
            </View>
            <View style={styles.metricTrack}>
              {/* Clamped because the bar is a fill percentage, and a score
                  outside 0-100 would render as a bar wider than its track. */}
              <View style={[styles.metricFill, { width: `${Math.max(0, Math.min(100, metric.score))}%` }]} />
            </View>
          </View>
        ))}
      </View>
    </GlassCard>
  );
}

export interface PillGroup {
  label?: string;
  pills: string[];
  tone?: 'positive' | 'caution';
}

export function PillsCard({
  title,
  icon,
  groups,
  children,
  testID,
}: React.PropsWithChildren<{ title: string; icon?: string; groups: PillGroup[]; testID?: string }>) {
  return (
    <GlassCard style={styles.card} testID={testID}>
      <CardHeader icon={icon} title={title} />
      {children}
      {groups.map((group, index) => (
        <View key={group.label ?? index} style={styles.pillGroup}>
          {group.label && <Text style={styles.groupLabel}>{group.label}</Text>}
          <View style={styles.pillRow}>
            {group.pills.map((pill) => (
              <View key={pill} style={[styles.pill, group.tone === 'caution' && styles.pillCaution]}>
                <Text style={[styles.pillText, group.tone === 'caution' && styles.pillTextCaution]}>{pill}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </GlassCard>
  );
}

export function MetadataBadgeRow({ badges }: { badges: MetadataBadge[] }) {
  return (
    <View style={styles.metaRow}>
      {badges.map((badge) => (
        <View key={badge.key} style={styles.metaBadge}>
          <Text style={styles.metaKey}>{badge.key}</Text>
          <Text style={styles.metaValue}>{badge.value}</Text>
        </View>
      ))}
    </View>
  );
}

export function ChecklistCard({
  title,
  icon,
  items,
  testID,
}: {
  title: string;
  icon?: string;
  items: ChecklistItem[];
  testID?: string;
}) {
  return (
    <GlassCard style={styles.card} testID={testID}>
      <CardHeader icon={icon} title={title} />
      {items.map((item) => (
        <View key={item.headline} style={styles.checkItem}>
          <View style={styles.checkMark}>
            <Text style={styles.checkMarkGlyph}>✓</Text>
          </View>
          <View style={styles.checkBody}>
            <Text style={styles.checkHeadline}>{item.headline}</Text>
            <Text style={styles.checkDescription}>{item.description}</Text>
          </View>
        </View>
      ))}
    </GlassCard>
  );
}

// Generic "one bold word/name + description" card — used for both the
// Celebrity Archetype Match and the Spirit Animal Match, since they're
// structurally identical (title, a single striking answer, a description).
export function HighlightCard({
  title,
  icon,
  name,
  description,
  testID,
}: {
  title: string;
  icon?: string;
  name: string;
  description: string;
  testID?: string;
}) {
  return (
    <GlassCard style={styles.card} testID={testID}>
      <CardHeader icon={icon} title={title} />
      <Text style={styles.matchName}>{name}</Text>
      <Text style={styles.summary}>{description}</Text>
    </GlassCard>
  );
}

const DIAL_SIZE = 132;

const styles = StyleSheet.create({
  photoStrip: {
    flexDirection: 'row',
    gap: Theme.spacing.xs,
  },
  photoThumb: {
    flex: 1,
    aspectRatio: 3 / 4,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.colors.surface.glassBackground,
  },
  photoLarge: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.colors.surface.glassBackground,
  },
  photoDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: Theme.spacing.xs,
  },
  photoDot: {
    width: 6,
    height: 6,
    borderRadius: Theme.radius.full,
    backgroundColor: 'rgba(255, 223, 158, 0.3)',
  },
  photoDotActive: {
    width: 8,
    height: 8,
    backgroundColor: Theme.colors.accent.goldSecondary,
  },
  card: {
    gap: Theme.spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardHeaderIcon: {
    fontSize: 22,
  },
  cardTitle: {
    ...Theme.typography.headlineMd,
    fontSize: 18,
    color: Theme.colors.accent.goldSecondary,
  },
  badgeChip: {
    alignSelf: 'flex-start',
    backgroundColor: Theme.colors.accent.crimsonPrimary,
    borderRadius: Theme.radius.full,
    paddingHorizontal: 18,
    paddingVertical: 9,
    shadowColor: Theme.colors.accent.crimsonPrimary,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  // The reading's punchline — the one line most likely to get screenshotted
  // — so it runs bigger and bolder than a standard headline, with a soft
  // glow rather than a flat fill to read as more alive than the rest of
  // the card stack.
  badgeChipText: {
    ...Theme.typography.headlineLg,
    fontSize: 22,
    letterSpacing: -0.2,
    color: Theme.colors.text.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 1 },
  },
  summary: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
  },
  // A ring rather than a swept arc: an arc needs react-native-svg, which
  // isn't a dependency (adding one would need PROJECT_SPEC.md updated
  // first). The sub-score bars below carry the proportional reading.
  dial: {
    alignSelf: 'center',
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    borderRadius: Theme.radius.full,
    borderWidth: 4,
    borderColor: Theme.colors.accent.goldSecondary,
    backgroundColor: 'rgba(235, 201, 131, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Theme.spacing.xs,
  },
  dialScore: {
    ...Theme.typography.headlineLg,
    fontSize: 44,
    color: Theme.colors.text.primary,
  },
  dialCaption: {
    ...Theme.typography.labelSm,
    fontSize: 10,
    color: Theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.xs,
  },
  metric: {
    // Two per row: half the card width, minus half the grid gap.
    width: '48%',
    flexGrow: 1,
    gap: 6,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricGlyph: {
    fontSize: 13,
  },
  metricLabel: {
    ...Theme.typography.labelSm,
    fontSize: 11,
    color: Theme.colors.text.secondary,
    flex: 1,
  },
  metricScore: {
    ...Theme.typography.labelSm,
    fontSize: 12,
    color: Theme.colors.accent.goldSecondary,
  },
  metricTrack: {
    height: 5,
    borderRadius: Theme.radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  metricFill: {
    height: '100%',
    borderRadius: Theme.radius.full,
    backgroundColor: Theme.colors.accent.crimsonPrimary,
  },
  pillGroup: {
    gap: 6,
    marginTop: 6,
  },
  groupLabel: {
    ...Theme.typography.labelSm,
    fontSize: 10,
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pill: {
    borderRadius: Theme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(235, 201, 131, 0.35)',
    backgroundColor: 'rgba(235, 201, 131, 0.12)',
  },
  pillText: {
    ...Theme.typography.labelSm,
    fontSize: 12,
    color: Theme.colors.accent.goldSecondary,
  },
  // Muted rather than red: growth edges and dynamics to steer around are
  // never framed as warnings or faults (CLAUDE.md, Entertainment Framing).
  pillCaution: {
    borderColor: 'rgba(179, 176, 205, 0.3)',
    backgroundColor: 'rgba(179, 176, 205, 0.1)',
  },
  pillTextCaution: {
    color: Theme.colors.text.secondary,
  },
  metaRow: {
    gap: 6,
    marginTop: 4,
  },
  metaBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: Theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  metaKey: {
    ...Theme.typography.labelSm,
    fontSize: 11,
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
  },
  metaValue: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.primary,
    flexShrink: 1,
    textAlign: 'right',
  },
  checkItem: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  checkMark: {
    width: 24,
    height: 24,
    borderRadius: Theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(129, 199, 132, 0.18)',
  },
  checkMarkGlyph: {
    color: Theme.colors.status.success,
    fontSize: 13,
    fontWeight: '700',
  },
  checkBody: {
    flex: 1,
    gap: 2,
  },
  checkHeadline: {
    ...Theme.typography.headlineMd,
    fontSize: 15,
    color: Theme.colors.text.primary,
  },
  checkDescription: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.secondary,
  },
  matchName: {
    ...Theme.typography.headlineLg,
    fontSize: 30,
    letterSpacing: -0.4,
    color: Theme.colors.accent.goldSecondary,
    textShadowColor: 'rgba(235, 201, 131, 0.4)',
    textShadowRadius: 14,
    textShadowOffset: { width: 0, height: 0 },
  },
});
