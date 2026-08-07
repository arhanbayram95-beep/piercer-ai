import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import BottomNavBar from './BottomNavBar';
import { useAppStore } from '../../state/useAppStore';

describe('BottomNavBar', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'analyze' });
  });

  it('navigates to the analyze hub when Analyze is pressed', () => {
    render(<BottomNavBar active="analyze" />);
    fireEvent.press(screen.getByLabelText('Analyze'));
    expect(useAppStore.getState().screen).toBe('analyze');
  });

  it('navigates to results when Results is pressed', () => {
    render(<BottomNavBar active="analyze" />);
    fireEvent.press(screen.getByLabelText('Results'));
    expect(useAppStore.getState().screen).toBe('results');
  });

  it('navigates to settings when Settings is pressed', () => {
    render(<BottomNavBar active="analyze" />);
    fireEvent.press(screen.getByLabelText('Settings'));
    expect(useAppStore.getState().screen).toBe('settings');
  });

  it('marks the given tab as selected and leaves the rest unselected', () => {
    render(<BottomNavBar active="settings" />);
    expect(screen.getByLabelText('Settings').props.accessibilityState.selected).toBe(true);
    expect(screen.getByLabelText('Analyze').props.accessibilityState.selected).toBe(false);
  });
});
