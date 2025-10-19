"use client";

import React, { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Package,
	Train,
	Truck,
	Clock,
	AlertCircle,
	CheckCircle,
	TrendingUp,
	Users,
	Loader2,
	Calendar,
} from "lucide-react";
import { getScheduleOverview, getPendingOrders, type ScheduleOverview, type PendingOrder } from "@/lib/dispatcher-api";

export default function OverviewPage() {
	const [schedule, setSchedule] = useState<ScheduleOverview | null>(null);
	const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const [scheduleData, ordersData] = await Promise.all([
				getScheduleOverview(),
				getPendingOrders()
			]);
			setSchedule(scheduleData);
			setPendingOrders(ordersData);
		} catch (err: any) {
			console.error("Error fetching data:", err);
			setError(err?.message || "Failed to fetch data");
		} finally {
			setLoading(false);
		}
	};

	const getStatusBadge = (status: string) => {
		const styles: Record<string, string> = {
			pending: "bg-yellow-100 text-yellow-800",
			scheduled: "bg-blue-100 text-blue-800",
			in_transit: "bg-purple-100 text-purple-800",
			delivered: "bg-green-100 text-green-800",
			on_time: "bg-green-100 text-green-800",
			delayed: "bg-red-100 text-red-800",
			ready: "bg-blue-100 text-blue-800",
			Scheduled: "bg-blue-100 text-blue-800",
			In_Progress: "bg-purple-100 text-purple-800",
		};
		return styles[status] || "bg-gray-100 text-gray-800";
	};

	const getPriorityBadge = (priority: string) => {
		const styles: Record<string, string> = {
			high: "bg-red-100 text-red-800",
			medium: "bg-orange-100 text-orange-800",
			low: "bg-gray-100 text-gray-800",
		};
		return styles[priority] || "bg-gray-100 text-gray-800";
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
					<h2 className="text-3xl font-bold tracking-tight">Overview</h2>
				</div>
				<Card>
					<CardContent className="py-12">
						<div className="text-center">
							<AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
							<p className="text-lg font-medium mb-2">Error Loading Data</p>
							<p className="text-muted-foreground">{error || "Failed to load overview"}</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const inProgressTruckTrips = schedule.truckTrips.filter(t => t.status === "In_Progress").length;

	const stats = [
		{
			title: "Pending Orders",
			value: pendingOrders.length.toString(),
			description: "Awaiting scheduling",
			icon: Package,
			color: "text-yellow-600 bg-yellow-100",
		},
		{
			title: "Train Shipments",
			value: schedule.trainTrips.length.toString(),
			description: "Scheduled trips",
			icon: Train,
			color: "text-blue-600 bg-blue-100",
		},
		{
			title: "Truck Deliveries",
			value: inProgressTruckTrips.toString(),
			description: "In progress",
			icon: Truck,
			color: "text-green-600 bg-green-100",
		},
		{
			title: "Total Truck Trips",
			value: schedule.truckTrips.length.toString(),
			description: "Scheduled deliveries",
			icon: CheckCircle,
			color: "text-purple-600 bg-purple-100",
		},
	];

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div>
				<h2 className="text-3xl font-bold tracking-tight">Overview</h2>
				<p className="text-muted-foreground">
					Welcome back! Here's what's happening with your deliveries today.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<Card key={index}>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									{stat.title}
								</CardTitle>
								<div className={`rounded-full p-2 ${stat.color}`}>
									<Icon className="h-4 w-4" />
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stat.value}</div>
								<p className="text-xs text-muted-foreground mt-1">
									{stat.description}
								</p>
							</CardContent>
						</Card>
					);
				})}
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Recent Orders */}
				<Card>
					<CardHeader>
						<CardTitle>Recent Pending Orders</CardTitle>
						<CardDescription>
							Latest orders awaiting scheduling
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{pendingOrders.slice(0, 5).map((order) => (
								<div
									key={order.orderId}
									className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
								>
									<div className="flex-1 space-y-1">
										<div className="flex items-center gap-2">
											<span className="font-medium">{order.orderId}</span>
										</div>
										<p className="text-sm text-muted-foreground">
											{order.customerName} • {order.destinationCity}
										</p>
										<div className="flex items-center gap-4 text-xs text-muted-foreground">
											<span className="flex items-center gap-1">
												<Package className="h-3 w-3" />
												{order.totalSpaceUnits.toFixed(1)} units
											</span>
											<span className="flex items-center gap-1">
												<Clock className="h-3 w-3" />
												Due: {order.requiredDeliveryDate}
											</span>
										</div>
									</div>
									<span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
										Pending
									</span>
								</div>
							))}
							{pendingOrders.length === 0 && (
								<div className="text-center py-8">
									<Package className="h-8 w-8 mx-auto text-muted-foreground" />
									<p className="mt-2 text-sm text-muted-foreground">No pending orders</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Upcoming Schedule */}
				<Card>
					<CardHeader>
						<CardTitle>Upcoming Schedule</CardTitle>
						<CardDescription>
							Next departures and deliveries
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{schedule.trainTrips.slice(0, 3).map((trip) => (
								<div
									key={trip.trainTripId}
									className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
								>
									<div className="flex items-center gap-3">
										<div className="rounded-full bg-blue-100 p-2 text-blue-600">
											<Train className="h-4 w-4" />
										</div>
										<div className="space-y-1">
											<p className="font-medium">{trip.trainName}</p>
											<p className="text-sm text-muted-foreground">
												{trip.toCity}
											</p>
											<p className="text-xs text-muted-foreground">
												{trip.shipmentCount} shipments
											</p>
										</div>
									</div>
									<div className="text-right space-y-1">
										<p className="font-medium text-sm">
											{new Date(trip.scheduledDeparture).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
										</p>
										<span
											className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
												trip.status
											)}`}
										>
											{trip.status}
										</span>
									</div>
								</div>
							))}
							{schedule.truckTrips.slice(0, 2).map((trip) => (
								<div
									key={trip.truckTripId}
									className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
								>
									<div className="flex items-center gap-3">
										<div className="rounded-full bg-green-100 p-2 text-green-600">
											<Truck className="h-4 w-4" />
										</div>
										<div className="space-y-1">
											<p className="font-medium">{trip.vehicleNo}</p>
											<p className="text-sm text-muted-foreground">
												{trip.routeName}
											</p>
											<p className="text-xs text-muted-foreground">
												Driver: {trip.driverName}
											</p>
										</div>
									</div>
									<div className="text-right space-y-1">
										<p className="font-medium text-sm">
											{new Date(trip.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
										</p>
										<span
											className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
												trip.status
											)}`}
										>
											{trip.status.replace("_", " ")}
										</span>
									</div>
								</div>
							))}
							{schedule.trainTrips.length === 0 && schedule.truckTrips.length === 0 && (
								<div className="text-center py-8">
									<Calendar className="h-8 w-8 mx-auto text-muted-foreground" />
									<p className="mt-2 text-sm text-muted-foreground">No scheduled trips</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* System Alerts */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<AlertCircle className="h-5 w-5" />
						System Alerts
					</CardTitle>
					<CardDescription>Important notifications and warnings</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
							<AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
							<div>
								<p className="text-sm font-medium">High Order Volume</p>
								<p className="text-xs text-muted-foreground">
									24 pending orders need immediate scheduling. Consider adding extra truck trips.
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
							<Train className="h-5 w-5 text-blue-600 mt-0.5" />
							<div>
								<p className="text-sm font-medium">Train Capacity Alert</p>
								<p className="text-xs text-muted-foreground">
									TRN-KDY-CMB-001 is at 85% capacity. Consider overflow scheduling for next trip.
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
							<CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
							<div>
								<p className="text-sm font-medium">All Systems Operational</p>
								<p className="text-xs text-muted-foreground">
									Database connected • API responding • No critical errors
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
