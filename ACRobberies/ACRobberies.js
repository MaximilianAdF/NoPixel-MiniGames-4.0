var fakeCubes = 0;
var Cube = /** @class */ (function () {
    function Cube() {
        this.container = document.getElementById("container");
        this.color = this.getRandomColorClass();
        this.element = document.createElement("div");
        this.element.className = "cube";
        this.element.classList.add(this.color);
        this.element.addEventListener("click", this.squareClick.bind(this));
    }
    Cube.prototype.addFakeCubes = function () {
        var numFakeCubes = 25 - this.container.childNodes.length;
        for (var i = 0; i < numFakeCubes; i++) {
            var fakeCube = document.createElement("div");
            fakeCube.className = "cube fake";
            this.container.insertBefore(fakeCube, this.container.firstChild);
            fakeCubes++;
        }
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
            console.log("No connectedCubes");
        }
        else {
            connectedCubes.forEach(function (cube) {
                cube.classList.remove(_this.color);
                //this.container.removeChild(cube as Node);
            });
        }
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
    Cube.prototype.getRandomColorClass = function () {
        var colors = ["cuber", "cubeg", "cubeb"];
        var randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };
    Cube.prototype.squareClick = function () {
        this.removeConnectedCubes();
        //this.addFakeCubes();
    };
    return Cube;
}());
function generateCubes() {
    var container = document.getElementById("container");
    for (var i = 0; i < 25; i++) {
        var cube = new Cube();
        container === null || container === void 0 ? void 0 : container.appendChild(cube.element);
    }
}
document.addEventListener("DOMContentLoaded", function () {
    generateCubes();
});
