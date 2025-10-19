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
	Loader2,
	CheckCircle,
} from "lucide-react";
import { getTrainTrips, getPendingOrders, createShipment, type TrainTrip, type PendingOrder } from "@/lib/dispatcher-api";

export default function TrainSchedulingPage() {
	const [trainTrips, setTrainTrips] = useState<TrainTrip[]>([]);
	const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedTrain, setSelectedTrain] = useState<TrainTrip | null>(null);
	const [selectedOrder, setSelectedOrder] = useState<PendingOrder | null>(null);
	const [showManageModal, setShowManageModal] = useState(false);
	const [managedTrain, setManagedTrain] = useState<TrainTrip | null>(null);
	const [assigning, setAssigning] = useState(false);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const [trips, orders] = await Promise.all([
				getTrainTrips(),
				getPendingOrders()
			]);
			setTrainTrips(trips);
			setPendingOrders(orders);
		} catch (err: any) {
			console.error("Error fetching data:", err);
			setError(err?.message || "Failed to fetch data");
		} finally {
			setLoading(false);
		}
	};

	const handleAssignOrder = async () => {
		if (!selectedOrder || !selectedTrain) return;

		try {
			setAssigning(true);
			const result = await createShipment({
				orderId: selectedOrder.orderId,
				trainTripId: selectedTrain.trainTripId
			});
			setSuccessMessage(`Shipment created successfully! ${result.message}`);
			setSelectedOrder(null);
			setSelectedTrain(null);
			// Refresh data
			await fetchData();
			setTimeout(() => setSuccessMessage(null), 5000);
		} catch (err: any) {
			alert(err?.response?.data?.error || "Failed to create shipment");
		} finally {
			setAssigning(false);
		}
	};

	const getCapacityColor = (percentage: number) => {
		if (percentage >= 85) return "text-red-600 bg-red-100";
		if (percentage >= 70) return "text-yellow-600 bg-yellow-100";
		return "text-green-600 bg-green-100";
	};

	const getStatusBadge = (status: string) => {
		const styles: Record<string, string> = {
			scheduled: "bg-blue-100 text-blue-800",
			in_transit: "bg-purple-100 text-purple-800",
			completed: "bg-green-100 text-green-800",
			delayed: "bg-red-100 text-red-800",
		};
		return styles[status] || "bg-gray-100 text-gray-800";
	};

	const getPriorityBadge = (priority: string) => {
		const styles: Record<string, string> = {
			urgent: "bg-red-100 text-red-800",
			high: "bg-orange-100 text-orange-800",
			medium: "bg-yellow-100 text-yellow-800",
			low: "bg-gray-100 text-gray-800",
		};
		return styles[priority] || "bg-gray-100 text-gray-800";
	};

	const capacityPercentage = (allocated: number, total: number) =>
		Math.round((allocated / total) * 100);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-96">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="space-y-6">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">Train Scheduling</h2>
				</div>
				<Card>
					<CardContent className="py-12">
						<div className="text-center">
							<AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
							<p className="text-lg font-medium mb-2">Error Loading Data</p>
							<p className="text-muted-foreground mb-4">{error}</p>
							<Button onClick={fetchData}>Try Again</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const totalCapacity = trainTrips.reduce((acc, t) => acc + t.capacityUnits, 0);
	const totalAllocated = trainTrips.reduce((acc, t) => acc + t.allocatedUnits, 0);
	const utilization = totalCapacity > 0 ? Math.round((totalAllocated / totalCapacity) * 100) : 0;

	return (
		<div className="space-y-6">
			{/* Success Message */}
			{successMessage && (
				<Card className="border-green-200 bg-green-50 dark:bg-green-950">
					<CardContent className="flex items-center gap-2 p-4">
						<CheckCircle className="h-5 w-5 text-green-600" />
						<span className="text-green-800 dark:text-green-200">{successMessage}</span>
					</CardContent>
				</Card>
			)}

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
						<CardTitle className="text-sm font-medium">Scheduled Trains</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{trainTrips.length}</div>
						<p className="text-xs text-muted-foreground mt-1">
							Upcoming departures
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalCapacity}</div>
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
						<div className="text-2xl font-bold">{utilization}%</div>
						<p className="text-xs text-muted-foreground mt-1">
							Average capacity usage
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-orange-600">
							{pendingOrders.length}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Awaiting assignment
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
								Upcoming train departures and capacity status
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{trainTrips.map((train) => {
									const percentage = capacityPercentage(
										train.allocatedUnits,
										train.capacityUnits
									);
									return (
										<div
											key={train.trainTripId}
											className={`border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
												selectedTrain?.trainTripId === train.trainTripId ? 'border-primary bg-primary/5' : ''
											}`}
											onClick={() => setSelectedTrain(train)}
										>
											{/* Train Header */}
											<div className="flex justify-between items-start mb-3">
												<div>
													<div className="flex items-center gap-2">
														<Train className="h-4 w-4 text-primary" />
														<span className="font-semibold">{train.trainName}</span>
													</div>
													<p className="text-xs text-muted-foreground mt-1">
														{train.trainTripId}
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
													<span>{train.fromCity} → {train.toCity}</span>
												</div>
												<div className="flex items-center gap-2">
													<Clock className="h-4 w-4 text-muted-foreground" />
													<span>
														{new Date(train.scheduledDeparture).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
													</span>
												</div>
											</div>

											{/* Capacity Bar */}
											<div className="space-y-2">
												<div className="flex justify-between text-sm">
													<span className="text-muted-foreground">
														Capacity: {train.allocatedUnits}/{train.capacityUnits} units
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
												<div className="text-sm text-green-600">
													{train.availableUnits} units available
												</div>
												<div className="text-xs text-muted-foreground">
													Departs: {new Date(train.scheduledDeparture).toLocaleDateString()}
												</div>
											</div>
										</div>
									);
								})}
								{trainTrips.length === 0 && (
									<div className="text-center py-12">
										<Train className="h-12 w-12 mx-auto text-muted-foreground" />
										<p className="mt-2 text-muted-foreground">No trains scheduled</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Pending Orders - Takes 1 column */}
				<div>
					<Card>
						<CardHeader>
							<CardTitle>Pending Orders</CardTitle>
							<CardDescription>Orders awaiting train assignment</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{pendingOrders.slice(0, 10).map((order) => (
									<div
										key={order.orderId}
										className={`border rounded-lg p-3 cursor-pointer transition-colors ${
											selectedOrder?.orderId === order.orderId ? 'border-primary bg-primary/5' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
										}`}
										onClick={() => setSelectedOrder(order)}
									>
										<div className="flex justify-between items-start mb-2">
											<div>
												<span className="font-medium text-sm">{order.orderId}</span>
												<p className="text-xs text-muted-foreground">{order.customerName}</p>
											</div>
											<div className="text-right">
												<span className="text-xs font-medium">{order.totalSpaceUnits.toFixed(1)} units</span>
												<p className="text-xs text-muted-foreground">{order.destinationCity}</p>
											</div>
										</div>
										<div className="text-xs text-muted-foreground">
											Due: {order.requiredDeliveryDate}
										</div>
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

					{/* Assignment Panel */}
					{selectedTrain && selectedOrder && (
						<Card className="mt-4 border-primary">
							<CardHeader>
								<CardTitle className="text-sm">Assign Order to Train</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="text-sm">
									<p className="font-medium">Order: {selectedOrder.orderId}</p>
									<p className="text-muted-foreground text-xs">{selectedOrder.customerName}</p>
								</div>
								<div className="text-sm">
									<p className="font-medium">Train: {selectedTrain.trainName}</p>
									<p className="text-muted-foreground text-xs">{selectedTrain.fromCity} → {selectedTrain.toCity}</p>
								</div>
								<div className="text-sm">
									<p className="text-muted-foreground">Space Required: {selectedOrder.totalSpaceUnits.toFixed(1)} units</p>
									<p className="text-muted-foreground">Available: {selectedTrain.availableUnits} units</p>
								</div>
								<Button 
									className="w-full" 
									onClick={handleAssignOrder}
									disabled={assigning || selectedOrder.totalSpaceUnits > selectedTrain.availableUnits}
								>
									{assigning ? (
										<>
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											Assigning...
										</>
									) : (
										<>
											<CheckCircle className="h-4 w-4 mr-2" />
											Confirm Assignment
										</>
									)}
								</Button>
								{selectedOrder.totalSpaceUnits > selectedTrain.availableUnits && (
									<p className="text-xs text-red-600">Insufficient capacity on this train</p>
								)}
							</CardContent>
						</Card>
					)}

					{/* Scheduling Tips */}
					<Card className="mt-4">
						<CardHeader>
							<CardTitle className="text-sm flex items-center gap-2">
								<Info className="h-4 w-4" />
								Scheduling Tips
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="text-xs space-y-2 text-muted-foreground">
								<li>• Select a train, then select an order to assign</li>
								<li>• Check capacity before assigning large orders</li>
								<li>• Urgent orders should be prioritized</li>
								<li>• Maintain buffer capacity for emergencies</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
