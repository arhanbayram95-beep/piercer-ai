import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { QUIZ_QUESTIONS } from '../content/personalityQuiz';
import { useAppStore } from '../state/useAppStore';
import PersonalityQuizScreen from './PersonalityQuizScreen';

// Answers every question as the given archetype, one step at a time —
// pressing the option then Next, mirroring how a real user moves through
// the one-question-per-screen flow.
function answerAllAs(archetype: string) {
  for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
    const question = QUIZ_QUESTIONS[i];
    fireEvent.press(screen.getByTestId(`quiz-option-${question.id}-${archetype}`));
    fireEvent.press(screen.getByTestId('quiz-next-button'));
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

  it('shows one question at a time with a progress indicator', () => {
    render(<PersonalityQuizScreen />);
    expect(screen.getByTestId('quiz-progress-text').props.children).toBe('Question 1 of 6');
    // Only the first question's options are on screen.
    expect(screen.getByTestId(`quiz-option-${QUIZ_QUESTIONS[0].id}-minimalist`)).toBeTruthy();
    expect(screen.queryByTestId(`quiz-option-${QUIZ_QUESTIONS[1].id}-minimalist`)).toBeNull();
  });

  it('disables Next until the current question is answered', () => {
    render(<PersonalityQuizScreen />);
    expect(screen.getByTestId('quiz-next-button').props.accessibilityState.disabled).toBe(true);

    fireEvent.press(screen.getByTestId(`quiz-option-${QUIZ_QUESTIONS[0].id}-minimalist`));
    expect(screen.getByTestId('quiz-next-button').props.accessibilityState.disabled).toBe(false);
  });

  it('advances to the next question on Next, and the Back link is hidden on the first question', () => {
    render(<PersonalityQuizScreen />);
    expect(screen.queryByTestId('quiz-back-button')).toBeNull();

    fireEvent.press(screen.getByTestId(`quiz-option-${QUIZ_QUESTIONS[0].id}-minimalist`));
    fireEvent.press(screen.getByTestId('quiz-next-button'));

    expect(screen.getByTestId('quiz-progress-text').props.children).toBe('Question 2 of 6');
    expect(screen.getByTestId(`quiz-option-${QUIZ_QUESTIONS[1].id}-minimalist`)).toBeTruthy();
    expect(screen.getByTestId('quiz-back-button')).toBeTruthy();
  });

  it('lets the user revisit a previous answer via Back without losing it', () => {
    render(<PersonalityQuizScreen />);
    fireEvent.press(screen.getByTestId(`quiz-option-${QUIZ_QUESTIONS[0].id}-rebel`));
    fireEvent.press(screen.getByTestId('quiz-next-button'));

    fireEvent.press(screen.getByTestId('quiz-back-button'));

    expect(screen.getByTestId('quiz-progress-text').props.children).toBe('Question 1 of 6');
    expect(screen.getByTestId(`quiz-option-${QUIZ_QUESTIONS[0].id}-rebel`).props.accessibilityState.selected).toBe(
      true
    );
  });

  it('shows the matching archetype result after the last question', () => {
    render(<PersonalityQuizScreen />);
    answerAllAs('minimalist');

    expect(screen.getByTestId('quiz-result-name').props.children).toBe('The Minimalist');
  });

  it('pre-selects the recommended location and jewelry, then routes to Capture on Try It On', () => {
    render(<PersonalityQuizScreen />);
    answerAllAs('rebel');
    fireEvent.press(screen.getByTestId('quiz-try-on-button'));

    expect(useAppStore.getState().selectedLocation).toBe('septum');
    expect(useAppStore.getState().selectedJewelryType).toBe('septum');
    expect(useAppStore.getState().selectedFinish).toBe('blackSteel');
    expect(useAppStore.getState().screen).toBe('capture');
  });

  it('displays each recommended location paired with its own compatible jewelry type', () => {
    render(<PersonalityQuizScreen />);
    answerAllAs('rebel');

    // Regression coverage for the content bug where Rebel's display text
    // paired Industrial and Snug with "septum" jewelry, which neither
    // location supports.
    expect(screen.getByText('Septum · Septum')).toBeTruthy();
    expect(screen.getByText('Industrial · Industrial')).toBeTruthy();
    expect(screen.getByText('Snug · Barbells')).toBeTruthy();
  });

  it('lets the user retake the quiz from the result view, back at question 1', () => {
    render(<PersonalityQuizScreen />);
    answerAllAs('romantic');
    expect(screen.getByTestId('quiz-result-name')).toBeTruthy();

    fireEvent.press(screen.getByTestId('quiz-retake-button'));

    expect(screen.getByTestId('quiz-progress-text').props.children).toBe('Question 1 of 6');
    expect(screen.getByTestId('quiz-next-button').props.accessibilityState.disabled).toBe(true);
  });

  it('lets the user close back out', () => {
    render(<PersonalityQuizScreen />);
    fireEvent.press(screen.getByTestId('quiz-close-button'));
    expect(useAppStore.getState().screen).toBe('match');
  });
});
