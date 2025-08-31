import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { client } from "./utils/db";

await client.connect().catch((error) => {
	console.error("Failed to connect to the database:", error);
});

const app = new Elysia()
	.use(swagger())
	.get("/", async () => {
		const response = await client.query("SELECT NOW()");

		return {
			message: "Hello, Elysia and Postgres!",
			time: response.rows[0].now,
		};
	})
	.listen(2000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
