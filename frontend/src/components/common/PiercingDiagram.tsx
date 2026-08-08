import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { PiercingCategory, PiercingLocationId } from '../../content/piercingLocations';
import { Theme } from '../../ui/theme';

// Lightweight vector-style line-art diagrams for the Piercing Reference page
// (see PiercingReferenceScreen.tsx). No react-native-svg, no photos — every
// shape here is a plain styled View (border/borderRadius/rotation tricks,
// the same technique as CaptureScreen's `guideRing`). Each category (ear /
// face / body) shares one base silhouette; the marker dot moves per
// location via MARKER_POSITIONS below. Positions are stylized
// approximations of real anatomy for illustration purposes only — not a
// medically precise map (matches the "general estimate, not medical advice"
// framing already on the reference page).

interface MarkerPoint {
  left: number; // percent, 0-100, within the diagram canvas
  top: number; // percent, 0-100
}

interface LocationVisual {
  category: PiercingCategory;
  marker: MarkerPoint;
  secondaryMarker?: MarkerPoint; // for two-point jewelry (industrial, surface, orbital)
  shape?: 'dot' | 'square'; // dermal anchors read as a small square, not a ring dot
}

const LOCATION_VISUALS: Record<PiercingLocationId, LocationVisual> = {
  lobe: { category: 'ear', marker: { left: 42, top: 84 } },
  upperLobe: { category: 'ear', marker: { left: 38, top: 72 } },
  helix: { category: 'ear', marker: { left: 68, top: 18 } },
  forwardHelix: { category: 'ear', marker: { left: 28, top: 16 } },
  tragus: { category: 'ear', marker: { left: 18, top: 54 } },
  antiTragus: { category: 'ear', marker: { left: 26, top: 66 } },
  rook: { category: 'ear', marker: { left: 54, top: 34 } },
  daith: { category: 'ear', marker: { left: 44, top: 46 } },
  conch: { category: 'ear', marker: { left: 48, top: 56 } },
  snug: { category: 'ear', marker: { left: 60, top: 44 } },
  industrial: {
    category: 'ear',
    marker: { left: 26, top: 20 },
    secondaryMarker: { left: 74, top: 26 },
  },
  orbital: {
    category: 'ear',
    marker: { left: 50, top: 38 },
    secondaryMarker: { left: 42, top: 78 },
  },
  eyebrow: { category: 'face', marker: { left: 32, top: 24 } },
  bridge: { category: 'face', marker: { left: 50, top: 32 } },
  nostril: { category: 'face', marker: { left: 40, top: 52 } },
  highNostril: { category: 'face', marker: { left: 40, top: 44 } },
  septum: { category: 'face', marker: { left: 50, top: 56 } },
  philtrumMedusa: { category: 'face', marker: { left: 50, top: 62 } },
  labret: { category: 'face', marker: { left: 50, top: 78 } },
  monroe: { category: 'face', marker: { left: 60, top: 70 } },
  tongue: { category: 'face', marker: { left: 50, top: 85 } },
  cheekDimple: { category: 'face', marker: { left: 70, top: 64 } },
  navel: { category: 'body', marker: { left: 50, top: 70 } },
  nipple: { category: 'body', marker: { left: 30, top: 32 } },
  surface: {
    category: 'body',
    marker: { left: 34, top: 20 },
    secondaryMarker: { left: 66, top: 20 },
  },
  dermal: { category: 'body', marker: { left: 72, top: 46 }, shape: 'square' },
};

