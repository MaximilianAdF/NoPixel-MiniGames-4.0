'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, RotateCcw, Trophy } from 'lucide-react';
import { useUser } from '@/app/contexts/UserContext';
import { orbitron } from '@/app/fonts';
import PlayerAvatar from '@/app/components/PlayerAvatar';
import { useGhostPlayback } from '@/app/utils/useGhostPlayback';
import { markGhostRaced } from '@/app/lobby/ghostHistory';
import { trackGhostRaceStarted, trackGhostRaceCompleted } from '@/app/utils/gtm';
import type { PresenceMember } from '@/app/utils/useAblyChannel';
import type { GameResult } from '@/app/game/types';
import type { GameType } from '@/interfaces/user';
import type { RecordedInput, GhostResult } from '@/lib/lobby/ghosts';
import { Countdown } from '@/app/lobby/[code]/LobbyClient';
import MatchView from '@/app/lobby/[code]/MatchView';

// Full ghost as returned by GET /api/lobby/ghosts/[id].
interface FullGhost {
  id: string;
  game: GameType;
  seed: number;
  inputs: RecordedInput[];
  result: GhostResult;
  recorderName: string;
  recorderDiscordId?: string;
  recorderAvatarHash?: string;
  recorderClientId: string;
  // How many people have raced this ghost, and how many beat it.
  timesRaced: number;
  timesBeaten: number;
}

const COUNTDOWN_MS = 3000;
// Cap a ghost race like the live match (3 min) so a player who walks away
// isn't stuck forever — it resolves to a "didn't finish" outcome.
const RACE_MAX_MS = 3 * 60 * 1000;
const GAME_LABEL: Record<GameType, string> = {
  thermite: 'Thermite', lockpick: 'Lockpick', laundromat: 'Laundromat',
  pincracker: 'Pin Cracker', 'roof-running': 'Roof Running',
  'word-memory': 'Word Memory', chopping: 'Chopping', 'repair-kit': 'Repair Kit',
};

function recordRaceStat(event: 'ghost_race_started' | 'ghost_race_won', game: GameType): void {
  void fetch('/api/lobby/stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, game }),
  }).catch(() => {});
}

