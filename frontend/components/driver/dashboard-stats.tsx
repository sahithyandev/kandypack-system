"use client";

export default function DashboardStats({ data }: { data?: any }) {
	// Expected data shape (partial):
	// {
	//   totalTrips: number,
	//   distanceKm: number,           // cumulative distance
	//   drivingHours: number,         // cumulative driving hours (in minutes or hours?)
	//   today?: { distanceKm?: number, drivingMinutes?: number }
	// }

	const stats = data ?? {
		totalTrips: 342,
		distanceKm: 48230,
		drivingHours: 1240,
		today: { distanceKm: 32.4, drivingMinutes: 145 },
	};

	const formatDistance = (km?: number) => {
		if (km == null) return "—";
		// show with one decimal if < 100, otherwise integer with thousands
		if (Math.abs(km) < 100) return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(km) + " km";
		return new Intl.NumberFormat("en-US").format(Math.round(km)) + " km";
	};

	const formatMinutesToHours = (minutes?: number) => {
		if (minutes == null) return "—";
		const m = Math.round(minutes);
		const hours = Math.floor(m / 60);
		const mins = m % 60;
		if (hours === 0) return `${mins}m`;
		return `${hours}h ${mins}m`;
	};

	// compact helpers for today's small display
	const compactDistance = (km?: number) => {
		if (km == null) return "—";
		return `${Math.round(km)} km`;
	};

	const compactTime = (minutes?: number) => {
		if (minutes == null) return "—";
		if (minutes >= 60) return `${Math.round(minutes / 60)}h`;
		return `${Math.round(minutes)}m`;
	};

	return (
		<div className="grid grid-cols-3 gap-4">
			<div className="rounded-md border p-3">
				<div className="text-sm text-muted-foreground">Total trips</div>
				<div className="text-2xl font-semibold">{stats.totalTrips}</div>
			</div>
			<div className="rounded-md border p-3">
				<div className="text-sm text-muted-foreground">Distance driven</div>
				<div className="text-2xl font-semibold">
					{compactDistance(stats.today?.distanceKm)}
				</div>
				<div className="text-xs text-muted-foreground mt-1">Cumulative: {formatDistance(stats.distanceKm)}</div>
			</div>
			<div className="rounded-md border p-3">
				<div className="text-sm text-muted-foreground">Driving time</div>
				<div className="text-2xl font-semibold">
					 {compactTime(stats.today?.drivingMinutes)}
				</div>
				<div className="text-xs text-muted-foreground mt-1">Cumulative: {typeof stats.drivingHours === 'number' && stats.drivingHours > 24
						? formatMinutesToHours(stats.drivingHours)
						: `${stats.drivingHours}h`}</div>
			</div>
		</div>
	);
}
