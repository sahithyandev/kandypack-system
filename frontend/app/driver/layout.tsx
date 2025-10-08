import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Driver Dashboard",
  description: "Dashboard for drivers - assigned trips, vehicle info and tasks",
};

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Driver Dashboard</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
