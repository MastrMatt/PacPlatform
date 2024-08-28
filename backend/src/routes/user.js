import { Router } from "express";
import { db } from "../db.js";

import { cookieJwtAuth } from "../middleware/cookieJwtAuth.js";

const userRouter = Router();

// add router level cookieJwtAuth middleware, all these routes will require a valid jwt token
userRouter.use(cookieJwtAuth);

// create a user object and store it in the database, return the stored object
const createUser = (username, password) => {
	const userString = `users:${username}`;

	const user = {
		username,
		password,
		score: 0,
	};

	db.hSetObject(userString, user);

	return user;
};

// serialize the user object to remove the password field
const serializeUser = (user) => {
	const { password, ...rest } = user;
	return rest;
};

userRouter.get("/user/:id", async (req, res, next) => {
	try {
		const { id } = req.params;

		// see if user exists
		const userExists = await db.exists(`users:${id}`);

		// rest API , if user does not exist, return empty object, never return errors as a response to any valid queries, leads to difficulty debugging and is unclear
		if (!userExists) {
			return res.json({});
		}

		const user = await db.hGetAll(`users:${id}`);

		return res.json(serializeUser(user));
	} catch (error) {
		next(error);
	}
});

export { userRouter, createUser, serializeUser };
