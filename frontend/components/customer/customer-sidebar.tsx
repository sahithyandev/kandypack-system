"use client";

import { Package, ShoppingCart, Home, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigationItems = [
	{
		title: "Dashboard",
		url: "/customer",
		icon: Home,
	},
	{
		title: "Orders",
		url: "/customer/orders",
		icon: Package,
	},
	{
		title: "New Order",
		url: "/customer/orders/new", 
		icon: ShoppingCart,
	},
];

export function CustomerSidebar() {
	const pathname = usePathname();

	const handleLogout = async () => {
		await signOut({ callbackUrl: "/login" });
	};

	return (
		<Sidebar>
			<SidebarHeader className="border-b p-4">
				<div className="flex items-center gap-2">
					<Package className="h-6 w-6" />
					<span className="font-semibold">Kandypack</span>
				</div>
				<p className="text-sm text-muted-foreground">Customer Portal</p>
			</SidebarHeader>

			<SidebarContent>
				<SidebarMenu>
					{navigationItems.map((item) => {
						const isActive = pathname === item.url || 
							(item.url !== "/customer" && pathname.startsWith(item.url));
						
						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild isActive={isActive}>
									<Link href={item.url} className="flex items-center gap-2">
										<item.icon className="h-4 w-4" />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarContent>

			<SidebarFooter className="border-t p-4">
				<div className="space-y-2">
					<div className="flex items-center gap-2 text-sm">
						<User className="h-4 w-4" />
						<span>Customer User</span>
					</div>
					<Button 
						variant="outline" 
						size="sm" 
						onClick={handleLogout}
						className="w-full"
					>
						<LogOut className="h-4 w-4 mr-2" />
						Logout
					</Button>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}