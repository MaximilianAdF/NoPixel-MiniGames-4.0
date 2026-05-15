"use client";

import NPLockpick from "@/app/components/NPLockpick";
import {FC} from "react";
import { useSearchParams } from "next/navigation";
import type { GameResult } from '@/app/game/types';

interface LaundromatProps {
    seed?: number;
    onMatchEnd?: (result: GameResult) => void;
}

const Laundromat: FC<LaundromatProps> = ({ seed, onMatchEnd }) => {
    const searchParams = useSearchParams();
    const isCompetitive = searchParams?.get('competitive') === 'true';

    // Default values - will be overridden by daily challenge if active
    return (
        <NPLockpick
            countdownDuration={12}  // Default: 12 seconds per level
            maxLevels={5}           // Default: 5 levels
            title={"Laundromat"}
            gameId="laundromat"
            isCompetitive={isCompetitive}
            seed={seed}
            onMatchEnd={onMatchEnd}
        />
    )
};
export default Laundromat;
