"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { customerAPI, type OrderSummary } from "@/lib/customer-api";

export default function OrdersPage() {
	const [orders, setOrders] = useState<OrderSummary[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				setLoading(true);
				console.log("Fetching orders...");
				const ordersData = await customerAPI.getOrders();
				console.log("Orders received:", ordersData);
				setOrders(ordersData);
			} catch (err: any) {
				console.error("Error fetching orders:", err);
				setError(err.response?.data?.error || err.message || "Failed to fetch orders");
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, []);

	const getOrderDisplayName = (orderId: string, index: number) => {
		// Always show as "Order #N" for a clean, user-friendly display
		return `Order #${String(index + 1).padStart(3, '0')}`;
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Delivered":
				return "bg-green-100 text-green-800";
			case "In Transit":
				return "bg-blue-100 text-blue-800";
			case "Processing":
				return "bg-yellow-100 text-yellow-800";
			case "Cancelled":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	if (loading) {
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
					<CardContent className="p-6">
						<div className="text-center">Loading orders...</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (error) {
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
					<CardContent className="p-6">
						<div className="text-center text-red-600">Error: {error}</div>
					</CardContent>
				</Card>
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
					<CardTitle>All Orders</CardTitle>
					<CardDescription>Complete history of your orders</CardDescription>
				</CardHeader>
				<CardContent>
					{orders.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-muted-foreground">No orders found</p>
						</div>
					) : (
						<div className="space-y-4">
							{orders.map((order, index) => (
								<div key={order.orderId} className="border rounded-lg p-4 space-y-3">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div>
												<span className="font-semibold text-lg">{getOrderDisplayName(order.orderId, index)}</span>
												<p className="text-xs text-muted-foreground">{order.orderId}</p>
											</div>
											<Badge className={getStatusColor(order.status)}>{order.status}</Badge>
										</div>
										<div className="flex items-center gap-2">
											<span className="font-bold text-lg">${order.totalValue.toFixed(2)}</span>
											<Link href={`/customer/orders/${order.orderId}`}>
												<Button variant="outline" size="sm">
													<Eye className="w-4 h-4 mr-1" />
													View
												</Button>
											</Link>
										</div>
									</div>
									
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
										<div>
											<span className="text-muted-foreground">Placed on:</span>
											<p className="font-medium">{new Date(order.placedOn).toLocaleDateString()}</p>
										</div>
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