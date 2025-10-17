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

/**
 * Generic worker type authorization handler
 * Checks if the current user has the required worker type
 */
export const requireWorkerType = (requiredType: string) => {
	return async (context: any) => {
		const { headers, jwt, set } = context;
		
		const authHeader = headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			set.status = 401;
			return { error: "Missing or invalid authorization header" };
		}

		const token = authHeader.substring(7);
		const payload = await jwt.verify(token);

		if (!payload || !AuthModel.isJwtData(payload)) {
			set.status = 401;
			return { error: "Invalid or expired token" };
		}

		// Check if user is a worker
		if (payload.role !== "Worker") {
			set.status = 403;
			return { error: "Access denied. Worker role required." };
		}

		// Check if user has the required worker type
		if (payload.workerType !== requiredType) {
			set.status = 403;
			return { error: `Access denied. ${requiredType} role required.` };
		}

		// Store user info in context for handlers to access
		(context as any).user = {
			username: payload.username,
			role: payload.role,
			workerType: payload.workerType,
		};
	};
};

/**
 * Dispatcher-specific authentication handler
 */
export const requireDispatcher = requireWorkerType("Dispatcher");

/**
 * Store Manager-specific authentication handler
 */
export const requireStoreManager = requireWorkerType("Store_Manager");

export default authMiddleware;
