"use client";

import { useEffect, useMemo, useState } from "react";
import { getDriverTrips, type DriverTrip } from "@/lib/driver-api";

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

	return (
		<div className="rounded-md border p-3">
			<div className="text-sm text-muted-foreground">Upcoming schedule</div>

			{loading && <div className="mt-2 text-sm text-muted-foreground">Loading…</div>}
			{error && <div className="mt-2 text-sm text-red-600">{error}</div>}

			{!loading && !error && (
				<ul className="mt-2 space-y-2 text-sm">
					{upcoming.length === 0 && (
						<li className="text-muted-foreground">No upcoming trips</li>
					)}
					{upcoming.map((t) => (
						<li key={t.id} className="flex justify-between">
							<span className="font-medium">{t.id}</span>
							<span className="text-muted-foreground">
								{formatTime(t.scheduled_start)} — Route {t.route_id}
							</span>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
