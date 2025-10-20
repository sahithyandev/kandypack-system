// Controller handle HTTP routing for Customer Portal
import { Elysia, t } from "elysia";
import jwtInstance from "../../utils/jwt";
import authMiddleware, { requireCustomer } from "../auth/middleware";
import { CustomerModel } from "./model";
import { CustomerService } from "./service";

export const customer = new Elysia({ prefix: "/api" })
	.use(jwtInstance)
	.use(authMiddleware)
	// ========================================================================
	// GET /api/products - Get all available products
	// ========================================================================
	.get(
		"/products",
		async ({ set }) => {
			try {
				return await CustomerService.getProducts();
			} catch (error: any) {
				set.status = error.status || 500;
				return { error: error.message || "Failed to fetch products" };
			}
		},
		{
			beforeHandle: requireCustomer,
			response: {
				200: CustomerModel.productsResponse,
				400: CustomerModel.errorResponse,
				401: CustomerModel.errorResponse,
				403: CustomerModel.errorResponse,
				500: CustomerModel.errorResponse,
			},
			detail: {
				tags: ["Customer Portal"],
				summary: "Get all available products",
				description: "Retrieves a list of all products that can be ordered",
			},
		}
	)
	// ========================================================================
	// POST /api/orders - Create a new order
	// ========================================================================
	.post(
		"/orders",
		async ({ body, user, set }: any) => {
			try {
				const result = await CustomerService.createOrder(user.username, body);
				set.status = 201; // Set 201 Created status
				return result;
			} catch (error: any) {
				set.status = error.status || 500;
				return { error: error.message || "Failed to create order" };
			}
		},
		{
			beforeHandle: requireCustomer,
			body: CustomerModel.createOrderBody,
			response: {
				201: CustomerModel.createOrderResponse,
				400: CustomerModel.errorResponse,
				401: CustomerModel.errorResponse,
				403: CustomerModel.errorResponse,
				500: CustomerModel.errorResponse,
			},
			detail: {
				tags: ["Customer Portal"],
				summary: "Create a new order",
				description: "Submits a new order. The required delivery date must be at least 7 days in the future.",
			},
		}
	)
	// ========================================================================
	// GET /api/orders - Get all orders for the authenticated customer
	// ========================================================================
	.get(
		"/orders",
		async ({ user, set }: any) => {
			try {
				return await CustomerService.getOrders(user.username);
			} catch (error: any) {
				set.status = error.status || 500;
				return { error: error.message || "Failed to fetch orders" };
			}
		},
		{
			beforeHandle: requireCustomer,
			response: {
				200: CustomerModel.ordersListResponse,
				401: CustomerModel.errorResponse,
				403: CustomerModel.errorResponse,
				404: CustomerModel.errorResponse,
				500: CustomerModel.errorResponse,
			},
			detail: {
				tags: ["Customer Portal"],
				summary: "Get customer orders",
				description: "Retrieves a summary list of all orders placed by the authenticated customer",
			},
		}
	)
	// ========================================================================
	// GET /api/orders/:orderId - Get detailed information for a specific order
	// ========================================================================
	.get(
		"/orders/:orderId",
		async ({ params, user, set }: any) => {
			try {
				return await CustomerService.getOrderDetail(user.username, params.orderId);
			} catch (error: any) {
				set.status = error.status || 500;
				return { error: error.message || "Failed to fetch order details" };
			}
		},
		{
			beforeHandle: requireCustomer,
			params: t.Object({
				orderId: t.String(),
			}),
			response: {
				200: CustomerModel.orderDetail,
				401: CustomerModel.errorResponse,
				403: CustomerModel.errorResponse,
				404: CustomerModel.errorResponse,
				500: CustomerModel.errorResponse,
			},
			detail: {
				tags: ["Customer Portal"],
				summary: "Get order details",
				description: "Retrieves detailed status and history of a single order",
			},
		}
	);
