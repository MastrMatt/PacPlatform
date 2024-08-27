// this is the auth route, handle jwt token generation and verification here
import { Router } from "express";
import { db } from "../db.js";

import jwt from "jsonwebtoken";

// import dotenv and configure it
import { configDotenv } from "dotenv";
configDotenv();

console.log();

const authRouter = Router();

// create a user object and store it in the database, user object
const createUser = (username, password) => {
	const userString = `users:${username}`;

	const user = {
		username,
		password,
		score: 0,
	};

	db.hSetObject(userString, user);

	return serializeUser(user);
};

const serializeUser = (user) => {
	const { password, ...rest } = user;
	return rest;
};

authRouter.post("/login", (req, res) => {
	// handle login here
	const { username, password } = req.body;

	const userString = `users:${username}`;

	// check if the user exists
	const userExists = db.exists(`users:${username}`);
	if (!userExists) {
		return res.status(401).json({ message: "Username does not exist" });
	}

	// check if the password is correct
	const user = db.hGetAll(userString);

	if (user.password !== password) {
		return res.status(401).json({ message: "Invalid password" });
	}

	// generate a jwt token
	const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });

	// add a header to signal the browser to store the cookie
	res.cookie("token", token, { httpOnly: true });

	return res.redirect("/home");
});

authRouter.post("/signup", async (req, res) => {
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

		return res.json(serializeUser(user));
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

export { authRouter };
