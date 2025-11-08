"use client";

import { successPlayer, checkBeepPlayer } from "@/public/audio/AudioManager";
import { Letter, Letters, LetterState } from "@/app/puzzles/chopping/utils";
import usePersistantState from "@/app/utils/usePersistentState";
import NPHackContainer from "@/app/components/NPHackContainer";
import { NPSettingsRange } from "@/app/components/NPSettings";
import GameStatsTracker from "@/app/components/GameStatsTracker";
import { useDailyChallenge } from "@/app/utils/useDailyChallenge";
import React, { FC, useEffect, useState, useRef, useCallback, memo, useMemo, startTransition } from "react";
import { useKeyDown } from "@/app/utils/useKeyDown";
import useGame from "@/app/utils/useGame";
import classNames from "classnames";
import { useIsMobileOrTablet } from "@/app/utils/useMediaQuery";
import { useSearchParams } from "next/navigation";


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

// Keep a stable allowed-keys array so keyboard hook doesn't get a new array each render
const ALLOWED_KEYS = ['Q', 'q', 'W', 'w', 'E', 'e', 'R', 'r', 'A', 'a', 'S', 's', 'D', 'd'] as const;

// Memoized letter cell to prevent re-rendering unchanged letters
interface LetterCellProps {
    letter: Letter;
    isActive: boolean;
    isDone: boolean;
    isFail: boolean;
}

const LetterCell = memo<LetterCellProps>(({ letter, isActive, isDone, isFail }) => {
    const classes = classNames("letter", {
        'letter-active': isActive,
        'done': isDone,
        'fail': isFail,
    });

    return (
        <div className={classes} style={{ justifySelf: 'center' }}>
            {letter}
        </div>
    );
}, (prevProps, nextProps) => {
    // Custom comparison: only re-render if any prop actually changed
    return prevProps.letter === nextProps.letter &&
           prevProps.isActive === nextProps.isActive &&
           prevProps.isDone === nextProps.isDone &&
           prevProps.isFail === nextProps.isFail;
});

LetterCell.displayName = 'LetterCell';

// Memoized grid row to prevent re-rendering entire rows when only one cell changes
interface GridRowProps {
    rowIndex: number;
    board: Letter[];
    stateBoard: LetterState[];
    activeIndex: number;
    numLetters: number;
    gridCols: number;
}

const GridRow = memo<GridRowProps>(({ rowIndex, board, stateBoard, activeIndex, numLetters, gridCols }) => {
    const colsInRow = Math.min(numLetters - rowIndex * gridCols, gridCols);
    
    // Memoize the cells array to avoid recalculating on every render
    const cells = useMemo(() => {
        const cellsArray = [];
        for (let colIndex = 0; colIndex < gridCols; colIndex++) {
            const letterIndex = rowIndex * gridCols + colIndex;
            if (letterIndex < numLetters) {
                cellsArray.push({
                    key: colIndex,
                    letterIndex,
                    letter: board[letterIndex],
                    isActive: letterIndex === activeIndex,
                    isDone: stateBoard[letterIndex] === 'done',
                    isFail: stateBoard[letterIndex] === 'fail',
                });
            }
        }
        return cellsArray;
    }, [board, stateBoard, activeIndex, numLetters, gridCols, rowIndex]);

    return (
        <div 
            className='game-grid-row' 
            style={{ gridTemplateColumns: `repeat(${colsInRow}, min-content)` }}
        >
            {cells.map(cell => (
                <LetterCell
                    key={cell.key}
                    letter={cell.letter}
                    isActive={cell.isActive}
                    isDone={cell.isDone}
                    isFail={cell.isFail}
                />
            ))}
        </div>
    );
}, (prevProps, nextProps) => {
    // Only re-render if this row contains the active or changed letter
    const prevRowStart = prevProps.rowIndex * prevProps.gridCols;
    const prevRowEnd = prevRowStart + prevProps.gridCols;
    const nextRowStart = nextProps.rowIndex * nextProps.gridCols;
    const nextRowEnd = nextRowStart + nextProps.gridCols;
    
    // Check if active index moved into or out of this row
    const prevHasActive = prevProps.activeIndex >= prevRowStart && prevProps.activeIndex < prevRowEnd;
    const nextHasActive = nextProps.activeIndex >= nextRowStart && nextProps.activeIndex < nextRowEnd;
    
    if (prevHasActive !== nextHasActive) return false; // Re-render if active moved
    
    // Check if any state in this row changed
    for (let i = 0; i < prevProps.gridCols; i++) {
        const idx = prevProps.rowIndex * prevProps.gridCols + i;
        if (idx >= prevProps.numLetters) break;
        if (prevProps.board[idx] !== nextProps.board[idx]) return false;
        if (prevProps.stateBoard[idx] !== nextProps.stateBoard[idx]) return false;
    }
    
    return true; // Don't re-render
});

