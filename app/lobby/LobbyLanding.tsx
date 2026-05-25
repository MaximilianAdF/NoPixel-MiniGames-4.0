'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Plus,
  Radio,
  Sparkles,
  Users,
} from 'lucide-react';
import { useUser } from '@/app/contexts/UserContext';
import { orbitron } from '@/app/fonts';
import { generateLobbyCode, isValidLobbyCode } from '@/lib/lobby/code';
import { trackLobbyCreated, trackLobbyJoined } from '@/app/utils/gtm';
import PlayerAvatar from '@/app/components/PlayerAvatar';
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

// Per-game metadata (label + cache-busted thumbnail). Single source of
// truth used by the empty-state grid and by the open-lobby rows so the
// landing page always looks like the home page.
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

const ALL_GAMES = Object.keys(GAME_META) as GameType[];

export default function LobbyLanding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading } = useUser();
  const [error, setError] = useState('');
  const [publicLobbies, setPublicLobbies] = useState<PublicLobby[] | null>(null);
  const [fullNotice, setFullNotice] = useState(searchParams?.get('full') === '1');

  // Six-char code input split into six boxes for a HUD feel; the state is
  // a single 6-element array so backspace can hop slots and submit gates
  // on "all filled".
  const [codeChars, setCodeChars] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
    const interval = setInterval(load, 7000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const joinedCode = codeChars.join('');
  const codeReady = joinedCode.length === 6 && isValidLobbyCode(joinedCode);

  const setCharAt = (idx: number, raw: string) => {
    // Allow paste of a full 6-char string into any box.
    const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleaned.length > 1) {
      const next = ['', '', '', '', '', ''];
      for (let i = 0; i < 6 && i < cleaned.length; i++) {
        next[i] = cleaned[i];
      }
      setCodeChars(next);
      const lastFilled = Math.min(cleaned.length, 6) - 1;
      inputRefs.current[Math.min(lastFilled + 1, 5)]?.focus();
      return;
    }
    const next = [...codeChars];
    next[idx] = cleaned;
    setCodeChars(next);
    if (cleaned && idx < 5) inputRefs.current[idx + 1]?.focus();
    if (error) setError('');
  };

  const onKeyDownChar = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !codeChars[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && idx > 0) inputRefs.current[idx - 1]?.focus();
    if (e.key === 'ArrowRight' && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleCreate = () => {
    const code = generateLobbyCode();
    trackLobbyCreated({ lobby_code: code });
    router.push(`/lobby/${code}`);
  };

  const handleJoin = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!codeReady) {
      setError('Code must be 6 characters');
      return;
    }
    trackLobbyJoined({ lobby_code: joinedCode });
    router.push(`/lobby/${joinedCode}`);
  };

  const handleJoinPublic = (code: string) => {
    trackLobbyJoined({ lobby_code: code });
    router.push(`/lobby/${code}`);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Ambient scenography */}
      <BackgroundFx />

      {/* Sticky top utility bar: leave button + live count. Echoes a
          broadcast lower-third / HUD overlay. */}
      <div className="relative z-10 pt-6 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-mirage-900/70 backdrop-blur-sm border border-white/[0.08] text-white/65 hover:text-spring-green-300 hover:border-spring-green-300/60 transition-all"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to home</span>
        </Link>
        <LiveBadge count={publicLobbies?.length} />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-10 md:pt-14 pb-24">
        {fullNotice && (
          <div
            role="status"
            className="mx-auto max-w-2xl mb-10 rounded-xl border border-amber-400/30 bg-amber-400/[0.06] px-4 py-3 text-amber-200 text-xs flex items-center justify-between gap-3"
          >
            <span>That lobby filled up before you got in. Try another below.</span>
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

        {/* Hero */}
        <header className="text-center mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 text-spring-green-300 text-[10px] uppercase tracking-[0.35em] font-bold mb-6">
            <span className="inline-block w-8 h-px bg-spring-green-300/60" />
            Head to head
            <span className="inline-block w-8 h-px bg-spring-green-300/60" />
          </div>
          <h1
            className={`${orbitron.className} text-6xl sm:text-7xl md:text-8xl font-black mb-4 leading-[0.9]`}
            style={{
              color: 'transparent',
              backgroundImage:
                'linear-gradient(135deg, #ffffff 0%, #d8fff0 30%, #54FFA4 70%, #54FFA4 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
              textShadow: '0 0 80px rgba(84, 255, 164, 0.15)',
            }}
          >
            1V1 MODE
          </h1>
          <p className="text-white/55 text-base md:text-lg max-w-xl mx-auto">
            Race a friend on the same minigame. Same seed, same start,
            <br className="hidden sm:block" /> fastest finish wins.
          </p>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center h-72" aria-busy="true">
            <Loader2 className="w-6 h-6 text-white/30 animate-spin" />
          </div>
        ) : (
          <>
            {/* Two-up action panel: Create | Join. On mobile they stack. */}
            <section className="grid md:grid-cols-2 gap-4 md:gap-6 mb-14 md:mb-16">
              <CreatePanel onCreate={handleCreate} />
              <JoinPanel
                codeChars={codeChars}
                inputRefs={inputRefs}
                onCharChange={setCharAt}
                onKeyDownChar={onKeyDownChar}
                onSubmit={handleJoin}
                ready={codeReady}
                error={error}
              />
            </section>

            {/* Live feed */}
            <PublicLobbyList
              lobbies={publicLobbies}
              onJoin={handleJoinPublic}
            />
          </>
        )}
      </main>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
 * Background — soft green pool at top + faint terminal grid.
 * Heavier than the previous version to set the "arena" mood.
 * ─────────────────────────────────────────────────────────*/
