"use client";

import { successPlayer, checkBeepPlayer } from "@/public/audio/AudioManager";
import NPHackContainer from "@/app/components/NPHackContainer";
import {useCallback, useEffect, useState} from "react";
import useGame from "@/app/utils/useGame";
import { generate } from "random-words";
import GameStatsTracker from "@/app/components/GameStatsTracker";
import { NPSettingsRange } from "@/app/components/NPSettings";
import { useDailyChallenge } from "@/app/utils/useDailyChallenge";
import { useSearchParams } from "next/navigation";


const getStatusMessage = (status: number | undefined) => {
    switch (status) {
        case 0:
            return "Reset!";
        case 1:
            return "";
        case 2:
            return "Failed!";
        case 3:
            return "Succeeded!";
        default:
            return `Error: Unknown game status ${status}`;
    }
}

export default function WordMemory() {
    const { isChallengeMode, challengeData } = useDailyChallenge();
    const searchParams = useSearchParams();
    const isCompetitive = searchParams?.get('competitive') === 'true';
    
    const defaultWords = challengeData?.words || 25;
    const defaultDuration = challengeData?.targetTime ? Math.floor(challengeData.targetTime / 1000) : 25;
    
    const [numWords, setNumWords] = useState(defaultWords);
    const [timer, setTimer] = useState(defaultDuration);
    
    const [settingsNumWords, setSettingsNumWords] = useState(defaultWords);
    const [settingsDuration, setSettingsDuration] = useState(defaultDuration);

    // Reset to standard preset when in competitive mode
    useEffect(() => {
        if (isCompetitive) {
            setNumWords(25); // Standard: 25 words
            setTimer(25); // Standard: 25 seconds
            setSettingsNumWords(25);
            setSettingsDuration(25);
        }
    }, [isCompetitive]);

    // Update defaults when challenge data loads
    useEffect(() => {
        if (challengeData) {
            const words = challengeData.words || 25;
            const duration = challengeData.targetTime ? Math.floor(challengeData.targetTime / 1000) : 25;
            setNumWords(words);
            setTimer(duration);
            setSettingsNumWords(words);
            setSettingsDuration(duration);
        }
    }, [challengeData]);

    useEffect(() => {
        setSettingsNumWords(numWords);
        setSettingsDuration(timer);
    }, [numWords, timer]);

    useEffect(() => {
        checkBeepPlayer.whenReady();
        successPlayer.whenReady();
    }, []);

    const statusUpdateHandler = useCallback((newStatus: number) => {
        if (newStatus === 1) {
            // Reset game - generate new words based on current numWords setting
            const newWords = generate(Math.floor(numWords / 2)) as string[];
            setAvailableWords(newWords);
            setSeenWords([]);
            setCurrentRound(0);
            // Set initial random word from the new word list
            setCurrentWord(newWords[Math.floor(Math.random() * newWords.length)]);
        }
    }, [numWords]);
    
    const getRandomWords = () => {
        return generate(Math.floor(numWords / 2)) as string[];  // half as many words as rounds
    }

    const [gameStatus, setGameStatus, streak] = useGame(timer, statusUpdateHandler);

    const [currentRound, setCurrentRound] = useState(0);
    const [currentWord, setCurrentWord] = useState<string>();
    const [seenWords, setSeenWords] = useState<string[]>([]);
    const [availableWords, setAvailableWords] = useState(getRandomWords);
    const [elasped, setElapsed] = useState<number>(0);

    const setRandomWord = useCallback(() => {
        setSeenWords((v) => v.concat([currentWord as string]));
        setCurrentWord(availableWords[Math.floor(Math.random() * availableWords.length)]);
    }, [availableWords, currentWord]);

    const resetGame = () => {
        setGameStatus(1);
    };

    const handleWin = (message: string) => {
        // Win
        successPlayer.play();

        setGameStatus(3);
    }

    const handleLose = (message: string) => {
        // Lose
        //Play fail sound

        setGameStatus(2);
    }

    const nextRound = () => {
        if (currentRound >= numWords) {
            handleWin("All rounds completed");
        } else {
            checkBeepPlayer.play();
            setCurrentRound((v) => v+1);
            setRandomWord();
        }
    }

    const handleSeen = () => {
        if (seenWords.includes(currentWord as string)) {
            nextRound();
        } else {
            handleLose(`${currentWord} not seen yet (${seenWords})`);
        }
    }

    const handleNew = () => {
        if (!seenWords.includes(currentWord as string)) {
            nextRound();
        } else {
            handleLose(`${currentWord} already seen (${seenWords})`);
        }
    }

    const settings = {
        handleSave: () => {
            setNumWords(settingsNumWords);
            setTimer(settingsDuration);
        },
        handleReset: () => {
            setSettingsNumWords(defaultWords);
            setSettingsDuration(defaultDuration);
        },
        children: (
            <>
                <NPSettingsRange
                    title={"Number of Words"}
                    min={20}
                    max={100}
                    value={settingsNumWords}
                    setValue={setSettingsNumWords}
                />
                <NPSettingsRange
                    title={"Timer (seconds)"}
                    min={20}
                    max={50}
                    value={settingsDuration}
                    setValue={setSettingsDuration}
                />
            </>
        )
    };
    
    // Reset game when numWords or timer changes (after settings are saved)
    useEffect(() => {
        if (gameStatus !== 0) { // Don't reset on initial load (status 0)
            resetGame();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numWords, timer]);
    
    return (
        <>
            <GameStatsTracker
                game="word-memory"
                gameStatus={gameStatus}
                score={currentRound}
                elapsedMs={elasped}
                wonStatus={3}
                lostStatus={2}
                gameSettings={{
                    numWords,
                    duration: timer,
                }}
            />
            {/* <StatHandler
                streak={streak}
                elapsed={elasped}
                minigame={
                    {
                        puzzle: "WordMemory",
                        preset: "Standard",
                        duration: timer,
                    }
                }
            /> */}
            <NPHackContainer
                title="Word Memory"
                description="Memorize the words seen"
                buttons={[
                    [
                        {
                            label: "Seen",
                            color: "purple",
                            callback: handleSeen,
                            disabled: gameStatus !== 1,
                        },
                        {
                            label: "New",
                            color: "green",
                            callback: handleNew,
                            disabled: gameStatus !== 1,
                        }
                    ],
                ]}
                countdownDuration={timer * 1000}
                resetCallback={resetGame}
                elapsedCallback={setElapsed}
                resetDelay={3000}
                status={gameStatus}
                setStatus={setGameStatus}
                statusMessage={getStatusMessage(gameStatus)}
                settings={isChallengeMode ? undefined : settings}
            >
                <p className="text-white text-2xl text-center w-full">{currentRound}/{numWords}</p>
                <div className="
                    h-32 w-[750px] max-w-full
                    rounded-lg
                    bg-[rgba(0,28,49,0.3)]
                    flex items-center justify-center
                    text-white text-5xl
                ">
                    <p>{currentWord}</p>
                </div>
            </NPHackContainer>
        </>
    );
}
