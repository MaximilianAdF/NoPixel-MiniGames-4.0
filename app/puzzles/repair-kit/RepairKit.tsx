"use client";

import {useState, useEffect, useCallback, useRef} from "react";

import classNames from 'classnames';
import {useKeyDown} from "@/app/utils/useKeyDown";
import {useInterval} from "@/app/utils/useInterval";
import StatHandler from "@/app/components/StatHandler";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSmile, faFaceMeh, faFaceAngry, faFaceDizzy} from "@fortawesome/free-solid-svg-icons";


export default function RepairKit() {
    // Game status: 0=Stopped,1=Running,2=Failed,3=Win
    const [gameStatus, setGameStatus] = useState(0);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [slotPosition, setSlotPosition] = useState<number | null>(null);
    const resetTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
    const [allowKeyDown, setAllowKeyDown] = useState(true);
    const [tickSpeed, setTickSpeed] = useState(5);
    const [streak, setStreak] = useState(0);

    const handleWin = (message: string) => {
        console.log(`Win: ${message}`);
        setStreak((v) => v+1);
        setGameStatus(3);
        // gameStatus=3 triggers an animation.
        // setTimeout(() => setGameStatus(0), 300);
    }

    const handleLose = (message: string) => {
        console.log(`Lose: ${message}`);
        setStreak(0);
        setGameStatus(2);
    }

    const handleGameOver = (result?: boolean) => {
        if (gameStatus !== 1)
            return;  // Ignore if game not running
        if (slotPosition === null)
            return;

        if (result === undefined) {
            const deviation = Math.abs(currentPosition - slotPosition);
            const message = `${deviation}% deviation`;

            if (deviation <= 2) {
                handleWin(message);
            } else {
                handleLose(message);
            }
        } else {
            if (result) {
                handleWin("Unknown");
            } else {
                handleLose("Waited too long!");
            }
        }

        resetTimeout.current = setTimeout(resetGame, 1000);
    }

    const handleKeyDown = () => {
        handleGameOver();
    }

    const resetGame = useCallback(() => {
        setCurrentPosition(0);
        randomSlotPosition();
        setGameStatus(0);
        setTimeout(() => {
            setGameStatus(1);
        }, 250);
    }, []);

    const tick = () => {
        if (gameStatus !== 1) {
            // The game isn't running.
            return;
        }
        if (slotPosition === null)
            throw new Error("null slot position during tick update");

        setCurrentPosition((v) => v+1);

        if (currentPosition > Math.min(slotPosition+7, 94)) {
            handleGameOver(false);
        }
    }

    function randomSlotPosition() {
        const maxPos = 90;
        const minPos = 15;

        setSlotPosition(Math.floor(Math.random() * (maxPos - minPos) + minPos));
    }

    //
    useKeyDown(handleKeyDown, ["e", "E"], allowKeyDown);

    // Reset the game once loaded
    useEffect(() => {
        resetGame();

        // Cancel scheduled reset on re-render, if any
        return () => clearTimeout(resetTimeout.current);
    }, [resetGame]);


    // Schedule a tick interval every 50ms
    useInterval(tick, tickSpeed);

    // TODO: Make the speed configurable
    // TODO: Rewrite how the game loop works. Instead of running frames at a set interval, we can offload the animation
    //  to CSS and make less updates to the react state. This should be more efficient.

    return (
        // TODO: Add a breakpoint to shrink some elements on mobile
        <>
            <StatHandler
                streak={streak}
                setKeyDown={setAllowKeyDown}
                minigame={
                    {
                        puzzle: "RepairKit",
                        preset: 'Standard',
                    }
                }
            />
            <div className="
                h-24 w-full max-w-[800px]
                m-auto
                p-5
                flex
                relative
                rounded-lg
                gap-3
                bg-gradient-to-r from-[rgb(18_19_20)] to-[rgb(36_68_90)]
                shadow
            ">
                <div className={classNames(`
                    h-full aspect-square
                    rounded-sm
                    flex items-center justify-center
                    text-3xl text-white
                    bg-radient-circle-c
                    `, gameStatus != 2 ? `
                        from-[rgb(0_183_140)] to-[rgb(0,81,61)]
                    ` : `
                        from-[rgb(255_85_76)] to-[rgb(132_32_32/0.894)]
                    `
                )}>E</div>
                <div className="
                    h-full w-full
                    p-2
                    rounded
                    flex items-center
                    outline outline-2 outline-neutral-500/[.162]
                ">
                    {/* Moving square needs to be absolute, so we don't affect the target slot position. */}
                    {/* Because it's using absolute position, we need a wrapper div to respect parent padding */}
                    <div
                        className="relative h-full [transition:left_0.05s_linear]"
                        style={{
                            left: `${currentPosition}%`, // This is generated, so we can't use tailwind.
                        }}
                    >
                        <div
                            className={classNames(`
                                absolute
                                aspect-square h-full
                                rounded-sm
                                flex items-center justify-center
                                text-3xl text-white
                                [transition:transform_0.05s_linear,scale_0.3s_ease-in-out]
                                bg-radient-circle-c
                                z-10
                                `,
                                gameStatus !== 2 ? `
                                    from-[rgb(0_255_200)] to-[rgb(0_174_130)]
                                    shadow-[0_0_5px_0px_rgb(16_239_191)]
                                ` : `
                                    from-[rgb(255_85_76)] to-[rgb(132_32_32/0.894)]
                                    shadow-[0_0_5px_0px_rgb(255_0_0)]
                                `,
                                gameStatus === 3 ? "animate-win" : "",
                            )}
                            style={{
                                // We need to stay inside the parent element, but our spacing is based on the parent's
                                // width, so we'd need to subtract our own width. That would require extra calculation,
                                // so instead we can just apply a second translation in the opposite direction based on
                                // our own width.
                                transform: `translateX(-${currentPosition}%)`,
                            }}
                        ></div>
                    </div>
                    { slotPosition !== null &&
                        <div
                            className={classNames(
                                `
                                aspect-square h-full
                                rounded-sm
                                outline outline-[1.5px] outline-neutral-500/[.354]
                                text-3xl text-white 
                                relative
                                
                                *:absolute
                                *:w-full *:h-[3px]
                                *:bg-radient-circle-c
                                `, gameStatus != 2 ? `
                                    *:from-[rgb(0_255_200)] *:to-[rgb(0_174_130)]
                                ` : `
                                    *:from-[rgb(255_85_76)] *:to-[rgb(132_32_32/0.894)]
                                `
                            )}
                            style={{
                                left: `${slotPosition}%`,
                                transform: `translateX(-${slotPosition}%)`,
                            }}
                        >
                            {/* The styling for these children is inherited from the parent. */}
                            <div className="top-[-10px]"></div>
                            <div className="bottom-[-10px]"></div>
                        </div>
                    }
                </div>
                <div className="flex justify-center items-center">
                    <button
                        onClick={ () => {
                            resetGame();
                            setTickSpeed(tickSpeed < 10 ? 40 : tickSpeed / 2);
                            }
                        }
                        className={classNames('p-2 flex items-center justify-center rounded-full text-white transform duration-300', {
                            'bg-spring-green-300': tickSpeed === 40,
                            'bg-yellow-500': tickSpeed === 20,
                            'bg-red-500': tickSpeed === 10,
                            'bg-purple-500': tickSpeed === 5,
                            'hover:-rotate-12': true,
                            'hover:scale-110': true,
                        })}
                    >
                        <FontAwesomeIcon
                            icon={tickSpeed === 5? faFaceDizzy : tickSpeed === 10? faFaceAngry : tickSpeed === 20 ? faFaceMeh : faSmile}
                            className={classNames("text-xl size-6", {
                                'text-spring-green-700': tickSpeed === 40,
                                'text-yellow-700': tickSpeed === 20,
                                'text-red-800': tickSpeed === 10,
                                'text-purple-800': tickSpeed === 5,
                            })}
                        />
                    </button>
                </div>
            </div>
        </>
    );
}
