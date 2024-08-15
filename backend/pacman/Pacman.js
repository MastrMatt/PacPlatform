import * as Constants from "./Constants.js";

class Pacman {
  constructor(
    startX,
    startY,
    x,
    y,
    width,
    height,
    speed,
    direction,
    nextDirection
  ) {
    this.startX = startX;
    this.startY = startY;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = direction;
    this.nextDirection = nextDirection;
    this.currentFrame = 1;
    this.frameCount = 7;
    this.score = 0;
    this.lives = 3;

    // this is to handle the pacman animation frames
    setInterval(() => {
      this.changeAnimation();
    }, 1000 / Constants.pacManFPS);
  }

  moveProcess() {
    this.changeDirectionIfPossible();
    this.moveForward();

    if (this.checkCollisions()) {
      this.moveBackwards();
    }
  }

  moveBackwards() {
    switch (this.direction) {
      case Constants.DIRECTION_RIGHT:
        this.x -= this.speed;
        break;
      case Constants.DIRECTION_LEFT:
        this.x += this.speed;
        break;
      case Constants.DIRECTION_UP:
        this.y += this.speed;
        break;
      case Constants.DIRECTION_BOTTOM:
        this.y -= this.speed;
        break;
    }
  }

  moveForward() {
    switch (this.direction) {
      case Constants.DIRECTION_RIGHT:
        this.x += this.speed;
        break;
      case Constants.DIRECTION_LEFT:
        this.x -= this.speed;
        break;
      case Constants.DIRECTION_UP:
        this.y -= this.speed;
        break;
      case Constants.DIRECTION_BOTTOM:
        this.y += this.speed;
        break;
    }
  }

  checkCollisions() {
    let isCollided = false;
    let collisionThreshold = 1;

    let map = Constants.map;
    let oneBlockSize = Constants.oneBlockSize;

    if (
      map[this.getMapY()][this.getMapX()] == 1 ||
      map[this.getMapYBottomSide()][this.getMapX()] == 1 ||
      map[this.getMapY()][this.getMapXRightSide()] == 1 ||
      map[this.getMapYBottomSide()][this.getMapXRightSide()] == 1
    ) {
      isCollided = true;
    }

    return isCollided;
  }

  checkGhostCollision(ghosts) {
    for (let i = 0; i < ghosts.length; i++) {
      let ghost = ghosts[i];
      if (
        ghost.getMapX() == this.getMapX() &&
        ghost.getMapY() == this.getMapY()
      ) {
        return true;
      }
    }
    return false;
  }

  getMapX() {
    let oneBlockSize = Constants.oneBlockSize;
    let mapX = parseInt(this.x / oneBlockSize);
    return mapX;
  }

  getMapY() {
    let oneBlockSize = Constants.oneBlockSize;
    let mapY = parseInt(this.y / oneBlockSize);
    return mapY;
  }

  getMapXRightSide() {
    let oneBlockSize = Constants.oneBlockSize;
    let mapX = parseInt((this.x * 0.99999 + oneBlockSize) / oneBlockSize);
    return mapX;
  }

  getMapYBottomSide() {
    let oneBlockSize = Constants.oneBlockSize;
    let mapY = parseInt((this.y * 0.99999 + oneBlockSize) / oneBlockSize);
    return mapY;
  }

  changeDirectionIfPossible() {
    if (this.direction == this.nextDirection) return;
    let tempDirection = this.direction;
    this.direction = this.nextDirection;
    this.moveForward();
    if (this.checkCollisions()) {
      this.moveBackwards();
      this.direction = tempDirection;
    } else {
      this.moveBackwards();
    }
  }

  changeAnimation() {
    this.currentFrame =
      this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
  }

  eat(map) {
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[0].length; j++) {
        if (map[i][j] == 2 && this.getMapX() == j && this.getMapY() == i) {
          map[i][j] = 3;
          this.score++;
        }
      }
    }
  }

  reduceLives(reduceNum) {
    this.lives -= reduceNum;
  }

  resetPosition() {}
}

/**
 * This function creates 4 pacmans in the corners of the 2-dimensional map array
 *
 * @returns {Array<Pacman>} an array of 4 pacmans
 */

function create4Pacmen() {
  let pacmans = [];
  let map = Constants.map;

  // want to create a pacman for each corner of the map
  let oneBlockSize = Constants.oneBlockSize;
  let width = oneBlockSize;
  let height = oneBlockSize;
  let speed = Constants.pacManSpeed;

  let allX = [oneBlockSize, oneBlockSize * (map[0].length - 2)];
  let allY = [oneBlockSize, oneBlockSize * (map.length - 2)];
  let direction1 = Constants.DIRECTION_RIGHT;
  let direction2 = Constants.DIRECTION_LEFT;

  for (let i of allY) {
    for (let j of allX) {
      let direction;
      if (j == oneBlockSize) {
        direction = Constants.DIRECTION_RIGHT;
      } else {
        direction = Constants.DIRECTION_LEFT;
      }

      pacmans.push(
        new Pacman(j, i, j, i, width, height, speed, direction, direction)
      );
    }
  }

  return pacmans;
}

export { Pacman, create4Pacmen };
