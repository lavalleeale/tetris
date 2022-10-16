export const defaultControls = {
  left: "KeyA",
  right: "KeyD",
  down: "KeyS",
  rotate: "KeyW",
  rotateBack: "KeyE",
  hold: "KeyQ",
  drop: "Space",
  pause: "Escape",
};

export let controls: typeof defaultControls = localStorage.getItem("controls")
  ? JSON.parse(localStorage.getItem("controls")!)
  : { ...defaultControls };

export const resetControls = () => {
  controls = { ...defaultControls };
  localStorage.setItem("controls", JSON.stringify(controls));
};

export const pressedKeys: { [key: string]: DOMHighResTimeStamp } = {};

export const registerEvents = () => {
  document.addEventListener("keydown", (e) => {
    pressedKeys[e.code] = 0;
  });
  document.addEventListener("keyup", (e) => {
    delete pressedKeys[e.code];
  });
};
