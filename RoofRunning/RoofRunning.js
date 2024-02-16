var timerInterval = null;
var secondsRemaining = 15;
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
        var containerCopy = Array.from(this.container.childNodes);
        for (var i = 24; i >= 0; i--) {
            var currCube = containerCopy[i];
            var col = i % 5;
            if (currCube.classList.contains("empty") && col < 4) {
                for (var j = col; j < 4; j++) {
                    var tempCube = containerCopy[i + (j - col)];
                    containerCopy[i + (j - col)] = containerCopy[i + 1 + (j - col)];
                    containerCopy[i + 1 + (j - col)] = tempCube;
                }
            }
        }
        this.updateContainer(containerCopy);
    };
    Cube.prototype.cubeGravity = function (idx) {
        var _a;
        var containerCopy = Array.from(this.container.childNodes);
        var row = Math.floor(idx / 5);
        for (var i = 0; i < row; i++) {
            // Swap elements in the copied array
            _a = [containerCopy[idx - 5 * (i + 1)], containerCopy[idx - 5 * i]], containerCopy[idx - 5 * i] = _a[0], containerCopy[idx - 5 * (i + 1)] = _a[1];
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
        var row = Math.floor(idx / 5);
        var col = idx % 5;
        if (col - 1 >= 0)
            adjacentCubes.push(this.container.childNodes[idx - 1]);
        if (col + 1 < 5)
            adjacentCubes.push(this.container.childNodes[idx + 1]);
        if (row - 1 >= 0)
            adjacentCubes.push(this.container.childNodes[idx - 5]);
        if (row + 1 < 5)
            adjacentCubes.push(this.container.childNodes[idx + 5]);
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
        if (divsInsideContainer.length === 25) {
            endGame("win");
        }
        if (!checkSolvable()) {
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
function helpFunct(container, queue) {
    if (getColorCount(container).includes(1)) {
        return false;
    }
    if (queue.length === 0) {
        return true;
    }
    var c = 0;
    container.forEach(function (cube) {
        if (cube.classList.contains("empty")) {
            c++;
        }
    });
    if (c === 25) {
        return true;
    }
    var result = false;
    while (queue.length > 0) {
        var connectedCubes = queue.shift();
        result = (helpFunct(cubesUpdate(container, connectedCubes), updateQueue(container)));
    }
    return result;
}
function cubesUpdate(container, connectedCubes) {
    connectedCubes.forEach(function (cube) {
        var _a;
        var idx = container.indexOf(cube);
        cube.classList.remove(cube.classList.item(1));
        cube.classList.add("empty");
        var row = Math.floor(idx / 5);
        for (var i = 0; i < row; i++) {
            _a = [container[idx - 5 * (i + 1)], container[idx - 5 * i]], container[idx - 5 * i] = _a[0], container[idx - 5 * (i + 1)] = _a[1];
        }
    });
    for (var i = 24; i >= 0; i--) {
        var currCube = container[i];
        var col = i % 5;
        if (currCube.classList.contains("empty") && col < 4) {
            //Check if col is clear to left shift:
            for (var j = col; j < 4; j++) {
                var tempCube = container[i + (j - col)];
                container[i + (j - col)] = container[i + 1 + (j - col)];
                container[i + 1 + (j - col)] = tempCube;
            }
        }
    }
    return container;
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
    var row = Math.floor(idx / 5);
    var col = idx % 5;
    if (col - 1 >= 0)
        adjacentCubes.push(container[idx - 1]);
    if (col + 1 < 5)
        adjacentCubes.push(container[idx + 1]);
    if (row - 1 >= 0)
        adjacentCubes.push(container[idx - 5]);
    if (row + 1 < 5)
        adjacentCubes.push(container[idx + 5]);
    return adjacentCubes;
}
function getColorCount(container) {
    var colors = ["cuber", "cubeg", "cubeb"];
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
    clearInterval(timerInterval);
    timerProgress.style.display = "none";
    timerProgress.style.width = "100%";
    overlay.style.display = "block";
    if (outcome === "win") {
        var winMsg_1 = document.querySelector(".win-message");
        winMsg_1.style.display = "flex";
        setTimeout(function () { winMsg_1.style.display = 'none'; }, 2000);
    }
    else {
        var loseMsg_1 = document.querySelector(".lose-message");
        loseMsg_1.style.display = "flex";
        setTimeout(function () { loseMsg_1.style.display = 'none'; }, 2000);
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
    do {
        var container = document.getElementById("container");
        container.innerHTML = "";
        for (var i = 0; i < 25; i++) {
            var cube = new Cube();
            container === null || container === void 0 ? void 0 : container.appendChild(cube.element);
        }
    } while (!checkSolvable()); // Regenerate the cubes if the board is not solvable
}
function updateTimerDisplay() {
    var timerProgress = document.querySelector(".timer-progress-bar");
    var percentageLeft = Math.floor(100 * secondsRemaining / 15);
    if (timerProgress) {
        timerProgress.style.width = "".concat(percentageLeft, "%");
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
    var instructionsToggle = document.getElementById('instructions-toggle');
    var instructionsContent = document.getElementById('instructions-content');
    if (instructionsToggle) {
        instructionsToggle.addEventListener('click', function () {
            instructionsContent.classList.toggle('active');
        });
    }
});
