"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, Truck, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { customerAPI, type OrderSummary } from "@/lib/customer-api";

interface DashboardStats {
	totalOrders: number;
	pendingOrders: number;
	inTransit: number;
	delivered: number;
}

export default function CustomerDashboard() {
	const [stats, setStats] = useState<DashboardStats>({
		totalOrders: 0,
		pendingOrders: 0,
		inTransit: 0,
		delivered: 0,
	});
	const [recentOrders, setRecentOrders] = useState<OrderSummary[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				setLoading(true);
				console.log("Fetching dashboard data...");
				const ordersData = await customerAPI.getOrders();
				console.log("Dashboard orders received:", ordersData);
				
				// Calculate stats from orders
				const calculatedStats: DashboardStats = {
					totalOrders: ordersData.length,
					pendingOrders: ordersData.filter(order => order.status === "Pending").length,
					inTransit: ordersData.filter(order => 
						order.status.includes("Transit") || 
						order.status === "In_Train_Transit" || 
						order.status === "In_Truck_Transit"
					).length,
					delivered: ordersData.filter(order => order.status === "Delivered").length,
				};
				
				setStats(calculatedStats);
				// Show most recent 3 orders
				setRecentOrders(ordersData.slice(0, 3));
			} catch (err: any) {
				console.error("Error fetching dashboard data:", err);
				setError(err.response?.data?.error || err.message || "Failed to fetch dashboard data");
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Delivered":
				return "bg-green-100 text-green-800";
			case "In_Transit":
			case "In_Train_Transit": 
			case "In_Truck_Transit":
				return "bg-blue-100 text-blue-800";
			case "Pending":
				return "bg-yellow-100 text-yellow-800";
			case "At_Store":
				return "bg-purple-100 text-purple-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getOrderDisplayName = (orderId: string, index: number) => {
		return `Order #${String(index + 1).padStart(3, '0')}`;
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold">Dashboard</h1>
					<p className="text-muted-foreground">Loading your order overview...</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{[1, 2, 3, 4].map((i) => (
						<Card key={i}>
							<CardContent className="p-6">
								<div className="animate-pulse">
									<div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
									<div className="h-8 bg-gray-200 rounded w-1/2"></div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold">Dashboard</h1>
					<p className="text-muted-foreground text-red-600">Error: {error}</p>
				</div>
			</div>
		);
	}

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
					{recentOrders.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-muted-foreground">No orders found</p>
						</div>
					) : (
						<div className="space-y-4">
							{recentOrders.map((order, index) => (
								<div key={order.orderId} className="flex items-center justify-between p-4 border rounded-lg">
									<div className="space-y-1">
										<div className="flex items-center gap-2">
											<span className="font-medium">{getOrderDisplayName(order.orderId, index)}</span>
											<Badge className={getStatusColor(order.status)}>{order.status}</Badge>
										</div>
										<p className="text-sm text-muted-foreground">
											Placed on {new Date(order.placedOn).toLocaleDateString()}
										</p>
									</div>
									<div className="text-right">
										<p className="font-medium">${order.totalValue.toFixed(2)}</p>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}