export default function GhostRaceClient({ ghostId }: { ghostId: string }) {
  const router = useRouter();
  const { user } = useUser();

  const [ghost, setGhost] = useState<FullGhost | null>(null);
  const [loadError, setLoadError] = useState(false);

  // Race lifecycle. goAt is the Date.now() moment the race unblocks (after the
  // 3-2-1). Until then we render the countdown; the ghost playback is gated on
  // goAt so it can't advance early.
  const [goAt, setGoAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [myResult, setMyResult] = useState<GameResult | null>(null);

  // A stable identity for the live player's half of the splitscreen.
  const me = useMemo<PresenceMember>(() => ({
    clientId: user?.id ?? 'me',
    data: {
      displayName: user?.displayName ?? user?.username ?? 'You',
      discordId: user?.discordId,
      avatarHash: user?.avatar,
    },
    timestamp: 0,
  }), [user]);

  // Fetch the full ghost (with inputs) once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/lobby/ghosts/${ghostId}`, { cache: 'no-store' });
        if (!res.ok) { if (!cancelled) setLoadError(true); return; }
        const data = (await res.json()) as { ghost: FullGhost };
        if (!cancelled) setGhost(data.ghost);
      } catch {
        if (!cancelled) setLoadError(true);
      }
    })();
    return () => { cancelled = true; };
  }, [ghostId]);

  // Start the countdown as soon as the ghost is loaded.
  useEffect(() => {
    if (!ghost || goAt !== null) return;
    const start = Date.now();
    setNow(start);
    setGoAt(start + COUNTDOWN_MS);
    // Per-player "already raced" tracking (Option B) + telemetry fire on start
    // so quitting mid-race doesn't resurface the same ghost immediately.
    markGhostRaced(ghost.id);
    recordRaceStat('ghost_race_started', ghost.game); // durable Mongo counter
    trackGhostRaceStarted({                            // GA4 / GTM
      game_type: ghost.game,
      ghost_id: ghost.id,
      ghost_time_ms: ghost.result.elapsedMs,
    });
  }, [ghost, goAt]);

  // Drive the countdown clock at second boundaries.
  useEffect(() => {
    if (!goAt) return;
    const handles: ReturnType<typeof setTimeout>[] = [];
    for (let t = goAt - 2000; t <= goAt; t += 1000) {
      handles.push(setTimeout(() => setNow(Date.now()), Math.max(0, t - Date.now())));
    }
    return () => handles.forEach(clearTimeout);
  }, [goAt]);

  const racing = goAt !== null && now >= goAt && !myResult;
  const ghostStartedAt = racing || myResult ? goAt : null;

  // Ghost inputs released in real time. After I finish we freeze the slice at
  // whatever the ghost had reached (we stop advancing `now`).
  const ghostInputs = useGhostPlayback(ghost?.inputs ?? [], ghostStartedAt);

  const handleMatchEnd = useCallback((result: GameResult) => {
    setMyResult(result);
    if (!ghost) return;
    // Win = I finished faster than the ghost's recorded time. (A finished-but-
    // slower run can't occur — the race ends the moment the ghost completes.)
    const beatGhost = result.won && result.elapsedMs < ghost.result.elapsedMs;
    if (beatGhost) recordRaceStat('ghost_race_won', ghost.game); // durable counter
    // Bump the ghost's raced/beaten tallies for social proof.
    void fetch(`/api/lobby/ghosts/${ghost.id}/raced`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ beaten: beatGhost }),
    }).catch(() => {});
    // GA4 / GTM — every completion, with its result.
    trackGhostRaceCompleted({
      game_type: ghost.game,
      ghost_id: ghost.id,
      result: beatGhost ? 'won' : 'lost',
      player_time_ms: result.won ? result.elapsedMs : 0,
      ghost_time_ms: ghost.result.elapsedMs,
    });
  }, [ghost]);

  // Tick `now` during the race so the countdown→race transition is crisp.
  useEffect(() => {
    if (!goAt || myResult) return;
    if (now >= goAt) return;
    const h = setTimeout(() => setNow(Date.now()), 100);
    return () => clearTimeout(h);
  }, [goAt, now, myResult]);

  // Max-duration cap: if the player never finishes, resolve to a DNF so the
  // race can't hang forever (mirrors the live match's MATCH_MAX_MS).
  useEffect(() => {
    if (!goAt || myResult) return;
    const fireAt = goAt + RACE_MAX_MS;
    const delay = fireAt - Date.now();
    const fire = () => setMyResult({ won: false, score: 0, elapsedMs: RACE_MAX_MS });
    if (delay <= 0) { fire(); return; }
    const h = setTimeout(fire, delay);
    return () => clearTimeout(h);
  }, [goAt, myResult]);

  if (loadError) {
    return (
      <Shell>
        <div className="text-center">
          <p className="text-white/80 mb-4">This ghost run is no longer available.</p>
          <Link href="/lobby" className="text-spring-green-300 hover:text-spring-green-200 text-sm font-medium">
            ← Back to lobby
          </Link>
        </div>
      </Shell>
    );
  }

  if (!ghost) {
    return (
      <Shell>
        <Loader2 className="w-6 h-6 text-spring-green-400/50 animate-spin" />
      </Shell>
    );
  }

  // Countdown phase.
  if (goAt && now < goAt) {
    return <Countdown remainingMs={goAt - now} />;
  }

  // Outcome phase.
  if (myResult) {
    return (
      <GhostOutcome
        myResult={myResult}
        ghost={ghost}
        onRaceAnother={() => router.push(`/lobby?ghost=${ghost.game}`)}
      />
    );
  }

  // Racing phase — reuse the live MatchView splitscreen, feeding the ghost's
  // released inputs in place of a live opponent's stream.
  const ghostMember: PresenceMember = {
    clientId: ghost.recorderClientId,
    data: {
      displayName: ghost.recorderName,
      discordId: ghost.recorderDiscordId,
      avatarHash: ghost.recorderAvatarHash,
    },
    timestamp: 0,
  };

  return (
    <MatchView
      game={ghost.game}
      seed={ghost.seed}
      onMatchEnd={handleMatchEnd}
      onInput={() => {}}
      opponentInputs={ghostInputs}
      focusMode={false}
      me={me}
      opponent={ghostMember}
      emotes={{}}
    />
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mirage-950 via-mirage-900 to-mirage-950">
      {children}
    </div>
  );
}


