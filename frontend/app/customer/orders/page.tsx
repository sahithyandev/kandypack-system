"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Plus } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
	// Mock data - replace with real API calls
	const orders = [
		{
			id: "ORD-001",
			date: "2024-01-15",
			status: "In Transit",
			total: 245.50,
			items: 3,
			deliveryAddress: "123 Main St, City, State 12345",
			requiredDate: "2024-01-20",
		},
		{
			id: "ORD-002", 
			date: "2024-01-12",
			status: "Delivered",
			total: 189.25,
			items: 2,
			deliveryAddress: "456 Oak Ave, City, State 12345",
			requiredDate: "2024-01-18",
		},
		{
			id: "ORD-003",
			date: "2024-01-10",
			status: "Processing",
			total: 312.75,
			items: 5,
			deliveryAddress: "789 Pine St, City, State 12345",
			requiredDate: "2024-01-25",
		},
		{
			id: "ORD-004",
			date: "2024-01-08",
			status: "Delivered",
			total: 156.00,
			items: 2,
			deliveryAddress: "321 Elm St, City, State 12345",
			requiredDate: "2024-01-15",
		},
		{
			id: "ORD-005",
			date: "2024-01-05",
			status: "Cancelled",
			total: 78.25,
			items: 1,
			deliveryAddress: "654 Maple Dr, City, State 12345",
			requiredDate: "2024-01-12",
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
			case "Cancelled":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

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
					<div className="space-y-4">
						{orders.map((order) => (
							<div key={order.id} className="border rounded-lg p-4 space-y-3">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<span className="font-semibold text-lg">{order.id}</span>
										<Badge className={getStatusColor(order.status)}>{order.status}</Badge>
									</div>
									<div className="flex items-center gap-2">
										<span className="font-bold text-lg">${order.total.toFixed(2)}</span>
										<Link href={`/customer/orders/${order.id}`}>
											<Button variant="outline" size="sm">
												<Eye className="w-4 h-4 mr-1" />
												View
											</Button>
										</Link>
									</div>
								</div>
								
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
									<div>
										<span className="text-muted-foreground">Placed on:</span>
										<p className="font-medium">{order.date}</p>
									</div>
									<div>
										<span className="text-muted-foreground">Required by:</span>
										<p className="font-medium">{order.requiredDate}</p>
									</div>
									<div>
										<span className="text-muted-foreground">Items:</span>
										<p className="font-medium">{order.items} items</p>
									</div>
								</div>
								
								<div className="text-sm">
									<span className="text-muted-foreground">Delivery Address:</span>
									<p className="font-medium">{order.deliveryAddress}</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}