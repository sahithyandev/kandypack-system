# Store Manager API Module

This module handles all API endpoints for the Store Manager Dashboard in the Kandypack system.

## Authentication

All endpoints require:
- Valid JWT token with `role: "Worker"` and `workerType: "Store_Manager"`
- The backend automatically infers the `storeId` from the logged-in user's profile

## Endpoints

### 1. Incoming Deliveries

**GET** `/api/stores/incoming-deliveries`

Retrieves all shipments on trains scheduled to arrive at the manager's store.

**Response:**
```json
[
  {
    "shipmentId": "ship-001",
    "trainTripId": "tt-k2c-20251020",
    "trainName": "Udarata Menike",
    "fromCity": "Kandy",
    "scheduledArrival": "2025-10-20T12:00:00Z",
    "orderCount": 1,
    "totalUnits": 250.5
  }
]
```

### 2. Scheduled Departures

**GET** `/api/truck-trips/scheduled-departures`

Fetches all truck trips scheduled to depart from the manager's store.

**Response:**
```json
[
  {
    "truckTripId": "trip-001",
    "vehicleNo": "CBA-1234",
    "routeName": "Colombo Fort Area",
    "driverName": "Ajith Bandara",
    "assistantName": "Kasun Jayasuriya",
    "scheduledStart": "2025-10-21T10:00:00Z",
    "status": "Scheduled"
  }
]
```

### 3. Dispatch Truck Trip

**POST** `/api/truck-trips/{tripId}/dispatch`

Confirms the actual departure of a truck trip by calling the `start_truck_trip` stored procedure.

**Response:**
```json
{
  "truckTripId": "trip-001",
  "status": "In_Progress",
  "actualStart": "2025-10-21T10:05:21Z",
  "message": "Truck trip for vehicle CBA-1234 has been dispatched."
}
```

### 4. In-Progress Trips

**GET** `/api/truck-trips/in-progress`

Retrieves all truck trips currently in progress from the manager's store.

**Response:**
```json
[
  {
    "truckTripId": "trip-001",
    "vehicleNo": "CBA-1234",
    "driverName": "Ajith Bandara",
    "actualStart": "2025-10-21T10:05:21Z",
    "status": "In_Progress"
  }
]
```

### 5. Complete Truck Trip

**POST** `/api/truck-trips/{tripId}/complete`

Marks a truck trip as completed by calling the `complete_truck_trip` stored procedure. This:
- Updates trip status to "Completed"
- Logs worker hours in Worker_Record
- Resets worker statuses to "Free"

**Response:**
```json
{
  "truckTripId": "trip-001",
  "status": "Completed",
  "actualEnd": "2025-10-21T13:45:10Z",
  "message": "Trip completed. Worker hours have been logged."
}
```

## Module Structure

```
store-manager/
├── index.ts      # Controller - HTTP routing and request validation
├── service.ts    # Service layer - Business logic
├── model.ts      # Type definitions and validation schemas
└── README.md     # This file
```

## Database Procedures Used

- **`start_truck_trip(trip_id)`** - Updates trip status to In_Progress, sets actual_start, marks workers as Busy
- **`complete_truck_trip(trip_id)`** - Updates trip status to Completed, logs worker hours, marks workers as Free

## Security

- All endpoints verify that the truck trip belongs to the authenticated manager's store
- Authorization is enforced through the `requireStoreManager` middleware
- Store ID is automatically inferred from the authenticated user's profile
