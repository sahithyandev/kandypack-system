"use client";
import React from "react";

export default function DashboardStats({ data }: { data?: any }) {
  const stats = data ?? {
    totalTrips: 342,
    distanceKm: 48230,
    drivingHours: 1240,
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-md border p-3">
        <div className="text-sm text-muted-foreground">Total trips</div>
        <div className="text-2xl font-semibold">{stats.totalTrips}</div>
      </div>
      <div className="rounded-md border p-3">
        <div className="text-sm text-muted-foreground">Distance driven (km)</div>
        <div className="text-2xl font-semibold">{new Intl.NumberFormat("en-US").format(stats.distanceKm)}</div>
      </div>
      <div className="rounded-md border p-3">
        <div className="text-sm text-muted-foreground">Driving hours</div>
        <div className="text-2xl font-semibold">{stats.drivingHours}</div>
      </div>
    </div>
  );
}
