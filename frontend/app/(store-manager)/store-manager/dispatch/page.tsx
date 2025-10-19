"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck, Search, Loader2, AlertCircle, Calendar, Clock, User } from "lucide-react";
import { getScheduledDepartures, dispatchTruckTrip, type ScheduledTruckTrip } from "@/lib/store-manager-api";

export default function StoreDispatchPage() {
  const [trips, setTrips] = useState<ScheduledTruckTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [dispatching, setDispatching] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getScheduledDepartures();
      setTrips(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load scheduled departures";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDispatch(tripId: string) {
    try {
      setDispatching(tripId);
      await dispatchTruckTrip(tripId);
      await loadData(); // Reload to remove dispatched trip
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to dispatch trip";
      alert(message);
    } finally {
      setDispatching(null);
    }
  }

  const filteredTrips = trips.filter(t => 
    t.routeName.toLowerCase().includes(filter.toLowerCase()) ||
    t.vehicleNo.toLowerCase().includes(filter.toLowerCase()) ||
    t.driverName.toLowerCase().includes(filter.toLowerCase())
  );

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
          <h2 className="text-3xl font-bold tracking-tight">Truck Dispatch</h2>
          <p className="text-muted-foreground">Dispatch scheduled truck trips</p>
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
        <h2 className="text-3xl font-bold tracking-tight">Truck Dispatch</h2>
        <p className="text-muted-foreground">Create trips and assign orders to trucks</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Scheduled Trips</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{trips.length}</div><p className="text-xs text-muted-foreground mt-1">Ready to dispatch</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Filtered Results</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{filteredTrips.length}</div><p className="text-xs text-muted-foreground mt-1">Matching your search</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <CardTitle>Scheduled Departures</CardTitle>
              <CardDescription>Dispatch trucks that are ready to leave</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Filter trips..." 
                className="pl-10 w-full md:w-[250px]" 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)} 
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTrips.map((trip) => (
              <div key={trip.truckTripId} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Truck className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{trip.vehicleNo}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-yellow-100 text-yellow-800 border-yellow-200">
                      {trip.status}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleDispatch(trip.truckTripId)}
                    disabled={dispatching === trip.truckTripId}
                  >
                    {dispatching === trip.truckTripId ? (
                      <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Dispatching...</>
                    ) : (
                      "Dispatch Now"
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm mt-3">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    Route: {trip.routeName}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Driver: {trip.driverName}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Assistant: {trip.assistantName || "None"}
                  </div>
                </div>

                <div className="mt-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Scheduled: {formatDate(trip.scheduledStart)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTrips.length === 0 && (
            <div className="text-center py-12">
              <Truck className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No scheduled trips found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
