import { faAward, faCalendarDays, faFire, faGamepad, faGear, faHourglass, faRankingStar, faSearch, faSort, faSortDown, faSortUp, faTrophy, faUser } from "@fortawesome/free-solid-svg-icons";
import { Puzzle, Preset, getPresets, SortOrder, SortBy} from "@/interfaces/queryTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NPButton from "./NPButton";
import { useEffect, useState } from "react";


//Sort menu component
interface SortComponentProps {
    label: string;
    sortKey: SortBy;
    activeSortKey: string | null;
    sortDirection: SortOrder;
    onSort: (sortKey: SortBy) => void;
  }
  
const SortComponent: React.FC<SortComponentProps> = ({ label, sortKey, activeSortKey, sortDirection, onSort }) => {
    const isActive = activeSortKey === sortKey;
    const icon = isActive && sortDirection === 'asc' ? faSortUp : faSortDown;
    
  
    const handleSortClick = () => {
        onSort(sortKey);
    };
  
    return (
        <div onClick={handleSortClick} className="flex flex-row gap-2 justify-between px-2 cursor-pointer">
            <p>{label}</p>
            <FontAwesomeIcon 
                id={`${sortKey}-sort`} 
                className={`${icon===faSortUp ? 'translate-y-2/4' : ''} ${isActive ? 'text-spring-green-300' : ''}`} 
                icon={icon} 
            />
        </div>
    );
};

