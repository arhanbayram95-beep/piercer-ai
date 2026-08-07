import { render, screen } from '@testing-library/react-native';
import React from 'react';
import AppLogo from './AppLogo';

describe('AppLogo', () => {
  it('is icon-only by default', () => {
    render(<AppLogo />);
    expect(screen.queryByText('piercer.ai')).toBeNull();
  });

  it('shows the wordmark when explicitly opted into', () => {
    render(<AppLogo showWordmark />);
    expect(screen.getByText('piercer.ai')).toBeTruthy();
  });
});
