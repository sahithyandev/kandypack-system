"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Loader2, AlertCircle, Package } from "lucide-react";
import { customerAPI, type OrderSummary } from "@/lib/customer-api";
import Link from "next/link";

export default function OrdersPage() {
	const [orders, setOrders] = useState<OrderSummary[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [statusFilter, setStatusFilter] = useState<string>("All");

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

	const filteredOrders = statusFilter === "All" 
		? orders 
		: orders.filter(order => order.status === statusFilter);

	const statusOptions = ["All", "Pending", "In_Train_Transit", "In_Truck_Transit", "At_Store", "Delivered"];

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
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Orders</h1>
					<p className="text-muted-foreground">View and manage your orders</p>
				</div>
				<Link href="/customer/orders/new">
					<Button>
						<Plus className="w-4 h-4 mr-2" />
						New Order
					</Button>
				</Link>
			</div>

			<Card>
				<CardHeader>
					<div className="flex justify-between items-center">
						<div>
							<CardTitle>All Orders</CardTitle>
							<CardDescription>Complete history of your orders ({filteredOrders.length})</CardDescription>
						</div>
						<div className="flex gap-2">
							{statusOptions.map((status) => (
								<Button
									key={status}
									variant={statusFilter === status ? "default" : "outline"}
									size="sm"
									onClick={() => setStatusFilter(status)}
								>
									{status === "All" ? "All" : formatStatus(status)}
								</Button>
							))}
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{filteredOrders.length === 0 ? (
							<div className="text-center py-12 text-muted-foreground">
								<Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
								<p className="text-lg font-medium">No orders found</p>
								<p className="text-sm">
									{statusFilter === "All" 
										? "Start by placing your first order!"
										: `No orders with status "${formatStatus(statusFilter)}"`
									}
								</p>
							</div>
						) : (
							filteredOrders.map((order) => (
								<div key={order.orderId} className="border rounded-lg p-4 space-y-3 hover:bg-accent/50 transition-colors">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<span className="font-semibold text-lg">{order.orderId}</span>
											<Badge className={getStatusColor(order.status)}>{formatStatus(order.status)}</Badge>
										</div>
										<div className="flex items-center gap-2">
											<span className="font-bold text-lg">LKR {order.totalValue.toFixed(2)}</span>
											<Link href={`/customer/orders/${order.orderId}`}>
												<Button variant="outline" size="sm">
													<Eye className="w-4 h-4 mr-1" />
													View
												</Button>
											</Link>
										</div>
									</div>
									
									<div className="text-sm">
										<span className="text-muted-foreground">Placed on:</span>
										<p className="font-medium">{formatDate(order.placedOn)}</p>
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