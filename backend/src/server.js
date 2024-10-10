// express is a CommonJS module, so we use require to import it
import express from "express";
import { Router } from "express";

// ! Note express does not support async function error handling, need to wrap in async router/app methods in a try catch and pass the error to the next middleware

// routers
import { authRouter } from "./routes/auth.js";
import { userRouter } from "./routes/user.js";

import { db } from "./db.js";

import cors from "cors";
// import dotenv and configure it
import { configDotenv } from "dotenv";
configDotenv();

import cookieParser from "cookie-parser";

import { createServer } from "http";
import { Server } from "socket.io";
import {
	fps,
	map,
	ghostCount,
	DIRECTION_UP,
	DIRECTION_BOTTOM,
	DIRECTION_LEFT,
	DIRECTION_RIGHT,
} from "./pacman/Constants.js";

import { create4Pacmen } from "./pacman/Pacman.js";
import { createNewGhosts } from "./pacman/Ghost.js";

const app = express();

const corsOptions = {
	origin: [
		"https://pacplatform.apps.mastrmatt.com",
		"http://localhost:5173",
		"http://localhost:5174",
		"http://localhost:5175",
	], // Replace with your actual client origin
	credentials: true,
};

// add some global middleware to the express app
app.use(cors(corsOptions));

// can acess cookies from the request object using req.cookies
app.use(cookieParser());

// app json body parser middleware
app.use(express.json());

// attach the routes to the express app api router
const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);

app.use("/api", apiRouter);

// create a http server, attach the express app to it and create a socket.io server on the same http server, also setup cors options
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: corsOptions,
});

const PORT = process.env.PORT || 42069;

httpServer.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

/**
 * Initializes the game state for a given number of players.
 * @param {string[]} players - An array of player IDs.
 * @returns {Object} The initial game state.
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
		// create a deep copy of the map
		map: JSON.parse(JSON.stringify(map)),
	};
};

const gameRooms = {};
// socket is the connection to the client
io.on("connection", (socket) => {
	socket.on("checkRoomID", (roomID) => {
		if (gameRooms[roomID]) {
			socket.emit("roomIDAvailabilityResponse", false);
		} else {
			socket.emit("roomIDAvailabilityResponse", true);
		}
	});

	socket.on("checkCreatedRoomID", (roomID) => {
		if (gameRooms[roomID]) {
			socket.emit("roomIDCreatedResponse", true);
		} else {
			socket.emit("roomIDCreatedResponse", false);
		}
	});

	socket.on("createRoom", ({ clientID, roomID, numPlayers }) => {
		//  if room is already created, emit this to the client
		if (gameRooms[roomID]) {
			socket.emit("roomExists", "Room already exists");
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
			gameRooms[roomID].gameState = gameStateInit(
				gameRooms[roomID].players
			);

			// start the game
			io.to(roomID).emit(
				"allPlayersJoined",
				"All players have joined the room"
			);
		}
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
			gameRooms[roomID].gameState = gameStateInit(
				gameRooms[roomID].players
			);

			io.to(roomID).emit(
				"allPlayersJoined",
				"All players have joined the room"
			);
		}
	});

	socket.on("keyDown", ({ roomID, clientID, direction }) => {
		// check if client has been eliminated
		if (!gameRooms[roomID].gameState.pacmen[clientID]) {
			return;
		}
		// update the direction of the pacman
		if (direction == "up") {
			gameRooms[roomID].gameState.pacmen[clientID].nextDirection =
				DIRECTION_UP;
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

/**
 * Handles the server-side game loop for all active game rooms.
 * Updates game state and emits updates to clients.
 */
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

/**
 * Resets a Pacman's position and reduces its lives.
 * @param {Object} pacman - The Pacman object to reset.
 */
let resetPacman = (pacman) => {
	pacman.reduceLives(1);

	pacman.x = pacman.startX;
	pacman.y = pacman.startY;
};

