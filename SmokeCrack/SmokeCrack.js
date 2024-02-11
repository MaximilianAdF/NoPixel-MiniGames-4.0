var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
var timerInterval = null;
var secondsRemaining = 0;
var totalSeconds = 0;
var maxChars = 0;
var minChars = 0;
function getInputValues() {
    var _a;
    var _b, _c;
    var macInput = document.getElementById('mac-input');
    var ipInput = document.getElementById('ip-input');
    var macIpCombs = {
        '7c:89:3e:c8:cc:65-192.168.0.105': [5, 16, 10], //Easy (seconds, maxChars)
        'fb:d4:31:c:38:e8-192.168.0.205': [5, 18, 14], //Medium 
        '71:21:e3:ea:f6:d0-192.168.0.179': [4, 20, 16], //Hard
    };
    var macInputValue = (_b = macInput === null || macInput === void 0 ? void 0 : macInput.value.toLowerCase()) !== null && _b !== void 0 ? _b : '';
    var ipInputValue = (_c = ipInput === null || ipInput === void 0 ? void 0 : ipInput.value) !== null && _c !== void 0 ? _c : '';
    if (macIpCombs["".concat(macInputValue, "-").concat(ipInputValue)]) {
        _a = macIpCombs["".concat(macInputValue, "-").concat(ipInputValue)], secondsRemaining = _a[0], maxChars = _a[1], minChars = _a[2];
    }
    else {
        console.log('Invalid MAC-IP combination, using EASY mode as default');
        secondsRemaining = 5;
        maxChars = 16;
        minChars = 10;
    }
    totalSeconds = secondsRemaining;
}
function stopGame(gameWin, keyPressListener) {
    document.removeEventListener('keydown', keyPressListener);
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
    var macIpContainer = document.querySelector('.mac-ip-container');
    if (minigameContainer && crackButton) {
        minigameContainer.style.display = 'none';
        crackButton.style.display = 'flex';
        macIpContainer.style.display = 'flex';
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
    if (timerContainer && letterContainer) {
        var letterContainerWidth = letterContainer.clientWidth;
        timerContainer.style.width = "".concat(letterContainerWidth, "px");
    }
    updateTimerDisplay();
}
function runTimer(keyPressListener) {
    document.addEventListener('keydown', keyPressListener);
    timerInterval = setInterval(function () {
        secondsRemaining--;
        updateTimerDisplay();
        if (secondsRemaining <= 0) {
            stopGame(false, keyPressListener);
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
    var macIpContainer = document.querySelector('.mac-ip-container');
    getInputValues();
    if (crackButton && minigameContainer && macIpContainer) {
        crackButton.style.display = 'none'; //Remove the crack button
        macIpContainer.style.display = 'none'; //Hide the mac-ip container
        var numOfChars = getRandomNumber(minChars, maxChars);
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
            var handleKeyPress_1 = function (event) {
                if (!chars.includes(event.key.toUpperCase()))
                    return;
                if (letterContainer && secondsRemaining) {
                    var pressedKey = event.key.toUpperCase();
                    var currentSquare = letterContainer.children[currSquareIdx_1];
                    if (pressedKey === randomChars_1[currSquareIdx_1]) {
                        currentSquare.style.backgroundColor = 'rgb(84, 255, 164)';
                        updateFeedback(true, currSquareIdx_1);
                        currSquareIdx_1++;
                        if (currSquareIdx_1 === randomChars_1.length) {
                            stopGame(true, handleKeyPress_1);
                        }
                    }
                    else {
                        updateFeedback(false, currSquareIdx_1);
                        currentSquare.style.backgroundColor = 'rgb(215, 73, 73)';
                        stopGame(false, handleKeyPress_1);
                    }
                }
            };
            initTimer();
            runTimer(handleKeyPress_1);
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
