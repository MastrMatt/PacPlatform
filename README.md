# PacPlatform

A platform for playing pacman with friends
built using LERN stack ([liteDB](https://github.com/MastrMatt/liteDB), Express.js, React.js, Node.js )

Notes:

-Made using the db I made, liteDB
-The API is restful
-Along with the http server that API requests are made to, the backend also has the capability of handling websocket connections, this allows the pacman game to be a multiplayer real time game
-The game is made over websockets using the socketio library, fully realtime pacman multiplater game

-Acts also as a social platform, therefore supports:
-Adding friends and comparing stats with friends
-Searching and viewing other users profiles

-e2e tests made using Cypress
-JSDOC was used for documentation of the backend

-Some future considerations:
-Add music for the pacman game and make the game more complete (ex: cherries, teleportation, etc.)
-Add more games
