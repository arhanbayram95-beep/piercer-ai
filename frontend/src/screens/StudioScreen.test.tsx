import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { useAppStore } from '../state/useAppStore';
import StudioScreen from './StudioScreen';

describe('StudioScreen', () => {
  beforeEach(() => {
    useAppStore.setState({
      screen: 'studio',
      previousScreen: 'capture',
      images: ['AQID'],
      selectedJewelryType: 'hoops',
      selectedFinish: 'silver',
    });
  });

  it('renders the captured photo and the jewelry/finish drawer', () => {
    render(<StudioScreen />);
    expect(screen.getByTestId('studio-screen')).toBeTruthy();
    expect(screen.getByTestId('piercing-studio-drawer')).toBeTruthy();
  });

  it('lets the user close out — falls back to Welcome since capture is a non-returnable screen', () => {
    render(<StudioScreen />);
    fireEvent.press(screen.getByTestId('studio-close-button'));
    expect(useAppStore.getState().screen).toBe('welcome');
  });

  it('disables the continue button when there is no captured photo', () => {
    useAppStore.setState({ images: [] });
    render(<StudioScreen />);
    expect(screen.getByTestId('studio-continue-button').props.accessibilityState.disabled).toBe(true);
  });

  it('enables the continue button once a photo exists', () => {
    render(<StudioScreen />);
    expect(screen.getByTestId('studio-continue-button').props.accessibilityState.disabled).toBe(false);
  });
});
