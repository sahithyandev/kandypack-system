import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AssignedTrips from "@/components/driver/assigned-trips";
import VehicleInfo from "../../components/driver/vehicle-info";
import Performance from "../../components/driver/performance";
import Documents from "../../components/driver/documents";
import Support from "../../components/driver/support";

export default function DriverHome() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Assigned Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <AssignedTrips />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Map & Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/40 rounded-md flex items-center justify-center">
              Map placeholder
            </div>
          </CardContent>
        </Card>
      </section>

      <aside className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle</CardTitle>
          </CardHeader>
          <CardContent>
            <VehicleInfo />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Performance />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <Documents />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
          </CardHeader>
          <CardContent>
            <Support />
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
