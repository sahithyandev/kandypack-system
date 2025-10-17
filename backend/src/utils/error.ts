import { t } from "elysia";

export namespace APIError {
	export const response = t.Object({
		message: t.String(),
	});

	export type response = typeof response.static;
}
