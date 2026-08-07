import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Alert, Share } from 'react-native';
import React from 'react';
import RevealScreen from './RevealScreen';
import { CharacterAnalysisResult, RelationshipHarmonyResult } from '../api/types';
import { useAppStore } from '../state/useAppStore';

const mockCaptureRef = jest.fn().mockResolvedValue('file://mock-share-card.png');
jest.mock('react-native-view-shot', () => ({
  captureRef: (...args: unknown[]) => mockCaptureRef(...args),
}));

const mockSetStringAsync = jest.fn().mockResolvedValue(undefined);
jest.mock('expo-clipboard', () => ({
  setStringAsync: (...args: unknown[]) => mockSetStringAsync(...args),
}));

const READING: CharacterAnalysisResult = {
  module: 'character_analysis',
  archetype_card: {
    title: 'Character Archetype',
    badge_tag: 'Analytical Visionary',
    summary: 'You read as someone people trust instantly.',
  },
  facial_structure_card: {
    title: 'Facial Structure',
    shape_tag: 'Oval',
    description: 'Balanced proportions with a defined jawline.',
  },
  spirit_animal_card: {
    title: 'Spirit Animal Match',
    animal: 'Wolf',
    description: 'A steady gaze and defined jawline read as sharp awareness.',
  },
  traits_card: {
    title: 'Facial Trait Analysis',
    metadata_badges: [{ key: 'Eye Energy', value: 'Direct & Piercing' }],
    strength_pills: ['Strategic Thinking'],
    growth_pills: ['Pacing Energy'],
  },
  celebrity_match_card: {
    title: 'Celebrity Archetype Match',
    match_name: 'A Public Figure',
    match_description: 'Same calm-under-pressure register.',
  },
};
const RELATIONSHIP_READING: RelationshipHarmonyResult = {
  module: 'relationship_harmony',
  vibe_card: {
    title: 'Relational Archetype',
    badge_tag: 'Grounded & Playful Harmonizer',
    summary: 'Two styles that meet in the middle.',
  },
  chemistry_score_card: {
    title: 'Chemistry & Synergy Score',
    overall_score: 91,
    breakdown_metrics: [
      { label: 'Empathy', score: 88, icon: 'heart' },
      { label: 'Communication', score: 84, icon: 'chat' },
      { label: 'Attachment', score: 79, icon: 'shield' },
      { label: 'Energy Match', score: 95, icon: 'zap' },
    ],
  },
  dynamics_card: {
    title: 'Relationship Dynamics',
    best_chemistry_pills: ['Grounded Calmness'],
    vibes_to_avoid_pills: ['Superficial Drama'],
  },
  guidance_card: {
    title: 'Harmony Recommendations',
    checklist_items: [{ headline: 'Direct Communication', description: 'Say it early and plainly.' }],
  },
};

const PHOTOS = ['base64-calm', 'base64-bright'];

