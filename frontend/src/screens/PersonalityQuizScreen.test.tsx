import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { QUIZ_QUESTIONS } from '../content/personalityQuiz';
import { useAppStore } from '../state/useAppStore';
import PersonalityQuizScreen from './PersonalityQuizScreen';

function answerAllAs(archetype: string) {
  for (const question of QUIZ_QUESTIONS) {
    fireEvent.press(screen.getByTestId(`quiz-option-${question.id}-${archetype}`));
  }
}

describe('PersonalityQuizScreen', () => {
  beforeEach(() => {
    useAppStore.setState({
      screen: 'matchQuiz',
      previousScreen: 'match',
      selectedLocation: null,
      selectedJewelryType: 'hoops',
      selectedFinish: 'silver',
    });
  });

  it('disables Continue until every question is answered', () => {
    render(<PersonalityQuizScreen />);
    expect(screen.getByTestId('quiz-continue-button').props.accessibilityState.disabled).toBe(true);

    answerAllAs('minimalist');
    expect(screen.getByTestId('quiz-continue-button').props.accessibilityState.disabled).toBe(false);
  });

  it('shows the matching archetype result after answering', () => {
    render(<PersonalityQuizScreen />);
    answerAllAs('minimalist');
    fireEvent.press(screen.getByTestId('quiz-continue-button'));

    expect(screen.getByTestId('quiz-result-name').props.children).toBe('The Minimalist');
  });

  it('pre-selects the recommended location and jewelry, then routes to Capture on Try It On', () => {
    render(<PersonalityQuizScreen />);
    answerAllAs('rebel');
    fireEvent.press(screen.getByTestId('quiz-continue-button'));
    fireEvent.press(screen.getByTestId('quiz-try-on-button'));

    expect(useAppStore.getState().selectedLocation).toBe('septum');
    expect(useAppStore.getState().selectedJewelryType).toBe('septum');
    expect(useAppStore.getState().selectedFinish).toBe('blackSteel');
    expect(useAppStore.getState().screen).toBe('capture');
  });

  it('displays each recommended location paired with its own compatible jewelry type', () => {
    render(<PersonalityQuizScreen />);
    answerAllAs('rebel');
    fireEvent.press(screen.getByTestId('quiz-continue-button'));

    // Regression coverage for the content bug where Rebel's display text
    // paired Industrial and Snug with "septum" jewelry, which neither
    // location supports.
    expect(screen.getByText('Septum · Septum')).toBeTruthy();
    expect(screen.getByText('Industrial · Industrial')).toBeTruthy();
    expect(screen.getByText('Snug · Barbells')).toBeTruthy();
  });

  it('lets the user retake the quiz from the result view', () => {
    render(<PersonalityQuizScreen />);
    answerAllAs('romantic');
    fireEvent.press(screen.getByTestId('quiz-continue-button'));
    expect(screen.getByTestId('quiz-result-name')).toBeTruthy();

    fireEvent.press(screen.getByTestId('quiz-retake-button'));
    expect(screen.getByTestId('quiz-continue-button').props.accessibilityState.disabled).toBe(true);
  });

  it('lets the user close back out', () => {
    render(<PersonalityQuizScreen />);
    fireEvent.press(screen.getByTestId('quiz-close-button'));
    expect(useAppStore.getState().screen).toBe('match');
  });
});
