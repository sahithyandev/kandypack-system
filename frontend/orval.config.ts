import { defineConfig } from "orval";

export default defineConfig({
	backend: {
		input: "http://localhost:2000/swagger/json",
		output: {
			baseUrl: "http://backend:2000",
			target: "./lib/api-client.ts",
			client: "fetch",
			httpClient: "axios",
			biome: true,
		},
	},
});
