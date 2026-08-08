import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { PiercingLocationId } from '../../content/piercingLocations';
import { PIERCING_LOCATION_PHOTOS } from '../../content/piercingLocationPhotos';
import { Theme } from '../../ui/theme';
import PiercingDiagram from './PiercingDiagram';

// Picks a real reference photo when one exists for the location
// (frontend/assets/piercing-diagrams/, see SOURCES.md for licensing —
// Pexels only, confirmed per-location), falling back to PiercingDiagram's
// vector illustration otherwise. PiercingReferenceScreen and
// PiercingDetailScreen both render locations through this instead of
// PiercingDiagram directly, so a location "getting" a real photo later is
// a one-line addition to piercingLocationPhotos.ts, not a screen change.
interface PiercingVisualProps {
  locationId: PiercingLocationId;
  size?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export default function PiercingVisual({ locationId, size = 96, style, testID }: PiercingVisualProps) {
  const photo = PIERCING_LOCATION_PHOTOS[locationId];

  if (photo) {
    return (
      <Image
        source={photo}
        style={[styles.photo, { width: size, height: size, borderRadius: Theme.radius.md }, style as StyleProp<ImageStyle>]}
        resizeMode="cover"
        testID={testID}
        accessibilityIgnoresInvertColors
      />
    );
  }

  return <PiercingDiagram locationId={locationId} size={size} style={style} testID={testID} />;
}

const styles = StyleSheet.create({
  photo: {
    backgroundColor: Theme.colors.surface.glassBackground,
  },
});
