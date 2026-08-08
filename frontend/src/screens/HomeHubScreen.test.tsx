import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { useAppStore } from '../state/useAppStore';
import HomeHubScreen from './HomeHubScreen';

describe('HomeHubScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'home', previousScreen: 'welcome' });
  });

  it('offers entry points to try-on, reference, and match, plus settings via the nav bar', () => {
    render(<HomeHubScreen />);
    expect(screen.getByTestId('home-hub-try-on-option')).toBeTruthy();
    expect(screen.getByTestId('home-hub-reference-option')).toBeTruthy();
    expect(screen.getByTestId('home-hub-match-option')).toBeTruthy();
    expect(screen.getByLabelText('Settings')).toBeTruthy();
  });

  it('routes to the piercing-location picker, kicking off the try-on flow', () => {
    render(<HomeHubScreen />);
    fireEvent.press(screen.getByTestId('home-hub-try-on-option'));
    expect(useAppStore.getState().screen).toBe('location');
  });

  it('routes to the piercing reference page', () => {
    render(<HomeHubScreen />);
    fireEvent.press(screen.getByTestId('home-hub-reference-option'));
    expect(useAppStore.getState().screen).toBe('reference');
  });

  it('routes to the personality/body-type match hub', () => {
    render(<HomeHubScreen />);
    fireEvent.press(screen.getByTestId('home-hub-match-option'));
    expect(useAppStore.getState().screen).toBe('match');
  });

  it('reaches Settings via the bottom nav bar', () => {
    render(<HomeHubScreen />);
    fireEvent.press(screen.getByLabelText('Settings'));
    expect(useAppStore.getState().screen).toBe('settings');
  });
});
