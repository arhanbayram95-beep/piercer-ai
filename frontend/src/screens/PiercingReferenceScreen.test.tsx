import { fireEvent, render, screen, within } from '@testing-library/react-native';
import React from 'react';
import { PIERCING_LOCATION_IDS } from '../content/piercingLocations';
import { useAppStore } from '../state/useAppStore';
import PiercingReferenceScreen from './PiercingReferenceScreen';

describe('PiercingReferenceScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'reference', previousScreen: 'settings' });
  });

  it('shows the pain-scale/healing/aftercare disclaimer as visible page copy', () => {
    render(<PiercingReferenceScreen />);
    expect(screen.getByTestId('reference-disclaimer').props.children).toContain('not medical advice');
  });

  it('shows the pain rating on the collapsed card, without the description/healing/aftercare detail', () => {
    render(<PiercingReferenceScreen />);
    const helixCard = within(screen.getByTestId('reference-card-helix'));
    expect(helixCard.getByText('Pain: 5/10')).toBeTruthy();
    expect(helixCard.queryByText(/upper outer cartilage rim/)).toBeNull();
    expect(helixCard.queryByTestId('reference-healing-helix')).toBeNull();
    expect(helixCard.queryByTestId('reference-aftercare-helix')).toBeNull();
  });

  it('reveals description, healing time, and aftercare tip when a collapsed card is pressed', () => {
    render(<PiercingReferenceScreen />);
    fireEvent.press(screen.getByTestId('reference-card-helix'));
    const helixCard = within(screen.getByTestId('reference-card-helix'));
    expect(helixCard.getByText(/upper outer cartilage rim/)).toBeTruthy();
    expect(helixCard.getByTestId('reference-healing-helix').props.children).toBe('Heals in 3-6 months');
    expect(helixCard.getByTestId('reference-aftercare-helix').props.children).toContain('saline spray');
  });

  it('collapses an expanded card back down when pressed again', () => {
    render(<PiercingReferenceScreen />);
    fireEvent.press(screen.getByTestId('reference-card-helix'));
    fireEvent.press(screen.getByTestId('reference-card-helix'));
    const helixCard = within(screen.getByTestId('reference-card-helix'));
    expect(helixCard.queryByTestId('reference-healing-helix')).toBeNull();
  });

  it('renders a piercing diagram for every location, not just text', () => {
    render(<PiercingReferenceScreen />);
    expect(screen.getByTestId('reference-diagram-helix')).toBeTruthy();
    expect(screen.getByTestId('reference-diagram-navel')).toBeTruthy();
  });

  it('covers the full non-genital catalog, including the newly added locations', () => {
    render(<PiercingReferenceScreen />);
    expect(screen.getByTestId('reference-card-snug')).toBeTruthy();
    expect(screen.getByTestId('reference-card-dermal')).toBeTruthy();
    expect(screen.getByTestId('reference-card-surface')).toBeTruthy();
  });

  it('has a healing time and aftercare tip for every single catalog location, not just a sample', () => {
    render(<PiercingReferenceScreen />);
    for (const id of PIERCING_LOCATION_IDS) {
      fireEvent.press(screen.getByTestId(`reference-card-${id}`));
      expect(screen.getByTestId(`reference-healing-${id}`)).toBeTruthy();
      expect(screen.getByTestId(`reference-aftercare-${id}`)).toBeTruthy();
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
