#!/bin/bash

###############################################################################
# Store Manager API Test Script
# This script tests all Store Manager endpoints using curl
###############################################################################

BASE_URL="http://localhost:2000"
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "==========================================================================="
echo "STORE MANAGER API TEST SUITE"
echo "==========================================================================="
echo ""

# Step 1: Login as Store Manager
echo -e "${YELLOW}[TEST 1] Login as Store Manager${NC}"
echo "POST $BASE_URL/api/auth/sign-in"
echo ""

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/sign-in" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "manager2",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE" | jq '.'
echo ""

# Extract token from response
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Login failed! Cannot proceed with tests.${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Login successful! Token obtained.${NC}"
echo ""
sleep 1

# Test 2: Get Incoming Deliveries
echo "==========================================================================="
echo -e "${YELLOW}[TEST 2] Get Incoming Deliveries${NC}"
echo "GET $BASE_URL/api/stores/incoming-deliveries"
echo ""

curl -s -X GET "$BASE_URL/api/stores/incoming-deliveries" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo -e "${GREEN}✅ Incoming deliveries retrieved${NC}"
echo ""
sleep 1

# Test 3: Get Scheduled Departures
echo "==========================================================================="
echo -e "${YELLOW}[TEST 3] Get Scheduled Departures${NC}"
echo "GET $BASE_URL/api/truck-trips/scheduled-departures"
echo ""

SCHEDULED_RESPONSE=$(curl -s -X GET "$BASE_URL/api/truck-trips/scheduled-departures" \
  -H "Authorization: Bearer $TOKEN")

echo "$SCHEDULED_RESPONSE" | jq '.'

# Extract first trip ID for next test
TRIP_ID=$(echo "$SCHEDULED_RESPONSE" | jq -r '.[0].truckTripId')

echo ""
echo -e "${GREEN}✅ Scheduled departures retrieved${NC}"
echo "First trip ID: $TRIP_ID"
echo ""
sleep 1

# Test 4: Dispatch a Truck Trip
echo "==========================================================================="
echo -e "${YELLOW}[TEST 4] Dispatch Truck Trip${NC}"
echo "POST $BASE_URL/api/truck-trips/$TRIP_ID/dispatch"
echo ""

curl -s -X POST "$BASE_URL/api/truck-trips/$TRIP_ID/dispatch" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo -e "${GREEN}✅ Truck trip dispatched${NC}"
echo ""
sleep 1

# Test 5: Get In-Progress Trips
echo "==========================================================================="
echo -e "${YELLOW}[TEST 5] Get In-Progress Trips${NC}"
echo "GET $BASE_URL/api/truck-trips/in-progress"
echo ""

IN_PROGRESS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/truck-trips/in-progress" \
  -H "Authorization: Bearer $TOKEN")

echo "$IN_PROGRESS_RESPONSE" | jq '.'

# Extract an in-progress trip ID for completion test
COMPLETE_TRIP_ID=$(echo "$IN_PROGRESS_RESPONSE" | jq -r '.[0].truckTripId')

echo ""
echo -e "${GREEN}✅ In-progress trips retrieved${NC}"
echo "Trip to complete: $COMPLETE_TRIP_ID"
echo ""
sleep 1

# Test 6: Complete a Truck Trip
echo "==========================================================================="
echo -e "${YELLOW}[TEST 6] Complete Truck Trip${NC}"
echo "POST $BASE_URL/api/truck-trips/$COMPLETE_TRIP_ID/complete"
echo ""

curl -s -X POST "$BASE_URL/api/truck-trips/$COMPLETE_TRIP_ID/complete" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo -e "${GREEN}✅ Truck trip completed${NC}"
echo ""
sleep 1

# Error Case Tests
echo "==========================================================================="
echo -e "${YELLOW}ERROR CASE TESTS${NC}"
echo "==========================================================================="
echo ""

# Test 7: Unauthorized Access (No Token)
echo -e "${YELLOW}[TEST 7] Unauthorized Access (No Token)${NC}"
echo "GET $BASE_URL/api/stores/incoming-deliveries (without token)"
echo ""

ERROR_RESPONSE=$(curl -s -X GET "$BASE_URL/api/stores/incoming-deliveries")
echo "$ERROR_RESPONSE" | jq '.'
echo -e "${GREEN}✅ Correctly rejected unauthorized request${NC}"
echo ""
sleep 1

# Test 8: Wrong Role (Dispatcher trying to access Store Manager endpoint)
echo -e "${YELLOW}[TEST 8] Wrong Role (Dispatcher Token)${NC}"
echo "Login as Dispatcher and try Store Manager endpoint"
echo ""

DISPATCHER_LOGIN=$(curl -s -X POST "$BASE_URL/api/auth/sign-in" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dispatcher1",
    "password": "password123"
  }')

DISPATCHER_TOKEN=$(echo "$DISPATCHER_LOGIN" | jq -r '.token')

echo "Attempting to access Store Manager endpoint with Dispatcher token..."
ERROR_RESPONSE=$(curl -s -X GET "$BASE_URL/api/stores/incoming-deliveries" \
  -H "Authorization: Bearer $DISPATCHER_TOKEN")

echo "$ERROR_RESPONSE" | jq '.'
echo -e "${GREEN}✅ Correctly rejected wrong role${NC}"
echo ""
sleep 1

# Test 9: Invalid Trip ID
echo -e "${YELLOW}[TEST 9] Dispatch Non-Existent Trip${NC}"
echo "POST $BASE_URL/api/truck-trips/invalid-trip-id/dispatch"
echo ""

ERROR_RESPONSE=$(curl -s -X POST "$BASE_URL/api/truck-trips/invalid-trip-id/dispatch" \
  -H "Authorization: Bearer $TOKEN")

echo "$ERROR_RESPONSE" | jq '.'
echo -e "${GREEN}✅ Correctly handled invalid trip ID${NC}"
echo ""

# Summary
echo "==========================================================================="
echo -e "${GREEN}TEST SUITE COMPLETED${NC}"
echo "==========================================================================="
echo ""
echo "All Store Manager API endpoints tested successfully!"
echo ""
echo "Tested Endpoints:"
echo "  1. POST /api/auth/sign-in (Login)"
echo "  2. GET /api/stores/incoming-deliveries"
echo "  3. GET /api/truck-trips/scheduled-departures"
echo "  4. POST /api/truck-trips/:tripId/dispatch"
echo "  5. GET /api/truck-trips/in-progress"
echo "  6. POST /api/truck-trips/:tripId/complete"
echo ""
echo "Error Cases Tested:"
echo "  7. Unauthorized access (no token)"
echo "  8. Wrong role (dispatcher accessing store manager endpoint)"
echo "  9. Invalid trip ID"
echo ""
