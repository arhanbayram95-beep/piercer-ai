import { AudioPlayer, createAudioPlayer } from 'expo-audio';

// Synthesized placeholder chimes (see frontend/assets/audio) — generated
// procedurally, not professionally produced. Swap the files for real sound
// design later; the playback wiring here does not need to change.
const CAPTURE_CHIME = require('../../assets/audio/capture_chime.wav');
const PROMPT_CHIME = require('../../assets/audio/prompt_chime.wav');
const AMBIENT_SHIMMER = require('../../assets/audio/ambient_shimmer.wav');

// Capture and prompt chimes fire back-to-back (shutter tap immediately
// followed by the next step's prompt) — without this, the previous chime is
// still ringing out when the next one starts, and the two overlap into a
// mesh of sound. Only one one-shot chime plays at a time.
let activeOneShot: AudioPlayer | null = null;

async function playOneShot(source: number): Promise<void> {
  try {
    if (activeOneShot) {
      const previous = activeOneShot;
      activeOneShot = null;
      previous.pause();
      previous.remove();
    }

    const player = createAudioPlayer(source);
    activeOneShot = player;
    player.addListener('playbackStatusUpdate', (status) => {
      if (status.isLoaded && status.didJustFinish) {
        player.remove();
        if (activeOneShot === player) {
          activeOneShot = null;
        }
      }
    });
    player.play();
  } catch {
    // Audio is a nice-to-have — never block the capture/prompt flow on
    // playback failure (e.g. silent mode, missing asset in a bare test env).
  }
}

export function playCaptureChime(): Promise<void> {
  return playOneShot(CAPTURE_CHIME);
}

export function playPromptChime(): Promise<void> {
  return playOneShot(PROMPT_CHIME);
}

export interface AmbientLoopHandle {
  stop: () => Promise<void>;
}

export async function startAmbientShimmerLoop(): Promise<AmbientLoopHandle> {
  try {
    const player = createAudioPlayer(AMBIENT_SHIMMER);
    player.loop = true;
    player.volume = 0.5;
    player.play();
    return {
      stop: async () => {
        try {
          player.pause();
          player.remove();
        } catch {
          // already released — fine.
        }
      },
    };
  } catch {
    return { stop: async () => {} };
  }
}
