"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Truck } from "lucide-react";

// TODO: replace with API data
const deliveries = [
  { tripId: 88, orders: [{ id: "ORD-2024-012", customer: "Colombo Wholesale Store", status: "scheduled" }, { id: "ORD-2024-015", customer: "Galle Retail Shop", status: "in_truck_transit" }] },
  { tripId: 93, orders: [{ id: "ORD-2024-021", customer: "Negombo Market", status: "scheduled" }] },
];

export default function DeliveryConfirmPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Delivery Confirmation</h2>
        <p className="text-muted-foreground">Confirm delivered orders by trip</p>
      </div>

      <div className="space-y-6">
        {deliveries.map((g) => (
          <div key={g.tripId} className="border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Trip #{g.tripId}</h3>
              </div>
              <Button size="sm"><CheckCircle2 className="h-3 w-3 mr-1" />Mark Delivered</Button>
            </div>
            <ul className="mt-3 text-sm list-disc ml-6">
              {g.orders.map((r) => (<li key={r.id}>{r.id} • {r.customer} • status: {r.status}</li>))}
            </ul>
          </div>
        ))}
      </div>

      {deliveries.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">No deliveries awaiting confirmation</p>
        </div>
      )}
    </div>
  );
}
