import { defineConfig } from "orval";

export default defineConfig({
	backend: {
		input: "http://localhost:2000/swagger/json",
		output: {
			target: "./lib/api-client.ts",
			client: "axios-functions",
			httpClient: "axios",
			biome: true,
			override: {
				mutator: {
					path: "./lib/mutator.ts",
					name: "customInstance",
				},
			},
		},
	},
});
