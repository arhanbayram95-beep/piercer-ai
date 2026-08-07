import { fireEvent, render, screen } from '@testing-library/react-native';
import { Alert, Linking, Share } from 'react-native';
import React from 'react';
import SettingsScreen from './SettingsScreen';
import { useAppStore } from '../state/useAppStore';
import { PRIVACY_POLICY_URL, TERMS_URL } from '../utils/legalLinks';

jest.mock('expo-constants', () => ({
  expoConfig: { version: '1.0.0', ios: { buildNumber: '7' }, android: { versionCode: 7 } },
}));

jest.mock('expo-device', () => ({
  osVersion: '18.0',
  osBuildId: '22A123',
}));

jest.mock('expo-store-review', () => ({
  requestReview: jest.fn(),
}));

describe('SettingsScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'settings', languageCode: 'en', isProActive: false });
    // Linking.openURL is already a persistent mock from the RN test preset —
    // restoreAllMocks() below unwraps back to it without clearing its call
    // history, so re-spying alone lets counts leak across tests in this
    // file. mockClear() first keeps each test's assertions accurate.
    jest.spyOn(Linking, 'openURL').mockClear().mockResolvedValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the Subscription, General, and Legal sections', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Subscription')).toBeTruthy();
    expect(screen.getByText('General')).toBeTruthy();
    expect(screen.getByText('Legal')).toBeTruthy();
  });

  it('opens the paywall from Manage Subscription', () => {
    render(<SettingsScreen />);
    fireEvent.press(screen.getByTestId('settings-manage-subscription'));
    expect(useAppStore.getState().screen).toBe('paywall');
  });

  it('reports no purchases found when Restore Purchases is tapped', () => {
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    render(<SettingsScreen />);

    fireEvent.press(screen.getByTestId('settings-restore-purchases'));

    expect(Alert.alert).toHaveBeenCalledWith('Restore Purchases', expect.stringMatching(/no previous purchases/i));
    (Alert.alert as jest.Mock).mockRestore();
  });

  it('opens the piercing reference page from the General section', () => {
    render(<SettingsScreen />);
    fireEvent.press(screen.getByTestId('settings-piercing-reference'));
    expect(useAppStore.getState().screen).toBe('reference');
  });

  it('requests the native store review prompt from Rate Us', () => {
    const StoreReview = require('expo-store-review');
    render(<SettingsScreen />);
    fireEvent.press(screen.getByTestId('settings-rate-us'));
    expect(StoreReview.requestReview).toHaveBeenCalledTimes(1);
  });

  it('opens the external privacy policy page from the Legal section', () => {
    render(<SettingsScreen />);
    fireEvent.press(screen.getByTestId('settings-privacy-policy'));
    expect(Linking.openURL).toHaveBeenCalledWith(PRIVACY_POLICY_URL);
  });

  it('opens the external terms page from the Legal section', () => {
    render(<SettingsScreen />);
    fireEvent.press(screen.getByTestId('settings-terms'));
    expect(Linking.openURL).toHaveBeenCalledWith(TERMS_URL);
  });

  it('opens the language picker and updates the selected language', () => {
    render(<SettingsScreen />);
    fireEvent.press(screen.getByTestId('settings-language'));
    expect(screen.getByTestId('language-picker-modal')).toBeTruthy();

    fireEvent.press(screen.getByTestId('language-option-es'));
    expect(useAppStore.getState().languageCode).toBe('es');
  });

  it('opens the mail client with the support template on Contact Us', () => {
    render(<SettingsScreen />);
    fireEvent.press(screen.getByTestId('settings-contact-us'));

    expect(Linking.openURL).toHaveBeenCalledTimes(1);
    const url = (Linking.openURL as jest.Mock).mock.calls[0][0] as string;
    expect(url).toMatch(/^mailto:fevzi\.bayram@boun\.edu\.tr\?/);

    const body = decodeURIComponent(url.split('body=')[1]);
    expect(body).toContain('PLEASE DO NOT DELETE THE INFORMATION BELOW');
    expect(body).toContain('Premium: No');
    expect(body).toContain('Language: en');
  });

  it('opens the native share sheet from Share App', () => {
    jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction });
    render(<SettingsScreen />);
    fireEvent.press(screen.getByTestId('settings-share-app'));

    expect(Share.share).toHaveBeenCalledTimes(1);
    const [{ message }] = (Share.share as jest.Mock).mock.calls[0];
    expect(message).toMatch(/piercer\.ai/);
  });

  it('re-renders every screen label in the newly selected language', () => {
    useAppStore.setState({ languageCode: 'es' });
    render(<SettingsScreen />);

    expect(screen.getAllByText('Ajustes').length).toBeGreaterThan(0);
    expect(screen.getByText('Suscripción')).toBeTruthy();
    expect(screen.getByText('Idioma')).toBeTruthy();
  });

  it('shows the app version and device info in the About section', () => {
    render(<SettingsScreen />);

    expect(screen.getByText('About')).toBeTruthy();
    expect(screen.getByText('v1.0.0 (7)')).toBeTruthy();
    expect(screen.getByText(/18\.0/)).toBeTruthy();
  });
});
