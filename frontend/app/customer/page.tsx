"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Clock, Truck, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { customerAPI, type OrderSummary } from "@/lib/customer-api";

export default function CustomerDashboard() {
	const [orders, setOrders] = useState<OrderSummary[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await customerAPI.getOrders();
			setOrders(data);
		} catch (err) {
			setError("Failed to load orders. Please try again.");
			console.error("Error fetching orders:", err);
		} finally {
			setLoading(false);
		}
	};

	// Calculate statistics from orders
	const stats = {
		totalOrders: orders.length,
		pendingOrders: orders.filter(o => o.status === "Pending").length,
		inTransit: orders.filter(o => 
			o.status === "In_Train_Transit" || 
			o.status === "In_Truck_Transit" || 
			o.status === "At_Store"
		).length,
		delivered: orders.filter(o => o.status === "Delivered").length,
	};

	// Get recent orders (last 5)
	const recentOrders = orders
		.sort((a, b) => new Date(b.placedOn).getTime() - new Date(a.placedOn).getTime())
		.slice(0, 5);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Delivered":
				return "bg-green-100 text-green-800";
			case "In_Train_Transit":
			case "In_Truck_Transit":
				return "bg-blue-100 text-blue-800";
			case "At_Store":
				return "bg-purple-100 text-purple-800";
			case "Pending":
				return "bg-yellow-100 text-yellow-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const formatStatus = (status: string) => {
		return status.replace(/_/g, " ");
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-64 space-y-4">
				<AlertCircle className="h-12 w-12 text-destructive" />
				<p className="text-lg font-medium">{error}</p>
				<Button onClick={fetchOrders}>Try Again</Button>
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
					<div className="space-y-4">
						{recentOrders.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								<Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p>No orders yet. Start by placing your first order!</p>
							</div>
						) : (
							recentOrders.map((order) => (
								<div key={order.orderId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
									onClick={() => window.location.href = `/customer/orders/${order.orderId}`}>
									<div className="space-y-1">
										<div className="flex items-center gap-2">
											<span className="font-medium">{order.orderId}</span>
											<Badge className={getStatusColor(order.status)}>{formatStatus(order.status)}</Badge>
										</div>
										<p className="text-sm text-muted-foreground">
											Placed on {formatDate(order.placedOn)}
										</p>
									</div>
									<div className="text-right">
										<p className="font-medium">LKR {order.totalValue.toFixed(2)}</p>
									</div>
								</div>
							))
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}