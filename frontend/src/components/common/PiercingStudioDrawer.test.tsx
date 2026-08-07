import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { useAppStore } from '../../state/useAppStore';
import PiercingStudioDrawer from './PiercingStudioDrawer';

describe('PiercingStudioDrawer', () => {
  beforeEach(() => {
    useAppStore.setState({
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
});
