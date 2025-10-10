import type { Metadata } from "next";
import { cookies } from "next/headers";
import DriverSidebar from "@/components/driver/driver-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SIDEBAR_COOKIE_NAME } from "@/lib/consts";

export const metadata: Metadata = {
	title: "Driver Dashboard",
	description: "Dashboard for drivers - assigned trips, vehicle info and tasks",
};

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value === "true";
	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<DriverSidebar />
			<main className="px-3 py-2 w-full">
				<SidebarTrigger className="cursor-pointer" />
				{children}
			</main>
		</SidebarProvider>
	);
}
