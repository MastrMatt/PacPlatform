// use this middleware function when wanting to authenticate a user in all other routes

import jwt from "jsonwebtoken";

// import dotenv and configure it
import { configDotenv } from "dotenv";
configDotenv();

export const cookieJwtAuth = (req, res, next) => {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	try {
		const user = jwt.verify(token, process.env.JWT_SECRET);
		req.user = user;
		next();
	} catch (err) {
		// add a header to signal the browser to delete the cookie
		res.clearCookie("token");
		return res.status(401).json({ message: "Unauthorized" });
	}
};
