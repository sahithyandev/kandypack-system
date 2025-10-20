"use client";

import { LogOut, PanelLeftIcon } from "lucide-react";
import {
	SidebarFooter,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";
import { postAuthSignOut } from "@/lib/api-client";

export default function AdminSidebarFooter() {
	const { toggleSidebar } = useSidebar();
	const router = useRouter();

	async function logout() {
		try {
			// Attempt server-side sign out to clear auth cookies
			await postAuthSignOut();
		} catch (err) {
			// Ignore API errors; proceed with client cleanup
		}
		// Remove client token and redirect to landing page
		removeToken();
		router.push("/");
	}

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
