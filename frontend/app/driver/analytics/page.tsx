import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-56 flex items-center justify-center text-muted-foreground">Analytics placeholder</div>
      </CardContent>
    </Card>
  );
}
