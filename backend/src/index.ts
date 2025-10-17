import cors from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@grotto/logysia";
import { Elysia, t } from "elysia";
import { auth } from "./modules/auth";
import authMiddleware from "./modules/auth/middleware";
import { client } from "./utils/db";
import jwtInstance from "./utils/jwt";
import { dispatcher } from "./modules/dispatcher";
import { storeManager } from "./modules/store-manager";

await client.connect().catch((error) => {
	console.error("Failed to connect to the database:", error);
});

export const app = new Elysia()
	.use(
		cors({
			credentials: true,
		}),
	)
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
	.use(jwtInstance)
	.use(auth)
	.use(authMiddleware)
	.get(
		"/",
		async ({ currentUser }) => {
			if (currentUser) {
				return {
					message: `Hello, ${currentUser.username} (${currentUser.role})! You are signed in.`,
					time: new Date().toISOString(),
				};
			}
			const response = await client.query("SELECT NOW()");

			return {
				message: "Hello, Elysia and Postgres!",
				time: response.rows[0].now.toString(),
			};
		},
		{
			currentUser: true,
			response: t.Object({
				message: t.String(),
				time: t.String(),
			}),
		},
	)
	.use(dispatcher)
	.use(storeManager)
	.listen(2000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
