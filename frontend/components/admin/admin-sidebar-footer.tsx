"use client";

import { LogOut, PanelLeftIcon } from "lucide-react";
import {
	SidebarFooter,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

export default function AdminSidebarFooter() {
	const { toggleSidebar } = useSidebar();
	function logout() {}

	return (
		<SidebarFooter>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton
						className="text-destructive hover:text-destructive"
						onClick={logout}
					>
						<LogOut />
						<span>Log Out</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
				<SidebarMenuItem>
					<SidebarMenuButton className="cursor-pointer" onClick={toggleSidebar}>
						<PanelLeftIcon />
						<span>Hide</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarFooter>
	);
}
