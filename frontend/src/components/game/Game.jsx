import React from "react";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

import { LoaderCircle } from "lucide-react";
import animationGif from "../../assets/animations.gif";
import ghostImage from "../../assets/ghost.png";

import * as Constants from "./Constants";

import { BACKEND_URL } from "../../config/Constants";

function Game({ gameType, roomID, numPlayers }) {
  const [loadingGame, setLoadingGame] = useState(true);

  const [socket] = useState(() => io(BACKEND_URL));
  const clientID = useRef("clientID" + Date.now());

  const canvasRef = useRef(null);
  const pacmanFramesRef = useRef(null);
  const ghostFramesRef = useRef(null);

  useEffect(() => {
    let wallColor = Constants.wallColor;
    let oneBlockSize = Constants.oneBlockSize;
    let wallSpaceWidth = Constants.wallSpaceWidth;
    let wallOffset = Constants.wallOffset;
    let wallInnerColor = Constants.wallInnerColor;

    //  ! the map with the food will be passed in from the backend, remove extra css from project

    const DIRECTION_RIGHT = Constants.DIRECTION_RIGHT;
    const DIRECTION_UP = Constants.DIRECTION_UP;
    const DIRECTION_LEFT = Constants.DIRECTION_LEFT;
    const DIRECTION_BOTTOM = Constants.DIRECTION_BOTTOM;

    if (gameType === "create") {
      socket.emit("createRoom", {
        clientID: clientID.current,
        roomID: roomID,
        numPlayers: numPlayers,
      });
    } else if (gameType === "join") {
      socket.emit("joinRoom", {
        clientID: clientID.current,
        roomID: roomID,
      });
    }

    socket.on("allPlayersJoined", (message) => {
      // start the game
      setLoadingGame(false);
    });

    socket.on("gameUpdate", (gameState) => {
      console.log(gameState);
      draw(gameState);
    });

    socket.on("gameOver", (message) => {
      console.log(message);
    });

    let createRect = (ctx, x, y, width, height, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
    };

    let drawWinner = () => {
      ctx.font = "20px PacFont";
      ctx.fillStyle = "white";
      ctx.fillText("You Win!", 130, 250);
    };

    let drawGameOver = () => {
      ctx.font = "20px PacFont";
      ctx.fillStyle = "white";
      ctx.fillText("Game Over!", 130, 250);
    };

    /**
     * Wherever there is a 1 in the map, draws a wall on the canvas
     *
     * @param {Array<String>} map - a 2D array of strings
     */
    let drawWalls = (ctx, map) => {
      for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
          if (map[i][j] == 1) {
            createRect(
              ctx,
              j * oneBlockSize,
              i * oneBlockSize,
              oneBlockSize,
              oneBlockSize,
              wallColor
            );

            // account for wall on left
            if (j > 0 && map[i][j - 1] == 1) {
              createRect(
                ctx,
                j * oneBlockSize,
                i * oneBlockSize + wallOffset,
                wallSpaceWidth + wallOffset,
                wallSpaceWidth,
                wallInnerColor
              );
            }

            // account for wall on right
            if (j < map[0].length - 1 && map[i][j + 1] == 1) {
              createRect(
                ctx,
                j * oneBlockSize + wallOffset,
                i * oneBlockSize + wallOffset,
                wallSpaceWidth + wallOffset,
                wallSpaceWidth,
                wallInnerColor
              );
            }

            // account for wall on top
            if (i > 0 && map[i - 1][j] == 1) {
              createRect(
                ctx,
                j * oneBlockSize + wallOffset,
                i * oneBlockSize,
                wallSpaceWidth,
                wallSpaceWidth + wallOffset,
                wallInnerColor
              );
            }

            // account for wall on bottom
            if (i < map.length - 1 && map[i + 1][j] == 1) {
              createRect(
                ctx,
                j * oneBlockSize + wallOffset,
                i * oneBlockSize + wallOffset,
                wallSpaceWidth,
                wallSpaceWidth + wallOffset,
                wallInnerColor
              );
            }
          }
        }
      }
    };

    /**
     * Wherever there is a 2 in the map, draws a food on the canvas
     * @param {*} ctx - canvas context
     * @param {Array<String>} map - a 2D array of strings
     */
    let drawFoods = (ctx, map) => {
      for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
          if (map[i][j] == 2) {
            createRect(
              ctx,
              j * oneBlockSize + oneBlockSize / 3,
              i * oneBlockSize + oneBlockSize / 3,
              oneBlockSize / 3,
              oneBlockSize / 3,
              "#FEB897"
            );
          }
        }
      }
    };

    /**
     * Draws the score of the pacman on the canvas
     * @param {*} ctx - canvas context
     * @param {Pacman} pacman - the pacman object
     */
    let drawScore = (ctx, pacman, map) => {
      ctx.font = "18px PacFont";
      ctx.fillStyle = "white";
      ctx.fillText(
        "SCORE: " + pacman.score,
        20,
        oneBlockSize * (map.length + 1)
      );
    };

    let drawGhost = (ctx, ghostFrames, ghost) => {
      ctx.save();
      ctx.drawImage(
        ghostFrames,
        ghost.imageX,
        ghost.imageY,
        ghost.imageWidth,
        ghost.imageHeight,
        ghost.x,
        ghost.y,
        ghost.width,
        ghost.height
      );
      ctx.restore();
    };

    /**
     * Draws the ghosts on the canvas
     *
     * @param  {Array<Ghost>} ghosts - an array of ghosts
     */
    let drawGhosts = (ctx, ghostFrames, ghosts) => {
      for (let i = 0; i < ghosts.length; i++) {
        drawGhost(ctx, ghostFrames, ghosts[i]);
      }
    };

    /**
     * Draws the lives of the pacman on the canvas
     *
     * @param {*} ctx - canvas context
     * @param {Pacman} pacman - the pacman object
     */
    let drawLives = (ctx, pacman, map, pacmanFrames) => {
      let lives = pacman.lives;

      ctx.font = "18px PacFont";
      ctx.fillStyle = "white";
      ctx.fillText("Lives: ", 220, oneBlockSize * (map.length + 1));

      for (let i = 0; i < lives; i++) {
        ctx.drawImage(
          pacmanFrames,
          2 * oneBlockSize,
          0,
          oneBlockSize,
          oneBlockSize,
          340 + i * oneBlockSize,
          oneBlockSize * map.length + 2,
          oneBlockSize,
          oneBlockSize
        );
      }
    };

    let drawPacman = (ctx, pacmanFrames, pacman) => {
      // save the canvas context, useful to restore the canvas context later
      ctx.save();

      // translate the canvas context to the center of the pacman
      ctx.translate(pacman.x + pacman.width / 2, pacman.y + pacman.height / 2);

      // convert the angle to radians first
      ctx.rotate((pacman.direction * 90 * Math.PI) / 180);
      // translate the canvas context back to the top left corner of the pacman
      ctx.translate(
        -pacman.x - pacman.width / 2,
        -pacman.y - pacman.height / 2
      );
      // draw the pacman
      ctx.drawImage(
        pacmanFrames,
        (pacman.currentFrame - 1) * pacman.width,
        0,
        pacman.width,
        pacman.height,
        pacman.x,
        pacman.y,
        pacman.width,
        pacman.height
      );
      // restore the canvas context
      ctx.restore();
    };

    /**
     *
     * @param {*} ctx - canvas context
     * @param {*} pacmanFrames - the image of the pacman
     * @param {Array<Pacman>} pacmen - an object containing all the pacmen
     */
    let drawPacmen = (ctx, pacmanFrames, pacmen) => {
      for (let clientID in pacmen) {
        // turn the generic object from socket.io into a Pacman object
        drawPacman(ctx, pacmanFrames, pacmen[clientID]);
      }
    };

    /**
     * Draws the game on the canvas
     * @param {*} gameState - the game state object
     * @param {Array<Pacman>} gameState.pacmen - an object
     *
     */
    let draw = (gameState) => {
      let pacmen = gameState.pacmen;
      let myPacman = pacmen[clientID.current];

      let ghosts = gameState.ghosts;
      let map = gameState.map;

      let canvas = canvasRef.current;
      let ctx = canvas.getContext("2d");
      let pacmanFrames = pacmanFramesRef.current;
      let ghostFrames = ghostFramesRef.current;

      // clear the canvas with black color
      createRect(ctx, 0, 0, canvas.width, canvas.height, "black");

      drawWalls(ctx, map);
      drawFoods(ctx, map);
      drawPacmen(ctx, pacmanFrames, pacmen);
      drawGhosts(ctx, ghostFrames, ghosts);

      drawScore(ctx, myPacman, map);
      drawLives(ctx, myPacman, map, pacmanFrames);
    };

    const handleKeyDown = (e) => {
      let key = e.key;
      let direction = null;

      if (key == "ArrowRight" || key == "d") {
        direction = "right";
      } else if (key == "ArrowLeft" || key == "a") {
        direction = "left";
      } else if (key == "ArrowUp" || key == "w") {
        direction = "up";
      } else if (key == "ArrowDown" || key == "s") {
        direction = "down";
      }

      if (direction) {
        // send the key to the server
        socket.emit("keyDown", {
          roomID: roomID,
          clientID: clientID.current,
          direction: direction,
        });
      }
    };

    // add an event listener to the window to listen for keydown events
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function to clear interval and disconnect socket when component unmounts
    return () => {
      // remove event listerners here
      socket?.off("allPlayersJoined");
      socket?.off("gameUpdate");
      socket?.off("gameOver");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return loadingGame ? (
    <div className="flex flex-col gap-4 justify-center items-center min-h-screen">
      <h1 className="text-3xl font-bold pb-10">Room ID: {roomID} </h1>
      <h1 className="text-3xl font-bold">Waiting for all players ...</h1>
      <LoaderCircle className="w-10 h-10 animate-spin" />
    </div>
  ) : (
    <div className="gameContainer flex items justify-center bg-black w-full h-screen">
      <canvas
        ref={canvasRef}
        className="bg-black basis-2/4 flex-grow-0 flex-shrink-0"
        width="500"
        height="500"
      ></canvas>

      <div style={{ display: "none" }}>
        <img src={animationGif} ref={pacmanFramesRef} alt="" />
        <img src={ghostImage} ref={ghostFramesRef} alt="" />
      </div>
    </div>
  );
}

export default Game;
