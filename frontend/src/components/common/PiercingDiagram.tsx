import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { PiercingCategory, PiercingLocationId } from '../../content/piercingLocations';
import { Theme } from '../../ui/theme';

// Vector-style line-art diagrams for the Piercing Reference page (see
// PiercingReferenceScreen.tsx). Still no react-native-svg and no photos —
// every shape is a plain styled View (border/borderRadius/rotation tricks,
// the same technique as CaptureScreen's `guideRing`), just composed with
// more layers than the first pass: a soft backdrop glow, a two-ring/lobe
// ear silhouette, a face with eyebrow/eye/nose/lip detail, and a torso with
// a shoulder-to-hip taper, so each shape reads as its body part rather than
// two circles or a rounded rectangle. This is genuinely still code-drawn,
// NOT an image file — see frontend/assets/piercing-diagrams/ (currently
// empty) for where real exported artwork would go if/when it's produced;
// that path needs either a new dependency or externally-sourced art, both
// out of scope for a runtime-only pass.
//
// Each category shares one base silhouette; the marker (a halo + solid
// dot, or a halo + square for dermal anchors) moves per location via
// LOCATION_VISUALS below. Positions are stylized approximations of real
// anatomy for illustration purposes only — not a medically precise map
// (matches the "general estimate, not medical advice" framing already on
// the reference page).

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
  lobe: { category: 'ear', marker: { left: 44, top: 81 } },
  upperLobe: { category: 'ear', marker: { left: 33, top: 69 } },
  helix: { category: 'ear', marker: { left: 63, top: 12 } },
  forwardHelix: { category: 'ear', marker: { left: 24, top: 20 } },
  tragus: { category: 'ear', marker: { left: 20, top: 52 } },
  antiTragus: { category: 'ear', marker: { left: 24, top: 68 } },
  rook: { category: 'ear', marker: { left: 54, top: 24 } },
  daith: { category: 'ear', marker: { left: 40, top: 46 } },
  conch: { category: 'ear', marker: { left: 50, top: 46 } },
  snug: { category: 'ear', marker: { left: 66, top: 52 } },
  industrial: {
    category: 'ear',
    marker: { left: 28, top: 18 },
    secondaryMarker: { left: 66, top: 16 },
  },
  orbital: {
    category: 'ear',
    marker: { left: 54, top: 28 },
    secondaryMarker: { left: 44, top: 78 },
  },
  flat: { category: 'ear', marker: { left: 46, top: 24 } },
  auricle: { category: 'ear', marker: { left: 58, top: 14 } },
  eyebrow: { category: 'face', marker: { left: 30, top: 24 } },
  bridge: { category: 'face', marker: { left: 50, top: 33 } },
  nostril: { category: 'face', marker: { left: 41, top: 54 } },
  highNostril: { category: 'face', marker: { left: 41, top: 46 } },
  septum: { category: 'face', marker: { left: 50, top: 58 } },
  philtrumMedusa: { category: 'face', marker: { left: 50, top: 64 } },
  labret: { category: 'face', marker: { left: 50, top: 79 } },
  monroe: { category: 'face', marker: { left: 61, top: 71 } },
  tongue: { category: 'face', marker: { left: 50, top: 86 } },
  cheekDimple: { category: 'face', marker: { left: 70, top: 66 } },
  nefertiti: {
    category: 'face',
    marker: { left: 50, top: 36 },
    secondaryMarker: { left: 50, top: 62 },
  },
  rhino: { category: 'face', marker: { left: 50, top: 57 } },
  nasallang: {
    category: 'face',
    marker: { left: 41, top: 54 },
    secondaryMarker: { left: 59, top: 54 },
  },
  verticalLabret: { category: 'face', marker: { left: 50, top: 82 } },
  antiEyebrow: { category: 'face', marker: { left: 74, top: 46 } },
  navel: { category: 'body', marker: { left: 50, top: 68 } },
  nipple: { category: 'body', marker: { left: 31, top: 34 } },
  surface: {
    category: 'body',
    marker: { left: 33, top: 18 },
    secondaryMarker: { left: 67, top: 18 },
  },
  dermal: { category: 'body', marker: { left: 74, top: 44 }, shape: 'square' },
  nape: { category: 'body', marker: { left: 50, top: 14 } },
  hip: { category: 'body', marker: { left: 78, top: 58 } },
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
      <View
        style={[
          styles.backdropGlow,
          { width: size * 0.9, height: size * 0.9, borderRadius: size * 0.45, left: size * 0.05, top: size * 0.05 },
        ]}
      />
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
    // Real-ear proportions, not a ring: the helix is an open "C" (the ear
    // has no cartilage where it roots onto the head, at front-left here),
    // the antihelix is a smaller, differently-angled open "C" nested inside
    // it (the Y-shaped ridge that shelters the concha bowl), the tragus is
    // a small forward-pointing flap guarding the canal, and the lobe is
    // soft tissue that tapers narrow-at-top/round-at-bottom, not an oval
    // blob. The open-ring look comes from a circular View with one side's
    // border removed (borderLeftWidth: 0) then rotated so the gap lands at
    // the ear's actual root instead of literally due-west.
    const outerHelixSize = size * 0.72;
    const antihelixSize = size * 0.4;
    return (
      <>
        {/* Outer helix rim — open toward the head at front-left */}
        <View
          style={[
            styles.earOuterRing,
            {
              width: outerHelixSize,
              height: outerHelixSize,
              borderRadius: outerHelixSize / 2,
              left: size * 0.15,
              top: size * 0.06,
              transform: [{ rotate: '-18deg' }],
            },
          ]}
        />
        {/* Chrome highlight catching the upper-outer curve */}
        <View
          style={[
            styles.earHighlight,
            {
              width: outerHelixSize * 0.62,
              height: outerHelixSize * 0.62,
              borderRadius: (outerHelixSize * 0.62) / 2,
              left: size * 0.22,
              top: size * 0.09,
              transform: [{ rotate: '-38deg' }],
            },
          ]}
        />
        {/* Concha bowl shadow, cradled by the antihelix */}
        <View
          style={[
            styles.earConcha,
            {
              width: size * 0.22,
              height: size * 0.22,
              borderRadius: size * 0.11,
              left: size * 0.38,
              top: size * 0.38,
            },
          ]}
        />
        {/* Antihelix — a smaller open "C" nested inside, angled apart from
            the outer rim so the gap between them reads as the ear canal */}
        <View
          style={[
            styles.earInnerRing,
            {
              width: antihelixSize,
              height: antihelixSize,
              borderRadius: antihelixSize / 2,
              left: size * 0.32,
              top: size * 0.22,
              transform: [{ rotate: '-32deg' }],
            },
          ]}
        />
        {/* Tragus, guarding the canal from the front */}
        <View
          style={[
            styles.earTragus,
            {
              width: size * 0.16,
              height: size * 0.19,
              left: size * 0.12,
              top: size * 0.44,
              borderTopLeftRadius: size * 0.09,
              borderBottomLeftRadius: size * 0.09,
              borderTopRightRadius: size * 0.03,
              borderBottomRightRadius: size * 0.03,
              transform: [{ rotate: '12deg' }],
            },
          ]}
        />
        {/* Antitragus, the small bump opposite the tragus, just above the lobe */}
        <View
          style={[
            styles.earAntiTragus,
            {
              width: size * 0.12,
              height: size * 0.12,
              borderRadius: size * 0.06,
              left: size * 0.17,
              top: size * 0.62,
            },
          ]}
        />
        {/* Lobe — narrow where it meets the antitragus, rounding out below */}
        <View
          style={[
            styles.earLobe,
            {
              width: size * 0.38,
              height: size * 0.3,
              left: size * 0.25,
              top: size * 0.63,
              borderTopLeftRadius: size * 0.08,
              borderTopRightRadius: size * 0.14,
              borderBottomLeftRadius: size * 0.19,
              borderBottomRightRadius: size * 0.19,
            },
          ]}
        />
      </>
    );
  }

  if (category === 'face') {
    return (
      <>
        <View
          style={[
            styles.faceOutline,
            {
              width: size * 0.66,
              height: size * 0.84,
              left: size * 0.17,
              top: size * 0.08,
              borderTopLeftRadius: size * 0.33,
              borderTopRightRadius: size * 0.33,
              borderBottomLeftRadius: size * 0.24,
              borderBottomRightRadius: size * 0.24,
            },
          ]}
        />
        <View style={[styles.faceBrow, { left: size * 0.24, top: size * 0.28, width: size * 0.16 }]} />
        <View style={[styles.faceBrow, { left: size * 0.6, top: size * 0.28, width: size * 0.16 }]} />
        <View style={[styles.faceEye, { left: size * 0.28, top: size * 0.34 }]} />
        <View style={[styles.faceEye, { left: size * 0.64, top: size * 0.34 }]} />
        <View style={[styles.faceNoseBridge, { left: size * 0.485, top: size * 0.38, height: size * 0.16 }]} />
        <View style={[styles.faceNostril, { left: size * 0.4, top: size * 0.52 }]} />
        <View style={[styles.faceNostril, { left: size * 0.55, top: size * 0.52 }]} />
        <View
          style={[styles.faceLipUpper, { width: size * 0.22, left: size * 0.39, top: size * 0.66, borderRadius: size * 0.03 }]}
        />
        <View
          style={[styles.faceLipLower, { width: size * 0.18, left: size * 0.41, top: size * 0.7, borderRadius: size * 0.04 }]}
        />
      </>
    );
  }

  return (
    <>
      <View
        style={[
          styles.torsoOutline,
          {
            width: size * 0.58,
            height: size * 0.76,
            left: size * 0.21,
            top: size * 0.1,
            borderTopLeftRadius: size * 0.16,
            borderTopRightRadius: size * 0.16,
            borderBottomLeftRadius: size * 0.22,
            borderBottomRightRadius: size * 0.22,
          },
        ]}
      />
      <View style={[styles.torsoCollarLine, { left: size * 0.28, top: size * 0.22, width: size * 0.44 }]} />
      <View style={[styles.torsoNippleRef, { left: size * 0.31, top: size * 0.34 }]} />
      <View style={[styles.torsoNippleRef, { left: size * 0.65, top: size * 0.34 }]} />
      <View
        style={[
          styles.torsoNavel,
          { left: size * 0.46, top: size * 0.63, width: size * 0.08, height: size * 0.1, borderRadius: size * 0.04 },
        ]}
      />
    </>
  );
}

