"use client";

import NPLockpick from "@/app/components/NPLockpick";
import {FC} from "react";
import { useSearchParams } from "next/navigation";

const Laundromat: FC = () => {
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
        />
    )
};
export default Laundromat;
