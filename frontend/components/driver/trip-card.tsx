"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function TripCard({ trip }: { trip: any }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border p-3">
      <div>
        <div className="font-medium">{trip.id} — {trip.cargo}</div>
        <div className="text-sm text-muted-foreground">{trip.origin} → {trip.destination}</div>
        <div className="text-xs text-muted-foreground">ETA: {new Date(trip.eta).toLocaleString()}</div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant={trip.status === 'enroute' ? 'destructive' : 'secondary'} size="sm">{trip.status}</Button>
        <Button variant="ghost" size="sm">Details</Button>
      </div>
    </div>
  );
}
