import Schedule from "@/components/driver/schedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SchedulePage() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Schedule</CardTitle>
				</CardHeader>
				<CardContent>
					<Schedule />
				</CardContent>
			</Card>
		</div>
	);
}
