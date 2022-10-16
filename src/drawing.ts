import {
  board,
  cleared,
  ctx,
  current,
  height,
  held,
  next,
  padding,
  rightSidebarStart,
  sidebarWidth,
  width,
} from "./globals";
import { hardDropPos } from "./helpers";

export const setup = () => {
  ctx.font = "28px Arial";
  // Left Sidebar
  ctx.strokeRect(1, 1, sidebarWidth, height - 2);
  const holdMetrics = ctx.measureText("Hold");
  ctx.fillText(
    "Hold",
    (sidebarWidth - holdMetrics.width) / 2,
    holdMetrics.fontBoundingBoxAscent
  );

  // Right Sidebar
  ctx.strokeRect(rightSidebarStart, 1, sidebarWidth, height - 2);
  const nextMetrics = ctx.measureText("Next");
  ctx.fillText(
    "Next",
    rightSidebarStart + (sidebarWidth - nextMetrics.width) / 2,
    nextMetrics.fontBoundingBoxAscent
  );
  drawCleared();
  // Next Piece
  drawNext();
};

export const drawCleared = () => {
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  const clearedMetrics = ctx.measureText(`Cleared: ${cleared}`);
  ctx.clearRect(
    rightSidebarStart + (sidebarWidth - clearedMetrics.width) / 2,
    height - clearedMetrics.fontBoundingBoxAscent * 2,
    clearedMetrics.width,
    clearedMetrics.fontBoundingBoxAscent
  );
  ctx.fillText(
    `Cleared: ${cleared}`,
    rightSidebarStart + (sidebarWidth - clearedMetrics.width) / 2,
    height - clearedMetrics.fontBoundingBoxAscent
  );
};

export const drawNext = () => {
  const nextPiece = next[next.length - 1];
  const nextRotation = nextPiece.shape.rotations[0];

  const blockSize = (sidebarWidth - 10) / 4;
  // Get piece size to determine offset
  const maxX = Math.max(...nextRotation.map((block) => block.x));
  const offset = 5 + (blockSize / 2) * (3 - maxX);

  ctx.clearRect(rightSidebarStart + 5, 50, blockSize * 4, blockSize * 4);
  ctx.fillStyle = nextPiece.shape.color;

  nextRotation.forEach((block) => {
    ctx.fillRect(
      rightSidebarStart + offset + blockSize * block.x,
      50 + blockSize * block.y,
      blockSize - 2,
      blockSize - 2
    );
  });
};

export const drawHold = () => {
  const blockSize = (sidebarWidth - 10) / 4;
  // Get piece size to determine offset
  const maxX = Math.max(...held!.shape.rotations[0].map((block) => block.x));
  const offset = 5 + (blockSize / 2) * (3 - maxX);

  ctx.clearRect(5, 50, blockSize * 4, blockSize * 4);
  ctx.fillStyle = held!.shape.color;

  held!.shape.rotations[0].forEach((block) => {
    ctx.fillRect(
      offset + blockSize * block.x,
      50 + blockSize * block.y,
      blockSize - 2,
      blockSize - 2
    );
  });
};

export const drawBoard = () => {
  // Clear board
  ctx.clearRect(padding, 0, width, height);

  // Add black outlines to boxes
  for (let w = 0; w < 10; w++) {
    for (let h = 0; h < 20; h++) {
      ctx.lineWidth = 1;
      ctx.strokeRect(
        w * (width / 10) + padding,
        h * (height / 20),
        width / 10,
        height / 20
      );
    }
  }

  // For each block in the board
  for (let row = 0; row < board.length; row++) {
    for (let column = 0; column < board[row].length; column++) {
      const tetromino = board[row][column];

      // If block occupied
      if (tetromino !== null) {
        ctx.fillStyle = tetromino;

        ctx.fillRect(
          column * (width / 10) + 1 + padding,
          row * (height / 20) + 1,
          width / 10 - 2,
          height / 20 - 2
        );
      }
    }
  }

  ctx.fillStyle = current.shape.color;
  // For each block in current
  current.shape.rotations[current.rotation % 4].forEach((block) => {
    ctx.fillRect(
      (block.x + current.position.x) * (width / 10) + 1 + padding,
      (block.y + current.position.y) * (height / 20) + 1,
      width / 10 - 2,
      height / 20 - 2
    );
  });

  ctx.globalAlpha = 0.5;
  const hardDropDistance = hardDropPos();
  // Draw transparent piece preview
  current.shape.rotations[current.rotation % 4].forEach((block) => {
    ctx.fillRect(
      (block.x + current.position.x) * (width / 10) + 1 + padding,
      (block.y + current.position.y + hardDropDistance) * (height / 20) + 1,
      width / 10 - 2,
      height / 20 - 2
    );
  });
  ctx.globalAlpha = 1;
};
