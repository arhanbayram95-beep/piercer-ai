import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import BottomNavBar from './BottomNavBar';
import { useAppStore } from '../../state/useAppStore';

describe('BottomNavBar', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'settings' });
  });

  it('navigates to home when Home is pressed', () => {
    render(<BottomNavBar active="settings" />);
    fireEvent.press(screen.getByLabelText('Home'));
    expect(useAppStore.getState().screen).toBe('home');
  });

  it('navigates to settings when Settings is pressed', () => {
    render(<BottomNavBar active="home" />);
    fireEvent.press(screen.getByLabelText('Settings'));
    expect(useAppStore.getState().screen).toBe('settings');
  });

  it('marks the given tab as selected and leaves the rest unselected', () => {
    render(<BottomNavBar active="settings" />);
    expect(screen.getByLabelText('Settings').props.accessibilityState.selected).toBe(true);
    expect(screen.getByLabelText('Home').props.accessibilityState.selected).toBe(false);
  });
});
