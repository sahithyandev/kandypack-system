"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Truck, Users, UserCheck, Search, Plus } from "lucide-react";

// TODO: replace with API data
const trucks = [
  { id: "TRK-001", vehicleNo: "NC-5678", status: "available", capacity: 120 },
  { id: "TRK-003", vehicleNo: "NC-3456", status: "available", capacity: 100 },
];
const drivers = [
  { id: "DRV-002", name: "K. Perera", status: "available" },
  { id: "DRV-004", name: "S. Jayawardena", status: "available" },
];
const assistants = [
  { id: "AST-003", name: "T. Gunasekara", status: "available" },
  { id: "AST-004", name: "N. Wijesinghe", status: "available" },
];
const routeBatches = [
  { routeId: 12, routeName: "Colombo City", pendingOrders: [{ id: "ORD-2024-012", boxes: 30, space: 20 }, { id: "ORD-2024-015", boxes: 25, space: 15 }] },
  { routeId: 18, routeName: "Galle Town",   pendingOrders: [{ id: "ORD-2024-021", boxes: 40, space: 28 }] },
];

const statusBadge = (s: string) => {
  const map: Record<string, string> = { available: "bg-green-100 text-green-800 border-green-200" };
  return map[s] ?? "bg-gray-100 text-gray-800 border-gray-200";
};

export default function StoreDispatchPage() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<any>(null);

  const stats = useMemo(() => {
    const pending = routeBatches.reduce((acc, b) => acc + b.pendingOrders.length, 0);
    const availTrucks = trucks.filter(t => t.status === "available").length;
    const availDrivers = drivers.filter(d => d.status === "available").length;
    const availAssist = assistants.filter(a => a.status === "available").length;
    return { pending, availTrucks, availDrivers, availAssist };
  }, []);

  const filteredBatches = routeBatches.filter(b => b.routeName.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Truck Dispatch</h2>
        <p className="text-muted-foreground">Create trips and assign orders to trucks</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Pending Orders</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.pending}</div><p className="text-xs text-muted-foreground mt-1">To be dispatched</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Available Trucks</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.availTrucks}</div><p className="text-xs text-muted-foreground mt-1">Ready for trips</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Drivers Available</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.availDrivers}</div><p className="text-xs text-muted-foreground mt-1">Roster compliant</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Assistants Available</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.availAssist}</div><p className="text-xs text-muted-foreground mt-1">Roster compliant</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <CardTitle>Route Batches</CardTitle>
              <CardDescription>Select a route and dispatch orders</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Filter routes..." className="pl-10 w-full md:w-[250px]" value={filter} onChange={(e) => setFilter(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredBatches.map((b) => (
              <div key={b.routeId} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{b.routeName}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-gray-100 text-gray-800">
                        {b.pendingOrders.length} orders
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Route #{b.routeId}</p>
                  </div>

                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => setSelectedRoute(b)}>
                        <Plus className="h-3 w-3 mr-1" />
                        Create Trip
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>New Trip • {selectedRoute?.routeName ?? b.routeName}</DialogTitle>
                      </DialogHeader>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="border rounded-lg p-3">
                          <p className="text-sm font-medium mb-2">Trucks</p>
                          <div className="space-y-2">
                            {trucks.map(t => (
                              <div key={t.id} className="flex items-center justify-between text-sm">
                                <div>
                                  <div className="font-medium">{t.id} • {t.vehicleNo}</div>
                                  <div className="text-muted-foreground text-xs">Capacity {t.capacity}</div>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadge(t.status)}`}>{t.status}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="border rounded-lg p-3">
                          <p className="text-sm font-medium mb-2">Crew</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div><div className="font-medium">{drivers[0].name}</div><div className="text-muted-foreground text-xs">Driver</div></div>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadge(drivers[0].status)}`}>{drivers[0].status}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div><div className="font-medium">{assistants[0].name}</div><div className="text-muted-foreground text-xs">Assistant</div></div>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadge(assistants[0].status)}`}>{assistants[0].status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end"><Button onClick={() => setOpen(false)}>Save Trip</Button></div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="mt-3 text-sm space-y-2">
                  {b.pendingOrders.map((o) => (
                    <div key={o.id} className="flex items-center justify-between border rounded-md px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{o.id}</span>
                        <span className="text-muted-foreground">• {o.boxes} boxes, space {o.space}</span>
                      </div>
                      <Button size="sm" variant="outline">Assign to Trip</Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
