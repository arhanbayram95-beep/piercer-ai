import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import NoFaceDetectedScreen from './NoFaceDetectedScreen';
import { useAppStore } from '../state/useAppStore';

describe('NoFaceDetectedScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'noFaceDetected' });
  });

  it('routes back to capture on retry', () => {
    render(<NoFaceDetectedScreen />);
    fireEvent.press(screen.getByTestId('no-face-detected-retry-button'));
    expect(useAppStore.getState().screen).toBe('capture');
  });

  it('routes to the analyze hub on back home', () => {
    render(<NoFaceDetectedScreen />);
    fireEvent.press(screen.getByText('Back to Analyze'));
    expect(useAppStore.getState().screen).toBe('analyze');
  });
});
