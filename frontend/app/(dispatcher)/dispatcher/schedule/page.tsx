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
import {
	Train,
	Truck,
	Clock,
	MapPin,
	Package,
	Calendar,
	ChevronLeft,
	ChevronRight,
	Filter,
	Download,
	Eye,
	AlertCircle,
	CheckCircle,
	Users,
} from "lucide-react";

// Mock schedule data
const scheduleData = {
	"2024-01-22": {
		trains: [
			{
				id: "TRN-KDY-CMB-001",
				time: "06:00",
				route: "Kandy → Colombo",
				capacity: "850/1000 units",
				status: "on_time",
				orders: 12,
			},
			{
				id: "TRN-KDY-GLE-002",
				time: "08:30",
				route: "Kandy → Galle",
				capacity: "480/800 units",
				status: "on_time",
				orders: 8,
			},
			{
				id: "TRN-KDY-MTR-003",
				time: "10:00",
				route: "Kandy → Matara",
				capacity: "540/900 units",
				status: "delayed",
				delay: "30 mins",
				orders: 9,
			},
			{
				id: "TRN-KDY-JAF-004",
				time: "14:00",
				route: "Kandy → Jaffna",
				capacity: "960/1200 units",
				status: "scheduled",
				orders: 15,
			},
		],
		trucks: [
			{
				id: "TRK-001",
				time: "09:00",
				route: "Route A - Colombo North",
				driver: "R. Silva",
				assistant: "K. Mendis",
				status: "in_transit",
				orders: 5,
				progress: 60,
			},
			{
				id: "TRK-002",
				time: "10:30",
				route: "Route B - Colombo South",
				driver: "K. Perera",
				assistant: "T. Gunasekara",
				status: "completed",
				orders: 4,
				completedAt: "14:45",
			},
			{
				id: "TRK-003",
				time: "14:00",
				route: "Route C - Galle Main",
				driver: "S. Jayawardena",
				assistant: "N. Wijesinghe",
				status: "scheduled",
				orders: 6,
			},
			{
				id: "TRK-005",
				time: "16:00",
				route: "Route D - Kandy City",
				driver: "A. Fernando",
				assistant: "D. Perera",
				status: "scheduled",
				orders: 3,
			},
		],
	},
	"2024-01-23": {
		trains: [
			{
				id: "TRN-KDY-CMB-005",
				time: "07:00",
				route: "Kandy → Colombo",
				capacity: "720/1000 units",
				status: "scheduled",
				orders: 10,
			},
			{
				id: "TRN-KDY-TRI-006",
				time: "09:00",
				route: "Kandy → Trincomalee",
				capacity: "450/700 units",
				status: "scheduled",
				orders: 7,
			},
		],
		trucks: [
			{
				id: "TRK-001",
				time: "08:30",
				route: "Route E - Negombo",
				driver: "R. Silva",
				assistant: "K. Mendis",
				status: "scheduled",
				orders: 4,
			},
		],
	},
};

const timeSlots = [
	"06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
	"12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
	"18:00", "19:00", "20:00", "21:00", "22:00",
];

