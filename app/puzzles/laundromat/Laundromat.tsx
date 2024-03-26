import NPLockpick from "@/app/components/NPLockpick";
import {FC} from "react";

const Laundromat: FC = () => {
    return (
        <NPLockpick
            countdownDuration={12}
            maxLevels={5}
            title={"Laundromat"}
        />
    )
};
export default Laundromat;
