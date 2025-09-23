import { Sidebar, SidebarHeader } from "@/components/ui/sidebar";
import { NAME } from "@/lib/consts";
import AdminSidebarContent from "./admin-sidebar-content";
import AdminSidebarFooter from "./admin-sidebar-footer";

export function AdminSidebar() {
	return (
		<Sidebar>
			<SidebarHeader>
				<h1 className="text-xl font-bold">{NAME}</h1>
			</SidebarHeader>
			<AdminSidebarContent />
			<AdminSidebarFooter />
		</Sidebar>
	);
}
