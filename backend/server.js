// express is a CommonJS module, so we use require to import it
import express from "express";
import cors from "cors";

import { createServer } from "http";
import { Server } from "socket.io";
import { fps, map, oneBlockSize } from "./pacman/Constants.js";

import Pacman from "./pacman/Pacman.js";
import Ghost from "./pacman/Ghost.js";

const app = express();

const corsOptions = {
  origin: "*",
};

// add the cors middleware
app.use(cors(corsOptions));

// create a http server, attach the express app to it and create a socket.io server on the same http server, also setup cors options
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: corsOptions,
});

const PORT = process.env.PORT || 42069;

app.get("/", (req, res) => {
  // res.json({ message: "Hello from server!" });
});

app.post("/send", (req, res) => {
  // send a message to the client
  // res.json({ message: "Message sent" });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const gameStateInit = () => {};

const gameRooms = [];
// socket is the connection to the client
io.on("connection", (socket) => {
  socket.on("createRoom", ({ ID, roomID, numPlayers }) => {
    gameRooms[roomID] = {
      players: [],
      numPlayers: numPlayers,
      gameState: {},
    };

    gameRooms[roomID].players.push(ID);
    socket.join(roomID);

    // if a single player game, start the game
    if (numPlayers == 1) {
      gameRooms[roomID].gameState = gameStateInit();

      // start the game
      io.to(roomID).emit(
        "allPlayersJoined",
        "All players have joined the room"
      );
    }
    console.log(gameRooms);
  });

  socket.on("joinRoom", ({ ID, roomID }) => {
    gameRooms[roomID].players.push(ID);
    socket.join(roomID);

    // check if enough players have joined the room
    if (gameRooms[roomID].players.length == gameRooms[roomID].numPlayers) {
      console.log("all players have joined the room");

      // initialize the game state
      gameRooms[roomID].gameState = gameStateInit();

      io.to(roomID).emit(
        "allPlayersJoined",
        "All players have joined the room"
      );
    }

    console.log(gameRooms);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

let serverGameLoop = () => {
  // loop through all rooms and check if all players have joined
  for (let room in gameRooms) {
    if (gameRooms[room].players.length == gameRooms[room].numPlayers) {
      // start the game
      io.to(room).emit("gameUpdate", "Game is running");
    }
  }
};

/*  how the Multiplayer version of the game will work
  1. create a socket connection to the server
  3. client listens for game state
  5. client emits keypresses to server
  6. server listens for keypresses
  8. server emits game state to all clients in the room on some interval
  */

// each pacman per client: {x: number, y: number, direction: string, score: number, lives: number}, update score on food, update lives on ghost collision, update direction on keypress, always update x and y

// ghosts: [{x: number, y: number}, ...]

let pacman;
let foodCount;

let ghostCount = 4;
let ghosts = [];
let ghostLocations = [
  { x: 0, y: 0 },
  { x: 176, y: 0 },
  { x: 0, y: 121 },
  { x: 176, y: 121 },
];

let randomTargetsForGhosts = [
  { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
  { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
  { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
  {
    x: (map[0].length - 2) * oneBlockSize,
    y: (map.length - 2) * oneBlockSize,
  },
];

let update = () => {
  pacman.moveProcess();
  pacman.eat();

  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].moveProcess();
  }

  if (pacman.checkGhostCollision(ghosts)) {
    onGhostCollision();
  }

  if (pacman.score >= foodCount) {
    gameWinner();
  }
};

let gameWinner = () => {
  clearInterval(gameLoopInterval);
  drawWinner();
};

let onGhostCollision = () => {
  resetPacmanAndGhosts();
};

let gameOver = () => {
  clearInterval(gameLoopInterval);
  drawGameOver();
};

let resetPacmanAndGhosts = () => {
  pacman.reduceLives(1);

  if (pacman.lives == 0) {
    gameOver();
  }

  pacman.x = oneBlockSize;
  pacman.y = oneBlockSize;
  createNewGhosts();
};

let createNewPacman = () => {
  return new Pacman(
    oneBlockSize,
    oneBlockSize,
    Constants.pacManWidth,
    Constants.pacManHeight,
    Constants.pacManSpeed
  );
};

let createNewGhosts = () => {
  ghosts = [];
  for (let i = 0; i < ghostCount; i++) {
    let ghost = new Ghost(
      9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
      10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
      oneBlockSize,
      oneBlockSize,
      pacman.speed / 2,
      ghostLocations[i].x,
      ghostLocations[i].y,
      124,
      116,
      Constants.ghostRange + i,
      pacman,
      randomTargetsForGhosts
    );
    ghosts.push(ghost);
  }
};

let gameLoopInterval = setInterval(serverGameLoop, 1000 / fps);
