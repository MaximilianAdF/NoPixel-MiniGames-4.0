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
                    min-h-[400px]
                    rounded-lg
                    overflow-hidden
                    touch-manipulation
                `,
                props.className
            )}>                <div className="
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
                            
                            {/* Status Message - Overlay to prevent container expansion */}
                            {status !== undefined && status !== 0 && status !== 1 && (
                                <div className={classNames(
                                    `
                                        absolute top-3 right-3
                                        flex items-center gap-1.5 sm:gap-2
                                        px-3 sm:px-4 py-1.5 sm:py-2
                                        rounded-md
                                        text-xs sm:text-sm
                                        font-bold
                                        border-2
                                        animate-fadeIn
                                        transition-all
                                        z-10
                                        shadow-lg
                                        backdrop-blur-sm
                                        max-w-[calc(100%-1.5rem)]
                                    `,
                                    status === 2 ? "bg-red-900/90 border-red-500/60 text-red-300" :
                                    status === 3 ? "bg-emerald-900/90 border-emerald-500/60 text-emerald-300" :
                                    status === 4 ? "bg-yellow-900/90 border-yellow-500/60 text-yellow-300" : "hidden"
                                )}>
                                    {/* Compact Status Icons */}
                                    {status === 2 && (
                                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                        </svg>
                                    )}
                                    {status === 3 && (
                                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                        </svg>
                                    )}
                                    {status === 4 && (
                                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                                        </svg>
                                    )}
                                    <span className="truncate">{statusMessage}</span>
                                </div>
                            )}
                        </div>
                        {settings && <div 
                            className="flex justify-center items-center p-1 mr-4 sm:mr-7 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 shrink-0"
                            onClick={() => setSettingsVisible(true)}
                            role="button"
                            aria-label="Open Settings"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setSettingsVisible(true);
                                }
                            }}
                        >
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
