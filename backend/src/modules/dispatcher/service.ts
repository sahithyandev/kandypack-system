// Service layer for Dispatcher module - handles all business logic
import { status } from "elysia";
import { client } from "../../utils/db";
import type { DispatcherModel } from "./model";

export abstract class DispatcherService {
	// ============================================================================
	// PENDING ORDERS
	// ============================================================================

	/**
	 * Get all pending orders awaiting scheduling
	 */
	static async getPendingOrders(): Promise<
		DispatcherModel.PendingOrdersResponse
	> {
		const result = await client.query<{
			order_id: string;
			customer_name: string;
			destination_city: string;
			placed_on: Date;
			required_delivery_date: Date;
			total_value: number;
			total_space_units: number;
		}>(
			`SELECT 
				o.id AS order_id,
				u.name AS customer_name,
				COALESCE(c.city, 'Unknown') AS destination_city,
				o.placed_on,
				o.required_delivery_date,
				o.total_value,
				o.total_space_units
			FROM "Order" o
			JOIN Customer c ON o.customer_id = c.id
			JOIN "User" u ON c.id = u.id
			WHERE o.status = 'Pending'
			ORDER BY o.placed_on ASC`,
		);

		return result.rows.map((row) => ({
			orderId: row.order_id,
			customerName: row.customer_name,
			destinationCity: row.destination_city,
			placedOn: row.placed_on.toISOString(),
			requiredDeliveryDate: row.required_delivery_date.toISOString().split("T")[0],
			totalValue: Number(row.total_value),
			totalSpaceUnits: Number(row.total_space_units),
		}));
	}

	// ============================================================================
	// TRAIN TRIPS
	// ============================================================================

	/**
	 * Get list of scheduled train trips with capacity information
	 */
	static async getTrainTrips(
		destinationCityId?: string,
	): Promise<DispatcherModel.TrainTripsResponse> {
		let query = `
			SELECT 
				tt.id AS train_trip_id,
				t.name AS train_name,
				c1.name AS from_city,
				c2.name AS to_city,
				tt.scheduled_departure,
				tt.scheduled_arrival,
				tt.capacity_units,
				tt.allocated_units,
				(tt.capacity_units - tt.allocated_units) AS available_units
			FROM Train_Trip tt
			JOIN Train t ON tt.train_id = t.id
			JOIN City c1 ON tt.from_city_id = c1.id
			JOIN City c2 ON tt.to_city_id = c2.id
			WHERE tt.scheduled_departure > NOW()
		`;

		const params: string[] = [];

		if (destinationCityId) {
			params.push(destinationCityId);
			query += ` AND tt.to_city_id = $1`;
		}

		query += ` ORDER BY tt.scheduled_departure ASC`;

		const result = await client.query<{
			train_trip_id: string;
			train_name: string;
			from_city: string;
			to_city: string;
			scheduled_departure: Date;
			scheduled_arrival: Date;
			capacity_units: number;
			allocated_units: number;
			available_units: number;
		}>(query, params);

		return result.rows.map((row) => ({
			trainTripId: row.train_trip_id,
			trainName: row.train_name,
			fromCity: row.from_city,
			toCity: row.to_city,
			scheduledDeparture: row.scheduled_departure.toISOString(),
			scheduledArrival: row.scheduled_arrival.toISOString(),
			capacityUnits: Number(row.capacity_units),
			allocatedUnits: Number(row.allocated_units),
			availableUnits: Number(row.available_units),
		}));
	}

	// ============================================================================
	// SHIPMENTS
	// ============================================================================

