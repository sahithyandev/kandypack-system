"use client";

import DriverSidebarContent from "@/components/driver/driver-sidebar-content";
import DriverSidebarFooter from "@/components/driver/driver-sidebar-footer";
import DriverProfilePanel from "@/components/driver/driver-profile-panel";
import { Sidebar } from "@/components/ui/sidebar";

export default function DriverSidebar() {
	return (
		<Sidebar collapsible="icon">
			<DriverProfilePanel />
			<DriverSidebarContent />
			<DriverSidebarFooter />
		</Sidebar>
	);
}
