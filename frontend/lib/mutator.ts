import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { getToken } from "./auth";
import type { APIError } from "./types";

export const AXIOS_INSTANCE = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL_CLIENT || "http://localhost:2000",
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
	if (config.headers.Authorization) return config;

	const token = getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

export const customInstance = <T>(
	config: AxiosRequestConfig,
	options?: AxiosRequestConfig,
): Promise<T> => {
	const source = axios.CancelToken.source();
	const promise = AXIOS_INSTANCE({
		...config,
		...options,
		cancelToken: source.token,
	})
		.then(({ data }) => data)
		.catch((err) => {
			if (axios.isAxiosError(err) && err.response) {
				const status = err.response.status;
				const data = err.response.data;
				if (status === 400 || status === 500) {
					throw {
						status,
						message: data.message,
					} satisfies APIError;
				}
			}
			throw err;
		});

	// @ts-ignore
	promise.cancel = () => {
		source.cancel("Query was cancelled");
	};

	return promise;
};

export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;
