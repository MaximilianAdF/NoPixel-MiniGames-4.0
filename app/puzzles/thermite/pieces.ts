// Pure piece data — no asset imports — so the engine module stays server-importable.
export type PieceType = 'short' | 'medium' | 'long';

export type SquarePiece = { type: PieceType; distance: number };

export const squarePieces: SquarePiece[] = [
  { type: 'short', distance: 1 },
  { type: 'medium', distance: 2 },
  { type: 'long', distance: 3 },
];

export type SquareStatus = 'full' | 'half' | 'empty';

export type Square = {
  piece: SquarePiece;
  status: SquareStatus;
  highlighted: boolean;
};

export type GridRow = Array<Square>;

export type SquareCoord = [row: number, col: number];
