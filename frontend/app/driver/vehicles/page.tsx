import VehicleInfo from "@/components/driver/vehicle-info";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VehiclesPage() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Vehicles</CardTitle>
				</CardHeader>
				<CardContent>
					<VehicleInfo />
				</CardContent>
			</Card>
		</div>
	);
}
