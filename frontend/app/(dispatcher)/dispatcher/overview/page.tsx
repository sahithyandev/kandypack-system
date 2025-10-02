"use client";

import React from "react";
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
} from "lucide-react";

const stats = [
	{
		title: "Pending Orders",
		value: "24",
		description: "Awaiting scheduling",
		icon: Package,
		color: "text-yellow-600 bg-yellow-100",
		trend: "+12%",
	},
	{
		title: "Train Shipments",
		value: "8",
		description: "Today's scheduled",
		icon: Train,
		color: "text-blue-600 bg-blue-100",
		trend: "+5%",
	},
	{
		title: "Truck Deliveries",
		value: "15",
		description: "In progress",
		icon: Truck,
		color: "text-green-600 bg-green-100",
		trend: "-3%",
	},
	{
		title: "Delivered Today",
		value: "42",
		description: "Successfully completed",
		icon: CheckCircle,
		color: "text-purple-600 bg-purple-100",
		trend: "+18%",
	},
];

const recentOrders = [
	{
		id: "ORD-001",
		customer: "Colombo Wholesale Store",
		route: "Colombo",
		products: 5,
		status: "pending",
		priority: "high",
		time: "10 mins ago",
	},
	{
		id: "ORD-002",
		customer: "Galle Retail Shop",
		route: "Galle",
		products: 3,
		status: "scheduled",
		priority: "medium",
		time: "25 mins ago",
	},
	{
		id: "ORD-003",
		customer: "Negombo Market",
		route: "Negombo",
		products: 8,
		status: "pending",
		priority: "high",
		time: "45 mins ago",
	},
	{
		id: "ORD-004",
		customer: "Matara Supermarket",
		route: "Matara",
		products: 2,
		status: "in_transit",
		priority: "low",
		time: "1 hour ago",
	},
	{
		id: "ORD-005",
		customer: "Jaffna Store",
		route: "Jaffna",
		products: 12,
		status: "pending",
		priority: "high",
		time: "2 hours ago",
	},
];

const upcomingSchedule = [
	{
		type: "train",
		id: "TRN-KDY-CMB-001",
		route: "Kandy → Colombo",
		departure: "14:30",
		capacity: "85%",
		status: "on_time",
	},
	{
		type: "train",
		id: "TRN-KDY-GLE-002",
		route: "Kandy → Galle",
		departure: "15:45",
		capacity: "60%",
		status: "on_time",
	},
	{
		type: "truck",
		id: "TRK-001",
		route: "Route A - Colombo North",
		departure: "16:00",
		driver: "R. Silva",
		status: "ready",
	},
	{
		type: "truck",
		id: "TRK-002",
		route: "Route B - Colombo South",
		departure: "16:30",
		driver: "K. Perera",
		status: "ready",
	},
];

export default function OverviewPage() {
	const getStatusBadge = (status: string) => {
		const styles = {
			pending: "bg-yellow-100 text-yellow-800",
			scheduled: "bg-blue-100 text-blue-800",
			in_transit: "bg-purple-100 text-purple-800",
			delivered: "bg-green-100 text-green-800",
			on_time: "bg-green-100 text-green-800",
			delayed: "bg-red-100 text-red-800",
			ready: "bg-blue-100 text-blue-800",
		};
		return styles[status] || "bg-gray-100 text-gray-800";
	};

	const getPriorityBadge = (priority: string) => {
		const styles = {
			high: "bg-red-100 text-red-800",
			medium: "bg-orange-100 text-orange-800",
			low: "bg-gray-100 text-gray-800",
		};
		return styles[priority] || "bg-gray-100 text-gray-800";
	};

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
								<div className="flex items-center justify-between">
									<p className="text-xs text-muted-foreground">
										{stat.description}
									</p>
									<span className="text-xs text-green-600 flex items-center gap-1">
										<TrendingUp className="h-3 w-3" />
										{stat.trend}
									</span>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Recent Orders */}
				<Card>
					<CardHeader>
						<CardTitle>Recent Orders</CardTitle>
						<CardDescription>
							Latest orders requiring your attention
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{recentOrders.map((order, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
								>
									<div className="flex-1 space-y-1">
										<div className="flex items-center gap-2">
											<span className="font-medium">{order.id}</span>
											<span
												className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityBadge(
													order.priority
												)}`}
											>
												{order.priority}
											</span>
										</div>
										<p className="text-sm text-muted-foreground">
											{order.customer} • {order.route}
										</p>
										<div className="flex items-center gap-4 text-xs text-muted-foreground">
											<span className="flex items-center gap-1">
												<Package className="h-3 w-3" />
												{order.products} products
											</span>
											<span className="flex items-center gap-1">
												<Clock className="h-3 w-3" />
												{order.time}
											</span>
										</div>
									</div>
									<span
										className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(
											order.status
										)}`}
									>
										{order.status.replace("_", " ")}
									</span>
								</div>
							))}
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
							{upcomingSchedule.map((schedule, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
								>
									<div className="flex items-center gap-3">
										{schedule.type === "train" ? (
											<div className="rounded-full bg-blue-100 p-2 text-blue-600">
												<Train className="h-4 w-4" />
											</div>
										) : (
											<div className="rounded-full bg-green-100 p-2 text-green-600">
												<Truck className="h-4 w-4" />
											</div>
										)}
										<div className="space-y-1">
											<p className="font-medium">{schedule.id}</p>
											<p className="text-sm text-muted-foreground">
												{schedule.route}
											</p>
											{schedule.type === "train" && (
												<p className="text-xs text-muted-foreground">
													Capacity: {schedule.capacity}
												</p>
											)}
											{schedule.type === "truck" && schedule.driver && (
												<p className="text-xs text-muted-foreground">
													Driver: {schedule.driver}
												</p>
											)}
										</div>
									</div>
									<div className="text-right space-y-1">
										<p className="font-medium">{schedule.departure}</p>
										<span
											className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
												schedule.status
											)}`}
										>
											{schedule.status.replace("_", " ")}
										</span>
									</div>
								</div>
							))}
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
