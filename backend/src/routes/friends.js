import { Router } from "express";
import { db } from "../db.js";

import { cookieJwtAuth } from "../middleware/cookieJwtAuth.js";

const friendsRouter = Router();

// add router level cookieJwtAuth middleware, all these routes will require a valid jwt token
friendsRouter.use(cookieJwtAuth);

// get all friends for the user

// add a friend to the user's friend list
friendsRouter.post("/:id", async (req, res) => {
	try {
		const username = req.params.id;
		const userString = `users:${username}`;
		const requestUsernameString = `users:${requestUsername}`;

		await db.rPush(`${userString}:friends`, requestUsernameString);

		res.json({ message: "Friend added" });
	} catch (error) {
		next(error);
	}
});

// delete a friend from the user's friend list
friendsRouter.delete("/:id", async (req, res) => {
	try {
		const username = req.params.id;
		const { requestUsername } = req.body;

		const userString = `users:${username}`;
		const requestUsernameString = `users:${requestUsername}`;

		const ret = await db.lRem(
			`${userString}:friends`,
			0,
			requestUsernameString
		);

		res.json({ message: "Friend deleted" });
	} catch (error) {
		next(error);
	}
});

export { friendsRouter };
