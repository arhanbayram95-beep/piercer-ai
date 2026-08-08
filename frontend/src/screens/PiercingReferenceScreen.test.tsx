import { fireEvent, render, screen, within } from '@testing-library/react-native';
import React from 'react';
import { PIERCING_LOCATION_IDS } from '../content/piercingLocations';
import { useAppStore } from '../state/useAppStore';
import PiercingReferenceScreen from './PiercingReferenceScreen';

describe('PiercingReferenceScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'reference', previousScreen: 'settings', viewedLocationId: null });
  });

  it('shows the pain-scale/healing/aftercare disclaimer as visible page copy', () => {
    render(<PiercingReferenceScreen />);
    expect(screen.getByTestId('reference-disclaimer').props.children).toContain('not medical advice');
  });

  it('shows the pain rating on the card, without the description/healing/aftercare detail inline', () => {
    render(<PiercingReferenceScreen />);
    const helixCard = within(screen.getByTestId('reference-card-helix'));
    expect(helixCard.getByText('Pain: 5/10')).toBeTruthy();
    expect(helixCard.queryByText(/upper outer cartilage rim/)).toBeNull();
    expect(screen.queryByTestId('reference-healing-helix')).toBeNull();
    expect(screen.queryByTestId('reference-aftercare-helix')).toBeNull();
  });

  it('navigates to the location detail screen and records the pressed location when a card is tapped', () => {
    render(<PiercingReferenceScreen />);
    fireEvent.press(screen.getByTestId('reference-card-helix'));
    expect(useAppStore.getState().screen).toBe('locationDetail');
    expect(useAppStore.getState().viewedLocationId).toBe('helix');
  });

  it('renders a piercing diagram for every location, not just text', () => {
    render(<PiercingReferenceScreen />);
    expect(screen.getByTestId('reference-diagram-helix')).toBeTruthy();
    expect(screen.getByTestId('reference-diagram-navel')).toBeTruthy();
  });

  it('covers the full non-genital catalog, including the original and newly added locations', () => {
    render(<PiercingReferenceScreen />);
    expect(screen.getByTestId('reference-card-snug')).toBeTruthy();
    expect(screen.getByTestId('reference-card-dermal')).toBeTruthy();
    expect(screen.getByTestId('reference-card-surface')).toBeTruthy();
    expect(screen.getByTestId('reference-card-nefertiti')).toBeTruthy();
    expect(screen.getByTestId('reference-card-rhino')).toBeTruthy();
    expect(screen.getByTestId('reference-card-nasallang')).toBeTruthy();
    expect(screen.getByTestId('reference-card-flat')).toBeTruthy();
    expect(screen.getByTestId('reference-card-auricle')).toBeTruthy();
    expect(screen.getByTestId('reference-card-verticalLabret')).toBeTruthy();
    expect(screen.getByTestId('reference-card-antiEyebrow')).toBeTruthy();
    expect(screen.getByTestId('reference-card-nape')).toBeTruthy();
    expect(screen.getByTestId('reference-card-hip')).toBeTruthy();
  });

  it('renders a card for every single catalog location, not just a sample', () => {
    render(<PiercingReferenceScreen />);
    for (const id of PIERCING_LOCATION_IDS) {
      expect(screen.getByTestId(`reference-card-${id}`)).toBeTruthy();
    }
  });

  it('lets the user close back to Settings', () => {
    render(<PiercingReferenceScreen />);
    fireEvent.press(screen.getByTestId('reference-close-button'));
    expect(useAppStore.getState().screen).toBe('settings');
  });

  it('carries the bottom nav bar so other modules are reachable without going back through Home', () => {
    render(<PiercingReferenceScreen />);
    fireEvent.press(screen.getByLabelText('Match'));
    expect(useAppStore.getState().screen).toBe('match');
  });
});
