import type { DriverTrip } from "@/lib/driver-api";
import { Button } from "@/components/ui/button";

export default function TripCard({ trip }: { trip: DriverTrip }) {
	return (
		<div className="flex items-center justify-between gap-4 rounded-md border p-3">
			<div>
				<div className="font-medium">{trip.id}</div>
				<div className="text-sm text-muted-foreground">
					Route: {trip.route_id}
				</div>
				<div className="text-xs text-muted-foreground">
					Scheduled: {new Date(trip.scheduled_start).toLocaleString()}
				</div>
			</div>
			<div className="flex items-center gap-2">
				<Button
					variant={trip.status === "In_Progress" ? "destructive" : "secondary"}
					size="sm"
				>
					{trip.status}
				</Button>
				<Button variant="ghost" size="sm">
					Details
				</Button>
			</div>
		</div>
	);
}
