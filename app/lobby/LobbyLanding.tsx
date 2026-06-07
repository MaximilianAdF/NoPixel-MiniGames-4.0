'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Ghost, Loader2, Plus, Swords, Trophy } from 'lucide-react';
import { useUser } from '@/app/contexts/UserContext';
import { orbitron } from '@/app/fonts';
import { generateLobbyCode, isValidLobbyCode } from '@/lib/lobby/code';
import { trackLobbyCreated, trackLobbyJoined } from '@/app/utils/gtm';
import PlayerAvatar from '@/app/components/PlayerAvatar';
import { getRacedGhostIds } from '@/app/lobby/ghostHistory';
import { isGhostEnabled } from '@/lib/lobby/ghostGames';
import type { GameType } from '@/interfaces/user';

interface PublicLobby {
  code: string;
  hostName: string;
  hostDiscordId?: string;
  hostAvatarHash?: string;
  hostClientId: string;
  playerCount: number;
  suggestedGame?: GameType;
}

interface RecentMatch {
  game: GameType;
  winnerName: string | null;
  opponentName: string | null;
  durationMs: number;
  endedAt: string;
}

// Per-game metadata (label + cache-busted thumbnail). Same thumbnails the
// home page uses, so the lobby reads as part of the same product.
const GAME_META: Record<GameType, { label: string; img: string }> = {
  thermite: { label: 'Thermite', img: '/puzzles/thermite.png?v=3' },
  lockpick: { label: 'Lockpick', img: '/puzzles/lockpick.png?v=3' },
  laundromat: { label: 'Laundromat', img: '/puzzles/laundromat.png?v=3' },
  pincracker: { label: 'Pin Cracker', img: '/puzzles/pincracker.png?v=3' },
  'roof-running': { label: 'Roof Running', img: '/puzzles/roof-running.png?v=3' },
  'word-memory': { label: 'Word Memory', img: '/puzzles/word-memory.png?v=3' },
  chopping: { label: 'Chopping', img: '/puzzles/chopping.png?v=3' },
  'repair-kit': { label: 'Repair Kit', img: '/puzzles/repair-kit.png?v=3' },
};

