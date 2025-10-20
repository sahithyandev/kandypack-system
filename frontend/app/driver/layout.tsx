"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
	LayoutDashboard,
	MapPin,
	Cog,
	BarChart2,
	Truck,
	Menu,
	X,
	LogOut,
	User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserFromToken, removeToken } from "@/lib/auth";
import { getDriverProfile } from "@/lib/driver-api";
import { postAuthSignOut } from "@/lib/api-client";

const navigation = [
	{
		name: "Dashboard",
		href: "/driver",
		icon: LayoutDashboard,
		description: "Driver dashboard overview",
	},
	{
		name: "Trips",
		href: "/driver/trips",
		icon: MapPin,
		description: "View and manage trips",
	},
	{
		name: "Schedule",
		href: "/driver/schedule",
		icon: Cog,
		description: "View your schedule",
	},
	{
		name: "Analytics",
		href: "/driver/analytics",
		icon: BarChart2,
		description: "Performance analytics",
	},
	{
		name: "Vehicles",
		href: "/driver/vehicles",
		icon: Truck,
		description: "Vehicle information",
	},
];

export default function DriverLayout({
	children,
}: { children: React.ReactNode }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [driverStatus, setDriverStatus] = useState<"Busy" | "Free" | "On_Leave">("Free");
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		const user = getUserFromToken();
		
		if (!user) {
			// No JWT token, redirect to login
			router.push("/login");
			return;
		}

		// Check if user is a driver
		if (user.role !== "Worker" || user.workerType !== "Driver") {
			// Not a driver, redirect to home (which will handle appropriate redirect)
			router.push("/");
			return;
		}

		setIsAuthenticated(true);

		// Fetch driver status
		const fetchDriverStatus = async () => {
			try {
				const profile = await getDriverProfile();
				setDriverStatus(profile.status);
			} catch (error) {
				console.error("Failed to fetch driver status:", error);
				// Keep default status on error
			}
		};

		fetchDriverStatus();
	}, [router]);

	const isActive = (href: string) => {
		return pathname === href;
	};

	const getStatusColor = (status: "Busy" | "Free" | "On_Leave") => {
		switch (status) {
			case "Busy":
				return "bg-red-500";
			case "Free":
				return "bg-green-500";
			case "On_Leave":
				return "bg-yellow-500";
			default:
				return "bg-gray-500";
		}
	};

	const formatStatus = (status: "Busy" | "Free" | "On_Leave") => {
		switch (status) {
			case "On_Leave":
				return "On Leave";
			default:
				return status;
		}
	};

	// Show loading state while checking authentication
	if (!isAuthenticated) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
					<p className="mt-2 text-sm text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-gray-50 dark:bg-gray-900">
			{/* Mobile sidebar backdrop */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/50 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<div
				className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex h-full flex-col">
					{/* Logo and title */}
					<div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
						<div className="flex items-center gap-2">
							<Truck className="h-8 w-8 text-primary" />
							<span className="text-xl font-semibold">Kandypack</span>
						</div>
						<Button
							variant="ghost"
							size="icon"
							className="lg:hidden"
							onClick={() => setSidebarOpen(false)}
						>
							<X className="h-5 w-5" />
						</Button>
					</div>

					{/* User info */}
					<div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
								<User className="h-5 w-5" />
							</div>
							<div>
								<p className="text-sm font-medium">Driver</p>
								<p className="text-xs text-muted-foreground">driver@kandypack.lk</p>
							</div>
						</div>
					</div>

					{/* Navigation */}
					<nav className="flex-1 space-y-1 px-3 py-4">
						{navigation.map((item) => {
							const Icon = item.icon;
							const active = isActive(item.href);
							return (
								<Link
									key={item.name}
									href={item.href}
									className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
										active
											? "bg-primary/10 text-primary"
											: "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
									}`}
								>
									<Icon
										className={`h-5 w-5 ${
											active
												? "text-primary"
												: "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
										}`}
									/>
									<span>{item.name}</span>
								</Link>
							);
						})}
					</nav>

					{/* Logout button */}
					<div className="border-t border-gray-200 dark:border-gray-700 p-3">
						<Button
							variant="ghost"
							className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
							onClick={async () => {
								try {
									// Attempt server-side sign out to clear auth cookies
									await postAuthSignOut();
								} catch (err) {
									// Ignore API errors; proceed with client cleanup
								}
								// Remove client token and redirect to landing page
								removeToken();
								router.push("/");
							}}
						>
							<LogOut className="h-5 w-5" />
							Logout
						</Button>
					</div>
				</div>
			</div>

			{/* Main content */}
			<div className="flex flex-1 flex-col">
				{/* Top header */}
				<header className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6">
					<Button
						variant="ghost"
						size="icon"
						className="lg:hidden"
						onClick={() => setSidebarOpen(true)}
					>
						<Menu className="h-5 w-5" />
					</Button>

					<h1 className="text-xl font-semibold">Driver Dashboard</h1>

					{/* Quick stats */}
					<div className="hidden md:flex items-center gap-4">
						<div className="flex items-center gap-2">
							<div className={`h-2 w-2 rounded-full ${getStatusColor(driverStatus)} animate-pulse`} />
							<span className="text-sm text-muted-foreground">{formatStatus(driverStatus)}</span>
						</div>
					</div>
				</header>

				{/* Page content */}
				<main className="flex-1 overflow-y-auto p-6">{children}</main>
			</div>
		</div>
	);
}
