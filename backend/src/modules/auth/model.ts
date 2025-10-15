// Model define the data structure and validation for the request and response
import { t } from "elysia";

export namespace AuthModel {
	export type JWTData = {
		username: string;
	};

	export const signInBody = t.Object({
		username: t.String(),
		password: t.String(),
	});
	export type signInBody = typeof signInBody.static;

	export const signUpBody = t.Object({
		name: t.String(),
		username: t.String(),
		password: t.String(),
	});
	export type signUpBody = typeof signUpBody.static;

	export const signInResponse = t.Object({
		username: t.String(),
		token: t.String(),
	});
	export type signInResponse = typeof signInResponse.static;

	export const signUpResponse = t.Object({
		username: t.String(),
	});
	export type signUpResponse = typeof signUpResponse.static;

	export const signInInvalid = t.Object({
		message: t.String(),
	});
	export type signInInvalid = typeof signInInvalid.static;

	export const signUpFailed = t.Object({
		message: t.String(),
	});
	export type signUpFailed = typeof signUpFailed.static;

	export const validateResponse = t.Object({
		valid: t.Boolean(),
	});
	export type validateResponse = typeof validateResponse.static;

	export function isJwtData(obj: unknown): obj is AuthModel.JWTData {
		return (
			obj !== null &&
			typeof obj === "object" &&
			"username" in obj &&
			typeof obj.username === "string"
		);
	}
}
