import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { useAppStore } from '../../state/useAppStore';
import PiercingStudioDrawer from './PiercingStudioDrawer';

describe('PiercingStudioDrawer', () => {
  beforeEach(() => {
    useAppStore.setState({ selectedJewelryType: 'hoops', selectedFinish: 'silver' });
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
});
