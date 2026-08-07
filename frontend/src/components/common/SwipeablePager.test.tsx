import { fireEvent, render, screen } from '@testing-library/react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text } from 'react-native';
import SwipeablePager from './SwipeablePager';

function ControlledPager({ children }: React.PropsWithChildren) {
  const [index, setIndex] = useState(0);
  return (
    <SwipeablePager index={index} onIndexChange={setIndex}>
      {children}
    </SwipeablePager>
  );
}

function PagerWithNextButton({ children }: React.PropsWithChildren) {
  const [index, setIndex] = useState(0);
  return (
    <>
      <SwipeablePager index={index} onIndexChange={setIndex}>
        {children}
      </SwipeablePager>
      <Text testID="current-index">{String(index)}</Text>
      <Pressable testID="next" onPress={() => setIndex(index + 1)}>
        <Text>Next</Text>
      </Pressable>
    </>
  );
}

describe('SwipeablePager', () => {
  it('renders every page', () => {
    render(
      <SwipeablePager index={0} onIndexChange={jest.fn()}>
        <Text>Page One</Text>
        <Text>Page Two</Text>
      </SwipeablePager>
    );
    expect(screen.getByText('Page One')).toBeTruthy();
    expect(screen.getByText('Page Two')).toBeTruthy();
  });

  it('reports the nearest page continuously while scrolling, not just once the gesture settles', () => {
    const onIndexChange = jest.fn();
    render(
      <SwipeablePager index={0} onIndexChange={onIndexChange}>
        <Text>Page One</Text>
        <Text>Page Two</Text>
      </SwipeablePager>
    );

    const pageWidth = 400;
    fireEvent(screen.getByTestId('swipeable-pager'), 'layout', { nativeEvent: { layout: { width: pageWidth } } });

    const scrollView = screen.UNSAFE_getByProps({ horizontal: true });
    // Midway through the drag it's still page 0 — should not report yet.
    fireEvent(scrollView, 'scroll', { nativeEvent: { contentOffset: { x: pageWidth * 0.3 } } });
    expect(onIndexChange).not.toHaveBeenCalled();

    // Past the halfway point it rounds up to page 1.
    fireEvent(scrollView, 'scroll', { nativeEvent: { contentOffset: { x: pageWidth * 0.6 } } });
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it('does not fight an in-progress drag with a programmatic reposition', () => {
    const onIndexChange = jest.fn();
    render(
      <SwipeablePager index={0} onIndexChange={onIndexChange}>
        <Text>Page One</Text>
        <Text>Page Two</Text>
      </SwipeablePager>
    );

    const pageWidth = 400;
    fireEvent(screen.getByTestId('swipeable-pager'), 'layout', { nativeEvent: { layout: { width: pageWidth } } });
    const scrollView = screen.UNSAFE_getByProps({ horizontal: true });

    fireEvent(scrollView, 'scrollBeginDrag');
    fireEvent(scrollView, 'scroll', { nativeEvent: { contentOffset: { x: pageWidth } } });
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it('does not race a second programmatic scrollTo against the native paging snap after release', () => {
    const scrollToSpy = jest.spyOn(ScrollView.prototype, 'scrollTo').mockImplementation(() => {});

    render(
      <ControlledPager>
        <Text>Page One</Text>
        <Text>Page Two</Text>
      </ControlledPager>
    );

    const pageWidth = 400;
    fireEvent(screen.getByTestId('swipeable-pager'), 'layout', { nativeEvent: { layout: { width: pageWidth } } });
    const scrollView = screen.UNSAFE_getByProps({ horizontal: true });
    scrollToSpy.mockClear();

    // Cross the threshold mid-drag, then release — the settle grace period
    // should suppress any corrective scrollTo while the native snap
    // animation (real or assumed, since momentum events aren't guaranteed)
    // is still settling toward the same page.
    fireEvent(scrollView, 'scrollBeginDrag');
    fireEvent(scrollView, 'scroll', { nativeEvent: { contentOffset: { x: pageWidth * 0.6 } } });
    fireEvent(scrollView, 'scrollEndDrag');

    const racedCall = scrollToSpy.mock.calls.find(
      ([options]) => typeof options === 'object' && options?.x === pageWidth
    );
    expect(racedCall).toBeUndefined();

    scrollToSpy.mockRestore();
  });

  it('recovers from a missed onMomentumScrollEnd so a later index change still repositions', () => {
    jest.useFakeTimers();
    const scrollToSpy = jest.spyOn(ScrollView.prototype, 'scrollTo').mockImplementation(() => {});
    const onIndexChange = jest.fn();

    const { rerender } = render(
      <SwipeablePager index={0} onIndexChange={onIndexChange}>
        <Text>Page One</Text>
        <Text>Page Two</Text>
      </SwipeablePager>
    );

    const pageWidth = 400;
    fireEvent(screen.getByTestId('swipeable-pager'), 'layout', { nativeEvent: { layout: { width: pageWidth } } });
    const scrollView = screen.UNSAFE_getByProps({ horizontal: true });
    scrollToSpy.mockClear();

    // A momentum phase starts (e.g. from a prior programmatic scrollTo, like
    // the Next button triggers) but never reports its end - a real, observed
    // native inconsistency this component must not get permanently stuck on.
    fireEvent(scrollView, 'momentumScrollBegin');
    jest.advanceTimersByTime(500);

    rerender(
      <SwipeablePager index={1} onIndexChange={onIndexChange}>
        <Text>Page One</Text>
        <Text>Page Two</Text>
      </SwipeablePager>
    );

    expect(scrollToSpy).toHaveBeenCalledWith(expect.objectContaining({ x: pageWidth }));

    scrollToSpy.mockRestore();
    jest.useRealTimers();
  });

  it('does not report the pages its own animated scroll passes over', () => {
    jest.spyOn(ScrollView.prototype, 'scrollTo').mockImplementation(() => {});

    render(
      <PagerWithNextButton>
        <Text>Page One</Text>
        <Text>Page Two</Text>
      </PagerWithNextButton>
    );

    const pageWidth = 400;
    fireEvent(screen.getByTestId('swipeable-pager'), 'layout', { nativeEvent: { layout: { width: pageWidth } } });
    const scrollView = screen.UNSAFE_getByProps({ horizontal: true });

    fireEvent.press(screen.getByTestId('next'));

    // The early frames of the transition still round to page 0. Feeding them
    // back to the parent snapped the index straight back and stalled the
    // slide partway across — the reported Next-button bug.
    fireEvent(scrollView, 'scroll', { nativeEvent: { contentOffset: { x: pageWidth * 0.1 } } });
    fireEvent(scrollView, 'scroll', { nativeEvent: { contentOffset: { x: pageWidth * 0.4 } } });

    expect(screen.getByTestId('current-index').props.children).toBe('1');

    (ScrollView.prototype.scrollTo as jest.Mock).mockRestore();
  });

  it('tracks swipes again once its own animated scroll has landed', () => {
    jest.spyOn(ScrollView.prototype, 'scrollTo').mockImplementation(() => {});

    render(
      <PagerWithNextButton>
        <Text>Page One</Text>
        <Text>Page Two</Text>
      </PagerWithNextButton>
    );

    const pageWidth = 400;
    fireEvent(screen.getByTestId('swipeable-pager'), 'layout', { nativeEvent: { layout: { width: pageWidth } } });
    const scrollView = screen.UNSAFE_getByProps({ horizontal: true });

    fireEvent.press(screen.getByTestId('next'));
    fireEvent(scrollView, 'scroll', { nativeEvent: { contentOffset: { x: pageWidth } } });

    // Swiping back to page 0 must still register.
    fireEvent(scrollView, 'scroll', { nativeEvent: { contentOffset: { x: pageWidth * 0.4 } } });

    expect(screen.getByTestId('current-index').props.children).toBe('0');

    (ScrollView.prototype.scrollTo as jest.Mock).mockRestore();
  });

  it('never scrolls to a guessed width — waits for the real measured layout', () => {
    const scrollToSpy = jest.spyOn(ScrollView.prototype, 'scrollTo').mockImplementation(() => {});
    const onIndexChange = jest.fn();

    // Index changes (e.g. a Next-button tap) before layout has ever fired —
    // scrolling now would have to guess a width, which is exactly what
    // produced the reported "starts sliding but doesn't reach the second
    // page" bug (the app window is always wider than this pager's real,
    // padded container).
    render(
      <SwipeablePager index={1} onIndexChange={onIndexChange}>
        <Text>Page One</Text>
        <Text>Page Two</Text>
      </SwipeablePager>
    );
    expect(scrollToSpy).not.toHaveBeenCalled();

    const pageWidth = 350;
    fireEvent(screen.getByTestId('swipeable-pager'), 'layout', { nativeEvent: { layout: { width: pageWidth } } });

    expect(scrollToSpy).toHaveBeenCalledWith(expect.objectContaining({ x: pageWidth }));

    scrollToSpy.mockRestore();
  });
});
