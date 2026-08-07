import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import AnimatedCheckbox from './AnimatedCheckbox';

describe('AnimatedCheckbox', () => {
  it('renders the label and reflects the checked state', () => {
    render(<AnimatedCheckbox checked label="Accept terms" onToggle={jest.fn()} testID="my-checkbox" />);
    expect(screen.getByText('Accept terms')).toBeTruthy();
    expect(screen.getByTestId('my-checkbox').props.accessibilityState.checked).toBe(true);
  });

  it('calls onToggle when pressed', () => {
    const onToggle = jest.fn();
    render(<AnimatedCheckbox checked={false} label="Accept terms" onToggle={onToggle} testID="my-checkbox" />);
    fireEvent.press(screen.getByTestId('my-checkbox'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
