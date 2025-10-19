"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, Truck, CheckCircle } from "lucide-react";

export default function CustomerDashboard() {
	// Mock data - replace with real API calls
	const stats = {
		totalOrders: 24,
		pendingOrders: 3,
		inTransit: 2,
		delivered: 19,
	};

	const recentOrders = [
		{
			id: "ORD-001",
			date: "2024-01-15",
			status: "In Transit",
			total: 245.50,
			items: 3,
		},
		{
			id: "ORD-002", 
			date: "2024-01-12",
			status: "Delivered",
			total: 189.25,
			items: 2,
		},
		{
			id: "ORD-003",
			date: "2024-01-10",
			status: "Processing",
			total: 312.75,
			items: 5,
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Delivered":
				return "bg-green-100 text-green-800";
			case "In Transit":
				return "bg-blue-100 text-blue-800";
			case "Processing":
				return "bg-yellow-100 text-yellow-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Dashboard</h1>
				<p className="text-muted-foreground">Welcome back! Here's your order overview.</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Orders</CardTitle>
						<Package className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalOrders}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Pending</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.pendingOrders}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">In Transit</CardTitle>
						<Truck className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.inTransit}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Delivered</CardTitle>
						<CheckCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.delivered}</div>
					</CardContent>
				</Card>
			</div>

			{/* Recent Orders */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Orders</CardTitle>
					<CardDescription>Your latest order activity</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{recentOrders.map((order) => (
							<div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<span className="font-medium">{order.id}</span>
										<Badge className={getStatusColor(order.status)}>{order.status}</Badge>
									</div>
									<p className="text-sm text-muted-foreground">
										{order.items} items • Placed on {order.date}
									</p>
								</div>
								<div className="text-right">
									<p className="font-medium">${order.total.toFixed(2)}</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}