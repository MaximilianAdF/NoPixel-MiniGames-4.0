import { useCallback, useEffect, useState } from "react";

const useGame = (
    duration: number,
    statusUpdateHandler: (status: number) => void,
): [number, (status: number) => void, number] => {
    // Game status: 0=Stopped, 1=Running, 2=Failed, 3=Win, 4=Reset
    const [gameStatus, setGameStatus] = useState(0);
    const [streak, setStreak] = useState(0);

    const handleStatusUpdate = useCallback((status: number) => {
        console.log("Handling update", status);
        if (status === 3) {
            setStreak(prevStreak => prevStreak + 1);
        }
        if (status === 2 || status === 4) {
            setStreak(0)
        }

        setGameStatus(status);
        statusUpdateHandler(status);
    }, [statusUpdateHandler]);

    useEffect(() => {
        if (gameStatus === 0) {
            handleStatusUpdate(1);
        }
    }, [gameStatus, handleStatusUpdate]);

    return [gameStatus, handleStatusUpdate,  streak];
};

export default useGame;
