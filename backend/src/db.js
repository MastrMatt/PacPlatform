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

		await db.connect({
			host: "localhost",
			port: process.env.LITEDB_PORT || 9255,
		});
	}
};

await startClient();

export { db };
