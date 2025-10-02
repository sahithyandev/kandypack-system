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
	Truck,
	Users,
	Clock,
	MapPin,
	Package,
	AlertCircle,
	ChevronRight,
	Plus,
	Calendar,
	UserCheck,
	Route,
	CheckCircle,
	XCircle,
} from "lucide-react";

// Mock data for trucks
const trucks = [
	{
		id: "TRK-001",
		vehicleNo: "NC-5678",
		status: "available",
		lastMaintenance: "2024-01-10",
		nextMaintenance: "2024-02-10",
	},
	{
		id: "TRK-002",
		vehicleNo: "NC-9012",
		status: "in_transit",
		currentTrip: "Route A - Colombo North",
		driver: "R. Silva",
		assistant: "K. Mendis",
	},
	{
		id: "TRK-003",
		vehicleNo: "NC-3456",
		status: "available",
		lastMaintenance: "2024-01-05",
		nextMaintenance: "2024-02-05",
	},
	{
		id: "TRK-004",
		vehicleNo: "NC-7890",
		status: "maintenance",
		expectedReturn: "2024-01-23",
	},
	{
		id: "TRK-005",
		vehicleNo: "NC-2345",
		status: "in_transit",
		currentTrip: "Route B - Colombo South",
		driver: "A. Fernando",
		assistant: "D. Perera",
	},
];

// Mock data for drivers
const drivers = [
	{
		id: "DRV-001",
		name: "R. Silva",
		status: "busy",
		weeklyHours: 35,
		maxHours: 40,
		lastTrip: "2024-01-21 14:00",
		nextAvailable: "2024-01-22 08:00",
		consecutiveTrips: 0,
	},
	{
		id: "DRV-002",
		name: "K. Perera",
		status: "available",
		weeklyHours: 28,
		maxHours: 40,
		lastTrip: "2024-01-21 10:00",
		consecutiveTrips: 0,
	},
	{
		id: "DRV-003",
		name: "A. Fernando",
		status: "busy",
		weeklyHours: 38,
		maxHours: 40,
		lastTrip: "2024-01-21 15:00",
		nextAvailable: "2024-01-22 09:00",
		consecutiveTrips: 1,
	},
	{
		id: "DRV-004",
		name: "S. Jayawardena",
		status: "available",
		weeklyHours: 20,
		maxHours: 40,
		lastTrip: "2024-01-20 16:00",
		consecutiveTrips: 0,
	},
	{
		id: "DRV-005",
		name: "M. Rajapaksa",
		status: "on_leave",
		weeklyHours: 0,
		maxHours: 40,
		returnDate: "2024-01-25",
	},
];

// Mock data for assistants
const assistants = [
	{
		id: "AST-001",
		name: "K. Mendis",
		status: "busy",
		weeklyHours: 45,
		maxHours: 60,
		consecutiveRoutes: 1,
		maxConsecutive: 2,
		nextAvailable: "2024-01-22 08:00",
	},
	{
		id: "AST-002",
		name: "D. Perera",
		status: "busy",
		weeklyHours: 50,
		maxHours: 60,
		consecutiveRoutes: 2,
		maxConsecutive: 2,
		nextAvailable: "2024-01-22 10:00",
	},
	{
		id: "AST-003",
		name: "T. Gunasekara",
		status: "available",
		weeklyHours: 35,
		maxHours: 60,
		consecutiveRoutes: 0,
		maxConsecutive: 2,
	},
	{
		id: "AST-004",
		name: "N. Wijesinghe",
		status: "available",
		weeklyHours: 40,
		maxHours: 60,
		consecutiveRoutes: 0,
		maxConsecutive: 2,
	},
];

// Mock data for routes
const routes = [
	{
		id: "RT-001",
		name: "Route A - Colombo North",
		stops: ["Kelaniya", "Wattala", "Ja-Ela", "Negombo"],
		estimatedTime: 4,
		maxDeliveryTime: 6,
		ordersAssigned: 5,
		status: "pending",
	},
	{
		id: "RT-002",
		name: "Route B - Colombo South",
		stops: ["Dehiwala", "Mount Lavinia", "Moratuwa", "Panadura"],
		estimatedTime: 3.5,
		maxDeliveryTime: 5,
		ordersAssigned: 4,
		status: "pending",
	},
	{
		id: "RT-003",
		name: "Route C - Galle Main",
		stops: ["Hikkaduwa", "Galle Fort", "Unawatuna", "Koggala"],
		estimatedTime: 5,
		maxDeliveryTime: 7,
		ordersAssigned: 6,
		status: "pending",
	},
	{
		id: "RT-004",
		name: "Route D - Kandy City",
		stops: ["Peradeniya", "Kandy City", "Katugastota"],
		estimatedTime: 2.5,
		maxDeliveryTime: 4,
		ordersAssigned: 3,
		status: "scheduled",
		assignedTruck: "TRK-003",
		assignedDriver: "K. Perera",
		assignedAssistant: "T. Gunasekara",
		scheduledTime: "2024-01-22 14:00",
	},
];

