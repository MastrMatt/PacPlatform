
import * as Constants from './Constants.js';

export default class Pacman {
    constructor(x,y,width,height,speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = Constants.DIRECTION_RIGHT;
        this.curFrame = 1;
        this.frameCount = 7;

        // this is to handle the pacman animation frames
        setInterval(() => {
            this.changeAnimation();
        }
        , 1000 / Constants.pacManFPS);

    }

    moveProcess() {
        this.changeDirectionIfPossible();
        this.moveForward();
        
        if (this.checkCollisions()) {
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
        this.currentFrame =
            this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    }



    // !Fix draw
    draw() {

        // fetch the canvas context
        const canvasContext = document.getElementById("gameCanvas").getContext("2d");
        const pacmanFrames = document.getElementById("animation");
        const ghostFrames = document.getElementById("ghosts");

        let oneBlockSize = Constants.oneBlockSize;


        // save the canvas context, useful to restore the canvas context later
        canvasContext.save();

        // translate the canvas context to the center of the pacman
        canvasContext.translate(
            this.x + oneBlockSize / 2,
            this.y + oneBlockSize / 2
        );

        // convert the angle to radians first
        canvasContext.rotate((this.direction * 90 * Math.PI) / 180);
        // translate the canvas context back to the top left corner of the pacman
        canvasContext.translate(
            -this.x - oneBlockSize / 2,
            -this.y - oneBlockSize / 2
        );
        // draw the pacman
        canvasContext.drawImage(
            pacmanFrames,
            (this.currentFrame - 1) * oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            this.x,
            this.y,
            this.width,
            this.height
        );
        // restore the canvas context
        canvasContext.restore();
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