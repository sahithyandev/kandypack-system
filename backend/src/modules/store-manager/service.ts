// Service layer for Store Manager module - handles all business logic
import { status } from "elysia";
import { client } from "../../utils/db";
import type { StoreManagerModel } from "./model";

export abstract class StoreManagerService {
	// ============================================================================
	// HELPER: Get Store ID for Store Manager
	// ============================================================================

	/**
	 * Get the store ID managed by the given store manager
	 * @param storeManagerId - The ID of the store manager (from JWT)
	 * @returns The store ID, or throws 404 if not found
	 */
	private static async getStoreIdForManager(storeManagerUsername: string): Promise<string> {
		const result = await client.query<{ store_id: string }>(
			`SELECT s.id AS store_id
			FROM Store s
			JOIN "User" u ON u.id = s.managed_by
			WHERE u.username = $1`,
			[storeManagerUsername]
		);

		if (result.rowCount === 0) {
			throw status(404, { error: "No store found for this manager" });
		}

		return result.rows[0].store_id;
	}

	// ============================================================================
	// INCOMING DELIVERIES
	// ============================================================================

	/**
	 * Get all shipments on trains arriving at the manager's store
	 */
	static async getIncomingDeliveries(
		storeManagerUsername: string
	): Promise<StoreManagerModel.IncomingDeliveriesResponse> {
		// First get the store ID for this manager
		const storeId = await this.getStoreIdForManager(storeManagerUsername);

		// Get store's city ID
		const storeResult = await client.query<{ city_id: string }>(
			`SELECT city_id FROM Store WHERE id = $1`,
			[storeId]
		);

		if (storeResult.rowCount === 0) {
			throw status(404, { error: "Store not found" });
		}

		const storeCityId = storeResult.rows[0].city_id;

		// Get all shipments on trains arriving at this city
		const result = await client.query<{
			shipment_id: string;
			train_trip_id: string;
			train_name: string;
			from_city: string;
			scheduled_arrival: Date;
			order_count: number;
			total_units: number;
		}>(
			`SELECT 
				tt.id AS train_trip_id,
				t.name AS train_name,
				c.name AS from_city,
				tt.scheduled_arrival,
				COUNT(DISTINCT s.id) AS order_count,
				COALESCE(SUM(s.allocated_space_units), 0) AS total_units
			FROM Train_Trip tt
			JOIN Train t ON tt.train_id = t.id
			JOIN City c ON tt.from_city_id = c.id
			LEFT JOIN Shipment s ON tt.id = s.train_trip_id
			WHERE tt.to_city_id = $1
			AND tt.scheduled_arrival > NOW()
			GROUP BY tt.id, t.name, c.name, tt.scheduled_arrival
			ORDER BY tt.scheduled_arrival ASC`,
			[storeCityId]
		);

		// Transform the results - we need to return one row per shipment, not per train trip
		// Let me fix this query to match the API spec
		const shipmentsResult = await client.query<{
			shipment_id: string;
			train_trip_id: string;
			train_name: string;
			from_city: string;
			scheduled_arrival: Date;
			order_count: number;
			total_units: number;
		}>(
			`SELECT 
				s.id AS shipment_id,
				tt.id AS train_trip_id,
				t.name AS train_name,
				c.name AS from_city,
				tt.scheduled_arrival,
				1 AS order_count,
				s.allocated_space_units AS total_units
			FROM Shipment s
			JOIN Train_Trip tt ON s.train_trip_id = tt.id
			JOIN Train t ON tt.train_id = t.id
			JOIN City c ON tt.from_city_id = c.id
			WHERE tt.to_city_id = $1
			AND tt.scheduled_arrival > NOW()
			ORDER BY tt.scheduled_arrival ASC`,
			[storeCityId]
		);

		return shipmentsResult.rows.map((row) => ({
			shipmentId: row.shipment_id,
			trainTripId: row.train_trip_id,
			trainName: row.train_name,
			fromCity: row.from_city,
			scheduledArrival: row.scheduled_arrival.toISOString(),
			orderCount: Number(row.order_count),
			totalUnits: Number(row.total_units),
		}));
	}

	// ============================================================================
	// SCHEDULED DEPARTURES
	// ============================================================================

	/**
	 * Get all scheduled truck trips from the manager's store
	 */
	static async getScheduledDepartures(
		storeManagerId: string
	): Promise<StoreManagerModel.ScheduledDeparturesResponse> {
		// First get the store ID for this manager
		const storeId = await this.getStoreIdForManager(storeManagerId);

		// Get all scheduled truck trips that involve shipments from this store
		const result = await client.query<{
			truck_trip_id: string;
			vehicle_no: string;
			route_name: string;
			driver_name: string;
			assistant_name: string | null;
			scheduled_start: Date;
			status: string;
		}>(
			`SELECT 
				tt.id AS truck_trip_id,
				t.vehicle_no,
				r.name AS route_name,
				u_driver.name AS driver_name,
				u_assistant.name AS assistant_name,
				tt.scheduled_start,
				tt.status
			FROM Truck_Trip tt
			JOIN Truck t ON tt.truck_id = t.id
			JOIN Route r ON tt.route_id = r.id
			JOIN Worker w_driver ON tt.driver_id = w_driver.id
			JOIN "User" u_driver ON w_driver.id = u_driver.id
			LEFT JOIN Worker w_assistant ON tt.assistant_id = w_assistant.id
			LEFT JOIN "User" u_assistant ON w_assistant.id = u_assistant.id
			LEFT JOIN Shipment s ON tt.shipment_id = s.id
			LEFT JOIN "Order" o ON s.order_id = o.id
			WHERE tt.status = 'Scheduled'
			AND o.store_id = $1
			ORDER BY tt.scheduled_start ASC`,
			[storeId]
		);

		return result.rows.map((row) => ({
			truckTripId: row.truck_trip_id,
			vehicleNo: row.vehicle_no,
			routeName: row.route_name,
			driverName: row.driver_name,
			assistantName: row.assistant_name,
			scheduledStart: row.scheduled_start.toISOString(),
			status: row.status,
		}));
	}

