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
		async ({ body, jwt, cookie: { session } }) => {
			const response = await Auth.signIn(body);
			const token = await jwt.sign({ username: response.username });
			session.value = token;
			response.token = token;
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
