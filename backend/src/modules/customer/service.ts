// Service handle business logic for Customer Portal
import { client } from "../../utils/db";
import type { CustomerModel } from "./model";

export abstract class CustomerService {
	// ========================================================================
	// GET ALL PRODUCTS
	// ========================================================================
	static async getProducts(): Promise<CustomerModel.ProductsResponse> {
		const result = await client.query<{
			id: string;
			name: string;
			unit_price: number;
		}>(
			`SELECT id, name, unit_price
			FROM Product
			ORDER BY name ASC`
		);

		return result.rows.map(row => ({
			productId: row.id,
			name: row.name,
			unitPrice: parseFloat(row.unit_price.toString()),
		}));
	}

	// ========================================================================
	// CREATE ORDER
	// ========================================================================
	static async createOrder(
		username: string,
		orderData: CustomerModel.CreateOrderBody
	): Promise<CustomerModel.CreateOrderResponse> {
		// Get customer ID from username
		const userResult = await client.query<{ id: string }>(
			`SELECT id FROM "User" WHERE username = $1 LIMIT 1`,
			[username]
		);

		if (userResult.rowCount === 0) {
			const error: any = new Error("Customer not found");
			error.status = 404;
			throw error;
		}

		const customerId = userResult.rows[0].id;

		// Validate delivery date is at least 7 days in the future
		const requiredDate = new Date(orderData.requiredDeliveryDate);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		
		const sevenDaysFromNow = new Date(today);
		sevenDaysFromNow.setDate(today.getDate() + 7);

		if (requiredDate < sevenDaysFromNow) {
			const error: any = new Error("Required delivery date must be at least 7 days from today.");
			error.status = 400;
			throw error;
		}

		// Validate all products exist and calculate total value and space units
		let totalValue = 0;
		let totalSpaceUnits = 0;

		const productDetails: Array<{
			productId: string;
			quantity: number;
			unitPrice: number;
			spaceConsumptionRate: number;
		}> = [];

		for (const item of orderData.items) {
			const productResult = await client.query<{
				id: string;
				unit_price: number;
				space_consumption_rate: number;
			}>(
				`SELECT id, unit_price, space_consumption_rate
				FROM Product
				WHERE id = $1
				LIMIT 1`,
				[item.productId]
			);

			if (productResult.rowCount === 0) {
				const error: any = new Error(`Product ${item.productId} not found`);
				error.status = 400;
				throw error;
			}

			const product = productResult.rows[0];
			const itemValue = parseFloat(product.unit_price.toString()) * item.quantity;
			const itemSpaceUnits = parseFloat(product.space_consumption_rate.toString()) * item.quantity;

			totalValue += itemValue;
			totalSpaceUnits += itemSpaceUnits;

			productDetails.push({
				productId: item.productId,
				quantity: item.quantity,
				unitPrice: parseFloat(product.unit_price.toString()),
				spaceConsumptionRate: parseFloat(product.space_consumption_rate.toString()),
			});
		}

		try {
			await client.query('BEGIN');

			// Create order
			const orderId = `ord-${Bun.randomUUIDv7().substring(0, 8)}`;
			
			await client.query(
				`INSERT INTO "Order" (
					id, customer_id, delivery_address, required_delivery_date,
					status, total_value, total_space_units, placed_on
				)
				VALUES ($1, $2, $3, $4, 'Pending', $5, $6, CURRENT_TIMESTAMP)`,
				[
					orderId,
					customerId,
					orderData.deliveryAddress,
					orderData.requiredDeliveryDate,
					totalValue,
					totalSpaceUnits,
				]
			);

			// Create order items
			for (const item of orderData.items) {
				const orderItemId = `oi-${Bun.randomUUIDv7().substring(0, 8)}`;
				await client.query(
					`INSERT INTO Order_Item (id, order_id, product_id, quantity)
					VALUES ($1, $2, $3, $4)`,
					[orderItemId, orderId, item.productId, item.quantity]
				);
			}

			await client.query('COMMIT');

			return {
				orderId,
				status: "Pending",
				totalValue,
				message: "Order placed successfully. You will be notified of its status.",
			};
		} catch (error) {
			await client.query('ROLLBACK');
			console.error('Order creation error:', error);
			const err: any = new Error("Failed to create order");
			err.status = 500;
			throw err;
		}
	}

