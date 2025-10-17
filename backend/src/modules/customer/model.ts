// Model definitions for Customer Portal API endpoints
import { t } from "elysia";

export namespace CustomerModel {
	// ============================================================================
	// PRODUCTS
	// ============================================================================
	export const product = t.Object({
		productId: t.String(),
		name: t.String(),
		unitPrice: t.Number(),
	});
	export type Product = typeof product.static;

	export const productsResponse = t.Array(product);
	export type ProductsResponse = typeof productsResponse.static;

	// ============================================================================
	// PLACE ORDER
	// ============================================================================
	export const orderItem = t.Object({
		productId: t.String(),
		quantity: t.Number(),
	});
	export type OrderItem = typeof orderItem.static;

	export const createOrderBody = t.Object({
		deliveryAddress: t.String(),
		requiredDeliveryDate: t.String(), // Date string in format YYYY-MM-DD
		items: t.Array(orderItem),
	});
	export type CreateOrderBody = typeof createOrderBody.static;

	export const createOrderResponse = t.Object({
		orderId: t.String(),
		status: t.String(),
		totalValue: t.Number(),
		message: t.String(),
	});
	export type CreateOrderResponse = typeof createOrderResponse.static;

	// ============================================================================
	// ORDER TRACKING
	// ============================================================================
	export const orderSummary = t.Object({
		orderId: t.String(),
		placedOn: t.String(), // ISO 8601 timestamp
		totalValue: t.Number(),
		status: t.String(),
	});
	export type OrderSummary = typeof orderSummary.static;

	export const ordersListResponse = t.Array(orderSummary);
	export type OrdersListResponse = typeof ordersListResponse.static;

	export const orderItemDetail = t.Object({
		productName: t.String(),
		quantity: t.Number(),
	});
	export type OrderItemDetail = typeof orderItemDetail.static;

	export const statusHistoryEntry = t.Object({
		status: t.String(),
		timestamp: t.String(), // ISO 8601 timestamp
	});
	export type StatusHistoryEntry = typeof statusHistoryEntry.static;

	export const orderDetail = t.Object({
		orderId: t.String(),
		status: t.String(),
		placedOn: t.String(),
		deliveryAddress: t.String(),
		totalValue: t.Number(),
		items: t.Array(orderItemDetail),
		statusHistory: t.Array(statusHistoryEntry),
	});
	export type OrderDetail = typeof orderDetail.static;

	// ============================================================================
	// ERROR RESPONSES
	// ============================================================================
	export const errorResponse = t.Object({
		error: t.String(),
	});
	export type ErrorResponse = typeof errorResponse.static;
}
