// Programmatically-generated emote sound effects via the Web Audio API.
// No asset files to ship; one shared AudioContext for the lifetime of the
// tab. Each sound is a few oscillator + gain envelope ops, so cost is
// negligible and they're recognisably distinct from each other.

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

function pulse(
  c: AudioContext,
  freq: number,
  startOffset: number,
  duration: number,
  peakGain: number,
  type: OscillatorType = 'sine',
) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(c.destination);
  const t0 = c.currentTime + startOffset;
  gain.gain.setValueAtTime(peakGain, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

// Rapid pulses ascending → descending, "ha ha ha".
function playLaugh() {
  const c = getCtx();
  if (!c) return;
  [600, 750, 850, 700, 800, 650].forEach((f, i) =>
    pulse(c, f, i * 0.07, 0.06, 0.13, 'triangle'),
  );
}

// Long descending wail.
function playCry() {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(450, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(120, c.currentTime + 0.7);
  osc.connect(gain);
  gain.connect(c.destination);
  gain.gain.setValueAtTime(0.18, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.7);
  osc.start();
  osc.stop(c.currentTime + 0.72);
}

// Two short square-wave honks.
function playHonk() {
  const c = getCtx();
  if (!c) return;
  [0, 0.16].forEach((d) => pulse(c, 180, d, 0.13, 0.13, 'square'));
}

// Major chord arpeggio (C E G).
function playHandshake() {
  const c = getCtx();
  if (!c) return;
  [523, 659, 784].forEach((f, i) => pulse(c, f, i * 0.08, 0.3, 0.13, 'sine'));
}

// Frequency sweep from high to low.
function playWhoosh() {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(900, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.35);
  osc.connect(gain);
  gain.connect(c.destination);
  gain.gain.setValueAtTime(0.1, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35);
  osc.start();
  osc.stop(c.currentTime + 0.37);
}

// Single white-noise burst.
function playClap() {
  const c = getCtx();
  if (!c) return;
  const dur = 0.06;
  const buf = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * dur)), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  const src = c.createBufferSource();
  src.buffer = buf;
  const gain = c.createGain();
  gain.gain.value = 0.35;
  src.connect(gain);
  gain.connect(c.destination);
  src.start();
}

// Short low buzz.
function playSnort() {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(180, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(70, c.currentTime + 0.2);
  osc.connect(gain);
  gain.connect(c.destination);
  gain.gain.setValueAtTime(0.16, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.22);
  osc.start();
  osc.stop(c.currentTime + 0.24);
}

// Low sine with vibrato (LFO modulating frequency).
function playGhost() {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.frequency.value = 280;
  lfo.type = 'sine';
  lfo.frequency.value = 8;
  lfoGain.gain.value = 50;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  osc.connect(gain);
  gain.connect(c.destination);
  gain.gain.setValueAtTime(0.13, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.6);
  osc.start();
  lfo.start();
  osc.stop(c.currentTime + 0.62);
  lfo.stop(c.currentTime + 0.62);
}

const EMOTE_SOUNDS: Record<string, () => void> = {
  laugh: playLaugh,
  cry: playCry,
  clown: playHonk,
  gg: playHandshake,
  wp: playWhoosh,
  nice: playClap,
  angry: playSnort,
  rip: playGhost,
};

export function playEmoteSound(emoteId: string) {
  EMOTE_SOUNDS[emoteId]?.();
}
