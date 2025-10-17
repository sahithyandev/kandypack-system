import { Sidebar } from "@/components/ui/sidebar";
import AdminSidebarContent from "./admin-sidebar-content";
import AdminSidebarFooter from "./admin-sidebar-footer";

export function AdminSidebar() {
	return (
		<Sidebar collapsible="icon">
			<AdminSidebarContent />
			<AdminSidebarFooter />
		</Sidebar>
	);
}
