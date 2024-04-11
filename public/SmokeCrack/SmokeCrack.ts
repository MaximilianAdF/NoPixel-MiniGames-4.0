const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
let timerInterval: NodeJS.Timeout | null = null;
let secondsRemaining: number = 0;
let totalSeconds: number =  0;
let maxChars: number = 0;
let minChars: number = 0;

function getInputValues(): void {
    const macInput: HTMLInputElement | null = document.getElementById('mac-input') as HTMLInputElement | null;
    const ipInput: HTMLInputElement | null = document.getElementById('ip-input') as HTMLInputElement | null;
    const macIpCombs: { [key: string]: [number, number, number] } = {
        '7c:89:3e:c8:cc:65-192.168.0.105': [5, 16, 10], //Easy (seconds, maxChars)
        'fb:d4:31:c:38:e8-192.168.0.205': [5, 18, 14], //Medium 
        '71:21:e3:ea:f6:d0-192.168.0.179': [4, 19, 16], //Hard
    };
    const macInputValue: string = macInput?.value.toLowerCase().trim() ?? '';
    const ipInputValue: string = ipInput?.value.trim() ?? '';

    if (macIpCombs[`${macInputValue}-${ipInputValue}`]) {
        [secondsRemaining, maxChars, minChars] = macIpCombs[`${macInputValue}-${ipInputValue}`];
    } else {
        console.log('Invalid MAC-IP combination, using EASY mode as default');
        secondsRemaining = 5;
        maxChars = 16;
        minChars = 10;   
    }
    totalSeconds = secondsRemaining;
}

