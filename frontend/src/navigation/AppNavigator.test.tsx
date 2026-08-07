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
jest.mock('react-native-vision-camera', () => ({
  useCameraPermission: () => ({ hasPermission: true, requestPermission: jest.fn() }),
  usePhotoOutput: () => ({ capturePhoto: jest.fn() }),
}));

jest.mock('react-native-vision-camera-face-detector', () => {
  const { View } = require('react-native');
  return { Camera: (props: any) => <View testID="camera-preview" {...props} /> };
});

describe('AppNavigator', () => {
  it('renders the settings screen when routed there', () => {
    useAppStore.setState({ screen: 'settings' });
    render(<AppNavigator />);
    expect(screen.getByTestId('settings-screen')).toBeTruthy();
  });

  it('renders the analyze hub when routed there', () => {
    useAppStore.setState({ screen: 'analyze' });
    render(<AppNavigator />);
    expect(screen.getByTestId('analyze-screen')).toBeTruthy();
  });

  it('renders the results screen when routed there', () => {
    useAppStore.setState({ screen: 'results' });
    render(<AppNavigator />);
    expect(screen.getByTestId('results-screen')).toBeTruthy();
  });

  it('renders the analyzing screen when routed there', () => {
    useAppStore.setState({ screen: 'analyzing', images: [] });
    render(<AppNavigator />);
    expect(screen.getByTestId('analyzing-screen')).toBeTruthy();
  });

  it('renders the reveal screen when routed there', () => {
    useAppStore.setState({ screen: 'reveal', reading: null });
    render(<AppNavigator />);
    expect(screen.getByTestId('reveal-screen')).toBeTruthy();
  });

  it('renders the welcome screen when routed there', () => {
    useAppStore.setState({ screen: 'welcome' });
    render(<AppNavigator />);
    expect(screen.getByTestId('welcome-screen')).toBeTruthy();
  });

  it('renders the no-face-detected screen when routed there', () => {
    useAppStore.setState({ screen: 'noFaceDetected' });
    render(<AppNavigator />);
    expect(screen.getByTestId('no-face-detected-screen')).toBeTruthy();
  });
});
