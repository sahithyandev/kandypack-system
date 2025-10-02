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
} from "lucide-react";

// Mock data for pending orders
const mockOrders = [
	{
		id: "ORD-2024-001",
		customer: "Colombo Wholesale Store",
		customerType: "Wholesale",
		orderDate: "2024-01-15",
		requiredDelivery: "2024-01-22",
		route: "Colombo",
		address: "123 Main Street, Colombo 03",
		products: [
			{ name: "Detergent 5kg", quantity: 50, spaceUnits: 25 },
			{ name: "Soap Bars", quantity: 200, spaceUnits: 10 },
		],
		totalValue: 125000,
		totalSpaceUnits: 35,
		status: "pending",
		priority: "high",
		daysRemaining: 2,
	},
	{
		id: "ORD-2024-002",
		customer: "Galle Retail Shop",
		customerType: "Retail",
		orderDate: "2024-01-14",
		requiredDelivery: "2024-01-23",
		route: "Galle",
		address: "456 Beach Road, Galle",
		products: [
			{ name: "Shampoo Bottles", quantity: 100, spaceUnits: 15 },
			{ name: "Toothpaste", quantity: 150, spaceUnits: 8 },
		],
		totalValue: 75000,
		totalSpaceUnits: 23,
		status: "pending",
		priority: "medium",
		daysRemaining: 3,
	},
	{
		id: "ORD-2024-003",
		customer: "Negombo Market",
		customerType: "Wholesale",
		orderDate: "2024-01-13",
		requiredDelivery: "2024-01-21",
		route: "Negombo",
		address: "789 Market Street, Negombo",
		products: [
			{ name: "Rice 25kg Bags", quantity: 100, spaceUnits: 50 },
			{ name: "Sugar 10kg", quantity: 80, spaceUnits: 20 },
			{ name: "Flour 10kg", quantity: 60, spaceUnits: 15 },
		],
		totalValue: 350000,
		totalSpaceUnits: 85,
		status: "pending",
		priority: "high",
		daysRemaining: 1,
	},
	{
		id: "ORD-2024-004",
		customer: "Matara Supermarket",
		customerType: "Retail",
		orderDate: "2024-01-12",
		requiredDelivery: "2024-01-24",
		route: "Matara",
		address: "321 Town Road, Matara",
		products: [
			{ name: "Beverages (Mixed)", quantity: 200, spaceUnits: 40 },
		],
		totalValue: 95000,
		totalSpaceUnits: 40,
		status: "pending",
		priority: "low",
		daysRemaining: 4,
	},
	{
		id: "ORD-2024-005",
		customer: "Jaffna Store",
		customerType: "Wholesale",
		orderDate: "2024-01-11",
		requiredDelivery: "2024-01-20",
		route: "Jaffna",
		address: "567 Temple Road, Jaffna",
		products: [
			{ name: "Cooking Oil 5L", quantity: 150, spaceUnits: 45 },
			{ name: "Tea Packets", quantity: 500, spaceUnits: 20 },
			{ name: "Biscuits (Assorted)", quantity: 300, spaceUnits: 25 },
		],
		totalValue: 275000,
		totalSpaceUnits: 90,
		status: "pending",
		priority: "urgent",
		daysRemaining: 0,
	},
];

export default function PendingOrdersPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [filterPriority, setFilterPriority] = useState("all");
	const [selectedOrder, setSelectedOrder] = useState<any>(null);

	const getPriorityBadge = (priority: string) => {
		const styles = {
			urgent: "bg-red-100 text-red-800 border-red-200",
			high: "bg-orange-100 text-orange-800 border-orange-200",
			medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
			low: "bg-gray-100 text-gray-800 border-gray-200",
		};
		return styles[priority] || "bg-gray-100 text-gray-800";
	};

	const getCustomerTypeBadge = (type: string) => {
		const styles = {
			Wholesale: "bg-purple-100 text-purple-800",
			Retail: "bg-blue-100 text-blue-800",
		};
		return styles[type] || "bg-gray-100 text-gray-800";
	};

	const filteredOrders = mockOrders.filter((order) => {
		const matchesSearch =
			order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.route.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesFilter =
			filterPriority === "all" || order.priority === filterPriority;

		return matchesSearch && matchesFilter;
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
						<div className="text-2xl font-bold">{mockOrders.length}</div>
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
							{mockOrders.filter(o => o.priority === "urgent").length}
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
							{mockOrders.reduce((acc, o) => acc + o.totalSpaceUnits, 0)}
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
							LKR {(mockOrders.reduce((acc, o) => acc + o.totalValue, 0) / 1000).toFixed(0)}k
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
							<select
								className="px-3 py-2 border rounded-md text-sm"
								value={filterPriority}
								onChange={(e) => setFilterPriority(e.target.value)}
							>
								<option value="all">All Priorities</option>
								<option value="urgent">Urgent</option>
								<option value="high">High</option>
								<option value="medium">Medium</option>
								<option value="low">Low</option>
							</select>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{filteredOrders.map((order) => (
							<div
								key={order.id}
								className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
								onClick={() => setSelectedOrder(order)}
							>
								<div className="flex flex-col lg:flex-row justify-between gap-4">
									<div className="flex-1 space-y-3">
										{/* Order Header */}
										<div className="flex items-start justify-between">
											<div>
												<div className="flex items-center gap-2 flex-wrap">
													<span className="font-semibold">{order.id}</span>
													<span
														className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityBadge(
															order.priority
														)}`}
													>
														{order.priority.toUpperCase()}
													</span>
													<span
														className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCustomerTypeBadge(
															order.customerType
														)}`}
													>
														{order.customerType}
													</span>
													{order.daysRemaining <= 1 && (
														<span className="flex items-center gap-1 text-xs text-red-600">
															<AlertTriangle className="h-3 w-3" />
															Due soon
														</span>
													)}
												</div>
												<p className="text-sm text-muted-foreground mt-1">
													{order.customer}
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
												<span>{order.route}</span>
											</div>
											<div className="flex items-center gap-2">
												<Calendar className="h-4 w-4 text-muted-foreground" />
												<span>Delivery: {order.requiredDelivery}</span>
											</div>
											<div className="flex items-center gap-2">
												<Package className="h-4 w-4 text-muted-foreground" />
												<span>{order.products.length} products</span>
											</div>
											<div className="flex items-center gap-2">
												<Clock className="h-4 w-4 text-muted-foreground" />
												<span>{order.daysRemaining} days remaining</span>
											</div>
										</div>

										{/* Products Summary */}
										<div className="flex flex-wrap gap-2">
											{order.products.slice(0, 2).map((product, idx) => (
												<span
													key={idx}
													className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
												>
													{product.name} ({product.quantity})
												</span>
											))}
											{order.products.length > 2 && (
												<span className="text-xs text-muted-foreground">
													+{order.products.length - 2} more
												</span>
											)}
										</div>

										{/* Bottom Info */}
										<div className="flex justify-between items-center pt-2 border-t">
											<div className="flex gap-4 text-sm">
												<span className="font-medium">
													Space: {order.totalSpaceUnits} units
												</span>
												<span className="font-medium">
													Value: LKR {(order.totalValue / 1000).toFixed(0)}k
												</span>
											</div>
											<div className="flex gap-2">
												<Button size="sm" variant="outline">
													<Train className="h-3 w-3 mr-1" />
													Assign to Train
												</Button>
												<Button size="sm" variant="default">
													<Truck className="h-3 w-3 mr-1" />
													Schedule Delivery
												</Button>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>

					{filteredOrders.length === 0 && (
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
