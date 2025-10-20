"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { getDriverProfile, type DriverProfile } from "@/lib/driver-api";

// Types
type Color = "blue" | "green" | "amber";

// Subtle color accents for cards (avoid dynamic class names to keep Tailwind happy)
const colorStyles: Record<Color, { container: string; title?: string; value?: string; subtitle?: string }> = {
	blue: {
		container: "border-blue-200 dark:border-blue-900 bg-blue-50/80 dark:bg-blue-950/30",
		title: "",
		value: "",
		subtitle: "",
	},
	green: {
		container: "border-emerald-200 dark:border-emerald-900 bg-emerald-50/80 dark:bg-emerald-950/30",
		title: "",
		value: "",
		subtitle: "",
	},
	amber: {
		container: "border-amber-200 dark:border-amber-900 bg-amber-50/80 dark:bg-amber-950/30",
		title: "",
		value: "",
		subtitle: "",
	},
};

// Formatting helpers
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

// compact helpers for prominent display
const compactDistance = (km?: number) => {
	if (km == null) return "—";
	return `${Math.round(km)} km`;
};

const compactTime = (minutes?: number) => {
	if (minutes == null) return "—";
	if (minutes >= 60) return `${Math.round(minutes / 60)}h`;
	return `${Math.round(minutes)}m`;
};

// Generic colored stats card
export function StatsCard({
	title,
	primary,
	subtitle,
	color = "blue",
}: {
	title: string;
	primary: ReactNode;
	subtitle?: ReactNode;
	color?: Color;
}) {
	const styles = colorStyles[color];
	return (
		<div className={`rounded-md border p-3 ${styles.container}`}>
			<div className={`text-sm text-muted-foreground ${styles.title ?? ""}`}>{title}</div>
			<div className={`text-2xl font-semibold leading-tight ${styles.value ?? ""}`}>{primary}</div>
			{subtitle ? (
				<div className={`text-xs text-muted-foreground mt-1 ${styles.subtitle ?? ""}`}>{subtitle}</div>
			) : null}
		</div>
	);
}

// Individual stat cards (named exports)
export function TripsStatCard({ totalTrips, color = "blue" }: { totalTrips?: number; color?: Color }) {
	return (
		<StatsCard title="Total trips" primary={totalTrips ?? "—"} color={color} />
	);
}

export function DistanceStatCard({
	todayKm,
	cumulativeKm,
	color = "green",
}: {
	todayKm?: number;
	cumulativeKm?: number;
	color?: Color;
}) {
	return (
		<StatsCard
			title="Distance driven"
			primary={compactDistance(todayKm)}
			subtitle={<span>Cumulative: {formatDistance(cumulativeKm)}</span>}
			color={color}
		/>
	);
}

export function DrivingTimeStatCard({
	todayMinutes,
	cumulative,
	color = "amber",
}: {
	todayMinutes?: number;
	// cumulative can be in hours or minutes (if > 24, we treat it as minutes like previous logic)
	cumulative?: number;
	color?: Color;
}) {
	const cumulativeText = (() => {
		if (typeof cumulative !== "number") return "—";
		return cumulative > 24 ? formatMinutesToHours(cumulative) : `${cumulative}h`;
	})();
	return (
		<StatsCard
			title="Driving time"
			primary={compactTime(todayMinutes)}
			subtitle={<span>Cumulative: {cumulativeText}</span>}
			color={color}
		/>
	);
}

// Default composed view using the named cards
export default function DashboardStats({ data }: { data?: any }) {
	// Expected data shape (partial):
	// {
	//   totalTrips: number,
	//   distanceKm: number,           // cumulative distance
	//   drivingHours: number,         // cumulative driving hours (in minutes or hours?)
	//   today?: { distanceKm?: number, drivingMinutes?: number }
	// }

	const [profile, setProfile] = useState<DriverProfile | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let alive = true;
		// Only fetch if no data prop provided
		if (data) return;
		(async () => {
			try {
				setLoading(true);
				setError(null);
				const p = await getDriverProfile();
				if (!alive) return;
				setProfile(p);
			} catch (e: unknown) {
				if (!alive) return;
				const msg = e instanceof Error ? e.message : "Failed to load stats";
				setError(msg);
			} finally {
				if (alive) setLoading(false);
			}
		})();
		return () => {
			alive = false;
		};
	}, [data]);

	const stats = useMemo(() => {
		if (data) return data;
		if (!profile) return null;
		return {
			totalTrips: profile.total_trips,
			distanceKm: profile.cumulative_distance,
			drivingHours: profile.cumulative_time, // see component note: treated as minutes if > 24
			today: {
				distanceKm: profile.daily_driving_distance,
				drivingMinutes: profile.daily_driving_time,
			},
		} as const;
	}, [data, profile]);

	if (!data && loading && !stats) {
		return (
			<div className="grid grid-cols-3 gap-4">
				<div className="rounded-md border p-3 text-sm text-muted-foreground">Loading stats…</div>
			</div>
		);
	}

	if (!data && error && !stats) {
		return (
			<div className="grid grid-cols-3 gap-4">
				<div className="rounded-md border p-3 text-sm text-red-600">{error}</div>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-3 gap-4">
			<TripsStatCard totalTrips={stats?.totalTrips} color="blue" />
			<DistanceStatCard todayKm={stats?.today?.distanceKm} cumulativeKm={stats?.distanceKm} color="green" />
			<DrivingTimeStatCard todayMinutes={stats?.today?.drivingMinutes} cumulative={stats?.drivingHours} color="amber" />
		</div>
	);
}
