export type SquarePiece = "short" | "medium" | "long";
export const squarePieces: SquarePiece[] = ["short", "medium", "long"];
export type SquareStatus = "full" | "half" | "empty";
export type Square = {
    piece: SquarePiece,
    status: SquareStatus,
    highlighted: boolean
};
export type GridRow = Array<Square>;
export type SquareCoord = [
    row: number,
    col: number,
];


export const presets = [
    {
        // Maze Bank - Sewer hack.
        timer: 60,
        targetScore: 24,
        rows: 6,
        columns: 6,
    },
    {
        // Maze Bank - Vault hack.
        timer: 60,
        targetScore: 28,
        rows: 6,
        columns: 6,
    },
];
export const initialBoard: GridRow[] = new Array(presets[0].rows).fill(
    new Array(presets[0].columns).fill({
      piece: "short",
      status: "full",
      highlighted: false,
    })
  )

/**
 * Returns a random square piece.
 * 
 * @returns {SquarePiece}
 */
export const getRandomPiece = (): SquarePiece => {
    return squarePieces[Math.floor(Math.random() * squarePieces.length)];
}

/**
 * Returns a square of a random piece.
 * 
 * @param status
 * @param highlighted 
 * @returns {Square}
 */
export const getRandomSquare = (status: SquareStatus = "full", highlighted: boolean = true): Square => {
    return {
        piece: getRandomPiece(),
        status,
        highlighted
    };
}

/**
 * Returns the status message.
 * 
 * @param status 
 * @returns {string}
 */
export const getStatusMessage = (status: number | undefined) => {
    switch (status) {
        case 0:
        case 1:
            return "";
        case 2:
            return "Failed!";
        case 3:
            return "Success!";
        case 4:
            return "Reset!";
        default:
            return `Error: Unknown game status ${status}`;
    }
}