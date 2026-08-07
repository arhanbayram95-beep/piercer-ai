import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import React from 'react';
import { MatchApiError } from '../api/match';
import { useAppStore } from '../state/useAppStore';
import PersonalityPhotoScreen from './PersonalityPhotoScreen';

const mockRequestCameraPermissions = jest.fn().mockResolvedValue({ granted: true });
const mockLaunchCamera = jest.fn().mockResolvedValue({ canceled: false, assets: [{ base64: 'Y2FtZXJh' }] });
const mockRequestMediaLibraryPermissions = jest.fn().mockResolvedValue({ granted: true });
const mockLaunchImageLibrary = jest.fn().mockResolvedValue({ canceled: false, assets: [{ base64: 'bGlicmFyeQ==' }] });

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: () => mockRequestCameraPermissions(),
  launchCameraAsync: (...args: unknown[]) => mockLaunchCamera(...args),
  requestMediaLibraryPermissionsAsync: () => mockRequestMediaLibraryPermissions(),
  launchImageLibraryAsync: (...args: unknown[]) => mockLaunchImageLibrary(...args),
}));

const mockMatchPhoto = jest.fn();
jest.mock('../api/match', () => {
  const actual = jest.requireActual('../api/match');
  return {
    ...actual,
    matchPhoto: (...args: unknown[]) => mockMatchPhoto(...args),
  };
});

describe('PersonalityPhotoScreen', () => {
  beforeEach(() => {
    mockRequestCameraPermissions.mockClear().mockResolvedValue({ granted: true });
    mockLaunchCamera.mockClear().mockResolvedValue({ canceled: false, assets: [{ base64: 'Y2FtZXJh' }] });
    mockRequestMediaLibraryPermissions.mockClear().mockResolvedValue({ granted: true });
    mockLaunchImageLibrary.mockClear().mockResolvedValue({ canceled: false, assets: [{ base64: 'bGlicmFyeQ==' }] });
    mockMatchPhoto.mockReset().mockResolvedValue({
      recommendations: [{ locationId: 'helix', reason: 'Your ear shape suits it.' }],
    });
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    useAppStore.setState({
      screen: 'matchPhoto',
      previousScreen: 'match',
      selectedLocation: null,
      selectedJewelryType: 'hoops',
      selectedFinish: 'silver',
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('takes a photo, calls the match API, and shows recommendations', async () => {
    render(<PersonalityPhotoScreen />);
    fireEvent.press(screen.getByTestId('match-photo-take-button'));

    await waitFor(() => expect(mockMatchPhoto).toHaveBeenCalledWith({ photo: 'Y2FtZXJh' }));
    expect(screen.getByTestId('match-photo-result-helix')).toBeTruthy();
  });

  it('lets the user choose from their library instead', async () => {
    render(<PersonalityPhotoScreen />);
    fireEvent.press(screen.getByTestId('match-photo-choose-button'));

    await waitFor(() => expect(mockMatchPhoto).toHaveBeenCalledWith({ photo: 'bGlicmFyeQ==' }));
    expect(screen.getByTestId('match-photo-result-helix')).toBeTruthy();
  });

  it('alerts and does not call the API when camera permission is denied', async () => {
    mockRequestCameraPermissions.mockResolvedValue({ granted: false });
    render(<PersonalityPhotoScreen />);
    fireEvent.press(screen.getByTestId('match-photo-take-button'));

    await waitFor(() => expect(Alert.alert).toHaveBeenCalled());
    expect(mockMatchPhoto).not.toHaveBeenCalled();
  });

  it('shows an alert when the match call fails', async () => {
    mockMatchPhoto.mockRejectedValue(new MatchApiError('Something went wrong finding your matches.'));
    render(<PersonalityPhotoScreen />);
    fireEvent.press(screen.getByTestId('match-photo-take-button'));

    await waitFor(() => expect(Alert.alert).toHaveBeenCalled());
    expect(screen.queryByTestId('match-photo-result-helix')).toBeNull();
  });

  it('pre-selects the recommended location and jewelry, then routes to Capture on Try It On', async () => {
    render(<PersonalityPhotoScreen />);
    fireEvent.press(screen.getByTestId('match-photo-take-button'));
    await waitFor(() => expect(screen.getByTestId('match-photo-result-helix')).toBeTruthy());

    fireEvent.press(screen.getByTestId('match-photo-try-helix'));

    expect(useAppStore.getState().selectedLocation).toBe('helix');
    expect(useAppStore.getState().screen).toBe('capture');
  });

  it('lets the user close back out', () => {
    render(<PersonalityPhotoScreen />);
    fireEvent.press(screen.getByTestId('match-photo-close-button'));
    expect(useAppStore.getState().screen).toBe('match');
  });
});
