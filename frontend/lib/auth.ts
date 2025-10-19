const AUTH_TOKEN_KEY = "authToken";

export interface JWTPayload {
	username: string;
	role: string;
	workerType?: string;
}

export function saveToken(token: string) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getToken() {
	if (typeof window === "undefined") return;
	return window.localStorage.getItem(AUTH_TOKEN_KEY) || undefined;
}

export function removeToken() {
	if (typeof window === "undefined") return;
	window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function decodeJWT(token: string): JWTPayload | null {
	try {
		const parts = token.split('.');
		if (parts.length !== 3) return null;
		
		const payload = parts[1];
		const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
		return JSON.parse(decoded) as JWTPayload;
	} catch (error) {
		console.error('Failed to decode JWT:', error);
		return null;
	}
}

export function getUserFromToken(): JWTPayload | null {
	const token = getToken();
	if (!token) return null;
	return decodeJWT(token);
}

export function isDispatcher(): boolean {
	const user = getUserFromToken();
	return user?.role === "Worker" && user?.workerType === "Dispatcher";
}
