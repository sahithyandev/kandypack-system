"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, MapPin, Calendar, Clock, Loader2, AlertCircle } from "lucide-react";
import { customerAPI, type OrderDetail } from "@/lib/customer-api";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrderDetailPage() {
	const params = useParams();
	const orderId = params.orderId as string;

	const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (orderId) {
			fetchOrderDetail();
		}
	}, [orderId]);

	const fetchOrderDetail = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await customerAPI.getOrderDetail(orderId);
			setOrderDetail(data);
		} catch (err) {
			setError("Failed to load order details. Please try again.");
			console.error("Error fetching order detail:", err);
		} finally {
			setLoading(false);
		}
	};

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
		return new Date(dateString).toLocaleString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (error || !orderDetail) {
		return (
			<div className="flex flex-col items-center justify-center h-64 space-y-4">
				<AlertCircle className="h-12 w-12 text-destructive" />
				<p className="text-lg font-medium">{error || "Order not found"}</p>
				<div className="flex gap-2">
					<Link href="/customer/orders">
						<Button variant="outline">Back to Orders</Button>
					</Link>
					<Button onClick={fetchOrderDetail}>Try Again</Button>
				</div>
			</div>
		);
	}

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
					<h1 className="text-3xl font-bold">Order {orderDetail.orderId}</h1>
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
								{formatStatus(orderDetail.status)}
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
								<span>LKR {orderDetail.totalValue.toFixed(2)}</span>
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
						{orderDetail.statusHistory.map((entry, index) => {
							const isCurrentStatus = entry.status === orderDetail.status;
							return (
								<div key={index} className="flex items-start gap-4">
									<div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
										isCurrentStatus ? 'bg-blue-500 ring-4 ring-blue-200' : 'bg-green-500'
									}`}></div>
									<div className="flex-1">
										<div className="flex items-center justify-between">
											<h4 className="font-medium">{formatStatus(entry.status)}</h4>
											<span className="text-sm text-muted-foreground">
												{formatDate(entry.timestamp)}
											</span>
										</div>
									</div>
								</div>
							);
						})}
						
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