import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
} from "@/components/ui/sidebar";
import AdminSidebarFooter from "./admin-sidebar-footer";

export function AdminSidebar() {
	return (
		<Sidebar>
			<SidebarHeader />
			<SidebarContent>
				<SidebarGroup />
				<SidebarGroup />
			</SidebarContent>
			<AdminSidebarFooter />
		</Sidebar>
	);
}
