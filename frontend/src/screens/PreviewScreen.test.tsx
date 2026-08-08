import { fireEvent, render, screen } from '@testing-library/react-native';
import { Share } from 'react-native';
import React from 'react';
import { useAppStore } from '../state/useAppStore';
import PreviewScreen from './PreviewScreen';

const mockCaptureRef = jest.fn().mockResolvedValue('file:///tmp/preview.png');
jest.mock('react-native-view-shot', () => ({
  captureRef: (...args: unknown[]) => mockCaptureRef(...args),
}));

describe('PreviewScreen', () => {
  beforeEach(() => {
    mockCaptureRef.mockClear();
    jest.spyOn(Share, 'share').mockResolvedValue({ action: 'sharedAction' });
    useAppStore.setState({
      screen: 'preview',
      images: ['b3JpZ2luYWw='],
      renderResult: { renderedImage: 'cmVuZGVyZWQ=', mimeType: 'image/png' },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows the "after" render by default', () => {
    render(<PreviewScreen />);
    expect(screen.getByTestId('preview-toggle-after').props.accessibilityState.selected).toBe(true);
  });

  it('toggles between before/after', () => {
    render(<PreviewScreen />);
    fireEvent.press(screen.getByTestId('preview-toggle-before'));
    expect(screen.getByTestId('preview-toggle-before').props.accessibilityState.selected).toBe(true);
    expect(screen.getByTestId('preview-toggle-after').props.accessibilityState.selected).toBe(false);
  });

  it('adjusts a placement slider within its bounds', () => {
    render(<PreviewScreen />);
    fireEvent.press(screen.getByTestId('preview-slider-scale-increment'));
    expect(screen.getByTestId('preview-slider-scale-value').props.children.join('')).toBe('110%');
  });

  it('clamps a slider at its configured max', () => {
    render(<PreviewScreen />);
    for (let i = 0; i < 10; i++) {
      fireEvent.press(screen.getByTestId('preview-slider-scale-increment'));
    }
    expect(screen.getByTestId('preview-slider-scale-value').props.children.join('')).toBe('150%');
  });

  it('captures the preview and opens the native share sheet', async () => {
    render(<PreviewScreen />);
    fireEvent.press(screen.getByTestId('preview-share-button'));
    await Promise.resolve();
    expect(mockCaptureRef).toHaveBeenCalled();
    expect(Share.share).toHaveBeenCalledWith({ url: 'file:///tmp/preview.png' });
  });

  it('clears the session and returns to Home on Done', () => {
    render(<PreviewScreen />);
    fireEvent.press(screen.getByTestId('preview-done-button'));
    expect(useAppStore.getState().screen).toBe('home');
    expect(useAppStore.getState().images).toEqual([]);
    expect(useAppStore.getState().renderResult).toBeNull();
  });

  it('shows a fallback state with no dead end when there is no render result yet', () => {
    useAppStore.setState({ renderResult: null, images: [] });
    render(<PreviewScreen />);
    expect(screen.getByTestId('preview-screen')).toBeTruthy();
    fireEvent.press(screen.getByTestId('preview-done-button'));
    expect(useAppStore.getState().screen).toBe('home');
  });

  it('carries the bottom nav bar, and jumping to another module does not discard the render result', () => {
    render(<PreviewScreen />);
    fireEvent.press(screen.getByLabelText('Reference'));

    expect(useAppStore.getState().screen).toBe('reference');
    expect(useAppStore.getState().renderResult).toEqual({ renderedImage: 'cmVuZGVyZWQ=', mimeType: 'image/png' });
    expect(useAppStore.getState().images).toEqual(['b3JpZ2luYWw=']);
  });

  it('carries the bottom nav bar even in the no-render-result fallback state', () => {
    useAppStore.setState({ renderResult: null, images: [] });
    render(<PreviewScreen />);
    expect(screen.getByLabelText('Home')).toBeTruthy();
  });
});
