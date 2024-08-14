import * as Constants from "./Constants.js";

export class Ghost {
  constructor(
    startX,
    startY,
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
    randomTargetsForGhosts
  ) {
    this.startX = startX;
    this.startY = startY;
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
    this.allowTargetPacmen = true;

    this.randomTargetIndex = parseInt(
      Math.random() * randomTargetsForGhosts.length
    );
    this.randomTargetsForGhosts = randomTargetsForGhosts;

    setInterval(() => {
      // want the ghosts to switch target every Constants.ghostSwitchTargetTime
      this.allowTargetPacmen = true;
      this.changeRandomDirection();
    }, Constants.ghostSwitchTargetTime);
  }

  changeRandomDirection() {
    this.randomTargetIndex += 1;
    this.randomTargetIndex %= this.randomTargetsForGhosts.length;
  }

  getPacInRange(pacmen) {
    // convert the pacmen (Object with keys representing the clientID) to an array of pacmen
    let pacmenArray = Object.values(pacmen);

    // randomly shuffle the array of pacmen using the Fisher-Yates algorithm, to ensure that the ghosts don't always target the same pacmen
    for (let i = pacmenArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pacmenArray[i], pacmenArray[j]] = [pacmenArray[j], pacmenArray[i]];
    }

    // check if any of the pacmen are in range
    for (let i = 0; i < pacmenArray.length; i++) {
      let xDistance = Math.abs(pacmenArray[i].getMapX() - this.getMapX());
      let yDistance = Math.abs(pacmenArray[i].getMapX() - this.getMapY());

      if (
        this.range >= Math.sqrt(xDistance * xDistance + yDistance * yDistance)
      ) {
        return pacmenArray[i];
      }
    }

    return null;
  }

  moveProcess(pacmen) {
    // check if target is random, always allow switch target if it is
    if (this.target == this.randomTargetsForGhosts[this.randomTargetIndex]) {
      this.allowTargetPacmen = true;
    }

    // try to switch to a pacmen if it is in range, else switch to a random target, disable the ability to switch target to a pacman for a while to stop flickering
    if (this.allowTargetPacmen) {
      this.allowTargetPacmen = false;
      let rangePac = this.getPacInRange(pacmen);
      if (rangePac) {
        this.target = rangePac;
      } else {
        this.target = this.randomTargetsForGhosts[this.randomTargetIndex];
      }
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

export function createNewGhosts(ghostCount) {
  let ghostLocations = Constants.ghostInitialLocations;
  let oneBlockSize = Constants.oneBlockSize;
  let pacManSpeed = Constants.pacManSpeed;
  let ghostRange = Constants.ghostRange;
  let map = Constants.map;
  let randomTargetsForGhosts = Constants.randomTargetsForGhosts;

  let ghosts = [];
  for (let i = 0; i < ghostCount; i++) {
    let ghost = new Ghost(
      9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
      10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
      9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
      10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
      oneBlockSize,
      oneBlockSize,
      pacManSpeed / 2,
      ghostLocations[i].x,
      ghostLocations[i].y,
      124,
      116,
      ghostRange + i,
      randomTargetsForGhosts
    );
    ghosts.push(ghost);
  }

  return ghosts;
}
