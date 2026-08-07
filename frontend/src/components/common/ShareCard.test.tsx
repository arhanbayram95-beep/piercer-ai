import { render, screen } from '@testing-library/react-native';
import React from 'react';
import ShareCard from './ShareCard';
import { ShareableSection } from '../../api/types';

const SECTIONS: ShareableSection[] = [
  { id: 'work', title: 'Career Archetype', body: 'Strategic Innovator — You read as someone people trust instantly.' },
  { id: 'domains', title: 'Recommended Industries', body: 'Engineering & R&D' },
];

describe('ShareCard', () => {
  it('renders every selected section', () => {
    render(<ShareCard sections={SECTIONS} />);
    expect(screen.getByText('Career Archetype')).toBeTruthy();
    expect(screen.getByText(/Strategic Innovator/)).toBeTruthy();
    expect(screen.getByText('Recommended Industries')).toBeTruthy();
  });

  it('renders only the sections it was given, not any others', () => {
    render(<ShareCard sections={[SECTIONS[0]]} />);
    expect(screen.getByText('Career Archetype')).toBeTruthy();
    expect(screen.queryByText('Recommended Industries')).toBeNull();
  });

  it('renders with no sections selected without erroring', () => {
    render(<ShareCard sections={[]} />);
    expect(screen.queryByTestId('share-card-photo')).toBeNull();
  });

  it('omits the photo by default', () => {
    render(<ShareCard sections={SECTIONS} />);
    expect(screen.queryByTestId('share-card-photo')).toBeNull();
  });

  it('includes the photo when explicitly opted into', () => {
    render(<ShareCard sections={SECTIONS} photo="ZmFrZS1iYXNlNjQ=" />);
    expect(screen.getByTestId('share-card-photo')).toBeTruthy();
  });
});
