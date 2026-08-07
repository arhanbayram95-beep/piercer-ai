import { render, screen } from '@testing-library/react-native';
import React from 'react';
import DisclaimerFooter from './DisclaimerFooter';

describe('DisclaimerFooter', () => {
  it('always states the entertainment-only disclaimer', () => {
    render(<DisclaimerFooter />);
    expect(screen.getByText(/entertainment purposes only/i)).toBeTruthy();
  });
});
