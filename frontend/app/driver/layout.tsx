import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DriverSidebar from "@/components/driver/driver-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SIDEBAR_COOKIE_NAME } from "@/lib/consts";
import DriverHeader from "@/components/driver/driver-header";

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

	// SSR guard: only allow Driver users into /driver/*
	const token = cookieStore.get("logged_in")?.value;
	if (!token) {
		redirect("/login");
	}

	const decodeJwt = (t: string): { username?: string; role?: string; workerType?: string } | null => {
		try {
			const parts = t.split(".");
			if (parts.length !== 3) return null;
			const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
			const pad = payload.length % 4 ? 4 - (payload.length % 4) : 0;
			const base64 = payload + "=".repeat(pad);
			const json = Buffer.from(base64, "base64").toString("utf8");
			return JSON.parse(json);
		} catch {
			return null;
		}
	};

	const user = token ? decodeJwt(token) : null;
	if (!user) redirect("/login");
	if (user.role === "Worker" && user.workerType === "Dispatcher") {
		redirect("/dispatcher/overview");
	}
	if (!(user.role === "Worker" && user.workerType === "Driver")) {
		// Fallback for Admin/StoreManager or unknown roles
		redirect("/dashboard");
	}
	const defaultOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value === "true";
	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<div className="flex h-screen bg-gray-50 dark:bg-gray-900">
				{/* Sidebar */}
				<DriverSidebar />

				{/* Main content area */}
				<div className="flex flex-1 flex-col">
					{/* Top header to mirror dispatcher layout */}
					<header className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 sm:px-6">
						<SidebarTrigger className="cursor-pointer lg:hidden" />
						<h1 className="text-lg sm:text-xl font-semibold">Driver Dashboard</h1>
						<div className="flex items-center gap-2">
							<DriverHeader />
						</div>
					</header>

					{/* Page content */}
					<main className="flex-1 overflow-y-auto p-4 sm:p-6">
						{children}
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
}
