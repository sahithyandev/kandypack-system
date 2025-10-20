"use client";

import { useEffect, useState } from "react";
import { getAllTrucks, type TruckSummary } from "@/lib/driver-api";

function StatusBadge({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  const cls =
    s === "available"
      ? "bg-green-100 text-green-700"
      : s === "busy"
      ? "bg-amber-100 text-amber-700"
      : s === "maintenance"
      ? "bg-gray-200 text-gray-700"
      : "bg-gray-200 text-gray-700";
  return <span className={`rounded px-2 py-0.5 text-xs capitalize ${cls}`}>{status}</span>;
}

export default function VehiclesList() {
  const [trucks, setTrucks] = useState<TruckSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    getAllTrucks()
      .then((list) => {
        if (!alive) return;
        setTrucks(list);
      })
      .catch((e: unknown) => {
        if (!alive) return;
        const message = e instanceof Error ? e.message : "Failed to load vehicles";
        setError(message);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <div className="text-sm text-muted-foreground">Loading vehicles…</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;

  if (!trucks.length) {
    return (
      <div className="flex flex-col gap-2">
        <div className="font-medium">No vehicles found</div>
        <div className="text-sm text-muted-foreground">Once vehicles are added to the system, they will appear here with their current status.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {trucks.map((t) => (
          <div key={t.id} className="rounded-md border p-3 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="font-medium">{t.vehicle_no}</div>
              <StatusBadge status={t.status} />
            </div>
            <div className="text-xs text-muted-foreground">Truck ID: {t.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
