"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDriverProfile, type DriverProfile } from "@/lib/driver-api";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import DriverHeader from "@/components/driver/driver-header";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const [a, b] = [parts[0]?.[0], parts[1]?.[0]];
  return (a ?? "").toUpperCase() + (b ?? "").toUpperCase();
}

export default function DriverProfilePage() {
  const [profile, setProfile] = React.useState<DriverProfile | null>(null);
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    getDriverProfile().then(setProfile).catch((e) => setError(e?.message ?? "Failed to load profile"));
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2 flex flex-col gap-6">
        <div className="mt-2 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Profile</h2>
          <DriverHeader />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <div className="text-destructive mb-2">{error}</div>}
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                {profile?.name ? (
                  initials(profile.name)
                ) : (
                  <User className="size-7" />
                )}
              </div>
              <div>
                <div className="text-xl font-semibold">{profile?.name ?? "Driver"}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  @{profile?.username ?? "username"}
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
              <div className="flex justify-between md:block"><dt className="text-muted-foreground">Status</dt><dd className="font-medium">{profile?.status ?? "-"}</dd></div>
              <div className="flex justify-between md:block"><dt className="text-muted-foreground">Hourly Pay</dt><dd className="font-medium">{profile ? `LKR ${profile.hourly_pay.toFixed(2)}` : "-"}</dd></div>
              <div className="flex justify-between md:block"><dt className="text-muted-foreground">Weekly Hours</dt><dd className="font-medium">{profile?.weekly_hours ?? "-"}</dd></div>
              <div className="flex justify-between md:block"><dt className="text-muted-foreground">Consecutive Deliveries</dt><dd className="font-medium">{profile?.consecutive_deliveries ?? "-"}</dd></div>
            </dl>
          </CardContent>
        </Card>
      </section>

      <aside className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Identifiers</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between"><dt className="text-muted-foreground">User ID</dt><dd className="font-medium">{profile?.id ?? "-"}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Worker ID</dt><dd className="font-medium">{profile?.worker_id ?? "-"}</dd></div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Coming soon…</p>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
