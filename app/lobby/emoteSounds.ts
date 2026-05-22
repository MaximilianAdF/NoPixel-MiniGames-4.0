// Cartoony emote sound effects via the Web Audio API — no asset files to
// ship, one shared AudioContext for the lifetime of the tab. Each sound
// is tuned to read as the corresponding Fluent emoji rather than a
// generic beep.

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

// Builds a "ha"-style syllable: a brief unvoiced noise burst (the "h"),
// then a short pitched sawtooth with a downward glide and a band-pass
// formant filter (the "a"). Stacking these in a pattern produces a
// recognisable cartoon laugh instead of a generic series of beeps.
function laughSyllable(
  c: AudioContext,
  startSec: number,
  pitch: number,
  level: number,
) {
  const t = c.currentTime + startSec;

  // "h" — short noise burst with high-pass to sound breathy.
  const noiseDur = 0.025;
  const buf = c.createBuffer(1, Math.max(1, Math.floor(noiseDur * c.sampleRate)), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  const noise = c.createBufferSource();
  noise.buffer = buf;
  const noiseFilter = c.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = 1500;
  const noiseGain = c.createGain();
  noiseGain.gain.value = level * 0.6;
  noise.connect(noiseFilter).connect(noiseGain).connect(c.destination);
  noise.start(t);

  // "a" — short pitched sawtooth with a quick downward glide for the
  // natural "ha" inflection. Band-pass filter narrows it to a vowel-ish
  // tone instead of a buzzy saw.
  const aStart = t + 0.025;
  const aEnd = t + 0.12;
  const osc = c.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(pitch * 1.18, aStart);
  osc.frequency.exponentialRampToValueAtTime(pitch, aStart + 0.06);
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1100;
  filter.Q.value = 3;
  const oscGain = c.createGain();
  oscGain.gain.setValueAtTime(0, aStart);
  oscGain.gain.linearRampToValueAtTime(level, aStart + 0.015);
  oscGain.gain.exponentialRampToValueAtTime(0.001, aEnd);
  osc.connect(filter).connect(oscGain).connect(c.destination);
  osc.start(aStart);
  osc.stop(aEnd + 0.02);
}

// 😆  Six "ha" syllables with descending energy and a bit of pitch
// variation, like a real cartoon belly laugh.
function playLaugh() {
  const c = getCtx();
  if (!c) return;
  const pattern: Array<{ t: number; pitch: number; level: number }> = [
    { t: 0.0, pitch: 320, level: 0.28 },
    { t: 0.14, pitch: 280, level: 0.28 },
    { t: 0.28, pitch: 320, level: 0.26 },
    { t: 0.42, pitch: 280, level: 0.24 },
    { t: 0.56, pitch: 300, level: 0.2 },
    { t: 0.7, pitch: 260, level: 0.15 },
  ];
  pattern.forEach((p) => laughSyllable(c, p.t, p.pitch, p.level));
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

// 🤡  "HONK HONK HONK" — three square-wave honks at clown-horn pitch.
function playClown() {
  const c = getCtx();
  if (!c) return;
  [0, 0.18, 0.36].forEach((delay) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'square';
    osc.frequency.value = 170;
    osc.connect(gain);
    gain.connect(c.destination);
    const t0 = c.currentTime + delay;
    gain.gain.setValueAtTime(0.18, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.14);
    osc.start(t0);
    osc.stop(t0 + 0.16);
  });
}

// 😡  "GRRRR" — low sawtooth growl with fast modulation for a buzzy edge.
function playAngry() {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  const gain = c.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(140, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, c.currentTime + 0.45);

  lfo.type = 'square';
  lfo.frequency.value = 28;
  lfoGain.gain.value = 18;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);

  osc.connect(gain);
  gain.connect(c.destination);
  gain.gain.setValueAtTime(0.22, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.45);

  osc.start();
  lfo.start();
  osc.stop(c.currentTime + 0.5);
  lfo.stop(c.currentTime + 0.5);
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
