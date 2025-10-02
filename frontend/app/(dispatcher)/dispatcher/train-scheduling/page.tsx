"use client";

import React, { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Train,
	Calendar,
	Clock,
	MapPin,
	Package,
	AlertCircle,
	ChevronRight,
	Plus,
	Info,
	TrendingUp,
	Users,
} from "lucide-react";

// Mock data for train schedules
const trainSchedules = [
	{
		id: "TRN-KDY-CMB-001",
		trainName: "Express Cargo 101",
		route: { from: "Kandy", to: "Colombo" },
		departure: "2024-01-22 06:00",
		arrival: "2024-01-22 09:00",
		totalCapacity: 1000,
		allocatedCapacity: 850,
		availableCapacity: 150,
		assignedOrders: 12,
		status: "scheduled",
	},
	{
		id: "TRN-KDY-GLE-002",
		trainName: "Coastal Freight 202",
		route: { from: "Kandy", to: "Galle" },
		departure: "2024-01-22 08:30",
		arrival: "2024-01-22 13:00",
		totalCapacity: 800,
		allocatedCapacity: 480,
		availableCapacity: 320,
		assignedOrders: 8,
		status: "scheduled",
	},
	{
		id: "TRN-KDY-MTR-003",
		trainName: "Southern Express 303",
		route: { from: "Kandy", to: "Matara" },
		departure: "2024-01-22 10:00",
		arrival: "2024-01-22 15:30",
		totalCapacity: 900,
		allocatedCapacity: 540,
		availableCapacity: 360,
		assignedOrders: 9,
		status: "scheduled",
	},
	{
		id: "TRN-KDY-JAF-004",
		trainName: "Northern Cargo 404",
		route: { from: "Kandy", to: "Jaffna" },
		departure: "2024-01-22 14:00",
		arrival: "2024-01-22 22:00",
		totalCapacity: 1200,
		allocatedCapacity: 960,
		availableCapacity: 240,
		assignedOrders: 15,
		status: "scheduled",
	},
	{
		id: "TRN-KDY-NEG-005",
		trainName: "Airport Link 505",
		route: { from: "Kandy", to: "Negombo" },
		departure: "2024-01-22 16:30",
		arrival: "2024-01-22 19:30",
		totalCapacity: 700,
		allocatedCapacity: 420,
		availableCapacity: 280,
		assignedOrders: 7,
		status: "scheduled",
	},
];

// Mock unassigned orders grouped by destination
const unassignedOrders = [
	{
		destination: "Colombo",
		orders: [
			{ id: "ORD-001", customer: "ABC Store", spaceUnits: 45, priority: "high" },
			{ id: "ORD-002", customer: "XYZ Market", spaceUnits: 30, priority: "medium" },
			{ id: "ORD-003", customer: "Quick Shop", spaceUnits: 25, priority: "high" },
		],
		totalSpaceUnits: 100,
	},
	{
		destination: "Galle",
		orders: [
			{ id: "ORD-004", customer: "Beach Mart", spaceUnits: 60, priority: "medium" },
			{ id: "ORD-005", customer: "Coastal Store", spaceUnits: 40, priority: "low" },
		],
		totalSpaceUnits: 100,
	},
	{
		destination: "Jaffna",
		orders: [
			{ id: "ORD-006", customer: "North Store", spaceUnits: 180, priority: "urgent" },
		],
		totalSpaceUnits: 180,
	},
];

