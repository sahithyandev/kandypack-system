"use client";
import React from "react";

const sample = [
  { id: "TRIP-002", time: "09:00", route: "Depot C → Warehouse D" },
  { id: "TRIP-003", time: "13:30", route: "Warehouse A → Station E" },
];

export default function Schedule() {
  return (
    <div className="rounded-md border p-3">
      <div className="text-sm text-muted-foreground">Upcoming schedule</div>
      <ul className="mt-2 space-y-2 text-sm">
        {sample.map((s) => (
          <li key={s.id} className="flex justify-between">
            <span>{s.id}</span>
            <span className="text-muted-foreground">{s.time} — {s.route}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
