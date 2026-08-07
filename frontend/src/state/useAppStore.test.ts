import { useAppStore } from './useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      screen: 'loading',
      previousScreen: null,
      ageVerified: false,
      imageConsentGiven: false,
      images: [],
      isProActive: false,
    });
  });

  it('starts on the loading screen with no consent granted', () => {
    const state = useAppStore.getState();
    expect(state.screen).toBe('loading');
    expect(state.ageVerified).toBe(false);
    expect(state.imageConsentGiven).toBe(false);
  });

  it('navigates between screens via goToScreen', () => {
    useAppStore.getState().goToScreen('onboarding');
    expect(useAppStore.getState().screen).toBe('onboarding');
  });

  it('goBack returns to wherever goToScreen was last called from', () => {
    useAppStore.getState().goToScreen('settings');
    useAppStore.getState().goToScreen('paywall');
    useAppStore.getState().goBack();
    expect(useAppStore.getState().screen).toBe('settings');
  });

  it('goBack falls back to the Welcome home base when there is nothing recorded to return to', () => {
    useAppStore.getState().goBack();
    expect(useAppStore.getState().screen).toBe('welcome');
  });

  it('tracks age verification and image consent independently', () => {
    useAppStore.getState().setAgeVerified(true);
    expect(useAppStore.getState().ageVerified).toBe(true);
    expect(useAppStore.getState().imageConsentGiven).toBe(false);
  });

  it('accumulates captured photos in order and can clear them', () => {
    useAppStore.getState().addImage('base64-calm');
    useAppStore.getState().addImage('base64-bright');
    useAppStore.getState().addImage('base64-deep');
    expect(useAppStore.getState().images).toEqual(['base64-calm', 'base64-bright', 'base64-deep']);

    useAppStore.getState().clearImages();
    expect(useAppStore.getState().images).toEqual([]);
  });

  it('tracks Pro entitlement status', () => {
    useAppStore.getState().setProActive(true);
    expect(useAppStore.getState().isProActive).toBe(true);
  });

  it('defaults to English and can switch language', () => {
    expect(useAppStore.getState().languageCode).toBe('en');
    useAppStore.getState().setLanguageCode('es');
    expect(useAppStore.getState().languageCode).toBe('es');
  });

  it('generates a stable anonymous device ID for the session', () => {
    const { anonymousId } = useAppStore.getState();
    expect(anonymousId).toMatch(/^faceai-anon-/);
    expect(useAppStore.getState().anonymousId).toBe(anonymousId);
  });
});
