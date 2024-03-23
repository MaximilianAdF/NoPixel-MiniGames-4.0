let timerIntervalVar: NodeJS.Timeout | null = null;
let eKeyPressed = false;
let slotPosition = 0;
let currPosition = 1;

function startGame(): void {
    const movingSquare = document.querySelector('.moving-square') as HTMLElement;
    const buttonPress = document.querySelector('.button-press') as HTMLElement;
    const squareSlot = document.querySelector('.square-slot') as HTMLElement
    movingSquare.style.background = `radial-gradient(circle, rgb(0, 255, 200), rgb(0, 174, 130))`;
    movingSquare.style.boxShadow = `0 0 5px 0px rgb(16, 239, 191)`;
    movingSquare.style.marginLeft = `1%`;
    buttonPress.style.background = 'radial-gradient(circle, rgb(0, 183, 140), rgb(0, 81, 61))';
    squareSlot.style.setProperty('--background-gradient', 'radial-gradient(circle, rgb(0, 255, 200), rgb(0, 174, 130))');
    eKeyPressed = false;
    currPosition = 0;
    randomizeSquareSlot();
    tick();
}

function checkWin(): boolean {
    const movingSquare = document.querySelector('.moving-square') as HTMLElement;
    const squareSlot = document.querySelector('.square-slot') as HTMLElement
    const buttonPress = document.querySelector('.button-press') as HTMLElement;
    if (timerIntervalVar) {clearInterval(timerIntervalVar);}
    if (slotPosition-2 <= currPosition && currPosition <= slotPosition+2) {
        movingSquare.style.scale = '1.2';
        setTimeout(() => {
            movingSquare.style.scale = '1';
        }, 300);

        return true;
    }
    movingSquare.style.background = `radial-gradient(circle, rgb(255, 85, 76), rgba(132, 32, 32, 0.894))`;
    movingSquare.style.boxShadow = `0 0 5px 0px rgb(255, 0, 0)`;
    buttonPress.style.background = `radial-gradient(circle, rgb(255, 85, 76), rgba(132, 32, 32, 0.894))`;
    squareSlot.style.setProperty('--background-gradient', 'radial-gradient(circle, rgb(255, 85, 76), rgba(132, 32, 32, 0.894))');
    return false;
}

function tick(): void {
    const movingSquare = document.querySelector('.moving-square') as HTMLElement;
    timerIntervalVar = setInterval(() => {
        movingSquare.style.marginLeft = `${currPosition}%`;
        currPosition+=1;
        
        if (currPosition > Math.min(slotPosition+7,94)) {
            if (timerIntervalVar) {clearInterval(timerIntervalVar);}
            handleKeyPress(new KeyboardEvent('keydown', { key: 'E' }));
        }
    }, 50);
}
function handleKeyPress(event: KeyboardEvent): void {
    if (!eKeyPressed && (event.key === 'e' || event.key === "E")) {
        eKeyPressed = true;
        checkWin();
        setTimeout(() => {
            startGame();
        },1000)
    }
}

function randomizeSquareSlot(): void {
    const squareSlot = document.querySelector('.square-slot') as HTMLElement;
    slotPosition = Math.floor(Math.random() * (90 - 15) + 15);

    squareSlot.style.marginLeft = `${slotPosition}%`;
    squareSlot.style.display = `flex`;
}

document.addEventListener('keydown', handleKeyPress);

document.addEventListener('DOMContentLoaded', (event) => {
    startGame();
})