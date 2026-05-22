// Cartoony emote sound effects via the Web Audio API — no asset files to
// ship, one shared AudioContext for the lifetime of the tab. Each sound is
// tuned to read as the corresponding Fluent UI emoji ("WAAAH" for cry,
// "HONK HONK HONK" for clown, etc.) rather than a generic beep.

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

// 😆  "HA HA HA HA" — five bright triangle pulses bouncing between two pitches.
function playLaugh() {
  const c = getCtx();
  if (!c) return;
  [720, 880, 720, 880, 720].forEach((f, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'triangle';
    osc.frequency.value = f;
    osc.connect(gain);
    gain.connect(c.destination);
    const t0 = c.currentTime + i * 0.09;
    gain.gain.setValueAtTime(0.18, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.08);
    osc.start(t0);
    osc.stop(t0 + 0.1);
  });
}

// 😭  Long "WAAAH" — sustained triangle sweeping 600 → 200Hz with vibrato.
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
