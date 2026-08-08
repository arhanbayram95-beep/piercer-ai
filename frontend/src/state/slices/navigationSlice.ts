import { StateCreator } from 'zustand';

export type AppScreen =
  | 'loading'
  | 'onboarding'
  | 'paywall'
  | 'welcome'
  | 'home'
  | 'location'
  | 'capture'
  | 'studio'
  | 'preview'
  | 'settings'
  | 'reference'
  | 'match'
  | 'matchQuiz'
  | 'matchPhoto';

// Transient, forward-only screens — never a sensible place for goBack() to
// land on (you never want to "go back" into the camera or a loading
// spinner, or back into the onboarding age-gate/consent flow once past
// it — dismissing Paywall on a first launch should land on Home, not
// bounce back into Onboarding).
const NON_RETURNABLE_SCREENS = new Set<AppScreen>(['loading', 'capture', 'onboarding']);

// HomeHubScreen is the app's persistent home base — reached once per
// session via the one-time Loading -> Onboarding -> Paywall -> Welcome
// intro sequence, then landed on again by goBack()'s fallback and by
// Welcome/Paywall's own CTAs. Welcome itself is meant to be seen only once
// per session (there's no persisted "onboarding already completed" state
// yet — every cold start replays the full intro; see PROJECT_SPEC.md for
// that as a flagged, not-yet-built, follow-up).
const DEFAULT_SCREEN: AppScreen = 'home';

export interface NavigationSlice {
  screen: AppScreen;
  previousScreen: AppScreen | null;
  goToScreen: (screen: AppScreen) => void;
  // For "close/dismiss" actions (e.g. leaving Review or Paywall) that should
  // land back wherever the user actually came from — Settings, Analyze,
  // wherever — instead of a hardcoded destination. Falls back to the
  // Analyze hub when there is nowhere recorded to go back to, or when the
  // recorded screen is transient (see NON_RETURNABLE_SCREENS). This is a
  // single-level "back", not a full history stack.
  goBack: () => void;
}

export const createNavigationSlice: StateCreator<NavigationSlice> = (set, get) => ({
  screen: 'loading',
  previousScreen: null,
  goToScreen: (screen) => set({ screen, previousScreen: get().screen }),
  goBack: () => {
    const { previousScreen } = get();
    const target = previousScreen && !NON_RETURNABLE_SCREENS.has(previousScreen) ? previousScreen : DEFAULT_SCREEN;
    set({ screen: target, previousScreen: null });
  },
});
