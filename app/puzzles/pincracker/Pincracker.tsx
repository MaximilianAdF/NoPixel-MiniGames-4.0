"use client";

import { checkBeepPlayer, successPlayer } from "@/public/audio/AudioManager";
import { Digit, Digits } from "@/app/puzzles/pincracker/utils";
import NPHackContainer from "@/app/components/NPHackContainer";
import { NPSettingsRange } from "@/app/components/NPSettings";
import React, { FC, useEffect, useState } from "react";
import usePersistantState from "@/app/utils/usePersistentState";
import { useKeyDown } from "@/app/utils/useKeyDown";
import useGame from "@/app/utils/useGame";
import StatHandler from "@/app/components/StatHandler";
import NPButton from "@/app/components/NPButton";

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
    const [timer, setTimer] = usePersistantState("chopping-timer", defaultDuration);
    const [settingsDuration, setSettingsDuration] = useState(defaultDuration);
    const [settingsPinLength, setSettingsPinLength] = useState(defaultPinLength);
    const [activeIndex, setActiveIndex] = usePersistantState("pincracker-active-index", 0);
    const [allowKeyDown, setAllowKeyDown] = useState(true);
    const [autoClear, setAutoClear] = useState(true);
    const [pinLength, setPinLength] = useState(4);
    const [pin, setPin] = useState<Digit[]>();
    const [elapsed, setElapsed] = useState(0);

    const handleCrack = () => {
        if (activeIndex < pinLength) {
            console.log('Incomplete pin');
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
        console.log(`Resetting cracker with ${timer} seconds`);
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

    const resetGame = () => {
        setGameStatus(1);
    }

    const removeDigit = (idx: number) => {
        const digits = document.querySelectorAll('.digit');
        digits[idx].innerHTML = '';
    }

    const handleKeyDown = (key: string) => {
        if (key === 'Enter') {
            handleCrack();
        }

        else if (key === 'Backspace') {
            setActiveIndex(Math.max(activeIndex - 1, 0));
            removeDigit(Math.max(activeIndex - 1, 0));
        }

        else {
            if (activeIndex < pinLength) {
                const digits = document.querySelectorAll('.digit');
                digits[activeIndex].innerHTML = key.toString();
                setActiveIndex(activeIndex + 1);
            }
        }

    }

    useKeyDown((key?: string) => {
        if (allowKeyDown && key && gameStatus == 1) {
            handleKeyDown(key);
        }
    }, ['1','2','3','4','5','6','7','8','9','0', 'Backspace', 'Enter'], allowKeyDown);

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
            <StatHandler
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
            />
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
            resetCallback={resetGame}
            elapsedCallback={setElapsed}
            resetDelay={3000}
            status={gameStatus}
            setStatus={setGameStatus}
            statusMessage={getStatusMessage(gameStatus)}
            settings={settings}
            >
            <div className="
                h-32 w-[600px] max-w-full
                rounded-lg
                bg-[rgb(22_40_52)]
                flex items-center justify-between
                text-white text-5xl
            ">
                {[...Array(pinLength)].map((_, index) => (
                <div key={index} className="flex flex-col items-center justify-center w-3/12 h-full gap-3 rounded-md wrapper">
                    <div className='h-[50px] digit'></div>
                    <div className="px-5 h-1 bg-slate-400 marker"/>
                </div>
                ))}
            </div>
            </NPHackContainer>
        </>
    );
}

export default Pincracker;