import { act, fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { useAppStore } from '../../state/useAppStore';
import PiercingStudioDrawer from './PiercingStudioDrawer';

describe('PiercingStudioDrawer', () => {
  beforeEach(() => {
    useAppStore.setState({
      selectedLocation: null,
      selectedJewelryType: 'hoops',
      selectedFinish: 'silver',
      stackedItems: [],
      isProActive: false,
      screen: 'studio',
    });
  });

  it('defaults to hoops/silver selected', () => {
    render(<PiercingStudioDrawer />);
    expect(screen.getByTestId('jewelry-type-chip-hoops').props.accessibilityState.selected).toBe(true);
    expect(screen.getByTestId('jewelry-finish-chip-silver').props.accessibilityState.selected).toBe(true);
  });

  it('updates the selected jewelry type in the store when a chip is tapped', () => {
    render(<PiercingStudioDrawer />);
    fireEvent.press(screen.getByTestId('jewelry-type-chip-septum'));
    expect(useAppStore.getState().selectedJewelryType).toBe('septum');
  });

  it('updates the selected finish in the store when a chip is tapped', () => {
    render(<PiercingStudioDrawer />);
    fireEvent.press(screen.getByTestId('jewelry-finish-chip-gold'));
    expect(useAppStore.getState().selectedFinish).toBe('gold');
  });

  it('routes a non-Pro user to the paywall instead of stacking a piece', () => {
    render(<PiercingStudioDrawer />);
    fireEvent.press(screen.getByTestId('add-another-piece-button'));
    expect(useAppStore.getState().screen).toBe('paywall');
    expect(useAppStore.getState().stackedItems).toEqual([]);
  });

  it('lets a Pro user stack an additional piece', () => {
    useAppStore.setState({ isProActive: true });
    render(<PiercingStudioDrawer />);
    fireEvent.press(screen.getByTestId('add-another-piece-button'));
    expect(useAppStore.getState().stackedItems).toEqual([{ jewelryType: 'hoops', finish: 'silver' }]);
  });

  it('lets a Pro user remove a stacked piece', () => {
    useAppStore.setState({ isProActive: true, stackedItems: [{ jewelryType: 'septum', finish: 'gold' }] });
    render(<PiercingStudioDrawer />);
    fireEvent.press(screen.getByTestId('stacked-item-remove-0'));
    expect(useAppStore.getState().stackedItems).toEqual([]);
  });

  it('stops adding once the stacking limit is reached', () => {
    useAppStore.setState({
      isProActive: true,
      stackedItems: [
        { jewelryType: 'studs', finish: 'gold' },
        { jewelryType: 'barbells', finish: 'titanium' },
        { jewelryType: 'dermal', finish: 'blackSteel' },
      ],
    });
    render(<PiercingStudioDrawer />);
    fireEvent.press(screen.getByTestId('add-another-piece-button'));
    expect(useAppStore.getState().stackedItems).toHaveLength(3);
  });

  it('falls back to every jewelry type when no location is selected', () => {
    render(<PiercingStudioDrawer />);
    expect(screen.getByTestId('jewelry-type-chip-industrial')).toBeTruthy();
    expect(screen.getByTestId('jewelry-type-chip-dermal')).toBeTruthy();
  });

  it('only offers jewelry types that anatomically fit the selected location', () => {
    useAppStore.setState({ selectedLocation: 'tongue', selectedJewelryType: 'barbells' });
    render(<PiercingStudioDrawer />);

    expect(screen.getByTestId('jewelry-type-chip-barbells')).toBeTruthy();
    expect(screen.queryByTestId('jewelry-type-chip-hoops')).toBeNull();
    expect(screen.queryByTestId('jewelry-type-chip-industrial')).toBeNull();
    expect(screen.queryByTestId('jewelry-type-chip-dermal')).toBeNull();
  });

  it('only offers the industrial jewelry type for the Industrial location', () => {
    useAppStore.setState({ selectedLocation: 'industrial', selectedJewelryType: 'industrial' });
    render(<PiercingStudioDrawer />);

    expect(screen.getByTestId('jewelry-type-chip-industrial')).toBeTruthy();
    expect(screen.queryByTestId('jewelry-type-chip-barbells')).toBeNull();
  });

  it('auto-corrects an already-invalid jewelry type on mount rather than leaving it selected', () => {
    // Simulates arriving at Studio with a leftover selection from a
    // different (or default) location that the newly-picked location
    // doesn't support.
    useAppStore.setState({ selectedLocation: 'tongue', selectedJewelryType: 'hoops' });
    render(<PiercingStudioDrawer />);

    expect(useAppStore.getState().selectedJewelryType).toBe('barbells');
    expect(screen.getByTestId('jewelry-type-chip-barbells').props.accessibilityState.selected).toBe(true);
  });

  it('auto-corrects the selection when the location changes to a more restrictive one after mount', () => {
    useAppStore.setState({ selectedLocation: 'lobe', selectedJewelryType: 'hoops' });
    render(<PiercingStudioDrawer />);
    expect(useAppStore.getState().selectedJewelryType).toBe('hoops');

    act(() => {
      useAppStore.setState({ selectedLocation: 'industrial' });
    });

    expect(useAppStore.getState().selectedJewelryType).toBe('industrial');
  });

  it('leaves a still-valid selection alone when the location changes', () => {
    useAppStore.setState({ selectedLocation: 'lobe', selectedJewelryType: 'hoops' });
    render(<PiercingStudioDrawer />);

    act(() => {
      useAppStore.setState({ selectedLocation: 'tragus' });
    });

    // hoops is valid for both lobe and tragus, so it should carry over
    // unchanged rather than being reset unnecessarily.
    expect(useAppStore.getState().selectedJewelryType).toBe('hoops');
  });
});
