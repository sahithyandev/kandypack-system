// Model definitions for Dispatcher API endpoints
import { t } from "elysia";

export namespace DispatcherModel {
	// ============================================================================
	// PENDING ORDERS
	// ============================================================================
	export const pendingOrder = t.Object({
		orderId: t.String(),
		customerName: t.String(),
		destinationCity: t.String(),
		placedOn: t.String(),
		requiredDeliveryDate: t.String(),
		totalValue: t.Number(),
		totalSpaceUnits: t.Number(),
	});
	export type PendingOrder = typeof pendingOrder.static;

	export const pendingOrdersResponse = t.Array(pendingOrder);
	export type PendingOrdersResponse = typeof pendingOrdersResponse.static;

	// ============================================================================
	// TRAIN TRIPS
	// ============================================================================
	export const trainTrip = t.Object({
		trainTripId: t.String(),
		trainName: t.String(),
		fromCity: t.String(),
		toCity: t.String(),
		scheduledDeparture: t.String(),
		scheduledArrival: t.String(),
		capacityUnits: t.Number(),
		allocatedUnits: t.Number(),
		availableUnits: t.Number(),
	});
	export type TrainTrip = typeof trainTrip.static;

	export const trainTripsResponse = t.Array(trainTrip);
	export type TrainTripsResponse = typeof trainTripsResponse.static;

	export const trainTripsQuery = t.Object({
		destinationCityId: t.Optional(t.String()),
	});
	export type TrainTripsQuery = typeof trainTripsQuery.static;

	// ============================================================================
	// SHIPMENTS
	// ============================================================================
	export const createShipmentBody = t.Object({
		orderId: t.String(),
		trainTripId: t.String(),
	});
	export type CreateShipmentBody = typeof createShipmentBody.static;

	export const createShipmentResponse = t.Object({
		shipmentId: t.String(),
		orderId: t.String(),
		trainTripId: t.String(),
		status: t.String(),
		message: t.String(),
	});
	export type CreateShipmentResponse = typeof createShipmentResponse.static;

	export const shipmentAtStore = t.Object({
		shipmentId: t.String(),
		orderId: t.String(),
		customerName: t.String(),
		deliveryAddress: t.String(),
		routeId: t.String(),
		routeName: t.String(),
	});
	export type ShipmentAtStore = typeof shipmentAtStore.static;

	export const shipmentsAtStoreResponse = t.Array(shipmentAtStore);
	export type ShipmentsAtStoreResponse = typeof shipmentsAtStoreResponse.static;

	export const shipmentsAtStoreQuery = t.Object({
		storeId: t.Optional(t.String()),
	});
	export type ShipmentsAtStoreQuery = typeof shipmentsAtStoreQuery.static;

	// ============================================================================
	// AVAILABLE RESOURCES
	// ============================================================================
	export const worker = t.Object({
		workerId: t.String(),
		name: t.String(),
	});
	export type Worker = typeof worker.static;

	export const truck = t.Object({
		truckId: t.String(),
		vehicleNo: t.String(),
	});
	export type Truck = typeof truck.static;

	export const availableResourcesResponse = t.Object({
		drivers: t.Array(worker),
		assistants: t.Array(worker),
		trucks: t.Array(truck),
	});
	export type AvailableResourcesResponse =
		typeof availableResourcesResponse.static;

	// ============================================================================
	// TRUCK TRIPS
	// ============================================================================
	export const createTruckTripBody = t.Object({
		shipmentId: t.String(),
		truckId: t.String(),
		routeId: t.String(),
		driverId: t.String(),
		assistantId: t.Optional(t.String()),
		scheduledStart: t.String(),
		scheduledEnd: t.String(),
		distanceKm: t.Optional(t.Number()),
	});
	export type CreateTruckTripBody = typeof createTruckTripBody.static;

	export const createTruckTripResponse = t.Object({
		truckTripId: t.String(),
		status: t.String(),
		message: t.String(),
	});
	export type CreateTruckTripResponse = typeof createTruckTripResponse.static;

	// ============================================================================
	// SCHEDULE OVERVIEW
	// ============================================================================
	export const trainTripOverview = t.Object({
		trainTripId: t.String(),
		trainName: t.String(),
		toCity: t.String(),
		scheduledDeparture: t.String(),
		status: t.String(),
		shipmentCount: t.Number(),
	});
	export type TrainTripOverview = typeof trainTripOverview.static;

	export const truckTripOverview = t.Object({
		truckTripId: t.String(),
		vehicleNo: t.String(),
		routeName: t.String(),
		driverName: t.String(),
		scheduledStart: t.String(),
		status: t.String(),
	});
	export type TruckTripOverview = typeof truckTripOverview.static;

	export const scheduleOverviewResponse = t.Object({
		trainTrips: t.Array(trainTripOverview),
		truckTrips: t.Array(truckTripOverview),
	});
	export type ScheduleOverviewResponse = typeof scheduleOverviewResponse.static;

	// ============================================================================
	// ERROR RESPONSES
	// ============================================================================
	export const errorResponse = t.Object({
		error: t.String(),
	});
	export type ErrorResponse = typeof errorResponse.static;
}
