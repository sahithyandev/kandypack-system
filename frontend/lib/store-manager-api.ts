// API client for Store Manager endpoints
import { getToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000";

// ============================================================================
// Types
// ============================================================================

export interface IncomingDelivery {
  shipmentId: string;
  trainTripId: string;
  trainName: string;
  fromCity: string;
  scheduledArrival: string;
  orderCount: number;
  totalUnits: number;
}

export interface ScheduledTruckTrip {
  truckTripId: string;
  vehicleNo: string;
  routeName: string;
  driverName: string;
  assistantName: string | null;
  scheduledStart: string;
  status: string;
}

export interface InProgressTruckTrip {
  truckTripId: string;
  vehicleNo: string;
  driverName: string;
  actualStart: string;
  status: string;
}

export interface DispatchResponse {
  truckTripId: string;
  status: string;
  actualStart: string;
  message: string;
}

export interface CompleteResponse {
  truckTripId: string;
  status: string;
  actualEnd: string;
  message: string;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get incoming deliveries arriving at the manager's store
 */
export async function getIncomingDeliveries(): Promise<IncomingDelivery[]> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${BASE_URL}/api/stores/incoming-deliveries`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to fetch incoming deliveries" }));
    throw new Error(error.error || "Failed to fetch incoming deliveries");
  }

  return response.json();
}

/**
 * Get scheduled truck trips departing from the manager's store
 */
export async function getScheduledDepartures(): Promise<ScheduledTruckTrip[]> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${BASE_URL}/api/truck-trips/scheduled-departures`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to fetch scheduled departures" }));
    throw new Error(error.error || "Failed to fetch scheduled departures");
  }

  return response.json();
}

/**
 * Dispatch a truck trip (mark as In_Progress)
 */
export async function dispatchTruckTrip(tripId: string): Promise<DispatchResponse> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${BASE_URL}/api/truck-trips/${tripId}/dispatch`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to dispatch truck trip" }));
    throw new Error(error.error || "Failed to dispatch truck trip");
  }

  return response.json();
}

/**
 * Get in-progress truck trips
 */
export async function getInProgressTrips(): Promise<InProgressTruckTrip[]> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${BASE_URL}/api/truck-trips/in-progress`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to fetch in-progress trips" }));
    throw new Error(error.error || "Failed to fetch in-progress trips");
  }

  return response.json();
}

/**
 * Complete a truck trip
 */
export async function completeTruckTrip(tripId: string): Promise<CompleteResponse> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${BASE_URL}/api/truck-trips/${tripId}/complete`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to complete truck trip" }));
    throw new Error(error.error || "Failed to complete truck trip");
  }

  return response.json();
}
