"use client";
import React from "react";
import TripCard from "./trip-card";

const sampleTrips = [
  {
    id: "TRIP-001",
    status: "enroute",
    origin: "Warehouse A",
    destination: "Station B",
    eta: "2025-10-09T14:30:00Z",
    cargo: "Containers",
  },
  {
    id: "TRIP-002",
    status: "scheduled",
    origin: "Depot C",
    destination: "Warehouse D",
    eta: "2025-10-10T09:00:00Z",
    cargo: "Pallets",
  },
];

export default function AssignedTrips() {
  return (
    <div className="flex flex-col gap-3">
      {sampleTrips.map((t) => (
        <TripCard key={t.id} trip={t} />
      ))}
    </div>
  );
}
