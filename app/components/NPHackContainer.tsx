import {FC, ReactNode, useEffect, useState} from "react";
import NPButton from "@/app/components/NPButton";
import classNames from "classnames";
import {useCountdown} from "@/app/utils/useCountdown";
import useTimeout from "@/app/utils/useTimeout";

interface NPHackContainerButton {
    label: string,
    color: "purple" | "green",
    callback?: () => void,  // TODO: Make callback non-optional
    disabled: boolean,
}

interface NPHackContainerProps {
    children: ReactNode,
    title: string,
    description?: string,
    buttons: NPHackContainerButton[][],
    countdownDuration: number,
    resetCallback: () => void,
    resetDelay: number,
    // frameSpeed: number,
    status?: number,
    statusMessage?: string,
}

const NPHackContainer: FC<NPHackContainerProps> = ({
    children,
    title,
    description,
    buttons,
    countdownDuration,
    resetCallback,
    resetDelay,
    // frameSpeed,
    status,
    statusMessage,
}) => {
    // This can be decreased if you need to call a func every frame
    // For now, 1s per frame seems reasonable

    const frameSpeed = 1000;

    const resetTimeout = useTimeout(() => {
        resetCallback();
        resetCountdown();
    }, resetDelay);

    useEffect(() => {
        if (status !== 1 && status !== 0) {
            resetTimeout();
        }
    }, [resetTimeout, status]);

    // TODO: The timer bar doesn't start moving until the first tick, should probably fix this.
    const [countdown, resetCountdown, freezeCountdown] = useCountdown(resetTimeout, countdownDuration, frameSpeed);

    useEffect(() => {
        if (status !== 1 && status !== 0) {
            freezeCountdown();
        }
    }, [freezeCountdown, status]);

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
                        status === 2 ? "bg-[rgb(56_13_23)]" :
                        status === 3 ? "bg-[rgb(23_95_88)]" :
                        status === 0 ? "bg-[rgb(118_128_37)]" : ""
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
                <div className="bg-[rgb(15_27_33)] flex w-full h-2.5">
                    <div
                        className={classNames(
                            "bg-[orangered] w-full h-full [transition:width_linear]",
                        )}
                        style={{
                            transitionDuration: countdown < 1 ? "0ms" : `${frameSpeed}ms`,
                            // transitionTimingFunction: "cubic-bezier(0.4, 1, 0.7, 0.93)",
                            width: `${100-countdown}%`,
                        }}
                    ></div>
                </div>
            </div>
        </>
    )
}

export default NPHackContainer;
