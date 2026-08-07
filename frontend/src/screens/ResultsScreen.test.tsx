import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import ResultsScreen from './ResultsScreen';
import { CareerPathResult, CharacterAnalysisResult } from '../api/types';
import { useAppStore } from '../state/useAppStore';

const CHARACTER_READING: CharacterAnalysisResult = {
  module: 'character_analysis',
  archetype_card: {
    title: 'Character Archetype',
    badge_tag: 'Analytical Visionary',
    summary: 'You read as someone people trust instantly.',
  },
  facial_structure_card: { title: 'Facial Structure', shape_tag: 'Oval', description: 'Balanced proportions.' },
  spirit_animal_card: { title: 'Spirit Animal Match', animal: 'Wolf', description: 'A steady gaze.' },
  traits_card: {
    title: 'Facial Trait Analysis',
    metadata_badges: [{ key: 'Eye Energy', value: 'Direct & Piercing' }],
    strength_pills: ['Strategic Thinking'],
    growth_pills: ['Pacing Energy'],
  },
  celebrity_match_card: {
    title: 'Celebrity Archetype Match',
    match_name: 'A Public Figure',
    match_description: 'Same register.',
  },
};

const CAREER_READING: CareerPathResult = {
  module: 'career_path',
  work_archetype_card: {
    title: 'Career Archetype',
    badge_tag: 'Strategic Innovator',
    summary: 'You settle fastest in long-range rooms.',
  },
  domains_card: { title: 'Recommended Industries', top_industry_pills: ['Product Design'] },
  recommendations_card: {
    title: 'Ideal Role Matches',
    checklist_items: [{ headline: 'Systems Architect', description: 'End-to-end ownership.' }],
  },
};

const HISTORY = [
  { id: 'reading-2', reading: CAREER_READING, completedAt: 1_700_000_100_000 },
  { id: 'reading-1', reading: CHARACTER_READING, completedAt: 1_700_000_000_000 },
];

describe('ResultsScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'results', history: [], reading: null });
  });

  it('shows an empty state when there are no readings yet', () => {
    render(<ResultsScreen />);
    expect(screen.getByText('No Readings Yet')).toBeTruthy();
  });

  it('routes Start Analysis through the Analyze hub', () => {
    render(<ResultsScreen />);
    fireEvent.press(screen.getByText('Start Analysis'));
    expect(useAppStore.getState().screen).toBe('analyze');
  });

  it('lists a row per logged reading instead of the empty state', () => {
    useAppStore.setState({ history: HISTORY });
    render(<ResultsScreen />);

    expect(screen.queryByText('No Readings Yet')).toBeNull();
    expect(screen.getByTestId('history-entry-reading-1')).toBeTruthy();
    expect(screen.getByTestId('history-entry-reading-2')).toBeTruthy();
  });

  // Each module's row reads from its own badge card via readingBadgeCard —
  // a module whose branch is missed there renders a blank row, not an error.
  it('summarises each row with that module’s own badge card', () => {
    useAppStore.setState({ history: HISTORY });
    render(<ResultsScreen />);

    expect(screen.getByText('Analytical Visionary')).toBeTruthy();
    expect(screen.getByText('You read as someone people trust instantly.')).toBeTruthy();
    expect(screen.getByText('Strategic Innovator')).toBeTruthy();
    expect(screen.getByText('You settle fastest in long-range rooms.')).toBeTruthy();
  });

  it('reopens the tapped reading on the reveal screen', () => {
    useAppStore.setState({ history: HISTORY });
    render(<ResultsScreen />);

    fireEvent.press(screen.getByTestId('history-entry-reading-1'));

    expect(useAppStore.getState().reading).toEqual(CHARACTER_READING);
    expect(useAppStore.getState().screen).toBe('reveal');
  });
});
