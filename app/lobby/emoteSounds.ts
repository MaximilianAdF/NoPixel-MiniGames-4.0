// Emote sound effects. All synthesised via the Web Audio API — no asset
// files needed, one shared AudioContext for the tab. Each sound runs
// for ~3s to match how long the emoji bubble stays visible (see
// EMOTE_DURATION_MS in ./emotes.ts).
//
// All five follow the same shape: a single voice oscillator with a
// smooth pitch sweep, an LFO for vibrato / wobble, and a master
// envelope. No chopped pulses, no aggressive square-wave tremolo —
// that's what made the old mad sound feel weird.

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

// 😆  Bouncy "hahahaha" — triangle wave with synced 8Hz pitch + amplitude
// LFOs so each cycle reads as one "ha". The LFO depths taper off so the
// laughter mellows out by the end instead of holding intensity for 3s.
function playLaugh() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const dur = 3.0;

  const osc = c.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(440, t);
  osc.frequency.exponentialRampToValueAtTime(300, t + dur);

  // Pitch wobble — starts wide, narrows toward the end (laugh dying off).
  const pitchLFO = c.createOscillator();
  pitchLFO.type = 'sine';
  pitchLFO.frequency.value = 8;
  const pitchLFODepth = c.createGain();
  pitchLFODepth.gain.setValueAtTime(95, t);
  pitchLFODepth.gain.linearRampToValueAtTime(35, t + dur);
  pitchLFO.connect(pitchLFODepth).connect(osc.frequency);

  // Amplitude tremolo in sync — splits the wobble into discrete "ha"s.
  // Base 0.5 + ±0.5 modulation = swings 0 → 1.
  const tremolo = c.createGain();
  tremolo.gain.value = 0.5;
  const ampLFO = c.createOscillator();
  ampLFO.type = 'sine';
  ampLFO.frequency.value = 8;
  const ampLFODepth = c.createGain();
  ampLFODepth.gain.value = 0.5;
  ampLFO.connect(ampLFODepth).connect(tremolo.gain);

  const env = c.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(0.22, t + 0.05);
  env.gain.setValueAtTime(0.22, t + dur - 0.4);
  env.gain.exponentialRampToValueAtTime(0.001, t + dur);

  osc.connect(tremolo).connect(env).connect(c.destination);
  osc.start(t);
  pitchLFO.start(t);
  ampLFO.start(t);
  osc.stop(t + dur + 0.05);
  pitchLFO.stop(t + dur + 0.05);
  ampLFO.stop(t + dur + 0.05);
}

// 😭  Long "WAAAH" — sustained triangle sweeping down with vibrato, then
// drifting back up and down again over 3s.
function playCry() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const dur = 3.0;

  const osc = c.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(620, t);
  osc.frequency.exponentialRampToValueAtTime(330, t + 1.0);
  osc.frequency.exponentialRampToValueAtTime(180, t + 1.8);
  // Second wail
  osc.frequency.exponentialRampToValueAtTime(500, t + 2.0);
  osc.frequency.exponentialRampToValueAtTime(280, t + 2.6);
  osc.frequency.exponentialRampToValueAtTime(140, t + dur);

  const lfo = c.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 6;
  const lfoGain = c.createGain();
  lfoGain.gain.value = 35;
  lfo.connect(lfoGain).connect(osc.frequency);

  const env = c.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(0.25, t + 0.08);
  env.gain.setValueAtTime(0.25, t + dur - 0.4);
  env.gain.exponentialRampToValueAtTime(0.001, t + dur);

  osc.connect(env).connect(c.destination);
  osc.start(t);
  lfo.start(t);
  osc.stop(t + dur + 0.05);
  lfo.stop(t + dur + 0.05);
}

// 🤡  Cartoon slide-whistle — base pitch slowly drifting, with a wide
// 1.5Hz LFO that sweeps the pitch up and down ~4-5 times across 3s.
// Reads as multiple "boings" rather than honks.
function playClown() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const dur = 3.0;

  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(480, t);
  osc.frequency.exponentialRampToValueAtTime(380, t + dur);

  // Wide slow LFO for the boing-boing pitch sweep.
  const boingLFO = c.createOscillator();
  boingLFO.type = 'sine';
  boingLFO.frequency.value = 1.5;
  const boingLFODepth = c.createGain();
  boingLFODepth.gain.value = 300;
  boingLFO.connect(boingLFODepth).connect(osc.frequency);

  // Fast vibrato on top for goofy texture.
  const vib = c.createOscillator();
  vib.type = 'sine';
  vib.frequency.value = 11;
  const vibDepth = c.createGain();
  vibDepth.gain.value = 22;
  vib.connect(vibDepth).connect(osc.frequency);

  const env = c.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(0.2, t + 0.06);
  env.gain.setValueAtTime(0.2, t + dur - 0.3);
  env.gain.exponentialRampToValueAtTime(0.001, t + dur);

  osc.connect(env).connect(c.destination);
  osc.start(t);
  boingLFO.start(t);
  vib.start(t);
  osc.stop(t + dur + 0.05);
  boingLFO.stop(t + dur + 0.05);
  vib.stop(t + dur + 0.05);
}

// 😡  Smooth low growl — sawtooth filtered through a low-pass (kills the
// buzzy edge), with a 5Hz pitch wobble for the menacing "rrrr". Same
// pattern as cry/skull, just pitched way down. No more square-wave
// tremolo.
function playAngry() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const dur = 3.0;

  const osc = c.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(120, t);
  osc.frequency.exponentialRampToValueAtTime(75, t + dur);

  // Low-pass takes the brittle edge off the sawtooth and leaves a warm
  // chesty growl in its place.
  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 320;
  filter.Q.value = 3;

  // 5Hz pitch wobble for the "rrrr" character.
  const pitchLFO = c.createOscillator();
  pitchLFO.type = 'sine';
  pitchLFO.frequency.value = 5;
  const pitchLFODepth = c.createGain();
  pitchLFODepth.gain.value = 14;
  pitchLFO.connect(pitchLFODepth).connect(osc.frequency);

  const env = c.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(0.3, t + 0.05);
  env.gain.setValueAtTime(0.3, t + dur - 0.4);
  env.gain.exponentialRampToValueAtTime(0.001, t + dur);

  osc.connect(filter).connect(env).connect(c.destination);
  osc.start(t);
  pitchLFO.start(t);
  osc.stop(t + dur + 0.05);
  pitchLFO.stop(t + dur + 0.05);
}

// 💀  "ooooOOOoo" — descending sine with strong vibrato (ghost / RIP).
// Drifts down, briefly drifts back up, and resolves low.
function playSkull() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const dur = 3.0;

  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(340, t);
  osc.frequency.exponentialRampToValueAtTime(190, t + 1.2);
  osc.frequency.exponentialRampToValueAtTime(260, t + 1.8);
  osc.frequency.exponentialRampToValueAtTime(140, t + dur);

  const lfo = c.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 9;
  const lfoGain = c.createGain();
  lfoGain.gain.value = 70;
  lfo.connect(lfoGain).connect(osc.frequency);

  const env = c.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(0.18, t + 0.06);
  env.gain.setValueAtTime(0.18, t + dur - 0.4);
  env.gain.exponentialRampToValueAtTime(0.001, t + dur);

  osc.connect(env).connect(c.destination);
  osc.start(t);
  lfo.start(t);
  osc.stop(t + dur + 0.05);
  lfo.stop(t + dur + 0.05);
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
