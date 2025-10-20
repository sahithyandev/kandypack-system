import Calendar from "@/components/driver/calendar";
import CurrentTrip from "@/components/driver/current-trip";
import DashboardStats from "@/components/driver/dashboard-stats";
import MapPlaceholder from "@/components/driver/map-placeholder";
import Schedule from "@/components/driver/schedule";
import VehicleInfo from "@/components/driver/vehicle-info";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DriverHome() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<section className="lg:col-span-3 flex flex-col gap-6">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">Overview</h2>
					<p className="text-muted-foreground">
						Welcome back! Here's what's happening with your trips today.
					</p>
				</div>

				<Card>
					<CardContent>
						<DashboardStats />
					</CardContent>
				</Card>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<Card>
						<CardHeader>
							<CardTitle>Current Trip</CardTitle>
						</CardHeader>
						<CardContent>
							<CurrentTrip />
						</CardContent>
					</Card>

					{/* <Card>
						<CardHeader>
							<CardTitle>Map</CardTitle>
						</CardHeader>
						<CardContent>
							<MapPlaceholder />
						</CardContent>
					</Card> */}
									<Card>
					<CardHeader>
						<CardTitle>Current Vehicle</CardTitle>
					</CardHeader>
					<CardContent>
						<VehicleInfo />
					</CardContent>
				</Card>
				</div>

			<aside className="flex flex-col gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Schedule</CardTitle>
					</CardHeader>
					<CardContent>
						<Schedule />
					</CardContent>
				</Card>
				{/* <Card>
					<CardHeader>
						<CardTitle>Calendar</CardTitle>
					</CardHeader>
					<CardContent>
						<Calendar />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Current Vehicle</CardTitle>
					</CardHeader>
					<CardContent>
						<VehicleInfo />
					</CardContent>
				</Card> */}
			</aside>
			</section>

		</div>
	);
}
