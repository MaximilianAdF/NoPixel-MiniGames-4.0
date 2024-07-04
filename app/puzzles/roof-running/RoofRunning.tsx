"use client";

import NPHackContainer from "@/app/components/NPHackContainer";
import React, {FC, useEffect, useState} from "react";
import useGame from "@/app/utils/useGame";
import classNames from "classnames";
import {getCluster, handleGravity, handleLeftShift, SquareColor, squareColors, SquareValue} from "@/app/puzzles/roof-running/utils";
import {NPSettingsRange} from "@/app/components/NPSettings";
import usePersistantState from "@/app/utils/usePersistentState";
import StatHandler from "@/app/components/StatHandler";


const getStatusMessage = (status: number | undefined) => {
    switch (status) {
        case 0:
            return "";
        case 1:
            return "";
        case 2:
            return "Failed!";
        case 3:
            return "Success!";
        case 4:
            return "Reset!";
        default:
            return `Error: Unknown game status ${status}`;
    }
}


const getRandomColor = (): SquareColor => {
    return squareColors[Math.floor(Math.random() * squareColors.length)];
}

const defaultRows = 8;
const defaultColumns = 11;
const defaultDuration = 25;


const RoofRunning: FC = () => {
    const [timer, setTimer] = usePersistantState("np-roofrunning-timer", defaultDuration);  // TODO: Get the actual speed
    const [rows, setRows] = usePersistantState("np-roofrunning-rows", defaultRows);
    const [columns, setColumns] = usePersistantState("np-roofrunning-columns", defaultColumns);
    const [board, setBoard] = useState<SquareValue[]>(new Array(rows*columns).fill("empty"));
    const [elapsed, setElapsed] = useState(0);

    const resetBoard = () => {
        const newBoard: SquareColor[] = [];
        console.log(`generating new ${rows}x${columns} board`)
        for (let i = 0; i < rows * columns; i++) {
            newBoard.push(getRandomColor());
        }
        setBoard(newBoard);
    }


    const statusUpdateHandler = (newStatus: number) => {
        switch (newStatus) {
            case 1:
                console.log('Reset game');
                resetBoard();
                break;
        }
    }

    const [gameStatus, setGameStatus, streak] = useGame(timer*1000, statusUpdateHandler);

    const resetGame = () => {
        setGameStatus(1);
    };

    const handleWin = (message: string) => {
        console.log(`Win: ${message}`);

        setGameStatus(3);
    }

    const handleLose = (message: string) => {
        console.log(`Lose: ${message}`);

        setGameStatus(2);
    }

    const checkStatus = (newBoard: SquareValue[]) => {
        if (newBoard.every(value => value === "empty")) {
            handleWin("All tiles cleared");
        }

        // Fail if:
        // 1. There is exactly one tile of any color remaining
        // 2. There are no clusters larger than 1

        // Check every color
        for (let i=0; i<squareColors.length; i++) {
            if (newBoard.filter(value => value === squareColors[i]).length === 1) {
                handleLose(`Unsolvable: 1 ${squareColors[i]} tile remaining`);
            }
            // This code should be a bit quicker since it immediately exits upon finding 0 or >1, but it doesn't seem to
            // work for some reason.

            // const first = squareColors.indexOf(squareColors[i]);
            // if (first === -1) {
            //     // No instances of this color, continue
            //     continue;
            // }
            // // Count the occurrences
            // let count = 0;
            // getCount: {
            //     for (let j=first; j<newBoard.length; j++) {
            //         if (newBoard[j] === squareColors[i]) {
            //             count++;
            //             if (count > 1) {
            //                 // There's more than one,
            //                 break getCount;
            //             }
            //         }
            //     }
            //     console.log(first);
            //     handleLose(`Unsolvable: ${count} ${squareColors[i]} tile remaining`);
            // }
        }

        // Look for a cluster larger than 1


    }

    const handleClick = (index: number) => {
        if (gameStatus !== 1) {
            return;
        }
        const cluster = getCluster(board, index, rows, columns);

        // If there is more than one tile
        if (cluster.length > 1) {
            let newBoard = [...board];
            cluster.forEach(i => {
                newBoard[i] = "empty";
            })
            newBoard = handleGravity(newBoard, rows, columns);
            newBoard = handleLeftShift(newBoard, rows, columns);
            setBoard(newBoard);
            checkStatus(newBoard);
        }
    }

    const [settingsRows, setSettingsRows] = useState(rows);
    const [settingsColumns, setSettingsColumns] = useState(columns);
    const [settingsTimer, setSettingsTimer] = useState(timer);

    useEffect(() => {
        setSettingsRows(rows);
        setSettingsColumns(columns)
        setSettingsTimer(timer);

        // I don't want to re-run the useEffect if this updates. My IDE wants me to put this in the dependencies, but
        // that isn't what I want to do. I think it should be fine if it is left out?
        if (gameStatus !== 4) {
            resetGame();
        }
    }, [rows, columns, timer]);

    const settings = {
        handleSave: () => {
            setRows(settingsRows);
            setColumns(settingsColumns);
            setTimer(settingsTimer);
            setGameStatus(4);
        },
        handleReset: () => {
            setRows(defaultRows);
            setColumns(defaultColumns);
            setTimer(defaultDuration);
            setGameStatus(4);
        },
        children: (
            <div className="flex flex-col items-center">
                <div className={"flex w-full gap-2 *:flex-1 flex-row"}>
                    <NPSettingsRange title={"Rows"} value={settingsRows} setValue={setSettingsRows} min={5} max={10}/>
                    <NPSettingsRange title={"Columns"} value={settingsColumns} setValue={setSettingsColumns} min={5}
                                     max={15}/>
                </div>
                <div
                    className="flex items-center justify-center aspect-[15/10] w-[50%] mt-6 h-auto "
                    // style={{
                    //     height: `${10 * 20}px`,
                    //     width: `${15 * 20}px`,
                    // }}
                >
                    <div
                        className="
                            [outline:2px_solid_rgb(94_93_93)]
                            bg-radient-circle-c
                            from-[rgb(22_40_52/0.651)] to-[rgb(22_40_52)]

                            *:whitespace-nowrap
                            *:absolute
                            *:text-base
                            *:text-[rgb(84_255_164)]
                            *:[text-shadow:0_0_2.1px_rgb(127_255_191)]
                        "
                        style={{
                            height: `${100/10 * settingsRows}%`,
                            width: `${100/15 * settingsColumns}%`,
                        }}
                    >
                        <div className="left-1/2 -translate-y-full -translate-x-1/2">Columns</div>
                        <div className="[writing-mode:vertical-lr] top-1/2 -translate-x-full -rotate-180">Rows</div>
                    </div>
                </div>
                <div className={"flex w-full gap-2 *:flex-1 flex-col sm:flex-row"}>
                    <NPSettingsRange title={"Timer"} value={settingsTimer} setValue={setSettingsTimer} min={5}
                                     max={100}/>
                </div>
            </div>
        ),
    };


    return (
        <>
            <StatHandler
                streak={streak}
                elapsed={elapsed}
                minigame={
                    {
                        puzzle: "RoofRunning",
                        preset: (defaultDuration === timer && defaultRows === rows && defaultColumns === columns) ? 'Standard' : 'Custom',
                        duration: timer,
                        rows: rows,
                        columns: columns,
                    }
                }
            />
            <NPHackContainer
                title="Same Game"
                description="Click on matching groups of blocks"
                buttons={[]}
                countdownDuration={timer*1000}
                resetCallback={resetGame}
                elapsedCallback={setElapsed}
                resetDelay={3000}
                status={gameStatus}
                setStatus={setGameStatus}
                statusMessage={getStatusMessage(gameStatus)}
                settings={settings}
            >
                <div className={classNames(
                    `
                        grid
                        gap-x-0.5 gap-y-1
        
                        mx-auto
        
                        *:aspect-square
                        *:bg-gradient-to-b
        
                        data-[color=red]:*:from-[#f30308]
                        data-[color=red]:*:to-[#92393b]
                        data-[color=red]:*:[box-shadow:0px_5px_0px_#5c2829]
        
                        data-[color=green]:*:from-[#8ab357]
                        data-[color=green]:*:to-[#668a3d]
                        data-[color=green]:*:[box-shadow:0px_5px_0px_#48612f]
        
                        data-[color=blue]:*:from-[#5490b2]
                        data-[color=blue]:*:to-[#3a7494]
                        data-[color=blue]:*:[box-shadow:0px_5px_0px_#345066]
        
                        *:overflow-hidden
        
                        *:*:size-full
                        *:*:opacity-50
                        *:*:overflow-visible
        
                        *:data-[color=empty]:*:hidden
                    `,
                    gameStatus === 0 || gameStatus === 4 ? "blur" : "",
                )}
                    style={{
                        // TODO: Refactor the responsive sizing so it doesn't use hardcoded values.

                        // Note: These values will need to be updated if the page styles are changed.

                        // Total height of the container element is 94px plus a 64px header and 40px padding
                        // Total width of the container is 24px plus 40px padding

                        // (height - verticalGapSum) / rows * columns + horizontalGapSum
                        // (height - {2(rows - 1)}px) / rows * columns + {2(columns - 1)}px
                        maxWidth: `calc(calc(calc(calc(calc(100vh - 208px) - ${4*(rows-1)}px) / ${rows}) * ${columns}) + ${2*(columns-1)}px)`,
                        // maxWidth: `calc(calc(calc(100vh - 208px) / ${rows}) * ${columns})`,  // height / rows * columns

                        width: `calc(100vw - 64px)`,
                    //     aspectRatio: `${columns}/${rows}`,
                        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                    }}
                >{/* TODO: Dynamic size */}
                    {board.map((color, index) => {
                        return (
                            <div
                                key={index}
                                data-color={color}
                                onClick={() => handleClick(index)}
                            >
                                <svg
                                    viewBox="0 0 100 100"
                                    style={{
                                        padding: "0.5px"
                                    }}
                                    // style={{
                                    //     border: "0.5px solid rgba(255,255,255, 0)"
                                    // }}
                                >
                                    <rect
                                        // x={1} y={1} width={99} height={99}
                                        width={100} height={100}
                                        style={{
                                            fill:"none",
                                            stroke:"white",
                                            strokeWidth: "2",
                                        }}
                                    />
                                    <path d="M5 25 V5 H25 M75 5 H95 V25 M95 75 V95 H75 M25 95 H5 V75"
                                        style={{
                                            fill:"none",
                                            stroke:"white",
                                            strokeWidth: "1.5",
                                        }}
                                    />
                                </svg>
                                {/*<div className=""></div>*/}
                            </div>
                    );
                    })}
                </div>
            </NPHackContainer>
        </>
    );
}

export default RoofRunning;
