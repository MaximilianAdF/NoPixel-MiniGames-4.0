import React, {FC, useEffect, useState} from "react";
import { gilroyNpTitle } from "@/app/fonts";
import NPButton from "@/app/components/NPButton";
import classNames from "classnames";
import {useCountdown} from "@/app/utils/useCountdown";
import useTimeout from "@/app/utils/useTimeout";
import NPSettings from "@/app/components/NPSettings";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import gamePadIcon from '@/public/gamePad.svg';

interface NPHackContainerButton {
    label: string,
    color: "purple" | "green",
    callback?: () => void,  // TODO: Make callback non-optional
    disabled: boolean,
}

interface NPHackContainerSettings {
    handleSave: () => void,
    handleReset: () => void,
    children: React.ReactNode,
}

interface NPHackContainerProps {
    children: React.ReactNode,
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

    const [countdownProgress, resetCountdown, freezeCountdown] = useCountdown(timerReset, elapsedCallback, countdownDuration);

    useEffect(() => {
        if (status !== 1 && status !== 0) {

            freezeCountdown();
        }
    }, [freezeCountdown, status]);
    
    const currentTimerScale = status === 0
        ? 1
        : Math.max(1 - countdownProgress / 100, 0);


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
                    touch-manipulation
                `,
                props.className
            )}>
                <div className="
                    max-h-full max-w-full
                    relative
                    p-2 sm:p-3
                    flex flex-col justify-center
                    bg-[rgb(7_19_32)]
                ">
                    {/* Header */}
                    <div className="
                        grid
                        grid-cols-[auto_min-content]
                        mb-3 sm:mb-4
                    ">
                        <div className="
                            flex items-center
                            gap-2 sm:gap-4
                        ">
                            <Image
                                src={gamePadIcon}
                                alt="Gamepad"
                                className="size-6 sm:size-8 md:size-10"
                                style={{ filter: 'brightness(0) saturate(100%) invert(54%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(88%) contrast(88%)' }}
                                width={32}
                                height={32}
                            />
                            <h2 className={`
                                text-base
                                sm:text-lg
                                md:text-2xl
                                text-spring-green-300
                                [text-shadow:0_0_2px_rgb(127_255_191)]
                                ${gilroyNpTitle.className}
                            `}>
                                {title}
                            </h2>
                            <p className="
                                text-[10px]
                                sm:text-xs
                                md:text-base
                                text-[rgb(142_142_142)]
                                hidden sm:block">
                                {description}
                            </p>
                        </div>
                        {settings && <div className="flex justify-center items-center p-1 mr-4 sm:mr-7 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 shrink-0">
                            <FontAwesomeIcon
                                icon={faGear}
                                className="
                                    w-full h-full
                                    text-gray-500
                                    hover:rotate-90 hover:scale-110 hover:cursor-pointer
                                    active:scale-95
                                    transition-transform
                                "
                                style={{ WebkitTextSizeAdjust: '100%', textSizeAdjust: '100%' }}
                                onClick={() => setSettingsVisible(true)}
                                title={"Open Settings"}
                            />
                        </div>}
                        {targetScore && (
                            <div className="
                                col-span-full
                                text-center
                                text-white
                                text-base sm:text-lg
                            ">
                                {score}/{targetScore}
                            </div>
                        )}
                    </div>
                    {status !== undefined && <div className={classNames(
                        `
                            gap-2 sm:gap-2.5
                            absolute
                            right-8 sm:right-14
                            top-3 sm:top-4
                            text-white
                            px-2 sm:px-4 py-1 sm:py-2
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
                        <p className="text-[10px] sm:text-xs font-medium">{statusMessage}</p>
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
                <div className="bg-[rgb(15_27_33)] flex w-full h-2 sm:h-2.5 overflow-hidden">
                    <div
                        className="bg-[orangered] w-full h-full will-change-transform"
                        style={{
                            transform: `scaleX(${currentTimerScale})`,
                            transformOrigin: "left center",
                            transition: status === 1 ? "none" : "transform 160ms ease-out",
                        }}
                    ></div>
                </div>
            </div>
        </>
    );
}

export default NPHackContainer;
