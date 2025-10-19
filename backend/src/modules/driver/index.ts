// Controller: define HTTP routes for Driver features

import jwt from "@elysiajs/jwt";
import { Elysia, t, status } from "elysia";
import { DriverModel } from "./model";
import { DriverService } from "./service";

if (!process.env.JWT_SECRET) {
	throw new Error("JWT_SECRET is not defined in environment variables");
}

export const driver = new Elysia({ prefix: "/driver" })
	.use(
		jwt({
			name: "jwt",
			secret: process.env.JWT_SECRET,
		}),
	)
	// Alias (typo kept intentionally): /driver/vechicles
	.get(
		"/vechicles",
		async ({ jwt, cookie: { session } }) => {
			if (!session?.value) throw status(401, "Unauthorized");
			await jwt.verify(String(session.value));
			return DriverService.getAllTrucks();
		},
		{
			response: DriverModel.trucksResponse,
		},
	)
	// Canonical vehicles endpoint
	.get(
		"/vehicles",
		async ({ jwt, cookie: { session } }) => {
			if (!session?.value) throw status(401, "Unauthorized");
			await jwt.verify(String(session.value));
			return DriverService.getAllTrucks();
		},
		{
			response: DriverModel.trucksResponse,
		},
	)

	// Get driver's vehicle details (assigned truck and trip context)
	.get(
		"/vehicle",
		async ({ jwt, cookie: { session } }) => {
			if (!session?.value) throw status(401, "Unauthorized");
			const payload = await jwt.verify(String(session.value));
			const username = (payload as any)?.username as string | undefined;
			if (!username) throw status(401, "Unauthorized");
			return DriverService.getVehicleForDriver(username);
		},
		{
			response: DriverModel.vehicleResponse,
		},
	)
	// Get authenticated driver profile (derived from session token)
	.get(
		"/profile",
			async ({ jwt, cookie: { session } }) => {
			if (!session?.value) throw status(401, "Unauthorized");
				const payload = await jwt.verify(String(session.value));
			const username = (payload as any)?.username as string | undefined;
			if (!username) throw status(401, "Unauthorized");
			return DriverService.getProfileByUsername(username);
		},
		{
			response: DriverModel.profileResponse,
		},
	)
	// List trips assigned to driver; optional status query to filter
	.get(
		"/trips",
			async ({ jwt, cookie: { session }, query }) => {
			if (!session?.value) throw status(401, "Unauthorized");
				const payload = await jwt.verify(String(session.value));
			const username = (payload as any)?.username as string | undefined;
			if (!username) throw status(401, "Unauthorized");
			return DriverService.getTripsForDriver(username, query.status);
		},
		{
			query: DriverModel.listTripsQuery,
			response: t.Array(DriverModel.trip),
		},
	)
	// Start a scheduled trip
	.post(
		"/trips/:id/start",
			async ({ jwt, cookie: { session }, params }) => {
			if (!session?.value) throw status(401, "Unauthorized");
				const payload = await jwt.verify(String(session.value));
			const username = (payload as any)?.username as string | undefined;
			if (!username) throw status(401, "Unauthorized");
			return DriverService.startTrip(username, params.id);
		},
		{
			params: DriverModel.tripIdParam,
			response: DriverModel.trip,
		},
	)
	// Complete an in-progress trip
	.post(
		"/trips/:id/complete",
			async ({ jwt, cookie: { session }, params }) => {
			if (!session?.value) throw status(401, "Unauthorized");
				const payload = await jwt.verify(String(session.value));
			const username = (payload as any)?.username as string | undefined;
			if (!username) throw status(401, "Unauthorized");
			return DriverService.completeTrip(username, params.id);
		},
		{
			params: DriverModel.tripIdParam,
			response: DriverModel.trip,
		},
	);

