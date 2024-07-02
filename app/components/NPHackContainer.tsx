import React, {FC, ReactNode, useEffect, useState} from "react";
import NPButton from "@/app/components/NPButton";
import classNames from "classnames";
import {useCountdown} from "@/app/utils/useCountdown";
import useTimeout from "@/app/utils/useTimeout";
import NPSettings from "@/app/components/NPSettings";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear} from "@fortawesome/free-solid-svg-icons";

interface NPHackContainerButton {
    label: string,
    color: "purple" | "green",
    callback?: () => void,  // TODO: Make callback non-optional
    disabled: boolean,
}

interface NPHackContainerSettings {
    handleSave: () => void,
    handleReset: () => void,
    children: ReactNode,
}

interface NPHackContainerProps {
    children: ReactNode,
    title: string,
    description?: string,
    buttons: NPHackContainerButton[][],
    countdownDuration: number,
    elapsedCallback: (elapsed: number) => void,
    resetCallback: () => void,
    resetDelay: number,
    // frameSpeed: number,
    status: number,
    setStatus: (status: number) => void,
    statusMessage: string,
    settings?: NPHackContainerSettings,
    score?: number,
    targetScore?: number,

    // props: {[key: string]: any},
    className?: string,
}

const NPHackContainer: FC<NPHackContainerProps> = ({
    children,
    title,
    description,
    buttons,
    countdownDuration,
    elapsedCallback,
    resetCallback,
    resetDelay,
    // frameSpeed,
    status,
    setStatus,
    statusMessage,
    settings,
    score,
    targetScore,
    ...props
}) => {
    // This can be decreased if you need to call a func every frame
    // For now, 1s per frame seems reasonable

    const frameSpeed = 20;

    const resetTimeout = useTimeout(() => {
        resetCallback();
        resetCountdown();
    }, resetDelay);

    useEffect(() => {
        if (status !== 1 && status !== 0) {
            resetTimeout();
        }
    }, [resetTimeout, status]);

    const timerReset = () => {
        setStatus(2); 
    }

    const [countdown, resetCountdown, freezeCountdown] = useCountdown(timerReset, elapsedCallback, countdownDuration, frameSpeed);

    useEffect(() => {
        if (status !== 1 && status !== 0) {

            freezeCountdown();
        }
    }, [freezeCountdown, status]);
    
    const calculateTimerBar = () => {
        let width = 100
        if (status === 1) {
            // Only move the timer if the game is running
            width -= countdown;
            // We want to anticipate the next tick so the transition will start instantly
            width -= Math.max(Math.min(frameSpeed/countdownDuration,1),0) * 100;
            // And clamp that between 0-100
            width = Math.max(Math.min(width, 100),0);
        }
        return width;
    }


    const [settingsVisible, setSettingsVisible] = useState(false);


    return (
        <>
            {settings && <NPSettings
                handleReset={settings.handleReset}
                handleSave={settings.handleSave}
                visible={settingsVisible}
                setVisible={setSettingsVisible}
            >
                {settings.children}
            </NPSettings>}
            <div className={classNames(
                `
                    max-h-full max-w-full
                    rounded-lg
                    overflow-hidden
                `,
                props.className
            )}>
                <div className="
                    max-h-full max-w-full
                    relative
                    p-3
                    flex flex-col justify-center
                    bg-[rgb(7_19_32)]
                ">
                    {/* Header */}
                    <div className="
                        grid
                        grid-cols-[auto_min-content]
                        mb-4
                    ">
                        <div className="
                            flex items-center
                            gap-4
                        ">
                            <embed className="w-8 sm:w-10" src="/gamePad.svg"/>
                            <h2 className="
                                text-lg
                                sm:text-2xl
                                text-spring-green-300
                                [text-shadow:0_0_40px_rgb(127_255_191)]
                            ">{/*Originally, text shadow was 2.1px, but it looks much bigger on nopixel*/}
                                {title}
                            </h2>
                            <p className="
                                text-xs
                                sm:text-base
                                text-[rgb(142_142_142)]">
                                {description}
                            </p>
                        </div>
                        {settings && <div className="h-full flex aspect-square justify-center items-center p-1 mr-7">
                            <FontAwesomeIcon
                                icon={faGear}
                                className="
                                    size-full
                                    text-gray-500
                                    hover:rotate-90 hover:scale-110 hover:cursor-pointer
                                    transition-transform
                                "
                                onClick={() => setSettingsVisible(true)}
                                title={"Open Settings"}
                            />
                        </div>}
                        {targetScore && (
                            <div className="
                                col-span-full
                                text-center
                                text-white
                                text-lg
                            ">
                                {score}/{targetScore}
                            </div>
                        )}
                    </div>
                    {status !== undefined && <div className={classNames(
                        `
                            gap-2.5
                            absolute
                            right-14
                            top-4
                            text-white
                            px-4 py-2
                            rounded
                            flex items-center justify-center
                        `,
                        status === 2 ? "bg-[rgb(56_13_23)]" :
                        status === 3 ? "bg-[rgb(23_95_88)]" :
                        status === 4 ? "bg-[rgb(118_128_37)]" : "hidden"
                    )}>
                        {/* TODO: Refactor icons, they're completely broken */}
                        {/*{status === 2 && <i className="fa-solid text-2xl fa-circle-xmark text-[rgb(255_84_84)]"></i>}*/}
                        {/*{status === 3 && <i className="fa-solid text-2xl fa-circle-check text-[rgb(84_255_164)]"></i>}*/}
                        {/*{status === 0 && <i className="fa-solid text-2xl fa-hourglass-start text-[rgb(118_128_37)]"></i>}*/}

                        {/*<i className={classNames(*/}
                        {/*    "fa-solid text-2xl",*/}
                        {/*    status === 2 ? "fa-circle-xmark text-[rgb(255_84_84)]" :*/}
                        {/*    status === 3 ? "fa-circle-check text-[rgb(84_255_164)]" :*/}
                        {/*    status === 0 ? "fa-hourglass-start text-[rgb(118_128_37)]" : "hidden"  // TODO: Fix reset icon*/}
                        {/*)}></i>*/}
                        <p className="text-xs font-medium">{statusMessage}</p>
                    </div>}
                    {/* Main puzzle */}
                    <div className="w-full pb-2 flex-1">
                        {children}
                    </div>
                    {/* Buttons */}
                    <div className="flex flex-col w-full gap-1">
                        {buttons.map((buttonRow, index) => {
                            return (
                                <div className="flex gap-1 *:flex-1" key={index}>
                                    {buttonRow.map((button, index) => {
                                        return (
                                            <NPButton
                                                onClick={button.callback}
                                                color={button.color}
                                                key={index}
                                                disabled={button.disabled}
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
                {/* Timer bar */}
                {/* TODO: Check BG color, before react rewrite was rgb(36 47 59)*/}
                <div className="bg-[rgb(15_27_33)] flex w-full h-2.5">
                    <div
                        className={classNames(
                            "bg-[orangered] w-full h-full [transition:width_linear]",
                        )}
                        style={{
                            transitionDuration: status !== 1 ? "0ms" : `${frameSpeed}ms`,
                            // transitionTimingFunction: "cubic-bezier(0.4, 1, 0.7, 0.93)",
                            width: `${calculateTimerBar()}%`,
                        }}
                    ></div>
                </div>
            </div>
        </>
    );
}

export default NPHackContainer;