export default function ScheduleOverviewPage() {
	const [selectedDate, setSelectedDate] = useState("2024-01-22");
	const [viewMode, setViewMode] = useState<"timeline" | "list">("timeline");
	const [filterType, setFilterType] = useState<"all" | "trains" | "trucks">("all");

	const currentSchedule = scheduleData[selectedDate] || { trains: [], trucks: [] };

	const getStatusBadge = (status: string) => {
		const styles: { [key: string]: string } = {
			scheduled: "bg-blue-100 text-blue-800",
			in_transit: "bg-purple-100 text-purple-800",
			completed: "bg-green-100 text-green-800",
			delayed: "bg-red-100 text-red-800",
			on_time: "bg-green-100 text-green-800",
		};
		return styles[status] || "bg-gray-100 text-gray-800";
	};

	const getStatusIcon = (status: string) => {
		if (status === "completed") return <CheckCircle className="h-4 w-4 text-green-600" />;
		if (status === "delayed") return <AlertCircle className="h-4 w-4 text-red-600" />;
		if (status === "in_transit") return <Clock className="h-4 w-4 text-purple-600" />;
		return <Clock className="h-4 w-4 text-blue-600" />;
	};

	// Calculate statistics
	const totalTrains = currentSchedule.trains.length;
	const totalTrucks = currentSchedule.trucks.length;
	const completedDeliveries = currentSchedule.trucks.filter(t => t.status === "completed").length;
	const delayedItems = [...currentSchedule.trains, ...currentSchedule.trucks].filter(
		item => item.status === "delayed"
	).length;

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

			{/* Date Navigation */}
			<Card>
				<CardHeader>
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<div className="flex items-center gap-4">
							<Button
								variant="outline"
								size="icon"
								onClick={() => {
									// Handle previous day
									if (selectedDate === "2024-01-22") {
										setSelectedDate("2024-01-23");
									} else {
										setSelectedDate("2024-01-22");
									}
								}}
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<div className="flex items-center gap-2">
								<Calendar className="h-5 w-5 text-primary" />
								<span className="text-lg font-semibold">
									{new Date(selectedDate).toLocaleDateString('en-US', {
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
								</span>
							</div>
							<Button
								variant="outline"
								size="icon"
								onClick={() => {
									// Handle next day
									if (selectedDate === "2024-01-22") {
										setSelectedDate("2024-01-23");
									} else {
										setSelectedDate("2024-01-22");
									}
								}}
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
						<div className="flex gap-2">
							<select
								className="px-3 py-1.5 border rounded-md text-sm"
								value={viewMode}
								onChange={(e) => setViewMode(e.target.value as "timeline" | "list")}
							>
								<option value="timeline">Timeline View</option>
								<option value="list">List View</option>
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
						<div className="text-2xl font-bold">{totalTrains + totalTrucks}</div>
						<p className="text-xs text-muted-foreground mt-1">
							{totalTrains} trains, {totalTrucks} trucks
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">Completed</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">{completedDeliveries}</div>
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
							{currentSchedule.trucks.filter(t => t.status === "in_transit").length}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Currently on route
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">Delays</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">{delayedItems}</div>
						<p className="text-xs text-muted-foreground mt-1">
							Behind schedule
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Schedule View */}
			{viewMode === "timeline" ? (
				<Card>
					<CardHeader>
						<CardTitle>Timeline View</CardTitle>
						<CardDescription>Visual timeline of all scheduled activities</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<div className="min-w-[800px]">
								{/* Timeline Header */}
								<div className="grid grid-cols-[120px_1fr] gap-4 mb-4">
									<div className="text-sm font-medium text-muted-foreground">Time</div>
									<div className="grid grid-cols-12 gap-1 text-xs text-muted-foreground">
										{["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"].map(time => (
											<div key={time} className="text-center">{time}</div>
										))}
									</div>
								</div>

								{/* Train Schedule */}
								{(filterType === "all" || filterType === "trains") && (
									<div className="mb-6">
										<div className="grid grid-cols-[120px_1fr] gap-4">
											<div className="flex items-center gap-2 text-sm font-medium">
												<Train className="h-4 w-4 text-blue-600" />
												Trains
											</div>
											<div className="relative h-24">
												{currentSchedule.trains.map((train, idx) => {
													const hour = parseInt(train.time.split(":")[0]);
													const minute = parseInt(train.time.split(":")[1]);
													const position = ((hour - 6) * 60 + minute) / (16 * 60) * 100;
													
													return (
														<div
															key={train.id}
															className="absolute top-0 h-20 w-32 rounded-lg border bg-blue-50 dark:bg-blue-950 p-2 text-xs cursor-pointer hover:shadow-lg transition-shadow"
															style={{
																left: `${position}%`,
																top: `${(idx % 2) * 40}px`
															}}
														>
															<div className="font-semibold">{train.id}</div>
															<div className="text-muted-foreground">{train.time}</div>
															<div className="flex items-center gap-1 mt-1">
																{getStatusIcon(train.status)}
																<span className={`px-1 py-0.5 rounded text-xs ${getStatusBadge(train.status)}`}>
																	{train.status}
																</span>
															</div>
														</div>
													);
												})}
											</div>
										</div>
									</div>
								)}

								{/* Truck Schedule */}
								{(filterType === "all" || filterType === "trucks") && (
									<div>
										<div className="grid grid-cols-[120px_1fr] gap-4">
											<div className="flex items-center gap-2 text-sm font-medium">
												<Truck className="h-4 w-4 text-green-600" />
												Trucks
											</div>
											<div className="relative h-32">
												{currentSchedule.trucks.map((truck, idx) => {
													const hour = parseInt(truck.time.split(":")[0]);
													const minute = parseInt(truck.time.split(":")[1]);
													const position = ((hour - 6) * 60 + minute) / (16 * 60) * 100;
													
													return (
														<div
															key={truck.id}
															className="absolute top-0 h-20 w-36 rounded-lg border bg-green-50 dark:bg-green-950 p-2 text-xs cursor-pointer hover:shadow-lg transition-shadow"
															style={{
																left: `${position}%`,
																top: `${(idx % 2) * 40}px`
															}}
														>
															<div className="font-semibold">{truck.id}</div>
															<div className="text-muted-foreground">{truck.time} - {truck.route}</div>
															<div className="flex items-center gap-1 mt-1">
																{getStatusIcon(truck.status)}
																<span className={`px-1 py-0.5 rounded text-xs ${getStatusBadge(truck.status)}`}>
																	{truck.status}
																</span>
															</div>
															{truck.progress !== undefined && (
																<div className="w-full bg-gray-200 rounded-full h-1 mt-1">
																	<div
																		className="bg-green-600 h-1 rounded-full"
																		style={{ width: `${truck.progress}%` }}
																	/>
																</div>
															)}
														</div>
													);
												})}
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-6 lg:grid-cols-2">
					{/* Trains List */}
					{(filterType === "all" || filterType === "trains") && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Train className="h-5 w-5" />
									Train Schedule
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{currentSchedule.trains.map((train) => (
										<div key={train.id} className="border rounded-lg p-4">
											<div className="flex justify-between items-start mb-2">
												<div>
													<span className="font-semibold">{train.id}</span>
													<p className="text-sm text-muted-foreground mt-1">
														{train.route}
													</p>
												</div>
												<span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(train.status)}`}>
													{train.status}
													{train.delay && ` (${train.delay})`}
												</span>
											</div>
											<div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
												<div className="flex items-center gap-1">
													<Clock className="h-3 w-3" />
													{train.time}
												</div>
												<div className="flex items-center gap-1">
													<Package className="h-3 w-3" />
													{train.orders} orders
												</div>
												<div className="text-right">{train.capacity}</div>
											</div>
										</div>
									))}
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
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{currentSchedule.trucks.map((truck) => (
										<div key={truck.id} className="border rounded-lg p-4">
											<div className="flex justify-between items-start mb-2">
												<div>
													<span className="font-semibold">{truck.id}</span>
													<p className="text-sm text-muted-foreground mt-1">
														{truck.route}
													</p>
												</div>
												<span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(truck.status)}`}>
													{truck.status}
												</span>
											</div>
											<div className="space-y-1 text-sm text-muted-foreground">
												<div className="flex items-center gap-1">
													<Clock className="h-3 w-3" />
													Departure: {truck.time}
													{truck.completedAt && ` • Completed: ${truck.completedAt}`}
												</div>
												<div className="flex items-center gap-1">
													<Users className="h-3 w-3" />
													{truck.driver} (Driver) • {truck.assistant} (Assistant)
												</div>
												<div className="flex items-center gap-1">
													<Package className="h-3 w-3" />
													{truck.orders} orders
												</div>
											</div>
											{truck.progress !== undefined && (
												<div className="mt-2">
													<div className="flex justify-between text-xs mb-1">
														<span>Progress</span>
														<span>{truck.progress}%</span>
													</div>
													<div className="w-full bg-gray-200 rounded-full h-1.5">
														<div
															className="bg-green-600 h-1.5 rounded-full"
															style={{ width: `${truck.progress}%` }}
														/>
													</div>
												</div>
											)}
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			)}
		</div>
	);
}
