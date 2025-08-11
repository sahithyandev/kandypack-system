import { Client } from "pg";

if (process.env.DATABASE_URL === undefined) {
	throw new Error("DATABASE_URL is not defined in the environment variables.");
}

export const client = new Client({
	connectionString: process.env.DATABASE_URL,
});
