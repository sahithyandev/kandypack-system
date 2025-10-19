"use client";
import { useEffect, useMemo, useState } from "react";
import { getAllTrucks, type TruckSummary } from "@/lib/driver-api";

function formatDateTime(dt?: string | null) {
	if (!dt) return "—";
	try {
		const d = new Date(dt);
		if (Number.isNaN(d.getTime())) return dt;
		return d.toLocaleString();
	} catch {
		return dt;
	}
}

export default function VehicleInfo() {
	const [trucks, setTrucks] = useState<TruckSummary[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let alive = true;
		setLoading(true);
		setError(null);
		getAllTrucks()
			.then((list) => {
				if (!alive) return;
				setTrucks(list);
			})
			.catch((e: unknown) => {
				if (!alive) return;
				const message = e instanceof Error ? e.message : "Failed to load vehicle";
				setError(message);
			})
			.finally(() => alive && setLoading(false));
		return () => {
			alive = false;
		};
	}, []);

	const hasTrucks = trucks.length > 0;

	if (loading) {
		return <div className="text-sm text-muted-foreground">Loading vehicle…</div>;
	}
	if (error) {
		return (
			<div className="text-sm text-red-600">{error}</div>
		);
	}

	if (!hasTrucks) {
		return (
			<div className="flex flex-col gap-2">
				<div className="font-medium">No trucks found</div>
				<div className="text-sm text-muted-foreground">Once trucks are added to the system, they will appear here with their current status.</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			<div className="font-medium">All Trucks</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
				{trucks.map((t) => (
					<div key={t.id} className="rounded-md border p-3 flex flex-col gap-1">
						<div className="flex items-center justify-between">
							<div className="font-medium">{t.vehicle_no}</div>
							<span
								className={
									`rounded px-2 py-0.5 text-xs capitalize ` +
									(t.status === "available"
										? "bg-green-100 text-green-700"
										: t.status === "busy"
										? "bg-amber-100 text-amber-700"
										: "bg-gray-200 text-gray-700")
								}
							>NetworkError when attempting to fetch resource.
								{t.status}
							</span>
						</div>
						<div className="text-xs text-muted-foreground">Truck ID: {t.id}</div>
					</div>
				))}
			</div>
		</div>
	);
}
