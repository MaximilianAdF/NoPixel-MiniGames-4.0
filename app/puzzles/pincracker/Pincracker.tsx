"use client";

import { Digit, Digits, DigitState } from "@/app/puzzles/pincracker/utils";
import NPHackContainer from "@/app/components/NPHackContainer";
import { NPSettingsRange } from "@/app/components/NPSettings";
import React, { FC, useEffect, useState } from "react";
import { getStatusMessage } from "../thermite/utils";
import usePersistantState from "@/app/utils/usePersistentState";
import { useKeyDown } from "@/app/utils/useKeyDown";
import useGame from "@/app/utils/useGame";
import classNames from "classnames";
import { clear } from "console";
import { generate } from "random-words";

const defaultDuration = 20;

const Pincracker: FC = () => {
    const [timer, setTimer] = usePersistantState("chopping-timer", defaultDuration);
    const [settingsDuration, setSettingsDuration] = useState(defaultDuration);
    const [activeIndex, setActiveIndex] = usePersistantState("pincracker-active-index", 0);
    const [allowKeyDown, setAllowKeyDown] = useState(true);
    const [pin, setPin] = useState<Digit[]>();

    const handleCrack = () => {
        if (activeIndex < 4) {
            console.log('Incomplete pin');
        } else {
            const wrappers = document.querySelectorAll('.wrapper');
            const markers = document.querySelectorAll('.marker');
            const digits = document.querySelectorAll('.digit');
            const guess = Array.from(digits).map(d => (d.innerHTML as Digit));
            setAllowKeyDown(false);

            for (let i = 0; i < 4; i++) {
                setTimeout(() => {
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
                    console.log('Success!');
                    setGameStatus(3);
                }
                setActiveIndex(0);
                clearBoard(250);
            }, 1000);
        }
    }

    const clearBoard = (delay: number) => {
        const digits = document.querySelectorAll('.digit');
        for (let i = 3; i > -1; i--) {
            setTimeout(() => {
                digits[i].innerHTML = '';
            }, (4-i) * delay);
        }

        setTimeout(() => {
            setAllowKeyDown(true);
        }, delay * 4);
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
    
        const newPin = Digits.slice(0, 4);
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
                console.log('Reset game');
                resetBoard();

                break;
        }
    }

    const [gameStatus, setGameStatus] = useGame(timer*1000, statusUpdateHandler);

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
            if (activeIndex < 4) {
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
    }, ['1','2','3','4','5','6','7','8','9','0', 'Backspace', 'Enter']);

    useEffect(() => {
        if (gameStatus !== 4) {
            resetGame();
        }
    }, [timer])

    const settings = {
        handleSave: () => {
            setTimer(settingsDuration);
            setGameStatus(4);
        },

        handleReset: () => {
            setSettingsDuration(defaultDuration);
            setGameStatus(4);
        },

        children: (
            <div className="flex flex-col items-center">
                <NPSettingsRange
                    title={"Duration (seconds)"}
                    min={5}
                    max={30}
                    value={settingsDuration}
                    setValue={setSettingsDuration}
                />
            </div>
        )
    }

    return (
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
            countdownDuration={timer*1000}
            resetCallback={resetGame}
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

                <div className="flex flex-col items-center justify-center w-3/12 h-full gap-3 rounded-md wrapper">
                    <div className='h-[50px] digit'></div>
                    <div className="px-5 h-1 bg-slate-400 marker"/>
                </div>
                
                <div className="flex flex-col items-center justify-center w-3/12 h-full gap-3 rounded-md wrapper">
                    <div className='h-[50px] digit'></div>
                    <div className="px-5 h-1 bg-slate-400 marker"/>
                </div>

                <div className="flex flex-col items-center justify-center w-3/12 h-full gap-3 rounded-md wrapper">
                    <div className='h-[50px] digit'></div>
                    <div className="px-5 h-1 bg-slate-400 marker"/>
                </div>

                <div className="flex flex-col items-center justify-center w-3/12 h-full gap-3 rounded-md wrapper">
                    <div className='h-[50px] digit'></div>
                    <div className="px-5 h-1 bg-slate-400 marker"/>
                </div>

            </div>

        </NPHackContainer>
    );
}

export default Pincracker;