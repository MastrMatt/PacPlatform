// this is the auth route, handle jwt token generation and verification here
import { Router } from "express";
import { db } from "../db.js";

import { createUser } from "./user.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// import dotenv and configure it
import { configDotenv } from "dotenv";
import { cookieJwtAuth } from "../middleware/cookieJwtAuth.js";
configDotenv();

const authRouter = Router();

/**
 * Check if a user with the given id exists, return an object with a boolean field : exists indicating if the user exists
 *
 */
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

/**
 * Signup a user with the given username and password passed from the request body and respond with the username and set cookie header for the jwt token
 */
authRouter.post("/signup", async (req, res, next) => {
	try {
		const { username, password, imageURL } = req.body;

		const userString = `users:${username}`;

		// check if the user exists
		const userExists = await db.exists(userString);
		if (userExists) {
			return res.status(401).json({ message: "User already exists" });
		}

		const verifiedUsername = createUser(username, password, imageURL);

		// generate a jwt token
		const token = jwt.sign(
			{ username: verifiedUsername },
			process.env.JWT_SECRET,
			{
				expiresIn: "1h",
			}
		);

		// add a header to signal the browser to store the cookie
		res.cookie("token", token, { httpOnly: true });

		return res.json({ username: verifiedUsername });
	} catch (error) {
		next(error);
	}
});

/**
 * Login a user with the given username and password passed from the request body and respond with a jwt token and set cookie header for the jwt token
 */
authRouter.post("/login", async (req, res, next) => {
	try {
		// handle login here
		const { username, password } = req.body;

		const userString = `users:${username}`;

		// check if the user exists
		const user = await db.hGetAll(userString);

		// check if object is empty
		if (Object.keys(user).length === 0) {
			console.log("User does not exist");
			return res.status(401).json({ message: "Username does not exist" });
		}

		const passwordMatch = await bcrypt.compare(
			password,
			user.hashedPassword
		);

		if (!passwordMatch) {
			return res.status(401).json({ message: "Incorrect password" });
		}

		// generate a jwt token
		const token = jwt.sign(
			{
				username: user.username,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "1h",
			}
		);

		// add a header to signal the browser to store the cookie
		res.cookie("token", token, { httpOnly: true });

		return res.json({
			username: user.username,
		});
	} catch (error) {
		next(error);
	}
});

/**
 * Logout a user by clearing the jwt token cookie
 */
authRouter.post("/logout", (req, res) => {
	// handle logout here
	res.clearCookie("token");
	return res.json({ message: "Logged out" });
});

authRouter.get("/checkAuth", cookieJwtAuth, (req, res) => {
	// if reached here, the user is authenticated by cookieJwtAuth middleware
	return res.json({ message: "Authenticated" });
});

export { authRouter };
