export type DriverProfile = {
  id: string;
  username: string;
  name: string;
  worker_id: string;
  status: "Busy" | "Free" | "On_Leave";
  consecutive_deliveries: number;
  total_trips: number;
  daily_driving_distance: number;
  daily_driving_time: number;
  cumulative_distance: number;
  cumulative_time: number;
  hourly_pay: number;
  weekly_hours: number;
};

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL_CLIENT || "http://localhost:2000"; // keep consistent with generated client

export async function getDriverProfile(init?: RequestInit): Promise<DriverProfile> {
  const res = await fetch(`${BACKEND_BASE}/driver/profile`, {
    credentials: "include",
    ...init,
  });
  if (!res.ok) throw new Error(`Failed to load profile (${res.status})`);
  return res.json();
}

export type DriverVehicleInfo = {
  id: string; // truck id
  vehicle_no: string; // plate
  truck_status: string; // busy | available | maintenance
  next_trip: null | {
    id: string;
    status: "Scheduled" | "In_Progress" | "Completed" | "Cancelled";
    scheduled_start: string;
    scheduled_end: string | null;
  };
  last_completed_trip_end: string | null;
  total_trips_with_vehicle: number;
};

export async function getDriverVehicle(init?: RequestInit): Promise<DriverVehicleInfo> {
  const res = await fetch(`${BACKEND_BASE}/driver/vehicle`, {
    credentials: "include",
    ...init,
  });
  if (!res.ok) throw new Error(`Failed to load vehicle (${res.status})`);
  return res.json();
}

export type TruckSummary = {
  id: string;
  vehicle_no: string;
  status: string; // busy | available | maintenance
};

export async function getAllTrucks(init?: RequestInit): Promise<TruckSummary[]> {
  const res = await fetch(`${BACKEND_BASE}/driver/vehicles`, {
    credentials: "include",
    ...init,
  });
  if (!res.ok) throw new Error(`Failed to load trucks (${res.status})`);
  return res.json();
}
