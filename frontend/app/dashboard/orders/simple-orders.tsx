"use client";

import Link from "next/link";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function SimpleOrdersPage() {
	const orders = [
		{
			id: "ORD001",
			items: 2,
			route: "Colombo Central",
			amount: 1325,
			date: "2024-01-15",
			status: "delivered",
		},
		{
			id: "ORD002",
			items: 3,
			route: "Galle Road South",
			amount: 2900,
			date: "2024-09-15",
			status: "out_for_delivery",
		},
		{
			id: "ORD003",
			items: 4,
			route: "Kandy Hills",
			amount: 1440,
			date: "2024-09-18",
			status: "in_transit",
		},
		{
			id: "ORD004",
			items: 2,
			route: "Negombo Beach",
			amount: 710,
			date: "2024-09-20",
			status: "train_scheduled",
		},
		{
			id: "ORD005",
			items: 3,
			route: "Matara Express",
			amount: 555,
			date: "2024-09-22",
			status: "placed",
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "placed":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "train_scheduled":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "in_transit":
				return "bg-purple-100 text-purple-800 border-purple-200";
			case "out_for_delivery":
				return "bg-orange-100 text-orange-800 border-orange-200";
			case "delivered":
				return "bg-green-100 text-green-800 border-green-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const formatStatus = (status: string) => {
		return status
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	return (
		<div className="min-h-screen">
			{/* Header */}
			<header className="shadow border-b border-border">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center">
							<Link href="/dashboard" className="flex items-center space-x-2">
								<div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
									<span className="text-white font-bold text-sm">K</span>
								</div>
								<span className="text-xl font-bold">Kandypack</span>
							</Link>
						</div>
						<nav className="flex space-x-8">
							<Link
								href="/dashboard"
								className="hover:text-blue-600 px-3 py-2 text-sm font-medium"
							>
								Dashboard
							</Link>
							<Link
								href="/dashboard/orders/new"
								className="hover:text-blue-600 px-3 py-2 text-sm font-medium"
							>
								Place Order
							</Link>
							<Link
								href="/dashboard/orders"
								className="text-blue-700 px-3 py-2 text-sm font-medium border-b-2 border-blue-600"
							>
								Track Orders
							</Link>
							<Link
								href="/dashboard/notifications"
								className="hover:text-blue-600 px-3 py-2 text-sm font-medium"
							>
								Notifications
							</Link>
							<Link
								href="/login"
								className="bg-red-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-red-600"
							>
								Logout
							</Link>
						</nav>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="space-y-6">
					{/* Header */}
					<div>
						<h1 className="text-3xl font-bold">Track Orders</h1>
						<p className="">
							Monitor the status of your orders and delivery progress
						</p>
					</div>

					{/* Search and Filter */}
					<div className="flex flex-col sm:flex-row gap-4 h-10">
						<input
							type="text"
							placeholder="Search by order ID or route..."
							className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-full"
						/>
						<Select>
							<SelectTrigger className="w-full sm:w-48 px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 !h-full">
								<SelectValue placeholder="All Orders" />
							</SelectTrigger>
							<SelectContent className="">
								<SelectItem value="all">All Orders</SelectItem>
								<SelectItem value="placed">Placed</SelectItem>
								<SelectItem value="train_scheduled">Train Scheduled</SelectItem>
								<SelectItem value="in_transit">In Transit</SelectItem>
								<SelectItem value="out_for_delivery">
									Out for Delivery
								</SelectItem>
								<SelectItem value="delivered">Delivered</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Orders List */}
					<div className="space-y-4">
						{orders.map((order) => (
							<div
								key={order.id}
								className="rounded-lg shadow border border-border hover:shadow-md transition-shadow"
							>
								<div className="p-6">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<div>
												<div className="flex items-center space-x-2">
													<h3 className="text-lg font-semibold">{order.id}</h3>
													<span
														className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
													>
														{formatStatus(order.status)}
													</span>
												</div>
												<div className="mt-1 text-sm text-muted-foreground space-x-4">
													<span>📅 {order.date}</span>
													<span>📦 {order.items} item(s)</span>
													<span>🚛 {order.route}</span>
												</div>
											</div>
										</div>
										<div className="text-right">
											<p className="text-lg font-bold">
												Rs. {order.amount.toLocaleString()}
											</p>
											<p className="text-sm text-muted-foreground">
												Total Amount
											</p>
										</div>
									</div>

									{/* Progress Bar */}
									<div className="mt-6">
										<div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
											<span>Order Progress</span>
											<span>{formatStatus(order.status)}</span>
										</div>
										<div className="w-full bg-foreground/10 rounded-full h-2">
											<div
												className="bg-blue-600 h-2 rounded-full transition-all duration-300"
												style={{
													width:
														order.status === "placed"
															? "20%"
															: order.status === "train_scheduled"
																? "40%"
																: order.status === "in_transit"
																	? "60%"
																	: order.status === "out_for_delivery"
																		? "80%"
																		: order.status === "delivered"
																			? "100%"
																			: "0%",
												}}
											></div>
										</div>
										<div className="flex justify-between text-xs text-muted-foreground mt-1">
											<span>Placed</span>
											<span>Scheduled</span>
											<span>In Transit</span>
											<span>Out for Delivery</span>
											<span>Delivered</span>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</main>
		</div>
	);
}
