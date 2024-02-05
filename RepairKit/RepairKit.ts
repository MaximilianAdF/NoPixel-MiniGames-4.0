function randomizeSquareSlot(): number {
    const squareSlot = document.querySelector('.square-slot') as HTMLElement
    const position = Math.floor(Math.random() * (94 - 15) + 15);

    squareSlot.style.marginLeft = `${position}%`;
    squareSlot.style.display = `flex`
    return position;
}

document.addEventListener('DOMContentLoaded', (event) => {
    const winPosition = randomizeSquareSlot()
})