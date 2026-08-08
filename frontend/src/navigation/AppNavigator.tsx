import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import CaptureScreen from '../screens/CaptureScreen';
import HomeHubScreen from '../screens/HomeHubScreen';
import LoadingScreen from '../screens/LoadingScreen';
import MatchHubScreen from '../screens/MatchHubScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import PaywallScreen from '../screens/PaywallScreen';
import PersonalityPhotoScreen from '../screens/PersonalityPhotoScreen';
import PersonalityQuizScreen from '../screens/PersonalityQuizScreen';
import PiercingLocationScreen from '../screens/PiercingLocationScreen';
import PiercingReferenceScreen from '../screens/PiercingReferenceScreen';
import PreviewScreen from '../screens/PreviewScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StudioScreen from '../screens/StudioScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import { AppScreen } from '../state/slices/navigationSlice';
import { useAppStore } from '../state/useAppStore';

const SCREENS: Record<AppScreen, React.ComponentType> = {
  loading: LoadingScreen,
  onboarding: OnboardingScreen,
  paywall: PaywallScreen,
  welcome: WelcomeScreen,
  home: HomeHubScreen,
  location: PiercingLocationScreen,
  capture: CaptureScreen,
  studio: StudioScreen,
  preview: PreviewScreen,
  settings: SettingsScreen,
  reference: PiercingReferenceScreen,
  match: MatchHubScreen,
  matchQuiz: PersonalityQuizScreen,
  matchPhoto: PersonalityPhotoScreen,
};

export default function AppNavigator() {
  const screen = useAppStore((s) => s.screen);
  const ActiveScreen = SCREENS[screen];
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [screen, progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });
  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] });

  return (
    <Animated.View style={{ flex: 1, opacity: progress, transform: [{ translateY }, { scale }] }}>
      <ActiveScreen />
    </Animated.View>
  );
}
