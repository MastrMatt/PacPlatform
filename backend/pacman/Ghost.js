import * as Constants from "./Constants.js";

export default class Ghost {
  constructor(
    x,
    y,
    width,
    height,
    speed,
    imageX,
    imageY,
    imageWidth,
    imageHeight,
    range,
    pacman,
    randomTargetsForGhosts
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = Constants.DIRECTION_RIGHT;
    this.imageX = imageX;
    this.imageY = imageY;
    this.imageHeight = imageHeight;
    this.imageWidth = imageWidth;
    this.range = range;

    this.pacman = pacman;
    this.randomTargetIndex = parseInt(
      Math.random() * randomTargetsForGhosts.length
    );
    this.randomTargetsForGhosts = randomTargetsForGhosts;

    setInterval(() => {
      this.changeRandomDirection();
    }, Constants.ghostSwitchTargetTime);
  }

  changeRandomDirection() {
    this.randomTargetIndex += 1;
    this.randomTargetIndex %= this.randomTargetsForGhosts.length;
    console.log(this.randomTargetIndex);
  }

  draw() {
    // / fetch the canvas context
    const canvasContext = document
      .getElementById("gameCanvas")
      .getContext("2d");
    const ghostFrames = document.getElementById("ghosts");

    canvasContext.save();
    canvasContext.drawImage(
      ghostFrames,
      this.imageX,
      this.imageY,
      this.imageWidth,
      this.imageHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
    canvasContext.restore();
  }

  isInRange() {
    let xDistance = Math.abs(this.pacman.getMapX() - this.getMapX());
    let yDistance = Math.abs(this.pacman.getMapY() - this.getMapY());
    if (
      this.range >= Math.sqrt(xDistance * xDistance + yDistance * yDistance)
    ) {
      return true;
    }
    return false;
  }

  moveProcess() {
    if (this.isInRange()) {
      this.target = this.pacman;
    } else {
      this.target = this.randomTargetsForGhosts[this.randomTargetIndex];
    }
    this.changeDirectionIfPossible();
    this.moveForward();
    if (this.checkCollisions()) {
      this.moveBackwards();
      return;
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

  changeDirectionIfPossible() {
    let map = Constants.map;
    let oneBlockSize = Constants.oneBlockSize;
    let tempDirection = this.direction;
    this.direction = this.calculateNewDirection(
      map,
      parseInt(this.target.x / oneBlockSize),
      parseInt(this.target.y / oneBlockSize)
    );
    if (typeof this.direction == "undefined") {
      this.direction = tempDirection;
      return;
    }
    if (
      this.getMapY() != this.getMapYBottomSide() &&
      (this.direction == Constants.DIRECTION_LEFT ||
        this.direction == Constants.DIRECTION_RIGHT)
    ) {
      this.direction = Constants.DIRECTION_UP;
    }
    if (
      this.getMapX() != this.getMapXRightSide() &&
      this.direction == Constants.DIRECTION_UP
    ) {
      this.direction = Constants.DIRECTION_LEFT;
    }
    this.moveForward();
    if (this.checkCollisions()) {
      this.moveBackwards();
      this.direction = tempDirection;
    } else {
      this.moveBackwards();
    }
  }

  // uses Djikstra's algorithm to find the shortest path to the target, in this example, since all edges have a length of one, this is essentially BFS(Breadth First Search) with a queue
  calculateNewDirection(map, destX, destY) {
    let mp = [];
    // create a copy of the map
    for (let i = 0; i < map.length; i++) {
      // slice so that we don't change the original map
      mp[i] = map[i].slice();
    }

    let queue = [
      {
        x: this.getMapX(),
        y: this.getMapY(),
        rightX: this.getMapXRightSide(),
        rightY: this.getMapYBottomSide(),
        moves: [],
      },
    ];
    while (queue.length > 0) {
      let poped = queue.shift();
      if (poped.x == destX && poped.y == destY) {
        // return first move, don't need the whole path here
        return poped.moves[0];
      } else {
        // mark as visited
        mp[poped.y][poped.x] = 1;

        // add neighbors to the queue, note in Regular Djikstra's algorithm, we would need to calculate the distance to the neighbors and push accordingly, but since all edges have a length of one, we don't need to do that
        let neighborList = this.addNeighbors(poped, mp);
        for (let i = 0; i < neighborList.length; i++) {
          queue.push(neighborList[i]);
        }
      }
    }

    // if none, default to up
    return Constants.DIRECTION_BOTTOM;
  }

  // helper function for Djikstra's algorithm, thuis function keeps an array of all possible moves and updates the node with the moves(how it remembers the path)
  addNeighbors(poped, mp) {
    let queue = [];
    let numOfRows = mp.length;
    let numOfColumns = mp[0].length;

    if (
      poped.x - 1 >= 0 &&
      poped.x - 1 < numOfRows &&
      mp[poped.y][poped.x - 1] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(Constants.DIRECTION_LEFT);
      queue.push({ x: poped.x - 1, y: poped.y, moves: tempMoves });
    }
    if (
      poped.x + 1 >= 0 &&
      poped.x + 1 < numOfRows &&
      mp[poped.y][poped.x + 1] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(Constants.DIRECTION_RIGHT);
      queue.push({ x: poped.x + 1, y: poped.y, moves: tempMoves });
    }
    if (
      poped.y - 1 >= 0 &&
      poped.y - 1 < numOfColumns &&
      mp[poped.y - 1][poped.x] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(Constants.DIRECTION_UP);
      queue.push({ x: poped.x, y: poped.y - 1, moves: tempMoves });
    }
    if (
      poped.y + 1 >= 0 &&
      poped.y + 1 < numOfColumns &&
      mp[poped.y + 1][poped.x] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(Constants.DIRECTION_BOTTOM);
      queue.push({ x: poped.x, y: poped.y + 1, moves: tempMoves });
    }
    return queue;
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
}
