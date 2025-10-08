import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import VehicleInfo from "@/components/driver/vehicle-info";

export default function VehiclesPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleInfo />
        </CardContent>
      </Card>
    </div>
  );
}
