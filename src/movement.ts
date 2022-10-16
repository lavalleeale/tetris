import { drawCleared, drawNext } from "./drawing";
import {
  board,
  current,
  finish,
  incrementCleared,
  next,
  setBoard,
  setCanHold,
  setCurrent,
} from "./globals";
import { generateBag } from "./helpers";
import { moveResponse } from "./types";

export const rotate = () => {
  const newRotation = current.shape.rotations[(current.rotation + 1) % 4];

  for (let index = 0; index < 4; index++) {
    const block = newRotation[index];
    if (
      board[current.position.y + block.y] !== undefined &&
      board[current.position.y + block.y][current.position.x + block.x] !== null
    ) {
      return;
    }
  }
  current.rotation++;
};

export const move = (x: number, y: number): moveResponse => {
  const currentRotation = current.shape.rotations[current.rotation % 4];

  // Loop over each block in current tetromino
  for (let i = 0; i < currentRotation.length; i++) {
    const block = currentRotation[i];

    // If next position would be under bottom
    if (y + block.y + current.position.y >= 20) {
      // Place tetromino
      place();
      return moveResponse.placed;
    }

    // If space occupied
    if (
      board[current.position.y + block.y + y] !== undefined &&
      typeof board[current.position.y + block.y + y][
        current.position.x + block.x + x
      ] === "string"
    ) {
      // If position would include block above board
      if (block.y + current.position.y + y <= 1) {
        alert("fail");
        finish();
        return moveResponse.gameOver;
      }
      // If moving down
      if (y === 1) {
        // Place tetromino
        place();
        return moveResponse.placed;
      }
      return moveResponse.failed;
    }

    if (
      x + block.x + current.position.x < 0 ||
      x + block.x + current.position.x >= 10
    ) {
      return moveResponse.failed;
    }
  }

  current.position.x += x;
  current.position.y += y;
  return moveResponse.moved;
};

export const place = () => {
  let rows: number[] = [];
  // Add blocks in tetromino to board
  for (let index = 0; index < 4; index++) {
    const currentPoint = current.shape.rotations[current.rotation % 4][index];
    board[currentPoint.y + current.position.y][
      currentPoint.x + current.position.x
    ] = current.shape.color;
    if (!rows.includes(currentPoint.y + current.position.y)) {
      rows.push(currentPoint.y + current.position.y);
    }
  }

  setCurrent(next.pop()!);
  if (next.length === 0) {
    next.push(...generateBag());
  }
  drawNext();

  // Check each row piece was in to determine if line needs to be cleared
  rows.sort().forEach((row) => {
    for (let column = 0; column < 10; column++) {
      // If an empty spot in row move on
      if (board[row][column] === null) {
        rows = rows.slice(1);
        break;
      }

      // If no column contains obstruction clear line
      if (column === 9) {
        incrementCleared();
        drawCleared();
        // Add empty row for highest line and remove line to be cleared
        setBoard([
          Array(10).fill(null),
          ...board.slice(0, row),
          ...board.slice(row + 1),
        ]);
      }
    }
  });
  setCanHold(true);
};
