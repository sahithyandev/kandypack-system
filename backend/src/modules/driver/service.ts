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
			consecutive_deliveries: number;
			total_trips: number;
			daily_driving_distance: number;
			daily_driving_time: number;
			cumulative_distance: number;
			cumulative_time: number;
				hourly_pay: number;
				weekly_hours: number;
		}>(
			`SELECT u.id,
							u.username,
							u.name,
							w.id AS worker_id,
							w.status,
						d.consecutive_deliveries,
						d.total_trips,
						d.daily_driving_distance,
						d.daily_driving_time,
						d.cumulative_distance,
						d.cumulative_time,
						w.hourly_pay,
						w.weekly_hours
				 FROM "User" u
				 JOIN Worker w ON w.id = u.id
				 JOIN Driver d ON d.id = w.id
				WHERE u.username = $1
				LIMIT 1`,
			[username],
		);

		if (result.rowCount === 0 || !result.rows[0])
			throw status(404, "Driver profile not found");

		return result.rows[0];
	}

	static async getTripsForDriver(
		username: string,
		statusFilter?: DriverModel.tripStatus,
	): Promise<DriverModel.trip[]> {
			const baseQuery = `
				SELECT tt.id,
							 tt.truck_id,
							 tt.route_id,
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

		const result = await client.query<DriverModel.trip>(baseQuery + where, params);
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
				RETURNING id, truck_id, route_id, status, 
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
		const verify = await client.query(
			`SELECT tt.id
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

		const updated = await client.query<DriverModel.trip>(
			`UPDATE Truck_Trip
					SET status = 'Completed',
							actual_end = NOW()
				WHERE id = $1
				RETURNING id, truck_id, route_id, status,
									to_char(scheduled_start, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as scheduled_start,
									to_char(scheduled_end, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as scheduled_end,
									to_char(actual_start, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as actual_start,
									to_char(actual_end, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as actual_end`,
			[tripId],
		);
		return updated.rows[0];
	}
}

