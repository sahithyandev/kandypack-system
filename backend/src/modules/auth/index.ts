// Controller handle HTTP related eg. routing, request validation

import { Elysia } from "elysia";
import jwtInstance from "../../utils/jwt";
import authMiddleware from "./middleware";
import { AuthModel } from "./model";
import { Auth } from "./service";

export const auth = new Elysia({ prefix: "/auth" })
	.use(jwtInstance)
	.use(authMiddleware)
	.get(
		"/validate",
		async ({ currentUser }) => {
			return {
				valid: currentUser !== null,
			};
		},
		{
			currentUser: true,
			type: "application/json",
			response: {
				200: AuthModel.validateResponse,
			},
		},
	)
	.post("/sign-out", async ({ cookie: { logged_in }, status }) => {
		logged_in.value = "";
		logged_in.maxAge = 0;
		return status(200, {
			message: "Successfully signed out",
		});
	})
	.post(
		"/sign-up",
		async ({ body, jwt, cookie: { logged_in }, currentUser, status }) => {
			if (currentUser) {
				return status(400, {
					message: "You are already signed in",
				});
			}

			const response = await Auth.signUp(body);

			if (!response || !("username" in response)) {
				return status(500, {
					message: "Failed to sign up",
				});
			}

			const signInResponse = await Auth.signIn({
				username: response.username,
				password: body.password,
			});

			const token = await jwt.sign({
				username: signInResponse.username,
				role: signInResponse.role,
			} satisfies AuthModel.JWTData);
			signInResponse.token = token;

			logged_in.domain = "localhost";
			logged_in.value = token;
			logged_in.maxAge = 60 * 60 * 24 * 7;
			logged_in.sameSite = "lax";
			logged_in.path = "/";
			logged_in.httpOnly = true;

			return signInResponse;
		},
		{
			currentUser: true,
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
		async ({ body, jwt, cookie: { logged_in }, currentUser, status }) => {
			if (currentUser) {
				console.log(currentUser);
				return status(400, {
					message: "You are already signed in",
				});
			}
			const response = await Auth.signIn(body);
			const token = await jwt.sign({
				username: response.username,
				role: response.role,
			} satisfies AuthModel.JWTData);
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
			currentUser: true,
			body: AuthModel.signInBody,
			response: {
				200: AuthModel.signInResponse,
				400: AuthModel.signInInvalid,
			},
		},
	);