	// ========================================================================
	// GET CUSTOMER ORDERS (SUMMARY LIST)
	// ========================================================================
	static async getOrders(username: string): Promise<CustomerModel.OrdersListResponse> {
		// Get customer ID from username
		const userResult = await client.query<{ id: string }>(
			`SELECT id FROM "User" WHERE username = $1 LIMIT 1`,
			[username]
		);

		if (userResult.rowCount === 0) {
			const error: any = new Error("Customer not found");
			error.status = 404;
			throw error;
		}

		const customerId = userResult.rows[0].id;

		const result = await client.query<{
			id: string;
			placed_on: Date;
			total_value: number;
			status: string;
		}>(
			`SELECT id, placed_on, total_value, status
			FROM "Order"
			WHERE customer_id = $1
			ORDER BY placed_on DESC`,
			[customerId]
		);

		return result.rows.map(row => ({
			orderId: row.id,
			placedOn: row.placed_on.toISOString(),
			totalValue: parseFloat(row.total_value.toString()),
			status: row.status,
		}));
	}

	// ========================================================================
	// GET ORDER DETAILS
	// ========================================================================
	static async getOrderDetail(
		username: string,
		orderId: string
	): Promise<CustomerModel.OrderDetail> {
		// Get customer ID from username
		const userResult = await client.query<{ id: string }>(
			`SELECT id FROM "User" WHERE username = $1 LIMIT 1`,
			[username]
		);

		if (userResult.rowCount === 0) {
			const error: any = new Error("Customer not found");
			error.status = 404;
			throw error;
		}

		const customerId = userResult.rows[0].id;

		// Get order details
		const orderResult = await client.query<{
			id: string;
			status: string;
			placed_on: Date;
			delivery_address: string;
			total_value: number;
		}>(
			`SELECT id, status, placed_on, delivery_address, total_value
			FROM "Order"
			WHERE id = $1 AND customer_id = $2
			LIMIT 1`,
			[orderId, customerId]
		);

		if (orderResult.rowCount === 0) {
			const error: any = new Error("Order not found");
			error.status = 404;
			throw error;
		}

		const order = orderResult.rows[0];

		// Get order items
		const itemsResult = await client.query<{
			product_name: string;
			quantity: number;
		}>(
			`SELECT p.name as product_name, oi.quantity
			FROM Order_Item oi
			JOIN Product p ON oi.product_id = p.id
			WHERE oi.order_id = $1
			ORDER BY p.name ASC`,
			[orderId]
		);

		const items = itemsResult.rows.map(row => ({
			productName: row.product_name,
			quantity: row.quantity,
		}));

		// Build status history
		// Note: Without a proper status log table, we can only show the current status
		// In a production system, you'd want to create an Order_Status_Log table
		const statusHistory: CustomerModel.StatusHistoryEntry[] = [
			{
				status: order.status,
				timestamp: order.placed_on.toISOString(),
			}
		];

		// Try to get more detailed history from related records if available
		// This is a simplified approach - ideally use a dedicated status log table
		if (order.status !== "Pending") {
			const shipmentResult = await client.query<{
				status: string;
				shipped_at: Date | null;
			}>(
				`SELECT status, shipped_at
				FROM Shipment
				WHERE order_id = $1
				LIMIT 1`,
				[orderId]
			);

			if (shipmentResult.rowCount !== null && shipmentResult.rowCount > 0) {
				const shipment = shipmentResult.rows[0];
				
				if (shipment.shipped_at && (shipment.status === "In_Transit" || shipment.status === "Delivered")) {
					statusHistory.push({
						status: "In_Train_Transit",
						timestamp: shipment.shipped_at.toISOString(),
					});
				}

				if (shipment.shipped_at && shipment.status === "Delivered") {
					statusHistory.push({
						status: "At_Store",
						timestamp: shipment.shipped_at.toISOString(),
					});
				}
			}
		}

		return {
			orderId: order.id,
			status: order.status,
			placedOn: order.placed_on.toISOString(),
			deliveryAddress: order.delivery_address,
			totalValue: parseFloat(order.total_value.toString()),
			items,
			statusHistory,
		};
	}
}
