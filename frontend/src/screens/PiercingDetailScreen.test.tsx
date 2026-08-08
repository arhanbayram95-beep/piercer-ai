import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { PIERCING_LOCATION_IDS } from '../content/piercingLocations';
import { useAppStore } from '../state/useAppStore';
import PiercingDetailScreen from './PiercingDetailScreen';

describe('PiercingDetailScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'locationDetail', previousScreen: 'reference', viewedLocationId: 'helix' });
  });

  it('shows the diagram, pain rating, description, healing time, and aftercare for the viewed location', () => {
    render(<PiercingDetailScreen />);
    expect(screen.getByTestId('location-detail-diagram-helix')).toBeTruthy();
    expect(screen.getByText('Pain: 5/10')).toBeTruthy();
    expect(screen.getByText(/upper outer cartilage rim/)).toBeTruthy();
    expect(screen.getByTestId('location-detail-healing-helix').props.children).toBe('Heals in 3-6 months');
    expect(screen.getByTestId('location-detail-aftercare-helix').props.children).toContain('saline spray');
  });

  it('shows the same not-medical-advice disclaimer as the reference list', () => {
    render(<PiercingDetailScreen />);
    expect(screen.getByTestId('location-detail-disclaimer').props.children).toContain('not medical advice');
  });

  it('has a healing time and aftercare tip for every single catalog location, including the newly added ones', () => {
    for (const id of PIERCING_LOCATION_IDS) {
      useAppStore.setState({ viewedLocationId: id });
      const result = render(<PiercingDetailScreen />);
      expect(result.getByTestId(`location-detail-healing-${id}`)).toBeTruthy();
      expect(result.getByTestId(`location-detail-aftercare-${id}`)).toBeTruthy();
      result.unmount();
    }
  });

  it('closes back to the reference list', () => {
    render(<PiercingDetailScreen />);
    fireEvent.press(screen.getByTestId('location-detail-close-button'));
    expect(useAppStore.getState().screen).toBe('reference');
  });

  it('carries the bottom nav bar', () => {
    render(<PiercingDetailScreen />);
    fireEvent.press(screen.getByLabelText('Match'));
    expect(useAppStore.getState().screen).toBe('match');
  });

  it('falls back gracefully instead of crashing if reached with no viewed location', () => {
    useAppStore.setState({ viewedLocationId: null });
    render(<PiercingDetailScreen />);
    expect(screen.getByTestId('location-detail-screen')).toBeTruthy();
  });
});
