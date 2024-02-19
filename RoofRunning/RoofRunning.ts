let timerTimeout: NodeJS.Timeout;
let totalSeconds = 25;
let gridCols = 11;
let gridRows = 8;

class Cube { 
    container: HTMLDivElement = document.getElementById("container") as HTMLDivElement;
    element: HTMLDivElement
    color: string

    constructor() {
        this.color = this.getRandomColorClass();
        this.element = document.createElement("div");
        this.element.className = "cube";
        this.element.classList.add(this.color);
        this.element.addEventListener("click", this.squareClick.bind(this));
    }
    
    cubeLeftShift() {
        const containerCopy = Array.from(this.container.childNodes);
        let isEmptyColumn = new Array(gridCols).fill(true);

        // Identify empty columns
        for (let i = 0; i < gridRows; i++) {
            for (let j = 0; j < gridCols; j++) {
                if (!(containerCopy[i * gridCols + j] as HTMLElement).classList.contains("empty")) {
                    isEmptyColumn[j] = false;
                }
            }
        }

        // Shift columns left if an entire column is empty
        for (let col = 0; col < gridCols; col++) {
            if (isEmptyColumn[col]) {
                // Shift all columns to the right of it one position to the left
                for (let row = 0; row < gridRows; row++) {
                    for (let shiftCol = col; shiftCol < gridCols - 1; shiftCol++) {
                        let currentIndex = row * gridCols + shiftCol;
                        let nextIndex = row * gridCols + shiftCol + 1;
                        // Swap the current and next columns
                        [containerCopy[currentIndex], containerCopy[nextIndex]] = [containerCopy[nextIndex], containerCopy[currentIndex]];
                    }
                }
                // Adjust for the shift when checking subsequent columns
                isEmptyColumn.splice(col, 1);
                isEmptyColumn.push(false); // Assume last column is now non-empty
                col--; // Re-check the current column index due to the shift
            }
        }
        this.updateContainer(containerCopy);
    }
    

    cubeGravity(idx: number) {
        const containerCopy = Array.from(this.container.childNodes);
        const row = Math.floor(idx / gridCols);

        for (let i = 0; i < row; i++) {
            // Swap elements in the copied array
            [containerCopy[idx - gridCols * i], containerCopy[idx - gridCols * (i + 1)]] = [containerCopy[idx - gridCols * (i + 1)], containerCopy[idx - gridCols * i]];
        }
        // Update the live container with the modified copy
        this.updateContainer(containerCopy);
    }
    
    updateContainer(containerCopy: Node[]) {
        // Clear the container
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        // Append nodes from the modified copy
        containerCopy.forEach(node => {
            this.container.appendChild(node);
        });
    }

    getAdjacentCubes(cube) {
        const idx = Array.from(this.container.childNodes).indexOf(cube);
        const adjacentCubes: HTMLDivElement[] = [];

        const row = Math.floor(idx / gridCols);
        const col = idx % gridCols;

        if (col - 1 >= 0) adjacentCubes.push(this.container.childNodes[idx - 1] as HTMLDivElement);
        if (col + 1 < gridCols) adjacentCubes.push(this.container.childNodes[idx + 1] as HTMLDivElement);
        if (row - 1 >= 0) adjacentCubes.push(this.container.childNodes[idx - gridCols] as HTMLDivElement);
        if (row + 1 < gridRows) adjacentCubes.push(this.container.childNodes[idx + gridCols] as HTMLDivElement);
       
        return adjacentCubes;      
    }

    removeConnectedCubes() {
        const connectedCubes = this.getConnectedCubes();

        if (connectedCubes.size === 1) {
            console.log("No connected cubes")
        } else {
            connectedCubes.forEach(cube => {        
                (cube as HTMLDivElement).classList.remove(this.color);
                (cube as HTMLDivElement).classList.add("empty"); 
                (cube as HTMLDivElement).removeEventListener("click", this.squareClick);
                this.cubeGravity(Array.from(this.container.childNodes).indexOf(cube as HTMLDivElement)); // Apply gravity to the cubes so empty cubes are at top
            });
            this.cubeLeftShift();
        }
    }

