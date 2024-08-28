import { Router } from "express";
import { db } from "../db.js";

import bcrypt from "bcrypt";

import { cookieJwtAuth } from "../middleware/cookieJwtAuth.js";

const userRouter = Router();

// add router level cookieJwtAuth middleware, all these routes will require a valid jwt token
userRouter.use(cookieJwtAuth);

// create a user object and store it in the database, return the serialized user object
const createUser = (username, password) => {
	storeUser(username, password);
	return {
		username,
	};
};

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

// serialize the user object to remove the password field
const serializeUser = (user) => {
	const { hashedPasword, ...rest } = user;
	return rest;
};

userRouter.get("/user/:id", (req, res) => {
	// if reached here, the user is authenticated by cookieJwtAuth middleware
	return res.json(serializeUser(req.user));
});

export { userRouter, createUser, serializeUser };
