"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Train, Calendar, Clock, MapPin, Package, Loader2, AlertCircle } from "lucide-react";
import { getIncomingDeliveries, type IncomingDelivery } from "@/lib/store-manager-api";

export default function IncomingDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<IncomingDelivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getIncomingDeliveries();
      setDeliveries(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load incoming deliveries";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  const totals = useMemo(() => {
    const shipments = deliveries.length;
    const orders = deliveries.reduce((a, d) => a + d.orderCount, 0);
    const units = deliveries.reduce((a, d) => a + d.totalUnits, 0);
    return { shipments, orders, units };
  }, [deliveries]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Incoming Deliveries</h2>
          <p className="text-muted-foreground">View arriving trains and confirm unload</p>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
            <Button onClick={loadData} className="mt-4" variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Incoming Deliveries</h2>
        <p className="text-muted-foreground">View arriving trains and confirm unload</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Incoming Shipments</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totals.shipments}</div><p className="text-xs text-muted-foreground mt-1">Arriving soon</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Total Orders</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totals.orders}</div><p className="text-xs text-muted-foreground mt-1">To be received</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Space Units</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totals.units.toFixed(1)}</div><p className="text-xs text-muted-foreground mt-1">Total capacity</p></CardContent></Card>
      </div>

      <div className="space-y-3">
        {deliveries.map((delivery) => (
          <div key={delivery.shipmentId} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <Train className="h-5 w-5 text-primary" />
                <span className="font-semibold">{delivery.trainName}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-blue-100 text-blue-800 border-blue-200">
                  IN TRANSIT
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm mt-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                From {delivery.fromCity}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                ETA: {formatDate(delivery.scheduledArrival)}
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                {delivery.orderCount} {delivery.orderCount === 1 ? "order" : "orders"} • {delivery.totalUnits.toFixed(1)} units
              </div>
            </div>

            <div className="mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Shipment ID: {delivery.shipmentId}</span>
                <span>•</span>
                <span>Train Trip: {delivery.trainTripId}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {deliveries.length === 0 && (
        <div className="text-center py-12">
          <Train className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">No incoming deliveries found</p>
        </div>
      )}
    </div>
  );
}
