"use client";
import { getDriverTrips, type DriverTrip } from "@/lib/driver-api";
import { useEffect, useState } from "react";
import TripCard from "./trip-card";

export default function AssignedTrips() {
	const [trips, setTrips] = useState<DriverTrip[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		getDriverTrips()
			.then(setTrips)
			.catch((err) => {
				console.error(err);
				setError("Failed to load trips. Please try again later.");
			});
	}, []);

	if (error) {
		return <div className="text-red-500">{error}</div>;
	}

	if (trips.length === 0) {
		return <div className="text-center text-muted-foreground">No trips assigned.</div>;
	}

	// Sort trips by scheduled_start in descending order
	const sortedTrips = trips.sort(
		(a, b) => new Date(b.scheduled_start).getTime() - new Date(a.scheduled_start).getTime(),
	);

	return (
		<div className="flex flex-col gap-3">
			{sortedTrips.map((t) => (
				<TripCard key={t.id} trip={t} />
			))}
		</div>
	);
}
