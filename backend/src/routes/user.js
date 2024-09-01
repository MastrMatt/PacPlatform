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
	const { hashedPasword, ...rest } = user;
	return rest;
};

// get all users which name starts with the given string
userRouter.get("/:id", async (req, res) => {
	try {
		const searchString = req.params.id;
		const keys = await db.keys();

		const users = keys.filter((key) => key.startsWith("users:"));

		const usernames = users.map((user) => user.split(":")[1]);

		const filteredUsers = usernames.filter((username) =>
			username.startsWith(searchString)
		);

		res.json({ users: filteredUsers });
	} catch (error) {
		next(error);
	}
});

// get the user object from the database and serialize it before sending it to the client
userRouter.get("/user/:id", async (req, res) => {
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

		console.log("inside of get user", user);
		res.json(serializeUser(user));
	} catch (error) {
		next(error);
	}
});

// get all friend requests for the user
userRouter.get("/user/:id/friendRequests", async (req, res) => {
	try {
		// if reached here, the user is authenticated by cookieJwtAuth middleware
		// fetch the user object from the db
		const username = req.params.id;
		const friendRequestsString = `friendRequests:${username}`;

		const friendRequests = await db.lRange(friendRequestsString, 0, -1);

		return res.status(200).json({ friendRequests });
	} catch (error) {
		next(error);
	}
});

// add a friend request to the user's friend request list
userRouter.post("/user/:id/friendRequests", async (req, res) => {
	try {
		const username = req.params.id;
		const { requestUsername } = req.body;
		console.log(username, requestUsername);

		const userString = `users:${username}`;
		const requestUsernameString = `users:${requestUsername}`;

		await db.rPush(`friendRequests:${username}`, requestUsernameString);

		res.json({ message: "Friend request sent" });
	} catch (error) {
		next(error);
	}
});

// delete a friend request from the user's friend request list
userRouter.delete("/user/:id/friendRequests", async (req, res) => {
	try {
		const username = req.params.id;
		const { requestUsername } = req.body;

		const userString = `users:${username}`;
		const requestUsernameString = `users:${requestUsername}`;

		await db.lRem(`friendRequests:${userString}`, 0, requestUsernameString);

		res.json({ message: "Friend request deleted" });
	} catch (error) {
		next(error);
	}
});

// get all friends for the user
userRouter.get("/user/:id/friends", async (req, res) => {
	try {
		const username = req.params.id;
		const friendsString = `friends:${username}`;

		const friends = await db.lRange(friendsString, 0, -1);

		return res.status(200).json({ friends });
	} catch (error) {
		next(error);
	}
});

// add a friend to the user's friend list
userRouter.post("/user/:id/friends", async (req, res) => {
	try {
		const username = req.params.id;
		const { requestUsername } = req.body;

		const userString = `users:${username}`;
		const requestUsernameString = `users:${requestUsername}`;

		await db.rPush(`friends:${userString}`, requestUsernameString);

		res.json({ message: "Friend added" });
	} catch (error) {
		next(error);
	}
});

// delete a friend from the user's friend list
userRouter.delete("/user/:id/friends", async (req, res) => {
	try {
		const username = req.params.id;
		const { requestUsername } = req.body;

		const userString = `users:${username}`;
		const requestUsernameString = `users:${requestUsername}`;

		const ret = await db.lRem(
			`friends:${userString}`,
			0,
			requestUsernameString
		);

		res.json({ message: "Friend deleted" });
	} catch (error) {
		next(error);
	}
});

export { userRouter, createUser, serializeUser };
