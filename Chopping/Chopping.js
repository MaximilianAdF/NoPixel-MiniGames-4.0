var timerTimeout;
var timerProgressBar;
var totalSecondsVar = 7;
var numLetters = 15;
var gridRows = 3;
var gridCols = 6;
var isLocked = false;
var container;
var htmlContainer;
var Letter = /** @class */ (function () {
    function Letter(value) {
        if (value === void 0) { value = ""; }
        this.state = "";
        if (value === "")
            value = this.getRandomValue();
        this.value = value;
    }
    Letter.prototype.getElement = function () {
        var element = document.createElement("div");
        if (this.state)
            element.className = "letter" + (this.state === "done" ? " done" : " fail");
        else
            element.className = "letter";
        element.innerHTML = this.value.toUpperCase();
        return element;
    };
    Letter.prototype.getRandomValue = function () {
        var randomIndex = Math.floor(Math.random() * Letter.values.length);
        return Letter.values[randomIndex];
    };
    Letter.prototype.updateContainer = function () {
        // Clear the container
        var children = htmlContainer.children;
        Array.from(children).forEach(function (child) {
            while (child.firstChild) {
                child.removeChild(child.firstChild);
            }
        });
        // Append nodes from the modified copy
        container.forEach(function (letter, i) {
            var row = Math.floor(i / gridCols);
            htmlContainer.children[row].appendChild(letter.getElement());
        });
        Array.from(children).forEach(function (child) {
            var element = child;
            element.style.gridTemplateColumns = "repeat(".concat(child.children.length, ", min-content)");
        });
        this.checkWin();
    };
    Letter.prototype.checkWin = function () {
        var activeLetter = getActiveLetter();
        return activeLetter ? false : endGame("win");
    };
    Letter.values = ["q", "w", "e", "r", "a", "s", "d"];
    return Letter;
}());
function shouldFail() {
    return true;
}
// ------------------------------------------------------------^
function endGame(outcome) {
    if (isLocked)
        return;
    var timerProgress = document.querySelector(".timer-progress-bar");
    timerProgress.style.transition = "none";
    timerProgress.style.display = "none";
    timerProgress.style.width = "100%";
    isLocked = true;
    if (outcome === "win") {
        var winMsg_1 = document.querySelector(".win-message");
        winMsg_1.style.display = "flex";
        setTimeout(function () {
            winMsg_1.style.display = 'none';
            timerProgress.style.display = "block";
            resetGame();
        }, 2000);
    }
    else if (outcome === "lose") {
        var loseMsg_1 = document.querySelector(".lose-message");
        loseMsg_1.style.display = "flex";
        setTimeout(function () {
            loseMsg_1.style.display = 'none';
            timerProgress.style.display = "block";
            resetGame();
        }, 2000);
    }
    else if (outcome === "reset") {
        var resetMsg_1 = document.querySelector(".reset-message");
        resetMsg_1.style.display = "flex";
        setTimeout(function () {
            resetMsg_1.style.display = 'none';
            timerProgress.style.display = "block";
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
    timerProgress.style.transition = "width ".concat(totalSecondsVar, "s cubic-bezier(0.4, 1, 0.7, 0.93)");
    generateLetters();
    runTimer();
    isLocked = false;
}
function generateLetters() {
    console.log("generating letters...");
    // htmlContainer.innerHTML = "";
    container = [];
    for (var i = 0; i < numLetters; i++) {
        var letter = new Letter();
        container === null || container === void 0 ? void 0 : container.push(letter);
        // Last iteration only
        if (i === numLetters - 1) {
            letter.updateContainer();
        }
    }
}
function getActiveLetter() {
    return container.find(function (letter) { return letter.state !== "done"; });
}
function handleKeyPress(event) {
    if (isLocked)
        return; //Game is over, key presses are ignored
    if (Letter.values.includes(event.key)) {
        var activeLetter = getActiveLetter();
        if (activeLetter.value === event.key) {
            activeLetter.state = "done";
            activeLetter.updateContainer();
        }
        else {
            activeLetter.state = "fail";
            activeLetter.updateContainer();
            endGame("lose");
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
    }, totalSecondsVar * 1000);
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
    var lettersSliderValue = document.querySelector(".letters-container .slider-value span");
    totalSecondsVar = Number(timingSliderValue.textContent);
    numLetters = Number(lettersSliderValue.textContent);
    // Run the game with the new settings
    toggleSettings("close");
    endGame("reset");
}
function resetSettings() {
    var timingSliderValue = document.querySelector(".timing-container .slider-value span");
    var lettersSliderValue = document.querySelector(".letters-container .slider-value span");
    var timingSliderInput = document.querySelector(".timing-container input[type='range']");
    var lettersSliderInput = document.querySelector(".letters-container input[type='range']");
    timingSliderInput.value = "7";
    lettersSliderInput.value = "15";
    timingSliderValue.style.left = "7%";
    lettersSliderValue.style.left = "0%";
    timingSliderValue.textContent = "7";
    lettersSliderValue.textContent = "15";
}
document.addEventListener("DOMContentLoaded", function () {
    htmlContainer = document.getElementById("container");
    resetGame();
    // Get references to the timing slider and its value display element
    var timingSliderValue = document.querySelector(".timing-container .slider-value span");
    var timingSliderInput = document.querySelector(".timing-container input[type='range']");
    // Get references to the letters slider and its value display element
    var lettersSliderValue = document.querySelector(".letters-container .slider-value span");
    var lettersSliderInput = document.querySelector(".letters-container input[type='range']");
    // Function to update the value display element when the letters slider value changes
    lettersSliderInput.addEventListener('input', function () {
        var value = lettersSliderInput.value;
        lettersSliderValue.textContent = value;
        lettersSliderValue.style.left = "".concat((Number(value) - 15) / 0.03, "%");
    });
    // Function to update the value display element when the timing slider value changes
    timingSliderInput.addEventListener('input', function () {
        var value = timingSliderInput.value;
        timingSliderValue.textContent = value;
        timingSliderValue.style.left = "".concat(Number(value), "%");
    });
});
document.addEventListener("keydown", handleKeyPress);
