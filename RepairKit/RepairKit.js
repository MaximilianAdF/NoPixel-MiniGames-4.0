function randomizeSquareSlot() {
    var squareSlot = document.querySelector('.square-slot');
    var position = Math.floor(Math.random() * (94 - 15) + 15);
    squareSlot.style.marginLeft = "".concat(position, "%");
    squareSlot.style.display = "flex";
    return position;
}
document.addEventListener('DOMContentLoaded', function (event) {
    var winPosition = randomizeSquareSlot();
});
