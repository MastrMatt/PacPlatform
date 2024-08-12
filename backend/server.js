// express is a CommonJS module, so we use require to import it
import express from "express";
import cors from "cors";

import { createServer } from "http";
import { Server } from "socket.io";

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
