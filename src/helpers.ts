import { drawHold, drawNext } from "./drawing";
import {
  board,
  canHold,
  current,
  held,
  next,
  setCanHold,
  setCurrent,
  setHeld,
} from "./globals";
import { shapes } from "./shapes";
import { point, shape } from "./types";

export type tetromino = {
  shape: shape;
  rotation: number;
  position: point;
};

export const generateBag: () => tetromino[] = () => {
  const bag = Object.values(shapes).map((shape) => ({
    shape,
    rotation: 0,
    position: { x: shape.startingPos.x, y: shape.startingPos.y },
  }));
  shuffleArray(bag);
  return bag;
};

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const hardDropPos = () => {
  const currentPoints = current.shape.rotations[current.rotation % 4].map(
    (block) => ({
      x: block.x + current.position.x,
      y: block.y + current.position.y,
    })
  );

  const lowestPoint = currentPoints.sort((a, b) => b.y - a.y)[0];
  let dropAmount = 19 - lowestPoint.y;

  for (let index = 0; index < 4; index++) {
    const block = currentPoints[index];
    for (let row = Math.max(block.y + 1, 0); row < 20; row++) {
      if (board[row][block.x] !== null) {
        dropAmount = Math.min(dropAmount, row - block.y - 1);
        break;
      }
    }
  }

  return dropAmount;
};

export const hold = () => {
  if (canHold) {
    const toBeHeld = {
      shape: current.shape,
      position: {
        x: current.shape.startingPos.x,
        y: current.shape.startingPos.y,
      },
      rotation: 0,
    };
    if (held === null) {
      setHeld(toBeHeld);
      setCurrent(next.pop()!);
      if (next.length === 0) {
        next.push(...generateBag());
      }
      drawNext();
    } else {
      const temp = held;
      setHeld(current);
      setCurrent(temp);
    }
    drawHold();
    setCanHold(false);
  }
};
