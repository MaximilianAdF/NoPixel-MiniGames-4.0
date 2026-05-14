import type { GameEngine, GameOutcome } from '@/app/game/types';
import { Digit, Digits } from './utils';

export type Feedback = 'green' | 'yellow' | 'red';

export interface PincrackerState {
  pin: Digit[];
  guess: (Digit | '')[];
  activeIndex: number;
  feedback: Feedback[] | null;
  revealing: boolean;
}

export interface PincrackerConfig {
  pinLength: number;
}

export type PincrackerInput =
  | { type: 'digit'; value: Digit }
  | { type: 'backspace' }
  | { type: 'crack' }
  | { type: 'finish'; autoClear: boolean };

// Mastermind scoring: green = right digit and place, yellow = right digit wrong place, red = absent.
function evaluate(pin: Digit[], guess: (Digit | '')[]): Feedback[] {
  const feedback: Feedback[] = new Array(pin.length).fill('red');
  const matched: boolean[] = new Array(pin.length).fill(false);
  for (let i = 0; i < pin.length; i++) {
    if (guess[i] === pin[i]) {
      feedback[i] = 'green';
      matched[i] = true;
    }
  }
  for (let i = 0; i < pin.length; i++) {
    if (feedback[i] === 'green') continue;
    const pinIndex = pin.findIndex((p, idx) => p === guess[i] && !matched[idx]);
    if (pinIndex !== -1) {
      feedback[i] = 'yellow';
      matched[pinIndex] = true;
    }
  }
  return feedback;
}

export const pincrackerEngine: GameEngine<PincrackerState, PincrackerConfig, PincrackerInput> = {
  init({ pinLength }, rng) {
    const shuffled = [...Digits];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return {
      pin: shuffled.slice(0, pinLength),
      guess: new Array<Digit | ''>(pinLength).fill(''),
      activeIndex: 0,
      feedback: null,
      revealing: false,
    };
  },

  applyInput(state, input) {
    const playing = (next: PincrackerState): { state: PincrackerState; outcome: GameOutcome } => ({
      state: next,
      outcome: 'playing',
    });

    if (input.type === 'digit') {
      if (state.revealing || state.activeIndex >= state.pin.length) return playing(state);
      const guess = [...state.guess];
      guess[state.activeIndex] = input.value;
      return playing({ ...state, guess, activeIndex: state.activeIndex + 1 });
    }

    if (input.type === 'backspace') {
      if (state.revealing || state.activeIndex === 0) return playing(state);
      const guess = [...state.guess];
      guess[state.activeIndex - 1] = '';
      return playing({ ...state, guess, activeIndex: state.activeIndex - 1 });
    }

    if (input.type === 'crack') {
      if (state.revealing || state.activeIndex < state.pin.length) return playing(state);
      return playing({ ...state, feedback: evaluate(state.pin, state.guess), revealing: true });
    }

    // input.type === 'finish' — applies the result once the reveal animation has played out.
    if (!state.revealing) return playing(state);
    const won = state.feedback !== null && state.feedback.every((f) => f === 'green');
    if (won) {
      return { state: { ...state, revealing: false }, outcome: 'won' };
    }
    if (input.autoClear) {
      return playing({
        ...state,
        revealing: false,
        guess: new Array<Digit | ''>(state.pin.length).fill(''),
        activeIndex: 0,
      });
    }
    return playing({ ...state, revealing: false });
  },

  getScore(state) {
    return state.activeIndex;
  },
};
