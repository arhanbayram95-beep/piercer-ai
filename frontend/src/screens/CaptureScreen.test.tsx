import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { useAppStore } from '../state/useAppStore';
import CaptureScreen from './CaptureScreen';

// Bytes chosen arbitrarily; base64-js encodes them deterministically to 'AQID'.
const mockFileData = new Uint8Array([1, 2, 3]).buffer;
const mockDispose = jest.fn();
const mockCapturePhoto = jest.fn().mockResolvedValue({
  getFileDataAsync: jest.fn().mockResolvedValue(mockFileData),
  dispose: mockDispose,
});
const mockRequestPermission = jest.fn();
let mockHasPermission = true;

jest.mock('react-native-vision-camera', () => {
  const { View } = require('react-native');
  return {
    useCameraPermission: () => ({
      hasPermission: mockHasPermission,
      requestPermission: mockRequestPermission,
    }),
    usePhotoOutput: () => ({ capturePhoto: mockCapturePhoto }),
    Camera: (props: any) => <View testID="camera-preview" {...props} />,
  };
});

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light' },
}));

const mockPlayCaptureChime = jest.fn().mockResolvedValue(undefined);

jest.mock('../utils/sound', () => ({
  playCaptureChime: () => mockPlayCaptureChime(),
  playPromptChime: () => jest.fn(),
}));

describe('CaptureScreen', () => {
  beforeEach(() => {
    mockCapturePhoto.mockClear();
    mockDispose.mockClear();
    mockRequestPermission.mockClear();
    mockPlayCaptureChime.mockClear();
    mockHasPermission = true;
    useAppStore.setState({ screen: 'capture', images: [] });
  });

  it('prompts for camera access when permission is not granted', () => {
    mockHasPermission = false;
    render(<CaptureScreen />);
    fireEvent.press(screen.getByText('Allow Camera Access'));
    expect(mockRequestPermission).toHaveBeenCalledTimes(1);
  });

  it('offers a way out when camera permission is denied, instead of a dead end', () => {
    mockHasPermission = false;
    useAppStore.getState().goToScreen('welcome');
    useAppStore.getState().goToScreen('capture');

    render(<CaptureScreen />);
    fireEvent.press(screen.getByTestId('capture-close-button'));

    expect(useAppStore.getState().screen).toBe('welcome');
  });

  it('lets the user cancel mid-capture, discarding whatever was already taken', async () => {
    useAppStore.getState().goToScreen('welcome');
    useAppStore.getState().goToScreen('capture');

    render(<CaptureScreen />);
    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images).toEqual(['AQID']));

    fireEvent.press(screen.getByTestId('capture-cancel-button'));

    expect(useAppStore.getState().screen).toBe('welcome');
    expect(useAppStore.getState().images).toEqual([]);
  });

  it('captures a photo, stores it, and moves on', async () => {
    render(<CaptureScreen />);

    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images).toEqual(['AQID']));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('settings'));
    expect(mockCapturePhoto).toHaveBeenCalledTimes(1);
    expect(mockDispose).toHaveBeenCalledTimes(1);
    expect(mockPlayCaptureChime).toHaveBeenCalledTimes(1);
  });
});
