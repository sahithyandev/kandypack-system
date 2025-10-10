import AssignedTrips from "@/components/driver/assigned-trips";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TripsPage() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>All Trips</CardTitle>
				</CardHeader>
				<CardContent>
					<AssignedTrips />
				</CardContent>
			</Card>
		</div>
	);
}
