'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Check, Loader2, LogOut, Share2 } from 'lucide-react';
import { useUser } from '@/app/contexts/UserContext';
import { useAblyChannel, type ChannelStatus, type PresenceMember } from '@/app/utils/useAblyChannel';
import { checkBeepPlayer, successPlayer } from '@/public/audio/AudioManager';
import PlayerAvatar from '@/app/components/PlayerAvatar';
import { EMOTES, EMOTE_BY_ID, EMOTE_THROTTLE_MS, EMOTE_DURATION_MS } from '@/app/lobby/emotes';
import { playEmoteSound } from '@/app/lobby/emoteSounds';
import EmoteImage from '@/app/lobby/EmoteImage';
import { generateMatchSeed } from '@/lib/lobby/seededRandom';
import { determineHost } from '@/lib/lobby/host';
import type { LobbyMessage } from '@/lib/lobby/messages';
import type { GameType } from '@/interfaces/user';
import type { GameResult } from '@/app/game/types';
import { orbitron } from '@/app/fonts';
import {
  trackMatchStarted,
  trackMatchCompleted,
  trackMatchForfeited,
  trackMatchTimedOut,
} from '@/app/utils/gtm';
import MatchView from './MatchView';

// Games available for 1v1 (RepairKit excluded — real-time mechanic).
const ONEV_ONE_GAMES: { id: GameType; label: string }[] = [
  { id: 'thermite', label: 'Thermite' },
  { id: 'lockpick', label: 'Lockpick' },
  { id: 'laundromat', label: 'Laundromat' },
  { id: 'pincracker', label: 'Pin Cracker' },
  { id: 'roof-running', label: 'Roof Running' },
  { id: 'word-memory', label: 'Word Memory' },
  { id: 'chopping', label: 'Chopping' },
];

// Lobby lifetime — universal across all games.
const LOBBY_IDLE_MS = 5 * 60 * 1000;   // close lobby after 5 min of no matches
const LOBBY_WARN_MS = 60 * 1000;       // show warning toast last 60s
const MATCH_MAX_MS = 3 * 60 * 1000;    // cap any single match at 3 min → draw
const COUNTDOWN_MS = 3 * 1000;         // sync the start: both clients unblock at the same goAt

interface LobbyClientProps {
  code: string;
}

