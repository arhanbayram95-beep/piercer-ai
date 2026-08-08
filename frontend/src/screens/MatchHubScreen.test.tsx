import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { useAppStore } from '../state/useAppStore';
import MatchHubScreen from './MatchHubScreen';

describe('MatchHubScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'match', previousScreen: 'settings' });
  });

  it('offers the quiz and photo paths as two separate options', () => {
    render(<MatchHubScreen />);
    expect(screen.getByTestId('match-hub-quiz-option')).toBeTruthy();
    expect(screen.getByTestId('match-hub-photo-option')).toBeTruthy();
  });

  it('routes to the quiz screen', () => {
    render(<MatchHubScreen />);
    fireEvent.press(screen.getByTestId('match-hub-quiz-option'));
    expect(useAppStore.getState().screen).toBe('matchQuiz');
  });

  it('routes to the photo screen', () => {
    render(<MatchHubScreen />);
    fireEvent.press(screen.getByTestId('match-hub-photo-option'));
    expect(useAppStore.getState().screen).toBe('matchPhoto');
  });

  it('lets the user close back to Settings', () => {
    render(<MatchHubScreen />);
    fireEvent.press(screen.getByTestId('match-hub-close-button'));
    expect(useAppStore.getState().screen).toBe('settings');
  });

  it('carries the bottom nav bar so other modules are reachable without going back through Home', () => {
    render(<MatchHubScreen />);
    fireEvent.press(screen.getByLabelText('Home'));
    expect(useAppStore.getState().screen).toBe('home');
  });
});
