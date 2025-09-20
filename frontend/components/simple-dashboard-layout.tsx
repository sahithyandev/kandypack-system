"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthService, type AuthUser } from "@/lib/auth";
import { mockNotifications } from "@/lib/mock-data";

export default function SimpleDashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const currentUser = AuthService.getCurrentUser();
		if (!currentUser) {
			router.push("/login");
		} else {
			setUser(currentUser);
		}
	}, [router]);

	const handleLogout = () => {
		AuthService.logout();
		router.push("/login");
	};

	const unreadNotifications = mockNotifications.filter(n => !n.read).length;

	const navigation = [
		{ name: "Dashboard", href: "/dashboard" },
		{ name: "Place Order", href: "/dashboard/orders/new" },
		{ name: "Track Orders", href: "/dashboard/orders" },
		{ 
			name: `Notifications ${unreadNotifications > 0 ? `(${unreadNotifications})` : ''}`, 
			href: "/dashboard/notifications" 
		},
	];

	if (!user) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<p className="mt-2 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						{/* Logo */}
						<div className="flex items-center">
							<Link href="/dashboard" className="flex items-center space-x-2">
								<div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
									<span className="text-white font-bold text-sm">K</span>
								</div>
								<span className="text-xl font-bold text-gray-900">Kandypack</span>
							</Link>
						</div>

						{/* Desktop Navigation */}
						<nav className="hidden md:flex space-x-8">
							{navigation.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
								>
									{item.name}
								</Link>
							))}
						</nav>

						{/* User Menu */}
						<div className="flex items-center space-x-4">
							<span className="hidden md:block text-sm text-gray-700">
								Welcome, {user.name}
							</span>
							<button
								onClick={handleLogout}
								className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
							>
								Logout
							</button>
							
							{/* Mobile menu button */}
							<button
								className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							>
								<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									{isMobileMenuOpen ? (
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									) : (
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
									)}
								</svg>
							</button>
						</div>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isMobileMenuOpen && (
					<div className="md:hidden border-t border-gray-200 bg-white">
						<div className="px-2 pt-2 pb-3 space-y-1">
							{navigation.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md text-base font-medium transition-colors"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									{item.name}
								</Link>
							))}
							<div className="border-t border-gray-200 pt-2 mt-2">
								<div className="px-3 py-2 text-sm text-gray-600">
									Welcome, {user.name}
								</div>
							</div>
						</div>
					</div>
				)}
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{children}
			</main>
		</div>
	);
}