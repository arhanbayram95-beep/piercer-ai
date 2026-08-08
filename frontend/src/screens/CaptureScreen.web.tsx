import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import BottomNavBar from '../components/common/BottomNavBar';
import PrimaryButton from '../components/common/PrimaryButton';
import { PIERCING_LOCATIONS } from '../content/piercingLocations';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

// Metro/Expo resolve this file instead of CaptureScreen.tsx on web builds
// (the .web.tsx platform extension), because react-native-vision-camera is
// a native-only module — importing it (even unused) crashes the whole web
// bundle at module-evaluation time, before any screen can render, not just
// this one ("Your web project is importing a module from 'react-native'
// instead of 'react-native-web'"). Native builds are untouched; this file
// is dead code there. Gallery upload already works on web via
// expo-image-picker, so that's the only capture path offered here. Carries
// BottomNavBar (active="tryOn") same as the native CaptureScreen, per
// explicit user feedback that the nav bar should be universal.
export default function CaptureScreen() {
  const [isPickingFromLibrary, setIsPickingFromLibrary] = useState(false);
  const selectedLocation = useAppStore((s) => s.selectedLocation);
  const addImage = useAppStore((s) => s.addImage);
  const clearImages = useAppStore((s) => s.clearImages);
  const goToScreen = useAppStore((s) => s.goToScreen);
  const goBack = useAppStore((s) => s.goBack);
  const t = useTranslation();

  const locationEntry = PIERCING_LOCATIONS.find((location) => location.id === selectedLocation);
  const guideCopy = locationEntry
    ? t('capture.guide.withLocation', { location: t(locationEntry.labelKey) })
    : null;

  const handleCancel = () => {
    clearImages();
    goBack();
  };

  const handlePickFromLibrary = async () => {
    if (isPickingFromLibrary) return;
    setIsPickingFromLibrary(true);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(t('capture.libraryPermission.title'), t('capture.libraryPermission.body'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.6,
        base64: true,
        allowsEditing: false,
      });

      if (result.canceled) return;

      const base64 = result.assets[0]?.base64;
      if (!base64) {
        Alert.alert(t('capture.error.title'), t('capture.error.body'));
        return;
      }

      addImage(base64);
      goToScreen('studio');
    } catch (error) {
      console.error('Photo library selection failed:', error);
      Alert.alert(t('capture.error.title'), t('capture.error.body'));
    } finally {
      setIsPickingFromLibrary(false);
    }
  };

  return (
    <View style={styles.container} testID="capture-screen">
      <Pressable
        onPress={handleCancel}
        accessibilityRole="button"
        accessibilityLabel={t('capture.cancelButton')}
        style={styles.closeButton}
        testID="capture-cancel-button"
      >
        <Text style={styles.closeIcon}>✕</Text>
      </Pressable>

      <View style={styles.body}>
        <Text style={styles.headline}>Camera preview isn&apos;t available in a browser</Text>
        {guideCopy && <Text style={styles.guideCopy}>{guideCopy}</Text>}
        <Text style={styles.subBody}>Choose a photo from your files to continue, or open this app on a phone for the real camera flow.</Text>
        <PrimaryButton
          label={t('capture.chooseFromLibrary')}
          onPress={handlePickFromLibrary}
          disabled={isPickingFromLibrary}
          testID="capture-library-button"
        />
      </View>

      <BottomNavBar active="tryOn" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.start,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 120,
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
  },
  closeIcon: {
    color: Theme.colors.text.secondary,
    fontSize: 16,
  },
  body: {
    alignItems: 'center',
    gap: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.containerPadding,
  },
  headline: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.accent.goldSecondary,
    textAlign: 'center',
  },
  guideCopy: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.text.primary,
    textAlign: 'center',
  },
  subBody: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
  },
});
