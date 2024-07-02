"use client";

import React, { FC } from "react";

interface HighscoreProps {
    highscore: number,
    streak: number,
}

const HighscoreProvider: FC<HighscoreProps> = ({
    highscore,
    streak,
}) => {
    return (
        <div className="absolute top-0 p-5 w-screen h-screen">
            <div className="absolute right-5">
                <div className="text-white">Highscore: {highscore}</div>
                <div className="text-white">Streak: {streak}</div>
            </div>
        </div>
    )
}

export default HighscoreProvider;