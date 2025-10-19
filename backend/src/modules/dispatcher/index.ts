// Controller for Dispatcher module - handles HTTP routing and request validation
import { Elysia } from "elysia";
import authMiddleware, { requireDispatcher } from "../auth/middleware";
import { DispatcherModel } from "./model";
import { DispatcherService } from "./service";

export const dispatcher = new Elysia({ prefix: "/api" })
	.use(authMiddleware)
	// ============================================================================
	// PENDING ORDERS
	// ============================================================================
	.get(
		"/orders/pending",
		async () => {
			return await DispatcherService.getPendingOrders();
		},
		{
			beforeHandle: requireDispatcher,
			response: {
				200: DispatcherModel.pendingOrdersResponse,
				401: DispatcherModel.errorResponse,
				403: DispatcherModel.errorResponse,
			},
			detail: {
				tags: ["Dispatcher - Orders"],
				summary: "Get pending orders",
				description: "Retrieves all orders with Pending status awaiting scheduling",
			},
		},
	)
	// ============================================================================
	// TRAIN TRIPS
	// ============================================================================
	.get(
		"/train-trips",
		async ({ query }) => {
			return await DispatcherService.getTrainTrips(query.destinationCityId);
		},
		{
			beforeHandle: requireDispatcher,
			query: DispatcherModel.trainTripsQuery,
			response: {
				200: DispatcherModel.trainTripsResponse,
				401: DispatcherModel.errorResponse,
				403: DispatcherModel.errorResponse,
			},
			detail: {
				tags: ["Dispatcher - Train Scheduling"],
				summary: "Get train trips",
				description:
					"Retrieves scheduled train trips with capacity information. Can be filtered by destination city.",
			},
		},
	)
	// ============================================================================
	// SHIPMENTS
	// ============================================================================
	.post(
		"/shipments",
		async ({ body }) => {
			return await DispatcherService.createShipment(body);
		},
		{
			beforeHandle: requireDispatcher,
			body: DispatcherModel.createShipmentBody,
			response: {
				201: DispatcherModel.createShipmentResponse,
				400: DispatcherModel.errorResponse,
				401: DispatcherModel.errorResponse,
				403: DispatcherModel.errorResponse,
				404: DispatcherModel.errorResponse,
			},
			detail: {
				tags: ["Dispatcher - Train Scheduling"],
				summary: "Create shipment",
				description:
					"Assigns a pending order to a train trip, creating a shipment and updating order status",
			},
		},
	)
	.get(
		"/shipments/at-store",
		async ({ query }) => {
			return await DispatcherService.getShipmentsAtStore(query.storeId);
		},
		{
			beforeHandle: requireDispatcher,
			query: DispatcherModel.shipmentsAtStoreQuery,
			response: {
				200: DispatcherModel.shipmentsAtStoreResponse,
				401: DispatcherModel.errorResponse,
				403: DispatcherModel.errorResponse,
			},
			detail: {
				tags: ["Dispatcher - Truck Scheduling"],
				summary: "Get shipments at store",
				description:
					"Retrieves shipments that have arrived at a store and are ready for truck delivery",
			},
		},
	)
	// ============================================================================
	// AVAILABLE RESOURCES
	// ============================================================================
	.get(
		"/resources/available",
		async () => {
			return await DispatcherService.getAvailableResources();
		},
		{
			beforeHandle: requireDispatcher,
			response: {
				200: DispatcherModel.availableResourcesResponse,
				401: DispatcherModel.errorResponse,
				403: DispatcherModel.errorResponse,
			},
			detail: {
				tags: ["Dispatcher - Truck Scheduling"],
				summary: "Get available resources",
				description:
					"Retrieves all available drivers, assistants, and trucks for scheduling",
			},
		},
	)
	// ============================================================================
	// TRUCK TRIPS
	// ============================================================================
	.post(
		"/truck-trips",
		async ({ body }) => {
			return await DispatcherService.createTruckTrip(body);
		},
		{
			beforeHandle: requireDispatcher,
			body: DispatcherModel.createTruckTripBody,
			response: {
				201: DispatcherModel.createTruckTripResponse,
				400: DispatcherModel.errorResponse,
				401: DispatcherModel.errorResponse,
				403: DispatcherModel.errorResponse,
			},
			detail: {
				tags: ["Dispatcher - Truck Scheduling"],
				summary: "Schedule truck trip",
				description:
					"Creates a new truck trip. Business rules are validated by database triggers.",
			},
		},
	)
	// ============================================================================
	// SCHEDULE OVERVIEW
	// ============================================================================
	.get(
		"/schedules/overview",
		async () => {
			return await DispatcherService.getScheduleOverview();
		},
		{
			beforeHandle: requireDispatcher,
			response: {
				200: DispatcherModel.scheduleOverviewResponse,
				401: DispatcherModel.errorResponse,
				403: DispatcherModel.errorResponse,
			},
			detail: {
				tags: ["Dispatcher - Overview"],
				summary: "Get schedule overview",
				description:
					"Retrieves a comprehensive overview of all scheduled train and truck trips",
			},
		},
	);
