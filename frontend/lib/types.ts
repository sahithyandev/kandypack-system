export interface Trip {
	id: string;
	origin: string;
	destination: string;
	eta: string;
	status: string;
}

export interface APIError {
	status: number;
	message: string;
}

export function isAPIError(error: unknown): error is APIError {
	return (
		error !== null &&
		typeof error === "object" &&
		"status" in error &&
		typeof error.status === "number" &&
		"message" in error &&
		typeof error.message === "string"
	);
}