export default function TruckSchedulingPage() {
	const [selectedRoute, setSelectedRoute] = useState<any>(null);
	const [selectedTruck, setSelectedTruck] = useState("");
	const [selectedDriver, setSelectedDriver] = useState("");
	const [selectedAssistant, setSelectedAssistant] = useState("");
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [scheduledRoutes, setScheduledRoutes] = useState<string[]>([]);

	const getStatusBadge = (status: string) => {
		const styles: { [key: string]: string } = {
			available: "bg-green-100 text-green-800",
			busy: "bg-yellow-100 text-yellow-800",
			in_transit: "bg-blue-100 text-blue-800",
			maintenance: "bg-red-100 text-red-800",
			on_leave: "bg-gray-100 text-gray-800",
			pending: "bg-orange-100 text-orange-800",
			scheduled: "bg-purple-100 text-purple-800",
		};
		return styles[status] || "bg-gray-100 text-gray-800";
	};

	const getWorkloadColor = (current: number, max: number) => {
		const percentage = (current / max) * 100;
		if (percentage >= 90) return "text-red-600";
		if (percentage >= 70) return "text-yellow-600";
		return "text-green-600";
	};

	const availableDrivers = drivers.filter(d => d.status === "available");
	const availableAssistants = assistants.filter(a => a.status === "available");
	const availableTrucks = trucks.filter(t => t.status === "available");

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
							Out of {trucks.length} total
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
							Out of {drivers.length} total
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
							Out of {assistants.length} total
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<Route className="h-4 w-4" />
							Pending Routes
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-orange-600">
							{routes.filter(r => r.status === "pending").length}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Need scheduling
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Success Message */}
			{showSuccessMessage && (
				<Card className="border-green-200 bg-green-50 dark:bg-green-950">
					<CardContent className="flex items-center gap-2 p-4">
						<CheckCircle className="h-5 w-5 text-green-600" />
						<span className="text-green-800 dark:text-green-200">
							Route scheduled successfully! Truck trip has been assigned.
						</span>
					</CardContent>
				</Card>
			)}

			{/* Main Content Grid */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Routes Section */}
				<Card>
					<CardHeader>
						<CardTitle>Delivery Routes</CardTitle>
						<CardDescription>Routes requiring truck assignment</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{routes.map((route) => (
								<div
									key={route.id}
									className={`border rounded-lg p-4 cursor-pointer transition-colors ${
										selectedRoute?.id === route.id
											? "border-primary bg-primary/5"
											: "hover:bg-gray-50 dark:hover:bg-gray-800"
									}`}
									onClick={() => setSelectedRoute(route)}
								>
									<div className="flex justify-between items-start mb-2">
										<div>
											<div className="flex items-center gap-2">
												<span className="font-semibold">{route.id}</span>
												<span
													className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
														route.status
													)}`}
												>
													{route.status}
												</span>
											</div>
											<p className="text-sm font-medium mt-1">{route.name}</p>
										</div>
										{route.status === "scheduled" ? (
											<CheckCircle className="h-5 w-5 text-green-600" />
										) : (
											<AlertCircle className="h-5 w-5 text-orange-600" />
										)}
									</div>

									<div className="space-y-2 text-sm">
										<div className="flex items-center gap-2 text-muted-foreground">
											<MapPin className="h-3 w-3" />
											<span className="text-xs">
												{route.stops.slice(0, 2).join(" → ")}
												{route.stops.length > 2 && ` +${route.stops.length - 2} more`}
											</span>
										</div>
										<div className="flex items-center gap-2 text-muted-foreground">
											<Clock className="h-3 w-3" />
											<span className="text-xs">
												Est. {route.estimatedTime}h (Max {route.maxDeliveryTime}h)
											</span>
										</div>
										<div className="flex items-center gap-2 text-muted-foreground">
											<Package className="h-3 w-3" />
											<span className="text-xs">{route.ordersAssigned} orders</span>
										</div>
									</div>

									{route.status === "scheduled" && (
										<div className="mt-3 pt-3 border-t text-xs space-y-1">
											<p>Truck: {route.assignedTruck}</p>
											<p>Driver: {route.assignedDriver}</p>
											<p>Assistant: {route.assignedAssistant}</p>
											<p>Departure: {route.scheduledTime}</p>
										</div>
									)}

									{route.status === "pending" && (
										<Button
											size="sm"
											className="w-full mt-3"
											onClick={(e) => {
												e.stopPropagation();
												setSelectedRoute(route);
											}}
										>
											<Plus className="h-3 w-3 mr-1" />
											Schedule Trip
										</Button>
									)}
								</div>
							))}
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
										key={truck.id}
										className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer transition-colors ${
											selectedTruck === truck.id
												? "border-primary bg-primary/5"
												: "hover:bg-gray-50 dark:hover:bg-gray-800"
										}`}
										onClick={() => setSelectedTruck(truck.id)}
									>
										<div>
											<span className="font-medium">{truck.id}</span>
											<p className="text-xs text-muted-foreground">
												Vehicle: {truck.vehicleNo}
											</p>
											<p className="text-xs text-muted-foreground">
												Next maintenance: {truck.nextMaintenance}
											</p>
										</div>
										<div
											className={`w-4 h-4 rounded-full border-2 ${
												selectedTruck === truck.id
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
										key={driver.id}
										className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer transition-colors ${
											selectedDriver === driver.id
												? "border-primary bg-primary/5"
												: "hover:bg-gray-50 dark:hover:bg-gray-800"
										}`}
										onClick={() => setSelectedDriver(driver.id)}
									>
										<div>
											<span className="font-medium">{driver.name}</span>
											<div className="flex items-center gap-3 mt-1">
												<p className="text-xs text-muted-foreground">
													ID: {driver.id}
												</p>
												<p
													className={`text-xs ${getWorkloadColor(
														driver.weeklyHours,
														driver.maxHours
													)}`}
												>
													{driver.weeklyHours}/{driver.maxHours}h this week
												</p>
											</div>
											{(driver.consecutiveTrips || 0) > 0 && (
												<p className="text-xs text-yellow-600 mt-1">
													⚠ {driver.consecutiveTrips} consecutive trip(s)
												</p>
											)}
										</div>
										<div
											className={`w-4 h-4 rounded-full border-2 ${
												selectedDriver === driver.id
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
							<CardTitle className="text-lg">Available Assistants</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{availableAssistants.map((assistant) => (
									<div
										key={assistant.id}
										className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer transition-colors ${
											selectedAssistant === assistant.id
												? "border-primary bg-primary/5"
												: "hover:bg-gray-50 dark:hover:bg-gray-800"
										}`}
										onClick={() => setSelectedAssistant(assistant.id)}
									>
										<div>
											<span className="font-medium">{assistant.name}</span>
											<div className="flex items-center gap-3 mt-1">
												<p className="text-xs text-muted-foreground">
													ID: {assistant.id}
												</p>
												<p
													className={`text-xs ${getWorkloadColor(
														assistant.weeklyHours,
														assistant.maxHours
													)}`}
												>
													{assistant.weeklyHours}/{assistant.maxHours}h this week
												</p>
											</div>
											{assistant.consecutiveRoutes > 0 && (
												<p className="text-xs text-muted-foreground mt-1">
													Consecutive routes: {assistant.consecutiveRoutes}/{assistant.maxConsecutive}
												</p>
											)}
										</div>
										<div
											className={`w-4 h-4 rounded-full border-2 ${
												selectedAssistant === assistant.id
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

					{/* Schedule Button */}
					{selectedRoute && selectedRoute.status === "pending" && (
						<Button
							className="w-full"
							disabled={!selectedTruck || !selectedDriver || !selectedAssistant}
							onClick={() => {
								// Mock scheduling logic
								const selectedTruckData = availableTrucks.find(t => t.id === selectedTruck);
								const selectedDriverData = availableDrivers.find(d => d.id === selectedDriver);
								const selectedAssistantData = availableAssistants.find(a => a.id === selectedAssistant);

								if (selectedTruckData && selectedDriverData && selectedAssistantData) {
									// Update route status to scheduled
									const updatedRoute = {
										...selectedRoute,
										status: "scheduled",
										assignedTruck: selectedTruck,
										assignedDriver: selectedDriverData.name,
										assignedAssistant: selectedAssistantData.name,
										scheduledTime: new Date().toLocaleString()
									};
									
									setScheduledRoutes(prev => [...prev, selectedRoute.id]);
									setShowSuccessMessage(true);
									
									// Clear selections
									setSelectedRoute(null);
									setSelectedTruck("");
									setSelectedDriver("");
									setSelectedAssistant("");

									// Hide success message after 3 seconds
									setTimeout(() => {
										setShowSuccessMessage(false);
									}, 3000);

									console.log("Route scheduled successfully:", updatedRoute);
								}
							}}
						>
							<Calendar className="h-4 w-4 mr-2" />
							Confirm Schedule
						</Button>
					)}
				</div>
			</div>

			{/* Warnings and Alerts */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<AlertCircle className="h-5 w-5" />
						Scheduling Constraints
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-3 md:grid-cols-2">
						<div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
							<Users className="h-5 w-5 text-yellow-600 mt-0.5" />
							<div>
								<p className="text-sm font-medium">Driver Hours Alert</p>
								<p className="text-xs text-muted-foreground">
									2 drivers approaching weekly limit (40 hours)
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
							<UserCheck className="h-5 w-5 text-orange-600 mt-0.5" />
							<div>
								<p className="text-sm font-medium">Assistant Consecutive Routes</p>
								<p className="text-xs text-muted-foreground">
									1 assistant at maximum consecutive routes (2)
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
