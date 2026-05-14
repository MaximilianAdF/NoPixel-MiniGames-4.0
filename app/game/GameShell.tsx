'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { gilroyNpTitle } from '@/app/fonts';
import NPButton from '@/app/components/NPButton';
import NPSettings from '@/app/components/NPSettings';
import gamePadIcon from '@/public/gamePad.svg';
import type { GamePhase, GameResult } from './types';

interface ShellButton {
  label: string;
  color: 'purple' | 'green';
  callback?: () => void;
  disabled?: boolean;
}

interface ShellSettings {
  handleSave: () => void;
  handleReset: () => void;
  children: ReactNode;
}

interface GameShellProps {
  title: string;
  description?: string;
  phase: GamePhase;
  result: GameResult | null;
  durationMs: number;
  runId: number;
  statusMessage: string;
  buttons?: ShellButton[][];
  settings?: ShellSettings;
  score?: number;
  targetScore?: number;
  hideTimer?: boolean;
  className?: string;
  minHeight?: string;
  children: ReactNode;
}

// Presentational frame for a minigame: header, content slot, buttons and the countdown bar.
// Sized by its container (not the viewport) so two shells can sit side by side.
export default function GameShell({
  title,
  description,
  phase,
  result,
  durationMs,
  runId,
  statusMessage,
  buttons = [],
  settings,
  score,
  targetScore,
  hideTimer,
  className,
  minHeight = 'min-h-[400px]',
  children,
}: GameShellProps) {
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <>
      {settings && (
        <NPSettings
          handleReset={settings.handleReset}
          handleSave={settings.handleSave}
          visible={settingsVisible}
          setVisible={setSettingsVisible}
        >
          {settings.children}
        </NPSettings>
      )}
      <div
        className={classNames(
          'max-h-full max-w-full rounded-lg overflow-hidden touch-manipulation flex flex-col',
          minHeight,
          className,
        )}
      >
        <div className="max-h-full max-w-full relative p-2 sm:p-3 flex flex-col justify-center bg-[rgb(7_19_32)] flex-1">
          <div className="grid grid-cols-[auto_min-content] mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Image
                src={gamePadIcon}
                alt="Gamepad"
                className="size-6 sm:size-8 md:size-10"
                style={{
                  filter:
                    'brightness(0) saturate(100%) invert(54%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(88%) contrast(88%)',
                }}
                width={32}
                height={32}
              />
              <h2
                className={`text-base sm:text-lg md:text-2xl text-spring-green-300 [text-shadow:0_0_2px_rgb(127_255_191)] ${gilroyNpTitle.className}`}
              >
                {title}
              </h2>
              <p className="text-[10px] sm:text-xs md:text-base text-[rgb(142_142_142)] hidden sm:block">
                {description}
              </p>
              {result && (
                <div
                  className={classNames(
                    'absolute top-3 right-3 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-bold border-2 animate-fadeIn transition-all z-10 shadow-lg backdrop-blur-sm max-w-[calc(100%-1.5rem)]',
                    result.won
                      ? 'bg-emerald-900/90 border-emerald-500/60 text-emerald-300'
                      : 'bg-red-900/90 border-red-500/60 text-red-300',
                  )}
                >
                  {result.won ? (
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span className="truncate">{statusMessage}</span>
                </div>
              )}
            </div>
            {settings && (
              <div
                className="flex justify-center items-center p-1 mr-4 sm:mr-7 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 shrink-0"
                onClick={() => setSettingsVisible(true)}
                role="button"
                aria-label="Open Settings"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSettingsVisible(true);
                  }
                }}
              >
                <FontAwesomeIcon
                  icon={faGear}
                  className="w-full h-full text-gray-500 hover:rotate-90 hover:scale-110 hover:cursor-pointer active:scale-95 transition-transform"
                  style={{ WebkitTextSizeAdjust: '100%', textSizeAdjust: '100%' }}
                />
              </div>
            )}
            {targetScore && (
              <div className="col-span-full text-center text-white text-base sm:text-lg">
                {score}/{targetScore}
              </div>
            )}
          </div>
          <div className="w-full pb-2 flex-1 flex flex-col">{children}</div>
          <div className="flex flex-col w-full gap-1">
            {buttons.map((row, rowIndex) => (
              <div className="flex gap-1 *:flex-1" key={rowIndex}>
                {row.map((button, buttonIndex) => (
                  <NPButton
                    key={buttonIndex}
                    onClick={button.callback}
                    color={button.color}
                    disabled={button.disabled}
                  >
                    {button.label}
                  </NPButton>
                ))}
              </div>
            ))}
          </div>
        </div>
        {!hideTimer && (
          <div className="bg-[rgb(15_27_33)] flex w-full h-2 sm:h-2.5 overflow-hidden">
            <div
              key={runId}
              className="np-timer-fill bg-[orangered] w-full h-full will-change-transform"
              style={{
                transformOrigin: 'left center',
                animationPlayState: phase === 'playing' ? 'running' : 'paused',
              }}
            />
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes np-timer-deplete {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
        .np-timer-fill {
          animation: np-timer-deplete ${durationMs}ms linear forwards;
        }
      `}</style>
    </>
  );
}
