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
      selectedLocation: null,
      selectedJewelryType: 'hoops',
      selectedFinish: 'silver',
      stackedItems: [],
      renderResult: null,
      isProActive: false,
      freeRendersUsed: 0,
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
    expect(mockRenderPreview).toHaveBeenCalledWith({
      photo: 'AQID',
      jewelryType: 'septum',
      finish: 'gold',
      additionalItems: undefined,
    });
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

  it('passes stacked jewelry items through as additionalItems', async () => {
    useAppStore.setState({
      isProActive: true,
      stackedItems: [{ jewelryType: 'dermal', finish: 'gold' }],
    });
    render(<StudioScreen />);

    fireEvent.press(screen.getByTestId('studio-continue-button'));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('preview'));
    expect(mockRenderPreview).toHaveBeenCalledWith(
      expect.objectContaining({ additionalItems: [{ jewelryType: 'dermal', finish: 'gold' }] })
    );
  });

  it('lets a free user spend their one free render', async () => {
    render(<StudioScreen />);
    fireEvent.press(screen.getByTestId('studio-continue-button'));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('preview'));
    expect(useAppStore.getState().freeRendersUsed).toBe(1);
  });

  it('routes a free user who has used up their free render to the paywall instead of calling the API', async () => {
    useAppStore.setState({ freeRendersUsed: 1 });
    render(<StudioScreen />);

    fireEvent.press(screen.getByTestId('studio-continue-button'));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('paywall'));
    expect(mockRenderPreview).not.toHaveBeenCalled();
  });

  it('never gates a Pro user on the free render limit', async () => {
    useAppStore.setState({ isProActive: true, freeRendersUsed: 5 });
    render(<StudioScreen />);

    fireEvent.press(screen.getByTestId('studio-continue-button'));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('preview'));
    expect(mockRenderPreview).toHaveBeenCalled();
    expect(useAppStore.getState().freeRendersUsed).toBe(5);
  });

  it('does not show the body/face-type recommendation banner when no location was picked', () => {
    render(<StudioScreen />);
    expect(screen.queryByTestId('studio-recommendation-banner')).toBeNull();
  });

  it('shows a jewelry recommendation banner based on the picked location', () => {
    useAppStore.setState({ selectedLocation: 'septum' });
    render(<StudioScreen />);
    expect(screen.getByTestId('studio-recommendation-banner')).toBeTruthy();
  });

  it('applies the recommended jewelry type/finish and dismisses the banner', () => {
    useAppStore.setState({ selectedLocation: 'septum', selectedJewelryType: 'hoops', selectedFinish: 'silver' });
    render(<StudioScreen />);

    fireEvent.press(screen.getByTestId('studio-recommendation-apply'));

    expect(useAppStore.getState().selectedJewelryType).toBe('hoops');
    expect(useAppStore.getState().selectedFinish).toBe('blackSteel');
    expect(screen.queryByTestId('studio-recommendation-banner')).toBeNull();
  });

  it('lets the user dismiss the recommendation banner without applying it', () => {
    useAppStore.setState({ selectedLocation: 'septum' });
    render(<StudioScreen />);

    fireEvent.press(screen.getByTestId('studio-recommendation-dismiss'));

    expect(screen.queryByTestId('studio-recommendation-banner')).toBeNull();
  });
});