describe('RevealScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'reveal', reading: READING, images: PHOTOS });
    mockCaptureRef.mockClear();
    mockSetStringAsync.mockClear();
    jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction });
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the captured photos, badge tag, and detail cards for the module', () => {
    render(<RevealScreen />);
    // The badge tag and summary also appear in the off-screen ShareCard used
    // for react-native-view-shot capture, so there are legitimately two.
    expect(screen.getAllByText('Analytical Visionary').length).toBeGreaterThan(0);
    expect(screen.getByTestId('reveal-photos')).toBeTruthy();
    expect(screen.getByTestId('traits-card')).toBeTruthy();
    expect(screen.getByTestId('celebrity-card')).toBeTruthy();
  });

  it('renders the facial structure and spirit animal cards, grounded in physical features', () => {
    render(<RevealScreen />);
    expect(screen.getByTestId('facial-structure-card')).toBeTruthy();
    expect(screen.getByText('Oval')).toBeTruthy();
    expect(screen.getByTestId('spirit-animal-card')).toBeTruthy();
    expect(screen.getByText('Wolf')).toBeTruthy();
  });

  it('does not render a score card for character_analysis — only relationship_harmony kept one', () => {
    render(<RevealScreen />);
    expect(screen.queryByTestId('score-card')).toBeNull();
  });

  it('renders the overall score and every sub-score for relationship_harmony', () => {
    useAppStore.setState({ reading: RELATIONSHIP_READING });
    render(<RevealScreen />);
    expect(screen.getByTestId('score-card')).toBeTruthy();
    expect(screen.getByText('Empathy')).toBeTruthy();
    // The overall score also appears in the off-screen ShareCard, so there
    // are legitimately two — same reasoning as the badge tag check above.
    expect(screen.getAllByText('91').length).toBeGreaterThan(0);
  });

  it('renders growth edges without alarming framing', () => {
    render(<RevealScreen />);
    expect(screen.getByText('Pacing Energy')).toBeTruthy();
    expect(screen.getByText('Strategic Thinking')).toBeTruthy();
  });

  it('always renders the entertainment disclaimer', () => {
    render(<RevealScreen />);
    expect(screen.getAllByText(/entertainment purposes only/i).length).toBeGreaterThan(0);
  });

  it('prompts for a rating after each completed reading instead of dropping straight back home', () => {
    render(<RevealScreen />);
    fireEvent.press(screen.getByText('Done'));
    expect(useAppStore.getState().screen).toBe('review');
  });

  it('purges the captured photos once the user leaves the reading behind', () => {
    const { unmount } = render(<RevealScreen />);
    expect(useAppStore.getState().images).toEqual(PHOTOS);

    unmount();
    expect(useAppStore.getState().images).toEqual([]);
  });

  it('opens a share options menu instead of sharing immediately', () => {
    render(<RevealScreen />);
    fireEvent.press(screen.getByTestId('share-reading-button'));

    expect(screen.getByTestId('share-options-modal')).toBeTruthy();
    expect(screen.getByTestId('share-option-image')).toBeTruthy();
    expect(screen.getByTestId('share-option-text')).toBeTruthy();
    expect(screen.getByTestId('share-option-copy')).toBeTruthy();
    expect(Share.share).not.toHaveBeenCalled();
  });

  it('offers the include-photo toggle and a per-section picklist in the card builder', () => {
    render(<RevealScreen />);
    fireEvent.press(screen.getByTestId('share-reading-button'));
    fireEvent.press(screen.getByTestId('share-option-image'));

    expect(screen.getByTestId('share-include-photo-checkbox')).toBeTruthy();
    expect(screen.getByTestId('share-section-archetype')).toBeTruthy();
    expect(screen.getByTestId('share-section-celebrity')).toBeTruthy();
  });

  it('captures the share card and opens the native share sheet once the card is built', async () => {
    render(<RevealScreen />);
    fireEvent.press(screen.getByTestId('share-reading-button'));
    fireEvent.press(screen.getByTestId('share-option-image'));
    fireEvent.press(screen.getByTestId('share-builder-create'));

    await waitFor(() => expect(mockCaptureRef).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(Share.share).toHaveBeenCalledWith({ url: 'file://mock-share-card.png' })
    );
  });

  it('excludes an unchecked section from the off-screen share card', async () => {
    render(<RevealScreen />);
    // Present twice pre-uncheck: once in the visible celebrity-card, once in
    // the off-screen ShareCard (same reasoning as the badge-tag/score checks
    // above — both render the reading simultaneously).
    expect(screen.getAllByText(/A Public Figure/).length).toBe(2);

    fireEvent.press(screen.getByTestId('share-reading-button'));
    fireEvent.press(screen.getByTestId('share-option-image'));
    fireEvent.press(screen.getByTestId('share-section-celebrity'));

    expect(screen.getAllByText(/A Public Figure/).length).toBe(1);
  });

  it('shares a text summary from the quick-message option', async () => {
    render(<RevealScreen />);
    fireEvent.press(screen.getByTestId('share-reading-button'));
    fireEvent.press(screen.getByTestId('share-option-text'));

    await waitFor(() =>
      expect(Share.share).toHaveBeenCalledWith({ message: expect.stringContaining('Analytical Visionary') })
    );
  });

  it('copies a text summary to the clipboard from the copy option', async () => {
    render(<RevealScreen />);
    fireEvent.press(screen.getByTestId('share-reading-button'));
    fireEvent.press(screen.getByTestId('share-option-copy'));

    await waitFor(() =>
      expect(mockSetStringAsync).toHaveBeenCalledWith(expect.stringContaining('Analytical Visionary'))
    );
  });
});
