let timerInterval: NodeJS.Timeout | null = null;
let secondsRemaining = 15;

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
        let isEmptyColumn = new Array(5).fill(true);

        // Identify empty columns
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (!(containerCopy[i * 5 + j] as HTMLElement).classList.contains("empty")) {
                    isEmptyColumn[j] = false;
                }
            }
        }

        // Shift columns left if an entire column is empty
        for (let col = 0; col < 5; col++) {
            if (isEmptyColumn[col]) {
                // Shift all columns to the right of it one position to the left
                for (let row = 0; row < 5; row++) {
                    for (let shiftCol = col; shiftCol < 5 - 1; shiftCol++) {
                        let currentIndex = row * 5 + shiftCol;
                        let nextIndex = row * 5 + shiftCol + 1;
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
        const row = Math.floor(idx / 5);

        for (let i = 0; i < row; i++) {
            // Swap elements in the copied array
            [containerCopy[idx - 5 * i], containerCopy[idx - 5 * (i + 1)]] = [containerCopy[idx - 5 * (i + 1)], containerCopy[idx - 5 * i]];
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

        const row = Math.floor(idx/5);
        const col = idx%5;

        if (col - 1 >= 0) adjacentCubes.push(this.container.childNodes[idx-1] as HTMLDivElement);
        if (col + 1 < 5) adjacentCubes.push(this.container.childNodes[idx+1] as HTMLDivElement);
        if (row - 1 >= 0) adjacentCubes.push(this.container.childNodes[idx-5] as HTMLDivElement);
        if (row + 1 < 5) adjacentCubes.push(this.container.childNodes[idx+5] as HTMLDivElement);
       
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
        if (divsInsideContainer.length === 25) {
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
    if (c === 25) {
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
            
        const row = Math.floor(idx / 5);
        for (let i = 0; i < row; i++) {
            [container[idx - 5 * i], container[idx - 5 * (i + 1)]] = [container[idx - 5 * (i + 1)], container[idx - 5 * i]];
        }
    });
    let isEmptyColumn = new Array(5).fill(true);

    // Identify empty columns
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (!(container[i * 5 + j] as HTMLElement).classList.contains("empty")) {
                isEmptyColumn[j] = false;
            }
        }
    }

    // Shift columns left if an entire column is empty
    for (let col = 0; col < 5; col++) {
        if (isEmptyColumn[col]) {
            // Shift all columns to the right of it one position to the left
            for (let row = 0; row < 5; row++) {
                for (let shiftCol = col; shiftCol < 5 - 1; shiftCol++) {
                    let currentIndex = row * 5 + shiftCol;
                    let nextIndex = row * 5 + shiftCol + 1;
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

    const row = Math.floor(idx/5);
    const col = idx%5;

    if (col - 1 >= 0) adjacentCubes.push(container[idx-1] as HTMLDivElement);
    if (col + 1 < 5) adjacentCubes.push(container[idx+1] as HTMLDivElement);
    if (row - 1 >= 0) adjacentCubes.push(container[idx-5] as HTMLDivElement);
    if (row + 1 < 5) adjacentCubes.push(container[idx+5] as HTMLDivElement);
   
    return adjacentCubes;      
}

function getColorCount(container): number[] {
    const colors = ["cuber", "cubeg", "cubeb"];
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
    clearInterval(timerInterval as NodeJS.Timeout);

    timerProgress.style.display = "none";
    timerProgress.style.width = "100%";
    overlay.style.display = "block";

    if (outcome === "win") {
        const winMsg = document.querySelector(".win-message") as HTMLElement;
        winMsg.style.display = "flex";
        setTimeout(function () {winMsg.style.display = 'none';}, 2000);
    } else {
        const loseMsg = document.querySelector(".lose-message") as HTMLElement;
        loseMsg.style.display = "flex";
        setTimeout(function () {loseMsg.style.display = 'none';}, 2000);
    }
    setTimeout(function () {
        timerProgress.style.display = 'flex';
        overlay.style.display = 'none';
        resetGame(); 
    }, 2000);
}

function resetGame(): void {
    clearInterval(timerInterval as NodeJS.Timeout);
    secondsRemaining = 15;
    generateCubes();
    runTimer();
}

function generateCubes(): void {
    console.log("RESET")
    do {
        const container: HTMLDivElement = document.getElementById("container") as HTMLDivElement;
        container.innerHTML = "";

        for (let i = 0; i < 25; i++) {
            const cube = new Cube();
            container?.appendChild(cube.element);
        }
    } while (!checkSolvable()); // Regenerate the cubes if the board is not solvable
}

function updateTimerDisplay() {
    const timerProgress = document.querySelector(".timer-progress-bar") as HTMLElement;
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

    const instructionsToggle = document.getElementById('instructions-toggle') as HTMLElement;
    const instructionsContent = document.getElementById('instructions-content') as HTMLElement;
    
    if (instructionsToggle) {
        instructionsToggle.addEventListener('click', function() {
            instructionsContent.classList.toggle('active');
        })
    }
});
