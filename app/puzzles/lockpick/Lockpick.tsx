"use client";

import NPLockpick from "@/app/components/NPLockpick";
import {FC} from "react";
import { useSearchParams } from "next/navigation";
import type { GameResult } from '@/app/game/types';

interface LockpickProps {
    seed?: number;
    onMatchEnd?: (result: GameResult) => void;
}

const Lockpick: FC<LockpickProps> = ({ seed, onMatchEnd }) => {
    const searchParams = useSearchParams();
    const isCompetitive = searchParams?.get('competitive') === 'true';

    // Default values - will be overridden by daily challenge if active
    return (
        <NPLockpick
            countdownDuration={20}  // Default: 20 seconds per level
            maxLevels={4}           // Default: 4 levels
            title={"Lockpick"}
            gameId="lockpick"
            isCompetitive={isCompetitive}
            seed={seed}
            onMatchEnd={onMatchEnd}
        />
    )
};
export default Lockpick;
