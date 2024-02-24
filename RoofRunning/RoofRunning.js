var timerTimeout;
var timerProgressBar;
var totalSeconds = 25;
var gridCols = 11;
var gridRows = 8;
var container;
var htmlContainer;
var Cube = /** @class */ (function () {
    function Cube(color) {
        if (color === void 0) { color = ""; }
        if (color === "")
            color = this.getRandomColor();
        this.color = color;
    }
    Cube.prototype.getElement = function () {
        var element = document.createElement("div");
        var child = document.createElement("div");
        child.className = "cube";
        if (this.color !== "empty") {
            element.className = "cube" + this.color.substring(0, 1);
            element.addEventListener("click", this.squareClick.bind(this));
        }
        else {
            element.className = "empty";
            child.classList.add("empty");
        }
        element.appendChild(child);
        return element;
    };
    Cube.prototype.cubeLeftShift = function () {
        var _a;
        var isEmptyColumn = new Array(gridCols).fill(true);
        // Identify empty columns
        for (var i = 0; i < gridRows; i++) {
            for (var j = 0; j < gridCols; j++) {
                if (!(container[i * gridCols + j].color === "empty")) {
                    isEmptyColumn[j] = false;
                }
            }
        }
        // Shift columns left if an entire column is empty
        for (var col = 0; col < gridCols; col++) {
            if (isEmptyColumn[col]) {
                // Shift all columns to the right of it one position to the left
                for (var row = 0; row < gridRows; row++) {
                    for (var shiftCol = col; shiftCol < gridCols - 1; shiftCol++) {
                        var currentIndex = row * gridCols + shiftCol;
                        var nextIndex = row * gridCols + shiftCol + 1;
                        // Swap the current and next columns
                        _a = [container[nextIndex], container[currentIndex]], container[currentIndex] = _a[0], container[nextIndex] = _a[1];
                    }
                }
                // Adjust for the shift when checking subsequent columns
                isEmptyColumn.splice(col, 1);
                isEmptyColumn.push(false); // Assume last column is now non-empty
                col--; // Re-check the current column index due to the shift
            }
        }
        this.updateContainer();
    };
    Cube.prototype.cubeGravity = function (idx) {
        var _a;
        var row = Math.floor(idx / gridCols);
        for (var i = 0; i < row; i++) {
            // Swap elements in the copied array
            _a = [container[idx - gridCols * (i + 1)], container[idx - gridCols * i]], container[idx - gridCols * i] = _a[0], container[idx - gridCols * (i + 1)] = _a[1];
        }
        // Update the live container with the modified copy
        this.updateContainer();
    };
    Cube.prototype.updateContainer = function () {
        // Clear the container
        while (htmlContainer.firstChild) {
            htmlContainer.removeChild(htmlContainer.firstChild);
        }
        // Append nodes from the modified copy
        container.forEach(function (cube) {
            htmlContainer.appendChild(cube.getElement());
        });
    };
    Cube.prototype.getAdjacentCubes = function (cube) {
        var idx = Array.from(container).indexOf(cube);
        // const idx = container.indexOf(cube);
        var adjacentCubes = [];
        var row = Math.floor(idx / gridCols);
        var col = idx % gridCols;
        if (col - 1 >= 0)
            adjacentCubes.push(container[idx - 1]);
        if (col + 1 < gridCols)
            adjacentCubes.push(container[idx + 1]);
        if (row - 1 >= 0)
            adjacentCubes.push(container[idx - gridCols]);
        if (row + 1 < gridRows)
            adjacentCubes.push(container[idx + gridCols]);
        return adjacentCubes;
    };
    Cube.prototype.removeConnectedCubes = function () {
        var _this = this;
        var connectedCubes = this.getConnectedCubes();
        if (connectedCubes.size === 1) {
            console.log("No connected cubes");
        }
        else {
            connectedCubes.forEach(function (cube) {
                cube.color = "empty";
                _this.cubeGravity(container.indexOf(cube)); // Apply gravity to the cubes so empty cubes are at top
            });
            this.cubeLeftShift();
            // this.updateContainer(); // Already called in cubeLeftShift
        }
    };
    Cube.prototype.getRandomColor = function () {
        var colors = ["red", "green", "blue"];
        var randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };
    Cube.prototype.getConnectedCubes = function () {
        var _this = this;
        var connectedCubes = new Set();
        var queue = [this];
        while (queue.length > 0) {
            var currentCube = queue.shift();
            connectedCubes.add(currentCube);
            var neighbors = this.getAdjacentCubes(currentCube);
            neighbors.forEach(function (neighbor) {
                if (!connectedCubes.has(neighbor) && neighbor.color == _this.color) {
                    queue.push(neighbor);
                    connectedCubes.add(neighbor);
                }
            });
        }
        return connectedCubes;
    };
    Cube.prototype.checkwin = function () {
        var emptyCubes = container.filter(function (cube) { return cube.color === "empty"; });
        if (emptyCubes.length === gridRows * gridCols) {
            endGame("win");
        }
        else if (shouldFail()) {
            endGame("lose");
        }
    };
    Cube.prototype.squareClick = function () {
        this.removeConnectedCubes();
        this.checkwin();
    };
    return Cube;
}());
//The functions below together checks solvability of the board
function helpFunct(tempContainer, queue, path) {
    if (path === void 0) { path = []; }
    if (getColorCount(tempContainer).includes(1)) {
        console.log("FAIL, SINGLE:", path);
        return false;
    }
    var c = 0;
    tempContainer.forEach(function (cube) {
        if (cube.color === "empty") {
            c++;
        }
    });
    if (c === gridRows * gridCols) {
        console.log("SOLVE:", path); // Path is one of the sequences of clicks that solves the board
        return true;
    }
    else if (queue.length === 0) {
        console.log("FAIL, NO QUEUE:", path);
        return false;
    }
    while (queue.length > 0) {
        var connectedCubes = queue.shift();
        var _a = cubesUpdate(tempContainer, connectedCubes), updatedContainer = _a[0], possibleClick = _a[1]; // [container, possibleClicks
        var updatedQueue = updateQueue(updatedContainer);
        var newPath = path.concat(possibleClick);
        if (helpFunct(updatedContainer, updatedQueue, newPath)) {
            return true;
        }
    }
    console.log("FAIL, NO PATH:", path);
    return false;
}
function cubesUpdate(tempContainer, connectedCubes) {
    var _a;
    var possibleClicks = -1;
    connectedCubes.forEach(function (cube) {
        var _a;
        var idx = tempContainer.indexOf(cube);
        cube.color = "empty";
        possibleClicks = idx;
        var row = Math.floor(idx / gridCols);
        for (var i = 0; i < row; i++) {
            _a = [tempContainer[idx - gridCols * (i + 1)], tempContainer[idx - gridCols * i]], tempContainer[idx - gridCols * i] = _a[0], tempContainer[idx - gridCols * (i + 1)] = _a[1];
        }
    });
    var isEmptyColumn = new Array(gridCols).fill(true);
    // Identify empty columns
    for (var i = 0; i < gridRows; i++) {
        for (var j = 0; j < gridCols; j++) {
            if (!(tempContainer[i * gridCols + j].color === "empty")) {
                isEmptyColumn[j] = false;
            }
        }
    }
    // Shift columns left if an entire column is empty
    for (var col = 0; col < gridCols; col++) {
        if (isEmptyColumn[col]) {
            // Shift all columns to the right of it one position to the left
            for (var row = 0; row < gridRows; row++) {
                for (var shiftCol = col; shiftCol < gridCols - 1; shiftCol++) {
                    var currentIndex = row * gridCols + shiftCol;
                    var nextIndex = row * gridCols + shiftCol + 1;
                    // Swap the current and next columns
                    _a = [tempContainer[nextIndex], tempContainer[currentIndex]], tempContainer[currentIndex] = _a[0], tempContainer[nextIndex] = _a[1];
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
function updateQueue(tempContainer) {
    var queue = [];
    var visited = new Set();
    tempContainer.forEach(function (cube) {
        if (!(cube.color === "empty")) {
            var connectedCubes = getConnectedCubes(tempContainer, cube);
            for (var i = 0; i < connectedCubes.size; i++) {
                var connectedCube = connectedCubes[i];
                if (!visited.has(connectedCube)) {
                    visited.add(connectedCube);
                    queue.push(connectedCubes);
                }
            }
        }
    });
    return queue;
}
function checkSolvable() {
    // const container = document.getElementById("container") as HTMLElement;
    // const containerCopy = Array.from(container.childNodes).map(node => node.cloneNode(true)); //Deep copy of the container so modification of the DOM cubes does not affect the original container
    //
    // let queue = updateQueue(containerCopy);
    // return helpFunct(containerCopy, queue);
    return false;
}
function shouldFail() {
    // This method does 2 things:
    // 1. Fail if exactly one of any color is left
    // 2. Fail if there are no groups of connected colors
    //
    // In case of a failure, return true
    var containerCopy = Array.from(container).map(function (cube) { return new Cube(cube.color); });
    // No need to check if the board is empty. This method won't be called if we won.
    if (getColorCount(containerCopy).includes(1)) {
        console.log("FAIL: Single cube of a color remaining");
        return true;
    }
    // If we find a connected group, return true
    for (var i = 0; i < containerCopy.length; i++) {
        var cube = containerCopy[i];
        if (!(cube.color === "empty")) {
            var connectedCubes = getConnectedCubes(containerCopy, cube);
            if (connectedCubes.size > 1) {
                return false;
            }
        }
    }
    // If we made it here, no connected groups were found. Fail.
    console.log("FAIL: No connected groups found");
    return true;
}
function getConnectedCubes(tempContainer, cube) {
    var connectedCubes = new Set();
    var queue = [cube];
    while (queue.length > 0) {
        var currentCube = queue.shift();
        connectedCubes.add(currentCube);
        var neighbors = getAdjacentCubes(tempContainer, currentCube);
        neighbors.forEach(function (neighbor) {
            if (!connectedCubes.has(neighbor) && neighbor.color === cube.color) {
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
function getAdjacentCubes(tempContainer, cube) {
    var idx = tempContainer.indexOf(cube);
    var adjacentCubes = [];
    var row = Math.floor(idx / gridCols);
    var col = idx % gridCols;
    if (col - 1 >= 0)
        adjacentCubes.push(tempContainer[idx - 1]);
    if (col + 1 < gridCols)
        adjacentCubes.push(tempContainer[idx + 1]);
    if (row - 1 >= 0)
        adjacentCubes.push(tempContainer[idx - gridCols]);
    if (row + 1 < gridRows)
        adjacentCubes.push(tempContainer[idx + gridCols]);
    return adjacentCubes;
}
function getColorCount(tempContainer) {
    var colorCount = [0, 0, 0];
    tempContainer.forEach(function (cube) {
        if (cube.color == "red") {
            colorCount[0]++;
        }
        else if (cube.color == "green") {
            colorCount[1]++;
        }
        else if (cube.color == "blue") {
            colorCount[2]++;
        }
    });
    return colorCount;
}
// ------------------------------------------------------------^
function endGame(outcome) {
    var timerProgress = document.querySelector(".timer-progress-bar");
    var overlay = document.querySelector(".overlay");
    timerProgress.style.transition = "none";
    timerProgress.style.display = "none";
    timerProgress.style.width = "100%";
    overlay.style.display = "block";
    if (outcome === "win") {
        var winMsg_1 = document.querySelector(".win-message");
        winMsg_1.style.display = "flex";
        setTimeout(function () {
            winMsg_1.style.display = 'none';
            timerProgress.style.display = "block";
            overlay.style.display = 'none';
            resetGame();
        }, 2000);
    }
    else if (outcome === "lose") {
        var loseMsg_1 = document.querySelector(".lose-message");
        loseMsg_1.style.display = "flex";
        setTimeout(function () {
            loseMsg_1.style.display = 'none';
            timerProgress.style.display = "block";
            overlay.style.display = 'none';
            resetGame();
        }, 2000);
    }
    else if (outcome === "reset") {
        var resetMsg_1 = document.querySelector(".reset-message");
        resetMsg_1.style.display = "flex";
        setTimeout(function () {
            resetMsg_1.style.display = 'none';
            timerProgress.style.display = "block";
            overlay.style.display = 'none';
            resetGame();
        }, 1000);
    }
}
function resetGame() {
    var cssVariables = {
        "--grid-columns": gridCols,
        "--grid-rows": gridRows
    };
    // Set the CSS variables
    for (var _i = 0, _a = Object.entries(cssVariables); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        document.documentElement.style.setProperty(key, String(value));
    }
    var timerProgress = document.querySelector(".timer-progress-bar");
    timerProgress.style.transition = "width ".concat(totalSeconds, "s cubic-bezier(0.4, 1, 0.7, 0.93)");
    generateCubes();
    runTimer();
}
function generateCubes() {
    console.log("generating cubes...");
    // htmlContainer.innerHTML = "";
    container = [];
    for (var i = 0; i < gridRows * gridCols; i++) {
        var cube = new Cube();
        container === null || container === void 0 ? void 0 : container.push(cube);
        // Last iteration only
        if (i === gridRows * gridCols - 1) {
            cube.updateContainer();
        }
    }
}
function runTimer() {
    var timerProgress = document.querySelector(".timer-progress-bar");
    clearTimeout(timerProgressBar); // We need to clear to prevent memory leak after multiple games are played.
    timerProgressBar = setTimeout(function () {
        timerProgress.style.width = "0%";
    }, 100);
    clearTimeout(timerTimeout); // Clear any existing timer to prevent problems with endGame("reset")
    timerTimeout = setTimeout(function () {
        endGame("lose");
    }, totalSeconds * 1000);
}
function toggleSettings(action) {
    if (action === void 0) { action = ""; }
    var settingsMenu = document.querySelector(".settings-container");
    if (action === "close" || settingsMenu.style.display === "flex") {
        settingsMenu.style.display = "none";
    }
    else {
        settingsMenu.style.display = "flex";
    }
}
function applySettings() {
    // Get the values of the sliders
    var timingSliderValue = document.querySelector(".timing-container .slider-value span");
    var rowsSliderValue = document.querySelector(".rows-container .slider-value span");
    var colsSliderValue = document.querySelector(".columns-container .slider-value span");
    totalSeconds = Number(timingSliderValue.textContent);
    gridRows = Number(rowsSliderValue.textContent);
    gridCols = Number(colsSliderValue.textContent);
    // Run the game with the new settings
    toggleSettings("close");
    endGame("reset");
}
function resetSettings() {
    var timingSliderValue = document.querySelector(".timing-container .slider-value span");
    var rowsSliderValue = document.querySelector(".rows-container .slider-value span");
    var colsSliderValue = document.querySelector(".columns-container .slider-value span");
    var timingSliderInput = document.querySelector(".timing-container input[type='range']");
    var rowsSliderInput = document.querySelector(".rows-container input[type='range']");
    var colsSliderInput = document.querySelector(".columns-container input[type='range']");
    timingSliderInput.value = "25";
    rowsSliderInput.value = "8";
    colsSliderInput.value = "11";
    timingSliderValue.style.left = "25%";
    rowsSliderValue.style.left = "100%";
    colsSliderValue.style.left = "60%";
    timingSliderValue.textContent = "25";
    rowsSliderValue.textContent = "8";
    colsSliderValue.textContent = "11";
    document.documentElement.style.setProperty("--temp-grid-rows", "8");
    document.documentElement.style.setProperty("--temp-grid-columns", "11");
}
document.addEventListener("DOMContentLoaded", function () {
    htmlContainer = document.getElementById("container");
    resetGame();
    // Get references to the timing slider and its value display element
    var timingSliderValue = document.querySelector(".timing-container .slider-value span");
    var timingSliderInput = document.querySelector(".timing-container input[type='range']");
    // Get references to the rows slider and its value display element
    var rowsSliderValue = document.querySelector(".rows-container .slider-value span");
    var rowsSliderInput = document.querySelector(".rows-container input[type='range']");
    // Get references to the columns slider and its value display element
    var colsSliderValue = document.querySelector(".columns-container .slider-value span");
    var colsSliderInput = document.querySelector(".columns-container input[type='range']");
    // Function to update the value display element when the rows slider value changes
    rowsSliderInput.addEventListener('input', function () {
        var value = rowsSliderInput.value;
        rowsSliderValue.textContent = value;
        rowsSliderValue.style.left = "".concat((Number(value) - 5) / 0.03, "%");
        document.documentElement.style.setProperty("--temp-grid-rows", value);
    });
    // Function to update the value display element when the columns slider value changes
    colsSliderInput.addEventListener('input', function () {
        var value = colsSliderInput.value;
        colsSliderValue.textContent = value;
        colsSliderValue.style.left = "".concat((Number(value) - 5) / 0.1, "%");
        document.documentElement.style.setProperty("--temp-grid-columns", value);
    });
    // Function to update the value display element when the timing slider value changes
    timingSliderInput.addEventListener('input', function () {
        var value = timingSliderInput.value;
        timingSliderValue.textContent = value;
        timingSliderValue.style.left = "".concat(Number(value), "%");
    });
});
