// Emote sound effects. Three are real recorded sounds (laugh / clown horn
// / angry growl) served from /public/audio. Two (cry / skull) are still
// synthesised via the Web Audio API — they shape well as oscillator + LFO
// and avoid more mp3s.
//
// Note: the three mp3s currently in /public/audio/ are placeholder clips;
// swap them for properly-licensed audio before going to production.

import { AudioPlayer } from '@/public/audio/AudioManager';

const laughPlayer = new AudioPlayer('/audio/emote-laugh.mp3');
const clownPlayer = new AudioPlayer('/audio/emote-clown.mp3');
const angryPlayer = new AudioPlayer('/audio/emote-angry.mp3');

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

// 😆  Real cartoon laugh mp3.
function playLaugh() {
  laughPlayer.play();
}

// 🤡  Real bicycle / clown honk mp3.
function playClown() {
  clownPlayer.play();
}

// 😡  Real growl mp3.
function playAngry() {
  angryPlayer.play();
}

// 😭  Long "WAAAH" — sustained triangle sweeping 600 → 180Hz with vibrato.
function playCry() {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  const gain = c.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(600, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(350, c.currentTime + 0.5);
  osc.frequency.exponentialRampToValueAtTime(180, c.currentTime + 1.1);

  lfo.type = 'sine';
  lfo.frequency.value = 6;
  lfoGain.gain.value = 35;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);

  osc.connect(gain);
  gain.connect(c.destination);
  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(0.25, c.currentTime + 0.08);
  gain.gain.setValueAtTime(0.25, c.currentTime + 0.7);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.1);

  osc.start();
  lfo.start();
  osc.stop(c.currentTime + 1.15);
  lfo.stop(c.currentTime + 1.15);
}

// 💀  "ooooOOOoo" — descending sine with strong vibrato (ghost / RIP).
function playSkull() {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  const gain = c.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(170, c.currentTime + 0.9);

  lfo.type = 'sine';
  lfo.frequency.value = 9;
  lfoGain.gain.value = 70;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);

  osc.connect(gain);
  gain.connect(c.destination);
  gain.gain.setValueAtTime(0.18, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.9);

  osc.start();
  lfo.start();
  osc.stop(c.currentTime + 0.95);
  lfo.stop(c.currentTime + 0.95);
}

const EMOTE_SOUNDS: Record<string, () => void> = {
  laugh: playLaugh,
  cry: playCry,
  clown: playClown,
  angry: playAngry,
  rip: playSkull,
};

export function playEmoteSound(emoteId: string) {
  EMOTE_SOUNDS[emoteId]?.();
}
