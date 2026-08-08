import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { PIERCING_LOCATION_IDS } from '../../content/piercingLocations';
import { PIERCING_LOCATION_PHOTOS } from '../../content/piercingLocationPhotos';
import PiercingVisual from './PiercingVisual';

describe('PiercingVisual', () => {
  it.each(PIERCING_LOCATION_IDS)('renders without crashing for %s', (locationId) => {
    render(<PiercingVisual locationId={locationId} testID={`visual-${locationId}`} />);
    expect(screen.getByTestId(`visual-${locationId}`)).toBeTruthy();
  });

  it('renders a real Image for a location with a licensed photo', () => {
    render(<PiercingVisual locationId="septum" testID="visual-septum" />);
    const node = screen.getByTestId('visual-septum');
    expect(node.props.source).toBe(PIERCING_LOCATION_PHOTOS.septum);
  });

  it('falls back to the vector PiercingDiagram for a location with no photo', () => {
    render(<PiercingVisual locationId="rook" testID="visual-rook" />);
    const node = screen.getByTestId('visual-rook');
    expect(node.props.source).toBeUndefined();
  });
});
