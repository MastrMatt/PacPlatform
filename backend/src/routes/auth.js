// this is the auth route, handle jwt token generation and verification here
import { Router } from "express";
import { db } from "../db";

import jwt from "jsonwebtoken";

// import dotenv and configure it
import { configDotenv } from "dotenv";
configDotenv();

const router = Router();

router.post("/login", (req, res) => {
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
