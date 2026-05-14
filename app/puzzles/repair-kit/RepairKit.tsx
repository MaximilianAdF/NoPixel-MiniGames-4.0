'use client';

import { useCallback, useEffect, useRef, useState, type FC } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile, faFaceMeh, faFaceAngry, faFaceDizzy } from '@fortawesome/free-solid-svg-icons';
import { Hand } from 'lucide-react';
import { useKeyDown } from '@/app/utils/useKeyDown';
import { useIsMobileOrTablet } from '@/app/utils/useMediaQuery';
import GameStatsTracker from '@/app/components/GameStatsTracker';
import { trackGameStart, trackGameRetry } from '@/app/utils/gtm';
import { useUser } from '@/app/contexts/UserContext';
import type { GamePhase } from '@/app/game/types';
import { repairKitEngine, type RepairKitState } from './engine';

const HandIcon = Hand as unknown as FC<any>;

const STOP_KEYS = ['e', 'E'];
const defaultSpeed = 5;
const idleMs = 250;
const resultMs = 1000;

const RepairKit: FC = () => {
  const isMobileOrTablet = useIsMobileOrTablet();
  const { user } = useUser();

  const [phase, setPhase] = useState<GamePhase>('idle');
  const [engineState, setEngineState] = useState<RepairKitState>(() =>
    repairKitEngine.init({}, Math.random),
  );
  const [roundId, setRoundId] = useState(1);
  const [speed, setSpeed] = useState(defaultSpeed);

  const durationMs = speed * 100;

  const railRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const startRound = useCallback(() => {
    setEngineState(repairKitEngine.init({}, Math.random));
    setRoundId((r) => r + 1);
    setPhase('idle');
  }, []);

  // Fire start analytics once per round.
  useEffect(() => {
    const count = parseInt(sessionStorage.getItem('game_count') || '0', 10) + 1;
    sessionStorage.setItem('game_count', count.toString());
    trackGameStart({
      game_name: 'repairkit',
      is_logged_in: !!userRef.current,
      user_level: userRef.current?.level || 0,
      session_game_count: count,
    });
  }, [roundId]);

  // Phase machine: idle (brief pause) -> playing -> won/lost (result hold) -> next round.
  useEffect(() => {
    if (phase === 'idle') {
      const timer = setTimeout(() => setPhase('playing'), idleMs);
      return () => clearTimeout(timer);
    }
    if (phase === 'playing') {
      const loseMs = (engineState.losePoint / 100) * durationMs;
      const timer = setTimeout(() => {
        setPhase((p) =>
          p === 'playing'
            ? repairKitEngine.applyInput(engineState, { type: 'timeout' }).outcome
            : p,
        );
      }, loseMs);
      return () => clearTimeout(timer);
    }
    if (phase === 'won' || phase === 'lost') {
      const timer = setTimeout(startRound, resultMs);
      return () => clearTimeout(timer);
    }
  }, [phase, engineState, durationMs, startRound]);

  // Measure the cube and target straight from the DOM, so the win check matches what's on screen.
  const handleStop = useCallback(() => {
    const rail = railRef.current;
    const cube = cubeRef.current;
    const slot = slotRef.current;
    let deviation = 100;
    if (rail && cube && slot) {
      const railRect = rail.getBoundingClientRect();
      const cubeRect = cube.getBoundingClientRect();
      const slotRect = slot.getBoundingClientRect();
      const travelPx = railRect.width - cubeRect.width;
      if (travelPx > 0) {
        const cubeCenter = cubeRect.left + cubeRect.width / 2;
        const slotCenter = slotRect.left + slotRect.width / 2;
        deviation = (Math.abs(cubeCenter - slotCenter) / travelPx) * 100;
      }
    }
    setPhase((p) =>
      p === 'playing'
        ? repairKitEngine.applyInput(engineState, { type: 'stop', deviation }).outcome
        : p,
    );
  }, [engineState]);

  useKeyDown(handleStop, STOP_KEYS, true);

  const cycleDifficulty = () => {
    if (phase === 'won' || phase === 'lost') {
      trackGameRetry({
        game_name: 'repairkit',
        previous_result: phase === 'won' ? 'win' : 'loss',
        previous_score: 0,
      });
    }
    setSpeed((s) => (s < 10 ? 40 : s / 2));
    startRound();
  };

  const legacyStatus = phase === 'won' ? 3 : phase === 'lost' ? 2 : 1;

  return (
    <>
      <GameStatsTracker
        game="repair-kit"
        gameStatus={legacyStatus}
        score={0}
        elapsedMs={0}
        wonStatus={3}
        lostStatus={2}
      />
      <div
        className={classNames(
          'w-full m-auto p-2 sm:p-3 md:p-5 flex relative rounded-lg gap-2 sm:gap-3',
          'bg-gradient-to-r from-[rgb(18_19_20)] to-[rgb(36_68_90)] shadow',
          'h-16 sm:h-20 md:h-24',
          'max-w-[95vw] sm:max-w-[600px] md:max-w-[800px]',
        )}
      >
        <button
          onClick={handleStop}
          disabled={phase !== 'playing'}
          className={classNames(
            'h-full aspect-square rounded-sm flex items-center justify-center',
            'text-white bg-radient-circle-c relative overflow-hidden',
            'transition-all duration-300',
            'text-xl sm:text-2xl md:text-3xl',
            phase !== 'lost'
              ? 'from-[rgb(0_183_140)] to-[rgb(0,81,61)]'
              : 'from-[rgb(255_85_76)] to-[rgb(132_32_32/0.894)]',
            isMobileOrTablet && phase === 'playing'
              ? 'cursor-pointer active:scale-95 hover:scale-105 shadow-lg'
              : 'cursor-default',
            phase !== 'playing' && 'opacity-50',
          )}
          aria-label={isMobileOrTablet ? 'Tap to stop' : 'Press E to stop'}
        >
          {isMobileOrTablet ? (
            <>
              <HandIcon className="relative z-10 w-8 h-8 sm:w-10 sm:h-10" strokeWidth={2.5} />
              {phase === 'playing' && (
                <span className="absolute inset-0 bg-white/20 animate-ping rounded-sm" />
              )}
            </>
          ) : (
            <span className="relative z-10">E</span>
          )}
        </button>
        <div className="h-full w-full p-1 sm:p-1.5 md:p-2 rounded flex items-center outline outline-2 outline-neutral-500/[.162]">
          <div ref={railRef} className="relative h-full w-full">
            <div
              key={roundId}
              className="repair-indicator absolute top-0 h-full"
              style={{ animationPlayState: phase === 'playing' ? 'running' : 'paused' }}
            >
              <div
                className="repair-shifter absolute aspect-square h-full"
                style={{ animationPlayState: phase === 'playing' ? 'running' : 'paused' }}
              >
                <div
                  ref={cubeRef}
                  className={classNames(
                    'size-full rounded-sm flex items-center justify-center text-3xl text-white bg-radient-circle-c z-10',
                    phase !== 'lost'
                      ? 'from-[rgb(0_255_200)] to-[rgb(0_174_130)] shadow-[0_0_5px_0px_rgb(16_239_191)]'
                      : 'from-[rgb(255_85_76)] to-[rgb(132_32_32/0.894)] shadow-[0_0_5px_0px_rgb(255_0_0)]',
                    phase === 'won' && 'animate-win',
                  )}
                />
              </div>
            </div>
            <div
              ref={slotRef}
              className={classNames(
                'absolute top-0 aspect-square h-full rounded-sm outline outline-[1.5px] outline-neutral-500/[.354] text-3xl text-white',
                '*:absolute *:w-full *:h-[3px] *:bg-radient-circle-c',
                phase !== 'lost'
                  ? '*:from-[rgb(0_255_200)] *:to-[rgb(0_174_130)]'
                  : '*:from-[rgb(255_85_76)] *:to-[rgb(132_32_32/0.894)]',
              )}
              style={{
                left: `${engineState.target}%`,
                transform: `translateX(-${engineState.target}%)`,
              }}
            >
              <div className="top-[-10px]" />
              <div className="bottom-[-10px]" />
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <button
            onClick={cycleDifficulty}
            className={classNames(
              'p-1.5 sm:p-2 flex items-center justify-center rounded-full text-white transform duration-300',
              {
                'bg-spring-green-300': speed === 40,
                'bg-yellow-500': speed === 20,
                'bg-red-500': speed === 10,
                'bg-purple-500': speed === 5,
                'hover:-rotate-12': true,
                'hover:scale-110': true,
              },
            )}
            aria-label="Change difficulty"
          >
            <FontAwesomeIcon
              icon={
                speed === 5
                  ? faFaceDizzy
                  : speed === 10
                    ? faFaceAngry
                    : speed === 20
                      ? faFaceMeh
                      : faSmile
              }
              className={classNames('size-5 sm:size-6', {
                'text-spring-green-700': speed === 40,
                'text-yellow-700': speed === 20,
                'text-red-800': speed === 10,
                'text-purple-800': speed === 5,
              })}
            />
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes repair-anim-left {
          from {
            left: 0%;
          }
          to {
            left: 100%;
          }
        }
        @keyframes repair-anim-shift {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-100%);
          }
        }
        .repair-indicator {
          animation: repair-anim-left ${durationMs}ms linear;
        }
        .repair-shifter {
          animation: repair-anim-shift ${durationMs}ms linear;
        }
      `}</style>
    </>
  );
};

export default RepairKit;
