import type { StaticImageData } from 'next/image';
import shortImg from '@/public/images/thermite/short.svg';
import mediumImg from '@/public/images/thermite/medium.svg';
import longImg from '@/public/images/thermite/long.svg';
import type { PieceType } from './pieces';

// Maps a piece type to its SVG — kept out of pieces.ts so the engine stays asset-free.
export const pieceImages: Record<PieceType, StaticImageData> = {
  short: shortImg,
  medium: mediumImg,
  long: longImg,
};

export const presets = [
  {
    label: 'Maze Bank - Sewer',
    timer: 60,
    targetScore: 24,
    rows: 6,
    columns: 6,
  },
  {
    label: 'Maze Bank - Vault',
    timer: 60,
    targetScore: 28,
    rows: 6,
    columns: 6,
  },
  {
    label: 'Art Asylum - Water',
    timer: 25,
    targetScore: 30,
    rows: 6,
    columns: 6,
  },
];
