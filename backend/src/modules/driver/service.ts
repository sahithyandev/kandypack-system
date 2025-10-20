// Service: Driver business logic and DB interactions
import { status } from "elysia";
import { client } from "../../utils/db";
import type { DriverModel } from "./model";

export abstract class DriverService {
	static async getProfileByUsername(username: string): Promise<DriverModel.profileResponse> {
		const result = await client.query<{
			id: string;
			username: string;
			name: string;
			worker_id: string;
			status: "Busy" | "Free" | "On_Leave";
			consecutive_deliveries: any;
			total_trips: any;
			daily_driving_distance: any;
			daily_driving_time: any;
			cumulative_distance: any;
			cumulative_time: any;
				hourly_pay: any;
				weekly_hours: any;
		}>(
			`SELECT u.id,
							u.username,
							u.name,
							w.id AS worker_id,
							w.status,
				d.consecutive_deliveries,
				d.total_trips,
				(d.daily_driving_distance)::float8 AS daily_driving_distance,
				(d.daily_driving_time)::float8 AS daily_driving_time,
				(d.cumulative_distance)::float8 AS cumulative_distance,
				(d.cumulative_time)::float8 AS cumulative_time,
				(w.hourly_pay)::float8 AS hourly_pay,
				(w.weekly_hours)::float8 AS weekly_hours
				 FROM "User" u
				 JOIN Worker w ON w.id = u.id
				 JOIN Driver d ON d.id = w.id
				WHERE u.username = $1
				LIMIT 1`,
			[username],
		);

		if (result.rowCount === 0 || !result.rows[0])
			throw status(404, "Driver profile not found");

		// Coerce numeric-like fields to actual numbers to satisfy response schema
		const row = result.rows[0];
		return {
			id: row.id,
			username: row.username,
			name: row.name,
			worker_id: row.worker_id,
			status: row.status,
			consecutive_deliveries: Number(row.consecutive_deliveries ?? 0),
			total_trips: Number(row.total_trips ?? 0),
			daily_driving_distance: Number(row.daily_driving_distance ?? 0),
			daily_driving_time: Number(row.daily_driving_time ?? 0),
			cumulative_distance: Number(row.cumulative_distance ?? 0),
			cumulative_time: Number(row.cumulative_time ?? 0),
			hourly_pay: Number(row.hourly_pay ?? 0),
			weekly_hours: Number(row.weekly_hours ?? 0),
		};
	}

	static async getTripsForDriver(
		username: string,
		statusFilter?: DriverModel.tripStatus,
	): Promise<DriverModel.trip[]> {
			const baseQuery = `
				SELECT tt.id,
							 tt.truck_id,
							 tt.route_id,
						 (tt.distance_km)::float8 AS distance_km,
							 tt.status,
							 to_char(tt.scheduled_start, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as scheduled_start,
							 to_char(tt.scheduled_end, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as scheduled_end,
							 to_char(tt.actual_start, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as actual_start,
							 to_char(tt.actual_end, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as actual_end
				FROM Truck_Trip tt
				JOIN Driver d ON d.id = tt.driver_id
				JOIN Worker w ON w.id = d.id
				JOIN "User" u ON u.id = w.id
			 WHERE u.username = $1`;

		const params: any[] = [username];
		let where = "";
		if (statusFilter) {
			params.push(statusFilter);
			where = " AND tt.status = $2";
		}

		// Enforce ordering by scheduled_start descending for the most recent trips first
		const orderBy = " ORDER BY tt.scheduled_start DESC";
		const result = await client.query<DriverModel.trip>(baseQuery + where + orderBy, params);
		return result.rows;
	}

	static async startTrip(username: string, tripId: string): Promise<DriverModel.trip> {
		// Verify ownership and status
		const verify = await client.query(
			`SELECT tt.id
				 FROM Truck_Trip tt
				 JOIN Driver d ON d.id = tt.driver_id
				 JOIN Worker w ON w.id = d.id
				 JOIN "User" u ON u.id = w.id
				WHERE u.username = $1
					AND tt.id = $2
					AND tt.status = 'Scheduled'
				LIMIT 1`,
			[username, tripId],
		);
		if (verify.rowCount === 0) throw status(403, "Trip not found or not allowed");

		const updated = await client.query<DriverModel.trip>(
			`UPDATE Truck_Trip
					SET status = 'In_Progress',
							actual_start = NOW()
				WHERE id = $1
				RETURNING id, truck_id, route_id, (distance_km)::float8 AS distance_km, status, 
									to_char(scheduled_start, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as scheduled_start,
									to_char(scheduled_end, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as scheduled_end,
									to_char(actual_start, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as actual_start,
									to_char(actual_end, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as actual_end`,
			[tripId],
		);
		return updated.rows[0];
	}

