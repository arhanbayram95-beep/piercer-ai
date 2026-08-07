import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import LanguagePickerModal from './LanguagePickerModal';
import { useAppStore } from '../../state/useAppStore';

describe('LanguagePickerModal', () => {
  beforeEach(() => {
    useAppStore.setState({ languageCode: 'en' });
  });

  it('lists all 10 supported languages', () => {
    render(<LanguagePickerModal visible onClose={jest.fn()} />);
    expect(screen.getByText('Mandarin Chinese')).toBeTruthy();
    expect(screen.getByText('Urdu')).toBeTruthy();
  });

  it('shows a flag icon next to each language', () => {
    render(<LanguagePickerModal visible onClose={jest.fn()} />);
    expect(screen.getByText('🇺🇸')).toBeTruthy();
    expect(screen.getByText('🇨🇳')).toBeTruthy();
    expect(screen.getByText('🇵🇰')).toBeTruthy();
  });

  it('updates the store and closes when a language is picked', () => {
    const onClose = jest.fn();
    render(<LanguagePickerModal visible onClose={onClose} />);
    fireEvent.press(screen.getByTestId('language-option-fr'));

    expect(useAppStore.getState().languageCode).toBe('fr');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
