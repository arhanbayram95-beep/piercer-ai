import { render, screen } from '@testing-library/react-native';
import React from 'react';
import AppNavigator from './AppNavigator';
import { useAppStore } from '../state/useAppStore';

jest.mock('../utils/sound', () => ({
  playCaptureChime: jest.fn().mockResolvedValue(undefined),
  playPromptChime: jest.fn().mockResolvedValue(undefined),
  startAmbientShimmerLoop: jest.fn().mockResolvedValue({ stop: jest.fn().mockResolvedValue(undefined) }),
}));

// AppNavigator statically imports every screen including CaptureScreen, which
// pulls in react-native-vision-camera's native turbo module at import time —
// this file never actually renders the capture screen, so a minimal mock is
// enough to stop that native init from crashing Jest.
jest.mock('react-native-vision-camera', () => {
  const { View } = require('react-native');
  return {
    useCameraPermission: () => ({ hasPermission: true, requestPermission: jest.fn() }),
    usePhotoOutput: () => ({ capturePhoto: jest.fn() }),
    Camera: (props: any) => <View testID="camera-preview" {...props} />,
  };
});

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

describe('AppNavigator', () => {
  it('renders the home hub screen when routed there', () => {
    useAppStore.setState({ screen: 'home' });
    render(<AppNavigator />);
    expect(screen.getByTestId('home-hub-screen')).toBeTruthy();
  });

  it('renders the piercing reference screen when routed there', () => {
    useAppStore.setState({ screen: 'reference' });
    render(<AppNavigator />);
    expect(screen.getByTestId('reference-screen')).toBeTruthy();
  });

  it('renders the match hub screen when routed there', () => {
    useAppStore.setState({ screen: 'match' });
    render(<AppNavigator />);
    expect(screen.getByTestId('match-hub-screen')).toBeTruthy();
  });

  it('renders the personality quiz screen when routed there', () => {
    useAppStore.setState({ screen: 'matchQuiz' });
    render(<AppNavigator />);
    expect(screen.getByTestId('quiz-screen')).toBeTruthy();
  });

  it('renders the personality photo match screen when routed there', () => {
    useAppStore.setState({ screen: 'matchPhoto' });
    render(<AppNavigator />);
    expect(screen.getByTestId('match-photo-screen')).toBeTruthy();
  });

  it('renders the settings screen when routed there', () => {
    useAppStore.setState({ screen: 'settings' });
    render(<AppNavigator />);
    expect(screen.getByTestId('settings-screen')).toBeTruthy();
  });

  it('renders the piercing location screen when routed there', () => {
    useAppStore.setState({ screen: 'location', selectedLocation: null });
    render(<AppNavigator />);
    expect(screen.getByTestId('location-screen')).toBeTruthy();
  });

  it('renders the studio screen when routed there', () => {
    useAppStore.setState({ screen: 'studio', images: [] });
    render(<AppNavigator />);
    expect(screen.getByTestId('studio-screen')).toBeTruthy();
  });

  it('renders the preview screen when routed there', () => {
    useAppStore.setState({ screen: 'preview', images: [], renderResult: null });
    render(<AppNavigator />);
    expect(screen.getByTestId('preview-screen')).toBeTruthy();
  });

  it('renders the welcome screen when routed there', () => {
    useAppStore.setState({ screen: 'welcome' });
    render(<AppNavigator />);
    expect(screen.getByTestId('welcome-screen')).toBeTruthy();
  });

  it('renders the onboarding screen when routed there', () => {
    useAppStore.setState({ screen: 'onboarding' });
    render(<AppNavigator />);
    expect(screen.getByTestId('onboarding-screen')).toBeTruthy();
  });

  it('renders the paywall screen when routed there', () => {
    useAppStore.setState({ screen: 'paywall' });
    render(<AppNavigator />);
    expect(screen.getByTestId('paywall-screen')).toBeTruthy();
  });

  it('renders the loading screen when routed there', () => {
    useAppStore.setState({ screen: 'loading' });
    render(<AppNavigator />);
    expect(screen.getByTestId('loading-screen')).toBeTruthy();
  });
});
