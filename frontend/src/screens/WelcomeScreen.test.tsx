import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import WelcomeScreen from './WelcomeScreen';
import { useAppStore } from '../state/useAppStore';

describe('WelcomeScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'welcome' });
  });

  it('welcomes the user and proceeds into the app on the CTA', () => {
    render(<WelcomeScreen />);
    expect(screen.getByText("You're All Set")).toBeTruthy();

    fireEvent.press(screen.getByText("Let's Go"));
    expect(useAppStore.getState().screen).toBe('capture');
  });
});
