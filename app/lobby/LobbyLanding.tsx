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
            <GhostRaceCallout initialGame={searchParams?.get('ghost')} />

            {/* Live feed */}
            <PublicLobbyList lobbies={publicLobbies} onJoin={handleJoinPublic} />
          </>
        )}
      </div>

      {/* Ambient activity ticker — pinned to the bottom, cycles through the
          most recent finished matches. Hidden entirely when there's nothing
          to show (no fake filler). */}
      <RecentMatchesTicker matches={recentMatches} />
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

// "Race a ghost" — surfaces recorded runs you can challenge solo. Launch game
// is Chopping (most-played, best ghost feel); a future version can let you
// pick the game. Hides ghosts you've already raced (Option B); falls back to
// re-showing them rather than dead-ending.
function GhostRaceCallout({ initialGame }: { initialGame?: string | null }) {
  const router = useRouter();
  const game: GameType = (initialGame && initialGame in GAME_META
    ? (initialGame as GameType)
    : 'chopping');
  const [ghost, setGhost] = useState<GhostSummary | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/lobby/ghosts?game=${game}&sort=fast&limit=20`, { cache: 'no-store' });
        if (!res.ok) { if (!cancelled) setLoaded(true); return; }
        const data = (await res.json()) as { ghosts: GhostSummary[] };
        if (cancelled) return;
        const raced = new Set(getRacedGhostIds());
        // Prefer an unraced ghost (novelty); fall back to the fastest overall
        // so a player who's raced them all still gets a challenge.
        const unraced = data.ghosts.filter((g) => !raced.has(g.id));
        const pick = (unraced[0] ?? data.ghosts[0]) || null;
        setGhost(pick);
        setLoaded(true);
      } catch {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [game]);

  // Nothing to offer yet — render nothing (no empty filler).
  if (!loaded || !ghost) return null;

  const label = GAME_META[ghost.game]?.label ?? ghost.game;
  const time = (ghost.result.elapsedMs / 1000).toFixed(1);

  return (
    <section className="max-w-3xl mx-auto mb-16">
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-lg font-semibold text-white inline-flex items-center gap-2">
          <Ghost className="w-4 h-4 text-spring-green-400" />
          Race a ghost
        </h2>
        <span className="flex-1 h-px bg-white/10" />
        <span className="text-gray-500 text-xs">no opponent needed</span>
      </div>

      <button
        type="button"
        onClick={() => router.push(`/lobby/ghost/${ghost.id}`)}
        className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-br from-mirage-900/60 via-mirage-900/40 to-mirage-800/60 border border-spring-green-500/25 hover:border-spring-green-400/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-spring-green-500/10 hover:-translate-y-0.5 flex items-center gap-4 p-4 text-left"
      >
        <PlayerAvatar
          userId={ghost.recorderClientId}
          displayName={ghost.recorderName}
          discordId={ghost.recorderDiscordId}
          avatarHash={ghost.recorderAvatarHash}
          size={44}
          linkable={false}
        />
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-semibold truncate">
            Beat {ghost.recorderName}&apos;s run
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

function RecentMatchesTicker({ matches }: { matches: RecentMatch[] }) {
  const [idx, setIdx] = useState(0);
  // Re-render once a minute so the "Xm ago" label stays current without a fetch.
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (matches.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % matches.length), 3500);
    return () => clearInterval(t);
  }, [matches.length]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  // Keep the index valid as the feed shrinks/grows.
  useEffect(() => {
    if (idx >= matches.length) setIdx(0);
  }, [matches.length, idx]);

  if (matches.length === 0) return null;
  const m = matches[Math.min(idx, matches.length - 1)];
  const label = GAME_META[m.game]?.label ?? m.game;
  const seconds = (m.durationMs / 1000).toFixed(1);
  const when = timeAgo(m.endedAt, now);

  return (
    <div className="sticky bottom-0 z-20 w-full border-t border-white/[0.06] bg-mirage-950/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3 text-sm">
        <span className="inline-flex items-center gap-1.5 text-spring-green-400 shrink-0">
          <Swords className="w-3.5 h-3.5" />
          <span className="text-xs font-mono uppercase tracking-wider hidden sm:inline">
            Latest
          </span>
        </span>
        {/* key on endedAt+idx so each change re-triggers the fade-in */}
        <p
          key={`${m.endedAt}-${idx}`}
          className="min-w-0 flex-1 truncate text-gray-300 animate-fade-in"
        >
          {m.winnerName ? (
            <>
              <span className="text-white font-semibold">{m.winnerName}</span>
              <span className="text-gray-500"> beat </span>
              <span className="text-gray-300">{m.opponentName ?? 'their opponent'}</span>
            </>
          ) : (
            <span className="text-gray-300">A match ended in a draw</span>
          )}
          <span className="text-gray-600"> · </span>
          <span className="text-gray-400">{label}</span>
          <span className="text-gray-600"> · </span>
          <span className="text-gray-500 font-mono tabular-nums">{seconds}s</span>
          {when && (
            <>
              <span className="text-gray-600"> · </span>
              <span className="text-gray-500">{when}</span>
            </>
          )}
        </p>
        <Trophy className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
      </div>
    </div>
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
