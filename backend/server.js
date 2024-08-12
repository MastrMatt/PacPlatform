// express is a CommonJS module, so we use require to import it
import express from "express";
import cors from "cors";

import { createServer } from "http";
import { Server } from "socket.io";
import { fps, map, oneBlockSize } from "./pacman/Constants.js";

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

const gameRooms = {};
// socket is the connection to the client
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", ({ roomID, numPlayers }) => {
    if (gameRooms[roomID] == undefined) {
      gameRooms[roomID] = {
        players: [],
      };
    }

    gameRooms[roomID].players.push(socket.id);
    socket.join(roomID);

    console.log("Player joined room: " + roomID);
    console.log("Players to join: " + numPlayers);
    io.to("room1").emit("message", "Room message from server");
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

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

// * TODO, move updates to the backend and use websockets to update the frontend
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

let serverGameLoop = () => {
  console.log("Server game loop");
  // io.to("room1").emit("gameState", gameState);
};

let gameLoopInterval = setInterval(serverGameLoop, 1000 / fps);
