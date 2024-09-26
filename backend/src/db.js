import { createClient, LiteDBClient } from "litedb-node";

// import dotenv and configure it
import { configDotenv } from "dotenv";
configDotenv();

// create a singleton db object
/**@type {LiteDBClient} */
let db;

let startClient = async () => {
	if (db) {
		return;
	} else {
		db = createClient();

		// force to flush the output
		console.log(process.env.DB_HOST, process.env.DB_PORT);

		await db.connect({
			host: process.env.DB_HOST || "localhost",
			port: parseInt(process.env.DB_PORT) || 9255,
		});
	}
};

await startClient();

export { db };
