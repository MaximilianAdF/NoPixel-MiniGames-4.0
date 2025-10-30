"use client";

import React, { FC, useEffect, useState,} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChampagneGlasses, faUser } from "@fortawesome/free-solid-svg-icons";
import uploadHighscore from "../utils/uploadHighscore";
import NPButton from "./NPButton";
import classNames from "classnames";
import { Minigame } from "@/interfaces/minigame";
import BadWordsNext from "bad-words-next";

interface StatHandlerProps {
    streak?: number;
    elapsed?: number;
    minigame?: Minigame;
    setKeyDown?: (allowed: boolean) => void;
}

const StatHandler: FC<StatHandlerProps> = ({
    streak,
    elapsed,
    minigame,
    setKeyDown,
}) => {

    const [username, setUsername] = useState('');
    const [tempUsername, setTempUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openUserMenu, setOpenUserMenu] = useState(false);

    const [prevMinigame, setPrevMinigame] = useState<Minigame>();
    const [highscoreUpdated, setHighscoreUpdated] = useState(false);
    const [highscoreAlert, setHighscoreAlert] = useState(false);
    const [totalTime, setTotalTime] = useState(0);
    const [highscore, newHighscore] = useState(0);
    const [prevStreak, setPrevStreak] = useState(0);

    const en = require('bad-words-next/data/en.json')

    const handleUsernameChange = () => {
        const enteredUsername = ((document.getElementById('username-input') as HTMLInputElement).value).trim();
        const validUsernameRegex = /^[a-zA-Z0-9_]+$/;       // Regular expression for valid characters (alphanumeric + underscore)
        const urlRegex = /(http:\/\/|https:\/\/|www\.)/;    // Regular expression to check for URL-like patterns
        const bannedUsernames = ['admin', 'moderator', 'administrator', 'mod', 'staff', 'owner', 'dev', 'developer', 'support', 'help', 'MaximilianAdF', 'Makimi', 'Makimian'];
        const badWords = new BadWordsNext();
        badWords.add(en);

        if (enteredUsername.length < 3 || enteredUsername.length > 16) {
            setErrorMessage('Username must be between 3 and 16 characters');
        } else if (urlRegex.test(enteredUsername)) {
            setErrorMessage('Username cannot resemble a URL');
        } else if (!validUsernameRegex.test(enteredUsername)) {
            setErrorMessage('Username can only contain letters, numbers, and underscores');
        } else if (bannedUsernames.some((bannedUsername) => enteredUsername.toLowerCase().includes(bannedUsername))) {
            setErrorMessage('Username contains a banned word');
        } else if (badWords.check(enteredUsername)) {
            setErrorMessage('Username contains inappropriate language');
        } else {
            setTempUsername(enteredUsername);
            setUsername(enteredUsername);
            setOpenUserMenu(false);
            setErrorMessage('');
            if (setKeyDown) {
                setKeyDown(true);
            }
        }
    }

    const getLocalStorageKey = (minigame: Minigame) => {
        if (minigame) {
            return Object.entries(minigame as Minigame).map(([key, value]) => `${key}${value}`).join('');
        } else {
            return '';
        }
    }


    // Set the previous minigame
    useEffect(() => {
        if (minigame && minigame !== prevMinigame) {
            setPrevMinigame(minigame);
        }
    }, [minigame, prevMinigame])


    // Set the username from localStorage on the client side only
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setTempUsername(storedUsername);
            setUsername(storedUsername);
        }
    }, []);

    // useEffect to store username in localStorage whenever it changes
    useEffect(() => {
        if (username) {
            localStorage.setItem('username', username);
        } else if (username === '') {
            localStorage.removeItem('username');
        }
    }, [username]);

    //useEffect for handling fetch of current preset's stored highscore
    useEffect(() => {
        if (minigame && getLocalStorageKey(minigame) !== getLocalStorageKey(prevMinigame as Minigame)) {
            setPrevMinigame(minigame);
            
            const highscore = localStorage.getItem(`highscore${getLocalStorageKey(minigame)}`);
            if (highscore) {
                newHighscore(parseInt(highscore));
            } else {
                newHighscore(0);
            }
        }
    }, [minigame, prevMinigame]);

    //useEffect for handlixng highscore update
    useEffect(() => {
        if (streak && streak === prevStreak + 1) {
            setTotalTime(totalTime + elapsed!);
            setPrevStreak(streak);
        }

        if (streak && streak > highscore) {
            newHighscore(streak);
            setHighscoreUpdated(true);
            localStorage.setItem(`highscore${getLocalStorageKey(minigame as Minigame)}`, streak.toString());
        }

        if (streak === 0 && highscoreUpdated) {
            setHighscoreUpdated(false);
            setHighscoreAlert(true);
            setTimeout(() => {
                setHighscoreAlert(false);
            }, 3000);

            if (localStorage.getItem('username')) {
                //Highscore api call
                uploadHighscore({
                    minigame: minigame as Minigame,
                    averageTime: totalTime / highscore,
                    username: localStorage.getItem('username') as string,
                    streak: highscore,
                });
           
            }
        } else if (streak === 0 && prevStreak !== 0) {
            setPrevStreak(0);
            setTotalTime(0);
        }

    }, [streak, highscore, newHighscore, elapsed, highscoreUpdated, minigame, prevStreak, totalTime])

    return (
        <>
            {username && highscoreAlert && (         
                <div className={classNames(
                    `
                        absolute
                        gap-2.5
                        top-5
                        text-white
                        px-2 py-2
                        rounded
                        flex items-center justify-center
                        bg-[rgb(23_95_88)]
                    `,)}>
                    <FontAwesomeIcon
                        icon={faChampagneGlasses}
                    ></FontAwesomeIcon>
                    <p className="text-xl font-medium">Highscore Uploaded</p>
                </div>
            )}

            <div
                className={classNames(
                    streak !== undefined ? "absolute top-0 right-0 p-5" : "",
                    "flex h-full flex-col items-end gap-3"
                )}
            >
                <button
                    type="button"
                    className="text-spring-green-300 transition-transform duration-200 hover:scale-110 focus:outline-none"
                    onClick={() => {
                        setOpenUserMenu(true);
                        if (setKeyDown) {
                            setKeyDown(false);
                        }
                    }}
                    title="User Menu"
                    aria-label="User Menu"
                >
                    <FontAwesomeIcon icon={faUser} className="size-8" />
                </button>

                {streak !== undefined && (
                    <div className="text-right font-bold text-white leading-tight">
                        <div>Highscore: {highscore}</div>
                        <div>Streak: {streak}</div>
                    </div>
                )}
            </div>

            {/* User menu */}
            {openUserMenu && (
                <div className="fixed inset-0 z-40">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => {
                            setTempUsername(username);
                            setOpenUserMenu(false);
                            if (setKeyDown) {
                                setKeyDown(true);
                            }
                            setErrorMessage('');
                        }}
                    ></div>
                    <div className="absolute left-1/2 top-[300px] my-5 w-[640px] max-w-[90%] -translate-x-1/2 gap-5 rounded-lg bg-radient-circle-c from-[rgba(15,27,33,0.88)] to-[rgb(15_27_33)] p-4 [outline:3px_solid_rgb(84_255_164)] z-50 flex flex-col">
                        <div className="mb-5 flex h-auto items-center justify-between gap-4">
                            <div className="flex flex-col">
                                <h2 className="
                                        text-lg
                                        sm:text-2xl
                                        text-spring-green-300
                                        [text-shadow:0_0_40px_rgb(127_255_191)]
                                    ">{/*Originally, text shadow was 2.1px, but it looks much bigger on nopixel*/}
                                    User
                                </h2>
                                <p className="text-rose-400 font-bold" style={{ height: '1em' }}>{errorMessage}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setTempUsername(username);
                                    setOpenUserMenu(false);
                                    if (setKeyDown) {
                                        setKeyDown(true);
                                    }
                                }}
                            >
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
                        <div className="flex justify-center pb-12">
                            <div className="flex w-1/2 flex-row gap-4">
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="text-spring-green-300 size-14"
                                />
                                <div className="flex flex-col gap-1">
                                    <input
                                        id="username-input"
                                        className="w-full h-8 rounded-lg bg-[rgb(15_27_33)] p-2 text-white [box-shadow:0_0_2px_rgb(127_255_191)] outline-none"
                                        type="text"
                                        value={tempUsername}
                                        placeholder="Enter your username..."
                                        onChange={(e) => setTempUsername(e.target.value)}
                                    />
                                    <p className="ml-2 text-gray-500">Chracters: 3-16</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full gap-1 *:flex-1">
                            <NPButton
                                color="green"
                                onClick={() => {
                                    handleUsernameChange();
                                }}
                            >
                                Save
                            </NPButton>
                            <NPButton
                                color="red"
                                onClick={() => {
                                    setOpenUserMenu(false);
                                    if (setKeyDown) {
                                        setKeyDown(true);
                                    }
                                    setTempUsername('');
                                    setErrorMessage('');
                                    setUsername('');
                                }}
                            >
                                Remove
                            </NPButton>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default StatHandler;