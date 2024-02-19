var timerTimeout;
var timerProgressBar;
var totalSeconds = 25;
var gridCols = 11;
var gridRows = 8;
var Cube = /** @class */ (function () {
    function Cube() {
        this.container = document.getElementById("container");
        this.color = this.getRandomColorClass();
        this.element = document.createElement("div");
        this.element.className = "cube";
        this.element.classList.add(this.color);
        this.element.addEventListener("click", this.squareClick.bind(this));
    }
    Cube.prototype.cubeLeftShift = function () {
        var _a;
        var containerCopy = Array.from(this.container.childNodes);
        var isEmptyColumn = new Array(gridCols).fill(true);
        // Identify empty columns
        for (var i = 0; i < gridRows; i++) {
            for (var j = 0; j < gridCols; j++) {
                if (!containerCopy[i * gridCols + j].classList.contains("empty")) {
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
                        _a = [containerCopy[nextIndex], containerCopy[currentIndex]], containerCopy[currentIndex] = _a[0], containerCopy[nextIndex] = _a[1];
                    }
                }
                // Adjust for the shift when checking subsequent columns
                isEmptyColumn.splice(col, 1);
                isEmptyColumn.push(false); // Assume last column is now non-empty
                col--; // Re-check the current column index due to the shift
            }
        }
        this.updateContainer(containerCopy);
    };
    Cube.prototype.cubeGravity = function (idx) {
        var _a;
        var containerCopy = Array.from(this.container.childNodes);
        var row = Math.floor(idx / gridCols);
        for (var i = 0; i < row; i++) {
            // Swap elements in the copied array
            _a = [containerCopy[idx - gridCols * (i + 1)], containerCopy[idx - gridCols * i]], containerCopy[idx - gridCols * i] = _a[0], containerCopy[idx - gridCols * (i + 1)] = _a[1];
        }
        // Update the live container with the modified copy
        this.updateContainer(containerCopy);
    };
    Cube.prototype.updateContainer = function (containerCopy) {
        var _this = this;
        // Clear the container
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        // Append nodes from the modified copy
        containerCopy.forEach(function (node) {
            _this.container.appendChild(node);
        });
    };
    Cube.prototype.getAdjacentCubes = function (cube) {
        var idx = Array.from(this.container.childNodes).indexOf(cube);
        var adjacentCubes = [];
        var row = Math.floor(idx / gridCols);
        var col = idx % gridCols;
        if (col - 1 >= 0)
            adjacentCubes.push(this.container.childNodes[idx - 1]);
        if (col + 1 < gridCols)
            adjacentCubes.push(this.container.childNodes[idx + 1]);
        if (row - 1 >= 0)
            adjacentCubes.push(this.container.childNodes[idx - gridCols]);
        if (row + 1 < gridRows)
            adjacentCubes.push(this.container.childNodes[idx + gridCols]);
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
                cube.classList.remove(_this.color);
                cube.classList.add("empty");
                cube.removeEventListener("click", _this.squareClick);
                _this.cubeGravity(Array.from(_this.container.childNodes).indexOf(cube)); // Apply gravity to the cubes so empty cubes are at top
            });
            this.cubeLeftShift();
        }
    };
    Cube.prototype.getRandomColorClass = function () {
        var colors = ["cuber", "cubeg", "cubeb"];
        var randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };
    Cube.prototype.getConnectedCubes = function () {
        var _this = this;
        var connectedCubes = new Set();
        var queue = [this.element];
        while (queue.length > 0) {
            var currentCube = queue.shift();
            connectedCubes.add(currentCube);
            var neighbors = this.getAdjacentCubes(currentCube);
            neighbors.forEach(function (neighbor) {
                if (!connectedCubes.has(neighbor) && neighbor.classList.contains(_this.color)) {
                    queue.push(neighbor);
                    connectedCubes.add(neighbor);
                }
            });
        }
        return connectedCubes;
    };
    Cube.prototype.checkwin = function () {
        var container = document.getElementById("container");
        var divsInsideContainer = container.querySelectorAll('.empty');
        if (divsInsideContainer.length === gridRows * gridCols) {
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
function helpFunct(container, queue, path) {
    if (path === void 0) { path = []; }
    if (getColorCount(container).includes(1)) {
        console.log("FAIL, SINGLE:", path);
        return false;
    }
    var c = 0;
    container.forEach(function (cube) {
        if (cube.classList.contains("empty")) {
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
        var _a = cubesUpdate(container, connectedCubes), updatedContainer = _a[0], possibleClick = _a[1]; // [container, possibleClicks
        var updatedQueue = updateQueue(updatedContainer);
        var newPath = path.concat(possibleClick);
        if (helpFunct(updatedContainer, updatedQueue, newPath)) {
            return true;
        }
    }
    console.log("FAIL, NO PATH:", path);
    return false;
}
function cubesUpdate(container, connectedCubes) {
    var _a;
    var possibleClicks = -1;
    connectedCubes.forEach(function (cube) {
        var _a;
        var idx = container.indexOf(cube);
        cube.classList.remove(cube.classList.item(1));
        cube.classList.add("empty");
        possibleClicks = idx;
        var row = Math.floor(idx / gridCols);
        for (var i = 0; i < row; i++) {
            _a = [container[idx - gridCols * (i + 1)], container[idx - gridCols * i]], container[idx - gridCols * i] = _a[0], container[idx - gridCols * (i + 1)] = _a[1];
        }
    });
    var isEmptyColumn = new Array(gridCols).fill(true);
    // Identify empty columns
    for (var i = 0; i < gridRows; i++) {
        for (var j = 0; j < gridCols; j++) {
            if (!container[i * gridCols + j].classList.contains("empty")) {
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
    return [container, possibleClicks];
}
function updateQueue(container) {
    var queue = [];
    var visited = new Set();
    container.forEach(function (cube) {
        if (!cube.classList.contains("empty")) {
            var connectedCubes = getConnectedCubes(container, cube);
            for (var i = 0; i < connectedCubes.size; i++) {
                var connectedCube = connectedCubes[i];
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
    var container = document.getElementById("container");
    var containerCopy = Array.from(container.childNodes).map(function (node) { return node.cloneNode(true); }); //Deep copy of the container so modification of the DOM cubes does not affect the original container
    var queue = updateQueue(containerCopy);
    return helpFunct(containerCopy, queue);
}
function shouldFail() {
    // This method does 2 things:
    // 1. Fail if exactly one of any color is left
    // 2. Fail if there are no groups of connected colors
    //
    // In case of a failure, return true
    var container = document.getElementById("container");
    var containerCopy = Array.from(container.childNodes).map(function (node) { return node.cloneNode(true); }); //Deep copy of the container so modification of the DOM cubes does not affect the original container
    // No need to check if the board is empty. This method won't be called if we won.
    if (getColorCount(containerCopy).includes(1)) {
        console.log("FAIL: Single cube of a color remaining");
        return true;
    }
    // If we find a connected group, return true
    for (var i = 0; i < containerCopy.length; i++) {
        var cube = containerCopy[i];
        if (!cube.classList.contains("empty")) {
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
function getConnectedCubes(container, cube) {
    var connectedCubes = new Set();
    var queue = [cube];
    while (queue.length > 0) {
        var currentCube = queue.shift();
        connectedCubes.add(currentCube);
        var neighbors = getAdjacentCubes(container, currentCube);
        neighbors.forEach(function (neighbor) {
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
    var idx = container.indexOf(cube);
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
}
function getColorCount(container) {
    var colorCount = [0, 0, 0];
    container.forEach(function (cube) {
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
    var container = document.getElementById("container");
    container.innerHTML = "";
    for (var i = 0; i < gridRows * gridCols; i++) {
        var cube = new Cube();
        container === null || container === void 0 ? void 0 : container.appendChild(cube.element);
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
