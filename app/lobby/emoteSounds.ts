// Emote sound effects. All synthesised via the Web Audio API — no asset
// files needed, one shared AudioContext for the tab. Each sound follows
// the same pattern as cry/skull: a single oscillator with a smooth pitch
// sweep, an LFO for vibrato/wobble, and an envelope. No chopped pulses.

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

// 😆  Bouncy "hehehehe" — triangle wave with rapid pitch + amplitude
// vibrato in sync, so each LFO cycle reads as one "ha" syllable.
function playLaugh() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const dur = 1.0;

  const osc = c.createOscillator();
  osc.type = 'triangle';
  // Slight downward inflection like a real falling-off laugh.
  osc.frequency.setValueAtTime(440, t);
  osc.frequency.exponentialRampToValueAtTime(340, t + dur);

  // Pitch LFO: 8Hz wobble (~8 ha/sec, natural laughter rate).
  const pitchLFO = c.createOscillator();
  pitchLFO.type = 'sine';
  pitchLFO.frequency.value = 8;
  const pitchLFOGain = c.createGain();
  pitchLFOGain.gain.value = 90;
  pitchLFO.connect(pitchLFOGain);
  pitchLFOGain.connect(osc.frequency);

  // Amplitude tremolo at the same rate to split the wobble into discrete
  // "ha" pulses. Sine LFO output is [-0.5, +0.5] times depth; chained
  // onto a base 0.5 gain it oscillates the signal between ~0 and ~1.
  const tremolo = c.createGain();
  tremolo.gain.value = 0.5;
  const ampLFO = c.createOscillator();
  ampLFO.type = 'sine';
  ampLFO.frequency.value = 8;
  const ampLFOGain = c.createGain();
  ampLFOGain.gain.value = 0.5;
  ampLFO.connect(ampLFOGain);
  ampLFOGain.connect(tremolo.gain);

  // Master envelope: quick attack, sustain, exponential decay.
  const env = c.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(0.22, t + 0.05);
  env.gain.setValueAtTime(0.22, t + 0.7);
  env.gain.exponentialRampToValueAtTime(0.001, t + dur);

  osc.connect(tremolo).connect(env).connect(c.destination);
  osc.start(t);
  pitchLFO.start(t);
  ampLFO.start(t);
  osc.stop(t + dur + 0.05);
  pitchLFO.stop(t + dur + 0.05);
  ampLFO.stop(t + dur + 0.05);
}

// 🤡  Cartoon slide-whistle — sine wave swooping up-down-up-down with a
// goofy vibrato. Reads as "boing-boing" rather than honks.
function playClown() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const dur = 0.75;

  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, t);
  osc.frequency.exponentialRampToValueAtTime(900, t + 0.2);
  osc.frequency.exponentialRampToValueAtTime(380, t + 0.4);
  osc.frequency.exponentialRampToValueAtTime(820, t + 0.55);
  osc.frequency.exponentialRampToValueAtTime(340, t + dur);

  // Light vibrato for cartoon texture.
  const lfo = c.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 11;
  const lfoGain = c.createGain();
  lfoGain.gain.value = 30;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);

  const env = c.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(0.2, t + 0.03);
  env.gain.setValueAtTime(0.2, t + dur - 0.1);
  env.gain.exponentialRampToValueAtTime(0.001, t + dur);

  osc.connect(env).connect(c.destination);
  osc.start(t);
  lfo.start(t);
  osc.stop(t + dur + 0.05);
  lfo.stop(t + dur + 0.05);
}

// 😡  Menacing growl — low sawtooth with slow pitch wobble and a fast
// amplitude tremolo for rumble texture. Same skeleton as cry/skull but
// pitched way down with a square LFO on amplitude for the aggressive
// "GRRRR" buzz.
function playAngry() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const dur = 1.0;

  const osc = c.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(140, t);
  osc.frequency.exponentialRampToValueAtTime(85, t + dur);

  // Slow ~4Hz pitch wobble — menacing.
  const pitchLFO = c.createOscillator();
  pitchLFO.type = 'sine';
  pitchLFO.frequency.value = 4;
  const pitchLFOGain = c.createGain();
  pitchLFOGain.gain.value = 18;
  pitchLFO.connect(pitchLFOGain);
  pitchLFOGain.connect(osc.frequency);

  // Fast square-wave amplitude tremolo for the "rrrrr" rumble.
  const tremolo = c.createGain();
  tremolo.gain.value = 0.75;
  const ampLFO = c.createOscillator();
  ampLFO.type = 'square';
  ampLFO.frequency.value = 22;
  const ampLFOGain = c.createGain();
  ampLFOGain.gain.value = 0.25;
  ampLFO.connect(ampLFOGain);
  ampLFOGain.connect(tremolo.gain);

  const env = c.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(0.26, t + 0.02);
  env.gain.setValueAtTime(0.26, t + 0.75);
  env.gain.exponentialRampToValueAtTime(0.001, t + dur);

  osc.connect(tremolo).connect(env).connect(c.destination);
  osc.start(t);
  pitchLFO.start(t);
  ampLFO.start(t);
  osc.stop(t + dur + 0.05);
  pitchLFO.stop(t + dur + 0.05);
  ampLFO.stop(t + dur + 0.05);
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
