// file to define constants for the game

export const DIRECTION_RIGHT = 4;
export const DIRECTION_UP = 3;
export const DIRECTION_LEFT = 2;
export const DIRECTION_BOTTOM = 1;

// fps = frame per second, how many times the game will update/draw in a second
export const fps = 60;

// wallColor = color of the walls
export const wallColor = "#342DCA";

// one block size, the size of the pacman and the walls in pixels
export const oneBlockSize = 20;
export const wallSpaceWidth = oneBlockSize / 1.5;
export const wallOffset = (oneBlockSize - wallSpaceWidth) / 2 + 1;
export const wallInnerColor = "black";
export const collisionThreshold = 1;

export const pacManFPS = 10;
export const pacManHeight = oneBlockSize;
export const pacManWidth = oneBlockSize;

// 1/5 of the block size per frame
export const pacManSpeed = oneBlockSize/5;