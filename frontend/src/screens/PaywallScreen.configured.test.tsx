import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import PaywallScreen from './PaywallScreen';
import { useAppStore } from '../state/useAppStore';

// PaywallScreen.test.tsx covers the unconfigured path (no
// EXPO_PUBLIC_REVENUECAT_API_KEY — every environment today, so the screen
// falls back to the local-only stub). This file covers the other half: what
// the screen does once a real RevenueCat project *is* configured. That
// branch is chosen from `isPurchasesConfigured`, a module-level const read
// from process.env at import time, so it can only be flipped by mocking the
// whole utils/purchases module — hence a separate file rather than another
// describe block.
const mockGetSubscriptionPackages = jest.fn();
const mockPurchasePackage = jest.fn();
const mockRestorePurchases = jest.fn();
const mockEnsureConfigured = jest.fn();
const mockHasActiveEntitlement = jest.fn();

// PurchaseCancelledError is declared inside the factory, not captured from
// an outer binding: jest.mock is hoisted above every declaration in this
// file, so an outer `class` would still be in its temporal dead zone when
// PaywallScreen imports this module — the screen's `instanceof` check would
// then see `undefined` and throw instead of classifying the error.
jest.mock('../utils/purchases', () => ({
  isPurchasesConfigured: true,
  ensurePurchasesConfigured: () => mockEnsureConfigured(),
  getSubscriptionPackages: () => mockGetSubscriptionPackages(),
  purchasePackage: (...args: unknown[]) => mockPurchasePackage(...args),
  restorePurchases: () => mockRestorePurchases(),
  hasActiveEntitlement: (...args: unknown[]) => mockHasActiveEntitlement(...args),
  PurchaseCancelledError: class PurchaseCancelledError extends Error {},
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PurchaseCancelledError } = require('../utils/purchases');

const WEEKLY_PACKAGE = { identifier: '$rc_weekly', product: { priceString: '£3.99' } };
const MONTHLY_PACKAGE = { identifier: '$rc_monthly', product: { priceString: '£8.99' } };
const CUSTOMER_INFO = { entitlements: { active: {} } };

describe('PaywallScreen with RevenueCat configured', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAppStore.setState({ screen: 'paywall', isProActive: false });
    mockGetSubscriptionPackages.mockResolvedValue({ weekly: WEEKLY_PACKAGE, monthly: MONTHLY_PACKAGE });
    mockPurchasePackage.mockResolvedValue(CUSTOMER_INFO);
    mockRestorePurchases.mockResolvedValue(CUSTOMER_INFO);
    mockHasActiveEntitlement.mockReturnValue(true);
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    (Alert.alert as jest.Mock).mockRestore();
  });

  it('shows the real store prices instead of the static fallback copy', async () => {
    render(<PaywallScreen />);

    await waitFor(() => expect(screen.getByText('£3.99')).toBeTruthy());
    expect(screen.getByText('£8.99')).toBeTruthy();
    expect(screen.queryByText('$4.99')).toBeNull();
    expect(mockEnsureConfigured).toHaveBeenCalled();
  });

  // Rendering the $4.99 guess and then visibly flipping it to the real price
  // is the thing the pricesLoading placeholder exists to prevent.
  it('shows a placeholder rather than the static price while offerings load', () => {
    mockGetSubscriptionPackages.mockReturnValue(new Promise(() => {}));
    render(<PaywallScreen />);

    expect(screen.queryByText('$4.99')).toBeNull();
    expect(screen.getAllByText('···')).toHaveLength(2);
  });

  it('falls back to the static prices when the offerings fetch fails', async () => {
    mockGetSubscriptionPackages.mockRejectedValue(new Error('offerings unavailable'));
    render(<PaywallScreen />);

    await waitFor(() => expect(screen.getByText('$4.99')).toBeTruthy());
    expect(screen.getByText('$9.99')).toBeTruthy();
  });

  it('purchases the selected package and unlocks pro on an active entitlement', async () => {
    render(<PaywallScreen />);
    await waitFor(() => expect(screen.getByText('£8.99')).toBeTruthy());

    fireEvent.press(screen.getByTestId('plan-monthly'));
    fireEvent.press(screen.getByText('Subscribe Now'));

    await waitFor(() => expect(useAppStore.getState().isProActive).toBe(true));
    expect(mockPurchasePackage).toHaveBeenCalledWith(MONTHLY_PACKAGE);
    expect(useAppStore.getState().screen).toBe('welcome');
  });

  it('defaults to the weekly package when no plan is tapped', async () => {
    render(<PaywallScreen />);
    await waitFor(() => expect(screen.getByText('£3.99')).toBeTruthy());

    fireEvent.press(screen.getByText('Subscribe Now'));

    await waitFor(() => expect(mockPurchasePackage).toHaveBeenCalledWith(WEEKLY_PACKAGE));
  });

  // A completed purchase whose entitlement isn't active means the store
  // product isn't attached to piercer_pro_access in the RevenueCat dashboard —
  // the user must not be left on a silently unchanged screen.
  it('reports an error when a completed purchase grants no entitlement', async () => {
    mockHasActiveEntitlement.mockReturnValue(false);
    render(<PaywallScreen />);
    await waitFor(() => expect(screen.getByText('£3.99')).toBeTruthy());

    fireEvent.press(screen.getByText('Subscribe Now'));

    await waitFor(() => expect(Alert.alert).toHaveBeenCalled());
    expect(useAppStore.getState().isProActive).toBe(false);
    expect(useAppStore.getState().screen).toBe('paywall');
  });

  it('reports an error when the purchase itself fails', async () => {
    mockPurchasePackage.mockRejectedValue(new Error('store unreachable'));
    render(<PaywallScreen />);
    await waitFor(() => expect(screen.getByText('£3.99')).toBeTruthy());

    fireEvent.press(screen.getByText('Subscribe Now'));

    await waitFor(() => expect(Alert.alert).toHaveBeenCalled());
    expect(useAppStore.getState().isProActive).toBe(false);
  });

  // Backing out of the store sheet is a deliberate user action, not a
  // failure — an error dialog on top of it would read as a broken purchase.
  it('stays silent when the user cancels the store purchase sheet', async () => {
    mockPurchasePackage.mockRejectedValue(new PurchaseCancelledError());
    render(<PaywallScreen />);
    await waitFor(() => expect(screen.getByText('£3.99')).toBeTruthy());

    fireEvent.press(screen.getByText('Subscribe Now'));

    await waitFor(() => expect(mockPurchasePackage).toHaveBeenCalled());
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(useAppStore.getState().screen).toBe('paywall');
  });

  it('restores a real previous purchase and unlocks pro', async () => {
    render(<PaywallScreen />);

    fireEvent.press(screen.getByTestId('paywall-restore-purchases'));

    await waitFor(() => expect(useAppStore.getState().isProActive).toBe(true));
    expect(Alert.alert).toHaveBeenCalledWith('Restore Purchases', expect.stringMatching(/restored/i));
  });

  it('reports finding nothing when there is no purchase to restore', async () => {
    mockHasActiveEntitlement.mockReturnValue(false);
    render(<PaywallScreen />);

    fireEvent.press(screen.getByTestId('paywall-restore-purchases'));

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith('Restore Purchases', expect.stringMatching(/no previous purchases/i))
    );
    expect(useAppStore.getState().isProActive).toBe(false);
  });

  it('reports an error when the restore lookup itself fails', async () => {
    mockRestorePurchases.mockRejectedValue(new Error('network down'));
    render(<PaywallScreen />);

    fireEvent.press(screen.getByTestId('paywall-restore-purchases'));

    await waitFor(() => expect(Alert.alert).toHaveBeenCalled());
    expect(useAppStore.getState().isProActive).toBe(false);
  });
});
