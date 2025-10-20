"use client";

import { LogOut, PanelLeftIcon } from "lucide-react";
import {
	SidebarFooter,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { removeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { postAuthSignOut } from "@/lib/api-client";
import { toast } from "sonner";

export default function AdminSidebarFooter() {
	const router = useRouter();
	const { toggleSidebar } = useSidebar();

	function logout() {
		postAuthSignOut()
			.then(() => {
				removeToken();
				router.push("/login");
			})
			.catch(() => {
				toast.error("Log out failed. Please try again.");
			});
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
