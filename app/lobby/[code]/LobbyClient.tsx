'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Check, Loader2 } from 'lucide-react';
import { useUser } from '@/app/contexts/UserContext';
import { useAblyChannel, type ChannelStatus } from '@/app/utils/useAblyChannel';
import { generateMatchSeed } from '@/lib/lobby/seededRandom';
import { determineHost } from '@/lib/lobby/host';
import type { LobbyMessage } from '@/lib/lobby/messages';
import type { GameType } from '@/interfaces/user';
import type { GameResult } from '@/app/game/types';
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

interface LobbyClientProps {
  code: string;
}

export default function LobbyClient({ code }: LobbyClientProps) {
  const { user, isLoggedIn } = useUser();
  const [copied, setCopied] = useState(false);
  const [match, setMatch] = useState<{ game: GameType; seed: number } | null>(null);
  const [myResult, setMyResult] = useState<GameResult | null>(null);
  const [opponentResult, setOpponentResult] = useState<GameResult | null>(null);
  const [opponentInputs, setOpponentInputs] = useState<unknown[]>([]);

  const displayName = user?.displayName ?? user?.username ?? 'Player';

  const handleMessage = useCallback((msg: LobbyMessage) => {
    if (msg.type === 'match:start') {
      setMatch({ game: msg.game, seed: msg.seed });
      setMyResult(null);
      setOpponentResult(null);
      setOpponentInputs([]);
    } else if (msg.type === 'match:result') {
      setOpponentResult({ won: msg.won, score: msg.score, elapsedMs: msg.elapsedMs });
    } else if (msg.type === 'match:input') {
      setOpponentInputs((prev) => [...prev, msg.input]);
    }
  }, []);

  const { status, presence, publish } = useAblyChannel<LobbyMessage>({
    channelName: `lobby:${code}`,
    presenceData: { displayName },
    onMessage: handleMessage,
    enabled: isLoggedIn,
  });

  const hostClientId = determineHost(presence);
  const isHost = hostClientId !== undefined && hostClientId === user?.id;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Silent fail.
    }
  };

  const handleStart = async (game: GameType) => {
    const seed = generateMatchSeed();
    setMatch({ game, seed });
    setMyResult(null);
    setOpponentResult(null);
    setOpponentInputs([]);
    await publish({ type: 'match:start', game, seed, startedAt: Date.now() });
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

  const handleBackToLobby = () => {
    setMatch(null);
    setMyResult(null);
    setOpponentResult(null);
    setOpponentInputs([]);
  };

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

  // Outcome view: either side has ended (1v1 has no timer, so the first end
  // is decisive — if the opponent finishes before me, I lose immediately).
  if (match && (myResult || opponentResult)) {
    return (
      <OutcomeView
        myResult={myResult}
        opponentResult={opponentResult}
        onBack={handleBackToLobby}
      />
    );
  }

  // Match in progress: render the game full-width so the splitscreen halves
  // get the full viewport.
  if (match) {
    return (
      <MatchView
        game={match.game}
        seed={match.seed}
        onMatchEnd={handleMatchEnd}
        onInput={handleInput}
        opponentInputs={opponentInputs}
      />
    );
  }

  // Lobby view.
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-lg mx-auto pt-12">
        <Link
          href="/lobby"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="text-center mb-12">
          <p className="text-white/30 text-xs uppercase tracking-wider mb-3">Lobby code</p>
          <button
            onClick={handleCopy}
            className="group inline-flex items-center gap-3 px-4 py-2 -mx-4 -my-2 rounded-2xl hover:bg-white/[0.03] transition-colors"
            aria-label="Copy lobby code"
          >
            <span className="text-6xl md:text-7xl font-bold text-white tracking-[0.18em] font-mono">
              {code}
            </span>
            {copied ? (
              <Check className="w-5 h-5 text-[#54FFA4]" />
            ) : (
              <Copy className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
            )}
          </button>
          <p className="text-white/40 text-sm mt-4">Share this with your friend</p>
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-5 mb-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white/90 font-medium text-sm">
              Players <span className="text-white/30">·</span>{' '}
              <span className="text-white/50">{presence.length}</span>
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
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#54FFA4]" />
                  <span className="text-white/90 text-sm flex-1">{member.data.displayName}</span>
                  {member.clientId === hostClientId && (
                    <span className="text-white/50 text-xs px-2 py-0.5 rounded-full bg-white/5">
                      host
                    </span>
                  )}
                  {member.clientId === user?.id && (
                    <span className="text-white/40 text-xs">you</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {isHost && presence.length >= 2 && (
          <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-5">
            <p className="text-white/70 text-sm mb-3">Start a match</p>
            <div className="grid grid-cols-2 gap-2">
              {ONEV_ONE_GAMES.map((entry, i) => {
                const lastSolo =
                  i === ONEV_ONE_GAMES.length - 1 && ONEV_ONE_GAMES.length % 2 === 1;
                return (
                  <button
                    key={entry.id}
                    onClick={() => handleStart(entry.id)}
                    className={`rounded-xl bg-white/[0.04] hover:bg-[#54FFA4] hover:text-black text-white/90 py-3 px-4 text-sm font-medium transition-colors ${lastSolo ? 'col-span-2' : ''}`}
                  >
                    {entry.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isHost && presence.length < 2 && (
          <p className="text-white/40 text-xs text-center">
            Waiting for someone to join before starting a match…
          </p>
        )}

        {!isHost && presence.length >= 2 && (
          <p className="text-white/40 text-xs text-center">
            Waiting for the host to start a match…
          </p>
        )}
      </div>
    </div>
  );
}

function OutcomeView({
  myResult,
  opponentResult,
  onBack,
}: {
  myResult: GameResult | null;
  opponentResult: GameResult | null;
  onBack: () => void;
}) {
  // Race semantics: if I finished, I trust my own result. Otherwise the only
  // result is the opponent's, and my outcome is the inverse of theirs.
  // When both finished and both won, the faster locally-measured time wins.
  const iWon = (() => {
    if (myResult && opponentResult) {
      if (myResult.won && opponentResult.won) {
        return myResult.elapsedMs < opponentResult.elapsedMs;
      }
      return myResult.won;
    }
    if (myResult) return myResult.won;
    if (opponentResult) return !opponentResult.won;
    return false;
  })();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Match over</p>
        <h2
          className={`text-4xl font-bold mb-8 ${iWon ? 'text-[#54FFA4]' : 'text-white/80'}`}
        >
          {iWon ? 'You won' : 'You lost'}
        </h2>

        <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-5 mb-6 text-left space-y-3">
          <ResultRow label="You" result={myResult} pendingLabel="didn't finish" />
          <ResultRow label="Opponent" result={opponentResult} pendingLabel="still playing" />
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

function ResultRow({
  label,
  result,
  pendingLabel,
}: {
  label: string;
  result: GameResult | null;
  pendingLabel: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/60 text-sm">{label}</span>
      {result ? (
        <span className="text-white/90 text-sm font-mono">
          {result.won ? 'won' : 'lost'} · {result.score} ·{' '}
          {(result.elapsedMs / 1000).toFixed(1)}s
        </span>
      ) : (
        <span className="text-white/40 text-sm">{pendingLabel}</span>
      )}
    </div>
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
