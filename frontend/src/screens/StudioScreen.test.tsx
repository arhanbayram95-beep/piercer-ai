import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import React from 'react';
import { RenderApiError } from '../api/render';
import { useAppStore } from '../state/useAppStore';
import StudioScreen from './StudioScreen';

const mockRenderPreview = jest.fn();
jest.mock('../api/render', () => {
  const actual = jest.requireActual('../api/render');
  return {
    ...actual,
    renderPreview: (...args: unknown[]) => mockRenderPreview(...args),
  };
});

describe('StudioScreen', () => {
  beforeEach(() => {
    mockRenderPreview.mockReset();
    mockRenderPreview.mockResolvedValue({ renderedImage: 'cmVuZGVyZWQ=', mimeType: 'image/png' });
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    useAppStore.setState({
      screen: 'studio',
      previousScreen: 'capture',
      images: ['AQID'],
      selectedJewelryType: 'hoops',
      selectedFinish: 'silver',
      renderResult: null,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
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

  it('calls the render API with the photo and current selection, stores the result, and moves to preview', async () => {
    useAppStore.setState({ selectedJewelryType: 'septum', selectedFinish: 'gold' });
    render(<StudioScreen />);

    fireEvent.press(screen.getByTestId('studio-continue-button'));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('preview'));
    expect(mockRenderPreview).toHaveBeenCalledWith({ photo: 'AQID', jewelryType: 'septum', finish: 'gold' });
    expect(useAppStore.getState().renderResult).toEqual({ renderedImage: 'cmVuZGVyZWQ=', mimeType: 'image/png' });
  });

  it('shows an alert and stays on studio when the render call fails', async () => {
    mockRenderPreview.mockRejectedValue(new RenderApiError('Something went wrong generating your preview.'));
    render(<StudioScreen />);

    fireEvent.press(screen.getByTestId('studio-continue-button'));

    await waitFor(() => expect(Alert.alert).toHaveBeenCalled());
    expect(useAppStore.getState().screen).toBe('studio');
    expect(useAppStore.getState().renderResult).toBeNull();
  });
});