function BackgroundFx() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[42rem] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80rem 45rem at 50% -10%, rgba(84,255,164,0.14) 0%, transparent 55%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(84,255,164,1) 1px, transparent 1px), linear-gradient(90deg, rgba(84,255,164,1) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse 70rem 50rem at 50% 30%, black 0%, transparent 75%)',
        }}
      />
    </>
  );
}

/* Live-count chip — top right, broadcast-overlay style. */
function LiveBadge({ count }: { count: number | undefined }) {
  if (count === undefined) {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-mirage-900/70 backdrop-blur-sm border border-white/[0.08] text-white/40 text-xs">
        <Loader2 className="w-3 h-3 animate-spin" />
        Loading…
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-mirage-900/70 backdrop-blur-sm border border-spring-green-300/30 text-xs">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-spring-green-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-spring-green-400" />
      </span>
      <span className="text-spring-green-200 font-semibold tracking-wider uppercase text-[10px]">
        {count} live
      </span>
    </span>
  );
}

/* ──────────────────────────────────────────────────────────
 * CREATE panel — primary CTA. The button gets the strongest
 * visual weight on the page.
 * ─────────────────────────────────────────────────────────*/
function CreatePanel({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="relative group rounded-2xl border border-spring-green-300/30 bg-gradient-to-br from-spring-green-300/[0.06] to-transparent p-6 md:p-8 overflow-hidden">
      {/* Corner brackets — terminal frame */}
      <CornerBrackets />

      <div className="relative">
        <div className="inline-flex items-center gap-1.5 text-spring-green-300/85 text-[10px] uppercase tracking-[0.3em] font-bold mb-3">
          <Sparkles className="w-3 h-3" />
          Host
        </div>
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
          Create a lobby
        </h2>
        <p className="text-white/50 text-sm leading-relaxed mb-6">
          Spin up a fresh room and pick the minigame.
          Share the code with a friend, or publish it for anyone to join.
        </p>

        <button
          type="button"
          onClick={onCreate}
          className="group/btn relative w-full rounded-xl bg-gradient-to-r from-spring-green-300 to-spring-green-400 hover:from-spring-green-200 hover:to-spring-green-300 text-mirage-950 py-4 font-bold text-base transition-all duration-200 active:scale-[0.99] shadow-lg shadow-spring-green-500/20 hover:shadow-spring-green-500/40 overflow-hidden"
        >
          <span className="relative z-10 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" strokeWidth={3} />
            CREATE ROOM
            <ArrowRight className="w-4 h-4 -translate-x-1 opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all" />
          </span>
          <span
            aria-hidden
            className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
          />
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
 * JOIN panel — six-char HUD code input. Each character gets
 * its own little box, like an unlock keypad.
 * ─────────────────────────────────────────────────────────*/
function JoinPanel({
  codeChars,
  inputRefs,
  onCharChange,
  onKeyDownChar,
  onSubmit,
  ready,
  error,
}: {
  codeChars: string[];
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onCharChange: (idx: number, raw: string) => void;
  onKeyDownChar: (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
  ready: boolean;
  error: string;
}) {
  return (
    <div className="relative rounded-2xl border border-white/[0.08] bg-mirage-900/40 p-6 md:p-8 overflow-hidden">
      <CornerBrackets />

      <div className="relative">
        <div className="inline-flex items-center gap-1.5 text-white/55 text-[10px] uppercase tracking-[0.3em] font-bold mb-3">
          <Users className="w-3 h-3" />
          Join
        </div>
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
          Have a code?
        </h2>
        <p className="text-white/50 text-sm leading-relaxed mb-6">
          Enter the 6-character lobby code your friend gave you.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div
            className="flex items-center justify-between gap-1.5 sm:gap-2"
            role="group"
            aria-label="Lobby code"
          >
            {codeChars.map((ch, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                value={ch}
                onChange={(e) => onCharChange(i, e.target.value)}
                onKeyDown={(e) => onKeyDownChar(i, e)}
                onFocus={(e) => e.currentTarget.select()}
                maxLength={6}
                inputMode="text"
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                aria-label={`Code character ${i + 1}`}
                className={`${orbitron.className} flex-1 min-w-0 aspect-square max-h-16 rounded-lg bg-white/[0.04] border border-white/[0.08] focus:border-spring-green-300/60 focus:bg-spring-green-300/[0.06] focus:ring-2 focus:ring-spring-green-300/20 focus:outline-none text-center text-2xl sm:text-3xl uppercase font-bold text-white placeholder-white/15 transition-all`}
                placeholder="·"
              />
            ))}
          </div>

          {error && (
            <p className="text-red-400/85 text-xs text-center -mt-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={!ready}
            className="w-full rounded-xl bg-white/[0.06] hover:bg-spring-green-300/[0.12] border border-white/[0.08] hover:border-spring-green-300/40 text-white/90 hover:text-spring-green-200 py-3.5 font-semibold transition-all duration-200 active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/[0.06] disabled:hover:border-white/[0.08] disabled:hover:text-white/90 inline-flex items-center justify-center gap-2"
          >
            JOIN LOBBY
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

/* Decorative L-shaped corner brackets — terminal frame motif. */
function CornerBrackets() {
  return (
    <>
      <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-spring-green-300/40 rounded-tl-2xl pointer-events-none" />
      <span className="absolute top-0 right-0 w-4 h-4 border-t border-r border-spring-green-300/40 rounded-tr-2xl pointer-events-none" />
      <span className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-spring-green-300/40 rounded-bl-2xl pointer-events-none" />
      <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-spring-green-300/40 rounded-br-2xl pointer-events-none" />
    </>
  );
}

/* ──────────────────────────────────────────────────────────
 * Public lobby list — broadcast-feed style. Each open lobby
 * shows the minigame thumbnail prominently.
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
    <section>
      <div className="flex items-center gap-3 mb-5">
        <Radio className="w-4 h-4 text-spring-green-300" />
        <h2 className="text-white/85 text-sm font-bold uppercase tracking-[0.2em]">
          Live Lobbies
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-white/15 to-transparent" />
        {lobbies && (
          <span className="text-white/40 text-[11px] font-mono tabular-nums">
            {filtered?.length ?? 0} / {lobbies.length}
          </span>
        )}
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
        <div className="h-40 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-white/30 animate-spin" />
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
          ? 'bg-spring-green-300/15 border-spring-green-300/55 text-spring-green-200'
          : 'bg-white/[0.03] border-white/[0.08] text-white/65 hover:bg-white/[0.06] hover:border-white/15 hover:text-white/90'
      }`}
    >
      <span>{label}</span>
      <span
        className={`text-[10px] font-mono tabular-nums px-1.5 rounded ${
          active
            ? 'bg-spring-green-300/15 text-spring-green-200/90'
            : 'bg-white/[0.06] text-white/55'
        }`}
      >
        {count}
      </span>
    </button>
  );
}

/* Single open lobby — thumbnail-led card. */
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
        className="group relative w-full rounded-xl border border-white/[0.08] hover:border-spring-green-300/50 bg-mirage-900/40 hover:bg-spring-green-300/[0.04] overflow-hidden transition-all flex items-stretch min-h-[6.5rem] text-left"
      >
        {/* Thumbnail tile on the left */}
        <div className="relative w-32 sm:w-36 shrink-0 bg-gradient-to-br from-mirage-900/60 to-mirage-800/40 border-r border-white/[0.06] overflow-hidden flex items-center justify-center">
          {meta ? (
            <Image
              src={meta.img}
              alt={meta.label}
              width={160}
              height={120}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          ) : (
            <div className="text-white/20 text-[10px] uppercase tracking-wider font-semibold">
              No game
              <br />
              picked
            </div>
          )}
          {/* Live pulse dot */}
          <span className="absolute top-2 left-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-spring-green-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-spring-green-400" />
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0 p-3 sm:p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <PlayerAvatar
                userId={lobby.hostClientId}
                displayName={lobby.hostName}
                discordId={lobby.hostDiscordId}
                avatarHash={lobby.hostAvatarHash}
                size={24}
                linkable={false}
              />
              <span className="text-white/95 text-sm font-semibold truncate">
                {lobby.hostName}
              </span>
            </div>
            {meta ? (
              <div className="text-white/45 text-[11px] font-mono uppercase tracking-wider truncate">
                {meta.label}
              </div>
            ) : (
              <div className="text-white/30 text-[11px] italic">
                no game selected
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-white/40 font-mono tabular-nums">
              {lobby.playerCount}/2
            </span>
            <span className="inline-flex items-center gap-1 text-spring-green-300 text-xs font-bold uppercase tracking-wider">
              Join
              <ArrowRight className="w-3.5 h-3.5 -translate-x-1 group-hover:translate-x-0 transition-transform" />
            </span>
          </div>
        </div>
      </button>
    </li>
  );
}

/* Empty state — instead of plain text, show a teaser strip of all 8
   games to remind the player what they could host. */
function EmptyState() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-mirage-900/30 px-6 py-8 text-center">
      <div className="text-white/55 text-sm font-medium mb-1">
        No open lobbies right now
      </div>
      <p className="text-white/35 text-xs mb-6">
        Be the first to host one of these:
      </p>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 max-w-2xl mx-auto opacity-70">
        {ALL_GAMES.map((g) => (
          <div
            key={g}
            className="aspect-square rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center p-1.5 hover:opacity-100 hover:border-spring-green-300/30 transition-all"
            title={GAME_META[g].label}
          >
            <Image
              src={GAME_META[g].img}
              alt={GAME_META[g].label}
              width={72}
              height={72}
              className="w-full h-full object-contain"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}
