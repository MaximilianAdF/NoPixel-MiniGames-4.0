"use client";

import { successPlayer, checkBeepPlayer } from "@/public/audio/AudioManager";
import { Letter, Letters, LetterState } from "@/app/puzzles/chopping/utils";
import usePersistantState from "@/app/utils/usePersistentState";
import NPHackContainer from "@/app/components/NPHackContainer";
import { NPSettingsRange } from "@/app/components/NPSettings";
import StatHandler from "@/app/components/StatHandler";
import React, { FC, useEffect, useState } from "react";
import { useKeyDown } from "@/app/utils/useKeyDown";
import useGame from "@/app/utils/useGame";
import classNames from "classnames";


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


    const resetBoard = () => {
        const newBoard: Letter[] = [];
        console.log(`Resetting board with ${numLetters} letters`);
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
                console.log('Reset game');
                resetBoard();
                break;
        }
    }

    const [gameStatus, setGameStatus, streak] = useGame(timer*1000, statusUpdateHandler);
    

    const resetGame = () => {
        setGameStatus(1);
    }

    const handleWin = (message: string) => {
        console.log(`Win: ${message}`);
        successPlayer.play();
        setGameStatus(3);
    }

    const handleLose = (message: string) => {
        console.log(`Lose: ${message}`);
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
    }


    const [settingsNumLetters, setSettingsNumLetters] = useState(defaultNumLetters);
    const [settingsDuration, setSettingsDuration] = useState(defaultDuration);

    useEffect(() => {
        setSettingsNumLetters(numLetters);
        setSettingsDuration(timer);

        if (gameStatus !== 4) {
            resetGame();
        }
    }, [numLetters, timer]);

        
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
                <div className="
                    h-max w-max max-w-full
                    rounded-lg
                    bg-[rgb(22_40_52)]
                    flex items-center justify-center
                    text-white text-5xl
                    p-2
                ">
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
        </>
    )

}

export default Chopping;