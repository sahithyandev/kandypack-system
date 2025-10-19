"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Truck, Loader2, AlertCircle, User, Clock } from "lucide-react";
import { getInProgressTrips, completeTruckTrip, type InProgressTruckTrip } from "@/lib/store-manager-api";

export default function DeliveryConfirmPage() {
  const [trips, setTrips] = useState<InProgressTruckTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getInProgressTrips();
      setTrips(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load in-progress trips";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleComplete(tripId: string) {
    if (!confirm("Are you sure you want to mark this trip as completed?")) {
      return;
    }
    
    try {
      setCompleting(tripId);
      await completeTruckTrip(tripId);
      await loadData(); // Reload to remove completed trip
      alert("Trip completed successfully!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to complete trip";
      alert(message);
    } finally {
      setCompleting(null);
    }
  }

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
          <h2 className="text-3xl font-bold tracking-tight">Delivery Confirmation</h2>
          <p className="text-muted-foreground">Confirm completed deliveries</p>
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
        <h2 className="text-3xl font-bold tracking-tight">Delivery Confirmation</h2>
        <p className="text-muted-foreground">Confirm delivered orders by trip</p>
      </div>

      <div className="space-y-4">
        {trips.map((trip) => (
          <div key={trip.truckTripId} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <Truck className="h-5 w-5 text-primary" />
                <span className="font-semibold">{trip.vehicleNo}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-blue-100 text-blue-800 border-blue-200">
                  {trip.status}
                </span>
              </div>
              <Button 
                size="sm"
                onClick={() => handleComplete(trip.truckTripId)}
                disabled={completing === trip.truckTripId}
              >
                {completing === trip.truckTripId ? (
                  <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Completing...</>
                ) : (
                  <><CheckCircle2 className="h-3 w-3 mr-1" />Mark Complete</>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mt-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Driver: {trip.driverName}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Started: {formatDate(trip.actualStart)}
              </div>
            </div>

            <div className="mt-3 text-xs text-muted-foreground">
              Trip ID: {trip.truckTripId}
            </div>
          </div>
        ))}
      </div>

      {trips.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">No trips in progress</p>
          <p className="text-sm text-muted-foreground mt-1">Completed trips will be removed from this list</p>
        </div>
      )}
    </div>
  );
}
