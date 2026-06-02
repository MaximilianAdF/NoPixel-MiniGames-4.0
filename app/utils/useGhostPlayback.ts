'use client';

import { useEffect, useRef, useState } from 'react';
import type { RecordedInput } from '@/lib/lobby/ghosts';

// Drives a recorded ghost run in real time. Given the ghost's timestamped
// inputs and the race start time (Date.now() frame), it returns the growing
// slice of inputs whose `t` has elapsed — exactly what arrives over the network
// in a live match. That slice feeds the existing per-game <Spectator> (which
// calls useReplayedState), so the ghost board advances at its true cadence
// instead of teleporting to the final state.
//
// Returns the bare engine inputs (not the {t,input} wrapper) so it's a drop-in
// replacement for the live `opponentInputs` array.
export function useGhostPlayback(
  recorded: RecordedInput[],
  startedAt: number | null,
): unknown[] {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Not started yet (e.g. still in countdown) — release nothing.
    if (startedAt === null) {
      setCount(0);
      return;
    }
    if (recorded.length === 0) {
      setCount(0);
      return;
    }

    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const elapsed = Date.now() - startedAt;
      // Inputs are recorded in ascending `t`; advance the released count to the
      // first input still in the future.
      let n = 0;
      while (n < recorded.length && recorded[n].t <= elapsed) n++;
      setCount((prev) => (prev === n ? prev : n));
      if (n < recorded.length) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [recorded, startedAt]);

  // Slice + unwrap to bare engine inputs. Memo-free: count changes drive it,
  // and the slice identity only needs to change when count does.
  const sliceRef = useRef<unknown[]>([]);
  const lastCountRef = useRef(-1);
  if (lastCountRef.current !== count) {
    lastCountRef.current = count;
    sliceRef.current = recorded.slice(0, count).map((r) => r.input);
  }
  return sliceRef.current;
}
