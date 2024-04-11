import NPLockpick from "@/app/components/NPLockpick";
import {FC} from "react";

const Lockpick: FC = () => {
    return (
        <NPLockpick
            countdownDuration={20}
            maxLevels={4}
            title={"Lockpick"}
        />
    )
};
export default Lockpick;
