const AUTH_TOKEN_KEY = "authToken";

export interface JWTPayload {
	username: string;
	role: string;
	workerType?: string;
}

export function saveToken(token: string) {
	if (typeof window === "undefined") return;
	
	// Clear all cookies
	document.cookie.split(";").forEach((cookie) => {
		const eqPos = cookie.indexOf("=");
		const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
		document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=localhost`;
		document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
	});
	
	window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getToken() {
	if (typeof window === "undefined") return;
	return window.localStorage.getItem(AUTH_TOKEN_KEY) || undefined;
}

export async function removeToken() {
	if (typeof window === "undefined") return;
	
	// Send sign-out request to backend to invalidate session
	const token = getToken();
	if (token) {
		try {
			await fetch("http://localhost:2000/auth/sign-out", {
				method: "POST",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
		} catch (error) {
			console.error("Failed to sign out on backend:", error);
		}
	}
	
	// Clear all cookies
	document.cookie.split(";").forEach((cookie) => {
		const eqPos = cookie.indexOf("=");
		const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
		document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=localhost`;
		document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
	});
	
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
	console.log(decodeJWT(token));
	return decodeJWT(token);
}

export function isDispatcher(): boolean {
	const user = getUserFromToken();
	return user?.role === "Worker" && user?.workerType === "Dispatcher";
}

export function isStoreManager(): boolean {
	const user = getUserFromToken();
	return user?.role === "Worker" && user?.workerType === "Store_Manager";
}

export function isCustomer(): boolean {
	const user = getUserFromToken();
	return user?.role === "Customer";
}

// API function to get current user info from backend
export async function getCurrentUser(): Promise<JWTPayload | null> {
	const token = getToken();
	if (!token) return null;

	try {
		const response = await fetch("http://localhost:2000/auth/me", {
			method: "GET",
			credentials: "include",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			return null;
		}

		const data = await response.json();
		return {
			username: data.username,
			role: data.role,
			workerType: data.workerType,
		};
	} catch (error) {
		console.error("Failed to get current user:", error);
		return null;
	}
}
