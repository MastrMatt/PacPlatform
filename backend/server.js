// express is a CommonJS module, so we use require to import it
import express from "express";
import cors from "cors";

import { createServer } from "http";
import { Server } from "socket.io";
import {
  fps,
  map,
  oneBlockSize,
  ghostCount,
  ghostInitialLocations,
  ghostRange,
  pacManSpeed,
  DIRECTION_UP,
  DIRECTION_BOTTOM,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
} from "./pacman/Constants.js";

import { create4Pacmen, Pacman } from "./pacman/Pacman.js";
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

/**
 * This function initializes the game state for a number of players
 * @param {Array<string>} players - an array of player IDs
 * @returns {Object} the game state
 */
const gameStateInit = (players) => {
  let pacmen = create4Pacmen();
  let ghosts = createNewGhosts(ghostCount);

  // attach the playerId's to the pacmen
  let playerPacmen = {};
  for (let i = 0; i < players.length; i++) {
    playerPacmen[players[i]] = pacmen[i];
  }

  return {
    pacmen: playerPacmen,
    ghosts: ghosts,
    map: map.slice(),
  };
};

const gameRooms = {};
// socket is the connection to the client
io.on("connection", (socket) => {
  socket.on("createRoom", ({ clientID, roomID, numPlayers }) => {
    // ! if room is alraedy created, return
    if (gameRooms[roomID]) {
      return;
    }

    gameRooms[roomID] = {
      players: [],
      numPlayers: numPlayers,
      gameState: {},
    };

    socket.join(roomID);
    gameRooms[roomID].players.push(clientID);

    // if a single player game, start the game
    if (numPlayers == 1) {
      gameRooms[roomID].gameState = gameStateInit(gameRooms[roomID].players);

      // start the game
      io.to(roomID).emit(
        "allPlayersJoined",
        "All players have joined the room"
      );
    }
    console.log(gameRooms);
  });

  socket.on("joinRoom", ({ clientID, roomID }) => {
    // ! if already joined, return
    if (gameRooms[roomID].players.includes(clientID)) {
      return;
    }

    socket.join(roomID);
    gameRooms[roomID].players.push(clientID);

    // check if enough players have joined the room
    if (gameRooms[roomID].players.length == gameRooms[roomID].numPlayers) {
      console.log("all players have joined the room");

      // initialize the game state
      gameRooms[roomID].gameState = gameStateInit(gameRooms[roomID].players);

      io.to(roomID).emit(
        "allPlayersJoined",
        "All players have joined the room"
      );
    }

    console.log(gameRooms);
  });

  socket.on("keyDown", ({ roomID, clientID, direction }) => {
    // update the direction of the pacman
    if (direction == "up") {
      gameRooms[roomID].gameState.pacmen[clientID].nextDirection = DIRECTION_UP;
    } else if (direction == "down") {
      gameRooms[roomID].gameState.pacmen[clientID].nextDirection =
        DIRECTION_BOTTOM;
    } else if (direction == "left") {
      gameRooms[roomID].gameState.pacmen[clientID].nextDirection =
        DIRECTION_LEFT;
    } else if (direction == "right") {
      gameRooms[roomID].gameState.pacmen[clientID].nextDirection =
        DIRECTION_RIGHT;
    } else {
      console.log("Invalid direction received");
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    // remove the user from the room
  });
});

let serverGameLoop = () => {
  // loop through all rooms and check if all players have joined
  for (let roomID in gameRooms) {
    let gameRoom = gameRooms[roomID];

    if (gameRoom.players.length == gameRoom.numPlayers) {
      // update the game state

      // if game state is undefined, initialize the game state
      if (gameRoom.gameState == {}) {
        gameRoom.gameState = gameStateInit(gameRoom.players);
      } else {
        // ! update the game state
        update(gameRoom.gameState.pacmen, gameRoom.gameState.ghosts);
      }

      io.to(roomID).emit("gameUpdate", gameRoom.gameState);
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

// ! working on this now
let update = (pacmen, ghosts) => {
  for (let clientID in pacmen) {
    pacmen[clientID].moveProcess();
    pacmen[clientID].eat();
  }

  // for (let i = 0; i < ghosts.length; i++) {
  //   ghosts[i].moveProcess();
  // }

  // if (pacman.checkGhostCollision(ghosts)) {
  //   onGhostCollision();
  // }

  // if (pacman.score >= foodCount) {
  //   gameWinner();
  // }
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

let randomTargetsForGhosts = [
  { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
  { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
  { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
  {
    x: (map[0].length - 2) * oneBlockSize,
    y: (map.length - 2) * oneBlockSize,
  },
];

let createNewGhosts = (ghostCount, pacmen) => {
  let ghostLocations = ghostInitialLocations;

  let ghosts = [];
  for (let i = 0; i < ghostCount; i++) {
    let ghost = new Ghost(
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
      pacmen,
      randomTargetsForGhosts
    );
    ghosts.push(ghost);
  }

  return ghosts;
};

let gameLoopInterval = setInterval(serverGameLoop, 1000 / fps);
