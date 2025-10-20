// Model define the data structure and validation for the request and response
import { t } from "elysia";
import { APIError } from "../../utils/error";

export namespace AuthModel {
	export const jwtData = t.Object({
		username: t.String(),
		role: t.String(),
		workerType: t.Optional(t.String()),
	});
	export type JWTData = typeof jwtData.static;

	export const signInBody = t.Object({
		username: t.String(),
		password: t.String(),
	});
	export type signInBody = typeof signInBody.static;

	export const signUpBody = t.Object({
		name: t.String(),
		username: t.String(),
		password: t.String(),
		type: t.Optional(t.Union([t.Literal("Retail"), t.Literal("Wholesale")])),
		street_name: t.Optional(t.String()),
		city: t.Optional(t.String()),
		postal_code: t.Optional(t.String()),
		phone_no: t.Optional(t.String()),
	});
	export type signUpBody = typeof signUpBody.static;

	export const signInResponse = t.Object({
		username: t.String(),
		name: t.String(),
		role: t.String(),
		workerType: t.Optional(t.String()),
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
		user: t.Nullable(jwtData),
	});
	export type validateResponse = typeof validateResponse.static;

	export const meResponse = t.Object({
		username: t.String(),
		name: t.String(),
		role: t.String(),
		workerType: t.Optional(t.String()),
	});
	export type meResponse = typeof meResponse.static;

	export function isJwtData(obj: unknown): obj is AuthModel.JWTData {
		return (
			obj !== null &&
			typeof obj === "object" &&
			"username" in obj &&
			"role" in obj &&
			typeof obj.role === "string" &&
			typeof obj.username === "string" &&
			(!("workerType" in obj) ||
				typeof (obj as any).workerType === "string" ||
				(obj as any).workerType === undefined)
		);
	}
}
