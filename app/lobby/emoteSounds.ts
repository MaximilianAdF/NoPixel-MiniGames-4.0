// Emote sound effects. All synthesised via the Web Audio API — no asset
// files needed, one shared AudioContext for the tab. Each sound's
// duration matches the emote's `loopMs` window from ./emotes.ts, and
// where the visual has discrete beats the pitch sweep parks a peak on
// each one so the audio lines up with the WebP.

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

// 😆  Discrete "ha-ha-ha" — one triangle pulse per visible bounce frame
// from the Noto WebP. Each pulse is a brief pitch swell + amplitude pop,
// and the peak pitch drops as the laugh tails off.
function playLaugh() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const dur = 2.5;
  // Visible ha-beats from the per-frame motion analysis of 1f606 512.webp,
  // trimmed to fit inside the loopMs window with a safety buffer.
  const beats = [0.09, 0.39, 0.69, 0.99, 1.29, 1.59, 1.89, 2.19, 2.34];
  // Peak pitches drift down so the laugh sounds like it's calming.
  const peaks = [500, 490, 480, 470, 460, 450, 440, 430, 420];

  const osc = c.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(380, t);

  const env = c.createGain();
  env.gain.setValueAtTime(0, t);

  beats.forEach((beat, i) => {
    const peak = t + beat;
    osc.frequency.setValueAtTime(380, peak - 0.05);
    osc.frequency.linearRampToValueAtTime(peaks[i], peak);
    osc.frequency.exponentialRampToValueAtTime(360, peak + 0.10);
    env.gain.setValueAtTime(0.005, peak - 0.04);
    env.gain.linearRampToValueAtTime(0.26, peak);
    env.gain.exponentialRampToValueAtTime(0.005, peak + 0.13);
  });
  env.gain.exponentialRampToValueAtTime(0.001, t + dur);

  osc.connect(env).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

// 😭  Two-wail "WAAH WAAH" — triangle with 6Hz vibrato. Pitch swells
// into the visible first wail (~550ms), dips, then swells again into the
// second wail (~1575ms), resolving low. Matches Noto's two-sob loop.
function playCry() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const dur = 1.6;

  const osc = c.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(550, t);
  osc.frequency.exponentialRampToValueAtTime(700, t + 0.5);
  osc.frequency.exponentialRampToValueAtTime(280, t + 1.0);
  osc.frequency.exponentialRampToValueAtTime(640, t + 1.4);
  osc.frequency.exponentialRampToValueAtTime(180, t + dur);

  const lfo = c.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 6;
  const lfoGain = c.createGain();
  lfoGain.gain.value = 35;
  lfo.connect(lfoGain).connect(osc.frequency);

  const env = c.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(0.25, t + 0.08);
  env.gain.setValueAtTime(0.25, t + dur - 0.3);
  env.gain.exponentialRampToValueAtTime(0.001, t + dur);

  osc.connect(env).connect(c.destination);
  osc.start(t);
  lfo.start(t);
  osc.stop(t + dur + 0.05);
  lfo.stop(t + dur + 0.05);
}

// 🤡  Cartoon slide-whistle — sine with 11Hz vibrato. Pitch peaks parked
// on each of Noto's five honk frames (~180, 510, 1080, 1260, 1380ms):
// two quick honks early, a brief lull, then a triple honk into resolve.
function playClown() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const dur = 1.6;

  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, t);
  osc.frequency.exponentialRampToValueAtTime(800, t + 0.18);
  osc.frequency.exponentialRampToValueAtTime(380, t + 0.35);
  osc.frequency.exponentialRampToValueAtTime(750, t + 0.51);
  osc.frequency.exponentialRampToValueAtTime(380, t + 0.85);
  osc.frequency.exponentialRampToValueAtTime(700, t + 1.08);
  osc.frequency.exponentialRampToValueAtTime(450, t + 1.20);
  osc.frequency.exponentialRampToValueAtTime(820, t + 1.26);
  osc.frequency.exponentialRampToValueAtTime(450, t + 1.33);
  osc.frequency.exponentialRampToValueAtTime(720, t + 1.38);
  osc.frequency.exponentialRampToValueAtTime(340, t + dur);

  const lfo = c.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 11;
  const lfoGain = c.createGain();
  lfoGain.gain.value = 30;
  lfo.connect(lfoGain).connect(osc.frequency);

  const env = c.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(0.2, t + 0.03);
  env.gain.setValueAtTime(0.2, t + dur - 0.15);
  env.gain.exponentialRampToValueAtTime(0.001, t + dur);

  osc.connect(env).connect(c.destination);
  osc.start(t);
  lfo.start(t);
  osc.stop(t + dur + 0.05);
  lfo.stop(t + dur + 0.05);
}

