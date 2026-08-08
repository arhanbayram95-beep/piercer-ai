import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { PIERCING_LOCATION_IDS } from '../../content/piercingLocations';
import PiercingDiagram from './PiercingDiagram';

describe('PiercingDiagram', () => {
  it.each(PIERCING_LOCATION_IDS)('renders without crashing for %s', (locationId) => {
    render(<PiercingDiagram locationId={locationId} testID={`diagram-${locationId}`} />);
    expect(screen.getByTestId(`diagram-${locationId}`)).toBeTruthy();
  });

  it('respects a custom size prop', () => {
    render(<PiercingDiagram locationId="lobe" size={64} testID="diagram-sized" />);
    const canvas = screen.getByTestId('diagram-sized');
    expect(canvas.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ width: 64, height: 64 })]),
    );
  });
});
