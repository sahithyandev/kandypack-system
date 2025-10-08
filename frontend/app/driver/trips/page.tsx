import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AssignedTrips from "@/components/driver/assigned-trips";

export default function TripsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>All Trips</CardTitle>
        </CardHeader>
        <CardContent>
          <AssignedTrips />
        </CardContent>
      </Card>
    </div>
  );
}
