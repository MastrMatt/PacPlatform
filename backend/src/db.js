import { createClient } from "litedb-node";

const db = createClient().on("error", (err) => console.error(err));

// import dotenv and configure it
import { configDotenv } from "dotenv";
configDotenv();

// default port for the litedb server is 9255
await db.connect({
	host: "localhost",
	port: process.env.LITEDB_PORT || 9255,
});

export { db };