	// ============================================================================
	// DISPATCH TRUCK TRIP
	// ============================================================================

	/**
	 * Dispatch a truck trip by calling the start_truck_trip stored procedure
	 */
	static async dispatchTruckTrip(
		tripId: string,
		storeManagerId: string
	): Promise<StoreManagerModel.DispatchTruckTripResponse> {
		// Verify the trip belongs to this manager's store
		const storeId = await this.getStoreIdForManager(storeManagerId);

		// Check if the trip exists and belongs to this store
		const tripCheck = await client.query<{ status: string }>(
			`SELECT tt.status
			FROM Truck_Trip tt
			LEFT JOIN Shipment s ON tt.shipment_id = s.id
			LEFT JOIN "Order" o ON s.order_id = o.id
			WHERE tt.id = $1 AND o.store_id = $2`,
			[tripId, storeId]
		);

		if (tripCheck.rowCount === 0) {
			throw status(404, { error: "Truck trip not found or does not belong to your store" });
		}

		if (tripCheck.rows[0].status !== "Scheduled") {
			throw status(400, { error: "Trip is not in Scheduled status" });
		}

		// Call the stored procedure to start the trip
		await client.query("CALL start_truck_trip($1)", [tripId]);

		// Get the updated trip details
		const result = await client.query<{
			truck_trip_id: string;
			status: string;
			actual_start: Date;
			vehicle_no: string;
		}>(
			`SELECT 
				tt.id AS truck_trip_id,
				tt.status,
				tt.actual_start,
				t.vehicle_no
			FROM Truck_Trip tt
			JOIN Truck t ON tt.truck_id = t.id
			WHERE tt.id = $1`,
			[tripId]
		);

		const trip = result.rows[0];

		return {
			truckTripId: trip.truck_trip_id,
			status: trip.status,
			actualStart: trip.actual_start.toISOString(),
			message: `Truck trip for vehicle ${trip.vehicle_no} has been dispatched.`,
		};
	}

	// ============================================================================
	// IN PROGRESS TRIPS
	// ============================================================================

	/**
	 * Get all in-progress truck trips from the manager's store
	 */
	static async getInProgressTrips(
		storeManagerId: string
	): Promise<StoreManagerModel.InProgressTripsResponse> {
		// First get the store ID for this manager
		const storeId = await this.getStoreIdForManager(storeManagerId);

		// Get all in-progress truck trips from this store
		const result = await client.query<{
			truck_trip_id: string;
			vehicle_no: string;
			driver_name: string;
			actual_start: Date;
			status: string;
		}>(
			`SELECT 
				tt.id AS truck_trip_id,
				t.vehicle_no,
				u.name AS driver_name,
				tt.actual_start,
				tt.status
			FROM Truck_Trip tt
			JOIN Truck t ON tt.truck_id = t.id
			JOIN Worker w ON tt.driver_id = w.id
			JOIN "User" u ON w.id = u.id
			LEFT JOIN Shipment s ON tt.shipment_id = s.id
			LEFT JOIN "Order" o ON s.order_id = o.id
			WHERE tt.status = 'In_Progress'
			AND o.store_id = $1
			ORDER BY tt.actual_start ASC`,
			[storeId]
		);

		return result.rows.map((row) => ({
			truckTripId: row.truck_trip_id,
			vehicleNo: row.vehicle_no,
			driverName: row.driver_name,
			actualStart: row.actual_start.toISOString(),
			status: row.status,
		}));
	}

	// ============================================================================
	// COMPLETE TRUCK TRIP
	// ============================================================================

	/**
	 * Complete a truck trip by calling the complete_truck_trip stored procedure
	 */
	static async completeTruckTrip(
		tripId: string,
		storeManagerId: string
	): Promise<StoreManagerModel.CompleteTruckTripResponse> {
		// Verify the trip belongs to this manager's store
		const storeId = await this.getStoreIdForManager(storeManagerId);

		// Check if the trip exists and belongs to this store
		const tripCheck = await client.query<{ status: string }>(
			`SELECT tt.status
			FROM Truck_Trip tt
			LEFT JOIN Shipment s ON tt.shipment_id = s.id
			LEFT JOIN "Order" o ON s.order_id = o.id
			WHERE tt.id = $1 AND o.store_id = $2`,
			[tripId, storeId]
		);

		if (tripCheck.rowCount === 0) {
			throw status(404, { error: "Truck trip not found or does not belong to your store" });
		}

		if (tripCheck.rows[0].status !== "In_Progress") {
			throw status(400, { error: "Trip is not in In_Progress status" });
		}

		// Call the stored procedure to complete the trip
		await client.query("CALL complete_truck_trip($1)", [tripId]);

		// Get the updated trip details
		const result = await client.query<{
			truck_trip_id: string;
			status: string;
			actual_end: Date;
		}>(
			`SELECT 
				id AS truck_trip_id,
				status,
				actual_end
			FROM Truck_Trip
			WHERE id = $1`,
			[tripId]
		);

		const trip = result.rows[0];

		return {
			truckTripId: trip.truck_trip_id,
			status: trip.status,
			actualEnd: trip.actual_end.toISOString(),
			message: "Trip completed. Worker hours have been logged.",
		};
	}
}
