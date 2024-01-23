"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var timerInterval = null;
var secondsRemaining = 0;
var totalSeconds = 0;
function stopGame(gameWin) {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    var endContainer = document.querySelector('.minigame-over');
    var h2Elem = endContainer.querySelector('h2');
    var pElem = endContainer.querySelector('p');
    if (gameWin) {
        endContainer.style.backgroundColor = 'rgba(84, 255, 164, 0.285)';
        h2Elem.textContent = "Hacking done!";
        pElem.textContent = "You successfully hacked the Wi-Fi";
        h2Elem.style.color = 'rgb(84, 255, 164)';
        h2Elem.style.textShadow = 'rgb(127, 255, 191)';
    }
    else {
        endContainer.style.backgroundColor = 'rgba(255, 127, 127, 0.285)';
        h2Elem.textContent = "Hacking failed!";
        pElem.textContent = "You failed to hack the Wi-Fi";
        h2Elem.style.color = 'rgb(255, 84, 84)';
        h2Elem.style.textShadow = 'rgb(255, 127, 127)';
    }
    endContainer.style.display = 'flex';
    setTimeout(function () {
        endContainer.style.display = 'none';
        resetGame();
    }, 2000);
}
function resetGame() {
    var minigameContainer = document.querySelector('.minigame-container');
    var crackButton = document.getElementById('crackButton');
    var macInput = document.getElementById('mac-input');
    var ipInput = document.getElementById('ip-input');
    var timerProgress = document.querySelector('.timer-progress-bar-fill');
    if (minigameContainer && crackButton) {
        minigameContainer.style.display = 'none';
        crackButton.style.display = 'flex';
    }
    if (macInput && ipInput) {
        macInput.disabled = false;
        ipInput.disabled = false;
    }
    else {
        console.log('macInput or ipInput or both fields not found');
    }
    if (timerProgress) {
        timerProgress.style.width = '100%';
    }
}
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomCharacter() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var randomIdx = Math.floor(Math.random() * chars.length);
    return chars.charAt(randomIdx);
}
function generateRandomChars(length) {
    var randomChars = [];
    for (var i = 0; i < length; i++) {
        randomChars.push(getRandomCharacter());
    }
    return randomChars;
}
function generateFeedbackElem(numOfChars) {
    var feedbackContainer = document.querySelector('.feedback-container');
    feedbackContainer.innerHTML = '';
    for (var i = 0; i < numOfChars; i++) {
        var feedbackCircle = document.createElement('div');
        feedbackCircle.classList.add('feedback-circle');
        feedbackContainer.appendChild(feedbackCircle);
        if (i < numOfChars - 1) { //Make sure no extra line at end of circles
            var feedbackLine = document.createElement('div');
            feedbackLine.classList.add('feedback-line');
            feedbackContainer.appendChild(feedbackLine);
        }
    }
    return;
}
function updateFeedback(isCorrect, currSquareIdx) {
    var feedbackContainer = document.querySelector('.feedback-container');
    if (currSquareIdx >= feedbackContainer.children.length) {
        console.log('Invalid square index for feedbackCircle');
        return;
    }
    var feedbackCircle = feedbackContainer.children[2 * currSquareIdx];
    var feedbackLine = feedbackContainer.children[2 * currSquareIdx - 1];
    if (isCorrect) {
        //Update the icon
        var checkIcon = document.createElement('i');
        checkIcon.classList.add('fas', 'fa-check');
        feedbackCircle.appendChild(checkIcon);
        feedbackCircle.classList.add('check-mark'); //Styling for check-mark
        //Update the line
        if (currSquareIdx > 0) { //First circle doesn't have a predeceding line
            feedbackLine.style.backgroundColor = 'rgb(84, 255, 164)';
        }
    }
    else {
        //Update the icon
        var xIcon = document.createElement('i');
        xIcon.classList.add('fas', 'fa-times');
        feedbackCircle.appendChild(xIcon);
        feedbackCircle.classList.add('x-mark'); //Styling for x-mark
        //Update the line
        if (currSquareIdx > 0) {
            feedbackLine.style.backgroundColor = 'rgb(255, 84, 84)';
        }
    }
    return;
}
function initTimer() {
    var timerContainer = document.querySelector('.timer-container');
    var letterContainer = document.querySelector('.letter-container');
    //Defining how long timer should be
    totalSeconds = secondsRemaining = 5;
    if (timerContainer && letterContainer) {
        var letterContainerWidth = letterContainer.clientWidth;
        timerContainer.style.width = "".concat(letterContainerWidth, "px");
    }
    updateTimerDisplay();
}
function runTimer() {
    timerInterval = setInterval(function () {
        secondsRemaining--;
        updateTimerDisplay();
        if (secondsRemaining <= 0) {
            stopGame(false);
        }
    }, 1000);
}
function updateTimerDisplay() {
    var timerProgress = document.querySelector('.timer-progress-bar-fill');
    var timerSeconds = document.querySelector('.timer-seconds');
    if (timerSeconds && timerProgress) {
        var percentageLeft = Math.floor(100 * secondsRemaining / totalSeconds);
        timerProgress.style.width = "".concat(percentageLeft, "%");
        timerSeconds.textContent = "".concat(secondsRemaining, " sec left");
    }
}
function startCracking() {
    var macInput = document.getElementById('mac-input');
    var ipInput = document.getElementById('ip-input');
    if (macInput && ipInput) {
        macInput.disabled = true;
        ipInput.disabled = true;
    }
    else {
        console.log('macInput or ipInput or both fields not found');
    }
    var minigameContainer = document.querySelector('.minigame-container');
    var letterContainer = document.querySelector('.letter-container');
    var crackButton = document.getElementById('crackButton');
    if (crackButton && minigameContainer) {
        crackButton.style.display = 'none'; //Remove the crack button
        var numOfChars = getRandomNumber(8, 16);
        var randomChars_1 = generateRandomChars(numOfChars);
        if (letterContainer) {
            letterContainer.innerHTML = ''; //Clear the container
            generateFeedbackElem(numOfChars);
            randomChars_1.forEach(function (char) {
                var letterSquare = document.createElement('div');
                letterSquare.classList.add('letter-square');
                letterSquare.textContent = char;
                letterContainer.appendChild(letterSquare); //Append the letter square to the letter container
            });
            minigameContainer.style.display = 'flex'; //Show the minigame
            initTimer();
            runTimer();
            var handleKeyPress_1 = function (event) {
                if (event.key === "Shift" || event.key === "CapsLock") {
                    return;
                }
                if (letterContainer && secondsRemaining) {
                    var pressedKey = event.key.toUpperCase();
                    var currentSquare = letterContainer.children[currSquareIdx_1];
                    if (pressedKey === randomChars_1[currSquareIdx_1]) {
                        currentSquare.style.backgroundColor = 'rgb(84, 255, 164)';
                        updateFeedback(true, currSquareIdx_1);
                        currSquareIdx_1++;
                        if (currSquareIdx_1 === randomChars_1.length) {
                            //All squares ok
                            document.removeEventListener('keydown', handleKeyPress_1);
                            stopGame(true);
                        }
                    }
                    else {
                        updateFeedback(false, currSquareIdx_1);
                        document.removeEventListener('keydown', handleKeyPress_1);
                        currentSquare.style.backgroundColor = 'rgb(215, 73, 73)';
                        stopGame(false);
                    }
                }
            };
            //Event listener for keyboard presses
            document.addEventListener('keydown', handleKeyPress_1);
            var currSquareIdx_1 = 0;
        }
        else {
            console.log('Letter container not found!');
        }
    }
    else {
        console.log('crackButton not found!');
    }
}
