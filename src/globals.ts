import { generateBag, tetromino } from "./helpers";

export const canvas = document.getElementById("canvas") as HTMLCanvasElement;
export const padding = canvas.width / 6;
export const width = canvas.width - padding * 2;
export const height = canvas.height;
export const sidebarWidth = padding - 10;
export const rightSidebarStart = padding + width + 9;
export const ctx = canvas.getContext("2d")!;

export let board: (string | null)[][] = Array(20)
  .fill(null)
  .map(() => Array(10).fill(null));
export let next = generateBag();
export let current: tetromino = next.pop()!;
export let held: tetromino | null = null;
export let cleared = 0;
export const incrementCleared = () => {
  cleared++;
};

export const setBoard = (newBoard: typeof board) => {
  board = newBoard;
};
export const setCurrent = (newCurrent: typeof current) => {
  current = newCurrent;
};
export const setHeld = (newHeld: typeof held) => {
  held = newHeld;
};