export default function TrainSchedulingPage() {
	const [selectedTrain, setSelectedTrain] = useState<any>(null);
	const [selectedDestination, setSelectedDestination] = useState("");
	const [showManageModal, setShowManageModal] = useState(false);
	const [managedTrain, setManagedTrain] = useState<any>(null);

	const getCapacityColor = (percentage: number) => {
		if (percentage >= 85) return "text-red-600 bg-red-100";
		if (percentage >= 70) return "text-yellow-600 bg-yellow-100";
		return "text-green-600 bg-green-100";
	};

	const getStatusBadge = (status: string) => {
		const styles = {
			scheduled: "bg-blue-100 text-blue-800",
			in_transit: "bg-purple-100 text-purple-800",
			completed: "bg-green-100 text-green-800",
			delayed: "bg-red-100 text-red-800",
		};
		return styles[status] || "bg-gray-100 text-gray-800";
	};

	const getPriorityBadge = (priority: string) => {
		const styles = {
			urgent: "bg-red-100 text-red-800",
			high: "bg-orange-100 text-orange-800",
			medium: "bg-yellow-100 text-yellow-800",
			low: "bg-gray-100 text-gray-800",
		};
		return styles[priority] || "bg-gray-100 text-gray-800";
	};

	const capacityPercentage = (allocated: number, total: number) =>
		Math.round((allocated / total) * 100);

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div>
				<h2 className="text-3xl font-bold tracking-tight">Train Scheduling</h2>
				<p className="text-muted-foreground">
					Assign orders to train shipments and manage cargo capacity
				</p>
			</div>

			{/* Quick Stats */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">Today's Trains</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{trainSchedules.length}</div>
						<p className="text-xs text-muted-foreground mt-1">
							Scheduled departures
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{trainSchedules.reduce((acc, t) => acc + t.totalCapacity, 0)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Space units available
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">Utilization</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{Math.round(
								(trainSchedules.reduce((acc, t) => acc + t.allocatedCapacity, 0) /
									trainSchedules.reduce((acc, t) => acc + t.totalCapacity, 0)) *
									100
							)}%
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Average capacity usage
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">Unassigned</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-orange-600">
							{unassignedOrders.reduce((acc, d) => acc + d.orders.length, 0)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Orders pending assignment
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Train Schedules - Takes 2 columns */}
				<div className="lg:col-span-2">
					<Card>
						<CardHeader>
							<CardTitle>Train Schedules</CardTitle>
							<CardDescription>
								Today's train departures and capacity status
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{trainSchedules.map((train) => {
									const percentage = capacityPercentage(
										train.allocatedCapacity,
										train.totalCapacity
									);
									return (
										<div
											key={train.id}
											className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
											onClick={() => setSelectedTrain(train)}
										>
											{/* Train Header */}
											<div className="flex justify-between items-start mb-3">
												<div>
													<div className="flex items-center gap-2">
														<Train className="h-4 w-4 text-primary" />
														<span className="font-semibold">{train.id}</span>
														<span
															className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
																train.status
															)}`}
														>
															{train.status}
														</span>
													</div>
													<p className="text-sm text-muted-foreground mt-1">
														{train.trainName}
													</p>
												</div>
												{percentage >= 85 && (
													<div className="flex items-center gap-1 text-red-600">
														<AlertCircle className="h-4 w-4" />
														<span className="text-xs">Near capacity</span>
													</div>
												)}
											</div>

											{/* Route and Time Info */}
											<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-sm">
												<div className="flex items-center gap-2">
													<MapPin className="h-4 w-4 text-muted-foreground" />
													<span>
														{train.route.from} → {train.route.to}
													</span>
												</div>
												<div className="flex items-center gap-2">
													<Clock className="h-4 w-4 text-muted-foreground" />
													<span>
														{train.departure.split(" ")[1]} - {train.arrival.split(" ")[1]}
													</span>
												</div>
											</div>

											{/* Capacity Bar */}
											<div className="space-y-2">
												<div className="flex justify-between text-sm">
													<span className="text-muted-foreground">
														Capacity: {train.allocatedCapacity}/{train.totalCapacity} units
													</span>
													<span className={`font-medium ${getCapacityColor(percentage)}`}>
														{percentage}%
													</span>
												</div>
												<div className="w-full bg-gray-200 rounded-full h-2">
													<div
														className={`h-2 rounded-full transition-all ${
															percentage >= 85
																? "bg-red-500"
																: percentage >= 70
																? "bg-yellow-500"
																: "bg-green-500"
														}`}
														style={{ width: `${percentage}%` }}
													/>
												</div>
											</div>

											{/* Additional Info */}
											<div className="flex justify-between items-center mt-3 pt-3 border-t">
												<div className="flex gap-4 text-sm">
													<span className="flex items-center gap-1">
														<Package className="h-3 w-3" />
														{train.assignedOrders} orders
													</span>
													<span className="text-green-600">
														{train.availableCapacity} units available
													</span>
												</div>
												<Button 
													size="sm" 
													variant="outline"
													onClick={() => {
														setManagedTrain(train);
														setShowManageModal(true);
													}}
												>
													Manage
													<ChevronRight className="h-3 w-3 ml-1" />
												</Button>
											</div>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Unassigned Orders - Takes 1 column */}
				<div>
					<Card>
						<CardHeader>
							<CardTitle>Unassigned Orders</CardTitle>
							<CardDescription>Orders awaiting train assignment</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{unassignedOrders.map((destination) => (
									<div key={destination.destination} className="border rounded-lg p-3">
										<div className="flex justify-between items-center mb-2">
											<span className="font-medium flex items-center gap-2">
												<MapPin className="h-4 w-4" />
												{destination.destination}
											</span>
											<span className="text-sm text-muted-foreground">
												{destination.totalSpaceUnits} units
											</span>
										</div>
										<div className="space-y-2">
											{destination.orders.map((order) => (
												<div
													key={order.id}
													className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm"
												>
													<div>
														<span className="font-medium">{order.id}</span>
														<p className="text-xs text-muted-foreground">
															{order.customer}
														</p>
													</div>
													<div className="flex items-center gap-2">
														<span
															className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityBadge(
																order.priority
															)}`}
														>
															{order.priority}
														</span>
														<span className="text-xs">{order.spaceUnits} units</span>
													</div>
												</div>
											))}
										</div>
										<Button size="sm" className="w-full mt-2" variant="outline">
											<Plus className="h-3 w-3 mr-1" />
											Assign to Train
										</Button>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Capacity Alert */}
					<Card className="mt-4">
						<CardHeader>
							<CardTitle className="text-sm flex items-center gap-2">
								<Info className="h-4 w-4" />
								Scheduling Tips
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="text-xs space-y-2 text-muted-foreground">
								<li>• Consider overflow scheduling for trains at 85% capacity</li>
								<li>• Urgent orders should be prioritized for next available train</li>
								<li>• Check consecutive train schedules for large orders</li>
								<li>• Maintain 15% buffer capacity for last-minute orders</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Train Management Modal */}
			{showManageModal && managedTrain && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-lg font-semibold">Manage Train - {managedTrain.id}</h3>
								<Button 
									variant="ghost" 
									size="icon"
									onClick={() => setShowManageModal(false)}
								>
									×
								</Button>
							</div>

							{/* Train Details */}
							<div className="space-y-4">
								<Card>
									<CardHeader>
										<CardTitle className="text-base">Train Information</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-2 gap-4 text-sm">
											<div>
												<span className="font-medium">Train Name:</span>
												<p className="text-muted-foreground">{managedTrain.trainName}</p>
											</div>
											<div>
												<span className="font-medium">Route:</span>
												<p className="text-muted-foreground">{managedTrain.route.from} → {managedTrain.route.to}</p>
											</div>
											<div>
												<span className="font-medium">Departure:</span>
												<p className="text-muted-foreground">{managedTrain.departure}</p>
											</div>
											<div>
												<span className="font-medium">Arrival:</span>
												<p className="text-muted-foreground">{managedTrain.arrival}</p>
											</div>
											<div>
												<span className="font-medium">Total Capacity:</span>
												<p className="text-muted-foreground">{managedTrain.totalCapacity} units</p>
											</div>
											<div>
												<span className="font-medium">Available Space:</span>
												<p className="text-green-600 font-medium">{managedTrain.availableCapacity} units</p>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Capacity Overview */}
								<Card>
									<CardHeader>
										<CardTitle className="text-base">Capacity Overview</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-2">
											<div className="flex justify-between text-sm">
												<span>Allocated: {managedTrain.allocatedCapacity} units</span>
												<span className="font-medium">
													{Math.round((managedTrain.allocatedCapacity / managedTrain.totalCapacity) * 100)}%
												</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-3">
												<div
													className="bg-blue-500 h-3 rounded-full"
													style={{ 
														width: `${(managedTrain.allocatedCapacity / managedTrain.totalCapacity) * 100}%` 
													}}
												/>
											</div>
											<div className={`text-sm ${managedTrain.availableCapacity < 100 ? 'text-orange-600' : 'text-green-600'}`}>
												{managedTrain.availableCapacity < 100 ? 
													`⚠ Only ${managedTrain.availableCapacity} units remaining` : 
													`✓ ${managedTrain.availableCapacity} units available`
												}
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Assigned Orders */}
								<Card>
									<CardHeader>
										<CardTitle className="text-base">Assigned Orders ({managedTrain.assignedOrders})</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-2 text-sm">
											{/* Mock assigned orders */}
											{Array.from({ length: Math.min(managedTrain.assignedOrders, 5) }, (_, i) => (
												<div key={i} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
													<span>ORD-{String(i + 1).padStart(3, '0')}</span>
													<span className="text-muted-foreground">{20 + i * 5} units</span>
												</div>
											))}
											{managedTrain.assignedOrders > 5 && (
												<div className="text-center text-muted-foreground text-xs">
													... and {managedTrain.assignedOrders - 5} more orders
												</div>
											)}
										</div>
									</CardContent>
								</Card>

								{/* Action Buttons */}
								<div className="flex gap-2 pt-4">
									<Button className="flex-1">
										Add Orders
									</Button>
									<Button variant="outline" className="flex-1">
										Remove Orders
									</Button>
									<Button 
										variant="outline" 
										onClick={() => {
											console.log("Viewing full details for train:", managedTrain.id);
											alert(`Full details for ${managedTrain.id} would be displayed here`);
										}}
									>
										View Full Details
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
