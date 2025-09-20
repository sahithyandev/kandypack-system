/**
 * Simple Dashboard Page Component
 * 
 * Main dashboard interface for the Kandypack customer portal.
 * Displays order statistics, quick actions, and recent orders with clean styling.
 */

"use client";

import Link from "next/link";

/**
 * SimpleDashboardPage Component
 * 
 * Renders the main dashboard with navigation, statistics cards, and recent orders.
 * Uses static data for demonstration purposes with emoji icons for reliability.
 * 
 * @returns JSX element containing the complete dashboard interface
 */
export default function SimpleDashboardPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Navigation Header */}
			<header className="bg-white shadow border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						{/* Logo section */}
						<div className="flex items-center">
							<Link href="/dashboard" className="flex items-center space-x-2">
								<div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
									<span className="text-white font-bold text-sm">K</span>
								</div>
								<span className="text-xl font-bold text-gray-900">Kandypack</span>
							</Link>
						</div>
						{/* Navigation menu */}
						<nav className="flex space-x-8">
							<Link href="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
								Dashboard
							</Link>
							<Link href="/dashboard/orders/new" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
								Place Order
							</Link>
							<Link href="/dashboard/orders" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
								Track Orders
							</Link>
							<Link href="/dashboard/notifications" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
								Notifications
							</Link>
							<Link href="/login" className="bg-red-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-red-600">
								Logout
							</Link>
						</nav>
					</div>
				</div>
			</header>

			{/* Main Dashboard Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="space-y-8">
					{/* Welcome Section */}
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
						<p className="text-gray-600">Welcome to your Kandypack customer portal</p>
					</div>

					{/* Quick Action Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<Link href="/dashboard/orders/new" className="block">
							<div className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
								<h3 className="text-lg font-semibold text-gray-900 mb-2">Place New Order</h3>
								<p className="text-gray-600 mb-4">Browse products and create a new order</p>
								<span className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium">
									Start Shopping
								</span>
							</div>
						</Link>

						<Link href="/dashboard/orders" className="block">
							<div className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
								<h3 className="text-lg font-semibold text-gray-900 mb-2">Track Orders</h3>
								<p className="text-gray-600 mb-4">View status and track your orders</p>
								<span className="inline-block bg-green-600 text-white px-4 py-2 rounded text-sm font-medium">
									View Orders
								</span>
							</div>
						</Link>

						<Link href="/dashboard/notifications" className="block">
							<div className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
								<h3 className="text-lg font-semibold text-gray-900 mb-2">Notifications</h3>
								<p className="text-gray-600 mb-4">Check updates and delivery notifications</p>
								<span className="inline-block bg-orange-600 text-white px-4 py-2 rounded text-sm font-medium">
									View Updates
								</span>
							</div>
						</Link>
					</div>

					{/* Order Statistics */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="bg-white p-6 rounded-lg shadow border border-gray-200">
							<p className="text-sm font-medium text-gray-600">Total Orders</p>
							<p className="text-2xl font-bold text-gray-900">5</p>
						</div>
						<div className="bg-white p-6 rounded-lg shadow border border-gray-200">
							<p className="text-sm font-medium text-gray-600">Pending</p>
							<p className="text-2xl font-bold text-yellow-600">2</p>
						</div>
						<div className="bg-white p-6 rounded-lg shadow border border-gray-200">
							<p className="text-sm font-medium text-gray-600">In Transit</p>
							<p className="text-2xl font-bold text-blue-600">2</p>
						</div>
						<div className="bg-white p-6 rounded-lg shadow border border-gray-200">
							<p className="text-sm font-medium text-gray-600">Delivered</p>
							<p className="text-2xl font-bold text-green-600">1</p>
						</div>
					</div>

					{/* Recent Orders */}
					<div className="bg-white rounded-lg shadow border border-gray-200">
						<div className="px-6 py-4 border-b border-gray-200">
							<h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
						</div>
						<div className="p-6">
							<div className="space-y-4">
								<div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
									<div>
										<p className="font-medium text-gray-900">ORD001</p>
										<p className="text-sm text-gray-600">2 items • Colombo Central</p>
									</div>
									<div className="text-right">
										<p className="font-medium text-gray-900">Rs. 1,325</p>
										<span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
											Delivered
										</span>
									</div>
								</div>
								
								<div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
									<div>
										<p className="font-medium text-gray-900">ORD002</p>
										<p className="text-sm text-gray-600">3 items • Galle Road South</p>
									</div>
									<div className="text-right">
										<p className="font-medium text-gray-900">Rs. 2,900</p>
										<span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
											Out for Delivery
										</span>
									</div>
								</div>
								
								<div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
									<div>
										<p className="font-medium text-gray-900">ORD003</p>
										<p className="text-sm text-gray-600">4 items • Kandy Hills</p>
									</div>
									<div className="text-right">
										<p className="font-medium text-gray-900">Rs. 1,440</p>
										<span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
											In Transit
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}