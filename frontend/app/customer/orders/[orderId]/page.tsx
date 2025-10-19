"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, MapPin, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrderDetailPage() {
	const params = useParams();
	const orderId = params.orderId as string;

	// Mock data - replace with real API call
	const orderDetail = {
		orderId: orderId,
		status: "In Transit",
		placedOn: "2024-01-15T10:30:00Z",
		deliveryAddress: "123 Main St, City, State 12345",
		totalValue: 245.50,
		items: [
			{
				productName: "Premium Coffee Beans",
				quantity: 2,
			},
			{
				productName: "Organic Tea Leaves", 
				quantity: 1,
			},
			{
				productName: "Artisan Honey",
				quantity: 3,
			},
		],
		statusHistory: [
			{
				status: "Order Placed",
				timestamp: "2024-01-15T10:30:00Z",
			},
			{
				status: "Processing",
				timestamp: "2024-01-15T14:20:00Z",
			},
			{
				status: "In Transit",
				timestamp: "2024-01-16T09:15:00Z",
			},
		],
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Delivered":
				return "bg-green-100 text-green-800";
			case "In Transit":
				return "bg-blue-100 text-blue-800";
			case "Processing":
				return "bg-yellow-100 text-yellow-800";
			case "Order Placed":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString();
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Link href="/customer/orders">
					<Button variant="outline" size="sm">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Orders
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-bold">Order {orderId}</h1>
					<p className="text-muted-foreground">Order details and tracking information</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Order Summary */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<span>Order Summary</span>
							<Badge className={getStatusColor(orderDetail.status)}>
								{orderDetail.status}
							</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center gap-2">
							<Calendar className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm text-muted-foreground">Placed on:</span>
							<span className="font-medium">{formatDate(orderDetail.placedOn)}</span>
						</div>
						
						<div className="flex items-start gap-2">
							<MapPin className="w-4 h-4 text-muted-foreground mt-1" />
							<div>
								<span className="text-sm text-muted-foreground">Delivery Address:</span>
								<p className="font-medium">{orderDetail.deliveryAddress}</p>
							</div>
						</div>

						<div className="pt-4 border-t">
							<div className="flex justify-between items-center text-lg font-bold">
								<span>Total Value:</span>
								<span>${orderDetail.totalValue.toFixed(2)}</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Order Items */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Package className="w-5 h-5" />
							Order Items
						</CardTitle>
						<CardDescription>Products in this order</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{orderDetail.items.map((item, index) => (
								<div key={index} className="flex justify-between items-center p-3 border rounded-lg">
									<div>
										<h4 className="font-medium">{item.productName}</h4>
									</div>
									<div className="text-right">
										<span className="font-medium">Qty: {item.quantity}</span>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Status History */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Clock className="w-5 h-5" />
						Order Tracking
					</CardTitle>
					<CardDescription>Status history and updates</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{orderDetail.statusHistory.map((entry, index) => (
							<div key={index} className="flex items-start gap-4">
								<div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
								<div className="flex-1">
									<div className="flex items-center justify-between">
										<h4 className="font-medium">{entry.status}</h4>
										<span className="text-sm text-muted-foreground">
											{formatDate(entry.timestamp)}
										</span>
									</div>
								</div>
							</div>
						))}
						
						{/* Future status placeholder */}
						{orderDetail.status !== "Delivered" && (
							<div className="flex items-start gap-4 opacity-50">
								<div className="w-3 h-3 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
								<div className="flex-1">
									<h4 className="font-medium text-gray-500">Delivered</h4>
									<p className="text-sm text-gray-400">Pending delivery</p>
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}