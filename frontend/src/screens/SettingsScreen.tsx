import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as StoreReview from 'expo-store-review';
import React, { useState } from 'react';
import { Alert, Image, Linking, Platform, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import BottomNavBar from '../components/common/BottomNavBar';
import FadeInView from '../components/common/FadeInView';
import GlassCard from '../components/common/GlassCard';
import LanguagePickerModal from '../components/common/LanguagePickerModal';
import { useTranslation } from '../i18n/useTranslation';
import { SUPPORTED_LANGUAGES } from '../state/slices/localeSlice';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';
import { buildContactMailUrl } from '../utils/contactMail';
import { PRIVACY_POLICY_URL, TERMS_URL } from '../utils/legalLinks';

// No published store URL yet — add it here once piercer.ai is live on the
// App Store / Play Store so the share message includes a real link.
const SHARE_MESSAGE = 'Check out piercer.ai — preview piercings on your own photos! ✦';

interface SettingsRowConfig {
  label: string;
  value?: string;
  onPress?: () => void;
  testID?: string;
}

function SettingsRow({ label, value, onPress, testID, isLast }: SettingsRowConfig & { isLast: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'text'}
      testID={testID}
      style={styles.row}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {value && <Text style={styles.rowValue}>{value}</Text>}
        {onPress && <Text style={styles.chevron}>›</Text>}
      </View>
      {!isLast && <View style={styles.divider} />}
    </Pressable>
  );
}

function SettingsSection({ title, rows, delay }: { title: string; rows: SettingsRowConfig[]; delay: number }) {
  return (
    <FadeInView delay={delay} style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <GlassCard style={styles.sectionCard}>
        {rows.map((row, index) => (
          <SettingsRow key={row.label} {...row} isLast={index === rows.length - 1} />
        ))}
      </GlassCard>
    </FadeInView>
  );
}

function resolvePlatformLabel(): string {
  if (Platform.OS === 'ios') return 'iOS';
  if (Platform.OS === 'android') return 'Android';
  return 'Web';
}

function resolveOsVersionLabel(): string {
  if (!Device.osVersion) return 'Unknown';
  if (Platform.OS === 'ios') {
    return Device.osBuildId ? `Version ${Device.osVersion} (Build ${Device.osBuildId})` : `Version ${Device.osVersion}`;
  }
  if (Platform.OS === 'android') return `Android ${Device.osVersion}`;
  return Device.osVersion;
}

function resolveSignOff(): string {
  if (Platform.OS === 'ios') return 'Sent from my iPhone';
  if (Platform.OS === 'android') return 'Sent from my Android device';
  return 'Sent from piercer.ai';
}

function resolveBuildNumber(): string | null {
  const extra = Constants.expoConfig;
  if (Platform.OS === 'ios') return extra?.ios?.buildNumber ?? null;
  if (Platform.OS === 'android' && extra?.android?.versionCode != null) {
    return String(extra.android.versionCode);
  }
  return null;
}

export default function SettingsScreen() {
  const [languageVisible, setLanguageVisible] = useState(false);
  const goToScreen = useAppStore((s) => s.goToScreen);
  const anonymousId = useAppStore((s) => s.anonymousId);
  const isProActive = useAppStore((s) => s.isProActive);
  const languageCode = useAppStore((s) => s.languageCode);
  const t = useTranslation();

  const currentLanguageName =
    SUPPORTED_LANGUAGES.find((language) => language.code === languageCode)?.englishName ?? 'English';

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';
  const buildNumber = resolveBuildNumber();

  const handleContactUs = () => {
    const url = buildContactMailUrl({
      anonymousId,
      isProActive,
      languageCode,
      appVersion,
      buildNumber,
      platformLabel: resolvePlatformLabel(),
      osVersionLabel: resolveOsVersionLabel(),
      signOff: resolveSignOff(),
    });
    Linking.openURL(url);
  };

  const handleShareApp = () => {
    Share.share({ message: SHARE_MESSAGE });
  };

  const handleRateUs = () => {
    StoreReview.requestReview();
  };

  // No RevenueCat integration yet (Phase 5.1) — this can't look up real
  // purchase history, so it honestly reports finding nothing rather than
  // silently doing nothing when tapped.
  const handleRestorePurchases = () => {
    Alert.alert(t('settings.row.restorePurchases'), t('restorePurchases.alertBody'));
  };

  const deviceLabel = Device.osVersion ? `${resolvePlatformLabel()} · ${resolveOsVersionLabel()}` : resolvePlatformLabel();

  return (
    <View style={styles.container} testID="settings-screen">
      <View style={styles.watermarkWrap} pointerEvents="none">
        <Image source={require('../../assets/logo-emblem-transparent.png')} style={styles.watermark} resizeMode="contain" />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>{t('settings.title')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SettingsSection
          title={t('settings.section.subscription')}
          delay={0}
          rows={[
            {
              label: t('settings.row.manageSubscription'),
              onPress: () => goToScreen('paywall'),
              testID: 'settings-manage-subscription',
            },
            {
              label: t('settings.row.restorePurchases'),
              onPress: handleRestorePurchases,
              testID: 'settings-restore-purchases',
            },
          ]}
        />

        <SettingsSection
          title={t('settings.section.general')}
          delay={80}
          rows={[
            {
              label: t('settings.row.language'),
              value: currentLanguageName,
              onPress: () => setLanguageVisible(true),
              testID: 'settings-language',
            },
            { label: t('settings.row.rateUs'), onPress: handleRateUs, testID: 'settings-rate-us' },
            { label: t('settings.row.shareApp'), onPress: handleShareApp, testID: 'settings-share-app' },
          ]}
        />

        <SettingsSection
          title={t('settings.section.legal')}
          delay={160}
          rows={[
            { label: t('settings.row.privacyPolicy'), onPress: () => Linking.openURL(PRIVACY_POLICY_URL), testID: 'settings-privacy-policy' },
            { label: t('settings.row.termsConditions'), onPress: () => Linking.openURL(TERMS_URL), testID: 'settings-terms' },
            { label: t('settings.row.contactUs'), onPress: handleContactUs, testID: 'settings-contact-us' },
          ]}
        />

        <SettingsSection
          title={t('settings.section.about')}
          delay={240}
          rows={[
            {
              label: t('settings.row.appVersion'),
              value: buildNumber ? `v${appVersion} (${buildNumber})` : `v${appVersion}`,
              testID: 'settings-app-version',
            },
            { label: t('settings.row.device'), value: deviceLabel, testID: 'settings-device' },
          ]}
        />
      </ScrollView>

      <BottomNavBar active="settings" />
      <LanguagePickerModal visible={languageVisible} onClose={() => setLanguageVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.middle,
    overflow: 'hidden',
  },
  watermarkWrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watermark: {
    width: '90%',
    aspectRatio: 1,
    opacity: 0.05,
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
  scrollContent: {
    paddingHorizontal: Theme.spacing.gutter,
    paddingBottom: 120,
    gap: Theme.spacing.md,
  },
  section: {
    gap: Theme.spacing.xs,
  },
  sectionTitle: {
    ...Theme.typography.labelSm,
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
    paddingHorizontal: 4,
  },
  sectionCard: {
    padding: 0,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 14,
  },
  rowLabel: {
    ...Theme.typography.bodyMd,
    fontSize: 15,
    color: Theme.colors.text.primary,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowValue: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
  },
  chevron: {
    color: Theme.colors.text.muted,
    fontSize: 18,
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: Theme.spacing.sm,
    right: Theme.spacing.sm,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Theme.colors.surface.glassBorder,
  },
});
