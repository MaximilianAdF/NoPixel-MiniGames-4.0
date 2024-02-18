let timerInterval = null;
let secondsRemaining = 15;
// Define the board width and height
const boardWidth = 11;
const boardHeight = 8;
// Set the CSS variables for the board width and height
const style = document.createElement('style');
style.textContent = `:root {
    --boardWidth: ${boardWidth};
    --boardHeight: ${boardHeight};
}`;
document.head.append(style);
class Cube {
    constructor() {
        this.container = document.getElementById("container");
        this.color = this.getRandomColorClass();
        this.element = document.createElement("div");
        this.element.className = "cube";
        this.element.classList.add(this.color);
        this.element.addEventListener("click", this.squareClick.bind(this));
    }
    cubeLeftShift() {
        const containerCopy = Array.from(this.container.childNodes);
        let isEmptyColumn = new Array(boardWidth).fill(true);
        // Identify empty columns
        for (let i = 0; i < boardHeight; i++) {
            for (let j = 0; j < boardWidth; j++) {
                if (!containerCopy[i * boardWidth + j].classList.contains("empty")) {
                    isEmptyColumn[j] = false;
                }
            }
        }
        // Shift columns left if an entire column is empty
        for (let col = 0; col < boardWidth; col++) {
            if (isEmptyColumn[col]) {
                // Shift all columns to the right of it one position to the left
                for (let row = 0; row < boardHeight; row++) {
                    for (let shiftCol = col; shiftCol < boardWidth - 1; shiftCol++) {
                        let currentIndex = row * boardWidth + shiftCol;
                        let nextIndex = row * boardWidth + shiftCol + 1;
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
    cubeGravity(idx) {
        const containerCopy = Array.from(this.container.childNodes);
        const row = Math.floor(idx / boardWidth);
        for (let i = 0; i < row; i++) {
            // Swap elements in the copied array
            [containerCopy[idx - boardWidth * i], containerCopy[idx - boardWidth * (i + 1)]] = [containerCopy[idx - boardWidth * (i + 1)], containerCopy[idx - boardWidth * i]];
        }
        // Update the live container with the modified copy
        this.updateContainer(containerCopy);
    }
    updateContainer(containerCopy) {
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
        const adjacentCubes = [];
        const row = Math.floor(idx / boardWidth);
        const col = idx % boardWidth;
        if (col - 1 >= 0)
            adjacentCubes.push(this.container.childNodes[idx - 1]);
        if (col + 1 < boardWidth)
            adjacentCubes.push(this.container.childNodes[idx + 1]);
        if (row - 1 >= 0)
            adjacentCubes.push(this.container.childNodes[idx - boardWidth]);
        if (row + 1 < boardHeight)
            adjacentCubes.push(this.container.childNodes[idx + boardWidth]);
        return adjacentCubes;
    }
    removeConnectedCubes() {
        const connectedCubes = this.getConnectedCubes();
        if (connectedCubes.size === 1) {
            console.log("No connected cubes");
        }
        else {
            connectedCubes.forEach(cube => {
                cube.classList.remove(this.color);
                cube.classList.add("empty");
                cube.removeEventListener("click", this.squareClick);
                this.cubeGravity(Array.from(this.container.childNodes).indexOf(cube)); // Apply gravity to the cubes so empty cubes are at top
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
                    connectedCubes.add(neighbor);
                }
            });
        }
        return connectedCubes;
    }
    checkwin() {
        const container = document.getElementById("container");
        const divsInsideContainer = container.querySelectorAll('.empty');
        if (divsInsideContainer.length === boardWidth * boardHeight) {
            endGame("win");
        }
        if (!checkSolvable()) {
            endGame("lose");
        }
    }
    squareClick() {
        this.removeConnectedCubes();
        this.checkwin();
    }
}
//The functions below together checks solvability of the board
function helpFunct(container, queue, path = []) {
    if (getColorCount(container).includes(1)) {
        console.log("FAIL, SINGLE:", path);
        return false;
    }
    let c = 0;
    container.forEach(cube => {
        if (cube.classList.contains("empty")) {
            c++;
        }
    });
    if (c === boardWidth * boardHeight) {
        console.log("SOLVE:", path); // Path is one of the sequences of clicks that solves the board
        return true;
    }
    else if (queue.length === 0) {
        console.log("FAIL, NO QUEUE:", path);
        return false;
    }
    while (queue.length > 0) {
        let connectedCubes = queue.shift();
        const [updatedContainer, possibleClick] = cubesUpdate(container, connectedCubes); // [container, possibleClicks
        const updatedQueue = updateQueue(updatedContainer);
        const newPath = path.concat(possibleClick);
        if (helpFunct(updatedContainer, updatedQueue, newPath)) {
            return true;
        }
    }
    console.log("FAIL, NO PATH:", path);
    return false;
}
function cubesUpdate(container, connectedCubes) {
    let possibleClicks = -1;
    connectedCubes.forEach(cube => {
        const idx = container.indexOf(cube);
        cube.classList.remove(cube.classList.item(1));
        cube.classList.add("empty");
        possibleClicks = idx;
        const row = Math.floor(idx / boardWidth);
        for (let i = 0; i < row; i++) {
            [container[idx - boardWidth * i], container[idx - boardWidth * (i + 1)]] = [container[idx - boardWidth * (i + 1)], container[idx - boardWidth * i]];
        }
    });
    let isEmptyColumn = new Array(boardWidth).fill(true);
    // Identify empty columns
    for (let i = 0; i < boardHeight; i++) {
        for (let j = 0; j < boardWidth; j++) {
            if (!container[i * boardWidth + j].classList.contains("empty")) {
                isEmptyColumn[j] = false;
            }
        }
    }
    // Shift columns left if an entire column is empty
    for (let col = 0; col < boardWidth; col++) {
        if (isEmptyColumn[col]) {
            // Shift all columns to the right of it one position to the left
            for (let row = 0; row < boardHeight; row++) {
                for (let shiftCol = col; shiftCol < boardWidth - 1; shiftCol++) {
                    let currentIndex = row * boardWidth + shiftCol;
                    let nextIndex = row * boardWidth + shiftCol + 1;
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
function updateQueue(container) {
    let queue = [];
    let visited = new Set();
    container.forEach(cube => {
        if (!cube.classList.contains("empty")) {
            const connectedCubes = getConnectedCubes(container, cube);
            for (let i = 0; i < connectedCubes.size; i++) {
                const connectedCube = connectedCubes[i];
                if (!visited.has(connectedCube)) {
                    visited.add(connectedCube);
                    queue.push(connectedCubes);
                }
                else {
                    continue;
                }
            }
        }
    });
    return queue;
}
function checkSolvable() {
    const container = document.getElementById("container");
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
            if (!connectedCubes.has(neighbor) && neighbor.classList.contains(cube.classList.item(1))) {
                connectedCubes.add(neighbor);
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
    const adjacentCubes = [];
    const row = Math.floor(idx / boardWidth);
    const col = idx % boardWidth;
    if (col - 1 >= 0)
        adjacentCubes.push(container[idx - 1]);
    if (col + 1 < boardWidth)
        adjacentCubes.push(container[idx + 1]);
    if (row - 1 >= 0)
        adjacentCubes.push(container[idx - boardWidth]);
    if (row + 1 < boardHeight)
        adjacentCubes.push(container[idx + boardWidth]);
    return adjacentCubes;
}
function getColorCount(container) {
    const colors = ["cuber", "cubeg", "cubeb"];
    const colorCount = [0, 0, 0];
    container.forEach(cube => {
        if (cube.classList.contains("cuber")) {
            colorCount[0]++;
        }
        else if (cube.classList.contains("cubeg")) {
            colorCount[1]++;
        }
        else if (cube.classList.contains("cubeb")) {
            colorCount[2]++;
        }
    });
    return colorCount;
}
// ------------------------------------------------------------^
function endGame(outcome) {
    const timerProgress = document.querySelector(".timer-progress-bar");
    const overlay = document.querySelector(".overlay");
    clearInterval(timerInterval);
    timerProgress.style.display = "none";
    timerProgress.style.width = "100%";
    overlay.style.display = "block";
    if (outcome === "win") {
        const winMsg = document.querySelector(".win-message");
        winMsg.style.display = "flex";
        setTimeout(function () { winMsg.style.display = 'none'; }, 2000);
    }
    else {
        const loseMsg = document.querySelector(".lose-message");
        loseMsg.style.display = "flex";
        setTimeout(function () { loseMsg.style.display = 'none'; }, 2000);
    }
    setTimeout(function () {
        timerProgress.style.display = 'flex';
        overlay.style.display = 'none';
        resetGame();
    }, 2000);
}
function resetGame() {
    clearInterval(timerInterval);
    secondsRemaining = 15;
    generateCubes();
    runTimer();
}
function generateCubes() {
    console.log("RESET");
    do {
        const container = document.getElementById("container");
        container.innerHTML = "";
        for (let i = 0; i < boardWidth * boardHeight; i++) {
            const cube = new Cube();
            container === null || container === void 0 ? void 0 : container.appendChild(cube.element);
        }
    } while (!checkSolvable()); // Regenerate the cubes if the board is not solvable
}
function updateTimerDisplay() {
    const timerProgress = document.querySelector(".timer-progress-bar");
    let percentageLeft = Math.floor(100 * secondsRemaining / 15);
    if (timerProgress) {
        timerProgress.style.width = `${percentageLeft}%`;
    }
}
function runTimer() {
    timerInterval = setInterval(function () {
        secondsRemaining--;
        updateTimerDisplay();
        if (secondsRemaining < 0) {
            endGame("lose");
        }
    }, 1000);
}
document.addEventListener("DOMContentLoaded", function () {
    resetGame();
    const instructionsToggle = document.getElementById('instructions-toggle');
    const instructionsContent = document.getElementById('instructions-content');
    if (instructionsToggle) {
        instructionsToggle.addEventListener('click', function () {
            instructionsContent.classList.toggle('active');
        });
    }
});
