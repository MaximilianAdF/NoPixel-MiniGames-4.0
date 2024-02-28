"use client";

import NPHackContainer from "@/app/components/NPHackContainer";
import {useCallback, useEffect, useRef, useState} from "react";


const availableWords = [
    "alleviations",
    "surfer",
    "depilate",
    "rondeaux",
    "valencias",
    "sorbitols",
];

export default function WordMemory() {
    const maxRounds = 25;

    // Game status: 0=Stopped,1=Running,2=Failed,3=Win
    const [gameStatus, setGameStatus] = useState(0);
    const [currentRound, setCurrentRound] = useState(0);
    const [currentWord, setCurrentWord] = useState<string | null>(null);
    const [seenWords, setSeenWords] = useState<string[]>([]);

    const resetTimeout = useRef<NodeJS.Timeout | undefined>(undefined);


    const setRandomWord = useCallback(() => {
        // TODO: How should a random word be selected? Is there a % chance of getting a new word?
        console.log("new word")
        setSeenWords((v) => v.concat([currentWord as string]));
        setCurrentWord(availableWords[Math.floor(Math.random() * availableWords.length)]);
    }, [currentWord]);

    const resetGame = useCallback(() => {
        console.log('Reset game');
        setGameStatus(1);
        setRandomWord();
        setCurrentRound(0);
        setSeenWords([]);
    }, [setRandomWord]);


    const handleWin = (message: string) => {
        console.log(`Win: ${message}`);

        setGameStatus(3);
        resetTimeout.current = setTimeout(resetGame, 3000);
    }

    const handleLose = (message: string) => {
        console.log(`Lose: ${message}`);

        setGameStatus(2);
        resetTimeout.current = setTimeout(resetGame, 3000);
    }

    const handleGameOver = (result: boolean) => {

}

    const handleSeen = () => {
        if (seenWords.includes(currentWord as string)) {
            setCurrentRound((v) => v+1);
            setRandomWord();
        } else {
            handleLose(`${currentWord} not seen yet (${seenWords})`);
        }
    }

    const handleNew = () => {
        if (!seenWords.includes(currentWord as string)) {
            setCurrentRound((v) => v+1);
            setRandomWord();
        } else {
            handleLose(`${currentWord} already seen (${seenWords})`);
        }
    }

    useEffect(() => {
        if (currentWord === null) {
            setRandomWord();
        }
    }, [currentWord, setRandomWord]);

    useEffect(() => {
        setSeenWords([]);
        setCurrentRound(0);
        setGameStatus(1);
    }, [])

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
                    },
                    {
                        label: "New",
                        color: "green",
                        callback: handleNew,
                    }
                ],
            ]}
            status={
                gameStatus === 2 ? "lose" :
                gameStatus === 3 ? "win" :
                gameStatus === 0 ? "reset" : undefined
            }
            statusMessage={
                gameStatus === 2 ? "Failed!" :
                gameStatus === 3 ? "Succeeded!" :
                gameStatus === 0 ? "Reset!" : ""

            }
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
