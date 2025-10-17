# Store Manager Frontend

This directory contains all frontend pages for the Store Manager Dashboard in the Kandypack system.

## Overview

The Store Manager Dashboard enables store managers to:
1. **View incoming deliveries** arriving by train
2. **Dispatch truck trips** that are scheduled to depart
3. **Confirm delivery completion** for in-progress trips

## Pages

### 1. Incoming Deliveries (`/store-manager/incoming`)
**Purpose**: View shipments arriving on trains at the manager's store

**Features**:
- Displays incoming shipments with train information
- Shows scheduled arrival times
- Lists order count and space units per shipment
- Real-time data from backend API

**API Used**: `GET /api/stores/incoming-deliveries`

### 2. Truck Dispatch (`/store-manager/dispatch`)
**Purpose**: Dispatch scheduled truck trips

**Features**:
- Lists all scheduled truck trips ready to depart
- Shows vehicle, driver, assistant, and route information
- Search/filter functionality
- One-click dispatch button
- Real-time updates after dispatch

**API Used**: 
- `GET /api/truck-trips/scheduled-departures`
- `POST /api/truck-trips/:tripId/dispatch`

### 3. Delivery Confirmation (`/store-manager/confirm`)
**Purpose**: Mark in-progress trips as completed

**Features**:
- Displays all trips currently in progress
- Shows driver and start time information
- Confirmation dialog before completing
- Calls stored procedure to log worker hours

**API Used**:
- `GET /api/truck-trips/in-progress`
- `POST /api/truck-trips/:tripId/complete`

## Authentication

All pages are protected by the Store Manager layout which:
- Validates JWT token exists
- Checks user has `role: "Worker"` and `workerType: "Store_Manager"`
- Redirects unauthorized users to home page
- Shows loading spinner during authentication check

## Layout Structure

```
(store-manager)/
├── layout.tsx              # Protected layout with sidebar navigation
└── store-manager/
    ├── incoming/
    │   └── page.tsx       # Incoming Deliveries page
    ├── dispatch/
    │   └── page.tsx       # Truck Dispatch page
    └── confirm/
        └── page.tsx       # Delivery Confirmation page
```

## API Client

Located at `/lib/store-manager-api.ts`, provides typed functions for all endpoints:

```typescript
- getIncomingDeliveries(): Promise<IncomingDelivery[]>
- getScheduledDepartures(): Promise<ScheduledTruckTrip[]>
- dispatchTruckTrip(tripId: string): Promise<DispatchResponse>
- getInProgressTrips(): Promise<InProgressTruckTrip[]>
- completeTruckTrip(tripId: string): Promise<CompleteResponse>
```

## Common Features

All pages include:
- ✅ **Loading states** with `Loader2` spinner
- ✅ **Error handling** with retry functionality
- ✅ **Mobile responsive** design
- ✅ **Real-time data** from PostgreSQL via backend API
- ✅ **Type safety** with TypeScript
- ✅ **Modern UI** with shadcn/ui components

## Routing

Home page (`/`) automatically redirects Store Managers to `/store-manager/incoming` after login.

## Test User

**Username**: `manager2`  
**Password**: `password123`  
**Role**: Worker (Store_Manager)  
**Manages**: Colombo Central Store

## Backend Integration

All pages are fully connected to the Elysia.js backend running on port 2000. The backend:
- Validates JWT tokens
- Enforces Store Manager role
- Filters data by manager's assigned store
- Calls PostgreSQL stored procedures for trip lifecycle management

## Development

To run the frontend:
```bash
cd frontend
bun install
bun run dev
```

Make sure the backend server is running on port 2000.

## Future Enhancements

Potential improvements:
- Real-time notifications for new incoming deliveries
- Trip history and analytics
- Print delivery manifests
- Mobile app version
- Offline support with service workers
