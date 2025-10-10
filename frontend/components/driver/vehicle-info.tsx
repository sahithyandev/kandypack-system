"use client";

export default function VehicleInfo() {
	const vehicle = {
		id: "VEH-123",
		type: "Truck",
		plate: "KA-01-XY-9999",
		fuel: 62,
		maintenanceDue: "2025-11-01",
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="font-medium">
				{vehicle.type} — {vehicle.plate}
			</div>
			<div className="text-sm text-muted-foreground">Fuel: {vehicle.fuel}%</div>
			<div className="text-sm text-muted-foreground">
				Maintenance due: {vehicle.maintenanceDue}
			</div>
			<div className="mt-2 flex gap-2">
				<button
					type="button"
					className="rounded bg-primary px-3 py-1 text-sm text-white"
				>
					Report issue
				</button>
				<button type="button" className="rounded border px-3 py-1 text-sm">
					View logs
				</button>
			</div>
		</div>
	);
}
