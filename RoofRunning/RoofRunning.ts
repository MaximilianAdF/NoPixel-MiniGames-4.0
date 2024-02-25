let timerTimeout: NodeJS.Timeout;
let timerProgressBar: NodeJS.Timeout;
let totalSecondsVar = 25;
let gridCols = 11;
let gridRows = 8;

let container: Cube[];
let htmlContainer: HTMLElement;

class Cube {
    color: string

    constructor(color = "") {
        if (color === "")
            color = this.getRandomColor();
        this.color = color;
    }

    getElement() {
        const element = document.createElement("div");
        const child = document.createElement("div");

        child.className = "cube";
        if (this.color !== "empty") {
            element.className = "cube" + this.color.substring(0,1);
            element.addEventListener("click", this.squareClick.bind(this));
        } else {
            element.className = "empty";
            child.classList.add("empty");
        }
        element.appendChild(child)
        return element;
    }
    
    cubeLeftShift() {
        let isEmptyColumn = new Array(gridCols).fill(true);

        // Identify empty columns
        for (let i = 0; i < gridRows; i++) {
            for (let j = 0; j < gridCols; j++) {
                if (!(container[i * gridCols + j].color === "empty")) {
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
        this.updateContainer();
    }
    

    cubeGravity(idx: number) {
        const row = Math.floor(idx / gridCols);

        for (let i = 0; i < row; i++) {
            // Swap elements in the copied array
            [container[idx - gridCols * i], container[idx - gridCols * (i + 1)]] = [container[idx - gridCols * (i + 1)], container[idx - gridCols * i]];
        }
        // Update the live container with the modified copy
        this.updateContainer();
    }
    
    updateContainer() {
        // Clear the container
        while (htmlContainer.firstChild) {
            htmlContainer.removeChild(htmlContainer.firstChild);
        }
        // Append nodes from the modified copy
        container.forEach(cube => {
            htmlContainer.appendChild(cube.getElement());
        });
    }

    getAdjacentCubes(cube: Cube) {
        const idx = Array.from(container).indexOf(cube);
        // const idx = container.indexOf(cube);
        const adjacentCubes: Cube[] = [];

        const row = Math.floor(idx / gridCols);
        const col = idx % gridCols;

        if (col - 1 >= 0) adjacentCubes.push(container[idx - 1]);
        if (col + 1 < gridCols) adjacentCubes.push(container[idx + 1]);
        if (row - 1 >= 0) adjacentCubes.push(container[idx - gridCols]);
        if (row + 1 < gridRows) adjacentCubes.push(container[idx + gridCols]);
       
        return adjacentCubes;      
    }

    removeConnectedCubes() {
        const connectedCubes = this.getConnectedCubes();

        if (connectedCubes.size === 1) {
            console.log("No connected cubes")
        } else {
            connectedCubes.forEach(cube => {
                (cube as Cube).color = "empty";
                this.cubeGravity(container.indexOf(cube as Cube)); // Apply gravity to the cubes so empty cubes are at top
            });
            this.cubeLeftShift();
            // this.updateContainer(); // Already called in cubeLeftShift
        }
    }

    getRandomColor() {
        const colors = ["red", "green", "blue"];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }

    getConnectedCubes() {
        const connectedCubes = new Set();
        const queue: Cube[] = [this as Cube];

        while (queue.length > 0) {
            const currentCube = queue.shift();
            connectedCubes.add(currentCube);

            const neighbors = this.getAdjacentCubes(currentCube as Cube);
            neighbors.forEach(neighbor => {
                if (!connectedCubes.has(neighbor) && neighbor.color == this.color) {
                    queue.push(neighbor);
                    connectedCubes.add(neighbor)
                }
            });
        }
        return connectedCubes;
    }

    checkwin() {
        const emptyCubes = container.filter((cube) => cube.color === "empty");
        if (emptyCubes.length === gridRows * gridCols) {
            endGame("win");
        } else if (shouldFail()) {
            endGame("lose");
        }
    }

    squareClick() {
        this.removeConnectedCubes();
        this.checkwin();
    }
}

//The functions below together checks solvability of the board
function helpFunct(tempContainer: Cube[], queue: Set<Cube>[], path: number[] = []): boolean {
    if (getColorCount(tempContainer).includes(1)) {
        console.log("FAIL, SINGLE:", path)
        return false;
    }

    let c = 0;
    tempContainer.forEach((cube: Cube) => {
        if (cube.color === "empty") {
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
        const [updatedContainer, possibleClick] = cubesUpdate(tempContainer, connectedCubes as Set<Cube>); // [container, possibleClicks
        const updatedQueue = updateQueue(updatedContainer);
        const newPath = path.concat(possibleClick);

        if (helpFunct(updatedContainer, updatedQueue, newPath)) {
            return true
        }
    }
    console.log("FAIL, NO PATH:", path)
    return false;
}

function cubesUpdate(tempContainer: Cube[], connectedCubes: Set<Cube>): [Cube[], number] {
    let possibleClicks: number = -1;
    connectedCubes.forEach(cube => {
        const idx = tempContainer.indexOf(cube);
        cube.color = "empty";
        possibleClicks = idx;

        const row = Math.floor(idx / gridCols);
        for (let i = 0; i < row; i++) {
            [tempContainer[idx - gridCols * i], tempContainer[idx - gridCols * (i + 1)]] = [tempContainer[idx - gridCols * (i + 1)], tempContainer[idx - gridCols * i]];
        }
    });
    let isEmptyColumn = new Array(gridCols).fill(true);

    // Identify empty columns
    for (let i = 0; i < gridRows; i++) {
        for (let j = 0; j < gridCols; j++) {
            if (!(tempContainer[i * gridCols + j].color === "empty")) {
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
                    [tempContainer[currentIndex], tempContainer[nextIndex]] = [tempContainer[nextIndex], tempContainer[currentIndex]];
                }
            }
            // Adjust for the shift when checking subsequent columns
            isEmptyColumn.splice(col, 1);
            isEmptyColumn.push(false); // Assume last column is now non-empty
            col--; // Re-check the current column index due to the shift
        }
    }
    return [tempContainer, possibleClicks];
}

function updateQueue(tempContainer: Cube[]): Set<Cube>[] {
    let queue: Set<Cube>[] = [];
    let visited = new Set();

    tempContainer.forEach(cube => {
        if (!(cube.color === "empty")) {
            const connectedCubes = getConnectedCubes(tempContainer, cube)
            for (let i = 0; i < connectedCubes.size; i++) {
                const connectedCube = connectedCubes[i];
                if (!visited.has(connectedCube)) {
                    visited.add(connectedCube);
                    queue.push(connectedCubes);
                }
            }
        }
    });
    return queue;
}

function checkSolvable(): boolean {
    // const container = document.getElementById("container") as HTMLElement;
    // const containerCopy = Array.from(container.childNodes).map(node => node.cloneNode(true)); //Deep copy of the container so modification of the DOM cubes does not affect the original container
    //
    // let queue = updateQueue(containerCopy);
    // return helpFunct(containerCopy, queue);
    return false;
}

function shouldFail(): boolean {
    // This method does 2 things:
    // 1. Fail if exactly one of any color is left
    // 2. Fail if there are no groups of connected colors
    //
    // In case of a failure, return true

    const containerCopy = Array.from(container).map(cube => new Cube(cube.color));

    // No need to check if the board is empty. This method won't be called if we won.

    if (getColorCount(containerCopy).includes(1)) {
        console.log("FAIL: Single cube of a color remaining")
        return true;
    }
    // If we find a connected group, return true
    for (let i = 0; i < containerCopy.length; i++) {
        const cube = containerCopy[i];
        if (!(cube.color === "empty")) {
            const connectedCubes = getConnectedCubes(containerCopy, cube);
            if (connectedCubes.size > 1) {
                return false;
            }
        }
    }
    // If we made it here, no connected groups were found. Fail.
    console.log("FAIL: No connected groups found")
    return true;
}

function getConnectedCubes(tempContainer: Cube[], cube: Cube): Set<Cube> {
    const connectedCubes: Set<Cube> = new Set();
    const queue = [cube];

    while (queue.length > 0) {
        const currentCube = queue.shift();
        connectedCubes.add(currentCube as Cube);

        const neighbors = getAdjacentCubes(tempContainer, currentCube as Cube);
        neighbors.forEach(neighbor => {
            if (!connectedCubes.has(neighbor) && neighbor.color === cube.color) {
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

function getAdjacentCubes(tempContainer: Cube[], cube: Cube) {
    const idx = tempContainer.indexOf(cube);
    const adjacentCubes: Cube[] = [];

    const row = Math.floor(idx / gridCols);
    const col = idx % gridCols;

    if (col - 1 >= 0) adjacentCubes.push(tempContainer[idx - 1]);
    if (col + 1 < gridCols) adjacentCubes.push(tempContainer[idx + 1]);
    if (row - 1 >= 0) adjacentCubes.push(tempContainer[idx - gridCols]);
    if (row + 1 < gridRows) adjacentCubes.push(tempContainer[idx + gridCols]);
   
    return adjacentCubes;      
}

function getColorCount(tempContainer: Cube[]): number[] {
    const colorCount = [0, 0, 0];

    tempContainer.forEach((cube: Cube) => {
        if (cube.color == "red") {
            colorCount[0]++;
        } else if (cube.color == "green") {
            colorCount[1]++;
        } else if (cube.color == "blue") {
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
            resetGameFunc();
        }, 2000);
    } else if (outcome === "lose") {
        const loseMsg = document.querySelector(".lose-message") as HTMLElement;
        loseMsg.style.display = "flex";
        setTimeout(function () {
            loseMsg.style.display = 'none';
            timerProgress.style.display = "block";
            overlay.style.display = 'none';
            resetGameFunc();
        }, 2000);

    } else if (outcome === "reset") {
        const resetMsg = document.querySelector(".reset-message") as HTMLElement;
        resetMsg.style.display = "flex";
        setTimeout(function () {
            resetMsg.style.display = 'none';
            timerProgress.style.display = "block";
            overlay.style.display = 'none';
            resetGameFunc();
        }, 1000);
    }
}

function resetGameFunc(): void {
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
    generateCubes();
    runTimerFunc();
}

function generateCubes(): void {
    console.log("generating cubes...")

    // htmlContainer.innerHTML = "";
    container = [];

    for (let i = 0; i < gridRows * gridCols; i++) {
        const cube = new Cube();
        container?.push(cube);

        // Last iteration only
        if (i === gridRows * gridCols - 1) {
            cube.updateContainer();
        }
    }

}


function runTimerFunc() {
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
    const rowsSliderValue = document.querySelector(".rows-container .slider-value span") as HTMLElement;
    const colsSliderValue = document.querySelector(".columns-container .slider-value span") as HTMLElement;

    totalSecondsVar = Number(timingSliderValue.textContent);
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
    htmlContainer = document.getElementById("container") as HTMLElement;

    resetGameFunc();
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

