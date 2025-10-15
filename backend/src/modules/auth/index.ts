// Controller handle HTTP related eg. routing, request validation

import jwt from "@elysiajs/jwt";
import { Elysia } from "elysia";
import { AuthModel } from "./model";
import { Auth } from "./service";

if (!process.env.JWT_SECRET) {
	throw new Error("JWT_SECRET is not defined in environment variables");
}

export const auth = new Elysia({ prefix: "/auth" })
	.use(
		jwt({
			name: "jwt",
			secret: process.env.JWT_SECRET,
		}),
	)
	.get(
		"/validate",
		async ({ headers }) => {
			if (!headers.authorization) {
				return { valid: false };
			}
			return { valid: true };
		},
		{
			type: "application/json",
			response: {
				200: AuthModel.validateResponse,
			},
		},
	)
	.post(
		"/sign-up",
		async ({ body }) => {
			const response = await Auth.signUp(body);
			return response;
		},
		{
			body: AuthModel.signUpBody,
			response: {
				200: AuthModel.signUpResponse,
				400: AuthModel.signUpFailed,
				500: AuthModel.signUpFailed,
			},
		},
	)
	.post(
		"/sign-in",
		async ({ body, jwt, cookie: { logged_in } }) => {
			const response = await Auth.signIn(body);
			const token = await jwt.sign({ username: response.username });
			response.token = token;

			logged_in.domain = "localhost";
			logged_in.value = token;
			logged_in.maxAge = 60 * 60 * 24 * 7;
			logged_in.sameSite = "lax";
			logged_in.path = "/";
			logged_in.httpOnly = true;

			return response;
		},
		{
			body: AuthModel.signInBody,
			response: {
				200: AuthModel.signInResponse,
				400: AuthModel.signInInvalid,
			},
		},
	);
