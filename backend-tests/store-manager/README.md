# Store Manager API Testing

## Prerequisites

1. **Backend server running** on port 2000:
   ```bash
   cd backend
   bun run dev
   ```

2. **Database with sample data loaded**:
   ```bash
   # Make sure PostgreSQL is running
   # Sample data is in: db/init-scripts/7-sample-data.sql
   ```

## Test Data

The sample data includes:

### Store Manager Test User
- **Username**: `manager2`
- **Password**: `password123`
- **Role**: Worker (Store_Manager)
- **Manages**: Colombo Central Store (`store-cmb-01`)

### Test Data Created
- **2 Incoming shipments** arriving on trains from Kandy to Colombo
- **2 Scheduled truck trips** ready to be dispatched
- **1 In-progress truck trip** ready to be completed
- **3 At-Store orders** with shipments for truck delivery

## Running Tests

### Option 1: Automated Test Script

```bash
cd backend-tests/store-manager
./test-store-manager.sh
```

This will test all 5 Store Manager endpoints plus error cases.

### Option 2: Manual Testing with HTTP File

Open `store-manager.TESTING-GUIDE.http` in your IDE (VSCode with REST Client extension) and run each request manually.

### Option 3: Individual curl Commands

```bash
# 1. Login
curl -X POST http://localhost:2000/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"username": "manager2", "password": "password123"}'

# Copy the token from response, then use it in subsequent requests:

# 2. Get Incoming Deliveries
curl http://localhost:2000/api/stores/incoming-deliveries \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 3. Get Scheduled Departures
curl http://localhost:2000/api/truck-trips/scheduled-departures \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 4. Dispatch a Truck Trip
curl -X POST http://localhost:2000/api/truck-trips/trip-scheduled-001/dispatch \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 5. Get In-Progress Trips
curl http://localhost:2000/api/truck-trips/in-progress \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 6. Complete a Truck Trip
curl -X POST http://localhost:2000/api/truck-trips/trip-in-progress-001/complete \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Expected Results

### GET /api/stores/incoming-deliveries
Returns 2 shipments arriving on trains from Kandy

### GET /api/truck-trips/scheduled-departures
Returns 2 scheduled truck trips

### POST /api/truck-trips/:tripId/dispatch
- Updates trip status to `In_Progress`
- Sets `actual_start` timestamp
- Marks workers as `Busy`
- Returns dispatch confirmation

### GET /api/truck-trips/in-progress
Returns all in-progress trips (including newly dispatched ones)

### POST /api/truck-trips/:tripId/complete
- Updates trip status to `Completed`
- Sets `actual_end` timestamp
- Logs worker hours in `Worker_Record`
- Marks workers as `Free`
- Returns completion confirmation

## Troubleshooting

### "Login failed" or Connection Errors
- Ensure backend server is running on port 2000
- Check database connection is working
- Verify sample data is loaded

### "No store found for this manager"
- Check that `manager2` user exists in database
- Verify `Store` table has `managed_by = '0199e825-4ae5-7000-9d86-8be81708d4f1'` for Colombo store

### "Truck trip not found"
- Ensure sample data is properly loaded
- Check that truck trips exist in database
- Verify trip IDs match those in sample data

### Duplicate Key Errors
- Drop and recreate database tables
- Reload all init scripts in order (1-types.sql through 7-sample-data.sql)

## Database Verification Queries

```sql
-- Check Store Manager's store
SELECT s.id, s.name, s.city_id, u.username
FROM Store s
JOIN Store_Manager sm ON s.managed_by = sm.id
JOIN "User" u ON sm.id = u.id
WHERE u.username = 'manager2';

-- Check incoming shipments
SELECT s.id, tt.id as train_trip_id, t.name, 
       c1.name as from_city, tt.scheduled_arrival
FROM Shipment s
JOIN Train_Trip tt ON s.train_trip_id = tt.id
JOIN Train t ON tt.train_id = t.id
JOIN City c1 ON tt.from_city_id = c1.id
WHERE tt.to_city_id = 'city-cmb'
AND tt.scheduled_arrival > NOW();

-- Check scheduled truck trips
SELECT tt.id, tr.vehicle_no, r.name as route, 
       u.name as driver, tt.status
FROM Truck_Trip tt
JOIN Truck tr ON tt.truck_id = tr.id
JOIN Route r ON tt.route_id = r.id
JOIN Worker w ON tt.driver_id = w.id
JOIN "User" u ON w.id = u.id
WHERE tt.status = 'Scheduled'
LIMIT 5;
```
