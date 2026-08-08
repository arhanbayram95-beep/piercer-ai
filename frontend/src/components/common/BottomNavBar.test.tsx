import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import BottomNavBar from './BottomNavBar';
import { useAppStore } from '../../state/useAppStore';

describe('BottomNavBar', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'home' });
  });

  it('navigates to home when Home is pressed', () => {
    render(<BottomNavBar active="settings" />);
    fireEvent.press(screen.getByLabelText('Home'));
    expect(useAppStore.getState().screen).toBe('home');
  });

  it('navigates to the piercing-location picker when Try On is pressed', () => {
    render(<BottomNavBar active="home" />);
    fireEvent.press(screen.getByLabelText('Try On'));
    expect(useAppStore.getState().screen).toBe('location');
  });

  it('navigates to the reference page when Reference is pressed', () => {
    render(<BottomNavBar active="home" />);
    fireEvent.press(screen.getByLabelText('Reference'));
    expect(useAppStore.getState().screen).toBe('reference');
  });

  it('navigates to the match hub when Match is pressed', () => {
    render(<BottomNavBar active="home" />);
    fireEvent.press(screen.getByLabelText('Match'));
    expect(useAppStore.getState().screen).toBe('match');
  });

  it('navigates to settings when Settings is pressed', () => {
    render(<BottomNavBar active="home" />);
    fireEvent.press(screen.getByLabelText('Settings'));
    expect(useAppStore.getState().screen).toBe('settings');
  });

  it('marks the active tab as selected, shows its label, and leaves the rest unselected without labels', () => {
    render(<BottomNavBar active="reference" />);
    expect(screen.getByLabelText('Reference').props.accessibilityState.selected).toBe(true);
    expect(screen.getByText('Reference')).toBeTruthy();

    expect(screen.getByLabelText('Home').props.accessibilityState.selected).toBe(false);
    expect(screen.queryByText('Home')).toBeNull();
  });
});
