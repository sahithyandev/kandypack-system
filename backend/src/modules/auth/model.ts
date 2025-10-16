// Model define the data structure and validation for the request and response
import { t } from "elysia";
import { APIError } from "../../utils/error";

export namespace AuthModel {
	export type JWTData = {
		username: string;
		role: string;
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
		role: t.String(),
		token: t.String(),
	});
	export type signInResponse = typeof signInResponse.static;

	export const signUpResponse = signInResponse;
	export type signUpResponse = signInResponse;

	export const signInInvalid = APIError.response;
	export type signInInvalid = APIError.response;

	export const signUpFailed = APIError.response;
	export type signUpFailed = APIError.response;

	export const validateResponse = t.Object({
		valid: t.Boolean(),
	});
	export type validateResponse = typeof validateResponse.static;

	export function isJwtData(obj: unknown): obj is AuthModel.JWTData {
		return (
			obj !== null &&
			typeof obj === "object" &&
			"username" in obj &&
			"role" in obj &&
			typeof obj.role === "string" &&
			typeof obj.username === "string"
		);
	}
}
