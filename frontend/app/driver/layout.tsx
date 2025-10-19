import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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
			<DriverSidebar />
			<main className="px-3 py-2 w-full">
				<SidebarTrigger className="cursor-pointer" />
				{children}
			</main>
		</SidebarProvider>
	);
}