	/**
	 * Create a new shipment by assigning an order to a train trip
	 */
	static async createShipment(
		data: DispatcherModel.CreateShipmentBody,
	): Promise<DispatcherModel.CreateShipmentResponse> {
		try {
			await client.query("BEGIN");

			// Get order details
			const orderResult = await client.query<{
				total_space_units: number;
				status: string;
			}>(
				`SELECT total_space_units, status
				FROM "Order"
				WHERE id = $1`,
				[data.orderId],
			);

			if (orderResult.rowCount === 0) {
				throw status(404, { error: "Order not found" });
			}

			const order = orderResult.rows[0];

			if (order.status !== "Pending") {
				throw status(400, {
					error: "Order is not in Pending status",
				});
			}

			// Check train trip capacity
			const trainTripResult = await client.query<{
				capacity_units: number;
				allocated_units: number;
			}>(
				`SELECT capacity_units, allocated_units
				FROM Train_Trip
				WHERE id = $1`,
				[data.trainTripId],
			);

			if (trainTripResult.rowCount === 0) {
				throw status(404, { error: "Train trip not found" });
			}

			const trainTrip = trainTripResult.rows[0];
			const availableCapacity =
				Number(trainTrip.capacity_units) - Number(trainTrip.allocated_units);

			if (Number(order.total_space_units) > availableCapacity) {
				throw status(400, {
					error: "Insufficient capacity on train trip",
				});
			}

			// Create shipment
			const shipmentId = `ship-${Bun.randomUUIDv7()}`;
			await client.query(
				`INSERT INTO Shipment (id, order_id, train_trip_id, allocated_space_units, shipped_quantity, status)
				VALUES ($1, $2, $3, $4, 1, 'Pending')`,
				[
					shipmentId,
					data.orderId,
					data.trainTripId,
					order.total_space_units,
				],
			);

			// Update order status
			await client.query(
				`UPDATE "Order"
				SET status = 'In_Train_Transit'
				WHERE id = $1`,
				[data.orderId],
			);

			// Update train trip allocated units
			await client.query(
				`UPDATE Train_Trip
				SET allocated_units = allocated_units + $1
				WHERE id = $2`,
				[order.total_space_units, data.trainTripId],
			);

			await client.query("COMMIT");

			return {
				shipmentId,
				orderId: data.orderId,
				trainTripId: data.trainTripId,
				status: "Pending",
				message:
					"Shipment created successfully. Order status updated to In_Train_Transit.",
			};
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		}
	}

	/**
	 * Get shipments that are at a store and ready for truck delivery
	 */
	static async getShipmentsAtStore(
		storeId?: string,
	): Promise<DispatcherModel.ShipmentsAtStoreResponse> {
		let query = `
			SELECT 
				s.id AS shipment_id,
				o.id AS order_id,
				u.name AS customer_name,
				o.delivery_address,
				r.id AS route_id,
				r.name AS route_name
			FROM Shipment s
			JOIN "Order" o ON s.order_id = o.id
			JOIN Customer c ON o.customer_id = c.id
			JOIN "User" u ON c.id = u.id
			LEFT JOIN Route r ON o.route_id = r.id
			WHERE o.status = 'At_Store'
			AND s.id NOT IN (SELECT shipment_id FROM Truck_Trip WHERE shipment_id IS NOT NULL)
		`;

		const params: string[] = [];

		if (storeId) {
			params.push(storeId);
			query += ` AND o.store_id = $1`;
		}

		query += ` ORDER BY o.placed_on ASC`;

		const result = await client.query<{
			shipment_id: string;
			order_id: string;
			customer_name: string;
			delivery_address: string;
			route_id: string | null;
			route_name: string | null;
		}>(query, params);

		return result.rows.map((row) => ({
			shipmentId: row.shipment_id,
			orderId: row.order_id,
			customerName: row.customer_name,
			deliveryAddress: row.delivery_address,
			routeId: row.route_id || "",
			routeName: row.route_name || "",
		}));
	}

	// ============================================================================
	// AVAILABLE RESOURCES
	// ============================================================================

	/**
	 * Get all available workers (drivers, assistants) and trucks
	 */
	static async getAvailableResources(): Promise<
		DispatcherModel.AvailableResourcesResponse
	> {
		// Get available drivers
		const driversResult = await client.query<{
			worker_id: string;
			name: string;
		}>(
			`SELECT w.id AS worker_id, u.name
			FROM Worker w
			JOIN "User" u ON w.id = u.id
			WHERE w.type = 'Driver' AND w.status = 'Free'
			ORDER BY u.name ASC`,
		);

		// Get available assistants
		const assistantsResult = await client.query<{
			worker_id: string;
			name: string;
		}>(
			`SELECT w.id AS worker_id, u.name
			FROM Worker w
			JOIN "User" u ON w.id = u.id
			WHERE w.type = 'Assistant' AND w.status = 'Free'
			ORDER BY u.name ASC`,
		);

		// Get available trucks (not currently assigned to any scheduled or in-progress trip)
		const trucksResult = await client.query<{
			truck_id: string;
			vehicle_no: string;
		}>(
			`SELECT t.id AS truck_id, t.vehicle_no
			FROM Truck t
			WHERE t.status = 'available'
			AND t.id NOT IN (
				SELECT truck_id 
				FROM Truck_Trip 
				WHERE status IN ('Scheduled', 'In_Progress')
			)
			ORDER BY t.vehicle_no ASC`,
		);

		return {
			drivers: driversResult.rows.map((row) => ({
				workerId: row.worker_id,
				name: row.name,
			})),
			assistants: assistantsResult.rows.map((row) => ({
				workerId: row.worker_id,
				name: row.name,
			})),
			trucks: trucksResult.rows.map((row) => ({
				truckId: row.truck_id,
				vehicleNo: row.vehicle_no,
			})),
		};
	}

