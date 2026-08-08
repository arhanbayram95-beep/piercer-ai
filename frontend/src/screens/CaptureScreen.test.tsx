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

const mockRequestMediaLibraryPermissions = jest.fn().mockResolvedValue({ granted: true });
const mockLaunchImageLibrary = jest.fn().mockResolvedValue({
  canceled: false,
  assets: [{ base64: 'R0lGOD' }],
});

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: () => mockRequestMediaLibraryPermissions(),
  launchImageLibraryAsync: (...args: unknown[]) => mockLaunchImageLibrary(...args),
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
    mockRequestMediaLibraryPermissions.mockClear();
    mockRequestMediaLibraryPermissions.mockResolvedValue({ granted: true });
    mockLaunchImageLibrary.mockClear();
    mockLaunchImageLibrary.mockResolvedValue({ canceled: false, assets: [{ base64: 'R0lGOD' }] });
    mockHasPermission = true;
    useAppStore.setState({ screen: 'capture', images: [], selectedLocation: null });
  });

  it('shows no location-specific guide copy when no location was selected', () => {
    render(<CaptureScreen />);
    expect(screen.queryByTestId('capture-guide-copy')).toBeNull();
  });

  it('shows a guide prompt naming the piercing location picked on the previous screen', () => {
    useAppStore.setState({ selectedLocation: 'helix' });
    render(<CaptureScreen />);
    expect(screen.getByTestId('capture-guide-copy').props.children).toContain('Helix');
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

    // Not 'welcome' here: the shutter press just above already navigated to
    // 'studio' (a returnable screen) which made 'capture' the recorded
    // previousScreen — a non-returnable screen — so goBack() falls through
    // to DEFAULT_SCREEN ('home'), same fallback path as the denied-
    // permission test above, just exercised via a different route to it.
    expect(useAppStore.getState().screen).toBe('home');
    expect(useAppStore.getState().images).toEqual([]);
  });

  it('captures a photo, stores it, and moves on', async () => {
    render(<CaptureScreen />);

    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images).toEqual(['AQID']));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('studio'));
    expect(mockCapturePhoto).toHaveBeenCalledTimes(1);
    expect(mockDispose).toHaveBeenCalledTimes(1);
    expect(mockPlayCaptureChime).toHaveBeenCalledTimes(1);
  });

  it('lets the user pick an existing photo from their library instead of the live camera', async () => {
    render(<CaptureScreen />);

    fireEvent.press(screen.getByTestId('capture-library-button'));

    await waitFor(() => expect(useAppStore.getState().images).toEqual(['R0lGOD']));
    await waitFor(() => expect(useAppStore.getState().screen).toBe('studio'));
    expect(mockCapturePhoto).not.toHaveBeenCalled();
  });

  it('does nothing if the user cancels the library picker', async () => {
    mockLaunchImageLibrary.mockResolvedValueOnce({ canceled: true, assets: null });
    render(<CaptureScreen />);

    fireEvent.press(screen.getByTestId('capture-library-button'));

    await waitFor(() => expect(mockLaunchImageLibrary).toHaveBeenCalledTimes(1));
    expect(useAppStore.getState().images).toEqual([]);
    expect(useAppStore.getState().screen).toBe('capture');
  });

  it('offers the library picker as a fallback when camera permission is denied', async () => {
    mockHasPermission = false;
    render(<CaptureScreen />);

    fireEvent.press(screen.getByTestId('capture-library-button'));

    await waitFor(() => expect(useAppStore.getState().images).toEqual(['R0lGOD']));
    expect(useAppStore.getState().screen).toBe('studio');
  });

  it('carries the bottom nav bar, and jumping to another module mid-capture does not discard the in-progress photo', async () => {
    render(<CaptureScreen />);
    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images).toEqual(['AQID']));

    fireEvent.press(screen.getByLabelText('Reference'));

    expect(useAppStore.getState().screen).toBe('reference');
    // Unlike the explicit Cancel/X button, the nav bar must not call
    // clearImages() — an in-progress capture should survive a detour.
    expect(useAppStore.getState().images).toEqual(['AQID']);
  });

  it('shows the bottom nav bar even when camera permission is denied', () => {
    mockHasPermission = false;
    render(<CaptureScreen />);
    expect(screen.getByLabelText('Home')).toBeTruthy();
  });
});