GridRow.displayName = 'GridRow';

const defaultNumLetters = 15;
const defaultDuration = 7;
const defaultGridCols = 6;

const Chopping: FC = () => {
    const { isChallengeMode, challengeData } = useDailyChallenge();
    const searchParams = useSearchParams();
    const isCompetitive = searchParams?.get('competitive') === 'true';
    
    // Use challenge data for defaults if in challenge mode
    const challengeNumLetters = challengeData?.numLetters || defaultNumLetters;
    const challengeDuration = challengeData?.targetTime ? Math.floor(challengeData.targetTime / 1000) : defaultDuration;
    
    const [timer, setTimer] = usePersistantState("chopping-timer", challengeDuration);
    const [numLetters, setNumLetters] = usePersistantState("chopping-num-letters", challengeNumLetters);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [board, setBoard] = useState<Letter[]>(new Array(challengeNumLetters));
    const [stateBoard, setStateBoard] = useState<LetterState[]>(new Array(challengeNumLetters).fill(''));
    const [allowKeyDown, setAllowKeyDown] = useState(true);
    const [elapsed, setElapsed] = useState(0);
    const isMobileOrTablet = useIsMobileOrTablet();

    // Reset to standard preset when in competitive mode
    useEffect(() => {
        if (isCompetitive) {
            setNumLetters(defaultNumLetters); // 15
            setTimer(defaultDuration); // 7
        }
    }, [isCompetitive, setNumLetters, setTimer]);

    // Update settings when challenge data loads
    useEffect(() => {
        if (challengeData) {
            setNumLetters(challengeData.numLetters || defaultNumLetters);
            setTimer(challengeData.targetTime ? Math.floor(challengeData.targetTime / 1000) : defaultDuration);
        }
    }, [challengeData, setNumLetters, setTimer]);
    const mobileInputRef = useRef<HTMLInputElement>(null);
    const outerContainerRef = useRef<HTMLDivElement>(null);
    const gameWrapperRef = useRef<HTMLDivElement>(null);
    const hintDismissedRef = useRef(false);
    const [showMobileHint, setShowMobileHint] = useState(false);
    const skipNextInputRef = useRef(false);
    const hasInteractedRef = useRef(false);
    // Refs to keep latest values without triggering re-renders — improves keyboard performance
    const boardRef = useRef<Letter[]>(board);
    const stateBoardRef = useRef<LetterState[]>(stateBoard);
    const activeIndexRef = useRef<number>(activeIndex);

    // keep refs in sync with state
    useEffect(() => { boardRef.current = board; }, [board]);
    useEffect(() => { stateBoardRef.current = stateBoard; }, [stateBoard]);
    useEffect(() => { activeIndexRef.current = activeIndex; }, [activeIndex]);

    useEffect(() => {
        checkBeepPlayer.whenReady();
        successPlayer.whenReady();
    }, []);

    const ensureVisible = useCallback((behavior: ScrollBehavior = 'auto') => {
        if (!isMobileOrTablet || typeof window === 'undefined') return;
        const container = outerContainerRef.current ?? gameWrapperRef.current;
        if (!container) return;

        // Get the container's position
        const rect = container.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Calculate position to center the element in viewport
        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
        const elementTop = rect.top + scrollTop;
        const elementCenter = elementTop - (viewportHeight / 2) + (rect.height / 2);
        
        // Force scroll to position
        window.scrollTo({
            top: Math.max(0, elementCenter),
            behavior: behavior
        });
    }, [isMobileOrTablet]);

    const dismissMobileHint = useCallback(() => {
        if (!hintDismissedRef.current) {
            hintDismissedRef.current = true;
            setShowMobileHint(false);
        }
    }, []);

    const focusMobileInput = useCallback((options?: { force?: boolean }) => {
        if (!isMobileOrTablet) return;
        if (!options?.force && !hasInteractedRef.current) return;
        const input = mobileInputRef.current;
        if (!input) return;
        try {
            input.focus({ preventScroll: true });
        } catch {
            input.focus();
        }
        input.setSelectionRange?.(input.value.length, input.value.length);
        
        // Scroll after a delay to allow keyboard to open
        setTimeout(() => ensureVisible('smooth'), 100);
        setTimeout(() => ensureVisible('smooth'), 300);
        setTimeout(() => ensureVisible('smooth'), 500);
    }, [ensureVisible, isMobileOrTablet]);

    const focusInputOnInteraction = useCallback(() => {
        if (!isMobileOrTablet) return;
        
        if (!hasInteractedRef.current) {
            hasInteractedRef.current = true;
            dismissMobileHint();
        }

        const input = mobileInputRef.current;
        if (!input) return;

        // Immediate focus attempt
        try {
            input.focus({ preventScroll: true });
        } catch {
            input.focus();
        }

        // Additional attempts to ensure keyboard stays open
        if (typeof window !== 'undefined') {
            window.requestAnimationFrame(() => {
                try {
                    input.focus({ preventScroll: true });
                } catch {
                    input.focus();
                }
            });
        }
        
        // Scroll after delays to allow keyboard to open
        setTimeout(() => ensureVisible('smooth'), 100);
        setTimeout(() => ensureVisible('smooth'), 300);
        setTimeout(() => ensureVisible('smooth'), 500);
    }, [dismissMobileHint, ensureVisible, isMobileOrTablet]);

    useEffect(() => {
        if (!isMobileOrTablet) return;
        const timer = setTimeout(() => {
            ensureVisible('smooth');
        }, 200);
        return () => clearTimeout(timer);
    }, [ensureVisible, isMobileOrTablet]);


    const resetBoard = () => {
        const newBoard: Letter[] = [];
        // Resetting board
        for (let i = 0; i < numLetters; i++) {
            newBoard.push(getRandomLetter());
        }
    setBoard(newBoard);
    boardRef.current = newBoard;
    setActiveIndex(0);
    activeIndexRef.current = 0;

        const newStateBoard = new Array(numLetters).fill('');
        setStateBoard(newStateBoard);
        stateBoardRef.current = newStateBoard;
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

    // Auto-scroll when game starts on mobile
    useEffect(() => {
        if (isMobileOrTablet && gameStatus === 1) {
            setTimeout(() => {
                ensureVisible('smooth');
                focusMobileInput({ force: true });
            }, 300);
        }
    }, [gameStatus, isMobileOrTablet, ensureVisible, focusMobileInput]);

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

    const handleWin = useCallback((message: string) => {
        // Win
        if (!isMobileOrTablet) {
            successPlayer.play();
        }
        setGameStatus(3);
    }, [setGameStatus, isMobileOrTablet]);

    const handleLose = useCallback((message: string) => {
        // Lose
        setGameStatus(2);
    }, [setGameStatus]);

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

    // Stable key handler that reads/writes refs to reduce re-renders and avoid stale closures
    const handleKeyDown = useCallback((key: string) => {
        const currentBoard = boardRef.current;
        const currentActive = activeIndexRef.current;
        const newStateBoard = [...stateBoardRef.current];

        if (key.toUpperCase() === currentBoard[currentActive]) {
            newStateBoard[currentActive] = 'done';
            const nextIndex = currentActive + 1;
            activeIndexRef.current = nextIndex;
            
            // Critical update: immediately update activeIndex for responsive UI
            setActiveIndex(nextIndex);
            
            // Non-critical update: stateBoard can be deferred
            startTransition(() => {
                setStateBoard(newStateBoard);
            });
            stateBoardRef.current = newStateBoard;
            
            // Only play audio on desktop to avoid mobile lag
            if (!isMobileOrTablet) {
                checkBeepPlayer.play();
            }
        } else {
            newStateBoard[currentActive] = 'fail';
            
            // Fail state update can also be deferred slightly
            startTransition(() => {
                setStateBoard(newStateBoard);
            });
            stateBoardRef.current = newStateBoard;
        }

        // Evaluate win/lose using refs (runs synchronously)
        // If the final state is 'done', it's a win
        if (newStateBoard[newStateBoard.length - 1] === 'done') {
            handleWin("All letters pressed successfully");
        }

        if (newStateBoard[currentActive] === 'fail') {
            handleLose(`Letter ${currentBoard?.[currentActive]} failed`);
        }
    }, [handleWin, handleLose, setActiveIndex, isMobileOrTablet]);


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
        if (!isMobileOrTablet || typeof window === 'undefined' || !window.visualViewport) return;

        const viewport = window.visualViewport;
        const handleResize = () => {
            const offset = Math.max(0, window.innerHeight - viewport.height);
            document.body.style.paddingBottom = offset ? `${offset}px` : '';
            
            // When keyboard opens, scroll the game into view
            if (offset > 100) {
                requestAnimationFrame(() => {
                    ensureVisible('smooth');
                });
                // Retry after animation
                setTimeout(() => ensureVisible('smooth'), 300);
            }
        };

        viewport.addEventListener('resize', handleResize);
        viewport.addEventListener('scroll', handleResize);
        handleResize();

        return () => {
            document.body.style.paddingBottom = '';
            viewport.removeEventListener('resize', handleResize);
            viewport.removeEventListener('scroll', handleResize);
        };
    }, [isMobileOrTablet, ensureVisible]);        // Handle mobile input
    const handleMobileKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (gameStatus !== 1) return;
        const { key } = e;
        if (!hasInteractedRef.current) {
            hasInteractedRef.current = true;
        }

        if (key.length === 1) {
            skipNextInputRef.current = true;
            e.preventDefault();
            dismissMobileHint();
            handleKeyDown(key.toUpperCase());
            mobileInputRef.current && (mobileInputRef.current.value = '');
            return;
        }

        if (key === 'Backspace') {
            skipNextInputRef.current = true;
            e.preventDefault();
            mobileInputRef.current && (mobileInputRef.current.value = '');
        }
    };

    const handleMobileInput = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        if (skipNextInputRef.current) {
            skipNextInputRef.current = false;
            input.value = '';
            return;
        }
        const key = input.value.slice(-1);
        if (key && gameStatus === 1) {
            if (!hasInteractedRef.current) {
                hasInteractedRef.current = true;
            }
            dismissMobileHint();
            handleKeyDown(key.toUpperCase());
            input.value = '';
            focusMobileInput();
        }
    };

    // Memoize the callback we pass to the global keydown hook so it doesn't change every render
    const globalKeyHandler = useCallback((key?: string) => {
        if (key && gameStatus === 1 && document.activeElement?.tagName !== 'INPUT') {
            handleKeyDown(key);
        }
    }, [gameStatus, handleKeyDown]);

    useKeyDown(globalKeyHandler, ALLOWED_KEYS as unknown as string[], allowKeyDown);


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
            <GameStatsTracker
                game="chopping"
                gameStatus={gameStatus}
                score={activeIndex}
                elapsedMs={elapsed}
                targetScore={numLetters}
                wonStatus={3}
                lostStatus={2}
                gameSettings={{
                    letters: numLetters,
                    timer: timer,
                }}
            />
            <div ref={outerContainerRef} className="flex flex-col gap-4">
                {/* <StatHandler
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
                /> */}
                {isMobileOrTablet && showMobileHint && (
                    <div className="rounded-xl border border-spring-green-500/40 bg-mirage-900/70 px-4 py-3 text-center text-xs font-medium text-spring-green-100 shadow-lg shadow-mirage-950/40">
                        Tap the puzzle, then type the letters to play.
                    </div>
                )}
                <NPHackContainer
                        title="Alphabet"
                        description="Tap the letters in order"
                        buttons={[]}
                        countdownDuration={timer * 1000}
                        elapsedCallback={setElapsed}
                        resetCallback={resetGame}
                        resetDelay={3000}
                        status={gameStatus}
                        setStatus={setGameStatus}
                        statusMessage={getStatusMessage(gameStatus)}
                        settings={isChallengeMode ? undefined : settings}
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
                                onKeyDown={handleMobileKeyDown}
                                onFocus={() => {
                                    // Scroll when keyboard opens
                                    if (isMobileOrTablet) {
                                        setTimeout(() => ensureVisible('smooth'), 100);
                                        setTimeout(() => ensureVisible('smooth'), 300);
                                        setTimeout(() => ensureVisible('smooth'), 500);
                                    }
                                }}
                                onBlur={(e) => {
                                    // Prevent keyboard from closing when tapping the game
                                    if (gameStatus === 1) {
                                        e.preventDefault();
                                        e.target.focus();
                                    }
                                }}
                                aria-label="Type letters here"
                            />
                        )}
                        <div
                            ref={gameWrapperRef}
                            className="
                    min-w-[calc(100vw-60px)] sm:min-w-[550px] md:min-w-[600px]
                    w-full max-w-full
                    h-full
                    rounded-lg
                    bg-[rgba(0,28,49,0.3)]
                    flex items-center justify-center
                    text-white
                    p-1 sm:p-4
                    mx-auto
                "
                            onTouchStartCapture={focusInputOnInteraction}
                            onPointerDownCapture={focusInputOnInteraction}
                            style={{ scrollMarginTop: '15vh', overflow: 'visible' }}
                        >
                            <div className='game-grid' style={{ height: '100%', width: '100%' }}>
                                {/* Memoized grid rows - only affected rows re-render */}
                                {Array.from({ length: Math.ceil(numLetters / defaultGridCols) }).map((_, rowIndex) => (
                                    <GridRow
                                        key={rowIndex}
                                        rowIndex={rowIndex}
                                        board={board}
                                        stateBoard={stateBoard}
                                        activeIndex={activeIndex}
                                        numLetters={numLetters}
                                        gridCols={defaultGridCols}
                                    />
                                ))}
                            </div>
                        </div>
                </NPHackContainer>
            </div>
        </>
    )

}

export default Chopping;