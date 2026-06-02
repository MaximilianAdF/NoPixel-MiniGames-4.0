'use client';

// Per-player "already raced" tracking for ghost mode (Option B in
// docs/async-ghost-spec.md). Guests have no account, so we track raced ghost
// ids in localStorage and filter the picker client-side. Logged-in server-side
// tracking is a later refinement; localStorage is a fine baseline for both.
//
// Capped + FIFO-trimmed so the list can't grow unbounded.

const KEY = 'racedGhostIds';
const MAX = 500;

export function getRacedGhostIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function markGhostRaced(id: string): void {
  if (typeof window === 'undefined' || !id) return;
  try {
    const existing = getRacedGhostIds();
    if (existing.includes(id)) return;
    const next = [...existing, id];
    // Keep the most recent MAX ids.
    const trimmed = next.length > MAX ? next.slice(next.length - MAX) : next;
    window.localStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {
    // Storage full / disabled — non-fatal, the picker just won't hide it.
  }
}

export function hasRacedGhost(id: string): boolean {
  return getRacedGhostIds().includes(id);
}
