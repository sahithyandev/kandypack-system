"use client";

import {
	BarChart2,
	Cog,
	FileText,
	HelpCircle,
	Home,
	MapPin,
	Truck,
	User,
} from "lucide-react";
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
				href: "/driver",
				label: "Dashboard",
				icon: <Home />,
			},
			// {
			// 	href: "/driver/profile",
			// 	label: "Profile",
			// 	icon: <User />,
			// },
			{
				href: "/driver/trips",
				label: "Trips",
				icon: <MapPin />,
			},
			{
				href: "/driver/schedule",
				label: "Schedule",
				icon: <Cog />,
			},
			{ href: "/driver/analytics", label: "Analytics", icon: <BarChart2 /> },
			{ href: "/driver/vehicles", label: "Vehicles", icon: <Truck /> },
			// { href: "/driver/reports", label: "Reports", icon: <FileText /> },
			// { href: "/driver/support", label: "Support", icon: <HelpCircle /> },
		],
	},
];

export default function DriverSidebarContent() {
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