	// ============================================================================
	// TRUCK TRIPS
	// ============================================================================

	/**
	 * Schedule a new truck trip
	 * Database triggers will validate business rules
	 */
	static async createTruckTrip(
		data: DispatcherModel.CreateTruckTripBody,
	): Promise<DispatcherModel.CreateTruckTripResponse> {
		try {
			const truckTripId = `trip-${Bun.randomUUIDv7()}`;

			await client.query(
				`INSERT INTO Truck_Trip (
					id, truck_id, route_id, driver_id, assistant_id, 
					shipment_id, scheduled_start, scheduled_end, status
				)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Scheduled')`,
				[
					truckTripId,
					data.truckId,
					data.routeId,
					data.driverId,
					data.assistantId || null,
					data.shipmentId,
					data.scheduledStart,
					data.scheduledEnd,
				],
			);

			return {
				truckTripId,
				status: "Scheduled",
				message: "Truck trip scheduled successfully.",
			};
		} catch (error: unknown) {
			// PostgreSQL errors from triggers
			if (error && typeof error === "object" && "message" in error) {
				const errorMessage = (error as { message: string }).message;
				throw status(400, { error: errorMessage });
			}
			throw error;
		}
	}

	// ============================================================================
	// SCHEDULE OVERVIEW
	// ============================================================================

	/**
	 * Get comprehensive overview of all scheduled activities
	 */
	static async getScheduleOverview(): Promise<
		DispatcherModel.ScheduleOverviewResponse
	> {
		// Get train trips
		const trainTripsResult = await client.query<{
			train_trip_id: string;
			train_name: string;
			to_city: string;
			scheduled_departure: Date;
			status: string;
			shipment_count: number;
		}>(
			`SELECT 
				tt.id AS train_trip_id,
				t.name AS train_name,
				c.name AS to_city,
				tt.scheduled_departure,
				'Scheduled' AS status,
				COUNT(s.id) AS shipment_count
			FROM Train_Trip tt
			JOIN Train t ON tt.train_id = t.id
			JOIN City c ON tt.to_city_id = c.id
			LEFT JOIN Shipment s ON tt.id = s.train_trip_id
			WHERE tt.scheduled_departure > NOW()
			GROUP BY tt.id, t.name, c.name, tt.scheduled_departure
			ORDER BY tt.scheduled_departure ASC`,
		);

		// Get truck trips
		const truckTripsResult = await client.query<{
			truck_trip_id: string;
			vehicle_no: string;
			route_name: string;
			driver_name: string;
			scheduled_start: Date;
			status: string;
		}>(
			`SELECT 
				tt.id AS truck_trip_id,
				t.vehicle_no,
				r.name AS route_name,
				u.name AS driver_name,
				tt.scheduled_start,
				tt.status
			FROM Truck_Trip tt
			JOIN Truck t ON tt.truck_id = t.id
			JOIN Route r ON tt.route_id = r.id
			JOIN Worker w ON tt.driver_id = w.id
			JOIN "User" u ON w.id = u.id
			WHERE tt.status IN ('Scheduled', 'In_Progress')
			ORDER BY tt.scheduled_start ASC`,
		);

		return {
			trainTrips: trainTripsResult.rows.map((row) => ({
				trainTripId: row.train_trip_id,
				trainName: row.train_name,
				toCity: row.to_city,
				scheduledDeparture: row.scheduled_departure.toISOString(),
				status: row.status,
				shipmentCount: Number(row.shipment_count),
			})),
			truckTrips: truckTripsResult.rows.map((row) => ({
				truckTripId: row.truck_trip_id,
				vehicleNo: row.vehicle_no,
				routeName: row.route_name,
				driverName: row.driver_name,
				scheduledStart: row.scheduled_start.toISOString(),
				status: row.status,
			})),
		};
	}
}
