/**
 * Mock Data Structures for Kandypack Logistics System
 *
 * This file contains TypeScript interfaces and mock data for the customer portal.
 * Used for demonstration purposes without requiring backend integration.
 */

/**
 * Product interface representing FMCG items available for order
 */
export interface Product {
	/** Unique product identifier */
	id: number;
	/** Product display name */
	name: string;
	/** Price in Sri Lankan Rupees (LKR) */
	price: number;
	/** Product category for filtering and organization */
	category: string;
	/** Available stock quantity */
	stock: number;
	/** Optional product image URL */
	image?: string;
}

/**
 * Delivery route interface representing available shipping destinations
 */
export interface Route {
	/** Unique route identifier */
	id: number;
	/** Route display name */
	name: string;
	/** Destination city */
	city: string;
	/** Maximum delivery time estimate */
	maxDeliveryTime: string;
}

/**
 * Individual item within an order
 */
export interface OrderItem {
	/** Reference to product ID */
	productId: number;
	/** Product name at time of order (for historical accuracy) */
	productName: string;
	/** Quantity ordered */
	quantity: number;
	/** Price per unit at time of order */
	unitPrice: number;
	/** Total price for this item (quantity × unitPrice) */
	totalPrice: number;
}

/**
 * Complete order information with tracking status
 */
export interface Order {
	/** Unique order identifier (format: ORD###) */
	id: string;
	/** Customer who placed the order */
	customerId: number;
	/** List of ordered items */
	items: OrderItem[];
	/** Current order status in the 5-stage delivery process */
	status:
		| "placed"
		| "train_scheduled"
		| "in_transit"
		| "out_for_delivery"
		| "delivered";
	/** Date order was placed (ISO format) */
	orderDate: string;
	/** Expected/actual delivery date (ISO format) */
	deliveryDate: string;
	/** Delivery route ID */
	routeId: number;
	/** Delivery route name (cached for display) */
	routeName: string;
	/** Total order amount in LKR */
	totalAmount: number;
	/** Customer's delivery address */
	deliveryAddress: string;
}

/**
 * Notification for order updates and system messages
 */
export interface Notification {
	/** Unique notification identifier */
	id: string;
	/** Notification title/subject */
	title: string;
	/** Detailed notification message */
	message: string;
	/** Notification category for styling and filtering */
	type: "order_update" | "delivery" | "system";
	/** Notification timestamp (ISO format) */
	date: string;
	/** Whether notification has been read by user */
	read: boolean;
	/** Optional associated order ID for order-related notifications */
	orderId?: string;
}

/**
 * Customer account information
 */
export interface Customer {
	/** Unique customer identifier */
	id: number;
	/** Customer's full name */
	name: string;
	/** Customer's email address */
	email: string;
	/** Customer's phone number */
	phone: string;
	/** Customer's primary address */
	address: string;
}

/**
 * Mock Products Data
 *
 * 15 Fast-Moving Consumer Goods (FMCG) items representing typical Sri Lankan products.
 * Categories: cleaning, personal_care, snacks, beverages, dairy, food
 * Prices are in Sri Lankan Rupees (LKR)
 */
export const mockProducts: Product[] = [
	{
		id: 1,
		name: "Sunlight Detergent 1kg",
		price: 450,
		category: "cleaning",
		stock: 50,
	},
	{
		id: 2,
		name: "Lifebuoy Soap Bar",
		price: 85,
		category: "personal_care",
		stock: 100,
	},
	{
		id: 3,
		name: "Lux Beauty Soap",
		price: 95,
		category: "personal_care",
		stock: 75,
	},
	{
		id: 4,
		name: "Vim Dishwash Bar",
		price: 35,
		category: "cleaning",
		stock: 80,
	},
	{
		id: 5,
		name: "Munchee Cream Cracker",
		price: 120,
		category: "snacks",
		stock: 60,
	},
	{
		id: 6,
		name: "Elephant House Ginger Beer",
		price: 180,
		category: "beverages",
		stock: 40,
	},
	{
		id: 7,
		name: "Maliban Kiri Milk Powder 400g",
		price: 850,
		category: "dairy",
		stock: 30,
	},
	{
		id: 8,
		name: "Siddhalepa Toothpaste",
		price: 165,
		category: "personal_care",
		stock: 45,
	},
	{
		id: 9,
		name: "Prima Kotomalli Rice 5kg",
		price: 1200,
		category: "food",
		stock: 25,
	},
	{
		id: 10,
		name: "CBL Munchee Lemon Puff",
		price: 95,
		category: "snacks",
		stock: 70,
	},
	{
		id: 11,
		name: "Harpic Toilet Cleaner",
		price: 275,
		category: "cleaning",
		stock: 35,
	},
	{
		id: 12,
		name: "Anchor Milk Powder 400g",
		price: 920,
		category: "dairy",
		stock: 20,
	},
	{
		id: 13,
		name: "Tipi Tip Biscuits",
		price: 85,
		category: "snacks",
		stock: 90,
	},
	{
		id: 14,
		name: "Signal Toothbrush",
		price: 125,
		category: "personal_care",
		stock: 55,
	},
	{
		id: 15,
		name: "Ratthi Coconut Oil 375ml",
		price: 380,
		category: "food",
		stock: 40,
	},
];

