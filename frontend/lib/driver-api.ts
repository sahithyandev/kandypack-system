export type DriverProfile = {
  id: string;
  username: string;
  name: string;
  worker_id: string;
  status: "Busy" | "Free" | "On_Leave";
  consecutive_deliveries: number;
  hourly_pay: number;
  weekly_hours: number;
};

const BACKEND_BASE = "http://backend:2000"; // keep consistent with generated client

export async function getDriverProfile(init?: RequestInit): Promise<DriverProfile> {
  const res = await fetch(`${BACKEND_BASE}/driver/profile`, {
    credentials: "include",
    ...init,
  });
  if (!res.ok) throw new Error(`Failed to load profile (${res.status})`);
  return res.json();
}
