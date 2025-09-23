"use client";

import { Cog, NotebookText, SquareKanban } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	SidebarContent,
	SidebarGroup,
	SidebarMenuButton,
} from "@/components/ui/sidebar";

interface LinkItem {
	href: string;
	label: string;
	icon?: React.ReactNode;
}
interface LinkGroup {
	title?: string;
	links: Array<LinkItem>;
}

const linkGroups: Array<LinkGroup> = [
	{
		links: [
			{
				href: "/admin",
				label: "Dashboard",
				icon: <SquareKanban />,
			},
			{
				href: "/admin/reports",
				label: "Reports",
				icon: <NotebookText />,
			},
			{
				href: "/admin/system-config",
				label: "System Config",
				icon: <Cog />,
			},
		],
	},
];

export default function AdminSidebarContent() {
	const pathname = usePathname();
	return (
		<SidebarContent>
			{linkGroups.map((group, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: Not an issue as the list is static
				<SidebarGroup key={index} className="space-y-1">
					{group.links.map((link) => (
						<SidebarMenuButton
							asChild
							key={link.href}
							isActive={pathname === link.href}
						>
							<Link href={link.href}>
								{link.icon}
								{link.label}
							</Link>
						</SidebarMenuButton>
					))}
				</SidebarGroup>
			))}
		</SidebarContent>
	);
}
