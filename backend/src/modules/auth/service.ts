// Service handle business logic, decoupled from Elysia controller

import { status } from "elysia";
import { client } from "../../utils/db";
import type { AuthModel } from "./model";

export abstract class Auth {
	static async signUp(body: AuthModel.signUpBody) {
		const exists = await client.query(
			`SELECT 1
			FROM "User"
			WHERE username = $1
			LIMIT 1`,
			[body.username],
		);
		if (exists === null)
			throw status(500, {
				message: "Database error",
			} satisfies AuthModel.signUpFailed);

		if (exists.rowCount === null || exists.rowCount > 0)
			throw status(400, {
				message: "Username already exists",
			} satisfies AuthModel.signUpFailed);

		return client
			.query<{ username: string }>(
				`INSERT INTO "User" (id, name, username, password, role)
			VALUES ($1, $2, $3, $4, 'Customer')
			RETURNING username`,
				[
					Bun.randomUUIDv7(),
					body.name,
					body.username,
					await Bun.password.hash(body.password),
				],
			)
			.then((result) => result.rows[0]);
	}
	static async signIn({ username, password }: AuthModel.signInBody) {
		const result = await client.query<{
			id: string;
			password: string;
			role: string;
		}>(
			`SELECT id, password, role
			FROM "User"
			WHERE username = $1
			LIMIT 1`,
			[username],
		);

		if (result.rowCount === 0)
			throw status(400, {
				message: "Invalid username or password",
			} satisfies AuthModel.signInInvalid);
		const user = result.rows[0];

		if (!user) throw status(400, "Invalid username or password");

		const isPasswordValid = await Bun.password.verify(password, user.password);

		if (!isPasswordValid)
			throw status(400, {
				message: "Invalid username or password",
			} satisfies AuthModel.signInInvalid);

		// Fetch worker type if user is a worker
		let workerType: string | undefined = undefined;
		if (user.role === "Worker") {
			const workerResult = await client.query<{ type: string }>(
				`SELECT type
				FROM Worker
				WHERE id = $1
				LIMIT 1`,
				[user.id],
			);
			if (workerResult.rowCount !== null && workerResult.rowCount > 0) {
				workerType = workerResult.rows[0].type;
			}
		}

		return {
			username,
			role: user.role,
			workerType,
			token: "",
		} satisfies AuthModel.signInResponse;
	}
}
