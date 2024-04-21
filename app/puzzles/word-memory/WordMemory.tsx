"use client";

import NPHackContainer from "@/app/components/NPHackContainer";
import {useCallback, useState} from "react";
import useGame from "@/app/utils/useGame";
import {generate} from "random-words";


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

// const availableWords = [
//     "alleviations",
//     "surfer",
//     "depilate",
//     "rondeaux",
//     "valencias",
//     "sorbitols",
// ];
//
// const getRandomWord = () => {
//     // TODO: How should a random word be selected? Is there a % chance of getting a new word?
//     console.log("New word");
//     return availableWords[Math.floor(Math.random() * availableWords.length)];
// }

export default function WordMemory() {
    const countdownDuration = 25;  // TODO: Get the actual speed
    const maxRounds = 25;

    const statusUpdateHandler = (newStatus: number) => {
        switch (newStatus) {
            case 1:
                console.log('Reset game');
                setRandomWord();
                setCurrentRound(0);
                setSeenWords([]);
                setAvailableWords(getRandomWords());
                break;
        }
    }
    const getRandomWords = () => {
        return generate(maxRounds / 2) as string[];  // half as many words as rounds
    }

    const [gameStatus, setGameStatus] = useGame(countdownDuration, statusUpdateHandler);

    const [currentRound, setCurrentRound] = useState(0);
    const [currentWord, setCurrentWord] = useState<string>();
    const [seenWords, setSeenWords] = useState<string[]>([]);
    const [availableWords, setAvailableWords] = useState(getRandomWords);

    const setRandomWord = useCallback(() => {
        setSeenWords((v) => v.concat([currentWord as string]));
        setCurrentWord(availableWords[Math.floor(Math.random() * availableWords.length)]);
    }, [availableWords, currentWord]);

    const resetGame = () => {
        setGameStatus(1);
    };

    const handleWin = (message: string) => {
        console.log(`Win: ${message}`);

        setGameStatus(3);
    }

    const handleLose = (message: string) => {
        console.log(`Lose: ${message}`);

        setGameStatus(2);
    }

    const nextRound = () => {
        if (currentRound >= maxRounds) {
            handleWin("All rounds completed");
        } else {
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

    return (
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
            countdownDuration={countdownDuration}
            resetCallback={resetGame}
            resetDelay={3000}
            status={gameStatus}
            setStatus={setGameStatus}
            statusMessage={getStatusMessage(gameStatus)}
        >
            <p className="text-white text-2xl text-center w-full">{currentRound}/{maxRounds}</p>
            <div className="
                h-32 w-[750px] max-w-full
                rounded-lg
                bg-[rgb(22_40_52)]
                flex items-center justify-center
                text-white text-5xl
            ">
                <p>{currentWord}</p>
            </div>
        </NPHackContainer>
    );
}
