import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Alert, Linking } from 'react-native';
import PaywallScreen from './PaywallScreen';
import { useAppStore } from '../state/useAppStore';
import { PRIVACY_POLICY_URL, TERMS_URL } from '../utils/legalLinks';

describe('PaywallScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'paywall', isProActive: false });
  });

  // The entertainment disclaimer lives on the onboarding consent step and on
  // every result surface (RevealScreen). The paywall is a pricing screen, not
  // a reading, so it carries the subscription terms instead.
  it('does not render the entertainment disclaimer', () => {
    render(<PaywallScreen />);
    expect(screen.queryByText(/entertainment purposes only/i)).toBeNull();
  });

  it('offers a restore purchases path', () => {
    render(<PaywallScreen />);
    expect(screen.getByText('Restore Purchases')).toBeTruthy();
  });

  it('reports no purchases found when Restore Purchases is tapped', () => {
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    render(<PaywallScreen />);

    fireEvent.press(screen.getByTestId('paywall-restore-purchases'));

    expect(Alert.alert).toHaveBeenCalledWith('Restore Purchases', expect.stringMatching(/no previous purchases/i));
    (Alert.alert as jest.Mock).mockRestore();
  });

  it('opens the terms URL from the footer link', () => {
    jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined as never);
    render(<PaywallScreen />);
    fireEvent.press(screen.getByTestId('paywall-terms-of-service'));
    expect(Linking.openURL).toHaveBeenCalledWith(TERMS_URL);
    (Linking.openURL as jest.Mock).mockRestore();
  });

  it('is not skippable on first launch — no close button until entitlement is active', () => {
    render(<PaywallScreen />);
    expect(screen.queryByTestId('paywall-close-button')).toBeNull();
  });

  it('shows a close button once the user already has an active entitlement', () => {
    useAppStore.setState({ isProActive: true });
    render(<PaywallScreen />);
    expect(screen.getByTestId('paywall-close-button')).toBeTruthy();
  });

  it('leads with Subscribe Now as the primary path — no trial framing on the primary CTA', () => {
    render(<PaywallScreen />);

    fireEvent.press(screen.getByText('Subscribe Now'));
    expect(useAppStore.getState().isProActive).toBe(true);
    expect(useAppStore.getState().screen).toBe('home');
  });

  it('does not offer a free trial option', () => {
    render(<PaywallScreen />);
    expect(screen.queryByTestId('paywall-trial-link')).toBeNull();
  });

  it('opens the privacy policy URL from the footer link', () => {
    jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined as never);
    render(<PaywallScreen />);
    fireEvent.press(screen.getByText('Privacy Policy'));
    expect(Linking.openURL).toHaveBeenCalledWith(PRIVACY_POLICY_URL);
    (Linking.openURL as jest.Mock).mockRestore();
  });

  it('closes back to Settings, not Main Menu, when reopened from Settings with an active entitlement', () => {
    useAppStore.setState({ isProActive: true });
    useAppStore.getState().goToScreen('settings');
    useAppStore.getState().goToScreen('paywall');

    render(<PaywallScreen />);
    fireEvent.press(screen.getByTestId('paywall-close-button'));

    expect(useAppStore.getState().screen).toBe('settings');
  });
});