/**
 * Resets all ghosts to their starting positions.
 * @param {Object[]} ghosts - An array of ghost objects.
 */
let resetGhosts = (ghosts) => {
	for (let i = 0; i < ghosts.length; i++) {
		ghosts[i].x = ghosts[i].startX;
		ghosts[i].y = ghosts[i].startY;
	}
};

/**
 * Handles collision between a Pacman and ghosts.
 * @param {Object} pacman - The Pacman object.
 * @param {Object[]} ghosts - An array of ghost objects.
 */
let onGhostCollision = (pacman, ghosts) => {
	resetPacman(pacman);
	resetGhosts(ghosts);
};

/**
 * Handles the elimination of a Pacman from the game.
 * @param {string} roomID - The ID of the game room.
 * @param {string} clientID - The ID of the client (Pacman) to eliminate.
 */
let handlePacElim = (roomID, clientID) => {
	// remove the player from the game state and add to elimPacmen, delete operator removes a key-value pair from an object
	gameRooms[roomID].gameState.elimPacmen[clientID] =
		gameRooms[roomID].gameState.pacmen[clientID];
	delete gameRooms[roomID].gameState.pacmen[clientID];

	io.to(roomID).emit("pacmanElim", clientID);
};

/**
 * Handles game over logic, including updating player stats in the database.
 * @param {string} roomID - The ID of the game room.
 * @param {Object} gameState - The current game state.
 */
let serverHandleGameOver = async (roomID, gameState) => {
	// delete the room from the gameRooms object
	delete gameRooms[roomID];

	// ! perform any backend logic here related to game over, like updating the database for the scores
	// ! NOTE: you have acess to the gameState object here

	// go through all the dead pacmen and update the (SPG, highestScore, totalScore)
	for (let clientID in gameState.elimPacmen) {
		let pac = gameState.elimPacmen[clientID];
		let userString = `users:${clientID}`;

		let user = await db.hGetAll(userString);

		let userTotalScore = parseInt(user.totalScore);
		let userHighestScore = parseInt(user.highestScore);
		let userNumGames = parseInt(user.numGames);

		// update the user object
		userNumGames++;
		user.numGames = userNumGames;

		user.totalScore = userTotalScore + pac.score;

		user.SPG = user.totalScore / userNumGames;
		if (pac.score > userHighestScore) {
			user.highestScore = pac.score;
		}

		// update the user object in the database
		await db.hSetObject(userString, user);
	}

	//go through all the alive pacmen and update the (SPG, highestScore, totalScore)
	for (let clientID in gameState.pacmen) {
		let pac = gameState.pacmen[clientID];
		let userString = `users:${clientID}`;

		let user = await db.hGetAll(userString);

		// update the user object
		user.totalScore += pac.score;
		user.SPG = user.totalScore / user.numGames;
		if (pac.score > user.highestScore) {
			user.highestScore = pac.score;
		}

		// update the user object in the database
		await db.hSetObject(userString, user);
	}

	console.log(gameState);
};

/**
 * Updates the game state for a specific room.
 * @param {string} roomID - The ID of the game room.
 * @param {Object} gameState - The current game state.
 */
let update = (roomID, gameState) => {
	let pacmen = gameState.pacmen;
	let ghosts = gameState.ghosts;
	let map = gameState.map;

	// update the pacmen
	for (let clientID in pacmen) {
		pacmen[clientID].moveProcess();
		pacmen[clientID].eat(gameState.map);
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
			displayPacmen: gameState.elimPacmen,
		});
	} else if (foodCount == 0) {
		io.to(roomID).emit("gameOver", {
			status: "win",
			displayPacmen: gameState.pacmen,
		});
	}

	if (pacmenCount == 0 || foodCount == 0) {
		serverHandleGameOver(roomID, gameState);
	}
};

let gameLoopInterval = setInterval(serverGameLoop, 1000 / fps);

export { app };