export default function LobbyLanding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading } = useUser();
  const [error, setError] = useState('');
  const [publicLobbies, setPublicLobbies] = useState<PublicLobby[] | null>(null);
  const [recentMatches, setRecentMatches] = useState<RecentMatch[]>([]);
  const [fullNotice, setFullNotice] = useState(searchParams?.get('full') === '1');
  const [code, setCode] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/lobby/public', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as { lobbies: PublicLobby[] };
        if (!cancelled) setPublicLobbies(data.lobbies);
      } catch {
        // Listing is best-effort.
      }
    };
    void load();
    // Poll every 4s so filled / abandoned / privated lobbies drop off the
    // list quickly, and refetch immediately whenever the tab regains focus
    // (covers the gap between polls when someone tabs back in).
    const interval = setInterval(load, 4000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') void load();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, []);

  // Recent finished matches — refreshed on a slower cadence than the lobby
  // list since the feed is ambient flavour, not something you act on.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/lobby/recent-matches', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as { matches: RecentMatch[] };
        if (!cancelled) setRecentMatches(data.matches);
      } catch {
        // Cosmetic — ignore.
      }
    };
    void load();
    const interval = setInterval(load, 20000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const codeReady = code.length === 6 && isValidLobbyCode(code);

  const handleCodeChange = (raw: string) => {
    // Uppercase, strip anything that isn't a code char, cap at 6.
    setCode(raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6));
    if (error) setError('');
  };

  const handleCreate = () => {
    const fresh = generateLobbyCode();
    trackLobbyCreated({ lobby_code: fresh });
    // Durable counter (GA4-independent). Fire-and-forget; navigation follows.
    void fetch('/api/lobby/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'lobby_created' }),
    }).catch(() => {});
    router.push(`/lobby/${fresh}`);
  };

  const handleJoin = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!codeReady) {
      setError('Enter the 6-character code');
      inputRef.current?.focus();
      return;
    }
    trackLobbyJoined({ lobby_code: code });
    router.push(`/lobby/${code}`);
  };

  const handleJoinPublic = (joinCode: string) => {
    trackLobbyJoined({ lobby_code: joinCode });
    router.push(`/lobby/${joinCode}`);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center bg-gradient-to-br from-mirage-950 via-mirage-900 to-mirage-950">
      <LobbyBackdrop />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top utility row */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-gray-400 hover:text-spring-green-300 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>
          <LiveBadge count={publicLobbies?.length} />
        </div>

        {/* Hero */}
        <header className="text-center pt-12 pb-10 sm:pt-16 sm:pb-12">
          <h1
            className={`${orbitron.className} text-6xl sm:text-7xl md:text-8xl font-black leading-none text-white`}
            style={{ letterSpacing: '0.04em' }}
          >
            1<span className="text-spring-green-400">v</span>1
          </h1>
          <p className="mt-4 text-gray-400 text-base sm:text-lg">
            Go head-to-head on the same minigame — fastest finish wins.
          </p>
        </header>

        {fullNotice && (
          <div
            role="status"
            className="mx-auto max-w-md mb-8 rounded-lg border border-amber-400/30 bg-amber-400/[0.06] px-4 py-3 text-amber-200 text-sm flex items-center justify-between gap-3"
          >
            <span>That lobby filled up. Try another below.</span>
            <button
              type="button"
              onClick={() => setFullNotice(false)}
              className="text-amber-300/80 hover:text-amber-200 shrink-0"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64" aria-busy="true">
            <Loader2 className="w-6 h-6 text-spring-green-400/50 animate-spin" />
          </div>
        ) : (
          <>
            {/* Single focused action card: create (primary) + join by code */}
            <section className="max-w-md mx-auto mb-16">
              <div className="rounded-xl bg-gradient-to-br from-mirage-900/80 to-mirage-950/80 border-2 border-spring-green-500/30 p-6 sm:p-7 shadow-lg shadow-spring-green-900/10">
                <button
                  type="button"
                  onClick={handleCreate}
                  className="group/btn relative w-full overflow-hidden rounded-lg bg-spring-green-500 hover:bg-spring-green-400 text-mirage-950 py-3.5 font-bold tracking-wide transition-all duration-200 active:scale-[0.99] shadow-lg shadow-spring-green-500/20 hover:shadow-spring-green-500/40 inline-flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" strokeWidth={3} />
                  Create a lobby
                  <ArrowRight className="w-4 h-4 -translate-x-1 opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all" />
                </button>

                {/* divider */}
                <div className="flex items-center gap-3 my-5">
                  <span className="h-px flex-1 bg-white/10" />
                  <span className="text-gray-500 text-xs">or join with a code</span>
                  <span className="h-px flex-1 bg-white/10" />
                </div>

                <form onSubmit={handleJoin} className="space-y-3">
                  <input
                    ref={inputRef}
                    value={code}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    onFocus={(e) => e.currentTarget.select()}
                    inputMode="text"
                    autoCapitalize="characters"
                    autoComplete="off"
                    spellCheck={false}
                    maxLength={6}
                    placeholder="ABC123"
                    aria-label="Lobby code"
                    className={`${orbitron.className} w-full rounded-lg bg-mirage-950/60 border border-white/10 focus:border-spring-green-400/60 focus:ring-2 focus:ring-spring-green-500/20 focus:outline-none text-center text-2xl sm:text-3xl font-bold tracking-[0.3em] uppercase text-white placeholder-white/15 py-3 transition-all`}
                  />
                  {error && (
                    <p className="text-error-400 text-xs text-center">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={!codeReady}
                    className="w-full rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-spring-green-400/40 text-white/90 hover:text-spring-green-300 py-3 font-semibold tracking-wide transition-all duration-200 active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/[0.04] disabled:hover:border-white/10 disabled:hover:text-white/90 inline-flex items-center justify-center gap-2"
                  >
                    Join lobby
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </section>

            {/* Race a ghost — recorded runs you can challenge solo, so there's
                always something to play even with nobody else online. */}
            <GhostRaceSection initialGame={searchParams?.get('ghost')} />

            {/* Live feed */}
            <PublicLobbyList lobbies={publicLobbies} onJoin={handleJoinPublic} />

            {/* Recent finished matches — readable list (not a ticker). */}
            <RecentMatchesSection matches={recentMatches} />
          </>
        )}
      </div>
    </main>
  );
}

interface GhostSummary {
  id: string;
  game: GameType;
  recorderName: string;
  recorderDiscordId?: string;
  recorderAvatarHash?: string;
  recorderClientId: string;
  result: { won: boolean; score: number; elapsedMs: number };
  timesRaced: number;
  timesBeaten: number;
}

// "Race a ghost" — a browsable list of recorded runs you can challenge solo,
// fastest first. Ghosts you've already raced are de-emphasised (greyed +
// "raced" tag) rather than hidden, so the list never looks empty and you can
// always replay. Launch game is Chopping (most-played, best ghost feel).
function GhostRaceSection({ initialGame }: { initialGame?: string | null }) {
  const router = useRouter();
  // Only ghost-enabled games are raceable; fall back to Chopping for anything
  // else (incl. a stale/unsupported ?ghost= param).
  const game: GameType =
    initialGame && isGhostEnabled(initialGame as GameType)
      ? (initialGame as GameType)
      : 'chopping';
  const [ghosts, setGhosts] = useState<GhostSummary[] | null>(null);
  const [racedIds, setRacedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setRacedIds(new Set(getRacedGhostIds()));
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/lobby/ghosts?game=${game}&sort=fast&limit=12`, { cache: 'no-store' });
        if (!res.ok) { if (!cancelled) setGhosts([]); return; }
        const data = (await res.json()) as { ghosts: GhostSummary[] };
        if (!cancelled) setGhosts(data.ghosts);
      } catch {
        if (!cancelled) setGhosts([]);
      }
    })();
    return () => { cancelled = true; };
  }, [game]);

  // Don't render the section at all until we know there's something to show —
  // avoids a flash of an empty "Race a ghost" header.
  if (ghosts === null || ghosts.length === 0) return null;

  // Unraced first (novelty), then already-raced (still replayable), each group
  // kept in fastest-first order from the API.
  const ordered = [...ghosts].sort((a, b) => {
    const ar = racedIds.has(a.id) ? 1 : 0;
    const br = racedIds.has(b.id) ? 1 : 0;
    return ar - br;
  });
  const label = GAME_META[game]?.label ?? game;

  return (
    <section className="max-w-3xl mx-auto mb-16">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-lg font-semibold text-white inline-flex items-center gap-2">
          <Ghost className="w-4 h-4 text-spring-green-400" />
          Race a ghost
        </h2>
        <span className="flex-1 h-px bg-white/10" />
        <span className="text-gray-500 text-xs">no opponent needed</span>
      </div>
      <p className="text-gray-500 text-xs mb-5">
        Beat a recorded run from a past {label} match — same board, racing their ghost in real time.
      </p>

      <ul className="space-y-2">
        {ordered.map((ghost) => {
          const raced = racedIds.has(ghost.id);
          const time = (ghost.result.elapsedMs / 1000).toFixed(1);
          return (
            <li key={ghost.id}>
              <button
                type="button"
                onClick={() => router.push(`/lobby/ghost/${ghost.id}`)}
                className={`group relative w-full overflow-hidden rounded-lg border transition-all duration-200 flex items-center gap-3 p-3 text-left ${
                  raced
                    ? 'bg-mirage-900/30 border-white/[0.06] hover:border-spring-green-500/30 opacity-70 hover:opacity-100'
                    : 'bg-gradient-to-br from-mirage-900/60 via-mirage-900/40 to-mirage-800/60 border-spring-green-500/25 hover:border-spring-green-400/60 shadow-lg hover:shadow-spring-green-500/10 hover:-translate-y-0.5'
                }`}
              >
                <PlayerAvatar
                  userId={ghost.recorderClientId}
                  displayName={ghost.recorderName}
                  discordId={ghost.recorderDiscordId}
                  avatarHash={ghost.recorderAvatarHash}
                  size={36}
                  linkable={false}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-semibold truncate flex items-center gap-2">
                    {ghost.recorderName}
                    {raced && (
                      <span className="text-[9px] font-mono uppercase tracking-wider text-gray-500 border border-white/10 rounded px-1 py-0.5">
                        raced
                      </span>
                    )}
                  </div>
                  <div className="text-gray-500 text-[11px] font-mono uppercase tracking-wider mt-0.5">
                    {label} · {time}s
                    {ghost.timesRaced > 0 && (
                      <span className="text-gray-600"> · beaten {ghost.timesBeaten}/{ghost.timesRaced}</span>
                    )}
                  </div>
                </div>
                <span className="inline-flex items-center text-spring-green-400 text-xs font-mono font-semibold tracking-wider group-hover:text-spring-green-300 shrink-0">
                  RACE
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* Bottom activity ticker — fades through recent matches one at a time. */
// Compact relative time: "just now", "5m ago", "3h ago", "2d ago".
// Falls back to a date once it's older than a week.
function timeAgo(iso: string, now: number): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return '';
  const diff = Math.max(0, now - then);
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(then).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// Recent finished matches as a readable list (newest first). Replaces the old
// one-line cycling ticker, which was cramped and hard to follow.
function RecentMatchesSection({ matches }: { matches: RecentMatch[] }) {
  // Re-render once a minute so the "Xm ago" labels stay current without refetch.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  if (matches.length === 0) return null;
  const shown = matches.slice(0, 6);

  return (
    <section className="max-w-3xl mx-auto pb-20">
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-lg font-semibold text-white inline-flex items-center gap-2">
          <Swords className="w-4 h-4 text-spring-green-400" />
          Recent matches
        </h2>
        <span className="flex-1 h-px bg-white/10" />
      </div>

      <ul className="space-y-1.5">
        {shown.map((m, i) => {
          const label = GAME_META[m.game]?.label ?? m.game;
          const seconds = (m.durationMs / 1000).toFixed(1);
          const when = timeAgo(m.endedAt, now);
          return (
            <li
              key={`${m.endedAt}-${i}`}
              className="flex items-center gap-3 rounded-lg bg-mirage-900/30 border border-white/[0.06] px-3 py-2.5"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
              <div className="flex-1 min-w-0 text-sm truncate">
                {m.winnerName ? (
                  <>
                    <span className="text-white font-semibold">{m.winnerName}</span>
                    <span className="text-gray-500"> beat </span>
                    <span className="text-gray-300">{m.opponentName ?? 'their opponent'}</span>
                  </>
                ) : (
                  <span className="text-gray-300">Match ended in a draw</span>
                )}
              </div>
              <span className="text-gray-400 text-xs hidden sm:inline shrink-0">{label}</span>
              <span className="text-gray-500 text-xs font-mono tabular-nums shrink-0 w-12 text-right">{seconds}s</span>
              {when && (
                <span className="text-gray-600 text-xs shrink-0 w-16 text-right">{when}</span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
 * Backdrop — mirrors the home page exactly: faint green grid +
 * two soft ambient glow blobs over the mirage gradient.
 * ─────────────────────────────────────────────────────────*/
function LobbyBackdrop() {
  return (
    <>
      <div className="fixed inset-0 opacity-10 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(9, 222, 110, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(9, 222, 110, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none opacity-20"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-spring-green-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-aquamarine-500/10 rounded-full blur-2xl" />
      </div>
    </>
  );
}

/* Live-count chip — minimal, mono. */
function LiveBadge({ count }: { count: number | undefined }) {
  if (count === undefined) {
    return (
      <span className="inline-flex items-center gap-2 text-gray-500 text-xs font-mono">
        <Loader2 className="w-3 h-3 animate-spin" />
        loading
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-xs font-mono">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-spring-green-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-spring-green-400" />
      </span>
      <span className="text-spring-green-300 font-semibold tabular-nums">
        {count} <span className="text-gray-500">live</span>
      </span>
    </span>
  );
}

/* ──────────────────────────────────────────────────────────
 * Public lobby list.
 * ─────────────────────────────────────────────────────────*/
function PublicLobbyList({
  lobbies,
  onJoin,
}: {
  lobbies: PublicLobby[] | null;
  onJoin: (code: string) => void;
}) {
  const [gameFilter, setGameFilter] = useState<GameType | null>(null);

  const byGame = useMemo(() => {
    const map = new Map<GameType, number>();
    if (!lobbies) return map;
    for (const lobby of lobbies) {
      if (!lobby.suggestedGame) continue;
      map.set(lobby.suggestedGame, (map.get(lobby.suggestedGame) ?? 0) + 1);
    }
    return map;
  }, [lobbies]);

  useEffect(() => {
    if (gameFilter && lobbies && !byGame.has(gameFilter)) {
      setGameFilter(null);
    }
  }, [gameFilter, lobbies, byGame]);

  const filtered = useMemo(() => {
    if (!lobbies) return null;
    if (!gameFilter) return lobbies;
    return lobbies.filter((l) => l.suggestedGame === gameFilter);
  }, [lobbies, gameFilter]);

  return (
    <section className="pb-20">
      <div className="flex items-baseline gap-3 mb-5">
        <h2 className="text-lg font-semibold text-white">Open lobbies</h2>
        {lobbies && lobbies.length > 0 && (
          <span className="text-gray-500 text-sm tabular-nums">
            {filtered?.length ?? 0}
          </span>
        )}
        <span className="flex-1 h-px bg-white/10" />
      </div>

      {/* Game filter chips */}
      {lobbies && lobbies.length > 0 && byGame.size > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterChip
            label="All"
            count={lobbies.length}
            active={gameFilter === null}
            onClick={() => setGameFilter(null)}
          />
          {Array.from(byGame.entries()).map(([game, count]) => (
            <FilterChip
              key={game}
              label={GAME_META[game].label}
              count={count}
              active={gameFilter === game}
              onClick={() => setGameFilter(game)}
            />
          ))}
        </div>
      )}

      {filtered === null ? (
        <div className="h-40 rounded-lg bg-mirage-900/40 border border-white/[0.06] flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-spring-green-400/40 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="grid sm:grid-cols-2 gap-3">
          {filtered.map((lobby) => (
            <LobbyRow key={lobby.code} lobby={lobby} onJoin={onJoin} />
          ))}
        </ul>
      )}
    </section>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
        active
          ? 'bg-spring-green-500/15 border-spring-green-500/50 text-spring-green-300'
          : 'bg-white/[0.03] border-white/[0.08] text-gray-400 hover:bg-white/[0.06] hover:border-white/15 hover:text-white/90'
      }`}
    >
      <span>{label}</span>
      <span
        className={`text-[10px] font-mono tabular-nums px-1.5 rounded ${
          active ? 'bg-spring-green-500/15 text-spring-green-300/90' : 'bg-white/[0.06] text-gray-500'
        }`}
      >
        {count}
      </span>
    </button>
  );
}

