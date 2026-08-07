import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
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

jest.mock('react-native-vision-camera', () => ({
  useCameraPermission: () => ({
    hasPermission: mockHasPermission,
    requestPermission: mockRequestPermission,
  }),
  usePhotoOutput: () => ({ capturePhoto: mockCapturePhoto }),
}));

// Captures the live `onFacesDetected` callback so tests can simulate the
// on-device detector firing, deterministically, right before a shutter
// press — rather than relying on render/effect timing.
let latestOnFacesDetected: ((faces: unknown[]) => void) | undefined;

jest.mock('react-native-vision-camera-face-detector', () => {
  const { View } = require('react-native');
  return {
    Camera: (props: any) => {
      latestOnFacesDetected = props.onFacesDetected;
      return <View testID="camera-preview" {...props} />;
    },
  };
});

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light' },
}));

const mockPlayCaptureChime = jest.fn().mockResolvedValue(undefined);
const mockPlayPromptChime = jest.fn().mockResolvedValue(undefined);

jest.mock('../utils/sound', () => ({
  playCaptureChime: () => mockPlayCaptureChime(),
  playPromptChime: () => mockPlayPromptChime(),
}));

function detectFace() {
  act(() => {
    latestOnFacesDetected?.([{}]);
  });
}

function detectNoFace() {
  act(() => {
    latestOnFacesDetected?.([]);
  });
}

describe('CaptureScreen', () => {
  beforeEach(() => {
    mockCapturePhoto.mockClear();
    mockDispose.mockClear();
    mockRequestPermission.mockClear();
    mockPlayCaptureChime.mockClear();
    mockPlayPromptChime.mockClear();
    mockHasPermission = true;
    latestOnFacesDetected = undefined;
    useAppStore.setState({ screen: 'capture', images: [], selectedModule: 'three-expression' });
  });

  it('prompts for camera access when permission is not granted', () => {
    mockHasPermission = false;
    render(<CaptureScreen />);
    fireEvent.press(screen.getByText('Allow Camera Access'));
    expect(mockRequestPermission).toHaveBeenCalledTimes(1);
  });

  it('offers a way out when camera permission is denied, instead of a dead end', () => {
    mockHasPermission = false;
    useAppStore.getState().goToScreen('analyze');
    useAppStore.getState().goToScreen('capture');

    render(<CaptureScreen />);
    fireEvent.press(screen.getByTestId('capture-close-button'));

    expect(useAppStore.getState().screen).toBe('analyze');
  });

  it('lets the user cancel mid-capture, discarding whatever was already taken', async () => {
    useAppStore.getState().goToScreen('analyze');
    useAppStore.getState().goToScreen('capture');

    render(<CaptureScreen />);
    detectFace();
    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images).toEqual(['AQID']));

    fireEvent.press(screen.getByTestId('capture-cancel-button'));

    expect(useAppStore.getState().screen).toBe('analyze');
    expect(useAppStore.getState().images).toEqual([]);
  });

  it('captures all three expressions in order and stores them, then moves to analysis', async () => {
    render(<CaptureScreen />);

    expect(screen.getByText('Rest')).toBeTruthy();
    detectFace();
    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images).toEqual(['AQID']));

    expect(screen.getByText('Grin')).toBeTruthy();
    detectFace();
    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images).toEqual(['AQID', 'AQID']));

    expect(screen.getByText('Stern')).toBeTruthy();
    detectFace();
    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images).toHaveLength(3));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('analyzing'));
    expect(mockCapturePhoto).toHaveBeenCalledTimes(3);
    expect(mockDispose).toHaveBeenCalledTimes(3);
    expect(mockPlayCaptureChime).toHaveBeenCalledTimes(3);
    // Prompt chime greets Grin and Stern, not the opening Rest step.
    expect(mockPlayPromptChime).toHaveBeenCalledTimes(2);
  });

  it('captures 2 photos for Relationship Harmony — 1 per person, front then back camera', async () => {
    useAppStore.setState({ selectedModule: 'relationship-harmony' });
    render(<CaptureScreen />);

    expect(screen.getByText('Person One')).toBeTruthy();
    expect(screen.getByTestId('camera-preview').props.device).toBe('front');
    detectFace();
    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images).toEqual(['AQID']));

    expect(screen.getByText('Person Two')).toBeTruthy();
    expect(screen.getByTestId('camera-preview').props.device).toBe('back');
    detectFace();
    fireEvent.press(screen.getByTestId('shutter-button'));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('analyzing'));
    expect(useAppStore.getState().images).toHaveLength(2);
    expect(mockCapturePhoto).toHaveBeenCalledTimes(2);
  });

  it('captures a single photo for Career Match', async () => {
    useAppStore.setState({ selectedModule: 'career-match' });
    render(<CaptureScreen />);

    detectFace();
    expect(screen.getByText('Your Photo')).toBeTruthy();
    fireEvent.press(screen.getByTestId('shutter-button'));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('analyzing'));
    expect(useAppStore.getState().images).toEqual(['AQID']);
    expect(mockCapturePhoto).toHaveBeenCalledTimes(1);
  });

  it('routes to the no-face-detected screen instead of capturing when no face is in frame', async () => {
    render(<CaptureScreen />);

    detectNoFace();
    fireEvent.press(screen.getByTestId('shutter-button'));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('noFaceDetected'));
    expect(mockCapturePhoto).not.toHaveBeenCalled();
    expect(mockPlayCaptureChime).not.toHaveBeenCalled();
    expect(useAppStore.getState().images).toEqual([]);
  });

  it('discards already-captured photos in the sequence if a later step has no face', async () => {
    render(<CaptureScreen />);

    detectFace();
    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images).toEqual(['AQID']));

    detectNoFace();
    fireEvent.press(screen.getByTestId('shutter-button'));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('noFaceDetected'));
    expect(useAppStore.getState().images).toEqual([]);
  });
});
