/**
 * Determinism spike — validates the load-bearing 1v1 assumption: a pure engine,
 * replayed from (seed, inputs), yields a bit-identical end state.
 *
 * For each engine: init with a seeded RNG, apply a fixed input sequence, do it
 * again, and diff. PASS means the engine is replay-ready for server-side
 * verification; FAIL means it pulls in randomness the injected rng doesn't control.
 *
 * Run: npx --yes tsx scripts/determinism-spike.ts
 */
import { roofRunningEngine } from '../app/puzzles/roof-running/engine';
import { pincrackerEngine } from '../app/puzzles/pincracker/engine';
import { lockpickEngine } from '../app/components/lockpickEngine';
import { repairKitEngine } from '../app/puzzles/repair-kit/engine';
import { thermiteEngine } from '../app/puzzles/thermite/engine';
import { choppingEngine } from '../app/puzzles/chopping/engine';
import { wordMemoryEngine } from '../app/puzzles/word-memory/engine';

// Deterministic LCG — the same generator the daily-challenge route uses.
function seededRandom(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

// Replays an engine from a seed + fixed input sequence; returns the final state.
function replay(engine: any, seed: number, config: any, inputs: any[]) {
  let state = engine.init(config, seededRandom(seed));
  for (const input of inputs) {
    state = engine.applyInput(state, input).state;
  }
  return state;
}

const SEED = 12345;

// Inputs need not be "winning" — any fixed sequence proves (or breaks) determinism.
const cases: { name: string; engine: any; config: any; inputs: any[] }[] = [
  {
    name: 'roof-running',
    engine: roofRunningEngine,
    config: { rows: 8, columns: 11 },
    inputs: [0, 5, 12, 30, 50, 7, 80].map((index) => ({ type: 'click', index })),
  },
  {
    name: 'pincracker',
    engine: pincrackerEngine,
    config: { pinLength: 4 },
    inputs: [
      { type: 'digit', value: 1 },
      { type: 'digit', value: 2 },
      { type: 'digit', value: 3 },
      { type: 'digit', value: 4 },
      { type: 'crack' },
      { type: 'finish', autoClear: true },
    ],
  },
  {
    name: 'lockpick',
    engine: lockpickEngine,
    config: { levels: 4 },
    inputs: [
      { type: 'rotate', direction: 1 },
      { type: 'rotate', direction: 1 },
      { type: 'unlock' },
      { type: 'rotate', direction: -1 },
      { type: 'unlock' },
    ],
  },
  {
    name: 'repair-kit',
    engine: repairKitEngine,
    config: {},
    inputs: [{ type: 'stop', deviation: 3 }],
  },
  {
    name: 'thermite',
    engine: thermiteEngine,
    config: { rows: 6, columns: 6, targetScore: 24 },
    inputs: [
      { type: 'click', coord: [0, 0], timestamp: 1000 },
      { type: 'click', coord: [0, 0], timestamp: 1200 },
      { type: 'click', coord: [1, 1], timestamp: 1500 },
      { type: 'click', coord: [2, 2], timestamp: 1800 },
    ],
  },
  {
    name: 'chopping',
    engine: choppingEngine,
    config: { numLetters: 15 },
    inputs: ['Q', 'W', 'E', 'R', 'A', 'S', 'D'],
  },
  {
    name: 'word-memory',
    engine: wordMemoryEngine,
    config: { numWords: 25 },
    inputs: [{ type: 'seen' }, { type: 'new' }, { type: 'new' }, { type: 'seen' }],
  },
];

console.log('Determinism spike — replaying each engine twice from the same (seed, inputs)\n');
let pass = 0;
let fail = 0;
let errored = 0;
for (const c of cases) {
  try {
    const a = JSON.stringify(replay(c.engine, SEED, c.config, c.inputs));
    const b = JSON.stringify(replay(c.engine, SEED, c.config, c.inputs));
    if (a === b) {
      console.log(`  PASS   ${c.name.padEnd(13)} bit-identical (${a.length} chars)`);
      pass++;
    } else {
      console.log(`  FAIL   ${c.name.padEnd(13)} replays DIVERGED — non-deterministic`);
      fail++;
    }
  } catch (err) {
    console.log(`  ERROR  ${c.name.padEnd(13)} ${(err as Error).message}`);
    errored++;
  }
}
console.log(`\n${pass} deterministic / ${fail} non-deterministic / ${errored} errored`);