/* Single open lobby — home-style card: thumbnail tile + host + join. */
function LobbyRow({
  lobby,
  onJoin,
}: {
  lobby: PublicLobby;
  onJoin: (code: string) => void;
}) {
  const meta = lobby.suggestedGame ? GAME_META[lobby.suggestedGame] : null;
  return (
    <li>
      <button
        type="button"
        onClick={() => onJoin(lobby.code)}
        className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-br from-mirage-900/50 via-mirage-900/40 to-mirage-800/50 border border-spring-green-500/20 hover:border-spring-green-400/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-spring-green-500/10 hover:-translate-y-1 flex items-stretch min-h-[6.5rem] text-left"
      >
        {/* Thumbnail tile */}
        <div className="relative w-32 sm:w-36 shrink-0 border-r border-spring-green-500/10 overflow-hidden flex items-center justify-center">
          <div
            aria-hidden
            className="absolute inset-3 rounded-md bg-[radial-gradient(ellipse_at_center,rgba(84,255,164,0.10),transparent_70%)] opacity-50 group-hover:opacity-100 transition-opacity duration-500"
          />
          {meta ? (
            <Image
              src={meta.img}
              alt={meta.label}
              width={160}
              height={120}
              className="relative w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105 [filter:drop-shadow(0_4px_10px_rgba(0,0,0,0.5))]"
              unoptimized
            />
          ) : (
            <div className="text-gray-600 text-[10px] uppercase tracking-wider font-mono text-center">
              no game
            </div>
          )}
          <span className="absolute top-2 left-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-spring-green-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-spring-green-400" />
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0 p-3 sm:p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <PlayerAvatar
                userId={lobby.hostClientId}
                displayName={lobby.hostName}
                discordId={lobby.hostDiscordId}
                avatarHash={lobby.hostAvatarHash}
                size={22}
                linkable={false}
              />
              <span className="text-white text-sm font-semibold truncate">
                {lobby.hostName}
              </span>
            </div>
            <div className="text-gray-500 text-[11px] font-mono uppercase tracking-wider truncate">
              {meta ? meta.label : 'no game selected'}
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-gray-500 font-mono tabular-nums">
              {lobby.playerCount}/2
            </span>
            <span className="inline-flex items-center text-spring-green-400 text-xs font-mono font-semibold tracking-wider group-hover:text-spring-green-300">
              <span className="mr-1 text-spring-green-500/60">›</span>
              JOIN
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </button>
    </li>
  );
}

/* Empty state — plain, no decoration. */
function EmptyState() {
  return (
    <div className="rounded-lg border border-white/[0.06] px-6 py-12 text-center">
      <p className="text-gray-400 text-sm">
        No open lobbies right now. Create one to get started.
      </p>
    </div>
  );
}
