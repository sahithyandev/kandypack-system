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
import { Label } from "@/components/ui/label";
import {
	Truck,
	Users,
	MapPin,
	Package,
	AlertCircle,
	Calendar,
	UserCheck,
	CheckCircle,
	Loader2,
	Clock,
} from "lucide-react";
import { 
	getShipmentsAtStore, 
	getAvailableResources, 
	createTruckTrip,
	type ShipmentAtStore,
	type AvailableResources 
} from "@/lib/dispatcher-api";

export default function TruckSchedulingPage() {
	const [shipments, setShipments] = useState<ShipmentAtStore[]>([]);
	const [resources, setResources] = useState<AvailableResources | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedShipment, setSelectedShipment] = useState<ShipmentAtStore | null>(null);
	const [selectedTruck, setSelectedTruck] = useState("");
	const [selectedDriver, setSelectedDriver] = useState("");
	const [selectedAssistant, setSelectedAssistant] = useState("");
	const [scheduledDate, setScheduledDate] = useState("");
	const [scheduledTime, setScheduledTime] = useState("");
	const [estimatedDuration, setEstimatedDuration] = useState("4");
	const [scheduling, setScheduling] = useState(false);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	useEffect(() => {
		fetchData();
		// Set default date to tomorrow and time to 09:00
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		setScheduledDate(tomorrow.toISOString().split('T')[0]);
		setScheduledTime("09:00");
	}, []);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const [shipmentsData, resourcesData] = await Promise.all([
				getShipmentsAtStore(),
				getAvailableResources()
			]);
			setShipments(shipmentsData);
			setResources(resourcesData);
		} catch (err: any) {
			console.error("Error fetching data:", err);
			setError(err?.message || "Failed to fetch data");
		} finally {
			setLoading(false);
		}
	};

	const handleScheduleTruckTrip = async () => {
		if (!selectedShipment || !selectedTruck || !selectedDriver || !scheduledDate || !scheduledTime) {
			alert("Please select shipment, truck, driver, and schedule time");
			return;
		}

		try {
			setScheduling(true);
			const scheduledStart = `${scheduledDate}T${scheduledTime}:00Z`;
			const durationHours = parseFloat(estimatedDuration);
			const endTime = new Date(scheduledStart);
			endTime.setHours(endTime.getHours() + durationHours);
			const scheduledEnd = endTime.toISOString();

			await createTruckTrip({
				shipmentId: selectedShipment.shipmentId,
				truckId: selectedTruck,
				routeId: selectedShipment.routeId || "default-route",
				driverId: selectedDriver,
				assistantId: selectedAssistant || undefined,
				scheduledStart,
				scheduledEnd,
			});

			setSuccessMessage("Truck trip scheduled successfully!");
			setSelectedShipment(null);
			setSelectedTruck("");
			setSelectedDriver("");
			setSelectedAssistant("");
			await fetchData();
			setTimeout(() => setSuccessMessage(null), 5000);
		} catch (err: any) {
			alert(err?.response?.data?.error || err?.message || "Failed to schedule truck trip");
		} finally {
			setScheduling(false);
		}
	};

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
					<h2 className="text-3xl font-bold tracking-tight">Truck Scheduling</h2>
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

	const availableDrivers = resources?.drivers || [];
	const availableAssistants = resources?.assistants || [];
	const availableTrucks = resources?.trucks || [];

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div>
				<h2 className="text-3xl font-bold tracking-tight">Truck Scheduling</h2>
				<p className="text-muted-foreground">
					Assign trucks, drivers, and assistants for last-mile delivery
				</p>
			</div>

			{/* Resource Availability Stats */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<Truck className="h-4 w-4" />
							Available Trucks
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{availableTrucks.length}</div>
						<p className="text-xs text-muted-foreground mt-1">
							Ready for assignment
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<Users className="h-4 w-4" />
							Available Drivers
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{availableDrivers.length}</div>
						<p className="text-xs text-muted-foreground mt-1">
							Ready for assignment
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<UserCheck className="h-4 w-4" />
							Available Assistants
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{availableAssistants.length}</div>
						<p className="text-xs text-muted-foreground mt-1">
							Ready for assignment
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<Package className="h-4 w-4" />
							Pending Shipments
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-orange-600">
							{shipments.length}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Awaiting truck assignment
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Success Message */}
			{successMessage && (
				<Card className="border-green-200 bg-green-50 dark:bg-green-950">
					<CardContent className="flex items-center gap-2 p-4">
						<CheckCircle className="h-5 w-5 text-green-600" />
						<span className="text-green-800 dark:text-green-200">
							{successMessage}
						</span>
					</CardContent>
				</Card>
			)}

			{/* Main Content Grid */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Shipments Section */}
				<Card>
					<CardHeader>
						<CardTitle>Shipments at Store</CardTitle>
						<CardDescription>Shipments awaiting truck delivery</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{shipments.map((shipment) => (
								<div
									key={shipment.shipmentId}
									className={`border rounded-lg p-4 cursor-pointer transition-colors ${
										selectedShipment?.shipmentId === shipment.shipmentId
											? "border-primary bg-primary/5"
											: "hover:bg-gray-50 dark:hover:bg-gray-800"
									}`}
									onClick={() => setSelectedShipment(shipment)}
								>
									<div className="flex justify-between items-start mb-2">
										<div>
											<div className="flex items-center gap-2">
												<span className="font-semibold">{shipment.orderId}</span>
											</div>
											<p className="text-sm font-medium mt-1">{shipment.customerName}</p>
										</div>
										{selectedShipment?.shipmentId === shipment.shipmentId && (
											<CheckCircle className="h-5 w-5 text-primary" />
										)}
									</div>

									<div className="space-y-2 text-sm">
										<div className="flex items-center gap-2 text-muted-foreground">
											<MapPin className="h-3 w-3" />
											<span className="text-xs">
												{shipment.deliveryAddress}
											</span>
										</div>
										{shipment.routeName && (
											<div className="flex items-center gap-2 text-muted-foreground">
												<Package className="h-3 w-3" />
												<span className="text-xs">Route: {shipment.routeName}</span>
											</div>
										)}
									</div>
								</div>
							))}
							{shipments.length === 0 && (
								<div className="text-center py-8">
									<Package className="h-12 w-12 mx-auto text-muted-foreground" />
									<p className="mt-2 text-muted-foreground">No shipments awaiting delivery</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Resource Assignment Section */}
				<div className="space-y-4">
					{/* Trucks */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Available Trucks</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{availableTrucks.map((truck) => (
									<div
										key={truck.truckId}
										className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer transition-colors ${
											selectedTruck === truck.truckId
												? "border-primary bg-primary/5"
												: "hover:bg-gray-50 dark:hover:bg-gray-800"
										}`}
										onClick={() => setSelectedTruck(truck.truckId)}
									>
										<div>
											<span className="font-medium">{truck.vehicleNo}</span>
											<p className="text-xs text-muted-foreground">
												ID: {truck.truckId}
											</p>
										</div>
										<div
											className={`w-4 h-4 rounded-full border-2 ${
												selectedTruck === truck.truckId
													? "border-primary bg-primary"
													: "border-gray-300"
											}`}
										/>
									</div>
								))}
								{availableTrucks.length === 0 && (
									<p className="text-sm text-muted-foreground text-center py-4">
										No trucks available
									</p>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Drivers */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Available Drivers</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{availableDrivers.map((driver) => (
									<div
										key={driver.workerId}
										className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer transition-colors ${
											selectedDriver === driver.workerId
												? "border-primary bg-primary/5"
												: "hover:bg-gray-50 dark:hover:bg-gray-800"
										}`}
										onClick={() => setSelectedDriver(driver.workerId)}
									>
										<div>
											<span className="font-medium">{driver.name}</span>
											<p className="text-xs text-muted-foreground">
												ID: {driver.workerId}
											</p>
										</div>
										<div
											className={`w-4 h-4 rounded-full border-2 ${
												selectedDriver === driver.workerId
													? "border-primary bg-primary"
													: "border-gray-300"
											}`}
										/>
									</div>
								))}
								{availableDrivers.length === 0 && (
									<p className="text-sm text-muted-foreground text-center py-4">
										No drivers available
									</p>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Assistants */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Available Assistants (Optional)</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{availableAssistants.map((assistant) => (
									<div
										key={assistant.workerId}
										className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer transition-colors ${
											selectedAssistant === assistant.workerId
												? "border-primary bg-primary/5"
												: "hover:bg-gray-50 dark:hover:bg-gray-800"
										}`}
										onClick={() => setSelectedAssistant(assistant.workerId)}
									>
										<div>
											<span className="font-medium">{assistant.name}</span>
											<p className="text-xs text-muted-foreground">
												ID: {assistant.workerId}
											</p>
										</div>
										<div
											className={`w-4 h-4 rounded-full border-2 ${
												selectedAssistant === assistant.workerId
													? "border-primary bg-primary"
													: "border-gray-300"
											}`}
										/>
									</div>
								))}
								{availableAssistants.length === 0 && (
									<p className="text-sm text-muted-foreground text-center py-4">
										No assistants available
									</p>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Scheduling Section */}
					{selectedShipment && (
						<Card className="border-primary">
							<CardHeader>
								<CardTitle className="text-sm">Schedule Truck Trip</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Label htmlFor="date">Scheduled Date</Label>
									<Input
										id="date"
										type="date"
										value={scheduledDate}
										onChange={(e) => setScheduledDate(e.target.value)}
										className="mt-1"
									/>
								</div>
								<div>
									<Label htmlFor="time">Scheduled Time</Label>
									<Input
										id="time"
										type="time"
										value={scheduledTime}
										onChange={(e) => setScheduledTime(e.target.value)}
										className="mt-1"
									/>
								</div>
								<div>
									<Label htmlFor="duration">Estimated Duration (hours)</Label>
									<Input
										id="duration"
										type="number"
										step="0.5"
										value={estimatedDuration}
										onChange={(e) => setEstimatedDuration(e.target.value)}
										className="mt-1"
									/>
								</div>
								<Button 
									className="w-full" 
									onClick={handleScheduleTruckTrip}
									disabled={scheduling || !selectedTruck || !selectedDriver}
								>
									{scheduling ? (
										<>
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											Scheduling...
										</>
									) : (
										<>
											<Calendar className="h-4 w-4 mr-2" />
											Confirm Schedule
										</>
									)}
								</Button>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
