// express is a CommonJS module, so we use require to import it
import express from "express";
import cors from "cors";

import { createServer } from "http";
import { Server } from "socket.io";
import {
  fps,
  map,
  ghostCount,
  oneBlockSize,
  DIRECTION_UP,
  DIRECTION_BOTTOM,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
} from "./pacman/Constants.js";

import { create4Pacmen, Pacman } from "./pacman/Pacman.js";
import { createNewGhosts, Ghost } from "./pacman/Ghost.js";

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
    elimPacmen: {},
    ghosts: ghosts,
    map: map.slice(),
  };
};

const gameRooms = {};
// socket is the connection to the client
io.on("connection", (socket) => {
  socket.on("createRoom", ({ clientID, roomID, numPlayers }) => {
    //  if room is already created, return
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
    //  if already joined, return
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
    // check if client has been eliminated
    if (!gameRooms[roomID].gameState.pacmen[clientID]) {
      return;
    }
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
        update(roomID, gameRoom.gameState);
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

let resetPacman = (pacman) => {
  pacman.reduceLives(1);

  pacman.x = pacman.startX;
  pacman.y = pacman.startY;
};

let resetGhosts = (ghosts) => {
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].x = ghosts[i].startX;
    ghosts[i].y = ghosts[i].startY;
  }
};

let onGhostCollision = (pacman, ghosts) => {
  resetPacman(pacman);
  resetGhosts(ghosts);
};

let handlePacElim = (roomID, clientID) => {
  // remove the player from the game state and add to elimPacmen, delete operator removes a key-value pair from an object
  gameRooms[roomID].gameState.elimPacmen[clientID] =
    gameRooms[roomID].gameState.pacmen[clientID];
  delete gameRooms[roomID].gameState.pacmen[clientID];

  io.to(roomID).emit("pacmanElim", clientID);
};

let handleGameOver = (roomID, gameState) => {
  // delete the room from the gameRooms object
  delete gameRooms[roomID];

  // ! perforn any backend logic here related to game over, like updating the database for the scores
  // ! NOTE: you have acess to the gameState object here
};

let update = (roomID, gameState) => {
  let pacmen = gameState.pacmen;
  let ghosts = gameState.ghosts;
  let map = gameState.map;

  // update the pacmen
  for (let clientID in pacmen) {
    pacmen[clientID].moveProcess();
    pacmen[clientID].eat();
  }

  // update the ghosts
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].moveProcess(pacmen);
  }

  // check for pacmen collisions with ghosts
  for (let clientID in pacmen) {
    if (pacmen[clientID].checkGhostCollision(ghosts)) {
      onGhostCollision(pacmen[clientID], ghosts);
    }
  }

  // see if any pacmen are out of lives
  for (let clientID in pacmen) {
    if (pacmen[clientID].lives <= 0) {
      handlePacElim(roomID, clientID);
    }
  }

  // check if all pacmen are eliminated or if no more food is left
  let pacmenCount = Object.keys(pacmen).length;
  let foodCount = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] == 2) {
        foodCount++;
      }
    }
  }

  if (pacmenCount == 0) {
    io.to(roomID).emit("gameOver", {
      status: "lose",
      elimPacmen: gameState.elimPacmen,
    });
  } else if (foodCount == 0) {
    io.to(roomID).emit("gameOver", "win", {
      status: "win",
      elimPacmen: gameState.elimPacmen,
    });
  }

  if (pacmenCount == 0 || foodCount == 0) {
    handleGameOver(roomID, gameState);
  }
};

let gameLoopInterval = setInterval(serverGameLoop, 1000 / fps);
