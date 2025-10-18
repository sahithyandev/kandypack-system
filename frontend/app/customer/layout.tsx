"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { CustomerSidebar } from "@/components/customer/customer-sidebar";

export default function CustomerLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<div className="flex h-screen w-full">
				<CustomerSidebar />
				<main className="flex-1 overflow-auto">
					<div className="p-6">
						{children}
					</div>
				</main>
			</div>
		</SidebarProvider>
	);
}