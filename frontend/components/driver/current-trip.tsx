"use client";
import React from "react";

export default function CurrentTrip({ trip }: { trip?: any }) {
  const t = trip ?? {
    id: "TRIP-001",
    origin: "Warehouse A",
    destination: "Station B",
    eta: "2025-10-09T14:30:00Z",
    status: "enroute",
  };

  return (
    <div className="rounded-md border p-3">
      <div className="text-sm text-muted-foreground">Current trip</div>
      <div className="mt-2">
        <div className="font-medium">{t.id} — {t.status}</div>
        <div className="text-sm text-muted-foreground">{t.origin} → {t.destination}</div>
        <div className="text-xs text-muted-foreground">ETA: {new Date(t.eta).toISOString()}</div>
      </div>
    </div>
  );
}