    getRandomColorClass() {
        const colors = ["cuber", "cubeg", "cubeb"];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }

    getConnectedCubes() {
        const connectedCubes = new Set();
        const queue = [this.element];

        while (queue.length > 0) {
            const currentCube = queue.shift();
            connectedCubes.add(currentCube);

            const neighbors = this.getAdjacentCubes(currentCube);
            neighbors.forEach(neighbor => {
                if (!connectedCubes.has(neighbor) && neighbor.classList.contains(this.color)) {
                    queue.push(neighbor);
                    connectedCubes.add(neighbor)
                }
            });
        }
        return connectedCubes;
    }

    checkwin() {
        const container = document.getElementById("container") as HTMLElement;
        const divsInsideContainer = container.querySelectorAll('.empty');
        if (divsInsideContainer.length === gridRows * gridCols) {
            endGame("win");
        }
        //if (!checkSolvable()) {
            //endGame("lose");
        //}
    }

    squareClick() {
        this.removeConnectedCubes();
        this.checkwin();
    }
}

//The functions below together checks solvability of the board
function helpFunct(container, queue, path = []): boolean {
    if (getColorCount(container).includes(1)) { 
        console.log("FAIL, SINGLE:", path)
        return false;
    }

    let c = 0;
    container.forEach(cube => {
        if ((cube as HTMLElement).classList.contains("empty")) {
            c++;
        }
    });
    if (c === gridRows * gridCols) {
        console.log("SOLVE:", path) // Path is one of the sequences of clicks that solves the board
        return true;
    } else if (queue.length === 0) {
        console.log("FAIL, NO QUEUE:", path)
        return false;
    }

    while (queue.length > 0) {
        let connectedCubes = queue.shift();
        const [updatedContainer, possibleClick] = cubesUpdate(container, connectedCubes); // [container, possibleClicks
        const updatedQueue = updateQueue(updatedContainer);
        const newPath = path.concat(possibleClick);

        if (helpFunct(updatedContainer, updatedQueue, newPath)) {
            return true
        }
    }
    console.log("FAIL, NO PATH:", path)
    return false;
}

function cubesUpdate(container, connectedCubes) {
    let possibleClicks: number = -1;
    connectedCubes.forEach(cube => {
        const idx = container.indexOf(cube as HTMLDivElement);
        (cube as HTMLDivElement).classList.remove((cube as HTMLDivElement).classList.item(1) as string);
        (cube as HTMLDivElement).classList.add("empty");
        possibleClicks = idx;
            
        const row = Math.floor(idx / gridCols);
        for (let i = 0; i < row; i++) {
            [container[idx - gridCols * i], container[idx - gridCols * (i + 1)]] = [container[idx - gridCols * (i + 1)], container[idx - gridCols * i]];
        }
    });
    let isEmptyColumn = new Array(gridCols).fill(true);

    // Identify empty columns
    for (let i = 0; i < gridRows; i++) {
        for (let j = 0; j < gridCols; j++) {
            if (!(container[i * gridCols + j] as HTMLElement).classList.contains("empty")) {
                isEmptyColumn[j] = false;
            }
        }
    }

    // Shift columns left if an entire column is empty
    for (let col = 0; col < gridCols; col++) {
        if (isEmptyColumn[col]) {
            // Shift all columns to the right of it one position to the left
            for (let row = 0; row < gridRows; row++) {
                for (let shiftCol = col; shiftCol < gridCols - 1; shiftCol++) {
                    let currentIndex = row * gridCols + shiftCol;
                    let nextIndex = row * gridCols + shiftCol + 1;
                    // Swap the current and next columns
                    [container[currentIndex], container[nextIndex]] = [container[nextIndex], container[currentIndex]];
                }
            }
            // Adjust for the shift when checking subsequent columns
            isEmptyColumn.splice(col, 1);
            isEmptyColumn.push(false); // Assume last column is now non-empty
            col--; // Re-check the current column index due to the shift
        }
    }
    return [container, possibleClicks];
}

