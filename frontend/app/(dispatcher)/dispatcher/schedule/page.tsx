"use client";

import React, { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Train,
	Truck,
	Clock,
	MapPin,
	Package,
	Calendar,
	Filter,
	Download,
	Eye,
	AlertCircle,
	CheckCircle,
	Users,
	Loader2,
} from "lucide-react";
import { getScheduleOverview, type ScheduleOverview } from "@/lib/dispatcher-api";

export default function ScheduleOverviewPage() {
	const [schedule, setSchedule] = useState<ScheduleOverview | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<"list" | "timeline">("list");
	const [filterType, setFilterType] = useState<"all" | "trains" | "trucks">("all");

	useEffect(() => {
		fetchSchedule();
	}, []);

	const fetchSchedule = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await getScheduleOverview();
			setSchedule(data);
		} catch (err: any) {
			console.error("Error fetching schedule:", err);
			setError(err?.message || "Failed to fetch schedule");
		} finally {
			setLoading(false);
		}
	};

	const getStatusBadge = (status: string) => {
		const styles: { [key: string]: string } = {
			Scheduled: "bg-blue-100 text-blue-800",
			In_Progress: "bg-purple-100 text-purple-800",
			Completed: "bg-green-100 text-green-800",
			Delayed: "bg-red-100 text-red-800",
		};
		return styles[status] || "bg-gray-100 text-gray-800";
	};

	const getStatusIcon = (status: string) => {
		if (status === "Completed") return <CheckCircle className="h-4 w-4 text-green-600" />;
		if (status === "Delayed") return <AlertCircle className="h-4 w-4 text-red-600" />;
		if (status === "In_Progress") return <Clock className="h-4 w-4 text-purple-600" />;
		return <Clock className="h-4 w-4 text-blue-600" />;
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-96">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (error || !schedule) {
		return (
			<div className="space-y-6">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">Schedule Overview</h2>
				</div>
				<Card>
					<CardContent className="py-12">
						<div className="text-center">
							<AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
							<p className="text-lg font-medium mb-2">Error Loading Schedule</p>
							<p className="text-muted-foreground mb-4">{error || "Failed to load schedule"}</p>
							<Button onClick={fetchSchedule}>Try Again</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const totalScheduled = schedule.trainTrips.length + schedule.truckTrips.length;
	const inProgressTrucks = schedule.truckTrips.filter(t => t.status === "In_Progress").length;
	const completedTrips = schedule.truckTrips.filter(t => t.status === "Completed").length;

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">Schedule Overview</h2>
					<p className="text-muted-foreground">
						Complete view of all train and truck schedules
					</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" size="sm">
						<Download className="h-4 w-4 mr-1" />
						Export
					</Button>
					<Button variant="outline" size="sm">
						<Eye className="h-4 w-4 mr-1" />
						Print View
					</Button>
				</div>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<div className="flex items-center gap-2">
							<Calendar className="h-5 w-5 text-primary" />
							<span className="text-lg font-semibold">Current Schedule</span>
						</div>
						<div className="flex gap-2">
							<select
								className="px-3 py-1.5 border rounded-md text-sm"
								value={viewMode}
								onChange={(e) => setViewMode(e.target.value as "list" | "timeline")}
							>
								<option value="list">List View</option>
								<option value="timeline">Timeline View</option>
							</select>
							<select
								className="px-3 py-1.5 border rounded-md text-sm"
								value={filterType}
								onChange={(e) => setFilterType(e.target.value as "all" | "trains" | "trucks")}
							>
								<option value="all">All Schedules</option>
								<option value="trains">Trains Only</option>
								<option value="trucks">Trucks Only</option>
							</select>
						</div>
					</div>
				</CardHeader>
			</Card>

			{/* Statistics */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">Total Scheduled</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalScheduled}</div>
						<p className="text-xs text-muted-foreground mt-1">
							{schedule.trainTrips.length} trains, {schedule.truckTrips.length} trucks
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">Completed</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">{completedTrips}</div>
						<p className="text-xs text-muted-foreground mt-1">
							Successfully delivered
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">In Transit</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-purple-600">
							{inProgressTrucks}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Currently on route
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">Train Trips</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">{schedule.trainTrips.length}</div>
						<p className="text-xs text-muted-foreground mt-1">
							Scheduled departures
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Schedule Lists */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Trains List */}
				{(filterType === "all" || filterType === "trains") && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Train className="h-5 w-5" />
								Train Schedule
							</CardTitle>
							<CardDescription>{schedule.trainTrips.length} scheduled trips</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{schedule.trainTrips.map((train) => (
									<div key={train.trainTripId} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
										<div className="flex justify-between items-start mb-2">
											<div>
												<span className="font-semibold">{train.trainName}</span>
												<p className="text-sm text-muted-foreground mt-1">
													To {train.toCity}
												</p>
											</div>
											<span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(train.status)}`}>
												{train.status}
											</span>
										</div>
										<div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
											<div className="flex items-center gap-1">
												<Clock className="h-3 w-3" />
												{new Date(train.scheduledDeparture).toLocaleString([], {
													month: 'short',
													day: 'numeric',
													hour: '2-digit',
													minute: '2-digit'
												})}
											</div>
											<div className="flex items-center gap-1">
												<Package className="h-3 w-3" />
												{train.shipmentCount} shipments
											</div>
										</div>
									</div>
								))}
								{schedule.trainTrips.length === 0 && (
									<div className="text-center py-8">
										<Train className="h-12 w-12 mx-auto text-muted-foreground" />
										<p className="mt-2 text-muted-foreground">No train trips scheduled</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Trucks List */}
				{(filterType === "all" || filterType === "trucks") && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Truck className="h-5 w-5" />
								Truck Schedule
							</CardTitle>
							<CardDescription>{schedule.truckTrips.length} scheduled trips</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{schedule.truckTrips.map((truck) => (
									<div key={truck.truckTripId} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
										<div className="flex justify-between items-start mb-2">
											<div>
												<span className="font-semibold">{truck.vehicleNo}</span>
												<p className="text-sm text-muted-foreground mt-1">
													{truck.routeName}
												</p>
											</div>
											<span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(truck.status)}`}>
												{truck.status.replace("_", " ")}
											</span>
										</div>
										<div className="space-y-1 text-sm text-muted-foreground">
											<div className="flex items-center gap-1">
												<Clock className="h-3 w-3" />
												Departure: {new Date(truck.scheduledStart).toLocaleString([], {
													month: 'short',
													day: 'numeric',
													hour: '2-digit',
													minute: '2-digit'
												})}
											</div>
											<div className="flex items-center gap-1">
												<Users className="h-3 w-3" />
												Driver: {truck.driverName}
											</div>
										</div>
									</div>
								))}
								{schedule.truckTrips.length === 0 && (
									<div className="text-center py-8">
										<Truck className="h-12 w-12 mx-auto text-muted-foreground" />
										<p className="mt-2 text-muted-foreground">No truck trips scheduled</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				)}
			</div>

			{/* System Status */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<CheckCircle className="h-5 w-5 text-green-600" />
						System Status
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
						<CheckCircle className="h-5 w-5 text-green-600" />
						<div>
							<p className="text-sm font-medium">All Systems Operational</p>
							<p className="text-xs text-muted-foreground">
								Schedule data is up to date • Last refreshed: {new Date().toLocaleTimeString()}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