interface PiercingDiagramProps {
  locationId: PiercingLocationId;
  size?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export default function PiercingDiagram({ locationId, size = 96, style, testID }: PiercingDiagramProps) {
  const visual = LOCATION_VISUALS[locationId];

  return (
    <View style={[styles.canvas, { width: size, height: size }, style]} testID={testID}>
      {renderBaseShape(visual.category, size)}
      <Marker point={visual.marker} size={size} shape={visual.shape} />
      {visual.secondaryMarker ? (
        <>
          <Marker point={visual.secondaryMarker} size={size} shape={visual.shape} />
          <ConnectorBar from={visual.marker} to={visual.secondaryMarker} size={size} />
        </>
      ) : null}
    </View>
  );
}

function renderBaseShape(category: PiercingCategory, size: number) {
  if (category === 'ear') {
    return (
      <>
        <View style={[styles.earOuterRing, { width: size * 0.8, height: size * 0.8, borderRadius: size * 0.4 }]} />
        <View
          style={[
            styles.earInnerRing,
            {
              width: size * 0.4,
              height: size * 0.4,
              borderRadius: size * 0.2,
              left: size * 0.32,
              top: size * 0.32,
            },
          ]}
        />
        <View
          style={[
            styles.earLobe,
            {
              width: size * 0.22,
              height: size * 0.22,
              borderRadius: size * 0.11,
              left: size * 0.3,
              top: size * 0.66,
            },
          ]}
        />
      </>
    );
  }

  if (category === 'face') {
    return (
      <>
        <View style={[styles.faceOutline, { width: size * 0.72, height: size * 0.86, borderRadius: size * 0.36 }]} />
        <View style={[styles.faceNose, { left: size * 0.47, top: size * 0.4, height: size * 0.2 }]} />
        <View
          style={[
            styles.faceMouth,
            { width: size * 0.24, left: size * 0.38, top: size * 0.68, borderRadius: size * 0.05 },
          ]}
        />
      </>
    );
  }

  return (
    <>
      <View
        style={[
          styles.torsoOutline,
          { width: size * 0.6, height: size * 0.82, borderRadius: size * 0.12, left: size * 0.2, top: size * 0.08 },
        ]}
      />
      <View style={[styles.torsoNavel, { left: size * 0.46, top: size * 0.64 }]} />
    </>
  );
}

function Marker({ point, size, shape = 'dot' }: { point: MarkerPoint; size: number; shape?: 'dot' | 'square' }) {
  const dotSize = size * 0.12;
  return (
    <View
      style={[
        styles.marker,
        shape === 'square' ? styles.markerSquare : styles.markerDot,
        {
          width: dotSize,
          height: dotSize,
          borderRadius: shape === 'square' ? dotSize * 0.2 : dotSize / 2,
          left: (point.left / 100) * size - dotSize / 2,
          top: (point.top / 100) * size - dotSize / 2,
        },
      ]}
    />
  );
}

function ConnectorBar({ from, to, size }: { from: MarkerPoint; to: MarkerPoint; size: number }) {
  const x1 = (from.left / 100) * size;
  const y1 = (from.top / 100) * size;
  const x2 = (to.left / 100) * size;
  const y2 = (to.top / 100) * size;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return (
    <View
      style={[
        styles.connectorBar,
        {
          width: length,
          left: x1,
          top: y1 - 1,
          transform: [{ rotate: `${angle}deg` }],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  canvas: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  earOuterRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: Theme.colors.accent.chromeSteel,
    top: '10%',
    left: '10%',
  },
  earInnerRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: Theme.colors.accent.chromeSteel,
    opacity: 0.7,
  },
  earLobe: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: Theme.colors.accent.chromeSteel,
    opacity: 0.5,
  },
  faceOutline: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: Theme.colors.accent.chromeSteel,
    top: '7%',
    left: '14%',
  },
  faceNose: {
    position: 'absolute',
    width: 1.5,
    backgroundColor: Theme.colors.accent.chromeSteel,
    opacity: 0.5,
  },
  faceMouth: {
    position: 'absolute',
    height: 3,
    borderWidth: 1.5,
    borderColor: Theme.colors.accent.chromeSteel,
    opacity: 0.6,
  },
  torsoOutline: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: Theme.colors.accent.chromeSteel,
  },
  torsoNavel: {
    position: 'absolute',
    width: 8,
    height: 10,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Theme.colors.accent.chromeSteel,
    opacity: 0.5,
  },
  marker: {
    position: 'absolute',
    borderWidth: 2,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  markerDot: {
    backgroundColor: Theme.colors.accent.crimsonPrimary,
    borderColor: Theme.colors.accent.iridescentShimmer,
    shadowColor: Theme.colors.accent.crimsonPrimary,
  },
  markerSquare: {
    backgroundColor: Theme.colors.accent.iridescentShimmer,
    borderColor: Theme.colors.accent.crimsonPrimary,
    shadowColor: Theme.colors.accent.iridescentShimmer,
  },
  connectorBar: {
    position: 'absolute',
    height: 2,
    backgroundColor: Theme.colors.accent.crimsonPrimary,
    opacity: 0.8,
    transformOrigin: 'left center',
  },
});
