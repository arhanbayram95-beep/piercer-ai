const mockCreateAudioPlayer = jest.fn();

jest.mock('expo-audio', () => ({
  createAudioPlayer: (...args: unknown[]) => mockCreateAudioPlayer(...args),
}));

import { playCaptureChime, playPromptChime, startAmbientShimmerLoop } from './sound';

function fakePlayer() {
  return {
    play: jest.fn(),
    pause: jest.fn(),
    remove: jest.fn(),
    addListener: jest.fn(),
    loop: false,
    volume: 1,
  };
}

describe('sound utilities', () => {
  beforeEach(() => {
    mockCreateAudioPlayer.mockReset();
  });

  it('plays and auto-unloads a one-shot capture chime', async () => {
    const player = fakePlayer();
    mockCreateAudioPlayer.mockReturnValue(player);

    await playCaptureChime();

    expect(player.play).toHaveBeenCalledTimes(1);
    const [event, onStatus] = player.addListener.mock.calls[0];
    expect(event).toBe('playbackStatusUpdate');
    onStatus({ isLoaded: true, didJustFinish: true });
    expect(player.remove).toHaveBeenCalledTimes(1);
  });

  it('stops the previous one-shot chime before starting the next, to avoid overlap', async () => {
    const first = fakePlayer();
    const second = fakePlayer();
    mockCreateAudioPlayer.mockReturnValueOnce(first).mockReturnValueOnce(second);

    await playCaptureChime();
    await playPromptChime();

    expect(first.pause).toHaveBeenCalledTimes(1);
    expect(first.remove).toHaveBeenCalledTimes(1);
    expect(second.play).toHaveBeenCalledTimes(1);
  });

  it('does not throw when playback fails to load', async () => {
    mockCreateAudioPlayer.mockImplementation(() => {
      throw new Error('no audio device');
    });
    await expect(playPromptChime()).resolves.toBeUndefined();
  });

  it('starts a looping ambient shimmer and stops it on request', async () => {
    const player = fakePlayer();
    mockCreateAudioPlayer.mockReturnValue(player);

    const handle = await startAmbientShimmerLoop();
    expect(mockCreateAudioPlayer).toHaveBeenCalledWith(expect.anything());
    expect(player.loop).toBe(true);
    expect(player.volume).toBe(0.5);
    expect(player.play).toHaveBeenCalledTimes(1);

    await handle.stop();
    expect(player.pause).toHaveBeenCalledTimes(1);
    expect(player.remove).toHaveBeenCalledTimes(1);
  });

  it('returns a no-op handle when the ambient loop fails to start', async () => {
    mockCreateAudioPlayer.mockImplementation(() => {
      throw new Error('no audio device');
    });
    const handle = await startAmbientShimmerLoop();
    await expect(handle.stop()).resolves.toBeUndefined();
  });
});
