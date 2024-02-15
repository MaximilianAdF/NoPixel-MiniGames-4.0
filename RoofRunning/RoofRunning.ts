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
        for (let i = 24; i >= 0; i--) {
            const currCube = containerCopy[i] as HTMLDivElement;
            const col = i % 5;
            if (currCube.classList.contains("empty") && col < 4) {
                for (let j = col; j < 4; j++) {
                    const tempCube = containerCopy[i+(j-col)];
                    containerCopy[i+(j-col)] = containerCopy[i + 1 + (j-col)];
                    containerCopy[i + 1 + (j-col)] = tempCube;
                }
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
function helpFunct(container, queue): boolean {
    if (getColorCount().includes(1)) {
        return false;
    }

    let c = 0;
    container.forEach(cube => {
        if ((cube as HTMLElement).classList.contains("empty")) {
            c++;
        }
    });
    if (c === 25) {
        return true;
    } 

    while (queue.length > 0) {
        let connectedCubes = queue.shift();
        if (helpFunct(cubesUpdate(container, connectedCubes), updateQueue(container))) {
            return true;
        }
    }
    return false;
}

function cubesUpdate(container, connectedCubes) {
    connectedCubes.forEach(cube => {
        const idx = container.indexOf(cube as HTMLDivElement);
        (cube as HTMLDivElement).classList.remove((cube as HTMLDivElement).classList.item(1) as string);
        (cube as HTMLDivElement).classList.add("empty");
            
        const row = Math.floor(idx / 5);
        for (let i = 0; i < row; i++) {
            [container[idx - 5 * i], container[idx - 5 * (i + 1)]] = [container[idx - 5 * (i + 1)], container[idx - 5 * i]];
        }
    });
    for (let i = 24; i >= 0; i--) {
        const currCube = container[i] as HTMLDivElement;
        const col = i % 5;
        if (currCube.classList.contains("empty") && col < 4) {
            for (let j = col; j < 4; j++) {
                const tempCube = container[i+(j-col)];
                container[i+(j-col)] = container[i + 1 + (j-col)];
                container[i + 1 + (j-col)] = tempCube;
            }
        }
    }
    return container;
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
                } else {
                    queue.push(connectedCubes);
                    break;
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

function getColorCount(): number[] {
    const container = document.getElementById("container") as HTMLElement;
    const colors = ["cuber", "cubeg", "cubeb"];
    const colorCount = [0, 0, 0];

    colors.forEach((color, idx) => {
        const count = container.querySelectorAll(`.${color}`).length;
        colorCount[idx] = count;
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
