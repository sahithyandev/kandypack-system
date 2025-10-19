// Model: Defines schemas and types for Driver module
import { t } from "elysia";

export namespace DriverModel {
	// Trip status as per DB enum trip_status
	export const tripStatus = t.Union([
		t.Literal("Scheduled"),
		t.Literal("In_Progress"),
		t.Literal("Completed"),
		t.Literal("Cancelled"),
	]);
	export type tripStatus = typeof tripStatus.static;

	export const trip = t.Object({
		id: t.String(),
		truck_id: t.String(),
		route_id: t.String(),
		status: tripStatus,
		scheduled_start: t.String(),
		scheduled_end: t.Nullable(t.String()),
		actual_start: t.Nullable(t.String()),
		actual_end: t.Nullable(t.String()),
	});
	export type trip = typeof trip.static;

	export const listTripsQuery = t.Object({
		status: t.Optional(tripStatus),
	});
	export type listTripsQuery = typeof listTripsQuery.static;

	export const tripIdParam = t.Object({ id: t.String() });
	export type tripIdParam = typeof tripIdParam.static;

	export const profileResponse = t.Object({
		id: t.String(),
		username: t.String(),
		name: t.String(),
		worker_id: t.String(),
		status: t.Union([t.Literal("Busy"), t.Literal("Free"), t.Literal("On_Leave")]),
		consecutive_deliveries: t.Number(),
		total_trips: t.Number(),
		daily_driving_distance: t.Number(),
		daily_driving_time: t.Number(),
		cumulative_distance: t.Number(),
		cumulative_time: t.Number(),
		hourly_pay: t.Number(),
		weekly_hours: t.Number(),
	});
	export type profileResponse = typeof profileResponse.static;
}

