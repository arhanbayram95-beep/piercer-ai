import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import AnalyzeScreen from './AnalyzeScreen';
import { useAppStore } from '../state/useAppStore';

describe('AnalyzeScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'analyze', selectedModule: 'three-expression' });
  });

  it('lets the user pick the 3-expression reading module', () => {
    render(<AnalyzeScreen />);
    fireEvent.press(screen.getByTestId('analyze-module-three-expression'));
    expect(useAppStore.getState().screen).toBe('capture');
    expect(useAppStore.getState().selectedModule).toBe('three-expression');
  });

  it('does not jump straight into capture on its own', () => {
    render(<AnalyzeScreen />);
    expect(useAppStore.getState().screen).toBe('analyze');
  });

  it('lets the user pick the relationship harmony module', () => {
    render(<AnalyzeScreen />);
    expect(screen.getByLabelText('Relationship Harmony Analyzer')).toBeTruthy();

    fireEvent.press(screen.getByTestId('analyze-module-relationship-harmony'));

    expect(useAppStore.getState().screen).toBe('capture');
    expect(useAppStore.getState().selectedModule).toBe('relationship-harmony');
  });

  it('lets the user pick the career match module', () => {
    render(<AnalyzeScreen />);
    expect(screen.getByLabelText('What Job Suits You')).toBeTruthy();

    fireEvent.press(screen.getByTestId('analyze-module-career-match'));

    expect(useAppStore.getState().screen).toBe('capture');
    expect(useAppStore.getState().selectedModule).toBe('career-match');
  });
});