	static async completeTrip(
		username: string,
		tripId: string,
	): Promise<DriverModel.trip> {
		// Verify ownership and that trip is in-progress
		const verify = await client.query(
			`SELECT tt.id, tt.driver_id
			 FROM Truck_Trip tt
			 JOIN Driver d ON d.id = tt.driver_id
			 JOIN Worker w ON w.id = d.id
			 JOIN "User" u ON u.id = w.id
			WHERE u.username = $1
			  AND tt.id = $2
			  AND tt.status = 'In_Progress'
			LIMIT 1`,
			[username, tripId],
		);
		if (verify.rowCount === 0) throw status(403, "Trip not found or not allowed");

		const driverId = verify.rows[0].driver_id as string;

		try {
			// Wrap in transaction to avoid races
			await client.query("BEGIN");

			// Use stored procedure which performs bookkeeping and frees the worker(s)
			await client.query("CALL complete_truck_trip($1)", [tripId]);

			// Fetch the completed trip to return
			const completedRes = await client.query<DriverModel.trip>(
				`SELECT id, truck_id, route_id, status,
					(distance_km)::float8 AS distance_km,
					to_char(scheduled_start, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as scheduled_start,
					to_char(scheduled_end, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as scheduled_end,
					to_char(actual_start, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as actual_start,
					to_char(actual_end, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as actual_end
				FROM Truck_Trip
				WHERE id = $1`,
				[tripId],
			);

			// Find the next scheduled trip for the same driver (if any)
			const nextTripRes = await client.query<{ id: string }>(
				`SELECT id
				 FROM Truck_Trip
				 WHERE driver_id = $1 AND status = 'Scheduled'
				 ORDER BY scheduled_start ASC
				 LIMIT 1`,
				[driverId],
			);
			if (nextTripRes && nextTripRes.rowCount && nextTripRes.rows[0]) {
				const nextTripId = nextTripRes.rows[0].id;
				// Start the next trip (use stored procedure to set actual_start and worker status)
				await client.query("CALL start_truck_trip($1)", [nextTripId]);
			}

			await client.query("COMMIT");

			if (!completedRes || !completedRes.rowCount || !completedRes.rows[0]) {
				throw status(404, "Trip not found after completion");
			}
			return completedRes.rows[0];
		} catch (err) {
			await client.query("ROLLBACK");
			throw err;
		}
	}

