"use client";

import * as React from "react";
import { getDriverProfile } from "@/lib/driver-api";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const [a, b] = [parts[0]?.[0], parts[1]?.[0]];
  return (a ?? "").toUpperCase() + (b ?? "").toUpperCase();
}

export default function DriverHeader() {
  const [name, setName] = React.useState<string>("");
  const [status, setStatus] = React.useState<"Busy" | "Free" | "On_Leave" | "">("");
  React.useEffect(() => {
    getDriverProfile()
      .then((p) => {
        setName(p.name);
        setStatus(p.status);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex items-center gap-3">
      {/* <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
        {name ? (
          initials(name)
        ) : (
          <User className="size-5" />
        )}
      </div> */}
      <div className="flex flex-col">
        {/* <span className="text-xl font-semibold leading-none">{name || "Driver"}</span> */}
        {status && (
          <div className="mt-1">
            <Badge
              variant={status === "Busy" ? "default" : status === "Free" ? "secondary" : "outline"}
              className={
                status === "Free"
                  ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                  : status === "Busy"
                    ? "bg-amber-100 text-amber-700 border-amber-200"
                    : status === "On_Leave"
                      ? "bg-slate-100 text-slate-700 border-slate-200"
                      : ""
              }
            >
              {status.replace("_", " ")}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
