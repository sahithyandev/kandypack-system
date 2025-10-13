"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Train, Calendar, Clock, MapPin, Package, CheckCircle2 } from "lucide-react";

// TODO: replace with API data
const incomingTrains = [
  {
    id: "TR-5501",
    origin: "Kandy",
    destination: "Colombo",
    depart: "2025-10-06 07:30",
    eta: "2025-10-06 11:10",
    maxCapacity: 500,
    usedSpace: 340,
    orders: [
      { id: "ORD-2024-002", customer: "Galle Retail Shop", boxes: 40, space: 23 },
      { id: "ORD-2024-005", customer: "Jaffna Store", boxes: 90, space: 60 },
    ],
    status: "arriving", // arriving | docked | unloaded
  },
  {
    id: "TR-5502",
    origin: "Kandy",
    destination: "Negombo",
    depart: "2025-10-06 09:10",
    eta: "2025-10-06 12:45",
    maxCapacity: 450,
    usedSpace: 180,
    orders: [{ id: "ORD-2024-003", customer: "Negombo Market", boxes: 50, space: 35 }],
    status: "docked",
  },
];

export default function IncomingDeliveriesPage() {
  const totals = useMemo(() => {
    const trains = incomingTrains.length;
    const orders = incomingTrains.reduce((a, t) => a + t.orders.length, 0);
    const capacity = incomingTrains.reduce((a, t) => a + t.maxCapacity, 0);
    const used = incomingTrains.reduce((a, t) => a + t.usedSpace, 0);
    return { trains, orders, capacity, used };
  }, []);

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      arriving: "bg-blue-100 text-blue-800 border-blue-200",
      docked: "bg-yellow-100 text-yellow-800 border-yellow-200",
      unloaded: "bg-green-100 text-green-800 border-green-200",
    };
    return map[s] ?? "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Incoming Deliveries</h2>
        <p className="text-muted-foreground">View arriving trains and confirm unload</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Incoming Trains</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totals.trains}</div><p className="text-xs text-muted-foreground mt-1">Today’s arrivals</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Orders Onboard</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totals.orders}</div><p className="text-xs text-muted-foreground mt-1">To be unloaded</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Capacity Used</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totals.used} / {totals.capacity}</div><p className="text-xs text-muted-foreground mt-1">Space units</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Unloaded Today</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">0</div><p className="text-xs text-muted-foreground mt-1">Confirmed by store</p></CardContent></Card>
      </div>

      <div className="space-y-3">
        {incomingTrains.map((t) => (
          <div key={t.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold">{t.id}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadge(t.status)}`}>
                  {t.status.toUpperCase()}
                </span>
              </div>
              <Button size="sm">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Confirm Unload
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm mt-3">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{t.origin} → {t.destination}</div>
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" />Depart: {t.depart}</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" />ETA: {t.eta}</div>
              <div className="flex items-center gap-2"><Package className="h-4 w-4 text-muted-foreground" />Capacity: {t.usedSpace}/{t.maxCapacity}</div>
            </div>

            <div className="flex flex-wrap gap-2 text-sm mt-3">
              {t.orders.map((o) => (
                <span key={o.id} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {o.id} • {o.customer} ({o.boxes} boxes)
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {incomingTrains.length === 0 && (
        <div className="text-center py-12">
          <Train className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">No incoming trains found</p>
        </div>
      )}
    </div>
  );
}
