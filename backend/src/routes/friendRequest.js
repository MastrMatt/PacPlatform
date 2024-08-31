import { Router } from "express";
import { db } from "../db.js";

import { cookieJwtAuth } from "../middleware/cookieJwtAuth.js";

const friendRequestRouter = Router();

// add router level cookieJwtAuth middleware, all these routes will require a valid jwt token
friendRequestRouter.use(cookieJwtAuth);

// get all friend requests for the user
friendRequestRouter.get("/:id", async (req, res) => {
	try {
		// if reached here, the user is authenticated by cookieJwtAuth middleware
		// fetch the user object from the db
		const username = req.params.id;
		const friendRequestsString = `friendRequests:${username}`;

		const friendRequests = await db.lRange(friendRequestsString, 0, -1);

		return res.status(200).json(friendRequests);
	} catch (error) {
		next(error);
	}
});

// add a friend request to the user's friend request list
friendRequestRouter.post("/:id", async (req, res) => {
	try {
		const username = req.params.id;
		const { requestUsername } = req.body;
		console.log(username, requestUsername);

		const userString = `users:${username}`;
		const requestUsernameString = `users:${requestUsername}`;

		await db.rPush(`${userString}:friendRequests`, requestUsernameString);

		res.json({ message: "Friend request sent" });
	} catch (error) {
		next(error);
	}
});

// delete a friend request from the user's friend request list
friendRequestRouter.delete("/:id", async (req, res) => {
	try {
		const username = req.params.id;
		const { requestUsername } = req.body;

		const userString = `users:${username}`;
		const requestUsernameString = `users:${requestUsername}`;

		await db.lRem(`${userString}:friendRequests`, 0, requestUsernameString);

		res.json({ message: "Friend request deleted" });
	} catch (error) {
		next(error);
	}
});

export { friendRequestRouter };
