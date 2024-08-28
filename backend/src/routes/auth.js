// this is the auth route, handle jwt token generation and verification here
import { Router } from "express";
import { db } from "../db.js";

import { createUser, serializeUser } from "./user.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// import dotenv and configure it
import { configDotenv } from "dotenv";
configDotenv();

import { cookieJwtAuth } from "../middleware/cookieJwtAuth.js";

const authRouter = Router();

// checks if a user with the given id exists
authRouter.get("/user/:id", async (req, res, next) => {
	try {
		const { id } = req.params;

		// see if user exists
		const userExists = await db.exists(`users:${id}`);

		// rest API , if user does not exist, return empty object, never return errors as a response to any valid queries, leads to difficulty debugging and is unclear
		if (userExists) {
			return res.json({ exists: true });
		} else {
			return res.json({ exists: false });
		}
	} catch (error) {
		next(error);
	}
});

authRouter.post("/signup", async (req, res, next) => {
	try {
		const { username, password } = req.body;

		const userString = `users:${username}`;

		// check if the user exists
		const userExists = await db.exists(userString);
		if (userExists) {
			return res.status(401).json({ message: "User already exists" });
		}

		const user = createUser(username, password);

		try {
			// generate a jwt token
			const token = jwt.sign(user, process.env.JWT_SECRET, {
				expiresIn: "1h",
			});

			// add a header to signal the browser to store the cookie
			res.cookie("token", token, { httpOnly: true });

			return res.json(user);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	} catch (error) {
		next(error);
	}
});

authRouter.post("/login", async (req, res, next) => {
	try {
		// handle login here
		const { username, password } = req.body;

		const userString = `users:${username}`;

		// check if the user exists
		const userExists = await db.exists(`users:${username}`);
		console.log(userExists);
		if (!userExists) {
			console.log("User does not exist");
			return res.status(401).json({ message: "Username does not exist" });
		}

		// check if the password is correct
		const user = await db.hGetAll(userString);

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return res.status(401).json({ message: "Incorrect password" });
		}

		// generate a jwt token
		const token = jwt.sign(user, process.env.JWT_SECRET, {
			expiresIn: "15m",
		});

		// add a header to signal the browser to store the cookie
		res.cookie("token", token, { httpOnly: true });

		return res.json(serializeUser(user));
	} catch (error) {
		next(error);
	}
});

authRouter.post("/logout", (req, res) => {
	// handle logout here
	res.clearCookie("token");
	return res.json({ message: "Logged out" });
});

export { authRouter };
