import { drawBoard, setup } from "./drawing";
import { controls, pressedKeys, registerEvents } from "./events";
import { lastMove, pause, paused, running, setLastMove } from "./globals";
import { hold } from "./helpers";
import { move, rotate } from "./movement";
import { registerSettingsEvents } from "./settings";
import { moveResponse } from "./types";

let dropTime = 1000;

const main = (time: DOMHighResTimeStamp) => {
  if (running && !paused) {
    Object.values(controls).forEach((key) => {
      if (pressedKeys[key] < time) {
        if (pressedKeys[key] === 0) {
          pressedKeys[key] = time + 170;
        } else {
          pressedKeys[key] = time + 50;
        }

        switch (key) {
          case controls.left:
            move(-1, 0);
            break;
          case controls.right:
            move(1, 0);
            break;
          case controls.down:
            setLastMove();
            move(0, 1);
            break;
          case controls.rotate:
            rotate();
            break;
          case controls.rotateBack:
            rotate();
            rotate();
            rotate();
            break;
          case controls.drop:
            setLastMove();
            while (move(0, 1) !== moveResponse.placed) {}
            break;
          case controls.hold:
            hold();
            break;
          case controls.pause:
            pause();
            break;
        }
      }
    });
    if (time > lastMove + dropTime && !paused) {
      move(0, 1);
      setLastMove();
    }

    drawBoard();
  }
  window.requestAnimationFrame(main);
};

setup();
drawBoard();
registerEvents();
registerSettingsEvents();
window.requestAnimationFrame(main);
