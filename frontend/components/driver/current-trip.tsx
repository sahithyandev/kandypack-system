"use client";

import { useEffect, useState } from "react";
import type { Trip } from "@/lib/types";
import { getDriverTrips, type DriverTrip } from "@/lib/driver-api";

interface CurrentTripProps {
	trip?: Trip;
}

export default function CurrentTrip({ trip }: CurrentTripProps) {
	const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchCurrentTrip() {
			try {
				const trips = await getDriverTrips({ status: "In_Progress" });
				if (trips.length > 0) {
					// Take the first in-progress trip (assuming there's only one current trip)
					const driverTrip = trips[0];
					const mappedTrip: Trip = {
						id: driverTrip.id,
						origin: "Warehouse", // Placeholder, could be enhanced with route details
						destination: driverTrip.route_id, // Using route_id as destination for now
						eta: driverTrip.scheduled_end || driverTrip.scheduled_start,
						status: "enroute",
					};
					setCurrentTrip(mappedTrip);
				} else {
					setCurrentTrip(null);
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load current trip");
			} finally {
				setLoading(false);
			}
		}

		fetchCurrentTrip();
	}, []);

	const displayTrip = trip || currentTrip;

	if (loading) {
		return (
			<div className="rounded-md border p-3">
				{/* <div className="text-sm text-muted-foreground">Current trip</div> */}
				<div className="mt-2 text-sm">Loading...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-md border p-3">
				{/* <div className="text-sm text-muted-foreground">Current trip</div> */}
				<div className="mt-2 text-sm text-red-600">Error: {error}</div>
			</div>
		);
	}

	if (!displayTrip) {
		return (
			<div className="rounded-md border p-3">
				{/* <div className="text-sm text-muted-foreground">Current trip</div> */}
				<div className="mt-2 text-sm">No current trip</div>
			</div>
		);
	}

	return (
		<div className="rounded-md border p-3">
			{/* <div className="text-sm text-muted-foreground">Current trip</div> */}
			<div className="mt-2">
				<div className="font-medium">
					{displayTrip.id} — {displayTrip.status}
				</div>
				<div className="text-sm text-muted-foreground">
					{displayTrip.origin} → {displayTrip.destination}
				</div>
				<div className="text-xs text-muted-foreground">
					ETA: {new Date(displayTrip.eta).toLocaleString()}
				</div>
			</div>
		</div>
	);
}
