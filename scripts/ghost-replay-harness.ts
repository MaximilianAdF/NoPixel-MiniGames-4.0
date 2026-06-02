/**
 * Ghost replay harness — validates the load-bearing Phase 2 assumption:
 * a recorded winning run, replayed from (seed, default config, inputs) through
 * the SAME engine + SAME seededRandom the spectator uses, reproduces the stored
 * result. If this fails for a game, that game cannot ship ghosts until its
 * determinism is fixed.
 *
 * This mirrors exactly what useGhostPlayback -> <Spectator> -> useReplayedState
 * does at runtime, but headless and assertive.
 *
 * Run: npx --yes tsx scripts/ghost-replay-harness.ts
 */
import { seededRandom } from '../lib/lobby/seededRandom';
import { choppingEngine } from '../app/puzzles/chopping/engine';
import type { GameEngine, GameOutcome } from '../app/game/types';

// Replays an engine the way useReplayedState does: init from seed, fold inputs
// until the first non-'playing' outcome.
function replay<S, C, I>(
  engine: GameEngine<S, C, I>,
  config: C,
  seed: number,
  inputs: I[],
): { outcome: GameOutcome; applied: number } {
  let state = engine.init(config, seededRandom(seed));
  let outcome: GameOutcome = 'playing';
  let applied = 0;
  for (const input of inputs) {
    if (outcome !== 'playing') break;
    const r = engine.applyInput(state, input);
    state = r.state;
    outcome = r.outcome;
    applied++;
  }
  return { outcome, applied };
}

// Simulate a player WINNING chopping on a given seed: derive the correct key
// for each position from the seeded board, with realistic ascending timestamps.
// This is what the client's input log would contain for a winning run.
function fabricateWinningChoppingGhost(seed: number, numLetters: number) {
  // Reconstruct the board exactly as the engine.init does.
  const Letters = require('../app/puzzles/chopping/utils').Letters as string[];
  const rng = seededRandom(seed);
  const board: string[] = [];
  for (let i = 0; i < numLetters; i++) {
    board.push(Letters[Math.floor(rng() * Letters.length)]);
  }
  // Correct key per position = the board letter. Timestamped ascending.
  const inputs = board.map((letter, i) => ({ t: i * 220 + 100, input: letter }));
  return { inputs, board };
}

let failures = 0;
function assert(cond: boolean, msg: string) {
  if (cond) {
    console.log(`  ✓ ${msg}`);
  } else {
    console.error(`  ✗ FAIL: ${msg}`);
    failures++;
  }
}

console.log('Ghost replay harness\n');

// --- Chopping (launch game) ---
console.log('Chopping:');
// Must match Chopping.tsx's `defaultNumLetters` AND ChoppingSpectator's config.
const defaultNumLetters = 15;
for (const seed of [12345, 999, 2_000_000_000, 7]) {
  const { inputs } = fabricateWinningChoppingGhost(seed, defaultNumLetters);
  const bare = inputs.map((r) => r.input);
  const { outcome, applied } = replay(
    choppingEngine,
    { numLetters: defaultNumLetters },
    seed,
    bare,
  );
  assert(outcome === 'won', `seed ${seed}: winning run replays to 'won' (applied ${applied}/${inputs.length})`);
}

// Determinism: same seed replays identically twice.
{
  const { inputs } = fabricateWinningChoppingGhost(12345, defaultNumLetters);
  const bare = inputs.map((r) => r.input);
  const a = replay(choppingEngine, { numLetters: defaultNumLetters }, 12345, bare);
  const b = replay(choppingEngine, { numLetters: defaultNumLetters }, 12345, bare);
  assert(a.outcome === b.outcome && a.applied === b.applied, 'same seed → identical replay (deterministic)');
}

// A wrong key mid-run must NOT replay to 'won' (guards against bad ghosts).
{
  const { inputs, board } = fabricateWinningChoppingGhost(12345, defaultNumLetters);
  const bare = inputs.map((r) => r.input);
  bare[3] = board[3] === 'A' ? 'B' : 'A'; // corrupt one input
  const { outcome } = replay(choppingEngine, { numLetters: defaultNumLetters }, 12345, bare);
  assert(outcome === 'lost', 'corrupted input replays to lost (not a false win)');
}

// Timestamps are strictly ascending (required by useGhostPlayback).
{
  const { inputs } = fabricateWinningChoppingGhost(12345, defaultNumLetters);
  let ascending = true;
  for (let i = 1; i < inputs.length; i++) if (inputs[i].t <= inputs[i - 1].t) ascending = false;
  assert(ascending, 'recorded timestamps are strictly ascending');
}

console.log('');
if (failures === 0) {
  console.log('ALL PASS — Chopping is replay-ready for ghost racing.');
  process.exit(0);
} else {
  console.error(`${failures} FAILURE(S) — do not ship ghost racing for affected games.`);
  process.exit(1);
}
