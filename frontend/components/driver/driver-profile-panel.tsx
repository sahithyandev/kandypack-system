"use client";

import * as React from "react";
import { getDriverProfile, type DriverProfile } from "@/lib/driver-api";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SidebarHeader, SidebarSeparator } from "@/components/ui/sidebar";
import { User } from "lucide-react";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const [a, b] = [parts[0]?.[0], parts[1]?.[0]];
  return (a ?? "").toUpperCase() + (b ?? "").toUpperCase();
}

export default function DriverProfilePanel() {
  const [profile, setProfile] = React.useState<DriverProfile | null>(null);
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    getDriverProfile()
      .then(setProfile)
      .catch((e) => setError(e?.message ?? "Failed to load profile"));
  }, []);

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
            {profile?.name ? (
              initials(profile.name)
            ) : (
              <User className="size-5" />
            )}
          </div>
          <div className="min-w-0">
            <div className="font-medium truncate">{profile?.name ?? "Driver"}</div>
            <div className="text-xs text-muted-foreground truncate flex items-center gap-2">
              <span>@{profile?.username ?? "username"}</span>
              {profile?.status && (
                <Badge
                  variant={profile.status === "Busy" ? "default" : profile.status === "Free" ? "secondary" : "outline"}
                  className={
                    profile.status === "Free"
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                      : profile.status === "Busy"
                        ? "bg-amber-100 text-amber-700 border-amber-200"
                        : ""
                  }
                >
                  {profile.status.replace("_", " ")}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <div className="px-3 py-2 text-sm">
        {error && <div className="text-destructive mb-2">{error}</div>}
        <dl className="space-y-1">
          <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd className="font-medium">{profile?.status ?? "-"}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Hourly Pay</dt><dd className="font-medium">{profile ? `LKR ${profile.hourly_pay.toFixed(2)}` : "-"}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Weekly Hours</dt><dd className="font-medium">{profile?.weekly_hours ?? "-"}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Consec. Deliveries</dt><dd className="font-medium">{profile?.consecutive_deliveries ?? "-"}</dd></div>
        </dl>
        <div className="mt-3">
          <Link href="/driver/profile" className="text-xs underline text-primary hover:opacity-80">
            View Profile
          </Link>
        </div>
      </div>
    </>
  );
}
