"use client";

import { checkBeepPlayer, successPlayer } from "@/public/audio/AudioManager";
import { Digit, Digits } from "@/app/puzzles/pincracker/utils";
import NPHackContainer from "@/app/components/NPHackContainer";
import { NPSettingsRange } from "@/app/components/NPSettings";
import React, { FC, useEffect, useState, useRef, useCallback } from "react";
import usePersistantState from "@/app/utils/usePersistentState";
import { useKeyDown } from "@/app/utils/useKeyDown";
import useGame from "@/app/utils/useGame";
import NPButton from "@/app/components/NPButton";
import { useIsMobileOrTablet } from "@/app/utils/useMediaQuery";
import GameStatsTracker from "@/app/components/GameStatsTracker";
import LeaderboardEligibleBadge from "@/app/components/LeaderboardEligibleBadge";
import { useDailyChallenge } from "@/app/utils/useDailyChallenge";
import { useSearchParams } from "next/navigation";
import { trackGameStart, trackGameRetry } from "@/app/utils/gtm";
import { useUser } from "@/app/contexts/UserContext";

const defaultDuration = 20;
const defaultPinLength = 4;

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

const Pincracker: FC = () => {
    const { isChallengeMode, challengeData } = useDailyChallenge();
    const searchParams = useSearchParams();
    const isCompetitive = searchParams?.get('competitive') === 'true';
    
    // Use challenge data for defaults if in challenge mode
    const challengePinLength = challengeData?.pinLength || defaultPinLength;
    const challengeDuration = challengeData?.targetTime ? Math.floor(challengeData.targetTime / 1000) : defaultDuration;
    
    const [timer, setTimer] = usePersistantState("chopping-timer", challengeDuration);
    const [settingsDuration, setSettingsDuration] = useState(challengeDuration);
    const [settingsPinLength, setSettingsPinLength] = useState(challengePinLength);
    const [activeIndex, setActiveIndex] = usePersistantState("pincracker-active-index", 0);
    const [allowKeyDown, setAllowKeyDown] = useState(true);
    const [autoClear, setAutoClear] = useState(true);
    const [pinLength, setPinLength] = useState(challengePinLength);
    const [pin, setPin] = useState<Digit[]>();
    const [elapsed, setElapsed] = useState(0);
    const isMobileOrTablet = useIsMobileOrTablet();
    const mobileInputRef = useRef<HTMLInputElement>(null);
    const outerContainerRef = useRef<HTMLDivElement>(null);
    const gameWrapperRef = useRef<HTMLDivElement>(null);
    const hintDismissedRef = useRef(false);
    const [showMobileHint, setShowMobileHint] = useState(false);
    const hasInteractedRef = useRef(false);

    // Reset to standard preset when in competitive mode
    useEffect(() => {
        if (isCompetitive) {
            setPinLength(4); // Standard: 4 digits
            setTimer(24); // Standard: 24 seconds
            setSettingsPinLength(4);
            setSettingsDuration(24);
        }
    }, [isCompetitive, setTimer]);

    // Update settings when challenge data loads
    useEffect(() => {
        if (challengeData) {
            setPinLength(challengeData.pinLength || defaultPinLength);
            setTimer(challengeData.targetTime ? Math.floor(challengeData.targetTime / 1000) : defaultDuration);
            setSettingsPinLength(challengeData.pinLength || defaultPinLength);
            setSettingsDuration(challengeData.targetTime ? Math.floor(challengeData.targetTime / 1000) : defaultDuration);
        }
    }, [challengeData, setTimer]);

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
        
        // Scroll after delays to allow keyboard to open
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


    const handleCrack = () => {
        if (activeIndex < pinLength) {
            // Incomplete pin
        } else {
            const wrappers = document.querySelectorAll('.wrapper');
            const markers = document.querySelectorAll('.marker');
            const digits = document.querySelectorAll('.digit');
            const guess = Array.from(digits).map(d => (d.innerHTML as Digit));
            setAllowKeyDown(false);


            for (let i = 0; i < pinLength; i++) {
                setTimeout(() => {
                    // Play the check beep audio
                    checkBeepPlayer.play();

                    // Remove the background color of the previous wrapper if it exists
                    if (i > 0) {
                        wrappers[i - 1].classList.remove('bg-gradient-radial', 'from-spring-green-300', 'to-turquoise-900/50');
                    }
            
                    // Add the background color to the current wrapper
                    wrappers[i].classList.add('bg-gradient-radial', 'from-spring-green-300', 'to-turquoise-900/50');
            
                    markers[i].classList.remove('bg-slate-400');
                    markers[i].classList.remove('bg-green-400');
                    markers[i].classList.remove('bg-yellow-400');
                    markers[i].classList.remove('bg-red-400');
                    // Process the guess and set marker colors
                    if (pin && guess[i] === pin[i]) {
                        // Correct digit, set it green
                        markers[i].classList.add('bg-green-400');
                    } else if (pin && pin.includes(guess[i])) {
                        // Incorrect position, but digit is in pin
                        markers[i].classList.add('bg-yellow-400');
                    } else {
                        // Incorrect digit
                        markers[i].classList.add('bg-red-400');
                    }
            
                    // Remove the background color from the current wrapper after processing
                    setTimeout(() => {
                        wrappers[i].classList.remove('bg-gradient-radial', 'from-spring-green-300', 'to-turquoise-900/50');
                    }, 250); // Remove the background color 500ms after processing
                }, i * 250); // Staggered delay for each iteration
            }

            setTimeout(() => {
                if (pin && guess.join('') === pin.join('')) {
                    setGameStatus(3);
                }
                if (autoClear) {
                    setActiveIndex(0);
                    clearBoard(250);
                } else {
                    setAllowKeyDown(true);
                }
            }, 1000);
        }
    }

    const clearBoard = (delay: number) => {
        const digits = document.querySelectorAll('.digit');
        for (let i = pinLength-1; i > -1; i--) {
            setTimeout(() => {
                digits[i].innerHTML = '';
            }, (pinLength-i) * delay);
        }

        setTimeout(() => {
            setAllowKeyDown(true);
        }, delay * pinLength);
    }

    const clearMarkings = () => {
        const markers = document.querySelectorAll('.marker');
        for (let i = 0; i < markers.length; i++) {
            markers[i].classList.remove('bg-green-400');
            markers[i].classList.remove('bg-yellow-400');
            markers[i].classList.remove('bg-red-400');
            markers[i].classList.add('bg-slate-400');
        }
    }

    function generatePin() {
        for (let i = Digits.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [Digits[i], Digits[j]] = [Digits[j], Digits[i]];
        }
    
        const newPin = Digits.slice(0, pinLength);
        setPin(newPin);
    }

    const resetBoard = () => {
        // Resetting cracker
        setActiveIndex(0);
        generatePin();
        clearMarkings();
        clearBoard(0);
        setAllowKeyDown(true);
    }
    
    const statusUpdateHandler = (newStatus: number) => {
        switch (newStatus) {
            case 1:
                setAllowKeyDown(false);
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

    const { user } = useUser();

    // Track game start
    useEffect(() => {
        if (gameStatus === 1) {
            const count = parseInt(sessionStorage.getItem('game_count') || '0') + 1;
            sessionStorage.setItem('game_count', count.toString());
            
            trackGameStart({
                game_name: 'pincracker',
                is_logged_in: !!user,
                user_level: user?.level || 0,
                session_game_count: count,
            });
        }
    }, [gameStatus, user]);

    const resetGame = () => {
        setGameStatus(1);
    }

    const handleRetry = () => {
        if (gameStatus === 2 || gameStatus === 3) {
            trackGameRetry({
                game_name: 'pincracker',
                previous_result: gameStatus === 3 ? 'win' : 'loss',
                previous_score: activeIndex,
            });
        }
        resetGame();
    }

    const removeDigit = (idx: number) => {
        const digits = document.querySelectorAll('.digit');
        digits[idx].innerHTML = '';
    }

    const handleKeyDown = (key: string) => {
        if (key === 'Enter') {
            handleCrack();
            focusMobileInput();
        }

        else if (key === 'Backspace') {
            setActiveIndex(Math.max(activeIndex - 1, 0));
            removeDigit(Math.max(activeIndex - 1, 0));
            focusMobileInput();
        }

        else {
            if (activeIndex < pinLength) {
                const digits = document.querySelectorAll('.digit');
                digits[activeIndex].innerHTML = key.toString();
                setActiveIndex(activeIndex + 1);
                focusMobileInput();
            }
        }

    }

    useKeyDown((key?: string) => {
        if (allowKeyDown && key && gameStatus == 1) {
            handleKeyDown(key);
        }
    }, ['1','2','3','4','5','6','7','8','9','0', 'Backspace', 'Enter'], allowKeyDown);

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
    }, [isMobileOrTablet, ensureVisible]);

    // Handle mobile input
    const handleMobileInput = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        const key = input.value.slice(-1);
        if (!key || gameStatus !== 1) {
            if (!key) {
                input.value = '';
            }
            return;
        }
        if (!hasInteractedRef.current) {
            hasInteractedRef.current = true;
        }
        dismissMobileHint();
        handleKeyDown(key.toString());
        input.value = '';
        focusMobileInput();
    };

    const handleMobileBackspace = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && gameStatus === 1) {
            if (!hasInteractedRef.current) {
                hasInteractedRef.current = true;
            }
            dismissMobileHint();
            handleKeyDown('Backspace');
        } else if (e.key === 'Enter' && gameStatus === 1) {
            if (!hasInteractedRef.current) {
                hasInteractedRef.current = true;
            }
            dismissMobileHint();
            handleKeyDown('Enter');
        }
    };

    useEffect(() => {
        setSettingsPinLength(pinLength);
        setSettingsDuration(timer);

        if (gameStatus === 3) {
            successPlayer.play();
        }
    }, [gameStatus, pinLength, timer])

    const settings = {
        handleSave: () => {
            setPinLength(settingsPinLength);
            setTimer(settingsDuration);
            setGameStatus(4);
        },

        handleReset: () => {
            setSettingsDuration(defaultDuration);
            setSettingsPinLength(defaultPinLength);
            setPinLength(defaultPinLength);
            setTimer(defaultDuration);
            setGameStatus(4);
        },

        children: (
            <div className="flex flex-col items-center">
                <NPSettingsRange
                    title={"Pin Length"}
                    min={2}
                    max={6}
                    value={settingsPinLength}
                    setValue={setSettingsPinLength}
                />
                <NPSettingsRange
                    title={"Timer"}
                    min={5}
                    max={30}
                    value={settingsDuration}
                    setValue={setSettingsDuration}
                />
                <div className="py-4 flex items-center align-items flex-col">
                    <NPButton
                        label="Auto Clear"
                        color={autoClear ? "green" : "red"}
                        onClick={() => setAutoClear(!autoClear)}
                    >Auto Clear
                    </NPButton>
                    <p className="
                        text-xs
                        sm:text-base
                        text-[rgb(142_142_142)]">
                        Automtic removal of digits after each guess
                    </p>
                </div>
            </div>
        )   
    }

    return (
        <>
            <LeaderboardEligibleBadge
                game="pincracker"
                gameSettings={{
                    pinLength,
                    timer,
                }}
            />
            <GameStatsTracker
                game="pincracker"
                gameStatus={gameStatus}
                score={activeIndex}
                elapsedMs={elapsed}
                targetScore={pinLength}
                wonStatus={3}
                lostStatus={2}
                gameSettings={{
                    pinLength,
                    duration: timer,
                }}
            />
            <div ref={outerContainerRef} className="flex flex-col gap-4">
                {/* <StatHandler
                    streak={streak}
                    elapsed={elapsed}
                    setKeyDown={setAllowKeyDown}
                    minigame={
                        {
                            puzzle: "PinCracker",
                            preset: (defaultDuration === timer && defaultPinLength === pinLength) ? 'Standard' : 'Custom',
                            duration: timer,
                            pinLength: pinLength,
                        }
                    }
                /> */}
                {isMobileOrTablet && showMobileHint && (
                    <div className="rounded-xl border border-spring-green-500/40 bg-mirage-900/70 px-4 py-3 text-center text-xs font-medium text-spring-green-100 shadow-lg shadow-mirage-950/40">
                        Tap the puzzle, then start typing to enter the code.
                    </div>
                )}
                <NPHackContainer
            title="PinCracker"
            description="Decode digits of the pin code"
            buttons={[
                [
                {
                    label: "Crack",
                    color: "green",
                    callback: handleCrack,
                    disabled: gameStatus !== 1,
                }
                ]
            ]}
            countdownDuration={timer * 1000}
            resetCallback={handleRetry}
            elapsedCallback={setElapsed}
            resetDelay={3000}
            status={gameStatus}
            setStatus={setGameStatus}
            statusMessage={getStatusMessage(gameStatus)}
            settings={isChallengeMode ? undefined : settings}
            >
            {/* Hidden input for mobile keyboard - number pad */}
            {isMobileOrTablet && gameStatus === 1 && (
                <input
                    ref={mobileInputRef}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
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
                    onKeyDown={handleMobileBackspace}
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
                    aria-label="Enter PIN digits"
                />
            )}
            <div
                ref={gameWrapperRef}
                className="
                h-56 sm:h-60 md:h-64 
                min-w-[calc(100vw-60px)] sm:min-w-[550px] md:min-w-[600px]
                w-full max-w-full
                rounded-lg
                bg-[rgba(0,28,49,0.3)]
                flex items-center justify-between
                text-white text-6xl sm:text-7xl md:text-8xl
                px-3 sm:px-5 md:px-6
                mx-auto
            "
                onTouchStartCapture={focusInputOnInteraction}
                onPointerDownCapture={focusInputOnInteraction}
                style={{ scrollMarginTop: '15vh' }}
            >
                {[...Array(pinLength)].map((_, index) => (
                <div key={index} className="flex flex-col items-center justify-center w-3/12 h-full gap-5 sm:gap-6 md:gap-7 rounded-md wrapper">
                    <div className='h-20 sm:h-24 md:h-28 digit'></div>
                    <div className="px-4 sm:px-6 md:px-7 h-1.5 bg-slate-400 marker"/>
                </div>
                ))}
            </div>
            </NPHackContainer>
            </div>
        </>
    );
}

export default Pincracker;