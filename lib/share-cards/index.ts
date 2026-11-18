import type { StaticImageData } from 'next/image';
import arcade from '@/app/opengraph-image.jpg';
import chopping from './chopping.jpg';
import laundromat from './laundromat.jpg';
import leaderboards from './leaderboards.jpg';
import pincracker from './pincracker.jpg';
import repairKit from './repair-kit.jpg';
import wordMemory from './word-memory.jpg';
import lockIn from './lock-in.jpg';
import oneMoreRun from './one-more-run.jpg';
import spotThePattern from './spot-the-pattern.jpg';
import yourMove from './your-move.jpg';

function shareImage({ src, width, height }: StaticImageData, alt: string) {
  return { url: src, width, height, type: 'image/jpeg', alt };
}

export const shareCards = {
  arcade: shareImage(arcade, 'NoPixel Minigames. A mint-green arcade key with a pixel cursor.'),
  chopping: shareImage(chopping, 'Type Fast. Three letter keys race across the Chopping card.'),
  laundromat: shareImage(laundromat, 'Find the Combo. A silver combination dial on the Laundromat card.'),
  leaderboards: shareImage(leaderboards, 'Beat My Score. A gold podium for the NoPixel leaderboards.'),
  pincracker: shareImage(pincracker, 'Crack the PIN. Four colored digit tiles on the PinCracker card.'),
  repairKit: shareImage(repairKit, 'Hit the Mark. A pointer approaches the green Repair Kit target.'),
  wordMemory: shareImage(wordMemory, 'Seen It? A Word Memory flashcard shows the word “anchor”.'),
  lockIn: shareImage(lockIn, 'Lock In. Colored arcs trace the rings of the NoPixel Lockpick puzzle.'),
  oneMoreRun: shareImage(oneMoreRun, 'One More Run. An orange return key on a blue background.'),
  spotThePattern: shareImage(spotThePattern, 'Spot the Pattern. One bird hides among eight frogs.'),
  yourMove: shareImage(yourMove, 'Your Move. Two pixel cursors face off for a NoPixel 1v1.'),
};
