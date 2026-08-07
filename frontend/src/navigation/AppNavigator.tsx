import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import AnalyzeScreen from '../screens/AnalyzeScreen';
import AnalyzingScreen from '../screens/AnalyzingScreen';
import CaptureScreen from '../screens/CaptureScreen';
import LoadingScreen from '../screens/LoadingScreen';
import NoFaceDetectedScreen from '../screens/NoFaceDetectedScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import PaywallScreen from '../screens/PaywallScreen';
import ResultsScreen from '../screens/ResultsScreen';
import RevealScreen from '../screens/RevealScreen';
import ReviewScreen from '../screens/ReviewScreen';
import SettingsScreen from '../screens/SettingsScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import { AppScreen } from '../state/slices/navigationSlice';
import { useAppStore } from '../state/useAppStore';

const SCREENS: Record<AppScreen, React.ComponentType> = {
  loading: LoadingScreen,
  onboarding: OnboardingScreen,
  paywall: PaywallScreen,
  welcome: WelcomeScreen,
  analyze: AnalyzeScreen,
  capture: CaptureScreen,
  analyzing: AnalyzingScreen,
  reveal: RevealScreen,
  results: ResultsScreen,
  review: ReviewScreen,
  settings: SettingsScreen,
  noFaceDetected: NoFaceDetectedScreen,
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
