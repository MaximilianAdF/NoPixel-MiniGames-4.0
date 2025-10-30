"use client";

import { successPlayer, checkBeepPlayer } from "@/public/audio/AudioManager";
import { Letter, Letters, LetterState } from "@/app/puzzles/chopping/utils";
import usePersistantState from "@/app/utils/usePersistentState";
import NPHackContainer from "@/app/components/NPHackContainer";
import { NPSettingsRange } from "@/app/components/NPSettings";
import StatHandler from "@/app/components/StatHandler";
import React, { FC, useEffect, useState, useRef, useCallback } from "react";
import { useKeyDown } from "@/app/utils/useKeyDown";
import useGame from "@/app/utils/useGame";
import classNames from "classnames";
import { useIsMobileOrTablet } from "@/app/utils/useMediaQuery";


import "../../../public/Chopping/Chopping.css";


const getStatusMessage = (status: number | undefined) => {
    switch (status) {
        case 0:
            return "";
        case 1:
            return "";
        case 2:
            return "Failed!";
        case 3:
            return "Success!";
        case 4:
            return "Reset!";
        default:
            return `Error: Unknown game status ${status}`;
    }
}

const getRandomLetter = (): Letter => {
    return Letters[Math.floor(Math.random() * Letters.length)];
}

const defaultNumLetters = 15;
const defaultDuration = 7;
const defaultGridCols = 6;

