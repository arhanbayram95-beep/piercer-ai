import { fireEvent, render, screen, within } from '@testing-library/react-native';
import React from 'react';
import { useAppStore } from '../state/useAppStore';
import PiercingReferenceScreen from './PiercingReferenceScreen';

describe('PiercingReferenceScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'reference', previousScreen: 'settings' });
  });

  it('shows the pain-scale disclaimer as visible page copy', () => {
    render(<PiercingReferenceScreen />);
    expect(screen.getByTestId('reference-disclaimer').props.children).toContain('not medical advice');
  });

  it('lists every catalog location with its pain rating and description', () => {
    render(<PiercingReferenceScreen />);
    const helixCard = within(screen.getByTestId('reference-card-helix'));
    expect(helixCard.getByText('Pain: 5/10')).toBeTruthy();
    expect(helixCard.getByText(/upper outer cartilage rim/)).toBeTruthy();
  });

  it('covers the full non-genital catalog, including the newly added locations', () => {
    render(<PiercingReferenceScreen />);
    expect(screen.getByTestId('reference-card-snug')).toBeTruthy();
    expect(screen.getByTestId('reference-card-dermal')).toBeTruthy();
    expect(screen.getByTestId('reference-card-surface')).toBeTruthy();
  });

  it('lets the user close back to Settings', () => {
    render(<PiercingReferenceScreen />);
    fireEvent.press(screen.getByTestId('reference-close-button'));
    expect(useAppStore.getState().screen).toBe('settings');
  });
});
