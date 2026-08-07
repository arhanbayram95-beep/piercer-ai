import React, { useEffect, useRef, useState } from 'react';
import { Animated, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import FadeInView from '../components/common/FadeInView';
import GlassCard from '../components/common/GlassCard';
import PrimaryButton from '../components/common/PrimaryButton';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';
import { getStoreListingUrl } from '../utils/storeLinks';

const STAR_COUNT = 5;
const STAR_EMPTY_COLOR = 'rgba(228, 194, 125, 0.3)';

function AnimatedStar({ filled, onPress, label }: { filled: boolean; onPress: () => void; label: string }) {
  const scale = useRef(new Animated.Value(1)).current;
  const colorProgress = useRef(new Animated.Value(filled ? 1 : 0)).current;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    Animated.timing(colorProgress, { toValue: filled ? 1 : 0, duration: 150, useNativeDriver: false }).start();
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.35, useNativeDriver: true, speed: 40, bounciness: 20 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 10 }),
    ]).start();
    // React only to the filled transition, not to the identity of the animated values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filled]);

  const color = colorProgress.interpolate({ inputRange: [0, 1], outputRange: [STAR_EMPTY_COLOR, Theme.colors.accent.goldSecondary] });

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
      <Animated.Text style={[styles.star, { color, transform: [{ scale }] }]}>★</Animated.Text>
    </Pressable>
  );
}

export default function ReviewScreen() {
  const [rating, setRating] = useState(0);
  const goBack = useAppStore((s) => s.goBack);
  const t = useTranslation();

  const handleRateOnAppStore = async () => {
    await Linking.openURL(getStoreListingUrl());
    goBack();
  };

  return (
    <View style={styles.container} testID="review-screen">
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('review.headerTitle')}</Text>
        <Pressable onPress={goBack} accessibilityRole="button" accessibilityLabel="Close">
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <FadeInView>
          <GlassCard style={styles.card}>
            <View style={styles.emblem}>
              <Text style={styles.emblemGlyph}>✦</Text>
            </View>
            <Text style={styles.headline}>{t('review.headline')}</Text>
            <Text style={styles.body}>{t('review.body')}</Text>

            <View style={styles.starRow} testID="star-rating">
              {Array.from({ length: STAR_COUNT }).map((_, index) => (
                <AnimatedStar
                  key={index}
                  filled={index < rating}
                  onPress={() => setRating(index + 1)}
                  label={t('review.starLabel', { n: index + 1 })}
                />
              ))}
            </View>

            <View style={styles.actions}>
              <PrimaryButton label={t('review.rateButton')} onPress={handleRateOnAppStore} />
              <Pressable onPress={goBack} accessibilityRole="button">
                <Text style={styles.maybeLater}>{t('review.maybeLater')}</Text>
              </Pressable>
            </View>
          </GlassCard>
        </FadeInView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.middle,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.containerPadding,
  },
  headerTitle: {
    ...Theme.typography.headlineMd,
    fontSize: 20,
    color: Theme.colors.accent.goldSecondary,
  },
  closeIcon: {
    color: Theme.colors.accent.goldSecondary,
    fontSize: 18,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.containerPadding,
  },
  card: {
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  emblem: {
    width: 96,
    height: 96,
    borderRadius: Theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.surface.glassBackground,
    borderWidth: 1,
    borderColor: Theme.colors.accent.goldSecondary,
  },
  emblemGlyph: {
    fontSize: 40,
    color: Theme.colors.accent.goldSecondary,
  },
  headline: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.accent.goldSecondary,
    textAlign: 'center',
  },
  body: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
  },
  starRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: Theme.spacing.sm,
  },
  star: {
    fontSize: 32,
  },
  actions: {
    width: '100%',
    gap: Theme.spacing.xs,
    alignItems: 'center',
  },
  maybeLater: {
    ...Theme.typography.labelSm,
    color: Theme.colors.text.secondary,
    paddingTop: Theme.spacing.xs,
  },
});