function updateQueue(container): Set<unknown>[] {
    let queue: Set<unknown>[] = [];
    let visited = new Set();

    container.forEach(cube => {
        if (!(cube as HTMLElement).classList.contains("empty")) {
            const connectedCubes = getConnectedCubes(container, cube as HTMLDivElement)
            for (let i = 0; i < connectedCubes.size; i++) {
                const connectedCube = connectedCubes[i];
                if (!visited.has(connectedCube)) {
                    visited.add(connectedCube);
                    queue.push(connectedCubes);
                } else {
                    continue;
                }
            }
        }
    });
    return queue;
}

function checkSolvable(): boolean {
    const container = document.getElementById("container") as HTMLElement;
    const containerCopy = Array.from(container.childNodes).map(node => node.cloneNode(true)); //Deep copy of the container so modification of the DOM cubes does not affect the original container

    let queue = updateQueue(containerCopy);
    return helpFunct(containerCopy, queue);
}

function getConnectedCubes(container, cube) {
    const connectedCubes = new Set();
    const queue = [cube];

    while (queue.length > 0) {
        const currentCube = queue.shift();
        connectedCubes.add(currentCube);

        const neighbors = getAdjacentCubes(container, currentCube);
        neighbors.forEach(neighbor => {
            if (!connectedCubes.has(neighbor) && neighbor.classList.contains((cube as HTMLDivElement).classList.item(1) as string)) {
                connectedCubes.add(neighbor)
                queue.push(neighbor);
            }
        });
    }
    if (connectedCubes.size === 1) {
        connectedCubes.clear();
    }
    return connectedCubes;
}

function getAdjacentCubes(container, cube) {
    const idx = container.indexOf(cube);
    const adjacentCubes: HTMLDivElement[] = [];

    const row = Math.floor(idx / gridCols);
    const col = idx % gridCols;

    if (col - 1 >= 0) adjacentCubes.push(container[idx - 1] as HTMLDivElement);
    if (col + 1 < gridCols) adjacentCubes.push(container[idx + 1] as HTMLDivElement);
    if (row - 1 >= 0) adjacentCubes.push(container[idx - gridCols] as HTMLDivElement);
    if (row + 1 < gridRows) adjacentCubes.push(container[idx + gridCols] as HTMLDivElement);
   
    return adjacentCubes;      
}

function getColorCount(container): number[] {
    const colorCount = [0, 0, 0];

    container.forEach(cube => {
        if ((cube as HTMLElement).classList.contains("cuber")) {
            colorCount[0]++;
        } else if ((cube as HTMLElement).classList.contains("cubeg")) {
            colorCount[1]++;
        } else if ((cube as HTMLElement).classList.contains("cubeb")) {
            colorCount[2]++;
        }
    });
    return colorCount;
}
// ------------------------------------------------------------^


