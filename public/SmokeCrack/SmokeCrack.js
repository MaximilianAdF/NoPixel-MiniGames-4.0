const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
let timerInterval = null;
let secondsRemaining = 0;
let totalSeconds = 0;
let maxChars = 0;
let minChars = 0;
function getInputValues() {
    var _a, _b;
    const macInput = document.getElementById('mac-input');
    const ipInput = document.getElementById('ip-input');
    const macIpCombs = {
        '7c:89:3e:c8:cc:65-192.168.0.105': [5, 16, 10], //Easy (seconds, maxChars)
        'fb:d4:31:c:38:e8-192.168.0.205': [5, 18, 14], //Medium 
        '71:21:e3:ea:f6:d0-192.168.0.179': [4, 19, 16], //Hard
    };
    const macInputValue = (_a = macInput === null || macInput === void 0 ? void 0 : macInput.value.toLowerCase().trim()) !== null && _a !== void 0 ? _a : '';
    const ipInputValue = (_b = ipInput === null || ipInput === void 0 ? void 0 : ipInput.value.trim()) !== null && _b !== void 0 ? _b : '';
    if (macIpCombs[`${macInputValue}-${ipInputValue}`]) {
        [secondsRemaining, maxChars, minChars] = macIpCombs[`${macInputValue}-${ipInputValue}`];
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
    const endContainer = document.querySelector('.minigame-over');
    const h2Elem = endContainer.querySelector('h2');
    const pElem = endContainer.querySelector('p');
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
    setTimeout(() => {
        endContainer.style.display = 'none';
        resetGame();
    }, 2000);
}
function resetGame() {
    const minigameContainer = document.querySelector('.minigame-container');
    const crackButton = document.getElementById('crackButton');
    const macInput = document.getElementById('mac-input');
    const ipInput = document.getElementById('ip-input');
    const timerProgress = document.querySelector('.timer-progress-bar-fill');
    const macIpContainer = document.querySelector('.mac-ip-container');
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
    const randomIdx = Math.floor(Math.random() * chars.length);
    return chars.charAt(randomIdx);
}
function generateRandomChars(length) {
    const randomChars = [];
    for (let i = 0; i < length; i++) {
        randomChars.push(getRandomCharacter());
    }
    return randomChars;
}
function generateFeedbackElem(numOfChars) {
    const feedbackContainer = document.querySelector('.feedback-container');
    feedbackContainer.innerHTML = '';
    for (let i = 0; i < numOfChars; i++) {
        const feedbackCircle = document.createElement('div');
        feedbackCircle.classList.add('feedback-circle');
        feedbackContainer.appendChild(feedbackCircle);
        if (i < numOfChars - 1) { //Make sure no extra line at end of circles
            const feedbackLine = document.createElement('div');
            feedbackLine.classList.add('feedback-line');
            feedbackContainer.appendChild(feedbackLine);
        }
    }
    return;
}
function updateFeedback(isCorrect, currSquareIdx) {
    const feedbackContainer = document.querySelector('.feedback-container');
    if (currSquareIdx >= feedbackContainer.children.length) {
        console.log('Invalid square index for feedbackCircle');
        return;
    }
    const feedbackCircle = feedbackContainer.children[2 * currSquareIdx];
    const feedbackLine = feedbackContainer.children[2 * currSquareIdx - 1];
    if (isCorrect) {
        //Update the icon
        const checkIcon = document.createElement('i');
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
        const xIcon = document.createElement('i');
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
    const timerContainer = document.querySelector('.timer-container');
    const letterContainer = document.querySelector('.letter-container');
    if (timerContainer && letterContainer) {
        const letterContainerWidth = letterContainer.clientWidth;
        timerContainer.style.width = `${letterContainerWidth}px`;
    }
    updateTimerDisplay();
}
function runTimer(keyPressListener) {
    document.addEventListener('keydown', keyPressListener);
    timerInterval = setInterval(() => {
        secondsRemaining--;
        updateTimerDisplay();
        if (secondsRemaining <= 0) {
            stopGame(false, keyPressListener);
        }
    }, 1000);
}
function updateTimerDisplay() {
    const timerProgress = document.querySelector('.timer-progress-bar-fill');
    const timerSeconds = document.querySelector('.timer-seconds');
    if (timerSeconds && timerProgress) {
        const percentageLeft = Math.floor(100 * secondsRemaining / totalSeconds);
        timerProgress.style.width = `${percentageLeft}%`;
        timerSeconds.textContent = `${secondsRemaining} sec left`;
    }
}
function startCracking() {
    const macInput = document.getElementById('mac-input');
    const ipInput = document.getElementById('ip-input');
    if (macInput && ipInput) {
        macInput.disabled = true;
        ipInput.disabled = true;
    }
    else {
        console.log('macInput or ipInput or both fields not found');
    }
    const minigameContainer = document.querySelector('.minigame-container');
    const letterContainer = document.querySelector('.letter-container');
    const crackButton = document.getElementById('crackButton');
    const macIpContainer = document.querySelector('.mac-ip-container');
    getInputValues();
    if (crackButton && minigameContainer && macIpContainer) {
        crackButton.style.display = 'none'; //Remove the crack button
        macIpContainer.style.display = 'none'; //Hide the mac-ip container
        const numOfChars = getRandomNumber(minChars, maxChars);
        const randomChars = generateRandomChars(numOfChars);
        if (letterContainer) {
            letterContainer.innerHTML = ''; //Clear the container
            generateFeedbackElem(numOfChars);
            randomChars.forEach(char => {
                const letterSquare = document.createElement('div');
                letterSquare.classList.add('letter-square');
                letterSquare.textContent = char;
                letterContainer.appendChild(letterSquare); //Append the letter square to the letter container
            });
            minigameContainer.style.display = 'flex'; //Show the minigame
            const handleKeyPress = function (event) {
                if (!chars.includes(event.key.toUpperCase()))
                    return;
                if (letterContainer && secondsRemaining) {
                    const pressedKey = event.key.toUpperCase();
                    const currentSquare = letterContainer.children[currSquareIdx];
                    if (pressedKey === randomChars[currSquareIdx]) {
                        currentSquare.style.backgroundColor = 'rgb(84, 255, 164)';
                        updateFeedback(true, currSquareIdx);
                        currSquareIdx++;
                        if (currSquareIdx === randomChars.length) {
                            stopGame(true, handleKeyPress);
                        }
                    }
                    else {
                        updateFeedback(false, currSquareIdx);
                        currentSquare.style.backgroundColor = 'rgb(215, 73, 73)';
                        stopGame(false, handleKeyPress);
                    }
                }
            };
            initTimer();
            runTimer(handleKeyPress);
            let currSquareIdx = 0;
        }
        else {
            console.log('Letter container not found!');
        }
    }
    else {
        console.log('crackButton not found!');
    }
}
