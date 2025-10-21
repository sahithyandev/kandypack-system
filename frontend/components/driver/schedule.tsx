"use client";

import { useEffect, useMemo, useState } from "react";
import { getDriverTrips, type DriverTrip, cancelDriverTrip } from "@/lib/driver-api";
import { Button } from "../ui/button";

function formatTime(iso: string) {
	const d = new Date(iso);
	// Fallback if invalid
	if (isNaN(d.getTime())) return iso;
	return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Schedule() {
	const [trips, setTrips] = useState<DriverTrip[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let alive = true;
		setLoading(true);
		setError(null);
		// We only want upcoming and in-progress items in this sidebar
		getDriverTrips({})
			.then((data) => {
				if (!alive) return;
				setTrips(data);
			})
			.catch((e: unknown) => {
				if (!alive) return;
				const msg = e instanceof Error ? e.message : "Failed to load schedule";
				setError(msg);
			})
			.finally(() => alive && setLoading(false));
		return () => {
			alive = false;
		};
	}, []);

	const upcoming = useMemo(() => {
		const now = Date.now();
		return trips.filter((t) => {
			if (t.status === "Cancelled") return false;
			if (t.status === "Completed") return false;
			// Show In_Progress and future Scheduled
			const start = new Date(t.scheduled_start).getTime();
			return t.status === "In_Progress" || start >= now;
		});
	}, [trips]);

	const handleCancel = async (tripId: string) => {
		// Optimistically remove from UI
		setTrips((prev) => prev.filter((t) => t.id !== tripId));
		try {
			await cancelDriverTrip(tripId);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to cancel trip");
			// Re-fetch to get the correct state back on failure
			getDriverTrips({}).then(setTrips);
		}
	};

	return (
		<div className="rounded-md border">
			{/* <div className="p-3 text-sm text-muted-foreground">Upcoming schedule</div> */}

			{loading && <div className="mt-2 p-3 text-sm text-muted-foreground">Loading…</div>}
			{error && <div className="mt-2 p-3 text-sm text-red-600">{error}</div>}

			{!loading && !error && (
				<div className="text-sm">
					{upcoming.length === 0 && (
						<div className="p-3 text-muted-foreground">No upcoming trips</div>
					)}
					{upcoming.map((t) => (
						<div key={t.id} className="border-t p-3">
							<div className="flex justify-between">
								<span className="font-medium">{t.id}</span>
								<span className="text-muted-foreground">
									{formatTime(t.scheduled_start)} — Route {t.route_id}
								</span>
							</div>

							<div className="mt-2 flex justify-end">
								<Button variant="outline" size="sm" onClick={() => handleCancel(t.id)}>
									Cancel
								</Button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
