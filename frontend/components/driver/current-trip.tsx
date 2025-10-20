"use client";

import { useEffect, useState } from "react";
import type { Trip } from "@/lib/types";
import {
	getDriverTrips,
	type DriverTrip,
	cancelDriverTrip,
	completeDriverTrip,
} from "@/lib/driver-api";
import { Button } from "../ui/button";

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

	const handleCancel = async () => {
		if (!displayTrip) return;
		try {
			await cancelDriverTrip(displayTrip.id);
			setCurrentTrip(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to cancel trip");
		}
	};

	const handleComplete = async () => {
		if (!displayTrip) return;
		try {
			await completeDriverTrip(displayTrip.id);
			setCurrentTrip(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to complete trip");
		}
	};

	if (loading) {
		return (
			<div className="rounded-md border">
				{/* <div className="p-3 text-sm text-muted-foreground">Current trip</div> */}
				<div className="border-t p-3 text-sm">Loading...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-md border">
				{/* <div className="p-3 text-sm text-muted-foreground">Current trip</div> */}
				<div className="border-t p-3 text-sm text-red-600">Error: {error}</div>
			</div>
		);
	}

	if (!displayTrip) {
		return (
			<div className="rounded-md border">
				{/* <div className="p-3 text-sm text-muted-foreground">Current trip</div> */}
				<div className="border-t p-3 text-sm">No current trip</div>
			</div>
		);
	}

	return (
		<div className="rounded-md border">
			{/* <div className="p-3 text-sm text-muted-foreground">Current trip</div> */}
			<div className="border-t p-3">
				<div className="flex justify-between">
					<span className="font-medium">{displayTrip.id}</span>
					<span className="text-sm text-muted-foreground">{displayTrip.status}</span>
				</div>
				<div className="flex justify-between text-sm text-muted-foreground">
					<span>
						{displayTrip.origin} → {displayTrip.destination}
					</span>
					<span>ETA: {new Date(displayTrip.eta).toLocaleTimeString()}</span>
				</div>
				<div className="mt-4 flex justify-end gap-2">
					<Button size="sm" onClick={handleComplete}>
						Complete
					</Button>
					<Button variant="outline" size="sm" onClick={handleCancel}>
						Cancel
					</Button>
				</div>
			</div>
		</div>
	);
}
