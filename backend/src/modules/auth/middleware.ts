import { Elysia } from "elysia";
import jwtInstance from "../../utils/jwt";
import { AuthModel } from "./model";

const authMiddleware = new Elysia({
	name: "auth.middleware",
})
	.use(jwtInstance)
	.macro({
		currentUser: {
			resolve: async ({ headers, jwt, cookie: { logged_in } }) => {
				// Try 1: Get token from Cookie
				const cookieToken = logged_in.value;
				if (typeof cookieToken === "string" && cookieToken.length > 0) {
					try {
						const decoded = await jwt.verify(cookieToken);
						if (!AuthModel.isJwtData(decoded)) {
							return { currentUser: null };
						}
						return {
							currentUser: decoded,
						};
					} catch {
						return { currentUser: null };
					}
				}

				// Try 2: Get token from Authorization Header
				if (!headers.authorization) {
					return {
						currentUser: null,
					};
				}

				const token = headers.authorization.split(" ")[1];
				if (!token) {
					return {
						currentUser: null,
					};
				}
				try {
					const decoded = await jwt.verify(token);
					if (!AuthModel.isJwtData(decoded)) {
						return { currentUser: null };
					}

					return {
						currentUser: decoded,
					};
				} catch {
					return {
						currentUser: null,
					};
				}
			},
		},
	});

export default authMiddleware;
