import { cookies } from "next/headers";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SIDEBAR_COOKIE_NAME } from "@/lib/consts";
import { redirect } from "next/navigation";
import { getAuthValidate } from "@/lib/api-client";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value === "true";

	const loggedInCookie = cookieStore.get("logged_in");

	if (!loggedInCookie) {
		redirect("/login");
		return;
	}

	const response = await getAuthValidate({
		headers: {
			Authorization: `Bearer ${loggedInCookie.value}`,
		},
	});

	if (!("valid" in response)) {
		return <div>Failed to validate login status. Please try again later.</div>;
	}
	if (!response.valid) {
		redirect("/login");
		return;
	}

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<AdminSidebar />
			<main className="px-3 py-2 w-full">
				<SidebarTrigger className="cursor-pointer" />
				{children}
			</main>
		</SidebarProvider>
	);
}