function stopGame(gameWin: boolean, keyPressListener: (event: KeyboardEvent) => void) {
    document.removeEventListener('keydown', keyPressListener);
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    const endContainer = document.querySelector('.minigame-over') as HTMLElement;
    const h2Elem = endContainer.querySelector('h2') as HTMLHeadingElement;
    const pElem = endContainer.querySelector('p') as HTMLElement;

    if (gameWin) {
        endContainer.style.backgroundColor = 'rgba(84, 255, 164, 0.285)';
        h2Elem.textContent = "Hacking done!"
        pElem.textContent = "You successfully hacked the Wi-Fi"
        h2Elem.style.color = 'rgb(84, 255, 164)';
        h2Elem.style.textShadow = 'rgb(127, 255, 191)';
    } else {
        endContainer.style.backgroundColor = 'rgba(255, 127, 127, 0.285)';
        h2Elem.textContent = "Hacking failed!"
        pElem.textContent = "You failed to hack the Wi-Fi"
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
    const minigameContainer = document.querySelector('.minigame-container') as HTMLElement;
    const crackButton = document.getElementById('crackButton') as HTMLElement;
    const macInput = document.getElementById('mac-input') as HTMLInputElement | null;
    const ipInput = document.getElementById('ip-input') as HTMLInputElement | null;
    const timerProgress = document.querySelector('.timer-progress-bar-fill') as HTMLElement;
    const macIpContainer = document.querySelector('.mac-ip-container') as HTMLElement;

    if (minigameContainer && crackButton) {
        minigameContainer.style.display = 'none';
        crackButton.style.display = 'flex';   
        macIpContainer.style.display = 'flex';
    }

    if (macInput && ipInput) {
        macInput.disabled = false;
        ipInput.disabled = false;
    } else {
        console.log('macInput or ipInput or both fields not found')
    }

    if (timerProgress) {
        timerProgress.style.width = '100%'
    }
}

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomCharacter(): string {
    const randomIdx = Math.floor(Math.random() * chars.length);
    return chars.charAt(randomIdx);
}

function generateRandomChars(length: number): string[] {
    const randomChars: string[] = []
    for (let i = 0; i < length; i++) {
        randomChars.push(getRandomCharacter());
    }
    return randomChars;
}

function generateFeedbackElem(numOfChars: number): void {
    const feedbackContainer = document.querySelector('.feedback-container') as HTMLElement;
    feedbackContainer.innerHTML = '';

    for (let i=0; i<numOfChars; i++) {
        const feedbackCircle = document.createElement('div');
        feedbackCircle.classList.add('feedback-circle');
        feedbackContainer.appendChild(feedbackCircle);

        if (i < numOfChars -1) {//Make sure no extra line at end of circles
            const feedbackLine = document.createElement('div');
            feedbackLine.classList.add('feedback-line');
            feedbackContainer.appendChild(feedbackLine);
        }
    }
    return;
}

function updateFeedback(isCorrect: boolean, currSquareIdx: number): void {
    const feedbackContainer = document.querySelector('.feedback-container') as HTMLElement;
    
    if (currSquareIdx >= feedbackContainer.children.length) {
        console.log('Invalid square index for feedbackCircle');
        return;
    }
    
    const feedbackCircle = feedbackContainer.children[2*currSquareIdx] as HTMLElement;
    const feedbackLine = feedbackContainer.children[2*currSquareIdx-1] as HTMLElement;
    if (isCorrect) {
        //Update the icon
        const checkIcon = document.createElement('i');
        checkIcon.classList.add('fas','fa-check');
        feedbackCircle.appendChild(checkIcon);
        feedbackCircle.classList.add('check-mark'); //Styling for check-mark

        //Update the line
        if (currSquareIdx > 0) { //First circle doesn't have a predeceding line
            feedbackLine.style.backgroundColor = 'rgb(84, 255, 164)';
        }

    } else {
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
    const timerContainer = document.querySelector('.timer-container') as HTMLElement;
    const letterContainer = document.querySelector('.letter-container') as HTMLElement;

    if (timerContainer && letterContainer) {
        const letterContainerWidth = letterContainer.clientWidth;
        timerContainer.style.width = `${letterContainerWidth}px`;
    }
    updateTimerDisplay();
}

function runTimer(keyPressListener: (event: KeyboardEvent) => void) {
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
    const timerProgress = document.querySelector('.timer-progress-bar-fill') as HTMLElement;
    const timerSeconds = document.querySelector('.timer-seconds') as HTMLElement;
   
    if (timerSeconds && timerProgress) {
        const percentageLeft = Math.floor(100*secondsRemaining/totalSeconds)
        timerProgress.style.width = `${percentageLeft}%`
        timerSeconds.textContent = `${secondsRemaining} sec left`
    }
}

function startCracking() {
    const macInput = document.getElementById('mac-input') as HTMLInputElement | null;
    const ipInput = document.getElementById('ip-input') as HTMLInputElement | null;

    if (macInput && ipInput) {
        macInput.disabled = true;
        ipInput.disabled = true;
    } else {
        console.log('macInput or ipInput or both fields not found')
    }
    
    const minigameContainer = document.querySelector('.minigame-container') as HTMLElement;
    const letterContainer = document.querySelector('.letter-container');
    const crackButton = document.getElementById('crackButton');
    const macIpContainer = document.querySelector('.mac-ip-container') as HTMLElement;

    getInputValues();
    if (crackButton && minigameContainer && macIpContainer) {
        crackButton.style.display = 'none'; //Remove the crack button
        macIpContainer.style.display = 'none'; //Hide the mac-ip container

        const numOfChars = getRandomNumber(minChars,maxChars);
        const randomChars = generateRandomChars(numOfChars);

        if (letterContainer) {
            letterContainer.innerHTML = ''; //Clear the container
            
            generateFeedbackElem(numOfChars);
            randomChars.forEach(char => {
                const letterSquare = document.createElement('div');
                letterSquare.classList.add('letter-square');
                letterSquare.textContent = char;
                letterContainer.appendChild(letterSquare) //Append the letter square to the letter container
            })
            minigameContainer.style.display = 'flex' //Show the minigame

            const handleKeyPress = function(event: KeyboardEvent) {
                if (!chars.includes(event.key.toUpperCase())) return;
                if (letterContainer && secondsRemaining) {
                    const pressedKey = event.key.toUpperCase();
                    const currentSquare = letterContainer.children[currSquareIdx] as HTMLDivElement;

                    if (pressedKey === randomChars[currSquareIdx]) {
                        currentSquare.style.backgroundColor = 'rgb(84, 255, 164)';
                        updateFeedback(true, currSquareIdx);
                        currSquareIdx++;

                        if (currSquareIdx === randomChars.length) {
                            stopGame(true, handleKeyPress);
                        }
                    } else {
                        updateFeedback(false, currSquareIdx);
                        currentSquare.style.backgroundColor = 'rgb(215, 73, 73)'
                        stopGame(false, handleKeyPress);
                    }
                }
            }

            initTimer();
            runTimer(handleKeyPress);
            let currSquareIdx = 0;


        } else {
            console.log('Letter container not found!');
        }
    } else {
        console.log('crackButton not found!')
    }
}
