'use client';

import { useEffect } from 'react';

// Self-heals post-deploy chunk skew. When a new deploy rotates JS/CSS chunk
// hashes, a user still on the old HTML requests chunks that no longer exist and
// hits ChunkLoadError / "Failed to fetch dynamically imported module", which
// breaks navigation until they manually refresh. We catch those and hard-reload
// ONCE to pull fresh HTML + valid chunks. A short timestamp guard prevents a
// reload loop if the failure isn't actually skew.
const CHUNK_RE =
  /ChunkLoadError|Loading chunk [\w-]+ failed|Loading CSS chunk|Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i;

const GUARD_KEY = 'chunkReloadAt';
const GUARD_WINDOW_MS = 20000;

function isChunkError(err: unknown): boolean {
  if (!err) return false;
  if (typeof err === 'string') return CHUNK_RE.test(err);
  const e = err as { name?: string; message?: string };
  return CHUNK_RE.test(e.name || '') || CHUNK_RE.test(e.message || '');
}

function reloadOnce() {
  try {
    const last = Number(sessionStorage.getItem(GUARD_KEY) || '0');
    // Already reloaded moments ago — the error is likely not skew; don't loop.
    if (Date.now() - last < GUARD_WINDOW_MS) return;
    sessionStorage.setItem(GUARD_KEY, String(Date.now()));
  } catch {
    // sessionStorage unavailable — proceed with a single best-effort reload.
  }
  window.location.reload();
}

export default function ChunkReloader() {
  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      if (isChunkError(e.error) || isChunkError(e.message)) reloadOnce();
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      if (isChunkError(e.reason)) reloadOnce();
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return null;
}
