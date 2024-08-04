
import * as Constants from './Constants.js';

class Pacman {
    constructor(x,y,width,height,speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = Constants.DIRECTION_RIGHT;
    }

    moveProcess() {
        this.changeDirectionIfPossible();
        this.moveForward();
        
        if (this.checkCollision()) {
            this.moveBackwards();
        }


    }

    eat() {

    }

    moveBackwards() {
        switch(this.direction) {
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
        switch(this.direction) {
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
        let collisionThreshold = Constants.collisionThreshold;  

        if (
            map[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize + collisionThreshold)][
                parseInt(this.x / oneBlockSize)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize + collisionThreshold)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize + collisionThreshold)][
                parseInt(this.x / oneBlockSize + collisionThreshold)
            ] == 1
        ) {
            isCollided = true;
        }
        
        return isCollided;
    }


    checkGhostCollision() {

    }

    changeDirectionIfPossible() {


    }

    
    changeAnimation() {

    }


    draw() {

    }

    // this is to get the pacman's position in the array map
    getMapX() {
        return Math.floor(this.x / Constants.oneBlockSize);
    }

    // this is to get the pacman's position in the array map
    getMapY() {
        return Math.floor(this.y / Constants.oneBlockSize);
    }

    getMapXRightSide() {
        let mapX = parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize);
        return mapX;
    }

    getMapYRightSide() {
        let mapY = parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize);
        return mapY;
    }


}