import { Router } from "express";
import { db } from "../db.js";

import bcrypt from "bcrypt";

import { cookieJwtAuth } from "../middleware/cookieJwtAuth.js";

const userRouter = Router();

// add router level cookieJwtAuth middleware, all these routes will require a valid jwt token
userRouter.use(cookieJwtAuth);

const storeUser = async (username, password) => {
	const userString = `users:${username}`;

	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(password, saltRounds);

	const user = {
		username,
		hashedPassword,
		totalScore: 0,
		highestScoreGame: 0,
		// SPG: average score per game
		SPG: 0,
	};

	db.hSetObject(userString, user);

	return serializeUser(user);
};

// create a user object and store it in the database, return the username (userID)
const createUser = (username, password) => {
	storeUser(username, password);
	return {
		username,
	};
};

// serialize the user object to remove the password field
const serializeUser = (user) => {
	const { hashedPasword, ...rest } = user;
	return rest;
};

userRouter.get("/user/:id", async (req, res) => {
	try {
		// if reached here, the user is authenticated by cookieJwtAuth middleware
		// fetch the user object from the db
		const { username } = req.user;
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

export { userRouter, createUser, serializeUser };
