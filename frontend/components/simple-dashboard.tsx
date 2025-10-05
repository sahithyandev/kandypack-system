"use client";

import Link from "next/link";
import { mockNotifications, mockOrders } from "@/lib/mock-data";

export default function SimpleDashboard() {
	const recentOrders = mockOrders.slice(0, 3);
	const unreadNotifications = mockNotifications.filter((n) => !n.read).length;

	const orderStats = {
		total: mockOrders.length,
		pending: mockOrders.filter(
			(o) => o.status === "placed" || o.status === "train_scheduled",
		).length,
		inTransit: mockOrders.filter(
			(o) => o.status === "in_transit" || o.status === "out_for_delivery",
		).length,
		delivered: mockOrders.filter((o) => o.status === "delivered").length,
	};

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

	const formatCurrency = (amount: number) => {
		return `Rs. ${amount.toLocaleString()}`;
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<div className="space-y-8">
			{/* Welcome Section */}
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
				<p className="text-gray-600">
					Welcome to your Kandypack customer portal
				</p>
			</div>

			{/* Quick Actions */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<Link href="/dashboard/orders/new" className="block">
					<div className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900">
								Place New Order
							</h3>
							<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
								<svg
									className="w-5 h-5 text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-2H1m6 4v8a2 2 0 002 2h8a2 2 0 002-2v-8"
									/>
								</svg>
							</div>
						</div>
						<p className="text-gray-600 mb-4">
							Browse products and create a new order for delivery
						</p>
						<span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
							Start Shopping
						</span>
					</div>
				</Link>

				<Link href="/dashboard/orders" className="block">
					<div className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900">
								Track Orders
							</h3>
							<div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
								<svg
									className="w-5 h-5 text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
									/>
								</svg>
							</div>
						</div>
						<p className="text-gray-600 mb-4">
							View status and track your current orders
						</p>
						<span className="inline-block bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">
							View Orders
						</span>
					</div>
				</Link>

				<Link href="/dashboard/notifications" className="block">
					<div className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900">
								Notifications
							</h3>
							<div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center relative">
								<svg
									className="w-5 h-5 text-orange-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 17h5l-5 5v-5zM11.613 15.932l-.184-.258-.199-.284-.043-.069-.043-.069c-.044-.069-.132-.258-.265-.568a10.97 10.97 0 01-.556-1.839 11.02 11.02 0 01-.2-1.533V9a6 6 0 016-6 6 6 0 016 6v2.253c0 .529-.043 1.033-.1 1.533a10.97 10.97 0 01-.556 1.839c-.133.31-.221.499-.265.568l-.043.069-.043.069-.199.284-.184.258z"
									/>
								</svg>
								{unreadNotifications > 0 && (
									<span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
										{unreadNotifications}
									</span>
								)}
							</div>
						</div>
						<p className="text-gray-600 mb-4">
							Check updates and delivery notifications
						</p>
						<span className="inline-block bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-700 transition-colors">
							View Updates{" "}
							{unreadNotifications > 0 && `(${unreadNotifications} new)`}
						</span>
					</div>
				</Link>
			</div>

			{/* Order Statistics */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="bg-white p-6 rounded-lg shadow border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Total Orders</p>
							<p className="text-2xl font-bold text-gray-900">
								{orderStats.total}
							</p>
						</div>
						<div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
							<svg
								className="w-4 h-4 text-gray-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
								/>
							</svg>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg shadow border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Pending</p>
							<p className="text-2xl font-bold text-yellow-600">
								{orderStats.pending}
							</p>
						</div>
						<div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
							<svg
								className="w-4 h-4 text-yellow-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg shadow border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">In Transit</p>
							<p className="text-2xl font-bold text-blue-600">
								{orderStats.inTransit}
							</p>
						</div>
						<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
							<svg
								className="w-4 h-4 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
								/>
							</svg>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg shadow border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Delivered</p>
							<p className="text-2xl font-bold text-green-600">
								{orderStats.delivered}
							</p>
						</div>
						<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
							<svg
								className="w-4 h-4 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>

			{/* Recent Orders */}
			<div className="bg-white rounded-lg shadow border border-gray-200">
				<div className="px-6 py-4 border-b border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-semibold text-gray-900">
								Recent Orders
							</h3>
							<p className="text-sm text-gray-600">
								Your latest order activity
							</p>
						</div>
						<Link
							href="/dashboard/orders"
							className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
						>
							View All
						</Link>
					</div>
				</div>
				<div className="p-6">
					<div className="space-y-4">
						{recentOrders.map((order) => (
							<div
								key={order.id}
								className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
							>
								<div className="flex-1">
									<div className="flex items-center space-x-4">
										<div>
											<p className="font-medium text-gray-900">{order.id}</p>
											<p className="text-sm text-gray-600">
												{order.items.length} item(s) • {order.routeName}
											</p>
										</div>
									</div>
								</div>
								<div className="flex items-center space-x-4">
									<div className="text-right">
										<p className="font-medium text-gray-900">
											{formatCurrency(order.totalAmount)}
										</p>
										<p className="text-sm text-gray-600">
											{formatDate(order.orderDate)}
										</p>
									</div>
									<span
										className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
									>
										{formatStatus(order.status)}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
