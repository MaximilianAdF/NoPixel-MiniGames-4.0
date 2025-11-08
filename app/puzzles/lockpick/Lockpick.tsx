"use client";

import NPLockpick from "@/app/components/NPLockpick";
import {FC} from "react";
import { useSearchParams } from "next/navigation";

const Lockpick: FC = () => {
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
        />
    )
};
export default Lockpick;