// 😡  Gritty growl — low sawtooth body (chest rumble) layered with
// band-passed white noise (raspy throat). A 6Hz tremolo gates both for
// the "GRRR-GRR-GRR" pulse pattern, with sawtooth pitch swells on each
// of Noto's four early action frames (330, 750, 1050, 1170ms).
function playAngry() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const dur = 1.8;

  // Body: low sawtooth for chest growl, with pitch accents on visual beats.
  const body = c.createOscillator();
  body.type = 'sawtooth';
  body.frequency.setValueAtTime(90, t);
  body.frequency.exponentialRampToValueAtTime(115, t + 0.33);
  body.frequency.exponentialRampToValueAtTime(85, t + 0.55);
  body.frequency.exponentialRampToValueAtTime(110, t + 0.75);
  body.frequency.exponentialRampToValueAtTime(80, t + 0.95);
  body.frequency.exponentialRampToValueAtTime(120, t + 1.05);
  body.frequency.exponentialRampToValueAtTime(100, t + 1.17);
  body.frequency.exponentialRampToValueAtTime(70, t + dur);

  const bodyFilter = c.createBiquadFilter();
  bodyFilter.type = 'lowpass';
  bodyFilter.frequency.value = 700;
  bodyFilter.Q.value = 1.5;

  // Grit: white noise through a narrow bandpass for raspy throat texture.
  const noiseBuf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
  const noiseData = noiseBuf.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) noiseData[i] = Math.random() * 2 - 1;
  const noise = c.createBufferSource();
  noise.buffer = noiseBuf;

  const noiseFilter = c.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = 450;
  noiseFilter.Q.value = 3;

  const noiseGain = c.createGain();
  noiseGain.gain.value = 0.18;

  // Shared 6Hz tremolo — same gate for body + grit so they pulse together.
  const grrr = c.createGain();
  grrr.gain.value = 0.7;
  const grrrLFO = c.createOscillator();
  grrrLFO.type = 'sine';
  grrrLFO.frequency.value = 6;
  const grrrLFODepth = c.createGain();
  grrrLFODepth.gain.value = 0.3;
  grrrLFO.connect(grrrLFODepth).connect(grrr.gain);

  const env = c.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(0.32, t + 0.04);
  env.gain.setValueAtTime(0.32, t + dur - 0.4);
  env.gain.exponentialRampToValueAtTime(0.001, t + dur);

  body.connect(bodyFilter).connect(grrr);
  noise.connect(noiseFilter).connect(noiseGain).connect(grrr);
  grrr.connect(env).connect(c.destination);

  body.start(t);
  noise.start(t);
  grrrLFO.start(t);
  body.stop(t + dur + 0.05);
  noise.stop(t + dur + 0.05);
  grrrLFO.stop(t + dur + 0.05);
}

// 💀  Sustained ghost moan — single sine sweeping slowly down with a
// strong 9Hz vibrato. A subtle midway swell adds eeriness without
// breaking the continuous wail.
function playSkull() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const dur = 3.5;

  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, t);
  osc.frequency.exponentialRampToValueAtTime(220, t + 1.5);
  osc.frequency.exponentialRampToValueAtTime(260, t + 2.2);
  osc.frequency.exponentialRampToValueAtTime(140, t + dur);

  const lfo = c.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 9;
  const lfoGain = c.createGain();
  lfoGain.gain.value = 70;
  lfo.connect(lfoGain).connect(osc.frequency);

  const env = c.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(0.20, t + 0.1);
  env.gain.setValueAtTime(0.20, t + dur - 0.5);
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
