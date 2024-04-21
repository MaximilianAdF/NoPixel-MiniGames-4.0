import {ChangeEventHandler, FC, ReactNode} from "react";

import React from 'react';
import classNames from "classnames";
import NPButton from "@/app/components/NPButton";

const handleRange = (callback: (v: any) => void): ChangeEventHandler<HTMLInputElement> => {
    return (event) => {
        callback(+event.target.value);
    }
}

interface NPSettingsRange {
    title: string,
    value: number,
    setValue: (value: number) => void,
    min: number,
    max: number,
}

export const NPSettingsRange: FC<NPSettingsRange> = ({
    title,
    value,
    setValue,
    min,
    max,
}) => {
    return (
        <div className="
            text-xl
            flex flex-col
            gap-1
            items-center justify-center
            pb-[45px]
        ">
            <div className="
                relative w-[calc(100%-20px)]
            ">
                <span
                    className="
                    absolute text-center
                    size-[25px]
                    text-[rgb(22_40_52/97.9)]
                    top-[60px]
                    [font-size:15px]
                    [transform:translateX(-50%)]
                    [line-height:45px]
                    z-[2]

                    after:box-content
                    after:absolute after:text-center
                    after:size-[25px]
                    after:left-[50%]
                    after:top-[30%]
                    after:[font-size:15px]
                    after:[line-height:45px]
                    after:content-['']
                    after:bg-spring-green-300
                    after:[transform:translateX(-50%)_rotate(45deg)]
                    after:[border:3px_solid_rgb(22_40_52/0.651)]
                    after:rounded-b-[70%] after:rounded-tr-[70%]
                    after:z-[-1]
                    "
                    // style={{left: `calc(calc(${(value-min) / (max-min)} * calc(100% - 5px)) + 5px)`}}
                    style={{left: `${(value-min) / (max-min) * 100}%`}}
                >{value}</span>
            </div>
            <label htmlFor={`np-settings-range-${title}`} className="text-[rgb(94_93_93)]">{title}</label>
            <input
                className={classNames(`
                    appearance-none
                    w-full h-5
                    bg-transparent
                    outline-none
                    cursor-pointer
                    rounded-full
                    [box-shadow:0_0_2px_rgb(127_255_191)]
                    transition-all duration-300
                    `,
                    "accent-spring-green-300", // Fallback, probably not needed
                    `
                    [&::-webkit-slider-thumb]:box-border
                    [&::-webkit-slider-thumb]:bg-spring-green-300
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:size-5
                    [&::-webkit-slider-thumb]:[border:1px_solid_rgb(22_40_52/0.651)]
                    `,
                    `
                    [&::-moz-range-thumb]:box-border
                    [&::-moz-range-thumb]:bg-spring-green-300
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:appearance-none
                    [&::-moz-range-thumb]:size-5
                    [&::-moz-range-thumb]:[border:1px_solid_rgb(22_40_52/0.651)]
                    `,
                    )
                }
                type="range"
                id={`np-settings-range-${title}`}
                min={min}
                max={max}
                value={value}
                onChange={handleRange(setValue)}
            />
        </div>
    )
}

interface NPSettingsProps {
    children: ReactNode,
    handleReset: () => void,
    handleSave: () => void,
    visible: boolean,
    setVisible: (visible: boolean) => void,
}

const NPSettings: FC<NPSettingsProps> = ({
    children,
    handleReset,
    handleSave,
    visible,
    setVisible
}) => {
    return (
        <>
            <div
                className={classNames(
                    `
                        fixed w-full h-full
                        top-0 left-0
                        bg-black/50
                        z-30
                    `,
                    visible ? "" : "hidden",
                )}
                onClick={() => setVisible(false)}
            ></div>
            <div className={classNames(
                `
                    absolute
                    w-[640px] max-w-[90%]
                    p-4 gap-5
                    top-[300px]
                    left-[50%]
                    my-5
                    -translate-x-1/2
                    flex flex-col
                    bg-radient-circle-c
                    from-[rgb(15_27_33/0.781)]
                    to-[rgb(15_27_33)]
                    [outline:3px_solid_rgb(84_255_164)]
                    rounded-lg
                    z-40
                `,
                visible ? "" : "hidden",
            )}>
                <div className="
                    mb-5
                    h-10
                    flex items-center justify-between
                    gap-4
                ">
                    <h2 className="
                        text-lg
                        sm:text-2xl
                        text-spring-green-300
                        [text-shadow:0_0_40px_rgb(127_255_191)]
                    ">{/*Originally, text shadow was 2.1px, but it looks much bigger on nopixel*/}
                        Settings
                    </h2>
                    <button onClick={() => setVisible(false)}>
                        <i
                            className="
                                fas fa-xmark
                                text-lg sm:text-2xl
                                text-[rgb(94_93_93)]
                                aspect-square
                            "
                        ></i>
                    </button>
                </div>
                {children}
                <div className="flex w-full gap-1 *:flex-1">
                    <NPButton
                        color="green"
                        onClick={() => {
                            setVisible(false);
                            handleSave();
                        }}
                    >
                        Save
                    </NPButton>
                    <NPButton
                        color="purple"
                        onClick={() => {
                            setVisible(false);
                            handleReset();
                        }}
                    >
                        Reset
                    </NPButton>
                </div>
            </div>
        </>
    );
}

export default NPSettings;
