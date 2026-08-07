import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

interface SwipeablePagerProps extends PropsWithChildren {
  index: number;
  onIndexChange: (index: number) => void;
  style?: ViewStyle;
}

// Plain ScrollView + pagingEnabled — no react-native-pager-view dependency
// needed for a simple linear carousel like onboarding.
//
// Tracks the current page via onScroll (continuous, ~60fps) rather than
// onMomentumScrollEnd/onScrollEndDrag alone — those "gesture settled"
// events are not reliably fired for every swipe on every platform/RN
// version, which is what caused the progress dots to silently stop
// tracking the current page in an earlier version of this component.
//
// Reading positions off onScroll means the component also sees its *own*
// animated scrollTo go by, so both directions need a guard against feeding
// that back on itself:
//   - animatingTo: while our animated scrollTo is in flight, every reported
//     offset belongs to that animation. Reporting them upward pushed the
//     parent's index straight back to the page we were leaving (the first
//     frames still round to it), which cancelled the transition partway —
//     the reported "Next only slides a little" bug.
//   - lastOffset: when the user's own drag crosses the halfway point, the
//     parent echoes the new index back down while the native paging snap is
//     still physically settling toward it. A corrective scrollTo there races
//     the native animation to the same place and reads as a double-snap.
const PROGRAMMATIC_SCROLL_TIMEOUT_MS = 600;

export default function SwipeablePager({ index, onIndexChange, children, style }: SwipeablePagerProps) {
  const scrollRef = useRef<ScrollView>(null);
  // Starts at 0, not a Dimensions.get('window').width guess — this pager
  // always renders inside a padded container, so the window width is never
  // actually correct, and using it as a placeholder let an interaction that
  // arrived before the first real onLayout measurement scroll to the wrong
  // target. Nothing scrolls until a real measured width comes in.
  const [pageWidth, setPageWidth] = useState(0);
  const hasPositioned = useRef(false);
  const lastOffset = useRef(0);
  const animatingTo = useRef<number | null>(null);
  const animationTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const endAnimation = () => {
    animatingTo.current = null;
    if (animationTimeout.current) {
      clearTimeout(animationTimeout.current);
      animationTimeout.current = null;
    }
  };

  useEffect(() => endAnimation, []);

  useEffect(() => {
    if (pageWidth === 0) return;
    // Already on (or natively snapping toward) this page — don't fight it.
    if (hasPositioned.current && Math.round(lastOffset.current / pageWidth) === index) return;

    const x = index * pageWidth;
    const animated = hasPositioned.current;
    hasPositioned.current = true;

    if (animated) {
      animatingTo.current = x;
      if (animationTimeout.current) clearTimeout(animationTimeout.current);
      // Arrival is normally detected from onScroll landing on x, but a
      // native animation that stops a fraction short would otherwise leave
      // the guard latched on forever and freeze swipe tracking.
      animationTimeout.current = setTimeout(endAnimation, PROGRAMMATIC_SCROLL_TIMEOUT_MS);
    }

    scrollRef.current?.scrollTo({ x, animated });
  }, [index, pageWidth]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    if (width > 0 && width !== pageWidth) {
      setPageWidth(width);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (pageWidth === 0) return;
    const offsetX = event.nativeEvent.contentOffset.x;
    lastOffset.current = offsetX;

    if (animatingTo.current !== null) {
      if (Math.abs(offsetX - animatingTo.current) < 1) endAnimation();
      return;
    }

    const newIndex = Math.round(offsetX / pageWidth);
    if (newIndex !== index) {
      onIndexChange(newIndex);
    }
  };

  const pages = React.Children.toArray(children);

  return (
    <View style={style} onLayout={handleLayout} testID="swipeable-pager">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        bounces={false}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={endAnimation}
        onMomentumScrollEnd={endAnimation}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {pages.map((page, i) => (
          <View style={[styles.page, { width: pageWidth }]} key={i}>
            {page}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    justifyContent: 'center',
  },
});