function endGame(outcome: string): void {
    const timerProgress = document.querySelector(".timer-progress-bar") as HTMLElement;
    const overlay = document.querySelector(".overlay") as HTMLElement;

    timerProgress.style.transition = "none";
    timerProgress.style.display = "none";
    timerProgress.style.width = "100%";
    overlay.style.display = "block";

    if (outcome === "win") {
        const winMsg = document.querySelector(".win-message") as HTMLElement;
        winMsg.style.display = "flex";
        setTimeout(function () {
            winMsg.style.display = 'none';
            timerProgress.style.display = "block";
            overlay.style.display = 'none';
            resetGame(); 
        }, 2000);
    } else if (outcome === "lose") {
        const loseMsg = document.querySelector(".lose-message") as HTMLElement;
        loseMsg.style.display = "flex";
        setTimeout(function () {
            loseMsg.style.display = 'none';
            timerProgress.style.display = "block";
            overlay.style.display = 'none';
            resetGame(); 
        }, 2000);
        
    } else if (outcome === "reset") {
        const resetMsg = document.querySelector(".reset-message") as HTMLElement;
        resetMsg.style.display = "flex";
        setTimeout(function () {
            resetMsg.style.display = 'none';
            timerProgress.style.display = "block";
            overlay.style.display = 'none';
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
    timerProgress.style.transition = `width ${totalSeconds}s cubic-bezier(0.4, 1, 0.7, 0.93)`;
    generateCubes();
    runTimer();
}

function generateCubes(): void {
    console.log("generating cubes...")
    do {
        const container: HTMLDivElement = document.getElementById("container") as HTMLDivElement;
        container.innerHTML = "";

        for (let i = 0; i < gridRows * gridCols; i++) {
            const cube = new Cube();
            container?.appendChild(cube.element);
        }
    } while (!checkSolvable()); // Regenerate the cubes if the board is not solvable
}


function runTimer() {
    const timerProgress = document.querySelector(".timer-progress-bar") as HTMLElement;
    setTimeout(function () {
        timerProgress.style.width = "0%";
    }, 100);

    clearTimeout(timerTimeout); // Clear any existing timer to prevent problems with endGame("reset")
    timerTimeout = setTimeout(function () {
        endGame("lose");
    }, totalSeconds * 1000);
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
    const rowsSliderValue = document.querySelector(".rows-container .slider-value span") as HTMLElement;
    const colsSliderValue = document.querySelector(".columns-container .slider-value span") as HTMLElement;

    totalSeconds = Number(timingSliderValue.textContent);
    gridRows = Number(rowsSliderValue.textContent);
    gridCols = Number(colsSliderValue.textContent);

    // Run the game with the new settings
    toggleSettings("close");
    endGame("reset");
}

function resetSettings() {
    const timingSliderValue = document.querySelector(".timing-container .slider-value span") as HTMLElement;
    const rowsSliderValue = document.querySelector(".rows-container .slider-value span") as HTMLElement;
    const colsSliderValue = document.querySelector(".columns-container .slider-value span") as HTMLElement;

    const timingSliderInput = document.querySelector(".timing-container input[type='range']") as HTMLInputElement;
    const rowsSliderInput = document.querySelector(".rows-container input[type='range']") as HTMLInputElement;
    const colsSliderInput = document.querySelector(".columns-container input[type='range']") as HTMLInputElement;
    
    timingSliderInput.value = "25";
    rowsSliderInput.value = "8";
    colsSliderInput.value = "11";

    timingSliderValue.style.left = "25%"
    rowsSliderValue.style.left = "100%"
    colsSliderValue.style.left = "60%"

    timingSliderValue.textContent = "25";
    rowsSliderValue.textContent = "8";
    colsSliderValue.textContent = "11";
    document.documentElement.style.setProperty("--temp-grid-rows", "8");
    document.documentElement.style.setProperty("--temp-grid-columns", "11");
}

document.addEventListener("DOMContentLoaded", function () {
    resetGame();
    // Get references to the timing slider and its value display element
    const timingSliderValue = document.querySelector(".timing-container .slider-value span") as HTMLElement;
    const timingSliderInput = document.querySelector(".timing-container input[type='range']") as HTMLInputElement;

    // Get references to the rows slider and its value display element
    const rowsSliderValue = document.querySelector(".rows-container .slider-value span") as HTMLElement;
    const rowsSliderInput = document.querySelector(".rows-container input[type='range']") as HTMLInputElement;

    // Get references to the columns slider and its value display element
    const colsSliderValue = document.querySelector(".columns-container .slider-value span") as HTMLElement;
    const colsSliderInput = document.querySelector(".columns-container input[type='range']") as HTMLInputElement;

    // Function to update the value display element when the rows slider value changes
    rowsSliderInput.addEventListener('input', () => {
        const value = rowsSliderInput.value;
        rowsSliderValue.textContent = value;
        rowsSliderValue.style.left = `${(Number(value) - 5)/0.03}%`;
        document.documentElement.style.setProperty("--temp-grid-rows", value);
    });

    // Function to update the value display element when the columns slider value changes
    colsSliderInput.addEventListener('input', () => {
        const value = colsSliderInput.value;
        colsSliderValue.textContent = value;
        colsSliderValue.style.left = `${(Number(value) - 5)/0.1}%`;
        document.documentElement.style.setProperty("--temp-grid-columns", value);
    });

    // Function to update the value display element when the timing slider value changes
    timingSliderInput.addEventListener('input', () => {
        const value = timingSliderInput.value;
        timingSliderValue.textContent = value;
        timingSliderValue.style.left = `${Number(value)}%`;
    });

});

