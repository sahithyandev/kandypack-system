import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Schedule from "@/components/driver/schedule";

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Schedule />
        </CardContent>
      </Card>
    </div>
  );
}
