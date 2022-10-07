import { drawBoard, drawCleared, drawHold, drawNext, setup } from "./drawing";
import {
  board,
  current,
  held,
  incrementCleared,
  next,
  setBoard,
  setCurrent,
  setHeld,
} from "./globals";
import { generateBag } from "./helpers";
import { moveResponse } from "./types";

let lastMove = 0;
let dropTime = 1000;
let running = true;
let canHold = true;

const main = (time: DOMHighResTimeStamp) => {
  if (time > lastMove + dropTime) {
    move(0, 1);
    drawBoard();
    lastMove = time;
  }

  if (running) {
    window.requestAnimationFrame(main);
  }
};

const place = () => {
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
  while (rows.length !== 0) {
    const row = rows.sort((a, b) => b - a)[0];
    for (let column = 0; column < 10; column++) {
      if (board[row][column] === null) {
        rows = rows.slice(1);
        break;
      }

      if (column === 9) {
        incrementCleared();
        drawCleared();
        setBoard([
          Array(10).fill(null),
          ...board.slice(0, row),
          ...board.slice(row + 1),
        ]);
      }
    }
  }
  canHold = true;
};

document.addEventListener("keydown", (e) => {
  if (!running) {
    return;
  }
  switch (e.code) {
    case "KeyA":
      move(-1, 0);
      break;
    case "KeyD":
      move(1, 0);
      break;
    case "KeyS":
      lastMove = performance.now();
      move(0, 1);
      break;
    case "KeyW":
      rotate();
      break;
    case "KeyE":
      rotate();
      rotate();
      rotate();
      break;
    case "Space":
      lastMove = performance.now();
      while (move(0, 1) !== moveResponse.placed) {}
      break;
    case "KeyQ":
      hold();
      break;
  }
  drawBoard();
});

const hold = () => {
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
    canHold = false;
  }
};

const move = (x: number, y: number): moveResponse => {
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
        running = false;
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

const rotate = () => {
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

setup();
drawBoard();
window.requestAnimationFrame(main);
