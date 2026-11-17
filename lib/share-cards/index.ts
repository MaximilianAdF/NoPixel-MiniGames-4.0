import type { StaticImageData } from 'next/image';
import lockIn from './lock-in.jpg';
import oneMoreRun from './one-more-run.jpg';
import spotThePattern from './spot-the-pattern.jpg';
import yourMove from './your-move.jpg';

function shareImage({ src, width, height }: StaticImageData, alt: string) {
  return { url: src, width, height, type: 'image/jpeg', alt };
}

export const shareCards = {
  lockIn: shareImage(lockIn, 'Lock In. Colored arcs trace the rings of the NoPixel Lockpick puzzle.'),
  oneMoreRun: shareImage(oneMoreRun, 'One More Run. An orange return key on a blue background.'),
  spotThePattern: shareImage(spotThePattern, 'Spot the Pattern. One bird hides among eight frogs.'),
  yourMove: shareImage(yourMove, 'Your Move. Two pixel cursors face off for a NoPixel 1v1.'),
};
