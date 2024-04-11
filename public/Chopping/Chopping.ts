let timerTimeout: NodeJS.Timeout;
let timerProgressBar: NodeJS.Timeout;
let totalSecondsVar = 7;
let numLetters = 15;
let gridRows = 3;
let gridCols = 6;
let isLocked = false;

let container: Letter[];
let htmlContainer: HTMLElement;

class Letter {
    state: string = "";
    value: string;
    static values: string[] = ["q", "w", "e", "r", "a", "s", "d"];

    constructor(value = "") {
        if (value === "") value = this.getRandomValue();
        this.value = value;
    }

    getElement() {
        const element = document.createElement("div");
        if (this.state) element.className = "letter" + (this.state === "done" ? " done" : " fail");
        else element.className = "letter";
        element.innerHTML = this.value.toUpperCase();
        return element;
    }

    getRandomValue() {
        const randomIndex = Math.floor(Math.random() * Letter.values.length);
        return Letter.values[randomIndex];
    }

    updateContainer() {
        // Clear the container
        let children = htmlContainer.children;
        Array.from(children).forEach(child => {
            while (child.firstChild) {
                child.removeChild(child.firstChild);
            }
        });

        // Append nodes from the modified copy
        container.forEach((letter, i) => {
            let row = Math.floor(i / gridCols);
            htmlContainer.children[row].appendChild(letter.getElement());
        });

        Array.from(children).forEach(child => {
            let element = child as HTMLElement;
            element.style.gridTemplateColumns = `repeat(${child.children.length}, min-content)`;
        });

        this.checkWin();
    }

    checkWin() {
        let activeLetter = getActiveLetter();
        return activeLetter ? false : endGame("win");
    }
}


function endGame(outcome: string): void {
    if (isLocked) return;

    const timerProgress = document.querySelector(".timer-progress-bar") as HTMLElement;

    timerProgress.style.transition = "none";
    timerProgress.style.display = "none";
    timerProgress.style.width = "100%";
    isLocked = true;

    if (outcome === "win") {
        const winMsg = document.querySelector(".win-message") as HTMLElement;
        winMsg.style.display = "flex";
        setTimeout(function () {
            winMsg.style.display = 'none';
            timerProgress.style.display = "block";
            resetGame();
        }, 2000);
    } else if (outcome === "lose") {
        const loseMsg = document.querySelector(".lose-message") as HTMLElement;
        loseMsg.style.display = "flex";
        setTimeout(function () {
            loseMsg.style.display = 'none';
            timerProgress.style.display = "block";
            resetGame();
        }, 2000);
    } else if (outcome === "reset") {
        const resetMsg = document.querySelector(".reset-message") as HTMLElement;
        resetMsg.style.display = "flex";
        setTimeout(function () {
            resetMsg.style.display = 'none';
            timerProgress.style.display = "block";
            resetGame();
        }, 1000);
    }
}

function resetGame(): void {
    const cssVariables = {
        "--grid-columns": gridCols,
        "--grid-rows": gridRows
    };

    // Set the CSS variables
    for (const [key, value] of Object.entries(cssVariables)) {
        document.documentElement.style.setProperty(key, String(value));
    }

    const timerProgress = document.querySelector(".timer-progress-bar") as HTMLElement;
    timerProgress.style.transition = `width ${totalSecondsVar}s cubic-bezier(0.4, 1, 0.7, 0.93)`;
    generateLetters();
    runTimer();

    isLocked = false;
}

function generateLetters(): void {
    console.log("generating letters...")

    // htmlContainer.innerHTML = "";
    container = [];

    for (let i = 0; i < numLetters; i++) {
        const letter = new Letter();
        container?.push(letter);

        // Last iteration only
        if (i === numLetters - 1) {
            letter.updateContainer();
        }
    }
}

function getActiveLetter(): Letter {
    return container.find(letter => letter.state !== "done") as Letter;
}


function handleKeyPress(event: KeyboardEvent) {
    if (isLocked) return; //Game is over, key presses are ignored

    if (Letter.values.includes(event.key)) {
        let activeLetter = getActiveLetter();
        if (activeLetter.value === event.key) {
            activeLetter.state = "done";
            activeLetter.updateContainer();
        } else {
            activeLetter.state = "fail";   
            activeLetter.updateContainer();
            endGame("lose");
        }
    }
}

function runTimer() {
    const timerProgress = document.querySelector(".timer-progress-bar") as HTMLElement;
    clearTimeout(timerProgressBar);  // We need to clear to prevent memory leak after multiple games are played.
    timerProgressBar = setTimeout(function () {
        timerProgress.style.width = "0%";
    }, 100);

    clearTimeout(timerTimeout); // Clear any existing timer to prevent problems with endGame("reset")
    timerTimeout = setTimeout(function () {
        endGame("lose");
    }, totalSecondsVar * 1000);
}

function toggleSettings(action: string = "") {
    const settingsMenu = document.querySelector(".settings-container") as HTMLElement;
    if (action === "close" || settingsMenu.style.display === "flex") {
        settingsMenu.style.display = "none";
    } else {
        settingsMenu.style.display = "flex";
    }
}

function applySettings() {
    // Get the values of the sliders
    const timingSliderValue = document.querySelector(".timing-container .slider-value span") as HTMLElement;
    const lettersSliderValue = document.querySelector(".letters-container .slider-value span") as HTMLElement;

    totalSecondsVar = Number(timingSliderValue.textContent);
    numLetters = Number(lettersSliderValue.textContent);

    // Run the game with the new settings
    toggleSettings("close");
    endGame("reset");
}

function resetSettings() {
    const timingSliderValue = document.querySelector(".timing-container .slider-value span") as HTMLElement;
    const lettersSliderValue = document.querySelector(".letters-container .slider-value span") as HTMLElement;

    const timingSliderInput = document.querySelector(".timing-container input[type='range']") as HTMLInputElement;
    const lettersSliderInput = document.querySelector(".letters-container input[type='range']") as HTMLInputElement;

    timingSliderInput.value = "7";
    lettersSliderInput.value = "15";

    timingSliderValue.style.left = "7%"
    lettersSliderValue.style.left = "0%"

    timingSliderValue.textContent = "7";
    lettersSliderValue.textContent = "15";
}

document.addEventListener("DOMContentLoaded", function () {
    htmlContainer = document.getElementById("container") as HTMLElement;

    resetGame();
    // Get references to the timing slider and its value display element
    const timingSliderValue = document.querySelector(".timing-container .slider-value span") as HTMLElement;
    const timingSliderInput = document.querySelector(".timing-container input[type='range']") as HTMLInputElement;

    // Get references to the letters slider and its value display element
    const lettersSliderValue = document.querySelector(".letters-container .slider-value span") as HTMLElement;
    const lettersSliderInput = document.querySelector(".letters-container input[type='range']") as HTMLInputElement;

    // Function to update the value display element when the letters slider value changes
    lettersSliderInput.addEventListener('input', () => {
        const value = lettersSliderInput.value;
        lettersSliderValue.textContent = value;
        lettersSliderValue.style.left = `${(Number(value) - 15)/0.03}%`;
    });

    // Function to update the value display element when the timing slider value changes
    timingSliderInput.addEventListener('input', () => {
        const value = timingSliderInput.value;
        timingSliderValue.textContent = value;
        timingSliderValue.style.left = `${Number(value)}%`;
    });
});

document.addEventListener("keydown", handleKeyPress);
