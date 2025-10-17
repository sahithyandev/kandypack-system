# Dispatcher API Module

This module provides RESTful API endpoints for the Dispatcher Dashboard to manage orders, train trips, truck trips, and shipments.

## Authentication

All endpoints require authentication with a valid JWT token and the **Dispatcher** worker role.

**Headers Required:**
```
Authorization: Bearer <JWT_TOKEN>
```

## Endpoints

### 1. Pending Orders

#### `GET /api/orders/pending`
Retrieves all orders with "Pending" status awaiting scheduling.

**Response:** `200 OK`
```json
[
  {
    "orderId": "ord-002",
    "customerName": "Keells Super",
    "destinationCity": "Colombo",
    "placedOn": "2025-10-14T10:00:00Z",
    "requiredDeliveryDate": "2025-10-22",
    "totalValue": 36000.00,
    "totalSpaceUnits": 90.0
  }
]
```

---

### 2. Train Scheduling

#### `GET /api/train-trips?destinationCityId={cityId}`
Retrieves scheduled train trips with capacity information.

**Query Parameters:**
- `destinationCityId` (optional): Filter trips by destination city

**Response:** `200 OK`
```json
[
  {
    "trainTripId": "tt-k2c-20251020",
    "trainName": "Udarata Menike",
    "fromCity": "Kandy",
    "toCity": "Colombo",
    "scheduledDeparture": "2025-10-20T08:00:00Z",
    "scheduledArrival": "2025-10-20T12:00:00Z",
    "capacityUnits": 500,
    "allocatedUnits": 50,
    "availableUnits": 450
  }
]
```

#### `POST /api/shipments`
Creates a shipment by assigning an order to a train trip.

**Request Body:**
```json
{
  "orderId": "ord-002",
  "trainTripId": "tt-k2c-20251020"
}
```

**Response:** `201 Created`
```json
{
  "shipmentId": "ship-002",
  "orderId": "ord-002",
  "trainTripId": "tt-k2c-20251020",
  "status": "Pending",
  "message": "Shipment created successfully. Order status updated to In_Train_Transit."
}
```

**Business Logic:**
- Creates Shipment record
- Updates Order status to `In_Train_Transit`
- Updates Train_Trip allocated_units
- Validates capacity availability

**Error Responses:**
- `400`: Order not pending, insufficient capacity
- `404`: Order or train trip not found

---

### 3. Truck Scheduling

#### `GET /api/shipments/at-store?storeId={storeId}`
Retrieves shipments at store ready for truck delivery.

**Query Parameters:**
- `storeId` (optional): Filter by specific store

**Response:** `200 OK`
```json
[
  {
    "shipmentId": "ship-001",
    "orderId": "ord-001",
    "customerName": "Lanka Sathosa",
    "deliveryAddress": "Sathosa Head Office, Colombo 2",
    "routeId": "route-cmb-01",
    "routeName": "Colombo Fort Area"
  }
]
```

#### `GET /api/resources/available`
Retrieves all available drivers, assistants, and trucks.

**Response:** `200 OK`
```json
{
  "drivers": [
    { "workerId": "user-drv-01", "name": "Ajith Bandara" }
  ],
  "assistants": [
    { "workerId": "user-ast-01", "name": "Kasun Jayasuriya" }
  ],
  "trucks": [
    { "truckId": "truck-01", "vehicleNo": "CBA-1234" }
  ]
}
```

#### `POST /api/truck-trips`
Schedules a new truck trip.

**Request Body:**
```json
{
  "shipmentId": "ship-001",
  "truckId": "truck-01",
  "routeId": "route-cmb-01",
  "driverId": "user-drv-01",
  "assistantId": "user-ast-01",
  "scheduledStart": "2025-10-21T10:00:00Z",
  "scheduledEnd": "2025-10-21T14:00:00Z"
}
```

**Response:** `201 Created`
```json
{
  "truckTripId": "trip-001",
  "status": "Scheduled",
  "message": "Truck trip scheduled successfully."
}
```

**Business Rules (Validated by DB Triggers):**
- Driver/Assistant must have status 'Free'
- Weekly hour limits enforced (Driver: 40h, Assistant: 60h)
- Consecutive trip limits (Driver: 1, Assistant: 2)

**Error Responses:**
- `400`: Business rule violation (e.g., "Driver cannot be scheduled for consecutive deliveries")

---

### 4. Schedule Overview

#### `GET /api/schedules/overview`
Retrieves comprehensive overview of all scheduled activities.

**Response:** `200 OK`
```json
{
  "trainTrips": [
    {
      "trainTripId": "tt-k2c-20251020",
      "trainName": "Udarata Menike",
      "toCity": "Colombo",
      "scheduledDeparture": "2025-10-20T08:00:00Z",
      "status": "Scheduled",
      "shipmentCount": 5
    }
  ],
  "truckTrips": [
    {
      "truckTripId": "trip-001",
      "vehicleNo": "CBA-1234",
      "routeName": "Colombo Fort Area",
      "driverName": "Ajith Bandara",
      "scheduledStart": "2025-10-21T10:00:00Z",
      "status": "Scheduled"
    }
  ]
}
```

---

## Testing

Use the HTTP test files in `/backend-tests/` directory:
- `dispatcher.pending-orders.http`
- `dispatcher.train-scheduling.http`
- `dispatcher.truck-scheduling.http`
- `dispatcher.overview.http`

**Note:** Replace `YOUR_JWT_TOKEN_HERE` with a valid JWT token from dispatcher login.

## Module Structure

```
dispatcher/
├── index.ts      # Controller - HTTP routes and validation
├── service.ts    # Business logic and database queries
├── model.ts      # Type definitions and schemas
└── README.md     # This file
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message describing the issue"
}
```

**Common Status Codes:**
- `200` - Success (GET requests)
- `201` - Created (POST requests)
- `400` - Bad Request (validation errors, business rule violations)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (not a dispatcher)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error
