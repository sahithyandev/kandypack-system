"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
	Package,
	Search,
	Filter,
	Calendar,
	MapPin,
	Clock,
	ChevronRight,
	AlertTriangle,
	Eye,
	Truck,
	Train,
	Loader2,
} from "lucide-react";
import { getPendingOrders, type PendingOrder } from "@/lib/dispatcher-api";

export default function PendingOrdersPage() {
	const router = useRouter();
	const [orders, setOrders] = useState<PendingOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedOrder, setSelectedOrder] = useState<PendingOrder | null>(null);

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await getPendingOrders();
			setOrders(data);
		} catch (err: any) {
			console.error("Error fetching pending orders:", err);
			setError(err?.message || "Failed to fetch pending orders");
		} finally {
			setLoading(false);
		}
	};

	const getDaysRemaining = (requiredDeliveryDate: string) => {
		const today = new Date();
		const deliveryDate = new Date(requiredDeliveryDate);
		const diffTime = deliveryDate.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	const getPriority = (daysRemaining: number) => {
		if (daysRemaining <= 0) return "urgent";
		if (daysRemaining <= 2) return "high";
		if (daysRemaining <= 4) return "medium";
		return "low";
	};

	const getPriorityBadge = (priority: string) => {
		const styles: Record<string, string> = {
			urgent: "bg-red-100 text-red-800 border-red-200",
			high: "bg-orange-100 text-orange-800 border-orange-200",
			medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
			low: "bg-gray-100 text-gray-800 border-gray-200",
		};
		return styles[priority] || "bg-gray-100 text-gray-800";
	};

	const filteredOrders = orders.filter((order) => {
		const matchesSearch =
			order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.destinationCity.toLowerCase().includes(searchTerm.toLowerCase());

		return matchesSearch;
	});

	if (loading) {
		return (
			<div className="flex items-center justify-center h-96">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="space-y-6">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">Pending Orders</h2>
					<p className="text-muted-foreground">
						Manage and schedule orders awaiting processing
					</p>
				</div>
				<Card>
					<CardContent className="py-12">
						<div className="text-center">
							<AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
							<p className="text-lg font-medium mb-2">Error Loading Orders</p>
							<p className="text-muted-foreground mb-4">{error}</p>
							<Button onClick={fetchOrders}>Try Again</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const urgentOrders = orders.filter(o => {
		const days = getDaysRemaining(o.requiredDeliveryDate);
		return days <= 0;
	});

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div>
				<h2 className="text-3xl font-bold tracking-tight">Pending Orders</h2>
				<p className="text-muted-foreground">
					Manage and schedule orders awaiting processing
				</p>
			</div>

			{/* Quick Stats */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">Total Pending</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{orders.length}</div>
						<p className="text-xs text-muted-foreground mt-1">
							Orders awaiting scheduling
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">Urgent Orders</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">
							{urgentOrders.length}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Need immediate attention
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">Total Space</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{orders.reduce((acc, o) => acc + o.totalSpaceUnits, 0).toFixed(0)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Space units required
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-medium">Total Value</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							LKR {(orders.reduce((acc, o) => acc + o.totalValue, 0) / 1000).toFixed(0)}k
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Combined order value
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters and Search */}
			<Card>
				<CardHeader>
					<div className="flex flex-col md:flex-row justify-between gap-4">
						<div>
							<CardTitle>Order List</CardTitle>
							<CardDescription>
								Click on an order to view details and schedule
							</CardDescription>
						</div>
						<div className="flex gap-2">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder="Search orders..."
									className="pl-10 w-full md:w-[250px]"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{filteredOrders.map((order) => {
							const daysRemaining = getDaysRemaining(order.requiredDeliveryDate);
							const priority = getPriority(daysRemaining);
							
							return (
								<div
									key={order.orderId}
									className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
									onClick={() => setSelectedOrder(order)}
								>
									<div className="flex flex-col lg:flex-row justify-between gap-4">
										<div className="flex-1 space-y-3">
											{/* Order Header */}
											<div className="flex items-start justify-between">
												<div>
													<div className="flex items-center gap-2 flex-wrap">
														<span className="font-semibold">{order.orderId}</span>
														<span
															className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityBadge(
																priority
															)}`}
														>
															{priority.toUpperCase()}
														</span>
														{daysRemaining <= 1 && (
															<span className="flex items-center gap-1 text-xs text-red-600">
																<AlertTriangle className="h-3 w-3" />
																Due soon
															</span>
														)}
													</div>
													<p className="text-sm text-muted-foreground mt-1">
														{order.customerName}
													</p>
												</div>
												<Button size="sm" variant="outline" className="hidden lg:flex">
													<Eye className="h-3 w-3 mr-1" />
													View
												</Button>
											</div>

											{/* Order Details */}
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
												<div className="flex items-center gap-2">
													<MapPin className="h-4 w-4 text-muted-foreground" />
													<span>{order.destinationCity}</span>
												</div>
												<div className="flex items-center gap-2">
													<Calendar className="h-4 w-4 text-muted-foreground" />
													<span>Delivery: {order.requiredDeliveryDate}</span>
												</div>
												<div className="flex items-center gap-2">
													<Package className="h-4 w-4 text-muted-foreground" />
													<span>{order.totalSpaceUnits.toFixed(1)} units</span>
												</div>
												<div className="flex items-center gap-2">
													<Clock className="h-4 w-4 text-muted-foreground" />
													<span>{daysRemaining} days remaining</span>
												</div>
											</div>

											{/* Bottom Info */}
											<div className="flex justify-between items-center pt-2 border-t">
												<div className="flex gap-4 text-sm">
													<span className="font-medium">
														Placed: {new Date(order.placedOn).toLocaleDateString()}
													</span>
													<span className="font-medium">
														Value: LKR {(order.totalValue / 1000).toFixed(0)}k
													</span>
												</div>
												<div className="flex gap-2">
													<Button 
														size="sm" 
														variant="outline"
														onClick={(e) => {
															e.stopPropagation();
															router.push('/dispatcher/train-scheduling');
														}}
													>
														<Train className="h-3 w-3 mr-1" />
														Assign to Train
													</Button>
												</div>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>

					{filteredOrders.length === 0 && !loading && (
						<div className="text-center py-12">
							<Package className="h-12 w-12 mx-auto text-muted-foreground" />
							<p className="mt-2 text-muted-foreground">No pending orders found</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