export default function LobbyClient({ code }: LobbyClientProps) {
  const { user, isLoggedIn } = useUser();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [match, setMatch] = useState<{ game: GameType; seed: number } | null>(null);
  const [myResult, setMyResult] = useState<GameResult | null>(null);
  const [opponentResult, setOpponentResult] = useState<GameResult | null>(null);
  const [opponentInputs, setOpponentInputs] = useState<unknown[]>([]);
  const [matchStartTime, setMatchStartTime] = useState<number | null>(null);
  const [matchExpired, setMatchExpired] = useState(false);
  const [lobbyLastActivity, setLobbyLastActivity] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  // Synced go-time in the host's Date.now() frame, shipped on match:start.
  // Both clients compare to their own Date.now() — same wall-clock fire if
  // their clocks are NTP-synced (typical for browsers). Display is driven by
  // per-second setTimeouts aligned to goAt so the digits tick exactly at
  // second boundaries instead of waiting on a stale 1Hz interval.
  const [goAt, setGoAt] = useState<number | null>(null);
  // Host-controlled per-lobby setting. Persists across matches in the same lobby.
  const [focusMode, setFocusMode] = useState(false);
  // Each match captures the focusMode the host had at start time, so a mid-match
  // toggle doesn't affect the in-progress game.
  const [matchFocusMode, setMatchFocusMode] = useState(false);
  // Canonical outcome — host derives once it has full info and broadcasts via
  // match:outcome; both ends render based on this state, no per-client flicker.
  const [outcome, setOutcome] = useState<{
    winnerClientId: string | null;
    reason: 'finished' | 'timeout';
  } | null>(null);
  // Recent emote per player — wiped 3s after each emote so the bubble fades.
  const [emotes, setEmotes] = useState<
    Record<string, { primaryUrl: string; fallbackUrl: string; label: string; key: number }>
  >({});
  const lastEmoteSentRef = useRef(0);
  // Non-host's suggestion is mirrored on both clients so the host's "Start a
  // match" panel can show a "Requested" badge, and the non-host's suggest
  // panel can show their own selection.
  const [suggestedGame, setSuggestedGame] = useState<GameType | null>(null);
  // Last few matches played in this lobby (in-memory; resets on reload).
  const [matchHistory, setMatchHistory] = useState<MatchHistoryEntry[]>([]);

  const displayName = user?.displayName ?? user?.username ?? 'Player';

  // Preload lobby audio cues once on mount.
  useEffect(() => {
    checkBeepPlayer.whenReady();
    successPlayer.whenReady();
  }, []);

  const showEmote = useCallback((emoteId: string, fromClientId: string) => {
    const def = EMOTE_BY_ID[emoteId];
    if (!def) return;
    const key = Date.now();
    setEmotes((prev) => ({
      ...prev,
      [fromClientId]: {
        primaryUrl: def.animatedUrl,
        fallbackUrl: def.staticUrl,
        label: def.label,
        key,
      },
    }));
    // Sound for both sender (immediate gesture) and receiver. The shared
    // AudioContext is created lazily and resumes on first user interaction,
    // so a receiver who's already clicked anywhere will hear it.
    playEmoteSound(emoteId);
    setTimeout(() => {
      setEmotes((prev) => {
        if (prev[fromClientId]?.key !== key) return prev;
        const next = { ...prev };
        delete next[fromClientId];
        return next;
      });
    }, EMOTE_DURATION_MS);
  }, []);

  const handleMessage = useCallback((msg: LobbyMessage) => {
    if (msg.type === 'match:start') {
      setMatch({ game: msg.game, seed: msg.seed });
      setMyResult(null);
      setOpponentResult(null);
      setOpponentInputs([]);
      setMatchExpired(false);
      setMatchFocusMode(msg.focusMode);
      setOutcome(null);
      setSuggestedGame(null);
      // Use the host's goAt. Cap to a sane local range so a wildly-skewed
      // peer clock can't make the countdown last minutes or fire instantly.
      const receiveNow = Date.now();
      const cappedGoAt = Math.min(
        Math.max(msg.goAt, receiveNow + 500),
        receiveNow + COUNTDOWN_MS + 1500,
      );
      // Sync `now` atomically so the first countdown render isn't off by
      // however stale the 1Hz interval state happened to be.
      setNow(receiveNow);
      setGoAt(cappedGoAt);
      // Match timer starts counting from GO, not from when match:start arrived.
      setMatchStartTime(cappedGoAt);
    } else if (msg.type === 'match:result') {
      setOpponentResult({ won: msg.won, score: msg.score, elapsedMs: msg.elapsedMs });
    } else if (msg.type === 'match:input') {
      setOpponentInputs((prev) => [...prev, msg.input]);
    } else if (msg.type === 'match:timeout') {
      setMatchExpired(true);
    } else if (msg.type === 'match:outcome') {
      setOutcome({ winnerClientId: msg.winnerClientId, reason: msg.reason });
    } else if (msg.type === 'emote') {
      showEmote(msg.emote, msg.fromClientId);
    } else if (msg.type === 'suggest') {
      setSuggestedGame(msg.game);
    }
  }, [showEmote]);

  const { status, presence, publish } = useAblyChannel<LobbyMessage>({
    channelName: `lobby:${code}`,
    presenceData: {
      displayName,
      discordId: user?.discordId,
      avatarHash: user?.avatar,
    },
    onMessage: handleMessage,
    enabled: isLoggedIn,
  });

  const hostClientId = determineHost(presence);
  const isHost = hostClientId !== undefined && hostClientId === user?.id;
  const me = presence.find((p) => p.clientId === user?.id) ?? null;
  const opponent = presence.find((p) => p.clientId !== user?.id) ?? null;
  const opponentClientId = opponent?.clientId ?? null;

  // 1Hz ticker — drives all the countdown displays + expiry checks below.
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Only a new joiner counts as activity. If the opponent gets idle-kicked
  // first, the host's presence drops 2→1; we don't want that to reset the
  // host's own idle clock and let them sit forever.
  // Plays a subtle audio cue when the opponent first joins so the host
  // notices without having to watch the lobby tab.
  const prevPresenceLenRef = useRef(0);
  useEffect(() => {
    if (presence.length > prevPresenceLenRef.current) {
      setLobbyLastActivity(Date.now());
      if (prevPresenceLenRef.current > 0) {
        // Skip on initial 0→1 (that's just us mounting); fire when a peer joins.
        checkBeepPlayer.play();
      }
    }
    prevPresenceLenRef.current = presence.length;
  }, [presence.length]);

  // Audio: success sound when an opponent's result arrives (they finished
  // their game) so we know to look up. Skips on every other state change.
  const prevOpponentResultRef = useRef<GameResult | null>(null);
  useEffect(() => {
    if (opponentResult && !prevOpponentResultRef.current) {
      checkBeepPlayer.play();
    }
    prevOpponentResultRef.current = opponentResult;
  }, [opponentResult]);

  // Audio: success chime exactly at GO when the match unblocks.
  useEffect(() => {
    if (!goAt) return;
    const delay = goAt - Date.now();
    if (delay <= 0) {
      successPlayer.play();
      return;
    }
    const handle = setTimeout(() => successPlayer.play(), delay);
    return () => clearTimeout(handle);
  }, [goAt]);

  // When a match ends (back to lobby), reset activity so the next idle window
  // starts fresh.
  useEffect(() => {
    if (!match && !matchStartTime) return;
    if (match && (myResult || opponentResult || matchExpired)) {
      setLobbyLastActivity(Date.now());
    }
  }, [match, matchStartTime, myResult, opponentResult, matchExpired]);

  // Idle-lobby timeout: schedule a setTimeout aligned to the deadline rather
  // than polling `now` each tick. Polling could quietly miss firing if the
  // 1Hz interval was throttled (background tab) or out of phase; setTimeout
  // fires once at the right moment. Skipped only while a match is actively
  // running — the outcome view and pre-match countdown count toward idle.
  const isInActiveMatch = !!(match && !myResult && !opponentResult && !matchExpired);
  useEffect(() => {
    if (isInActiveMatch) return;
    const delay = lobbyLastActivity + LOBBY_IDLE_MS - Date.now();
    if (delay <= 0) {
      router.push('/lobby');
      return;
    }
    const handle = setTimeout(() => router.push('/lobby'), delay);
    return () => clearTimeout(handle);
  }, [isInActiveMatch, lobbyLastActivity, router]);

  // Schedule a re-render at each second boundary of the countdown, all
  // anchored on goAt. Without this the 1Hz interval fires at whatever phase
  // it landed on at lobby-mount, so the "1" digit might only flash for a
  // few hundred ms before the match starts.
  useEffect(() => {
    if (!goAt) return;
    const handles: ReturnType<typeof setTimeout>[] = [];
    for (let target = goAt - 2000; target <= goAt; target += 1000) {
      const delay = Math.max(0, target - Date.now());
      handles.push(setTimeout(() => setNow(Date.now()), delay));
    }
    return () => handles.forEach(clearTimeout);
  }, [goAt]);

  // Match max-duration: also setTimeout-based so it can't be missed by a
  // throttled tick. First client to expire publishes match:timeout so both
  // converge on a draw without UI flicker. Guards prevent firing after the
  // match is already resolved (e.g., opponent forfeited at 2:30 and the
  // timer would otherwise still flip the outcome to a fake draw at 3:00).
  useEffect(() => {
    if (!match || matchStartTime === null || matchExpired) return;
    if (myResult || opponentResult) return;
    const fire = () => {
      setMatchExpired(true);
      trackMatchTimedOut({ lobby_code: code, game_type: match.game });
      void publish({ type: 'match:timeout' });
    };
    const delay = matchStartTime + MATCH_MAX_MS - Date.now();
    if (delay <= 0) {
      fire();
      return;
    }
    const handle = setTimeout(fire, delay);
    return () => clearTimeout(handle);
  }, [match, matchStartTime, matchExpired, myResult, opponentResult, code, publish]);

  // Host arbiter: derive and broadcast the canonical match:outcome once we
  // have enough info. If only one side has a result yet, wait briefly for
  // the other before locking in.
  useEffect(() => {
    if (!isHost || outcome || !user?.id || !opponentClientId) return;
    if (!myResult && !opponentResult && !matchExpired) return;

    const decide = () =>
      deriveWinner(myResult, opponentResult, matchExpired, user.id, opponentClientId);

    const publishAndSet = (decision: ReturnType<typeof deriveWinner>) => {
      void publish({
        type: 'match:outcome',
        winnerClientId: decision.winnerClientId,
        reason: decision.reason,
      });
      setOutcome(decision);
      if (match) {
        trackMatchCompleted({
          lobby_code: code,
          game_type: match.game,
          reason: decision.reason,
          has_winner: decision.winnerClientId !== null,
          duration_ms: matchStartTime ? Date.now() - matchStartTime : 0,
        });
      }
    };

    // Both results in hand (or matchExpired) — decide immediately.
    if ((myResult && opponentResult) || matchExpired) {
      publishAndSet(decide());
      return;
    }

    // Only one side reported. Give the other ~600ms to land before locking.
    const handle = setTimeout(() => publishAndSet(decide()), 600);
    return () => clearTimeout(handle);
  }, [isHost, myResult, opponentResult, matchExpired, outcome, user?.id, opponentClientId, publish, code, match, matchStartTime]);

  // Append to match history once the canonical outcome lands, deduped by
  // match.seed so multiple effect runs don't push the same row twice.
  useEffect(() => {
    if (!outcome || !match) return;
    setMatchHistory((prev) => {
      if (prev.some((e) => e.seed === match.seed)) return prev;
      const winner = outcome.winnerClientId
        ? presence.find((p) => p.clientId === outcome.winnerClientId)
        : null;
      const entry: MatchHistoryEntry = {
        seed: match.seed,
        game: match.game,
        winnerClientId: outcome.winnerClientId,
        winnerName: winner?.data.displayName,
        winnerDiscordId: winner?.data.discordId,
        winnerAvatarHash: winner?.data.avatarHash,
        durationMs: matchStartTime ? Date.now() - matchStartTime : 0,
        endedAt: Date.now(),
      };
      return [entry, ...prev].slice(0, 5);
    });
  }, [outcome, match, presence, matchStartTime]);

  // Non-host fallback: if the host's match:outcome doesn't arrive within a
  // couple of seconds (host disconnected mid-match), derive locally so the
  // outcome view still renders.
  useEffect(() => {
    if (isHost || outcome || !user?.id || !opponentClientId) return;
    if (!myResult && !opponentResult && !matchExpired) return;

    const handle = setTimeout(() => {
      setOutcome(deriveWinner(myResult, opponentResult, matchExpired, user.id, opponentClientId));
    }, 2500);
    return () => clearTimeout(handle);
  }, [isHost, myResult, opponentResult, matchExpired, outcome, user?.id, opponentClientId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Silent fail.
    }
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const shareData = {
      title: '1v1 — NoPixel Hacks',
      text: `Join my 1v1 lobby (code: ${code})`,
      url,
    };
    // Prefer the native share sheet (iOS / macOS Safari / Android) — falls
    // back to clipboard so desktop browsers still get a useful action.
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 1500);
    } catch {
      // Silent fail.
    }
  };

  const handleStart = async (game: GameType) => {
    const seed = generateMatchSeed();
    const startNow = Date.now();
    const newGoAt = startNow + COUNTDOWN_MS;
    setMatch({ game, seed });
    setMyResult(null);
    setOpponentResult(null);
    setOpponentInputs([]);
    setMatchExpired(false);
    setMatchFocusMode(focusMode);
    setOutcome(null);
    setSuggestedGame(null);
    // Sync `now` atomically with goAt so the initial countdown render shows
    // exactly 3 instead of 4 (the 1Hz interval state can be up to 1s stale).
    setNow(startNow);
    setGoAt(newGoAt);
    setMatchStartTime(newGoAt);
    trackMatchStarted({ lobby_code: code, game_type: game, focus_mode: focusMode });
    await publish({
      type: 'match:start',
      game,
      seed,
      startedAt: startNow,
      goAt: newGoAt,
      focusMode,
    });
  };

  const handleMatchEnd = useCallback(
    (result: GameResult) => {
      setMyResult(result);
      void publish({
        type: 'match:result',
        won: result.won,
        score: result.score,
        elapsedMs: result.elapsedMs,
      });
    },
    [publish],
  );

  const handleInput = useCallback(
    (input: unknown) => {
      void publish({ type: 'match:input', input });
    },
    [publish],
  );

  const handleForfeit = useCallback(() => {
    if (myResult) return;
    const elapsedMs = matchStartTime ? Date.now() - matchStartTime : 0;
    const result: GameResult = { won: false, score: 0, elapsedMs };
    setMyResult(result);
    if (match) {
      trackMatchForfeited({ lobby_code: code, game_type: match.game, duration_ms: elapsedMs });
    }
    void publish({ type: 'match:result', won: false, score: 0, elapsedMs });
  }, [myResult, matchStartTime, match, code, publish]);

  const handleBackToLobby = () => {
    setMatch(null);
    setMyResult(null);
    setOpponentResult(null);
    setOpponentInputs([]);
    setMatchExpired(false);
    setMatchStartTime(null);
    setGoAt(null);
    setOutcome(null);
    setSuggestedGame(null);
    setLobbyLastActivity(Date.now());
  };

  const sendEmote = useCallback(
    (emoteId: string) => {
      const nowMs = Date.now();
      if (nowMs - lastEmoteSentRef.current < EMOTE_THROTTLE_MS) return;
      if (!user?.id) return;
      lastEmoteSentRef.current = nowMs;
      // Show on my own side immediately (echo is disabled — we won't get our
      // own message back). showEmote also plays the sound.
      showEmote(emoteId, user.id);
      void publish({ type: 'emote', emote: emoteId, fromClientId: user.id });
    },
    [user?.id, publish, showEmote],
  );

  const sendSuggestion = useCallback(
    (game: GameType) => {
      if (!user?.id) return;
      // Toggle off if clicking the same suggestion.
      const next = suggestedGame === game ? null : game;
      setSuggestedGame(next);
      if (next) void publish({ type: 'suggest', game: next, fromClientId: user.id });
    },
    [user?.id, suggestedGame, publish],
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-white/70 mb-4">Log in with Discord to join this lobby.</p>
          <Link
            href="/lobby"
            className="text-[#54FFA4] hover:text-[#45e894] text-sm transition-colors"
          >
            ← Lobby home
          </Link>
        </div>
      </div>
    );
  }

  // Synced countdown: rendered before anything else so neither client can
  // start playing before goAt.
  if (match && goAt && now < goAt) {
    return <Countdown remainingMs={goAt - now} />;
  }

  // Outcome view: only when the canonical outcome is in. Until then (between
  // a partial result landing and the host's match:outcome arriving) we keep
  // the game on-screen so the user isn't briefly shown the wrong winner.
  if (match && outcome) {
    const iWon = outcome.winnerClientId === user?.id;
    const isDraw = outcome.winnerClientId === null;
    return (
      <>
        <OutcomeView
          iWon={iWon}
          isDraw={isDraw}
          reason={outcome.reason}
          myResult={myResult}
          opponentResult={opponentResult}
          me={me}
          opponent={opponent}
          emotes={emotes}
          onBack={handleBackToLobby}
        />
        {presence.length >= 2 && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
            <EmoteBar onSend={sendEmote} />
          </div>
        )}
      </>
    );
  }

  // Match in progress.
  if (match) {
    const matchRemainingMs =
      matchStartTime !== null ? Math.max(0, matchStartTime + MATCH_MAX_MS - now) : MATCH_MAX_MS;
    return (
      <>
        <MatchHeader remainingMs={matchRemainingMs} onForfeit={handleForfeit} />
        <MatchView
          game={match.game}
          seed={match.seed}
          onMatchEnd={handleMatchEnd}
          onInput={handleInput}
          opponentInputs={opponentInputs}
          focusMode={matchFocusMode}
          me={me}
          opponent={opponent}
          emotes={emotes}
        />
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
          <EmoteBar onSend={sendEmote} />
        </div>
      </>
    );
  }

  // Lobby view.
  const lobbyRemainingMs = Math.max(0, lobbyLastActivity + LOBBY_IDLE_MS - now);
  const showIdleWarning = lobbyRemainingMs <= LOBBY_WARN_MS;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-md mx-auto pt-8 md:pt-12 pb-12">
        <Link
          href="/lobby"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white/80 text-sm transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Leave lobby
        </Link>

        {/* Hero: lobby code + share actions */}
        <section className="text-center mb-8">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.25em] font-medium mb-5">
            Lobby Code
          </p>
          <button
            onClick={handleCopy}
            className="group inline-flex items-center gap-3 px-5 py-3 -mx-5 -my-3 rounded-2xl hover:bg-white/[0.04] transition-colors mb-6"
            aria-label="Copy lobby code"
          >
            <span className="text-6xl md:text-7xl font-bold text-white tracking-[0.2em] font-mono">
              {code}
            </span>
            {copied ? (
              <Check className="w-5 h-5 text-[#54FFA4]" />
            ) : (
              <Copy className="w-5 h-5 text-white/30 group-hover:text-white/70 transition-colors" />
            )}
          </button>

          <div className="flex items-center justify-center gap-2">
            <ActionPill
              onClick={handleCopy}
              active={copied}
              icon={copied ? Check : Copy}
              label={copied ? 'Code copied' : 'Copy code'}
            />
            <ActionPill
              onClick={handleShare}
              active={shared}
              icon={shared ? Check : Share2}
              label={shared ? 'Link copied' : 'Share link'}
            />
          </div>
        </section>

        {/* Players */}
        <section className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 mb-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white/90 font-semibold text-sm tracking-wide">
              Players <span className="text-white/30 ml-1">·</span>{' '}
              <span className="text-white/50">{presence.length}/2</span>
            </h2>
            <ConnectionStatus status={status} />
          </div>

          {presence.length === 0 ? (
            <div className="py-6 text-center">
              <Loader2 className="w-4 h-4 animate-spin text-white/30 mx-auto" />
            </div>
          ) : (
            <ul className="space-y-1">
              {presence.map((member) => (
                <li
                  key={member.clientId}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.02] transition-colors"
                >
                  <PlayerAvatar
                    userId={member.clientId}
                    displayName={member.data.displayName}
                    discordId={member.data.discordId}
                    avatarHash={member.data.avatarHash}
                    size={28}
                    ringClass={
                      member.clientId === user?.id
                        ? 'ring-2 ring-[#54FFA4]/40 ring-offset-2 ring-offset-[#0a0c10]'
                        : undefined
                    }
                  />
                  <span className="text-white/90 text-sm truncate min-w-0">{member.data.displayName}</span>
                  {emotes[member.clientId] && (
                    <InlineEmote
                      primaryUrl={emotes[member.clientId].primaryUrl}
                      fallbackUrl={emotes[member.clientId].fallbackUrl}
                      label={emotes[member.clientId].label}
                      emoteKey={emotes[member.clientId].key}
                    />
                  )}
                  <div className="flex-1" />
                  {member.clientId === hostClientId && (
                    <span className="text-[10px] uppercase tracking-wider text-[#54FFA4]/80 px-2 py-0.5 rounded-full bg-[#54FFA4]/10 border border-[#54FFA4]/20 font-semibold">
                      host
                    </span>
                  )}
                  {member.clientId === user?.id && (
                    <span className="text-white/30 text-[10px] uppercase tracking-wider">you</span>
                  )}
                </li>
              ))}
              {presence.length === 1 && (
                <li className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-dashed border-white/[0.06]">
                  <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/[0.06]" />
                  <span className="text-white/30 text-sm flex-1 italic">Waiting for opponent…</span>
                </li>
              )}
            </ul>
          )}
        </section>

        {matchHistory.length > 0 && (
          <section className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 mb-3">
            <h2 className="text-white/90 font-semibold text-sm tracking-wide mb-3">
              Recent matches
            </h2>
            <ul className="space-y-1.5">
              {matchHistory.map((entry) => (
                <MatchHistoryRow key={entry.seed} entry={entry} />
              ))}
            </ul>
          </section>
        )}

        {isHost && presence.length >= 2 && (
          <section className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white/90 font-semibold text-sm tracking-wide">Start a match</h2>
              <FocusToggle enabled={focusMode} onChange={setFocusMode} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ONEV_ONE_GAMES.map((entry, i) => {
                const lastSolo =
                  i === ONEV_ONE_GAMES.length - 1 && ONEV_ONE_GAMES.length % 2 === 1;
                const requested = suggestedGame === entry.id;
                return (
                  <button
                    key={entry.id}
                    onClick={() => handleStart(entry.id)}
                    title={requested && opponent ? `Requested by ${opponent.data.displayName}` : undefined}
                    className={`group relative rounded-xl border text-sm font-medium transition-all duration-200 active:scale-[0.98] py-3.5 px-4 ${
                      requested
                        ? 'bg-[#54FFA4]/12 border-[#54FFA4]/45 text-[#54FFA4] hover:bg-[#54FFA4]/20'
                        : 'bg-white/[0.04] hover:bg-[#54FFA4]/10 border-white/[0.06] hover:border-[#54FFA4]/40 text-white/90 hover:text-[#54FFA4]'
                    } ${lastSolo ? 'col-span-2' : ''}`}
                  >
                    {entry.label}
                    {requested && opponent && (
                      <div className="absolute -top-1.5 -right-1.5">
                        <PlayerAvatar
                          userId={opponent.clientId}
                          displayName={opponent.data.displayName}
                          discordId={opponent.data.discordId}
                          avatarHash={opponent.data.avatarHash}
                          size={22}
                          linkable={false}
                          ringClass="ring-2 ring-[#54FFA4] ring-offset-2 ring-offset-[#0a0c10]"
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {isHost && presence.length < 2 && (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] px-5 py-4 text-center">
            <p className="text-white/50 text-xs">
              Share the lobby code or link to invite a friend.
            </p>
          </div>
        )}

        {!isHost && presence.length >= 2 && (
          <section className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-white/90 font-semibold text-sm tracking-wide">Suggest a game</h2>
              <span className="text-[10px] uppercase tracking-wider text-white/40">Host picks</span>
            </div>
            <p className="text-white/40 text-xs mb-4">Hint to the host what you&apos;d like to play.</p>
            <div className="grid grid-cols-2 gap-2">
              {ONEV_ONE_GAMES.map((entry, i) => {
                const lastSolo =
                  i === ONEV_ONE_GAMES.length - 1 && ONEV_ONE_GAMES.length % 2 === 1;
                const selected = suggestedGame === entry.id;
                return (
                  <button
                    key={entry.id}
                    onClick={() => sendSuggestion(entry.id)}
                    className={`rounded-xl border text-sm font-medium transition-all duration-200 active:scale-[0.98] py-3.5 px-4 ${
                      selected
                        ? 'bg-[#54FFA4]/12 border-[#54FFA4]/45 text-[#54FFA4]'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.06] hover:border-white/15 text-white/85'
                    } ${lastSolo ? 'col-span-2' : ''}`}
                  >
                    {entry.label}
                  </button>
                );
              })}
            </div>
            <p className="text-white/30 text-[11px] inline-flex items-center gap-1.5 mt-3">
              <Loader2 className="w-3 h-3 animate-spin" />
              Waiting for the host to start…
            </p>
          </section>
        )}
      </div>

      {/* Floating emote bar — visible in the lobby and outcome views. */}
      {presence.length >= 2 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
          <EmoteBar onSend={sendEmote} />
        </div>
      )}

      {showIdleWarning && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-amber-500/15 backdrop-blur border border-amber-500/30 text-amber-200 text-xs">
          Lobby closes in {Math.ceil(lobbyRemainingMs / 1000)}s due to inactivity
        </div>
      )}
    </div>
  );
}

interface MatchHistoryEntry {
  seed: number;
  game: GameType;
  winnerClientId: string | null;
  winnerName?: string;
  winnerDiscordId?: string;
  winnerAvatarHash?: string;
  durationMs: number;
  endedAt: number;
}

function MatchHistoryRow({ entry }: { entry: MatchHistoryEntry }) {
  const gameLabel = ONEV_ONE_GAMES.find((g) => g.id === entry.game)?.label ?? entry.game;
  const isDraw = entry.winnerClientId === null;
  return (
    <li className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.02]">
      <span className="text-[11px] text-white/45 uppercase tracking-wider w-24 shrink-0 truncate">
        {gameLabel}
      </span>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {isDraw ? (
          <span className="text-xs text-amber-300/90 font-medium">Draw</span>
        ) : (
          <>
            <PlayerAvatar
              userId={entry.winnerClientId ?? ''}
              displayName={entry.winnerName ?? '?'}
              discordId={entry.winnerDiscordId}
              avatarHash={entry.winnerAvatarHash}
              size={20}
              linkable={!!entry.winnerClientId}
            />
            <span className="text-xs text-white/80 truncate">{entry.winnerName ?? 'Unknown'}</span>
            <span className="text-[10px] uppercase tracking-wider text-[#54FFA4]/80 shrink-0">
              won
            </span>
          </>
        )}
      </div>
      <span className="text-[10px] text-white/35 font-mono tabular-nums shrink-0">
        {(entry.durationMs / 1000).toFixed(1)}s
      </span>
    </li>
  );
}

function EmoteBar({ onSend }: { onSend: (emoteId: string) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 p-1.5 shadow-xl shadow-black/40">
      {EMOTES.map((emote) => (
        <button
          key={emote.id}
          type="button"
          onClick={() => onSend(emote.id)}
          title={emote.label}
          aria-label={emote.label}
          className="p-1.5 rounded-xl hover:bg-white/10 transition-colors active:scale-90"
        >
          <EmoteImage
            primaryUrl={emote.animatedUrl}
            fallbackUrl={emote.staticUrl}
            label={emote.label}
            size={36}
            className="block"
          />
        </button>
      ))}
    </div>
  );
}

function ActionPill({
  onClick,
  active,
  icon: Icon,
  label,
}: {
  onClick: () => void;
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-[#54FFA4]/12 text-[#54FFA4] border border-[#54FFA4]/30'
          : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/80 border border-white/[0.08] hover:border-white/15'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}

function MatchHeader({
  remainingMs,
  onForfeit,
}: {
  remainingMs: number;
  onForfeit: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const seconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  const lowTime = remainingMs <= 30 * 1000;

  return (
    // Sits at the top-center of the viewport. The inner divider lines up with
    // the splitscreen's vertical divider (also at viewport-center), so the
    // pill visually breaks the divider and "carries" it across.
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 pt-3 pointer-events-none">
      <div
        className={`pointer-events-auto grid grid-cols-[5rem_auto_5rem] items-center gap-x-3 rounded-full bg-black/80 backdrop-blur-sm px-4 py-2 border border-white/10 shadow-xl shadow-black/50 transition-all duration-500 ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
        }`}
      >
        <span
          className={`text-right text-sm font-mono tabular-nums transition-colors duration-300 ${
            lowTime ? 'text-amber-300' : 'text-white/75'
          }`}
        >
          {mm}:{ss.toString().padStart(2, '0')}
        </span>
        <span className="w-px h-4 bg-white/20" />
        <button
          onClick={onForfeit}
          className="justify-self-start text-sm text-white/60 hover:text-red-300 transition-colors duration-200 inline-flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          Forfeit
        </button>
      </div>
    </div>
  );
}

function OutcomeView({
  iWon,
  isDraw,
  reason,
  myResult,
  opponentResult,
  me,
  opponent,
  emotes,
  onBack,
}: {
  iWon: boolean;
  isDraw: boolean;
  reason: 'finished' | 'timeout';
  myResult: GameResult | null;
  opponentResult: GameResult | null;
  me: PresenceMember | null;
  opponent: PresenceMember | null;
  emotes: Record<string, { primaryUrl: string; fallbackUrl: string; label: string; key: number }>;
  onBack: () => void;
}) {
  const title = isDraw ? 'Draw' : iWon ? 'You won' : 'You lost';
  const titleColor = isDraw
    ? 'text-amber-300'
    : iWon
      ? 'text-[#54FFA4]'
      : 'text-white/80';
  const subtitle = reason === 'timeout' && isDraw ? 'Match timed out' : 'Match over';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <p className="text-white/40 text-xs uppercase tracking-wider mb-2">{subtitle}</p>
        <h2 className={`text-4xl font-bold mb-8 ${titleColor}`}>{title}</h2>

        <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-5 mb-6">
          {isDraw && reason === 'timeout' ? (
            <p className="text-white/60 text-sm text-center">
              Neither player finished in time.
            </p>
          ) : (
            <div className="text-left space-y-3">
              {/* Skip the "You" row when I won by default (opponent forfeited
                  / lost before I finished) — the title already says I won. */}
              {(myResult || !iWon) && (
                <ResultRow
                  label="You"
                  member={me}
                  emote={me ? emotes[me.clientId] ?? null : null}
                  result={myResult}
                  pendingLabel="didn't finish"
                />
              )}
              <ResultRow
                label="Opponent"
                member={opponent}
                emote={opponent ? emotes[opponent.clientId] ?? null : null}
                result={opponentResult}
                pendingLabel="didn't finish"
              />
            </div>
          )}
        </div>

        <button
          onClick={onBack}
          className="w-full rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white py-3 font-medium transition-colors"
        >
          Back to lobby
        </button>
      </div>
    </div>
  );
}

// Pure derivation: given both clients' results + matchExpired + the two
// clientIds, return the canonical { winner, reason }. Both host and the
// non-host fallback call this with identical inputs so they converge.
function deriveWinner(
  myResult: GameResult | null,
  opponentResult: GameResult | null,
  matchExpired: boolean,
  myClientId: string,
  opponentClientId: string,
): { winnerClientId: string | null; reason: 'finished' | 'timeout' } {
  const reason: 'finished' | 'timeout' = matchExpired ? 'timeout' : 'finished';

  if (myResult && opponentResult) {
    if (myResult.won && opponentResult.won) {
      // Race: faster locally-measured time wins; clientId tiebreaks an
      // exact tie so both clients converge on the same winner.
      if (myResult.elapsedMs < opponentResult.elapsedMs) return { winnerClientId: myClientId, reason };
      if (myResult.elapsedMs > opponentResult.elapsedMs) return { winnerClientId: opponentClientId, reason };
      const winner = myClientId < opponentClientId ? myClientId : opponentClientId;
      return { winnerClientId: winner, reason };
    }
    if (myResult.won) return { winnerClientId: myClientId, reason };
    if (opponentResult.won) return { winnerClientId: opponentClientId, reason };
    return { winnerClientId: null, reason }; // both lost
  }

  if (myResult) {
    return { winnerClientId: myResult.won ? myClientId : opponentClientId, reason };
  }
  if (opponentResult) {
    return { winnerClientId: opponentResult.won ? opponentClientId : myClientId, reason };
  }
  // Only matchExpired with no results — true draw.
  return { winnerClientId: null, reason };
}

function ResultRow({
  label,
  member,
  emote,
  result,
  pendingLabel,
}: {
  label: string;
  member: PresenceMember | null;
  emote: { primaryUrl: string; fallbackUrl: string; label: string; key: number } | null;
  result: GameResult | null;
  pendingLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        {member ? (
          <PlayerAvatar
            userId={member.clientId}
            displayName={member.data.displayName}
            discordId={member.data.discordId}
            avatarHash={member.data.avatarHash}
            size={24}
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-white/10" />
        )}
        <span className="text-white/70 text-sm truncate min-w-0">
          {member ? member.data.displayName : label}
        </span>
        {emote && (
          <InlineEmote
            primaryUrl={emote.primaryUrl}
            fallbackUrl={emote.fallbackUrl}
            label={emote.label}
            emoteKey={emote.key}
          />
        )}
      </div>
      {result ? (
        <span className="text-white/90 text-sm font-mono tabular-nums shrink-0">
          {result.won ? 'won' : 'lost'} · {result.score} ·{' '}
          {(result.elapsedMs / 1000).toFixed(1)}s
        </span>
      ) : (
        <span className="text-white/40 text-sm shrink-0">{pendingLabel}</span>
      )}
    </div>
  );
}

function InlineEmote({
  primaryUrl,
  fallbackUrl,
  label,
  emoteKey,
}: {
  primaryUrl: string;
  fallbackUrl: string;
  label: string;
  emoteKey: number;
}) {
  return (
    <span
      key={emoteKey}
      className="emote-inline inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/[0.05] border border-white/15 shrink-0"
    >
      <EmoteImage primaryUrl={primaryUrl} fallbackUrl={fallbackUrl} label={label} size={20} />
    </span>
  );
}

function Countdown({ remainingMs }: { remainingMs: number }) {
  const seconds = Math.max(1, Math.ceil(remainingMs / 1000));
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      {/* Soft radial backdrop so the number sits in a faint pool of green light. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, rgba(84,255,164,0.10) 0%, rgba(84,255,164,0.04) 25%, transparent 55%)',
        }}
      />
      {/* Faint horizon line that the number lands on. */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 w-[36rem] h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(84,255,164,0.4), transparent)',
        }}
      />
      <div
        key={seconds}
        className={`${orbitron.className} relative text-[12rem] sm:text-[18rem] leading-none tabular-nums select-none countdown-num`}
        style={{
          color: 'transparent',
          backgroundImage:
            'linear-gradient(135deg, #ffffff 0%, #d8fff0 35%, #54FFA4 65%, #2db97a 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          letterSpacing: '-0.04em',
        }}
      >
        {seconds}
      </div>
      <style jsx>{`
        .countdown-num {
          animation: rush 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: center;
        }
        @keyframes rush {
          0% {
            transform: scale(0.15) translateZ(-600px);
            opacity: 0;
            filter: blur(40px)
              drop-shadow(0 0 0 rgba(84, 255, 164, 0));
          }
          30% {
            transform: scale(1.3) translateZ(0);
            opacity: 1;
            filter: blur(0)
              drop-shadow(0 0 90px rgba(84, 255, 164, 0.7))
              drop-shadow(0 0 30px rgba(255, 255, 255, 0.4));
          }
          100% {
            transform: scale(1) translateZ(0);
            opacity: 0.95;
            filter: blur(0)
              drop-shadow(0 0 60px rgba(84, 255, 164, 0.5))
              drop-shadow(0 0 20px rgba(255, 255, 255, 0.25));
          }
        }
      `}</style>
    </div>
  );
}

function FocusToggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className="group inline-flex items-center gap-2.5 text-xs text-white/55 hover:text-white/90 transition-colors"
      title="Hide the opponent's board — show only their progress"
    >
      <span className="font-medium">Focus mode</span>
      <span
        className={`relative inline-block w-9 h-5 rounded-full transition-colors ${
          enabled ? 'bg-[#54FFA4]' : 'bg-white/10 group-hover:bg-white/20'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-md shadow-black/30 transition-transform ${
            enabled ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
  );
}

function ConnectionStatus({ status }: { status: ChannelStatus }) {
  if (status === 'connected') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
        <span className="w-1.5 h-1.5 rounded-full bg-[#54FFA4]" />
        Live
      </span>
    );
  }
  if (status === 'failed') {
    return <span className="text-xs text-red-400/80">Disconnected</span>;
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-white/40">
      <Loader2 className="w-3 h-3 animate-spin" />
      Connecting
    </span>
  );
}
