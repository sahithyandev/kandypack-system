import { swagger } from "@elysiajs/swagger";
import { logger } from "@grotto/logysia";
import { Elysia, t } from "elysia";
import { auth } from "./modules/auth";
import { client } from "./utils/db";
import cors from "@elysiajs/cors";

await client.connect().catch((error) => {
	console.error("Failed to connect to the database:", error);
});

export const app = new Elysia()
	.use(cors())
	.use(
		swagger({
			autoDarkMode: true,
			documentation: {
				info: {
					title: "Kandypack",
					version: "1.0.0",
				},
			},
		}),
	)
	.use(
		logger({
			logIP: false,
			writer: {
				write(msg: string) {
					console.log(msg);
				},
			},
		}),
	)
	.use(auth)
	.get(
		"/",
		async () => {
			const response = await client.query("SELECT NOW()");

			return {
				message: "Hello, Elysia and Postgres!",
				time: response.rows[0].now.toString(),
			};
		},
		{
			response: t.Object({
				message: t.String(),
				time: t.String(),
			}),
		},
	)
	.listen(2000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