/**
 * Mock Delivery Routes Data
 *
 * 10 major Sri Lankan cities with estimated delivery times.
 * Delivery times are calculated based on distance and train schedules.
 */
export const mockRoutes: Route[] = [
	{
		id: 1,
		name: "Colombo Central",
		city: "Colombo",
		maxDeliveryTime: "2 days",
	},
	{ id: 2, name: "Galle Road South", city: "Galle", maxDeliveryTime: "3 days" },
	{ id: 3, name: "Kandy Hills", city: "Kandy", maxDeliveryTime: "3 days" },
	{ id: 4, name: "Negombo Beach", city: "Negombo", maxDeliveryTime: "2 days" },
	{ id: 5, name: "Matara Express", city: "Matara", maxDeliveryTime: "4 days" },
	{ id: 6, name: "Jaffna Northern", city: "Jaffna", maxDeliveryTime: "5 days" },
	{
		id: 7,
		name: "Anuradhapura Ancient",
		city: "Anuradhapura",
		maxDeliveryTime: "4 days",
	},
	{
		id: 8,
		name: "Batticaloa East",
		city: "Batticaloa",
		maxDeliveryTime: "4 days",
	},
	{
		id: 9,
		name: "Ratnapura Gems",
		city: "Ratnapura",
		maxDeliveryTime: "3 days",
	},
	{
		id: 10,
		name: "Trincomalee Harbor",
		city: "Trincomalee",
		maxDeliveryTime: "5 days",
	},
];

/**
 * Mock Orders Data
 *
 * Sample orders demonstrating the 5-stage delivery process:
 * 1. placed - Order confirmed, awaiting processing
 * 2. train_scheduled - Scheduled for train transport
 * 3. in_transit - Currently being transported
 * 4. out_for_delivery - Final delivery in progress
 * 5. delivered - Successfully delivered to customer
 */
export const mockOrders: Order[] = [
	{
		id: "ORD001",
		customerId: 1,
		items: [
			{
				productId: 1,
				productName: "Sunlight Detergent 1kg",
				quantity: 2,
				unitPrice: 450,
				totalPrice: 900,
			},
			{
				productId: 2,
				productName: "Lifebuoy Soap Bar",
				quantity: 5,
				unitPrice: 85,
				totalPrice: 425,
			},
		],
		status: "delivered",
		orderDate: "2024-01-15",
		deliveryDate: "2024-01-25",
		routeId: 1,
		routeName: "Colombo Central",
		totalAmount: 1325,
		deliveryAddress: "No. 123, Galle Road, Colombo 03",
	},
	{
		id: "ORD002",
		customerId: 1,
		items: [
			{
				productId: 9,
				productName: "Prima Kotomalli Rice 5kg",
				quantity: 1,
				unitPrice: 1200,
				totalPrice: 1200,
			},
			{
				productId: 7,
				productName: "Maliban Kiri Milk Powder 400g",
				quantity: 2,
				unitPrice: 850,
				totalPrice: 1700,
			},
		],
		status: "out_for_delivery",
		orderDate: "2024-09-15",
		deliveryDate: "2024-09-25",
		routeId: 2,
		routeName: "Galle Road South",
		totalAmount: 2900,
		deliveryAddress: "No. 456, Main Street, Galle",
	},
	{
		id: "ORD003",
		customerId: 1,
		items: [
			{
				productId: 5,
				productName: "Munchee Cream Cracker",
				quantity: 3,
				unitPrice: 120,
				totalPrice: 360,
			},
			{
				productId: 6,
				productName: "Elephant House Ginger Beer",
				quantity: 6,
				unitPrice: 180,
				totalPrice: 1080,
			},
		],
		status: "in_transit",
		orderDate: "2024-09-18",
		deliveryDate: "2024-09-28",
		routeId: 3,
		routeName: "Kandy Hills",
		totalAmount: 1440,
		deliveryAddress: "No. 789, Temple Road, Kandy",
	},
	{
		id: "ORD004",
		customerId: 1,
		items: [
			{
				productId: 3,
				productName: "Lux Beauty Soap",
				quantity: 4,
				unitPrice: 95,
				totalPrice: 380,
			},
			{
				productId: 8,
				productName: "Siddhalepa Toothpaste",
				quantity: 2,
				unitPrice: 165,
				totalPrice: 330,
			},
		],
		status: "train_scheduled",
		orderDate: "2024-09-20",
		deliveryDate: "2024-09-30",
		routeId: 4,
		routeName: "Negombo Beach",
		totalAmount: 710,
		deliveryAddress: "No. 321, Beach Road, Negombo",
	},
	{
		id: "ORD005",
		customerId: 1,
		items: [
			{
				productId: 11,
				productName: "Harpic Toilet Cleaner",
				quantity: 1,
				unitPrice: 275,
				totalPrice: 275,
			},
			{
				productId: 4,
				productName: "Vim Dishwash Bar",
				quantity: 8,
				unitPrice: 35,
				totalPrice: 280,
			},
		],
		status: "placed",
		orderDate: "2024-09-22",
		deliveryDate: "2024-10-02",
		routeId: 5,
		routeName: "Matara Express",
		totalAmount: 555,
		deliveryAddress: "No. 654, Coast Road, Matara",
	},
];

