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

		const userId = Bun.randomUUIDv7();
		const hashedPassword = await Bun.password.hash(body.password);

		try {
			// Start transaction
			await client.query('BEGIN');

			// Create User record
			await client.query(
				`INSERT INTO "User" (id, name, username, password, role)
				VALUES ($1, $2, $3, $4, 'Customer')`,
				[userId, body.name, body.username, hashedPassword],
			);

			// Create Customer record if customer-specific fields are provided
			if (body.type && body.phone_no) {
				await client.query(
					`INSERT INTO Customer (id, type, street_name, city, postal_code, phone_no)
					VALUES ($1, $2, $3, $4, $5, $6)`,
					[
						userId,
						body.type,
						body.street_name || null,
						body.city || null,
						body.postal_code || null,
						body.phone_no,
					],
				);
			}

			await client.query('COMMIT');

			return { username: body.username, userId };
		} catch (error) {
			await client.query('ROLLBACK');
			console.error('Signup error:', error);
			throw status(500, {
				message: "Failed to create customer account",
			} satisfies AuthModel.signUpFailed);
		}
	}
	static async signIn({ username, password }: AuthModel.signInBody) {
		const result = await client.query<{
			id: string;
			name: string;
			password: string;
			role: string;
		}>(
			`SELECT id, name, password, role
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
			name: user.name,
			role: user.role,
			workerType,
			token: "",
		} satisfies AuthModel.signInResponse;
	}
}
