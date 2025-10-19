// Controller for Store Manager module - handles HTTP routing and request validation
import { Elysia } from "elysia";
import authMiddleware, { requireStoreManager } from "../auth/middleware";
import { StoreManagerModel } from "./model";
import { StoreManagerService } from "./service";

export const storeManager = new Elysia({ prefix: "/api" })
	.use(authMiddleware)
	// ============================================================================
	// INCOMING DELIVERIES
	// ============================================================================
	.get(
		"/stores/incoming-deliveries",
		async ({ user }: any) => {
			// Extract store manager ID from authenticated user
			const storeManagerUsername = user.username; // The username is the user ID
			return await StoreManagerService.getIncomingDeliveries(storeManagerUsername);
		},
		{
			beforeHandle: requireStoreManager,
			response: {
				200: StoreManagerModel.incomingDeliveriesResponse,
				401: StoreManagerModel.errorResponse,
				403: StoreManagerModel.errorResponse,
				404: StoreManagerModel.errorResponse,
			},
			detail: {
				tags: ["Store Manager - Incoming Deliveries"],
				summary: "Get incoming deliveries",
				description: "Retrieves all shipments on trains arriving at the manager's store",
			},
		}
	)
	// ============================================================================
	// SCHEDULED DEPARTURES
	// ============================================================================
	.get(
		"/truck-trips/scheduled-departures",
		async ({ user }: any) => {
			const storeManagerId = user.username;
			return await StoreManagerService.getScheduledDepartures(storeManagerId);
		},
		{
			beforeHandle: requireStoreManager,
			response: {
				200: StoreManagerModel.scheduledDeparturesResponse,
				401: StoreManagerModel.errorResponse,
				403: StoreManagerModel.errorResponse,
				404: StoreManagerModel.errorResponse,
			},
			detail: {
				tags: ["Store Manager - Truck Dispatch"],
				summary: "Get scheduled departures",
				description: "Fetches all truck trips scheduled to depart from the manager's store",
			},
		}
	)
	// ============================================================================
	// DISPATCH TRUCK TRIP
	// ============================================================================
	.post(
		"/truck-trips/:tripId/dispatch",
		async ({ params, user }: any) => {
			const storeManagerId = user.username;
			return await StoreManagerService.dispatchTruckTrip(params.tripId, storeManagerId);
		},
		{
			beforeHandle: requireStoreManager,
			response: {
				200: StoreManagerModel.dispatchTruckTripResponse,
				400: StoreManagerModel.errorResponse,
				401: StoreManagerModel.errorResponse,
				403: StoreManagerModel.errorResponse,
				404: StoreManagerModel.errorResponse,
			},
			detail: {
				tags: ["Store Manager - Truck Dispatch"],
				summary: "Dispatch truck trip",
				description: "Confirms the actual departure of a truck trip, marking the start of delivery",
			},
		}
	)
	// ============================================================================
	// IN PROGRESS TRIPS
	// ============================================================================
	.get(
		"/truck-trips/in-progress",
		async ({ user }: any) => {
			const storeManagerId = user.username;
			return await StoreManagerService.getInProgressTrips(storeManagerId);
		},
		{
			beforeHandle: requireStoreManager,
			response: {
				200: StoreManagerModel.inProgressTripsResponse,
				401: StoreManagerModel.errorResponse,
				403: StoreManagerModel.errorResponse,
				404: StoreManagerModel.errorResponse,
			},
			detail: {
				tags: ["Store Manager - Delivery Confirmation"],
				summary: "Get in-progress trips",
				description: "Retrieves all truck trips currently in progress from the manager's store",
			},
		}
	)
	// ============================================================================
	// COMPLETE TRUCK TRIP
	// ============================================================================
	.post(
		"/truck-trips/:tripId/complete",
		async ({ params, user }: any) => {
			const storeManagerId = user.username;
			return await StoreManagerService.completeTruckTrip(params.tripId, storeManagerId);
		},
		{
			beforeHandle: requireStoreManager,
			response: {
				200: StoreManagerModel.completeTruckTripResponse,
				400: StoreManagerModel.errorResponse,
				401: StoreManagerModel.errorResponse,
				403: StoreManagerModel.errorResponse,
				404: StoreManagerModel.errorResponse,
			},
			detail: {
				tags: ["Store Manager - Delivery Confirmation"],
				summary: "Complete truck trip",
				description: "Marks a truck trip as completed, finalizing delivery and logging worker hours",
			},
		}
	);
