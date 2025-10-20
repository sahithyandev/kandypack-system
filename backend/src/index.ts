import cors from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@grotto/logysia";
import { Elysia, t } from "elysia";
import { auth } from "./modules/auth";
import authMiddleware from "./modules/auth/middleware";
import { driver } from "./modules/driver";
import { client } from "./utils/db";
import jwtInstance from "./utils/jwt";
import { dispatcher } from "./modules/dispatcher";
import { storeManager } from "./modules/store-manager";
import { customer } from "./modules/customer";
import { admin } from "./modules/admin";

await client.connect().catch((error) => {
	console.error("Failed to connect to the database:", error);
});

export const app = new Elysia()
	.use(
		cors({
			// Credentialed requests require a specific allowed origin (not "*")
			origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
			credentials: true,
			exposeHeaders: ["Content-Disposition"],
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
	.use(driver)
	.get(
		"/",
		async ({ currentUser }: any) => {
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
	.use(customer)
	.use(admin)
	.listen(2000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
