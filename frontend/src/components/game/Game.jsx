import React from "react";
import {useState, useEffect, useRef} from "react";

import "./Game.css";

import animationGif from "../../assets/animations.gif";
import ghostImage from "../../assets/ghost.png";

import * as Constants from "./Constants";


function Game() {

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let fps = Constants.fps;
        let wallColor = Constants.wallColor
        let oneBlockSize = Constants.oneBlockSize;
        let wallSpaceWidth = Constants.wallSpaceWidth;

        const DIRECTION_RIGHT = Constants.DIRECTION_RIGHT;
        const DIRECTION_UP = Constants.DIRECTION_UP;
        const DIRECTION_LEFT = Constants.DIRECTION_LEFT;
        const DIRECTION_BOTTOM = Constants.DIRECTION_BOTTOM;


        let wallOffset = Constants.wallOffset

        let wallInnerColor = Constants.wallInnerColor;
        
        // define the pacman maps
        // empty space = 0, wall = 1, food = 2,
        // 23 X 21 array
        let map = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
            [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
            [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
            [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
            [2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2],
            [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
            [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
            [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
            [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
            [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];

        let createRect = (x, y, width, height, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, width, height);
        };

                
        let update = () => {
            // ? Todo
        }

        
        let drawWalls = () => {
            for (let i = 0; i < map.length; i++) {
                for (let j = 0; j < map[0].length; j++) {
                    if (map[i][j] == 1) {
                        createRect(
                            j * oneBlockSize,
                            i * oneBlockSize,
                            oneBlockSize,
                            oneBlockSize,
                            wallColor
                        );

                        // account for wall on left
                        if (j > 0 && map[i][j - 1] == 1) {
                            createRect(
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

        let draw = () => {
            // ? Todo
            // clear the canvas with black color
            createRect(0, 0, canvas.width, canvas.height, "black");
            drawWalls(); 
        };

        let gameLoop = () => {
            update();
            draw();
        };

        const intervalId = setInterval(gameLoop, 1000 / Constants.fps);

        // Cleanup function to clear interval when component unmounts
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array means this effect runs once on mount



    return (    
        <>
            <canvas ref = {canvasRef} id="game_canvas" width="500" height="500" style={{ backgroundColor: "black" }}> </canvas>

            <div style={{display : "none"}}>

                <img src={animationGif} id = "animation" alt="" />
                <img src={ghostImage} id = "ghosts" alt="" />

            </div>
            
        </>
    )
}

export default Game;