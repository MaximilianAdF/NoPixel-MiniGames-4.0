import {FC, ReactNode} from "react";
import NPButton from "@/app/components/NPButton";
import classNames from "classnames";

interface NPHackContainerButton {
    label: string,
    color: "purple" | "green",
    callback?: () => void  // TODO: Make callback non-optional
}

interface NPHackContainerProps {
    children: ReactNode,
    title: string,
    description?: string,
    buttons: NPHackContainerButton[][],
    status?: "lose" | "win" | "reset",
    statusMessage?: string,
}

const NPHackContainer: FC<NPHackContainerProps> = ({
    children,
    title,
    description,
    buttons,
    status,
    statusMessage,
}) => {
    return (
        <>
            <div className="
                rounded-lg
                mx-auto
                overflow-hidden
            ">
                <div className="
                    relative
                    p-3
                    flex flex-col items-center justify-center
                    bg-[rgb(7_19_32)]
                    h-full w-full
                ">
                    <div className="
                        ml-5 mb-5
                        w-full
                        flex items-center
                        gap-4
                    ">
                        <embed className="w-10" src="/gamePad.svg"/>
                        <h2 className="
                            text-2xl text-spring-green-300
                            [text-shadow:0_0_40px_rgb(127_255_191)]
                        ">{/*Originally, text shadow was 2.1px, but it looks much bigger on nopixel*/}
                            {title}
                        </h2>
                        <p className="text-base text-[rgb(142_142_142)]">
                            {description}
                        </p>
                    </div>
                    {status !== undefined && <div className={classNames(
                        `
                            gap-2.5
                            absolute
                            right-2.5
                            top-2.5
                            text-white
                            px-4 py-2
                            rounded
                            flex items-center justify-center
                        `,
                        status === "lose" ? "bg-[rgb(56_13_23)]" :
                        status === "win" ? "bg-[rgb(23_95_88)]" :
                        status === "reset" ? "bg-[rgb(118_128_37)]" : ""
                    )}>
                        <i className="
                            fa-solid
                            fa-circle-xmark

                            text-2xl
                            text-[rgb(255_84_84)]
                            "></i>
                        <p className="text-xs font-medium">{statusMessage}</p>
                    </div>}
                    <div className="win-message hidden">
                        <i className="fa-solid fa-circle-check"></i>
                        <p>The lock was picked successfully.</p>
                    </div>
                    <div className="reset-message hidden">
                        <i className="fas fa-hourglass-start"></i>
                        <p>Reset!</p>
                    </div>
                    <div className="w-full mb-2">
                        {children}
                    </div>
                    <div className="flex flex-col w-full gap-1">
                        {buttons.map((buttonRow, index) => {
                            return (
                                <div className="flex gap-1" key={index}>
                                    {buttonRow.map((button, index) => {
                                        return (
                                            <NPButton
                                                onClick={button.callback}
                                                color={button.color}
                                                key={index}
                                            >
                                                {button.label}
                                            </NPButton>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="timer-container">
                    <div className="timer-progress-bar"></div>
                </div>
            </div>
        </>
    )
}

export default NPHackContainer;
