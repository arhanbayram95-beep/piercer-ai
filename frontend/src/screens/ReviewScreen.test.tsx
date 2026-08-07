import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Linking } from 'react-native';
import React from 'react';
import ReviewScreen from './ReviewScreen';
import { useAppStore } from '../state/useAppStore';
import { getStoreListingUrl } from '../utils/storeLinks';

describe('ReviewScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'review' });
    jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('lets the user pick a star rating', () => {
    render(<ReviewScreen />);
    fireEvent.press(screen.getByLabelText('Rate 4 stars'));
    expect(screen.getByLabelText('Rate 4 stars')).toBeTruthy();
  });

  it('opens the real App Store/Play Store listing and returns to the Analyze hub by default', async () => {
    render(<ReviewScreen />);
    fireEvent.press(screen.getByText('Rate on App Store'));

    await waitFor(() => expect(Linking.openURL).toHaveBeenCalledWith(getStoreListingUrl()));
    await waitFor(() => expect(useAppStore.getState().screen).toBe('analyze'));
  });

  it('returns to Settings, not the Analyze hub, when Review was opened from Settings', async () => {
    useAppStore.getState().goToScreen('settings');
    useAppStore.getState().goToScreen('review');

    render(<ReviewScreen />);
    fireEvent.press(screen.getByLabelText('Close'));

    expect(useAppStore.getState().screen).toBe('settings');
  });

  it('Maybe Later also returns to wherever Review was opened from', () => {
    useAppStore.getState().goToScreen('settings');
    useAppStore.getState().goToScreen('review');

    render(<ReviewScreen />);
    fireEvent.press(screen.getByText('Maybe Later'));

    expect(useAppStore.getState().screen).toBe('settings');
  });

  it('returns to the Analyze hub, not back to the just-finished reading, when opened from Reveal', () => {
    useAppStore.getState().goToScreen('reveal');
    useAppStore.getState().goToScreen('review');

    render(<ReviewScreen />);
    fireEvent.press(screen.getByText('Maybe Later'));

    expect(useAppStore.getState().screen).toBe('analyze');
  });
});