	/**
	 * Get vehicle details for the authenticated driver
	 * - Returns the truck assigned in the next scheduled or in-progress trip (nearest upcoming)
	 * - Provides last completed trip end time with that truck
	 * - Counts total trips the driver had with that truck
	 */
	static async getVehicleForDriver(
		username: string,
	): Promise<DriverModel.vehicleResponse> {
		// Find the driver's next scheduled or in-progress trip (closest by scheduled_start)
		const nextTrip = await client.query<{
			trip_id: string;
			truck_id: string;
			vehicle_no: string;
			truck_status: string;
			status: DriverModel.tripStatus;
			scheduled_start: string;
			scheduled_end: string | null;
		}>(
			`SELECT tt.id AS trip_id,
					 tt.truck_id,
					 t.vehicle_no,
					 t.status as truck_status,
					 tt.status,
					 to_char(tt.scheduled_start, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as scheduled_start,
					 to_char(tt.scheduled_end, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as scheduled_end
			 FROM Truck_Trip tt
			 JOIN Truck t ON t.id = tt.truck_id
			 JOIN Driver d ON d.id = tt.driver_id
			 JOIN Worker w ON w.id = d.id
			 JOIN "User" u ON u.id = w.id
			WHERE u.username = $1
			  AND tt.status IN ('Scheduled', 'In_Progress')
			ORDER BY tt.status = 'In_Progress' DESC, tt.scheduled_start ASC
			LIMIT 1`,
			[username],
		);

		if (nextTrip.rowCount && nextTrip.rows[0]) {
			const row = nextTrip.rows[0];
			// Last completed trip end with same truck by this driver
			const lastCompleted = await client.query<{ last_end: string | null }>(
				`SELECT to_char(MAX(tt.actual_end), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as last_end
				 FROM Truck_Trip tt
				 JOIN Driver d ON d.id = tt.driver_id
				 JOIN Worker w ON w.id = d.id
				 JOIN "User" u ON u.id = w.id
				WHERE u.username = $1 AND tt.truck_id = $2 AND tt.status = 'Completed'`,
				[username, row.truck_id],
			);
			const totalTripsWithVehicle = await client.query<{ cnt: number }>(
				`SELECT COUNT(*)::int as cnt
				 FROM Truck_Trip tt
				 JOIN Driver d ON d.id = tt.driver_id
				 JOIN Worker w ON w.id = d.id
				 JOIN "User" u ON u.id = w.id
				WHERE u.username = $1 AND tt.truck_id = $2`,
				[username, row.truck_id],
			);

			return {
				id: row.truck_id,
				vehicle_no: row.vehicle_no,
				truck_status: row.truck_status,
				next_trip: {
					id: row.trip_id,
					status: row.status,
					scheduled_start: row.scheduled_start,
					scheduled_end: row.scheduled_end,
				},
				last_completed_trip_end: lastCompleted.rows[0]?.last_end ?? null,
				total_trips_with_vehicle: totalTripsWithVehicle.rows[0]?.cnt ?? 0,
			};
		}

		// If no upcoming trip, try to find the most recent completed trip to derive last used vehicle
		const lastTrip = await client.query<{
			truck_id: string;
			vehicle_no: string;
			truck_status: string;
			last_end: string | null;
			total_cnt: number;
		}>(
			`WITH last_completed AS (
				SELECT tt.truck_id,
						 t.vehicle_no,
						 t.status as truck_status,
						 MAX(tt.actual_end) AS last_end
				FROM Truck_Trip tt
				JOIN Truck t ON t.id = tt.truck_id
				JOIN Driver d ON d.id = tt.driver_id
				JOIN Worker w ON w.id = d.id
				JOIN "User" u ON u.id = w.id
				WHERE u.username = $1 AND tt.status = 'Completed'
				GROUP BY tt.truck_id, t.vehicle_no
			)
			SELECT lc.truck_id, lc.vehicle_no, lc.truck_status,
					 to_char(lc.last_end, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as last_end,
					 (
						SELECT COUNT(*)::int
						FROM Truck_Trip tt
						JOIN Driver d ON d.id = tt.driver_id
						JOIN Worker w ON w.id = d.id
						JOIN "User" u ON u.id = w.id
						WHERE u.username = $1 AND tt.truck_id = lc.truck_id
					 ) as total_cnt
			FROM last_completed lc
			ORDER BY lc.last_end DESC
			LIMIT 1`,
			[username],
		);

		if (lastTrip.rowCount && lastTrip.rows[0]) {
			const row = lastTrip.rows[0];
			return {
				id: row.truck_id,
				vehicle_no: row.vehicle_no,
				truck_status: row.truck_status,
				next_trip: null,
				last_completed_trip_end: row.last_end,
				total_trips_with_vehicle: row.total_cnt,
			};
		}

		// No vehicle history
		return {
			id: "",
			vehicle_no: "",
			truck_status: "",
			next_trip: null,
			last_completed_trip_end: null,
			total_trips_with_vehicle: 0,
		};
	}

	static async getAllTrucks(): Promise<DriverModel.trucksResponse> {
		const result = await client.query<{ id: string; vehicle_no: string; status: string }>(
			`SELECT id, vehicle_no, status FROM Truck ORDER BY vehicle_no ASC`,
		);
		return result.rows.map((r) => ({ id: r.id, vehicle_no: r.vehicle_no, status: r.status }));
	}

	static async cancelTrip(username: string, tripId: string): Promise<DriverModel.trip> {
		// Verify ownership and status
		const verify = await client.query(
			`SELECT tt.id
			 FROM Truck_Trip tt
			 JOIN Driver d ON d.id = tt.driver_id
			 JOIN Worker w ON w.id = d.id
			 JOIN "User" u ON u.id = w.id
			 WHERE u.username = $1 AND tt.id = $2`,
			[username, tripId],
		);
		if (verify.rowCount === 0) {
			throw status(404, "Trip not found or not assigned to this driver");
		}

		// Call the stored procedure to cancel the trip
		await client.query("CALL cancel_truck_trip($1)", [tripId]);

		// Fetch and return the updated trip details
		const result = await client.query<DriverModel.trip>(
			`SELECT id,
							truck_id,
							route_id,
						status,
						(distance_km)::float8 AS distance_km,
							to_char(scheduled_start, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as scheduled_start,
							to_char(scheduled_end, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as scheduled_end,
							to_char(actual_start, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as actual_start,
							to_char(actual_end, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as actual_end
			 FROM Truck_Trip
			 WHERE id = $1`,
			[tripId],
		);
		if (result.rowCount === 0 || !result.rows[0]) {
			throw status(404, "Trip not found after update");
		}
		return result.rows[0];
	}
}

