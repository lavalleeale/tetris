import { controls, resetControls } from "./events";
import { pause } from "./globals";

let currentChanging: changing | null = null;

export const registerSettingsEvents = () => {
  let leftButton = document.getElementById("leftButton")!;
  let rightButton = document.getElementById("rightButton")!;
  let downButton = document.getElementById("downButton")!;
  let rotateButton = document.getElementById("rotateButton")!;
  let rotateBackButton = document.getElementById("rotateBackButton")!;
  let holdButton = document.getElementById("holdButton")!;
  let dropButton = document.getElementById("dropButton")!;
  let pauseButton = document.getElementById("pauseButton")!;
  let resetButton = document.getElementById("resetButton")!;
  let returnButton = document.getElementById("returnButton")!;

  leftButton.addEventListener("click", () => {
    leftButton.innerText = "Press Any Button";
    currentChanging = changing.left;
  });
  rightButton.addEventListener("click", () => {
    rightButton.innerText = "Press Any Button";
    currentChanging = changing.right;
  });
  downButton.addEventListener("click", () => {
    downButton.innerText = "Press Any Button";
    currentChanging = changing.down;
  });
  rotateButton.addEventListener("click", () => {
    rotateButton.innerText = "Press Any Button";
    currentChanging = changing.rotate;
  });
  rotateBackButton.addEventListener("click", () => {
    rotateBackButton.innerText = "Press Any Button";
    currentChanging = changing.rotateBack;
  });
  holdButton.addEventListener("click", () => {
    holdButton.innerText = "Press Any Button";
    currentChanging = changing.hold;
  });
  dropButton.addEventListener("click", () => {
    dropButton.innerText = "Press Any Button";
    currentChanging = changing.drop;
  });
  pauseButton.addEventListener("click", () => {
    pauseButton.innerText = "Press Any Button";
    currentChanging = changing.pause;
  });

  leftButton.innerText = userFacingKey(controls.left);
  rightButton.innerText = userFacingKey(controls.right);
  downButton.innerText = userFacingKey(controls.down);
  rotateButton.innerText = userFacingKey(controls.rotate);
  rotateBackButton.innerText = userFacingKey(controls.rotateBack);
  holdButton.innerText = userFacingKey(controls.hold);
  dropButton.innerText = userFacingKey(controls.drop);
  pauseButton.innerText = userFacingKey(controls.pause);

  document.addEventListener("keydown", (e) => {
    if (currentChanging === null) {
      return;
    }

    switch (currentChanging) {
      case changing.left:
        controls.left = e.code;
        leftButton.innerText = userFacingKey(e.code);
        break;
      case changing.right:
        controls.right = e.code;
        rightButton.innerText = userFacingKey(e.code);
        break;
      case changing.down:
        controls.down = e.code;
        downButton.innerText = userFacingKey(e.code);
        break;
      case changing.rotate:
        controls.rotate = e.code;
        rotateButton.innerText = userFacingKey(e.code);
        break;
      case changing.rotateBack:
        controls.rotateBack = e.code;
        rotateBackButton.innerText = userFacingKey(e.code);
        break;
      case changing.hold:
        controls.hold = e.code;
        holdButton.innerText = userFacingKey(e.code);
        break;
      case changing.drop:
        controls.drop = e.code;
        dropButton.innerText = userFacingKey(e.code);
        break;
      case changing.pause:
        controls.pause = e.code;
        pauseButton.innerText = userFacingKey(e.code);
        break;
    }

    localStorage.setItem("controls", JSON.stringify(controls));

    currentChanging = null;
  });

  resetButton.addEventListener("click", () => {
    resetControls();
    leftButton.innerText = userFacingKey(controls.left);
    rightButton.innerText = userFacingKey(controls.right);
    downButton.innerText = userFacingKey(controls.down);
    rotateButton.innerText = userFacingKey(controls.rotate);
    rotateBackButton.innerText = userFacingKey(controls.rotateBack);
    holdButton.innerText = userFacingKey(controls.hold);
    dropButton.innerText = userFacingKey(controls.drop);
    pauseButton.innerText = userFacingKey(controls.pause);
  });
  returnButton.addEventListener("click", () => {
    currentChanging = null;
    pause();
  });
};

const userFacingKey = (key: string) => {
  return key.replace("Key", "").replace("Arrow", "");
};

enum changing {
  left,
  right,
  down,
  rotate,
  rotateBack,
  hold,
  drop,
  pause,
}
