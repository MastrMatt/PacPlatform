# PacPlatform

A platform for playing pacman with friends
built using LERN stack ([liteDB](https://github.com/MastrMatt/liteDB), Express.js, React.js, Node.js )

Notes:

-The API is restful
-The game is made over websockets using the socketio library, fully realtime pacman
-Never expect erros as a valid response to a valid query, leads to difficulties debugging. Errors sole purpose should be a signal that an unexpected event occured
