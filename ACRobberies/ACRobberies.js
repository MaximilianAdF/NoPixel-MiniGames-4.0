var timerInterval = null;
var secondsRemaining = 20;
var currentCircle = 1;
runTimer()
function updateTimerDisplay() {
    var timerProgress = document.querySelector(".timer-progress-bar");
    var percentageLeft = Math.floor(100 * secondsRemaining / 20);
    if (timerProgress) {
        timerProgress.style.width = "".concat(percentageLeft, "%");
    }
}
function runTimer() {
    timerInterval = setInterval(function () {
        secondsRemaining--;
        updateTimerDisplay();
        if (secondsRemaining <= 0) {
            resetGame("lose");
        }
    }, 1000);
}
function resetGame(status) {
    var timerProgress = document.querySelector(".timer-progress-bar");
    var lockContainer = document.querySelector('.lock-container');
    var svgCircle = document.querySelector('.position-container svg');
    setTimeout(function () {
        lockContainer.innerHTML = '';
        currentCircle = 1;
        if (svgCircle) {
            svgCircle.innerHTML = '';
        }
    }, 2000);
    if (timerInterval) {
        clearInterval(timerInterval);
        timerProgress.style.display = "none";
        timerProgress.style.width = "100%";
        setTimeout(function () {
            timerProgress.style.removeProperty('display');
        }, 1000);
        secondsRemaining = 20;
    }
    if (status === "win") {
        var winMsg_1 = document.querySelector(".win-message");
        winMsg_1.style.display = "flex";
        setTimeout(function () {
            winMsg_1.style.display = "none";
        }, 2000);
    }
    else if (status === "lose") {
        var loseMsg_1 = document.querySelector(".lose-message");
        loseMsg_1.style.display = "flex";
        setTimeout(function () {
            loseMsg_1.style.display = "none";
        }, 2000);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("container");

    for (let i = 0; i < 25; i++) {
        const cube = document.createElement("div");
        cube.className = "cube";

        const randomColorClass = getRandomColorClass();
        cube.classList.add(randomColorClass);

        cube.addEventListener("click", function () {
            removeConnectedCubes(cube);
            setTimeout(function () {
                checkRemainingColors();
                checkwin();
            }, 10);
        });
        container.appendChild(cube);
    }
    function checkwin() {
        var container = document.getElementById("container");
        var divsInsideContainer = container.getElementsByTagName('div');
        if (divsInsideContainer.length == 0) {
            alert("You won!");
        }
    }
    function getRandomColorClass() {
        const colors = ["cuber", "cubeg", "cubeb"];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }

    function checkRemainingColors() {
        const colorCounts = {
            "cuber": 0,
            "cubeg": 0,
            "cubeb": 0
        };

        container.childNodes.forEach(function (cube) {
            const colorClass = cube.classList[1];
            colorCounts[colorClass]++;
        });

        let remainingCubes = 0;

        for (const colorClass in colorCounts) {
            remainingCubes += colorCounts[colorClass];

            if (colorCounts[colorClass] === 1) {
                alert(`Lost! Only one ${colorClass} cube left.`);
            }
        }

    }


    function removeConnectedCubes(clickedCube) {
        const colorClass = clickedCube.classList[1];
        const connectedCubes = getConnectedCubes(clickedCube, colorClass);

        if (connectedCubes.size === 1) {
            alert("No connected cubes of the same color.");
        } else {
            connectedCubes.forEach(function (cube) {
                container.removeChild(cube);
            });
        }
    }

    function getConnectedCubes(cube, colorClass) {
        const stack = [cube];
        const connectedCubes = new Set();

        while (stack.length > 0) {
            const currentCube = stack.pop();
            connectedCubes.add(currentCube);

            const neighbors = getAdjacentCubes(currentCube);
            neighbors.forEach(function (neighbor) {
                if (!connectedCubes.has(neighbor) && neighbor.classList.contains(colorClass)) {
                    stack.push(neighbor);
                }
            });
        }

        return connectedCubes;
    }

    function getAdjacentCubes(cube) {
        const adjacentCubes = [];
        const index = Array.from(container.childNodes).indexOf(cube);

        if (index - 1 >= 0) adjacentCubes.push(container.childNodes[index - 1]);
        if (index + 1 < container.childNodes.length) adjacentCubes.push(container.childNodes[index + 1]);
        if (index - 5 >= 0) adjacentCubes.push(container.childNodes[index - 5]);
        if (index + 5 < container.childNodes.length) adjacentCubes.push(container.childNodes[index + 5]);

        return adjacentCubes;
    }
});
