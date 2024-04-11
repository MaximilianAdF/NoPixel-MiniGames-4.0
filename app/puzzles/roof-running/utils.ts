export type SquareColor = "red" | "green" | "blue";
export type SquareValue = SquareColor | "empty";

export const squareColors: SquareColor[] = ["red", "green", "blue"];

export const handleGravity = (board: SquareValue[], rows: number, columns: number): SquareValue[] => {
    const result = [...board];
    // Loop through each column
    for (let col = 0; col < columns; col++) {
        let emptyCount = 0;
        // Loop through each row in the current column
        for (let row = rows - 1; row >= 0; row--) {
            // If the current square is empty, increment emptyCount
            if (result[row * columns + col] === "empty") {
                emptyCount++;
            } else if (emptyCount > 0) {
                // If the current square is not empty and there are empty squares below it
                // Move the current square down as far as possible
                result[(row + emptyCount) * columns + col] = result[row * columns + col];
                result[row * columns + col] = "empty";
            }
        }
    }
    return result;
}

export const handleLeftShift = (board: SquareValue[], rows: number, columns: number): SquareValue[] => {
    const result = [...board];
    let emptyCount = 0;
    // Loop through each column
    for (let col = 0; col < columns; col++) {
        let isEmptyColumn = true;
        // Check if the current column is empty
        for (let row = 0; row < rows; row++) {
            if (result[row * columns + col] !== "empty") {
                isEmptyColumn = false;
                break;
            }
        }
        // If the current column is empty, increment emptyCount
        if (isEmptyColumn) {
            emptyCount++;
        } else if (emptyCount > 0) {
            // If the current column is not empty and there are empty columns left of it
            // Move the current column left as far as possible
            for (let row = 0; row < rows; row++) {
                result[row * columns + col - emptyCount] = result[row * columns + col];
                result[row * columns + col] = "empty";
            }
        }
    }
    return result;
}

export const getCluster = (board: SquareValue[], index: number, rows: number, columns: number): number[] => {
    const color = board[index];
    const cluster: number[] = [];
    const visited: boolean[] = new Array(rows * columns).fill(false);

    // Helper function to recursively find adjacent squares of the same color using a depth-first search
    function dfs(currentIndex: number) {
        // Mark the current index as visited
        visited[currentIndex] = true;
        cluster.push(currentIndex);

        // Get row and column of the current index
        const row = Math.floor(currentIndex / columns);
        const col = currentIndex % columns;

        // Define adjacent indices
        const adjacentIndices = [
            currentIndex - columns, // Up
            currentIndex + columns, // Down
            currentIndex - 1,      // Left
            currentIndex + 1       // Right
        ];

        // Loop through adjacent squares
        for (const adjIndex of adjacentIndices) {
            // Check if adjacent square is within bounds and has the same color
            if (
                adjIndex >= 0 &&
                adjIndex < rows * columns &&
                (
                    // Check if we're in the same row/col, line wraps are adjacent in index but aren't really adjacent
                    Math.floor(adjIndex / columns) === row ||
                    (adjIndex % columns) === col
                ) &&
                !visited[adjIndex] &&
                board[adjIndex] === color
            ) {
                // Recursively explore the adjacent square
                dfs(adjIndex);
            }
        }
    }

    // Start DFS from the input index
    dfs(index);

    return cluster;
}

export const aiHandleLeftShift = (board: SquareValue[], rows: number, columns: number): SquareValue[] => {
    const result = [...board];

    // Loop through each column
    for (let col = 0; col < columns; col++) {
        let isEmptyColumn = false;
        // Check if the current column is empty
        for (let row = 0; row < rows; row++) {
            if (result[row * columns + col] !== "empty") {
                isEmptyColumn = true;
                break;
            }
        }
        // If the column is not empty, shift it to the left
        if (!isEmptyColumn) {
            let destCol = 0;
            for (let srcCol = 0; srcCol < columns; srcCol++) {
                // Skip empty columns
                if (srcCol === col) continue;
                // Move non-empty column to the left
                for (let row = 0; row < rows; row++) {
                    result[row * columns + destCol] = result[row * columns + srcCol];
                }
                destCol++;
            }
            // Fill the remaining column with empty squares
            for (let row = 0; row < rows; row++) {
                result[row * columns + destCol] = "empty";
            }
        }
    }
    return result;
}
