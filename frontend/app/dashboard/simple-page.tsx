/**
 * Simple Dashboard Page Component
 *
 * Main dashboard interface for the Kandypack customer portal.
 * Displays order statistics, quick actions, and recent orders with clean styling.
 */

"use client";

import Link from "next/link";
import StatsCard from "@/components/stats-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
		<div className="min-h-screen">
			{/* Navigation Header */}
			<header className="shadow border-b border-border">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						{/* Logo section */}
						<div className="flex items-center">
							<Link href="/dashboard" className="flex items-center space-x-2">
								<div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
									<span className="font-bold text-sm">K</span>
								</div>
								<span className="text-xl font-bold">Kandypack</span>
							</Link>
						</div>
						{/* Navigation menu */}
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
								className="hover:text-blue-600 px-3 py-2 text-sm font-medium"
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

			{/* Main Dashboard Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="space-y-8">
					{/* Welcome Section */}
					<div>
						<h1 className="text-3xl font-bold">Dashboard</h1>
						<p className="">Welcome to your Kandypack customer portal</p>
					</div>

					{/* Quick Action Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<Link href="/dashboard/orders/new" className="block">
							<Card className="gap-0">
								<CardHeader className="px-4">
									<CardTitle className="text-lg">Place New Order</CardTitle>
								</CardHeader>
								<CardContent className="px-4">
									<p className="mb-4">Browse products and create a new order</p>
									<Button
										variant="secondary"
										className="inline-block bg-blue-600 hover:bg-blue-800 cursor-pointer text-white px-4 py-2 rounded text-sm font-medium"
									>
										Start Shopping
									</Button>
								</CardContent>
							</Card>
						</Link>

						<Link href="/dashboard/orders" className="block">
							<Card className="gap-0">
								<CardHeader className="px-4">
									<CardTitle className="text-lg">Track Orders</CardTitle>
								</CardHeader>
								<CardContent className="px-4">
									<p className="mb-4">View status and track your orders</p>
									<Button className="inline-block bg-green-600 hover:bg-green-800 cursor-pointer text-white px-4 py-2 rounded text-sm font-medium">
										View Orders
									</Button>
								</CardContent>
							</Card>
						</Link>

						<Link href="/dashboard/notifications" className="block">
							<Card className="gap-0">
								<CardHeader className="px-4">
									<CardTitle className="text-lg">Notifications</CardTitle>
								</CardHeader>
								<CardContent className="px-4">
									<p className="mb-4">
										Check updates and delivery notifications
									</p>
									<Button className="inline-block bg-orange-600 hover:bg-orange-800 cursor-pointer text-white px-4 py-2 rounded text-sm font-medium">
										View Updates
									</Button>
								</CardContent>
							</Card>
						</Link>
					</div>

					{/* Order Statistics */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<StatsCard title="Total Orders" value={5} />
						<StatsCard title="Delivered" value={1} />
						<StatsCard title="In Transit" value={2} />
						<StatsCard title="Pending" value={2} />
					</div>

					{/* Recent Orders */}
					<div className="rounded-lg shadow border border-border">
						<div className="px-6 py-4 border-b border-border">
							<h3 className="text-lg font-semibold">Recent Orders</h3>
						</div>
						<div className="p-6">
							<div className="space-y-4">
								<div className="flex items-center justify-between p-4 border border-border rounded-lg">
									<div>
										<p className="font-medium ">ORD001</p>
										<p className="text-sm">2 items • Colombo Central</p>
									</div>
									<div className="text-right">
										<p className="font-medium ">Rs. 1,325</p>
										<span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
											Delivered
										</span>
									</div>
								</div>

								<div className="flex items-center justify-between p-4 border border-border rounded-lg">
									<div>
										<p className="font-medium ">ORD002</p>
										<p className="text-sm">3 items • Galle Road South</p>
									</div>
									<div className="text-right">
										<p className="font-medium ">Rs. 2,900</p>
										<span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
											Out for Delivery
										</span>
									</div>
								</div>

								<div className="flex items-center justify-between p-4 border border-border rounded-lg">
									<div>
										<p className="font-medium ">ORD003</p>
										<p className="text-sm">4 items • Kandy Hills</p>
									</div>
									<div className="text-right">
										<p className="font-medium ">Rs. 1,440</p>
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
