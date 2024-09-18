import { defineConfig } from "cypress";
import { resetDb } from "./cypress/support/db.js";

export default defineConfig({
	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
			on("task", {
				"db:reset": async () => {
					await resetDb();
					return null;
				},
			});
		},
		baseUrl: "http://localhost:5173", // Assuming your frontend runs on this port
	},
	env: {
		// Add environment variables here
		LITEDB_PORT: 9255,
	},
});
