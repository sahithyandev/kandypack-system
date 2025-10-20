import axios from "axios";
import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_CLIENT || "http://localhost:2000";

const customerApi = axios.create({
	baseURL: API_BASE_URL,
});

// Add auth token to requests from NextAuth session
customerApi.interceptors.request.use(async (config) => {
	const session = await getSession();
	if (session?.accessToken) {
		config.headers.Authorization = `Bearer ${session.accessToken}`;
	}
	return config;
});


export interface Product {
	productId: string;
	name: string;
	unitPrice: number;
}

export interface OrderItem {
	productId: string;
	quantity: number;
}

export interface CreateOrderRequest {
	deliveryAddress: string;
	requiredDeliveryDate: string;
	items: OrderItem[];
}

export interface CreateOrderResponse {
	orderId: string;
	status: string;
	totalValue: number;
	message: string;
}

export interface OrderSummary {
	orderId: string;
	placedOn: string;
	totalValue: number;
	status: string;
}

export interface OrderItemDetail {
	productName: string;
	quantity: number;
}

export interface StatusHistoryEntry {
	status: string;
	timestamp: string;
}

export interface OrderDetail {
	orderId: string;
	status: string;
	placedOn: string;
	deliveryAddress: string;
	totalValue: number;
	items: OrderItemDetail[];
	statusHistory: StatusHistoryEntry[];
}

export const customerAPI = {
	// Get all available products
	getProducts: async (): Promise<Product[]> => {
		const response = await customerApi.get("/api/products");
		return response.data;
	},

	// Create a new order
	createOrder: async (orderData: CreateOrderRequest): Promise<CreateOrderResponse> => {
		const response = await customerApi.post("/api/orders", orderData);
		return response.data;
	},

	// Get all orders for the authenticated customer
	getOrders: async (): Promise<OrderSummary[]> => {
		const response = await customerApi.get("/api/orders");
		return response.data;
	},

	// Get detailed information for a specific order
	getOrderDetail: async (orderId: string): Promise<OrderDetail> => {
		const response = await customerApi.get(`/api/orders/${orderId}`);
		return response.data;
	},
};

export default customerAPI;