/**
 * Mock Notifications Data
 *
 * System notifications for order updates, delivery status, and general announcements.
 * Types: order_update, delivery, system
 */
export const mockNotifications: Notification[] = [
	{
		id: "NOT001",
		title: "Order Delivered",
		message:
			"Your order ORD001 has been successfully delivered to Colombo Central.",
		type: "delivery",
		date: "2024-01-25T10:30:00Z",
		read: true,
		orderId: "ORD001",
	},
	{
		id: "NOT002",
		title: "Order Out for Delivery",
		message:
			"Your order ORD002 is now out for delivery and will reach you today.",
		type: "order_update",
		date: "2024-09-25T08:15:00Z",
		read: false,
		orderId: "ORD002",
	},
	{
		id: "NOT003",
		title: "Order In Transit",
		message: "Your order ORD003 is currently in transit to Kandy Hills route.",
		type: "order_update",
		date: "2024-09-24T14:20:00Z",
		read: false,
		orderId: "ORD003",
	},
	{
		id: "NOT004",
		title: "Train Scheduled",
		message:
			"Your order ORD004 has been scheduled for train transport to Negombo Beach.",
		type: "order_update",
		date: "2024-09-23T09:45:00Z",
		read: false,
		orderId: "ORD004",
	},
	{
		id: "NOT005",
		title: "Order Confirmed",
		message:
			"Your order ORD005 has been placed successfully and will be processed within 24 hours.",
		type: "order_update",
		date: "2024-09-22T16:30:00Z",
		read: true,
		orderId: "ORD005",
	},
	{
		id: "NOT006",
		title: "System Maintenance",
		message:
			"Scheduled maintenance will occur on Sunday 2AM-4AM. Service may be temporarily unavailable.",
		type: "system",
		date: "2024-09-20T12:00:00Z",
		read: false,
	},
];

/**
 * Mock Customer Data
 *
 * Default customer account for demo authentication system.
 */
export const mockCustomer: Customer = {
	id: 1,
	name: "John Perera",
	email: "john.perera@email.com",
	phone: "+94 77 123 4567",
	address: "No. 123, Galle Road, Colombo 03",
};

/**
 * Helper Functions for Data Access
 *
 * Utility functions to retrieve specific data items by ID or filter by customer.
 * In a real application, these would be API calls to the backend.
 */

/**
 * Find a product by its unique ID
 * @param id - Product ID to search for
 * @returns Product object or undefined if not found
 */
export const getProductById = (id: number): Product | undefined => {
	return mockProducts.find((product) => product.id === id);
};

/**
 * Find a delivery route by its unique ID
 * @param id - Route ID to search for
 * @returns Route object or undefined if not found
 */
export const getRouteById = (id: number): Route | undefined => {
	return mockRoutes.find((route) => route.id === id);
};

/**
 * Find an order by its unique ID
 * @param id - Order ID to search for (format: ORD###)
 * @returns Order object or undefined if not found
 */
export const getOrderById = (id: string): Order | undefined => {
	return mockOrders.find((order) => order.id === id);
};

/**
 * Get all notifications for a customer
 * @param customerId - Customer ID to filter notifications
 * @returns Array of notifications (currently returns all mock notifications)
 */
export const getNotificationsByCustomer = (
	customerId: number,
): Notification[] => {
	return mockNotifications;
};

/**
 * Get all orders for a specific customer
 * @param customerId - Customer ID to filter orders
 * @returns Array of orders belonging to the customer
 */
export const getOrdersByCustomer = (customerId: number): Order[] => {
	return mockOrders.filter((order) => order.customerId === customerId);
};
