# PacPlatform

PacPlatform is a multiplayer Pac-Man game and social platform built using the LERN stack (LiteDB, Express.js, React.js, Node.js). LiteDB is a lightweight, in-memory database created by the author of this project.

## Features

- **Multiplayer Pac-Man**: Real-time multiplayer Pac-Man game using WebSocket connections.
- **Social Platform**: 
  - Add friends and compare stats
  - Search and view other users' profiles
- **RESTful API**: Backend provides a RESTful API for data management.
- **WebSocket Support**: Backend handles both HTTP and WebSocket connections for real-time gameplay.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express.js. Implements a RESTful API and WebSocket server.
- **Database**: [LiteDB](https://github.com/MastrMatt/liteDB). Created by the author of this project.
- **WebSockets**: Socket.IO for real-time communication
- **Testing**: Cypress for end-to-end (e2e) tests
- **Documentation**: JSDoc for backend documentation

## Setup

1. Clone the repository: `git clone https://github.com/MastrMatt/PacPlatform.git`
2. Ensure a liteDB instance is running on port 9255. Instructions on how to install and run liteDB can be found [here](https://github.com/MastrMatt/liteDB).
3. Install backend dependencies: `cd backend && npm install`
4. Start the backend server: `npm run dev`
5. Install frontend dependencies: `cd ../frontend && npm install`
6. Start the frontend development server: `npm run dev`
7. Navigate to the port where the frontend server is running in your browser.

## Usage

### Starting a Game

To start a game, follow these steps:

1. Log in to your account on the PacPlatform website.
2. Create a game lobby from the homepage.
3. Share the lobby code with your friends.
4. Your friends can join the game by entering the lobby code.
5. The game will start when all players have joined.

### Adding Friends

To add friends on PacPlatform, follow these steps:

1. Log in to your account on the PacPlatform website.
2. Click on the "Search" tab on the navigation bar.
3. Search for the username of the friend you want to add.
4. Click on the "Send Friend Request" button.


### Viewing Profiles and Stats

To view other users' profiles and compare stats, follow these steps:

1. Log in to your account on the PacPlatform website.
2. Click on the "Search" tab on the navigation bar.
3. Search for the username of the user whose profile you want to view.
4. Click on the "View" button.
5. View the user's stats, including their high score, games played, and score per game ratio.
6. Compare your stats with theirs to see who's the ultimate Pac-Man champion.


## Testing

End-to-end tests are implemented using Cypress. To run the tests:

1. Install Cypress: `npm install cypress --save-dev`
2. Run Cypress: `npx cypress open`

## Documentation

Backend documentation is generated using JSDoc. 

## Future Considerations

1. Enhance the Pac-Man game:
   - Add music
   - Implement additional features (e.g., cherries, teleportation)
2. Expand the platform with more games

## Author
Matthew Neba / [@MastrMatt](https://github.com/MastrMatt)

## License
This project is licensed under the [MIT License](LICENSE).

## Contributing

Contributions to this project are welcome. Please submit pull requests or open issues to discuss potential improvements or report bugs.