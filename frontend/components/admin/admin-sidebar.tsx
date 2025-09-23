import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
} from "@/components/ui/sidebar";
import { NAME } from "@/lib/consts";
import AdminSidebarFooter from "./admin-sidebar-footer";

export function AdminSidebar() {
	return (
		<Sidebar>
			<SidebarHeader>
				<h1 className="text-xl font-bold">{NAME}</h1>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup />
				<SidebarGroup />
			</SidebarContent>
			<AdminSidebarFooter />
		</Sidebar>
	);
}
