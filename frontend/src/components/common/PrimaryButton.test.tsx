import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import PrimaryButton from './PrimaryButton';

describe('PrimaryButton', () => {
  it('fires onPress when tapped', () => {
    const onPress = jest.fn();
    render(<PrimaryButton label="Continue" onPress={onPress} />);
    fireEvent.press(screen.getByText('Continue'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