const Chopping: FC = () => {
    const [timer, setTimer] = usePersistantState("chopping-timer", defaultDuration);
    const [numLetters, setNumLetters] = usePersistantState("chopping-num-letters", defaultNumLetters);
    const [activeIndex, setActiveIndex] = usePersistantState("chopping-active-index", 0);
    const [board, setBoard] = useState<Letter[]>(new Array(defaultNumLetters));
    const [stateBoard, setStateBoard] = useState<LetterState[]>(new Array(defaultNumLetters).fill(''));
    const [allowKeyDown, setAllowKeyDown] = useState(true);
    const [elapsed, setElapsed] = useState(0);
    const isMobileOrTablet = useIsMobileOrTablet();
    const mobileInputRef = useRef<HTMLInputElement>(null);
    const outerContainerRef = useRef<HTMLDivElement>(null);
    const gameWrapperRef = useRef<HTMLDivElement>(null);
    const hintDismissedRef = useRef(false);
    const [showMobileHint, setShowMobileHint] = useState(false);

    const ensureVisible = useCallback((behavior: ScrollBehavior = 'auto') => {
        if (!isMobileOrTablet || typeof window === 'undefined') return;
        const container = outerContainerRef.current ?? gameWrapperRef.current;
        if (!container) return;

        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
        const rect = container.getBoundingClientRect();
        const topBuffer = 24;
        const bottomBuffer = 24;

        if (rect.top < topBuffer) {
            window.scrollBy({ top: rect.top - topBuffer, behavior });
        } else if (rect.bottom > viewportHeight - bottomBuffer) {
            window.scrollBy({ top: rect.bottom - (viewportHeight - bottomBuffer), behavior });
        }
    }, [isMobileOrTablet]);

    const dismissMobileHint = useCallback(() => {
        if (!hintDismissedRef.current) {
            hintDismissedRef.current = true;
            setShowMobileHint(false);
        }
    }, []);

    const focusMobileInput = useCallback(() => {
        if (!isMobileOrTablet) return;
        const input = mobileInputRef.current;
        if (!input) return;
        try {
            input.focus({ preventScroll: true });
        } catch {
            input.focus();
        }
        input.setSelectionRange?.(input.value.length, input.value.length);
        ensureVisible();
    }, [ensureVisible, isMobileOrTablet]);

    useEffect(() => {
        if (!isMobileOrTablet) return;
        const timer = setTimeout(() => {
            focusMobileInput();
            ensureVisible();
        }, 200);
        return () => clearTimeout(timer);
    }, [ensureVisible, focusMobileInput, isMobileOrTablet]);


    const resetBoard = () => {
        const newBoard: Letter[] = [];
        // Resetting board
        for (let i = 0; i < numLetters; i++) {
            newBoard.push(getRandomLetter());
        }
        setBoard(newBoard);
        setActiveIndex(0);

        const newStateBoard = new Array(numLetters).fill('');
        setStateBoard(newStateBoard);
    }
   

    const statusUpdateHandler = (newStatus: number) => {
        switch (newStatus) {
            case 1:
                // Reset game
                resetBoard();
                break;
        }
    }

    const [gameStatus, setGameStatus, streak] = useGame(timer*1000, statusUpdateHandler);

    useEffect(() => {
        if (isMobileOrTablet && gameStatus === 1 && !hintDismissedRef.current) {
            setShowMobileHint(true);
        } else {
            setShowMobileHint(false);
        }
    }, [gameStatus, isMobileOrTablet]);
    

    const resetGame = () => {
        setGameStatus(1);
    }

    const handleWin = (message: string) => {
        // Win
        successPlayer.play();
        setGameStatus(3);
    }

    const handleLose = (message: string) => {
        // Lose
        setGameStatus(2);
    }

    const checkStatus = (stateBoard: LetterState[]) => {
        /* If the final state is 'done', it can be concluded that all other letters are also 'done' */
        if (stateBoard[stateBoard.length - 1] === 'done') {
            handleWin("All letters pressed successfully");
        }

        // Fail if the LetterState of the Letter that is pointed to by activeIndex is 'fail'
        if (stateBoard[activeIndex] === 'fail') {
            handleLose(`Letter ${board?.[activeIndex]} failed`);
        }
    }

    const handleKeyDown = (key: string) => {
        const newBoard = [...board];
        const newStateBoard = [...stateBoard];

        if (key.toUpperCase() === board[activeIndex]) {
            newStateBoard[activeIndex] = 'done';
            setActiveIndex(activeIndex + 1);
            checkBeepPlayer.play();
        } else {
            newStateBoard[activeIndex] = 'fail';
        }

        setBoard(newBoard);
        setStateBoard(newStateBoard);
        checkStatus(newStateBoard);
        focusMobileInput();
    }


    const [settingsNumLetters, setSettingsNumLetters] = useState(defaultNumLetters);
    const [settingsDuration, setSettingsDuration] = useState(defaultDuration);

    useEffect(() => {
        setSettingsNumLetters(numLetters);
        setSettingsDuration(timer);

        if (gameStatus !== 4) {
            resetGame();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [numLetters, timer]);

        useEffect(() => {
            if (!isMobileOrTablet || gameStatus !== 1) return;
            focusMobileInput();
            const raf = requestAnimationFrame(focusMobileInput);
            const timeout = setTimeout(focusMobileInput, 250);
            const visibilityHandler = () => focusMobileInput();
            document.addEventListener('visibilitychange', visibilityHandler);
            return () => {
                cancelAnimationFrame(raf);
                clearTimeout(timeout);
                document.removeEventListener('visibilitychange', visibilityHandler);
            };
        }, [focusMobileInput, gameStatus, isMobileOrTablet]);

        useEffect(() => {
            if (!isMobileOrTablet || typeof window === 'undefined' || !window.visualViewport) return;

            const viewport = window.visualViewport;
            const handleResize = () => {
                const offset = Math.max(0, window.innerHeight - viewport.height);
                document.body.style.paddingBottom = offset ? `${offset}px` : '';
                ensureVisible();
            };

            viewport.addEventListener('resize', handleResize);
            viewport.addEventListener('scroll', handleResize);
            handleResize();

            return () => {
                document.body.style.paddingBottom = '';
                viewport.removeEventListener('resize', handleResize);
                viewport.removeEventListener('scroll', handleResize);
            };
        }, [ensureVisible, isMobileOrTablet]);

        useEffect(() => {
            if (!isMobileOrTablet) return;
            const handler = () => {
                dismissMobileHint();
                focusMobileInput();
            };
            window.addEventListener('touchstart', handler, { passive: true });
            return () => window.removeEventListener('touchstart', handler);
        }, [dismissMobileHint, focusMobileInput, isMobileOrTablet]);

        // Handle mobile input
    const handleMobileInput = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        const key = input.value.slice(-1); // Get last character
        if (key && gameStatus === 1) {
            dismissMobileHint();
            handleKeyDown(key.toUpperCase());
            input.value = ''; // Clear input
            focusMobileInput();
        }
    };

    useKeyDown((key?: string) => {
        if (key && gameStatus === 1 && document.activeElement?.tagName !== 'INPUT') {
            handleKeyDown(key);
        }
    }, ['Q', 'q', 'W', 'w', 'E', 'e', 'R', 'r', 'A', 'a', 'S', 's', 'D', 'd'], allowKeyDown);


    const settings = {
        handleSave: () => {
            setNumLetters(settingsNumLetters);
            setTimer(settingsDuration);
            setGameStatus(4);
        },

        handleReset: () => {
            setSettingsNumLetters(defaultNumLetters);
            setSettingsDuration(defaultDuration);
            setNumLetters(defaultNumLetters);
            setTimer(defaultDuration);
            setGameStatus(4);
        },

        children: (
            <div className="flex flex-col items-center">
                <NPSettingsRange
                    title={"Number of letters"}
                    min={13}
                    max={18}
                    value={settingsNumLetters}
                    setValue={setSettingsNumLetters}
                />
                <NPSettingsRange
                    title={"Timer"}
                    min={5}
                    max={30}
                    value={settingsDuration}
                    setValue={setSettingsDuration}
                />
            </div>
        )
    }

    return (
        <> 
            <div ref={outerContainerRef} className="relative">
            {isMobileOrTablet && showMobileHint && (
                <div className="pointer-events-none absolute left-1/2 top-2 z-40 w-[85vw] max-w-sm -translate-x-1/2 rounded-full bg-mirage-900/90 px-4 py-2 text-center text-xs font-medium text-spring-green-100 shadow-lg shadow-mirage-950/40">
                    Tap the puzzle, then type the letters to play.
                </div>
            )}
            <StatHandler
                streak={streak}
                elapsed={elapsed}
                setKeyDown={setAllowKeyDown}
                minigame={
                    {
                        puzzle: "Chopping",
                        preset: (defaultDuration === timer && defaultNumLetters === numLetters) ? 'Standard' : 'Custom',
                        duration: timer,
                        numLetters: numLetters,
                    }
                }
            />
            <NPHackContainer
                title="Alphabet"
                description="Tap the letters in order"
                buttons={[]}
                countdownDuration={timer*1000}
                elapsedCallback={setElapsed}
                resetCallback={resetGame}
                resetDelay={3000}
                status={gameStatus}
                setStatus={setGameStatus}
                statusMessage={getStatusMessage(gameStatus)}
                settings={settings}
            >
                {/* Hidden input for mobile keyboard */}
                {isMobileOrTablet && gameStatus === 1 && (
                    <input
                        ref={mobileInputRef}
                        type="text"
                        inputMode="text"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="characters"
                        className="opacity-0"
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '1px',
                            height: '1px',
                            background: 'transparent',
                        }}
                        onInput={handleMobileInput}
                        onBlur={focusMobileInput}
                        aria-label="Type letters here"
                        autoFocus
                    />
                )}
                <div
                    ref={gameWrapperRef}
                    className="
                    h-max w-max max-w-full
                    rounded-lg
                    bg-[rgb(22_40_52)]
                    flex items-center justify-center
                    text-white
                    p-2 sm:p-3 md:p-4
                "
                    onTouchStartCapture={() => {
                        dismissMobileHint();
                        focusMobileInput();
                    }}
                    onPointerDownCapture={() => {
                        dismissMobileHint();
                        focusMobileInput();
                    }}
                    style={{ scrollMarginTop: '15vh' }}
                >
                    <div className='game-grid'>
                        {/* Dynamically create grid rows based on numLetters and defaultGridCols */}
                        {Array.from({ length: Math.ceil(numLetters / defaultGridCols) }).map((_, rowIndex) => (
                            <div key={rowIndex} className='game-grid-row' style={{ gridTemplateColumns: `repeat(${Math.min(numLetters - rowIndex * defaultGridCols, defaultGridCols)}, min-content)` }}>

                                {/* Create grid columns within each row */}
                                {Array.from({ length: defaultGridCols }).map((_, colIndex) => {
                                    const letterIndex = rowIndex * defaultGridCols + colIndex;
                                    if (letterIndex < numLetters) {
                                        const letter = board[letterIndex];
                                        const isActive = letterIndex === activeIndex;
                                        const isDone = stateBoard[letterIndex] === 'done';
                                        const isFail = stateBoard[letterIndex] === 'fail';

                                        const classes = classNames("letter", {
                                            'letter-active': isActive,
                                            'done': isDone,
                                            'fail': isFail,
                                        });

                                        return (
                                            <div key={colIndex} className={classes} style={{ justifySelf: 'center' }}>
                                                {letter}
                                            </div>
                                        );
                                    } else {
                                        // Stop the loop once all letters are rendered in the row
                                        return null;
                                    }
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </NPHackContainer>
            </div>
        </>
    )

}

export default Chopping;