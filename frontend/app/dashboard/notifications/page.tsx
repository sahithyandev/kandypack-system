"use client";

import {
	Bell,
	BellRing,
	CheckCircle2,
	Info,
	Package,
	Truck,
	X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockNotifications, type Notification } from "@/lib/mock-data";

export default function NotificationsPage() {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [filter, setFilter] = useState<string>("all");

	useEffect(() => {
		// In a real app, this would fetch notifications for the current user
		setNotifications(mockNotifications);
	}, []);

	const filterOptions = [
		{ value: "all", label: "All Notifications" },
		{ value: "unread", label: "Unread" },
		{ value: "order_update", label: "Order Updates" },
		{ value: "delivery", label: "Delivery" },
		{ value: "system", label: "System" },
	];

	// Filter notifications
	const filteredNotifications = notifications.filter((notification) => {
		if (filter === "all") return true;
		if (filter === "unread") return !notification.read;
		return notification.type === filter;
	});

	const unreadCount = notifications.filter((n) => !n.read).length;

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case "order_update":
				return <Package className="h-5 w-5 text-blue-600" />;
			case "delivery":
				return <Truck className="h-5 w-5 text-green-600" />;
			case "system":
				return <Info className="h-5 w-5 text-orange-600" />;
			default:
				return <Bell className="h-5 w-5 text-gray-600" />;
		}
	};

	const getTypeColor = (type: string) => {
		switch (type) {
			case "order_update":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "delivery":
				return "bg-green-100 text-green-800 border-green-200";
			case "system":
				return "bg-orange-100 text-orange-800 border-orange-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const formatType = (type: string) => {
		return type
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInHours = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60 * 60),
		);

		if (diffInHours < 1) {
			return "Just now";
		} else if (diffInHours < 24) {
			return `${diffInHours}h ago`;
		} else if (diffInHours < 168) {
			// 7 days
			return `${Math.floor(diffInHours / 24)}d ago`;
		} else {
			return date.toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
			});
		}
	};

	const markAsRead = (notificationId: string) => {
		setNotifications((prevNotifications) =>
			prevNotifications.map((notification) =>
				notification.id === notificationId
					? { ...notification, read: true }
					: notification,
			),
		);
	};

	const markAllAsRead = () => {
		setNotifications((prevNotifications) =>
			prevNotifications.map((notification) => ({
				...notification,
				read: true,
			})),
		);
	};

	const deleteNotification = (notificationId: string) => {
		setNotifications((prevNotifications) =>
			prevNotifications.filter(
				(notification) => notification.id !== notificationId,
			),
		);
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Header */}
			<div className="flex items-center justify-between mt-2 mb-10">
				<div>
					<h1 className="text-3xl font-bold flex items-center space-x-2">
						<Bell className="h-8 w-8" />
						<span>Notifications</span>
						{unreadCount > 0 && (
							<Badge
								variant="destructive"
								className="h-6 w-6 flex items-center justify-center p-0 text-sm"
							>
								{unreadCount}
							</Badge>
						)}
					</h1>
					<p>Stay updated with your order status and system messages</p>
				</div>
				{unreadCount > 0 && (
					<Button onClick={markAllAsRead} variant="outline">
						<CheckCircle2 className="h-4 w-4 mr-2" />
						Mark All as Read
					</Button>
				)}
			</div>

			{/* Filter Tabs */}
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Filter Notifications</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-2">
						{filterOptions.map((option) => (
							<Button
								key={option.value}
								variant={filter === option.value ? "default" : "outline"}
								size="sm"
								onClick={() => setFilter(option.value)}
								className="flex items-center space-x-1"
							>
								<span>{option.label}</span>
								{option.value === "unread" && unreadCount > 0 && (
									<Badge
										variant="destructive"
										className="h-4 w-4 flex items-center justify-center p-0 text-xs ml-1"
									>
										{unreadCount}
									</Badge>
								)}
							</Button>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Notifications List */}
			<div className="space-y-3 mb-6">
				{filteredNotifications.length === 0 ? (
					<Card>
						<CardContent className="py-12 text-center">
							<BellRing className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								No notifications found
							</h3>
							<p className="text-gray-600">
								{filter === "unread"
									? "You're all caught up! No unread notifications."
									: "No notifications match your current filter."}
							</p>
						</CardContent>
					</Card>
				) : (
					filteredNotifications.map((notification) => (
						<Card
							key={notification.id}
							className={`hover:shadow-md transition-all cursor-pointer ${
								!notification.read
									? "border-l-4 bg-blue-100/20"
									: "border-l-blue-500"
							}`}
						>
							<CardContent className="p-4">
								<div className="flex items-start justify-between space-x-4">
									<div className="flex items-start space-x-3 flex-1">
										{/* Icon */}
										<div className="flex-shrink-0 mt-1">
											{getNotificationIcon(notification.type)}
										</div>

										{/* Content */}
										<div className="flex-1 min-w-0">
											<div className="flex items-center space-x-2 mb-1">
												<h4
													className={`font-medium ${!notification.read ? "text-muted-foreground" : ""}`}
												>
													{notification.title}
												</h4>
												<Badge
													className={`${getTypeColor(notification.type)} border text-xs`}
												>
													{formatType(notification.type)}
												</Badge>
												{!notification.read && (
													<div className="w-2 h-2 bg-blue-600 rounded-full"></div>
												)}
											</div>

											<p
												className={`text-sm ${!notification.read ? "text-muted-foreground" : ""} mb-2`}
											>
												{notification.message}
											</p>

											<div className="flex items-center space-x-4 text-xs">
												<span>{formatDate(notification.date)}</span>
												{notification.orderId && (
													<Link
														href={`/dashboard/orders?search=${notification.orderId}`}
														className="text-blue-600 hover:text-blue-800 underline"
													>
														View Order {notification.orderId}
													</Link>
												)}
											</div>
										</div>
									</div>

									{/* Actions */}
									<div className="flex items-center space-x-2 flex-shrink-0">
										{!notification.read && (
											<Button
												size="sm"
												variant="ghost"
												onClick={(e) => {
													e.stopPropagation();
													markAsRead(notification.id);
												}}
												title="Mark as read"
											>
												<CheckCircle2 className="h-4 w-4" />
											</Button>
										)}
										<Button
											size="sm"
											variant="ghost"
											onClick={(e) => {
												e.stopPropagation();
												deleteNotification(notification.id);
											}}
											title="Delete notification"
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>

			{/* Summary Stats */}
			{notifications.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Notification Summary</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="text-center">
								<div className="text-2xl font-bold">{notifications.length}</div>
								<div className="text-sm">Total</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-blue-600">
									{unreadCount}
								</div>
								<div className="text-sm text-gray-600">Unread</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-green-600">
									{
										notifications.filter((n) => n.type === "order_update")
											.length
									}
								</div>
								<div className="text-sm ">Order Updates</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-orange-600">
									{notifications.filter((n) => n.type === "delivery").length}
								</div>
								<div className="text-sm text-gray-600">Deliveries</div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
