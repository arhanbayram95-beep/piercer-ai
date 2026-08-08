import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { PiercingCategory, PiercingLocationId } from '../../content/piercingLocations';
import { Theme } from '../../ui/theme';

// Vector-style line-art diagrams for the Piercing Reference page (see
// PiercingReferenceScreen.tsx). Still no photos and no image files — see
// frontend/assets/piercing-diagrams/ (currently empty) for where real
// exported artwork would go if that's ever produced. Face and body are
// still plain styled Views (border/borderRadius/rotation tricks, the same
// technique as CaptureScreen's `guideRing`). The `ear` category is the one
// exception: real ear anatomy (the antihelix's Y-shaped fork, the helix's
// compound curvature) can't be faked convincingly with border tricks —
// borders/rotation hit their ceiling there, per direct user feedback on
// the first two passes — so `ear` is drawn with `react-native-svg`
// (bezier `Path`s in a 0-100 viewBox) instead. That viewBox range is
// deliberately the same 0-100 scale as MarkerPoint's percentages below, so
// a path coordinate and a marker coordinate mean the same position on the
// canvas — see PROJECT_SPEC.md's dependency list for why the package was
// added (2026-08-08, "ear illustration accuracy").
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
  lobe: { category: 'ear', marker: { left: 45, top: 85 } },
  upperLobe: { category: 'ear', marker: { left: 33, top: 74 } },
  helix: { category: 'ear', marker: { left: 85, top: 20 } },
  forwardHelix: { category: 'ear', marker: { left: 30, top: 16 } },
  tragus: { category: 'ear', marker: { left: 19, top: 52 } },
  antiTragus: { category: 'ear', marker: { left: 25, top: 70 } },
  rook: { category: 'ear', marker: { left: 63, top: 25 } },
  daith: { category: 'ear', marker: { left: 41, top: 45 } },
  conch: { category: 'ear', marker: { left: 46, top: 50 } },
  snug: { category: 'ear', marker: { left: 35, top: 60 } },
  industrial: {
    category: 'ear',
    marker: { left: 38, top: 14 },
    secondaryMarker: { left: 82, top: 12 },
  },
  orbital: {
    category: 'ear',
    marker: { left: 58, top: 25 },
    secondaryMarker: { left: 46, top: 88 },
  },
  flat: { category: 'ear', marker: { left: 62, top: 8 } },
  auricle: { category: 'ear', marker: { left: 50, top: 40 } },
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
    // Real ear anatomy, traced as bezier paths in a 0-100 viewBox (same
    // scale as LOCATION_VISUALS' marker percentages, so a path coordinate
    // and a marker coordinate are directly comparable):
    //  - HELIX_PATH: the outer rim's compound curve, open (not a closed
    //    ring) from where it roots at the temple, up over the top, down
    //    the back, into the upper lobe — an ear has no cartilage at the
    //    root, so a closed loop never reads as an ear.
    //  - ANTIHELIX_PATH: three subpaths sharing one join point — the
    //    superior and inferior crura forking up from (51,34), and the
    //    single ridge they merge into, curving down around the concha to
    //    the antitragus. This Y-fork is the anatomical detail borders
    //    couldn't produce.
    //  - CONCHA_PATH: the shadowed bowl the antihelix cradles.
    //  - TRAGUS_PATH / ANTITRAGUS_PATH: the two small flaps guarding the
    //    canal from front and back.
    //  - LOBE_PATH: soft tissue, filled (unlike the stroked cartilage
    //    paths above it) since it has no cartilage ridge of its own.
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100" style={styles.earSvg}>
        <Path
          d="M33,23 C28,12 48,4 64,6 C81,8 94,23 95,41 C96,59 89,76 76,86 C67,92 56,93 47,90"
          stroke={Theme.colors.accent.chromeSteel}
          strokeWidth={2.6}
          strokeLinecap="round"
          fill="none"
          opacity={0.9}
        />
        <Path
          d="M40,11 C50,6 61,5 71,9"
          stroke={Theme.colors.text.primary}
          strokeWidth={1.4}
          strokeLinecap="round"
          fill="none"
          opacity={0.3}
        />
        <Path
          d="M35,41 C31,50 33,61 44,66 C55,71 65,63 65,52 C65,41 56,33 46,33 C39,33 37,37 35,41 Z"
          fill={Theme.colors.accent.chromeSteel}
          opacity={0.1}
        />
        <Path
          d="M65,23 C59,25 54,28 51,34 M40,45 C44,41 47,37 51,34 M51,34 C45,43 40,54 38,62 C36,69 32,71 27,70"
          stroke={Theme.colors.accent.chromeSteel}
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={0.75}
        />
        <Path
          d="M13,47 C19,43 27,45 29,51 C30,56 25,60 18,59 C12,58 9,52 13,47 Z"
          stroke={Theme.colors.accent.chromeSteel}
          strokeWidth={1.6}
          fill={Theme.colors.accent.chromeSteel}
          fillOpacity={0.14}
          opacity={0.7}
        />
        <Path
          d="M21,65 C26,62 32,65 32,70 C32,75 26,77 21,74 C18,71 18,67 21,65 Z"
          stroke={Theme.colors.accent.chromeSteel}
          strokeWidth={1.4}
          fill="none"
          opacity={0.55}
        />
        <Path
          d="M33,71 C27,74 23,80 24,87 C25,94 35,98 47,97 C59,96 65,90 63,82 C61,75 51,71 41,70 C38,70 35,70 33,71 Z"
          stroke={Theme.colors.accent.chromeSteel}
          strokeWidth={1.9}
          fill={Theme.colors.accent.chromeSteel}
          fillOpacity={0.1}
          opacity={0.8}
        />
      </Svg>
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
  earSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
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
