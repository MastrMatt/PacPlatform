import { Router } from "express";
import { db } from "../db.js";

const userRouter = Router();

userRouter.get("/:id", async (req, res) => {
	const { id } = req.params;

	// see if user exists
	const userExists = await db.exists(`users:${id}`);

	// rest API , if user does not exist, return empty object, never return errors as a response to any valid queries, leads to difficulty debugging and is unclear
	if (!userExists) {
		return res.json({});
	}

	const user = await db.hGetAll(`users:${id}`);

	return res.json(user);
});

export { userRouter };