const Highscores = () => {
    const [monthly, setMonthly] = useState(true);
    const [filter, setFilter] = useState(false);
    const [sorter, setSorter] = useState(false);

    const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle>("PinCracker")
    const [selectedPresets, setSelectedPresets] = useState<Preset<Puzzle>[]>(["Standard"])
    const [hasApplied, setHasApplied] = useState<boolean>(false)

    const [activeSortKey, setActiveSortKey] = useState<SortBy>('highscore.streak');
    const [sortDirection, setSortDirection] = useState<SortOrder>('desc');

    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [highscores, setHighscores] = useState<any[]>([]);

    const handleSortBy = (sortKey: SortBy) => {
        const newSortDirection = activeSortKey === sortKey ? (sortDirection === 'asc' ? 'desc' : 'asc'): 'asc';
        setSortDirection(newSortDirection);
        setActiveSortKey(sortKey);

        // Fetch highscores with the new sort key and direction
        fetchHighscores(sortKey, newSortDirection)
            .then(highscores => {
                if (highscores) {
                    setLeaderboard(highscores);
                    setHighscores(highscores);
                }
            })
            .catch(error => {
                console.error('Error fetching highscores:', error);
            });
    };

    const handlePuzzleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPuzzle(e.target.value as Puzzle)
        setSelectedPresets([])
        setHasApplied(false)
    };

    const simplifyDate = (date: string) => {
        const dateObj = new Date(date);
        return dateObj.toLocaleString();
    };

    const getLeaderStat = (index: number) => {
        const iconAndStat = () => {
            if (activeSortKey === 'highscore.streak') {
                return { stat: leaderboard[index]?.highscore.streak, icon: faFire };
            } else if (activeSortKey === 'highscore.averageTime') {
                return { stat: leaderboard[index]?.highscore.averageTime + 'ms', icon: faHourglass };
            } else if (activeSortKey === 'date') {
                return { stat: simplifyDate(leaderboard[index]?.date), icon: faCalendarDays };
            }
            return { stat: '', icon: faFire }; // Default case
        };
    
        const { stat, icon } = iconAndStat();
    
        return (
            <div hidden className="flex flex-row justify-center gap-2 font-bold items-center">
                <FontAwesomeIcon
                icon={icon}
                className={"text-gray-500"}
                />
                <p className="text-white">{stat}</p>
            </div>
        );
    };

    const handleButtonClick = (preset: Preset<Puzzle>) => {
        // If the preset is selected, remove it from the selected presets
        if (selectedPresets?.includes(preset)) {
            setSelectedPresets(selectedPresets.filter((selectedPreset) => selectedPreset !== preset))
        }

        // If the preset is not selected, add it to the selected presets
        else {
            setSelectedPresets([...(selectedPresets || []), preset])
        }

        // Update button colors
        (document.getElementById("presetContainer")?.childNodes as NodeListOf<HTMLElement>).forEach((button) => {
            if (button.textContent === preset) {
                button.classList.toggle("opacity-50")
            }
        })
        setHasApplied(false)
    };

    const splitCamelCase = (camelCase: string) => {
        return camelCase.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    }

    async function fetchHighscores(sortKey: SortBy, sortDir: SortOrder, date?: 'monthly' | 'weekly') {
        const apiUrl = '/api/getHighscores';
        const queryParams = {
            puzzle: selectedPuzzle,
            preset: selectedPresets,
            date: date ? (date === 'monthly' ? 'monthly' : 'weekly') : monthly ? 'monthly' : 'weekly',
            sortBy: sortKey,
            sortOrder: sortDir,
        }

        const url = new URL(apiUrl, window.location.origin);
        url.search = new URLSearchParams(queryParams as any).toString();

        try {
            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error('Failed to fetch highscores');
            }

            const highscores = await response.json(); 
            return highscores;
        } catch (error) {
            console.error('Error fetching highscores:', error);
            return null;
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value.toLowerCase();
        const filteredHighscores = highscores.filter(entry => entry.highscore.username.toLowerCase().includes(searchValue));
        setLeaderboard(filteredHighscores);
    };

    useEffect(() => {
        fetchHighscores(activeSortKey, sortDirection)
            .then(highscores => {
                if (highscores) {
                    setLeaderboard(highscores);
                    setHighscores(highscores);
                }
            })
            .catch(error => {
                console.error('Error fetching highscores:', error);
            });
    }, []); // Empty dependency array means this effect runs once on mount



    return (
        <div className="w-full max-w-5xl bg-[rgb(7_19_32)] rounded-lg -mb-5 p-3">
            <div className="w-full flex justify-between items-center">
                <div className="flex gap-3 pb-3 h-14">
                    <NPButton
                        label="Monthly Highscores"
                        color="green"
                        icon={<FontAwesomeIcon icon={faTrophy} />}
                        disabled={monthly}
                        onClick={() => {
                            fetchHighscores(activeSortKey, sortDirection, 'monthly')
                                .then(highscores => {
                                    if (highscores) {
                                        setLeaderboard(highscores);
                                        setHighscores(highscores);
                                    }
                                })
                                .catch(error => {
                                    console.error('Error fetching highscores:', error);
                                });
                                
                            setMonthly(true);
                            // Fetch monthly highscores
                        }}
                    > Monthly</NPButton>
                    <NPButton
                        label="Weekly Highscores"
                        color="green"
                        icon={<FontAwesomeIcon icon={faAward} />}
                        disabled={!monthly}
                        onClick={() => {
                            fetchHighscores(activeSortKey, sortDirection, 'weekly')
                                .then(highscores => {
                                    if (highscores) {
                                        setLeaderboard(highscores);
                                        setHighscores(highscores);
                                    }
                                })
                                .catch(error => {
                                    console.error('Error fetching highscores:', error);
                                });

                            setMonthly(false);
                            // Fetch weekly highscores
                        }}
                    > Weekly</NPButton>
                </div>
                <div className="flex gap-3 pb-3 h-14 items-center">
                    <div id="searchBox" className="w-32 h-14 flex items-center flex-row">
                        <input 
                            type="text" 
                            className="w-32 h-9 bg-transparent text-white border border-gray-500 rounded-lg p-2 outline-none" 
                            placeholder="Username..." 
                            onChange={handleSearch}
                        />
                    </div>

                    <FontAwesomeIcon
                        icon={faSort}
                        className="
                            size-4/5
                            text-gray-500
                            hover:scale-110 hover:cursor-pointer
                            transition-transform
                        "
                        onClick={() => {
                            setSorter(!sorter);
                        }}
                        title={"Show Sort Order"}
                    />
                    <FontAwesomeIcon
                        icon={faGear}
                        className="
                            size-4/5
                            text-gray-500
                            hover:rotate-90 hover:scale-110 hover:cursor-pointer
                            transition-transform
                        "
                        onClick={() => {
                            document.getElementById("wrapper")?.classList.toggle("overflow-y-hidden")
                            setFilter(!filter);
                        }}
                        title={"Show Filters"}
                    />
                </div>
            </div>
            <div id="wrapper" className="relative w-full bg-[rgb(22_40_52)] rounded-lg overflow-y-auto flex justify-end" style={{ height: '445px' }}>
                {//Highscores
                //Top 3 
                <div className="absolute w-full">
                    <div className="w-full flex justify-center text-white pt-2">
                        <h1 className="text-5xl">{splitCamelCase(selectedPuzzle)}</h1>
                    </div>
                    <div className="w-full h-2/4 flex flex-row justify-between py-4 px-32 mb-4 text-white">
                        <div className="flex flex-col items-center gap-3 translate-y-1/4">
                            <FontAwesomeIcon
                                icon={faAward}
                                className="size-2/5 text-neutral-400 "
                            />
                            {leaderboard[1] &&
                            <>
                                <h1 className="text-3xl -mb-3">{leaderboard[1]?.highscore.username}</h1>
                                <div className="text-xl">{getLeaderStat(1)}</div>
                            </>
                            }
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <FontAwesomeIcon
                                icon={faTrophy}
                                className="size-1/2 text-amber-400"
                            />
                            {leaderboard[0] &&
                            <>
                                <h1 className="text-4xl -mb-3">{leaderboard[0]?.highscore.username}</h1>
                                <div className="text-2xl">{getLeaderStat(0)}</div>
                            </>
                            }
                        </div>
                        <div className="flex flex-col items-center gap-3 translate-y-1/4">
                            <FontAwesomeIcon
                                icon={faAward}
                                className="size-2/5 text-yellow-700"
                            />
                            {leaderboard[2] &&
                            <>
                                <h1 className="text-3xl -mb-3">{leaderboard[2]?.highscore.username}</h1>
                                <div className="text-xl">{getLeaderStat(2)}</div>
                            </>
                            }   
                        </div>
                    </div>
                    {/* Leaderboard */}
                    <div id="leaderboard-container" className="w-full flex flex-col justify-center gap-2 px-4">
                        <div className="w-full bg-[rgb(7_19_32)] rounded px-2 py-1 text-white">
                            <FontAwesomeIcon
                                className="w-[calc(8.333333%-2px)] border-r-2"
                                icon={faRankingStar}
                            ></FontAwesomeIcon>
                            <FontAwesomeIcon
                                className="w-[calc(16.6666%-2px)] border-r-2"
                                icon={faUser}
                            ></FontAwesomeIcon>
                            <FontAwesomeIcon
                                className="w-[calc(16.6666%-1px)] border-r"
                                icon={faGamepad}
                            ></FontAwesomeIcon>
                            <FontAwesomeIcon
                                className="w-[calc(16.6666%-1px)] border-l border-r-2"
                                icon={faHourglass}
                            ></FontAwesomeIcon>
                            <FontAwesomeIcon
                                className="w-[calc(16.6666%-2px)] border-r-2"
                                icon={faFire}
                            ></FontAwesomeIcon>
                            <FontAwesomeIcon
                                className="w-[calc(25%-2px)]"
                                icon={faCalendarDays}
                            ></FontAwesomeIcon>
                        </div>
                        {
                            leaderboard.map((entry, index) => (
                                <div key={index} className="w-full bg-[rgba(7,19,32,0.66)] rounded-lg p-2 text-white flex flex-row">
                                    <div className="font-extrabold w-1/12 px-1 flex justify-center truncate">{index+1}</div>
                                    <div className="font-extrabold w-1/6 px-1 flex justify-center truncate">{entry?.highscore.username}</div>
                                    <div className="font-extrabold w-1/6 px-1 flex justify-center truncate">{entry?.highscore.minigame.preset}</div>
                                    <div className="font-extrabold w-1/6 px-1 flex justify-center truncate">{entry?.highscore.averageTime}ms</div>
                                    <div className="font-extrabold w-1/6 px-1 flex justify-center truncate">{entry?.highscore.streak}</div>
                                    <div className="font-extrabold w-3/12 px-1 flex pl-10 truncate">{simplifyDate(entry?.date)}</div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                }
    

                {//Filters
                filter && 
                <div id="filters" 
                     className="absolute bg-inherit w-full h-[calc(100%+1rem)] -mt-1 flex flex-col"
                     style={{ top: `${document.getElementById('wrapper')?.scrollTop}px` }}
                >
                    {/* Filters Menu */}
                    {/* Puzzles */}
                    <div className="w-full h-1/4 mt-3 flex items-center flex-col gap-3">
                        <h2 className="text-lg sm:text-4xl text-white">Puzzle</h2>
                        <select id="puzzle-select" name="puzzle" value={selectedPuzzle} onChange={handlePuzzleChange} className="w-1/4 p-2 flex text-center rounded-2xl bg-transparent border text-white border-spring-green-300 [box-shadow:0_0_30px_rgb(127_255_191)]">
                            <option value="Thermite">Thermite</option>
                            <option value="RoofRunning">Roof Running</option>
                            <option value="Laundromat">Laundromat</option>
                            <option value="Lockpick">Lockpick</option>
                            <option value="RepairKit">Repair Kit</option>
                            <option value="WordMemory">Word Memory</option>
                            <option value="Chopping">Chopping</option>
                            <option value="PinCracker">Pin Cracker</option>
                        </select>
                    </div>
                    <div className="w-full h-2/4 mt-3 flex items-center flex-col gap-3">
                        <h2 className="text-lg sm:text-4xl text-white">Preset</h2>
                        <div id="presetContainer" className="flex justify-center items-center flex-row gap-3">
                            {getPresets(selectedPuzzle).map((preset) => (
                                <NPButton
                                    className={`${selectedPresets.includes(preset) ? 'opacity-50' : ''}`}
                                    key={preset}
                                    label={preset}
                                    color={"green"}
                                    onClick={() => {
                                        handleButtonClick(preset)
                                    }}
                                    >{preset}
                                </NPButton>
                                
                            ))}
                        </div>
                        <p className="text-[rgb(142_142_142)]">Adjustable Parameters Coming Soon...</p>
                    </div>
                    <div className="w-full h-1/5 flex justify-center items-center">
                        <NPButton
                            label={"Apply"}
                            color={"green"}
                            disabled={hasApplied}
                            onClick={() => {
                                // Submit the filters
                                if (selectedPresets.length === 0) {
                                    alert("No presets selected")
                                    return
                                }
        
                                // Create API request to getHighscores
                                fetchHighscores(activeSortKey, sortDirection)
                                    .then(highscores => {
                                        if (highscores) {
                                            setLeaderboard(highscores);
                                            setHighscores(highscores);
                                        }
                                    })
                                    .catch(error => {
                                        console.error('Error fetching highscores:', error);
                                    });
        
                                setHasApplied(true)
                            }}
                        >Apply</NPButton>
                    </div>
                </div>
                }


                {//Sort
                sorter &&
                <div className="fixed bg-[rgb(7_19_32)] text-gray-500 rounded-b-lg flex flex-col mr-3 gap-1.5">
                    <SortComponent
                        label="Streak"
                        sortKey="highscore.streak"
                        activeSortKey={activeSortKey}
                        sortDirection={sortDirection}
                        onSort={handleSortBy}
                    />
                    <SortComponent
                        label="Time"
                        sortKey="highscore.averageTime"
                        activeSortKey={activeSortKey}
                        sortDirection={sortDirection}
                        onSort={handleSortBy}
                    />
                    <SortComponent
                        label="Date"
                        sortKey="date"
                        activeSortKey={activeSortKey}
                        sortDirection={sortDirection}
                        onSort={handleSortBy}
                    />
                </div>
                }
            </div>
        </div>
    )
}

export default Highscores;
