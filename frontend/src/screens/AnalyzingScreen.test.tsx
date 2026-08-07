import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import AnalyzingScreen from './AnalyzingScreen';
import { ReadingApiError } from '../api/reading';
import { useAppStore } from '../state/useAppStore';

// The 20000ms default test timeout (jest.config.js) covers this file's
// continuous Animated.loop calls — see that config's comment for why.

const mockAnalyzeReading = jest.fn();

jest.mock('../api/reading', () => {
  const actual = jest.requireActual('../api/reading');
  return {
    ...actual,
    analyzeReading: (...args: unknown[]) => mockAnalyzeReading(...args),
  };
});

const mockStop = jest.fn().mockResolvedValue(undefined);
jest.mock('../utils/sound', () => ({
  startAmbientShimmerLoop: jest.fn().mockResolvedValue({ stop: () => mockStop() }),
}));

const PHOTOS_3 = ['base64-calm', 'base64-bright', 'base64-deep'];
const PHOTOS_1 = ['base64-solo'];
const READING = { headline: 'Effortlessly Magnetic', insights: [], narrative: 'n' };

describe('AnalyzingScreen', () => {
  beforeEach(() => {
    mockAnalyzeReading.mockReset();
    mockStop.mockClear();
    useAppStore.setState({
      screen: 'analyzing',
      images: PHOTOS_3,
      reading: null,
      selectedModule: 'three-expression',
    });
  });

  it('sends the captured photos and selected module, stores the reading, and moves to the reveal', async () => {
    mockAnalyzeReading.mockResolvedValue(READING);
    const { unmount } = render(<AnalyzingScreen />);

    await waitFor(() =>
      expect(mockAnalyzeReading).toHaveBeenCalledWith({ photos: PHOTOS_3, module: 'three-expression' })
    );
    await waitFor(() => expect(useAppStore.getState().screen).toBe('reveal'));
    expect(useAppStore.getState().reading).toEqual(READING);
    // Images are left in place for RevealScreen to display - it purges
    // them itself once the user leaves that screen.
    expect(useAppStore.getState().images).toEqual(PHOTOS_3);

    unmount();
    await waitFor(() => expect(mockStop).toHaveBeenCalledTimes(1));
  });

  it('sends whichever module was selected on the Analyze hub, with that module\'s own photo count', async () => {
    useAppStore.setState({ selectedModule: 'career-match', images: PHOTOS_1 });
    mockAnalyzeReading.mockResolvedValue(READING);
    render(<AnalyzingScreen />);

    await waitFor(() =>
      expect(mockAnalyzeReading).toHaveBeenCalledWith({ photos: PHOTOS_1, module: 'career-match' })
    );
  });

  it('shows an error instead of calling the API when the photo count does not match the module', async () => {
    useAppStore.setState({ selectedModule: 'career-match', images: PHOTOS_3 });
    render(<AnalyzingScreen />);

    await waitFor(() => expect(screen.getByTestId('analyzing-retry-button')).toBeTruthy());
    expect(mockAnalyzeReading).not.toHaveBeenCalled();
  });

  it('shows a retry option when the API call fails', async () => {
    mockAnalyzeReading.mockRejectedValue(new ReadingApiError('Could not reach the Face Reader server. Check your connection and try again.'));
    render(<AnalyzingScreen />);

    await waitFor(() => expect(screen.getByTestId('analyzing-retry-button')).toBeTruthy());
    expect(useAppStore.getState().screen).toBe('analyzing');

    mockAnalyzeReading.mockResolvedValue(READING);
    fireEvent.press(screen.getByTestId('analyzing-retry-button'));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('reveal'));
  });

  it('routes to the no-face-detected screen on a NO_FACE_DETECTED error', async () => {
    mockAnalyzeReading.mockRejectedValue(new ReadingApiError('No face found in one of the photos.', 'NO_FACE_DETECTED'));
    render(<AnalyzingScreen />);

    await waitFor(() => expect(useAppStore.getState().screen).toBe('noFaceDetected'));
  });

  // Process-and-discard (PROJECT_SPEC.md §3): only the success path hands
  // the photos on to RevealScreen, which purges them on unmount. Every path
  // that abandons the reading has to purge them here instead, or they sit in
  // the store indefinitely — and the next capture session appends onto them,
  // overshooting MODULE_PHOTO_COUNTS and failing with a misleading error.
  it('discards the captured photos when a failed reading is abandoned', async () => {
    mockAnalyzeReading.mockRejectedValue(new ReadingApiError('Could not reach the Face Reader server.'));
    render(<AnalyzingScreen />);

    await waitFor(() => expect(screen.getByTestId('analyzing-retry-button')).toBeTruthy());
    expect(useAppStore.getState().images).toEqual(PHOTOS_3);

    fireEvent.press(screen.getByText('Back to Analyze'));

    expect(useAppStore.getState().screen).toBe('analyze');
    expect(useAppStore.getState().images).toEqual([]);
  });

  it('discards the captured photos when routing to the no-face-detected screen', async () => {
    mockAnalyzeReading.mockRejectedValue(new ReadingApiError('No face found in one of the photos.', 'NO_FACE_DETECTED'));
    render(<AnalyzingScreen />);

    await waitFor(() => expect(useAppStore.getState().screen).toBe('noFaceDetected'));
    expect(useAppStore.getState().images).toEqual([]);
  });
});
