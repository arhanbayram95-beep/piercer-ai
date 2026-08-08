import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MatchApiError, matchPhoto, MatchPhotoResult } from '../api/match';
import BottomNavBar from '../components/common/BottomNavBar';
import GlassCard from '../components/common/GlassCard';
import PrimaryButton from '../components/common/PrimaryButton';
import { recommendedJewelryFor } from '../content/locationJewelryRecommendations';
import { PiercingLocationId, PIERCING_LOCATIONS } from '../content/piercingLocations';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

// Photo entry point of the personality-matching module — genuinely separate
// from PersonalityQuizScreen, per the product brief (not a tab on a shared
// form). This is the leg that actually needs a real AI vision call
// (POST /api/v1/match/photo, api/match.ts) — the quiz leg is pure client
// logic and never touches the network.
//
// DELIBERATE EXCEPTION: no DisclaimerFooter/entertainment disclaimer is
// shown anywhere on this screen or its result view. This is an explicit,
// informed override of CLAUDE.md's usual "disclaimers are non-negotiable"
// rule, confirmed by the product owner specifically for this module — not
// an oversight. Same transparency pattern as the BIPA flag in
// backend/src/routes/legal.ts and the matching note in
// PersonalityQuizScreen.tsx. Carries BottomNavBar (active="match") per
// explicit user feedback that the nav bar should be universal. Tapping
// another module mid-flow does NOT clear any in-progress state here (there
// is none to clear — a match result is either shown or it isn't; nothing
// is captured/staged that could be silently lost).
export default function PersonalityPhotoScreen() {
  const t = useTranslation();
  const goBack = useAppStore((s) => s.goBack);
  const goToScreen = useAppStore((s) => s.goToScreen);
  const setLocation = useAppStore((s) => s.setLocation);
  const setJewelryType = useAppStore((s) => s.setJewelryType);
  const setFinish = useAppStore((s) => s.setFinish);

  const [isBusy, setIsBusy] = useState(false);
  const [result, setResult] = useState<MatchPhotoResult | null>(null);

  const runMatch = async (base64: string) => {
    setIsBusy(true);
    try {
      const matchResult = await matchPhoto({ photo: base64 });
      setResult(matchResult);
    } catch (error) {
      const message = error instanceof MatchApiError ? error.message : t('match.photo.error.body');
      Alert.alert(t('match.photo.error.title'), message);
    } finally {
      setIsBusy(false);
    }
  };

  const handleTakePhoto = async () => {
    if (isBusy) return;
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('capture.permission.headline'), t('capture.permission.body'));
      return;
    }
    const pickerResult = await ImagePicker.launchCameraAsync({ quality: 0.6, base64: true });
    if (pickerResult.canceled) return;
    const base64 = pickerResult.assets[0]?.base64;
    if (base64) await runMatch(base64);
  };

  const handleChoosePhoto = async () => {
    if (isBusy) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('capture.libraryPermission.title'), t('capture.libraryPermission.body'));
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.6,
      base64: true,
    });
    if (pickerResult.canceled) return;
    const base64 = pickerResult.assets[0]?.base64;
    if (base64) await runMatch(base64);
  };

  // Reuses the existing Capture -> Studio -> Preview try-on flow rather
  // than stopping at recommendation text — pre-selects the recommended
  // location + its suggested jewelry style, same as the quiz leg's "Try It
  // On" button.
  const handleTryOn = (locationId: PiercingLocationId) => {
    setLocation(locationId);
    const jewelryRecommendation = recommendedJewelryFor(locationId);
    setJewelryType(jewelryRecommendation.jewelryType);
    setFinish(jewelryRecommendation.finish);
    goToScreen('capture');
  };

  if (result) {
    return (
      <View style={styles.container} testID="match-photo-screen">
        <View style={styles.header}>
          <Pressable
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel="Close"
            style={styles.closeButton}
            testID="match-photo-close-button"
          >
            <Text style={styles.closeIcon}>✕</Text>
          </Pressable>
          <Text style={styles.title}>{t('match.photo.resultTitle')}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.resultContent} showsVerticalScrollIndicator={false}>
          {result.recommendations.map((recommendation) => {
            const location = PIERCING_LOCATIONS.find((entry) => entry.id === recommendation.locationId);
            return (
              <GlassCard
                key={recommendation.locationId}
                style={styles.resultCard}
                testID={`match-photo-result-${recommendation.locationId}`}
              >
                <Text style={styles.resultLocationName}>
                  {location ? t(location.labelKey) : recommendation.locationId}
                </Text>
                <Text style={styles.resultReason}>{recommendation.reason}</Text>
                <PrimaryButton
                  label={t('quiz.tryOnButton')}
                  onPress={() => handleTryOn(recommendation.locationId)}
                  testID={`match-photo-try-${recommendation.locationId}`}
                />
              </GlassCard>
            );
          })}
        </ScrollView>

        <BottomNavBar active="match" />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="match-photo-screen">
      <View style={styles.header}>
        <Pressable
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={styles.closeButton}
          testID="match-photo-close-button"
        >
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
        <Text style={styles.title}>{t('match.photo.title')}</Text>
        <Text style={styles.subtitle}>{t('match.photo.body')}</Text>
      </View>

      <View style={styles.actions}>
        {isBusy ? (
          <Text style={styles.analyzingText} testID="match-photo-analyzing">
            {t('match.photo.analyzing')}
          </Text>
        ) : (
          <>
            <PrimaryButton label={t('match.photo.takePhoto')} onPress={handleTakePhoto} testID="match-photo-take-button" />
            <PrimaryButton
              label={t('match.photo.choosePhoto')}
              variant="secondary"
              onPress={handleChoosePhoto}
              testID="match-photo-choose-button"
            />
          </>
        )}
      </View>

      <BottomNavBar active="match" />
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
    paddingHorizontal: Theme.spacing.containerPadding,
    gap: 4,
  },
  closeButton: {
    position: 'absolute',
    top: Theme.spacing.xl,
    right: Theme.spacing.gutter,
    width: 40,
    height: 40,
    borderRadius: Theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: 1,
  },
  closeIcon: {
    color: Theme.colors.text.secondary,
    fontSize: 16,
  },
  title: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.accent.goldSecondary,
  },
  subtitle: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
  },
  actions: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingBottom: 120,
    gap: Theme.spacing.sm,
  },
  analyzingText: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
  },
  resultContent: {
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingTop: Theme.spacing.sm,
    paddingBottom: 120,
    gap: Theme.spacing.sm,
  },
  resultCard: {
    gap: Theme.spacing.xs,
  },
  resultLocationName: {
    ...Theme.typography.headlineMd,
    fontSize: 17,
    color: Theme.colors.text.primary,
  },
  resultReason: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.secondary,
  },
});
