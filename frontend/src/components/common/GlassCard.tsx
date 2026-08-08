import React, { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Theme } from '../../ui/theme';

// "Flash sheet / metal tray" card treatment per DESIGN.md — chrome edge,
// faint two-tone panel fill (a stand-in for Theme.gradients.trayPanel: no
// expo-linear-gradient dependency is installed, so the vertical fade is
// faked with two stacked semi-transparent Views rather than a true
// gradient), and a neon top-edge accent line running Theme.gradients.neonEdge's
// two colors. `variant="module"` is for the small set of primary hub/nav
// cards (HomeHubScreen, MatchHubScreen module options) that want the accent
// line to read stronger; everything else defaults to the subtler treatment.
interface GlassCardProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  testID?: string;
  variant?: 'default' | 'module';
}

export default function GlassCard({ children, style, testID, variant = 'default' }: GlassCardProps) {
  return (
    <View style={[styles.card, variant === 'module' && styles.cardModule, style]} testID={testID}>
      <View style={styles.panelSheen} pointerEvents="none" />
      <View style={styles.topEdgeAccent} pointerEvents="none">
        <View style={[styles.topEdgeHalf, { backgroundColor: Theme.gradients.neonEdge[0] }]} />
        <View style={[styles.topEdgeHalf, { backgroundColor: Theme.gradients.neonEdge[1] }]} />
      </View>
      <View style={styles.cornerAccent} pointerEvents="none" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.gradients.trayPanel[1],
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.md,
    overflow: 'hidden',
  },
  cardModule: {
    borderColor: Theme.colors.surface.metallicBorder,
  },
  panelSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: Theme.gradients.trayPanel[0],
    opacity: 0.5,
  },
  topEdgeAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    flexDirection: 'row',
    opacity: 0.85,
  },
  topEdgeHalf: {
    flex: 1,
  },
  cornerAccent: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 14,
    height: 14,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: Theme.colors.surface.metallicBorder,
    opacity: 0.6,
  },
});