function GhostOutcome({
  myResult,
  ghost,
  onRaceAnother,
}: {
  myResult: GameResult;
  ghost: FullGhost;
  onRaceAnother: () => void;
}) {
  const ghostMs = ghost.result.elapsedMs;
  const name = ghost.recorderName;
  const ghostSec = (ghostMs / 1000).toFixed(1);
  const delta = (Math.abs(myResult.elapsedMs - ghostMs) / 1000).toFixed(1);

  // Two outcomes in practice: you finish faster than the ghost (win), or the
  // ghost completes its run first and the race ends before you do (loss).
  // A "finished but slower" case can't occur — the race ends the moment the
  // ghost wins — so it isn't handled.
  const won = myResult.won && myResult.elapsedMs < ghostMs;
  const title = won ? 'You win!' : 'You lost';
  const subtitle = won
    ? `You beat ${name} by ${delta}s`
    : `${name}'s run finished in ${ghostSec}s`;
  const beat = won;
  const glow = beat ? 'rgba(84,255,164,0.12)' : 'rgba(248,113,113,0.05)';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-mirage-950 via-mirage-900 to-mirage-950">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(circle at center, ${glow} 0%, transparent 55%)` }}
      />
      <div className="relative w-full max-w-md text-center">
        <p className="text-white/30 text-[11px] uppercase tracking-[0.25em] font-medium mb-4">
          {GAME_LABEL[ghost.game]} <span className="text-white/15 mx-1.5">·</span> Ghost race
        </p>
        {beat && (
          <div className="flex justify-center mb-3">
            <Trophy className="w-10 h-10 text-amber-300" strokeWidth={1.5} />
          </div>
        )}
        <h2
          className={`${orbitron.className} text-4xl sm:text-5xl font-black mb-3 tracking-tight ${beat ? '' : 'text-white/80'}`}
          style={beat ? {
            color: 'transparent',
            backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #d8fff0 30%, #54FFA4 100%)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
          } : undefined}
        >
          {title}
        </h2>
        <p className="text-white/55 text-sm mb-8">{subtitle}</p>

        {/* Times side by side */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 mb-6 flex items-center justify-center gap-6">
          <div className="text-center">
            <div className="text-white/40 text-[10px] uppercase tracking-wider mb-1">You</div>
            <div className={`font-mono tabular-nums text-lg ${beat ? 'text-spring-green-300' : 'text-white/80'}`}>
              {myResult.won ? `${(myResult.elapsedMs / 1000).toFixed(1)}s` : 'DNF'}
            </div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center flex items-center gap-2">
            <PlayerAvatar
              userId={ghost.recorderClientId}
              displayName={ghost.recorderName}
              discordId={ghost.recorderDiscordId}
              avatarHash={ghost.recorderAvatarHash}
              size={24}
              linkable={false}
            />
            <div>
              <div className="text-white/40 text-[10px] uppercase tracking-wider mb-1 text-left">{ghost.recorderName}</div>
              <div className={`font-mono tabular-nums text-lg text-left ${!beat ? 'text-spring-green-300' : 'text-white/80'}`}>
                {(ghostMs / 1000).toFixed(1)}s
              </div>
            </div>
          </div>
        </div>

        {/* How this ghost has done overall — includes the race that just
            finished (the /raced bump happened on match end). */}
        <p className="text-gray-500 text-xs mb-6 tabular-nums">
          {(() => {
            const races = ghost.timesRaced + 1;
            const wins = ghost.timesBeaten + (beat ? 1 : 0);
            return `Raced ${races} ${races === 1 ? 'time' : 'times'} · beaten ${wins} ${wins === 1 ? 'time' : 'times'}`;
          })()}
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={onRaceAnother}
            className="group w-full rounded-xl bg-spring-green-500 hover:bg-spring-green-400 text-mirage-950 py-3.5 font-bold tracking-wide transition-all active:scale-[0.99] inline-flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Race another
          </button>
          <Link
            href="/lobby"
            className="w-full rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white/80 py-3 font-medium transition-all inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to lobby
          </Link>
        </div>
      </div>
    </div>
  );
}
