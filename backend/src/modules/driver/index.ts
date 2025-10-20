// Controller: define HTTP routes for Driver features

import jwt from "@elysiajs/jwt";
import { Elysia, t, status } from "elysia";
import { DriverModel } from "./model";
import authMiddleware from "../auth/middleware";
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
  // attach auth macro/types so `currentUser` is available in handlers
  .use(authMiddleware)
	// Alias (typo kept intentionally): /driver/vechicles
	.get(
		"/vechicles",
		async ({ currentUser }) => {
			if (!currentUser) throw status(401, "Unauthorized");
			return DriverService.getAllTrucks();
		},
		{
			currentUser: true,
			response: DriverModel.trucksResponse,
		},
	)
	// Canonical vehicles endpoint
	.get(
		"/vehicles",
		async ({ currentUser }) => {
			if (!currentUser) throw status(401, "Unauthorized");
			return DriverService.getAllTrucks();
		},
		{
			currentUser: true,
			response: DriverModel.trucksResponse,
		},
	)

	// Get driver's vehicle details (assigned truck and trip context)
	.get(
		"/vehicle",
		async ({ currentUser }) => {
			if (!currentUser) throw status(401, "Unauthorized");
			const username = (currentUser as any)?.username as string | undefined;
			if (!username) throw status(401, "Unauthorized");
			return DriverService.getVehicleForDriver(username);
		},
		{
			currentUser: true,
			response: DriverModel.vehicleResponse,
		},
	)
	// Get authenticated driver profile (derived from session token)
	.get(
		"/profile",
		async ({ currentUser }) => {
			if (!currentUser) throw status(401, "Unauthorized");
			const username = (currentUser as any)?.username as string | undefined;
			if (!username) throw status(401, "Unauthorized");
			return DriverService.getProfileByUsername(username);
		},
		{
			currentUser: true,
			response: DriverModel.profileResponse,
		},
	)
	// List trips assigned to driver; optional status query to filter
	.get(
		"/trips",
		async ({ currentUser, query }) => {
			if (!currentUser) throw status(401, "Unauthorized");
			const username = (currentUser as any)?.username as string | undefined;
			if (!username) throw status(401, "Unauthorized");
			return DriverService.getTripsForDriver(username, query.status);
		},
		{
			currentUser: true,
			query: DriverModel.listTripsQuery,
			response: t.Array(DriverModel.trip),
		},
	)
	// Start a scheduled trip
	.post(
		"/trips/:id/start",
		async ({ currentUser, params }) => {
			if (!currentUser) throw status(401, "Unauthorized");
			const username = (currentUser as any)?.username as string | undefined;
			if (!username) throw status(401, "Unauthorized");
			return DriverService.startTrip(username, params.id);
		},
		{
			currentUser: true,
			params: DriverModel.tripIdParam,
			response: DriverModel.trip,
		},
	)
	// Complete an in-progress trip
	.post(
		"/trips/:id/complete",
		async ({ currentUser, params }) => {
			if (!currentUser) throw status(401, "Unauthorized");
			const username = (currentUser as any)?.username as string | undefined;
			if (!username) throw status(401, "Unauthorized");
			return DriverService.completeTrip(username, params.id);
		},
		{
			currentUser: true,
			params: DriverModel.tripIdParam,
			response: DriverModel.trip,
		},
	)
	// Cancel a trip
	.post(
		"/trips/:id/cancel",
		async ({ currentUser, params }) => {
			if (!currentUser) throw status(401, "Unauthorized");
			const username = (currentUser as any)?.username as string | undefined;
			if (!username) throw status(401, "Unauthorized");
			return DriverService.cancelTrip(username, params.id);
		},
		{
			currentUser: true,
			params: DriverModel.tripIdParam,
			response: DriverModel.trip,
		},
	)