function Marker({ point, size, shape = 'dot' }: { point: MarkerPoint; size: number; shape?: 'dot' | 'square' }) {
  const dotSize = size * 0.12;
  const haloSize = size * 0.24;
  return (
    <>
      <View
        style={[
          styles.markerHalo,
          shape === 'square' ? styles.markerHaloSquare : styles.markerHaloDot,
          {
            width: haloSize,
            height: haloSize,
            borderRadius: shape === 'square' ? haloSize * 0.25 : haloSize / 2,
            left: (point.left / 100) * size - haloSize / 2,
            top: (point.top / 100) * size - haloSize / 2,
          },
        ]}
      />
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
    </>
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
  backdropGlow: {
    position: 'absolute',
    backgroundColor: Theme.colors.accent.electricPurple,
    opacity: 0.05,
  },
  earOuterRing: {
    position: 'absolute',
    borderWidth: 2.25,
    borderLeftWidth: 0,
    borderColor: Theme.colors.accent.chromeSteel,
  },
  earHighlight: {
    position: 'absolute',
    borderWidth: 1.5,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderColor: Theme.colors.text.primary,
    opacity: 0.3,
  },
  earConcha: {
    position: 'absolute',
    backgroundColor: Theme.colors.accent.chromeSteel,
    opacity: 0.08,
  },
  earInnerRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderLeftWidth: 0,
    borderColor: Theme.colors.accent.chromeSteel,
    opacity: 0.65,
  },
  earTragus: {
    position: 'absolute',
    borderWidth: 1.5,
    borderRightWidth: 0,
    borderColor: Theme.colors.accent.chromeSteel,
    opacity: 0.6,
  },
  earAntiTragus: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: Theme.colors.accent.chromeSteel,
    opacity: 0.5,
  },
  earLobe: {
    position: 'absolute',
    borderWidth: 1.75,
    borderColor: Theme.colors.accent.chromeSteel,
    opacity: 0.65,
  },
  faceOutline: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: Theme.colors.accent.chromeSteel,
  },
  faceBrow: {
    position: 'absolute',
    height: 1.5,
    borderRadius: 1,
    backgroundColor: Theme.colors.accent.chromeSteel,
    opacity: 0.5,
    transform: [{ rotate: '-4deg' }],
  },
  faceEye: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Theme.colors.accent.chromeSteel,
    opacity: 0.4,
  },
  faceNoseBridge: {
    position: 'absolute',
    width: 1.5,
    backgroundColor: Theme.colors.accent.chromeSteel,
    opacity: 0.45,
  },
  faceNostril: {
    position: 'absolute',
    width: 5,
    height: 4,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Theme.colors.accent.chromeSteel,
    opacity: 0.5,
  },
  faceLipUpper: {
    position: 'absolute',
    height: 3,
    borderWidth: 1.5,
    borderColor: Theme.colors.accent.chromeSteel,
    opacity: 0.55,
  },
  faceLipLower: {
    position: 'absolute',
    height: 4,
    borderWidth: 1.5,
    borderColor: Theme.colors.accent.chromeSteel,
    opacity: 0.55,
  },
  torsoOutline: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: Theme.colors.accent.chromeSteel,
  },
  torsoCollarLine: {
    position: 'absolute',
    height: 1.5,
    borderRadius: 1,
    backgroundColor: Theme.colors.accent.chromeSteel,
    opacity: 0.35,
  },
  torsoNippleRef: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Theme.colors.accent.chromeSteel,
    opacity: 0.3,
  },
  torsoNavel: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: Theme.colors.accent.chromeSteel,
    opacity: 0.5,
  },
  markerHalo: {
    position: 'absolute',
    opacity: 0.35,
  },
  markerHaloDot: {
    backgroundColor: Theme.colors.accent.crimsonPrimary,
  },
  markerHaloSquare: {
    backgroundColor: Theme.colors.accent.iridescentShimmer,
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
