import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { useAppStore } from '../state/useAppStore';
import PiercingLocationScreen from './PiercingLocationScreen';

describe('PiercingLocationScreen', () => {
  beforeEach(() => {
    useAppStore.setState({
      screen: 'location',
      previousScreen: 'welcome',
      selectedLocation: null,
    });
  });

  it('renders every piercing location option, grouped by category', () => {
    render(<PiercingLocationScreen />);
    expect(screen.getByTestId('location-chip-helix')).toBeTruthy();
    expect(screen.getByTestId('location-chip-septum')).toBeTruthy();
    expect(screen.getByTestId('location-chip-navel')).toBeTruthy();
  });

  it('disables Continue until a location is picked', () => {
    render(<PiercingLocationScreen />);
    expect(screen.getByTestId('location-continue-button').props.accessibilityState.disabled).toBe(true);
  });

  it('selects a location on tap and enables Continue', () => {
    render(<PiercingLocationScreen />);
    fireEvent.press(screen.getByTestId('location-chip-tragus'));

    expect(useAppStore.getState().selectedLocation).toBe('tragus');
    expect(screen.getByTestId('location-chip-tragus').props.accessibilityState.selected).toBe(true);
    expect(screen.getByTestId('location-continue-button').props.accessibilityState.disabled).toBe(false);
  });

  it('moves to Capture once Continue is pressed', () => {
    render(<PiercingLocationScreen />);
    fireEvent.press(screen.getByTestId('location-chip-lobe'));
    fireEvent.press(screen.getByTestId('location-continue-button'));

    expect(useAppStore.getState().screen).toBe('capture');
  });

  it('lets the user close back out to Welcome', () => {
    render(<PiercingLocationScreen />);
    fireEvent.press(screen.getByTestId('location-close-button'));
    expect(useAppStore.getState().screen).toBe('welcome');
  });

  it('carries the bottom nav bar and does not clear the selection when jumping to another module', () => {
    render(<PiercingLocationScreen />);
    fireEvent.press(screen.getByTestId('location-chip-tragus'));

    fireEvent.press(screen.getByLabelText('Reference'));

    expect(useAppStore.getState().screen).toBe('reference');
    expect(useAppStore.getState().selectedLocation).toBe('tragus');
  });
});
