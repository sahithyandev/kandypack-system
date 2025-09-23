import { cookies } from "next/headers";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SIDEBAR_COOKIE_NAME } from "@/lib/consts";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value === "true";
	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<AdminSidebar />
			<main className="px-3 py-2">
				<SidebarTrigger className="cursor-pointer" />
				{children}
			</main>
		</SidebarProvider>
	);
}
