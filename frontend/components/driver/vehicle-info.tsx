"use client";
import { useEffect, useMemo, useState } from "react";
import { getDriverVehicle, getDriverProfile, type DriverVehicleInfo, type DriverProfile } from "@/lib/driver-api";

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
	const [vehicle, setVehicle] = useState<DriverVehicleInfo | null>(null);
	const [profile, setProfile] = useState<DriverProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let alive = true;
		(async () => {
			try {
				setLoading(true);
				setError(null);
				const p = await getDriverProfile();
				if (!alive) return;
				setProfile(p);
				if (p.status === "Free") {
					// No assigned vehicle expected when driver is Free
					setVehicle(null);
					return;
				}
				const v = await getDriverVehicle();
				if (!alive) return;
				setVehicle(v ?? null);
			} catch (e: unknown) {
				if (!alive) return;
				const message = e instanceof Error ? e.message : "Failed to load vehicle";
				setError(message);
			} finally {
				if (alive) setLoading(false);
			}
		})();
		return () => {
			alive = false;
		};
	}, []);

	if (loading) {
		return <div className="text-sm text-muted-foreground">Loading vehicle…</div>;
	}
	if (error) {
		return (
			<div className="text-sm text-red-600">{error}</div>
		);
	}

	// If driver is explicitly Free, show requested message
	if (profile && profile.status === "Free") {
		return (
			<div className="flex flex-col gap-2">
				<div className="font-medium">You have no any assigned vehicles</div>
			</div>
		);
	}

	if (!vehicle) {
		return (
			<div className="flex flex-col gap-2">
				<div className="font-medium">No vehicle assigned for you</div>
				<div className="text-sm text-muted-foreground">When a vehicle is assigned to you, it will appear here with its current status and upcoming trip details.</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{/* <div className="font-medium">Assigned Vehicle</div> */}
			<div className="rounded-md border p-3 flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<div className="font-medium">{vehicle.vehicle_no}</div>
					{/* <StatusBadge status={vehicle.truck_status} /> */}
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
					<div className="text-muted-foreground">Truck ID</div>
					<div className="font-medium">{vehicle.id}</div>

					{/* <div className="text-muted-foreground">Total trips with this vehicle</div>
					<div className="font-medium">{vehicle.total_trips_with_vehicle}</div>

					<div className="text-muted-foreground">Next trip</div>
					<div className="font-medium">
						{vehicle.next_trip ? (
							<div className="flex flex-col">
								<div className="flex items-center gap-2">
									<span>#{vehicle.next_trip.id}</span>
									<span className="text-xs rounded px-2 py-0.5 bg-blue-100 text-blue-700">{vehicle.next_trip.status}</span>
								</div>
								<div className="text-xs text-muted-foreground">
									{formatDateTime(vehicle.next_trip.scheduled_start)}
									{vehicle.next_trip.scheduled_end ? ` → ${formatDateTime(vehicle.next_trip.scheduled_end)}` : ""}
								</div>
							</div>
						) : (
							<span className="text-muted-foreground">None</span>
						)}
					</div> 

					<div className="text-muted-foreground">Last completed trip end</div>
					<div className="font-medium">{formatDateTime(vehicle.last_completed_trip_end)}</div>*/}
				</div>
			</div>
		</div>
	);
}

function StatusBadge({ status }: { status: string }) {
	const s = (status || "").toLowerCase();
	const cls =
		s === "available"
			? "bg-green-100 text-green-700"
			: s === "busy"
			? "bg-amber-100 text-amber-700"
			: s === "maintenance"
			? "bg-gray-200 text-gray-700"
			: "bg-gray-200 text-gray-700";
	return <span className={`rounded px-2 py-0.5 text-xs capitalize ${cls}`}>{status}</span>;
}
