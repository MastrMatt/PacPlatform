import { Router } from "express";
import { db } from "../db.js";

import bcrypt from "bcrypt";

import { cookieJwtAuth } from "../middleware/cookieJwtAuth.js";

const userRouter = Router();

// add router level cookieJwtAuth middleware, all these routes will require a valid jwt token
userRouter.use(cookieJwtAuth);

const storeUser = async (username, password, imageURL) => {
	const userString = `users:${username}`;

	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(password, saltRounds);

	const user = {
		username,
		hashedPassword,
		imageURL,
		highestScore: 0,
		totalScore: 0,
		// SPG: average score per game
		SPG: 0,
		numGames: 0,
	};

	db.hSetObject(userString, user);

	return serializeUser(user);
};

// create a user object and store it in the database, return the username (userID)
const createUser = (username, password, imageURL) => {
	storeUser(username, password, imageURL);
	return {
		username,
	};
};

// serialize the user object to remove the password field
const serializeUser = (user) => {
	const { hashedPassword, ...rest } = user;
	return rest;
};

// get all users which name starts with the given string
userRouter.get("/search/:id", async (req, res, next) => {
	try {
		const searchString = req.params.id;
		const keys = await db.keys();

		const userKeys = keys.filter((key) => key.startsWith("users:"));

		const users = await Promise.all(
			userKeys.map((userKey) => db.hGetAll(userKey))
		);

		const filteredUsers = users.filter((user) =>
			user.username.startsWith(searchString)
		);

		res.json({ users: filteredUsers.map(serializeUser) });
	} catch (error) {
		next(error);
	}
});

// get the user object from the database and serialize it before sending it to the client
userRouter.get("/:id", async (req, res, next) => {
	try {
		// if reached here, the user is authenticated by cookieJwtAuth middleware
		// fetch the user object from the db
		const username = req.params.id;
		const userString = `users:${username}`;

		// check if the user exists
		const user = await db.hGetAll(userString);

		if (Object.keys(user).length === 0) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(serializeUser(user));
	} catch (error) {
		next(error);
	}
});

// get all friend requests for the user
userRouter.get("/:id/friendRequests", async (req, res, next) => {
	try {
		const username = req.params.id;
		const friendRequestsString = `friendRequests:${username}`;

		const friendRequests = await db.lRange(friendRequestsString, 0, -1);

		// Fetch user objects for each friend request
		const friendRequestUsers = await Promise.all(
			friendRequests.map(async (requestUsername) => {
				const userString = requestUsername.replace("users:", "");
				const user = await db.hGetAll(`users:${userString}`);
				return serializeUser(user);
			})
		);

		return res.status(200).json({ friendRequests: friendRequestUsers });
	} catch (error) {
		next(error);
	}
});

// add a friend request to the user's friend request list
userRouter.post("/:id/friendRequests", async (req, res, next) => {
	try {
		const username = req.params.id;
		const { requestUsername } = req.body;

		const userString = `users:${username}`;
		const requestUsernameString = `users:${requestUsername}`;

		// check if friend request has already been sent or already friends
		const requestSent = await db.lExists(
			`friendRequests:${username}`,
			requestUsernameString
		);

		const friends = await db.lExists(
			`friends:${username}`,
			requestUsernameString
		);

		if (requestSent || friends) {
			// Return 409 Conflict status code
			return res.status(409).json({
				message: "Friend request already sent or already friends",
			});
		}

		await db.rPush(`friendRequests:${username}`, requestUsernameString);

		res.json({ message: "Friend request sent" });
	} catch (error) {
		next(error);
	}
});

// delete a friend request from the user's friend request list
userRouter.delete("/:id/friendRequests/:requestId", async (req, res, next) => {
	try {
		const username = req.params.id;
		const requestUsername = req.params.requestId;

		const requestUsernameString = `users:${requestUsername}`;

		await db.lRem(`friendRequests:${username}`, 0, requestUsernameString);

		res.json({ message: "Friend request deleted" });
	} catch (error) {
		next(error);
	}
});

// get the leaderboard for user's friends according to some type
userRouter.get("/:id/friends/leaderboard/:type", async (req, res, next) => {
	try {
		const username = req.params.id;
		const type = req.params.type;

		const friendsString = `friends:${username}`;
		const friends = await db.lRange(friendsString, 0, -1);

		let leaderboard = [];

		for (const friend of friends) {
			const friendObject = await db.hGetAll(friend);

			leaderboard.push({
				username: friendObject.username,
				value: parseInt(friendObject[type]) || 0,
			});
		}

		// Add the current user to the leaderboard
		const currentUser = await db.hGetAll(`users:${username}`);
		leaderboard.push({
			username: currentUser.username,
			value: parseFloat(currentUser[type]) || 0,
		});

		leaderboard.sort((a, b) => b.value - a.value);

		// return the top 10 values, sort in descending order
		leaderboard = leaderboard.slice(0, 10);

		res.json({ leaderboard });
	} catch (error) {
		next(error);
	}
});

// get all friends for the user
userRouter.get("/:id/friends", async (req, res, next) => {
	try {
		const username = req.params.id;
		const friendsString = `friends:${username}`;

		const friends = await db.lRange(friendsString, 0, -1);

		return res.json({ friends });
	} catch (error) {
		next(error);
	}
});

// add a friend to the user's friend list while removing the friend request
userRouter.post("/:id/friends", async (req, res, next) => {
	try {
		const username = req.params.id;
		const { requestUsername } = req.body;

		const requestUsernameString = `users:${requestUsername}`;

		// add the friend to the user's friend list
		await db.rPush(`friends:${username}`, requestUsernameString);

		// add the user to the friend's friend list
		await db.rPush(`friends:${requestUsername}`, `users:${username}`);

		// remove the friend request
		await db.lRem(`friendRequests:${username}`, 0, requestUsernameString);

		res.json({ message: "Friend added" });
	} catch (error) {
		next(error);
	}
});

// delete a friend from the user's friend list
userRouter.delete("/:id/friends/:requestId", async (req, res, next) => {
	try {
		const username = req.params.id;
		const requestUsername = req.params.requestId;

		const requestUsernameString = `users:${requestUsername}`;

		await db.lRem(`friends:${username}`, 0, requestUsernameString);

		res.json({ message: "Friend deleted" });
	} catch (error) {
		next(error);
	}
});

export { userRouter, createUser, serializeUser };
