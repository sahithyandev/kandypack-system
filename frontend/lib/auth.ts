const AUTH_TOKEN_KEY = "authToken";

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
