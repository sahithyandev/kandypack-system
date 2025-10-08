"use client";
import React from "react";
import Link from "next/link";
import {
  Home,
  MapPin,
  Calendar,
  MessageCircle,
  BarChart2,
  Truck,
  FileText,
  HelpCircle,
} from "lucide-react";

const items = [
  { href: "/driver", label: "Dashboard", Icon: Home },
  { href: "/driver/trips", label: "Trips", Icon: MapPin },
  { href: "/driver/schedule", label: "Schedule", Icon: Calendar },
  { href: "/driver/messages", label: "Messages", Icon: MessageCircle },
  { href: "/driver/analytics", label: "Analytics", Icon: BarChart2 },
  { href: "/driver/vehicles", label: "Vehicles", Icon: Truck },
  { href: "/driver/reports", label: "Reports", Icon: FileText },
  { href: "/driver/support", label: "Support", Icon: HelpCircle },
];

export default function DriverSidebar() {
  return (
    <nav aria-label="Driver navigation" className="w-64 pr-4">
      <ul className="space-y-1">
        {items.map(({ href, label, Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground"
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
