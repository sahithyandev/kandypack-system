import VehiclesList from "@/components/driver/vehicles-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VehiclesPage() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Vehicles</CardTitle>
				</CardHeader>
				<CardContent>
					<VehiclesList />
				</CardContent>
			</Card>
		</div>
	);
}
