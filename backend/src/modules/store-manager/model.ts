// Model definitions for Store Manager API endpoints
import { t } from "elysia";

export namespace StoreManagerModel {
	// ============================================================================
	// INCOMING DELIVERIES
	// ============================================================================
	export const incomingDelivery = t.Object({
		shipmentId: t.String(),
		trainTripId: t.String(),
		trainName: t.String(),
		fromCity: t.String(),
		scheduledArrival: t.String(),
		orderCount: t.Number(),
		totalUnits: t.Number(),
	});
	export type IncomingDelivery = typeof incomingDelivery.static;

	export const incomingDeliveriesResponse = t.Array(incomingDelivery);
	export type IncomingDeliveriesResponse = typeof incomingDeliveriesResponse.static;

	// ============================================================================
	// TRUCK TRIPS - SCHEDULED DEPARTURES
	// ============================================================================
	export const scheduledTruckTrip = t.Object({
		truckTripId: t.String(),
		vehicleNo: t.String(),
		routeName: t.String(),
		driverName: t.String(),
		assistantName: t.Nullable(t.String()),
		scheduledStart: t.String(),
		status: t.String(),
	});
	export type ScheduledTruckTrip = typeof scheduledTruckTrip.static;

	export const scheduledDeparturesResponse = t.Array(scheduledTruckTrip);
	export type ScheduledDeparturesResponse = typeof scheduledDeparturesResponse.static;

	// ============================================================================
	// TRUCK TRIPS - DISPATCH
	// ============================================================================
	export const dispatchTruckTripResponse = t.Object({
		truckTripId: t.String(),
		status: t.String(),
		actualStart: t.String(),
		message: t.String(),
	});
	export type DispatchTruckTripResponse = typeof dispatchTruckTripResponse.static;

	// ============================================================================
	// TRUCK TRIPS - IN PROGRESS
	// ============================================================================
	export const inProgressTruckTrip = t.Object({
		truckTripId: t.String(),
		vehicleNo: t.String(),
		driverName: t.String(),
		actualStart: t.String(),
		status: t.String(),
	});
	export type InProgressTruckTrip = typeof inProgressTruckTrip.static;

	export const inProgressTripsResponse = t.Array(inProgressTruckTrip);
	export type InProgressTripsResponse = typeof inProgressTripsResponse.static;

	// ============================================================================
	// TRUCK TRIPS - COMPLETE
	// ============================================================================
	export const completeTruckTripResponse = t.Object({
		truckTripId: t.String(),
		status: t.String(),
		actualEnd: t.String(),
		message: t.String(),
	});
	export type CompleteTruckTripResponse = typeof completeTruckTripResponse.static;

	// ============================================================================
	// ERROR RESPONSES
	// ============================================================================
	export const errorResponse = t.Object({
		error: t.String(),
	});
	export type ErrorResponse = typeof errorResponse.static;
}
