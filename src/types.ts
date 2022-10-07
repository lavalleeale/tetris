export enum moveResponse {
  moved,
  placed,
  failed,
  gameOver,
}

export type point = { x: number; y: number };
export type shape = {
  rotations: point[][];
  color: string;
  startingPos: point;
};
