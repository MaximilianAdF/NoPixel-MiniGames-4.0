let fakeCubes = 0;

class Cube { 
    container: HTMLDivElement = document.getElementById("container") as HTMLDivElement;
    element: HTMLDivElement
    color: string

    constructor() {
        this.color = this.getRandomColorClass();
        this.element = document.createElement("div");
        this.element.className = "cube";
        this.element.classList.add(this.color);
        this.element.addEventListener("click", this.squareClick.bind(this));
    }

    addFakeCubes() {
        const numFakeCubes = 25 - this.container.childNodes.length;
        for (let i = 0; i < numFakeCubes; i++) {
            const fakeCube = document.createElement("div");
            fakeCube.className = "cube fake";
    
            this.container.insertBefore(fakeCube, this.container.firstChild);
            
            fakeCubes++;
        }
    }


    getAdjacentCubes(cube) {
        const idx = Array.from(this.container.childNodes).indexOf(cube);
        const adjacentCubes: HTMLDivElement[] = [];

        const row = Math.floor(idx/5);
        const col = idx%5;

        if (col - 1 >= 0) adjacentCubes.push(this.container.childNodes[idx-1] as HTMLDivElement);
        if (col + 1 < 5) adjacentCubes.push(this.container.childNodes[idx+1] as HTMLDivElement);
        if (row - 1 >= 0) adjacentCubes.push(this.container.childNodes[idx-5] as HTMLDivElement);
        if (row + 1 < 5) adjacentCubes.push(this.container.childNodes[idx+5] as HTMLDivElement);
       
        return adjacentCubes;      
    }

    removeConnectedCubes() {
        const connectedCubes = this.getConnectedCubes();

        if (connectedCubes.size === 1) {
            console.log("No connectedCubes")
        } else {
            connectedCubes.forEach(cube => {        
                (cube as HTMLDivElement).classList.remove(this.color);  
                //this.container.removeChild(cube as Node);
            });
        }
    }

    getConnectedCubes() {
        const connectedCubes = new Set();
        const queue = [this.element];

        while (queue.length > 0) {
            const currentCube = queue.shift();
            connectedCubes.add(currentCube);

            const neighbors = this.getAdjacentCubes(currentCube);
            neighbors.forEach(neighbor => {
                if (!connectedCubes.has(neighbor) && neighbor.classList.contains(this.color)) {
                    queue.push(neighbor);
                    connectedCubes.add(neighbor)
                }
            });
        }
        return connectedCubes;
    }

    getRandomColorClass() {
        const colors = ["cuber", "cubeg", "cubeb"];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }

    squareClick() {
        this.removeConnectedCubes();
        //this.addFakeCubes();
    }
}

function generateCubes(): void {
    const container: HTMLDivElement = document.getElementById("container") as HTMLDivElement;
    for (let i = 0; i < 25; i++) {
        const cube = new Cube();
        container?.appendChild(cube.element);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    generateCubes();
})