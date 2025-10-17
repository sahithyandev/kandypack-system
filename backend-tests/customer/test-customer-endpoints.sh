#!/bin/bash

# ============================================================================
# Customer Portal API Endpoint Test Script
# ============================================================================
# This script tests all customer portal endpoints
# Run with: bash test-customer-endpoints.sh
# ============================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:2000"

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print section headers
print_header() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
}

# Function to print test results
print_test() {
    local test_name=$1
    local status=$2
    
    if [ "$status" = "PASS" ]; then
        echo -e "${GREEN}✓ PASS${NC} - $test_name"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} - $test_name"
        ((TESTS_FAILED++))
    fi
}

# Function to make API calls and check response
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local token=$4
    local expected_status=$5
    local test_name=$6
    
    echo -e "${YELLOW}Testing:${NC} $test_name"
    echo -e "${YELLOW}Request:${NC} $method $endpoint"
    
    if [ -n "$token" ]; then
        if [ -n "$data" ]; then
            response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
                -H "Content-Type: application/json" \
                -H "Authorization: Bearer $token" \
                -d "$data")
        else
            response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
                -H "Authorization: Bearer $token")
        fi
    else
        if [ -n "$data" ]; then
            response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
                -H "Content-Type: application/json" \
                -d "$data")
        else
            response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint")
        fi
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    echo -e "${YELLOW}Status:${NC} $http_code"
    echo -e "${YELLOW}Response:${NC} $(echo $body | jq -C '.' 2>/dev/null || echo $body)"
    
    if [ "$http_code" = "$expected_status" ]; then
        print_test "$test_name" "PASS"
        echo "$body"
    else
        print_test "$test_name (Expected $expected_status, got $http_code)" "FAIL"
        echo ""
    fi
    
    echo ""
}

# ============================================================================
# Start Tests
# ============================================================================

print_header "CUSTOMER PORTAL API ENDPOINT TESTS"

echo -e "${CYAN}Testing against:${NC} $BASE_URL"
echo -e "${CYAN}Date:${NC} $(date)"
echo ""

# Check if server is running
echo -e "${YELLOW}Checking if backend server is running...${NC}"
if ! curl -s "$BASE_URL" > /dev/null; then
    echo -e "${RED}✗ Backend server is not running at $BASE_URL${NC}"
    echo -e "${YELLOW}Please start the server with: cd backend && bun run dev${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Backend server is running${NC}"
echo ""

# ============================================================================
# 1. AUTHENTICATION TESTS
# ============================================================================

print_header "1. AUTHENTICATION TESTS"

# Test 1.1: Sign up new customer
test_endpoint "POST" "/auth/sign-up" \
    '{
        "username": "testcust_'$(date +%s)'",
        "name": "Test Customer",
        "password": "password123",
        "type": "Wholesale",
        "street_name": "123 Test Street",
        "city": "Colombo",
        "postal_code": "00100",
        "phone_no": "+94771234567"
    }' \
    "" \
    "200" \
    "Sign up new customer with full details"

# Test 1.2: Sign in customer1
signin_response=$(curl -s -X POST "$BASE_URL/auth/sign-in" \
    -H "Content-Type: application/json" \
    -d '{
        "username": "customer1",
        "password": "password123"
    }')

CUSTOMER1_TOKEN=$(echo $signin_response | jq -r '.token')

if [ -n "$CUSTOMER1_TOKEN" ] && [ "$CUSTOMER1_TOKEN" != "null" ]; then
    print_test "Sign in customer1 and extract token" "PASS"
    echo -e "${CYAN}Token:${NC} ${CUSTOMER1_TOKEN:0:50}..."
else
    print_test "Sign in customer1 and extract token" "FAIL"
    echo -e "${RED}Failed to get token. Response: $signin_response${NC}"
fi
echo ""

# Test 1.3: Sign in retail customer
retail_signin=$(curl -s -X POST "$BASE_URL/auth/sign-in" \
    -H "Content-Type: application/json" \
    -d '{
        "username": "retailcust1",
        "password": "password123"
    }')

RETAIL_TOKEN=$(echo $retail_signin | jq -r '.token')

if [ -n "$RETAIL_TOKEN" ] && [ "$RETAIL_TOKEN" != "null" ]; then
    print_test "Sign in retailcust1" "PASS"
else
    print_test "Sign in retailcust1" "FAIL"
fi
echo ""

# ============================================================================
# 2. PRODUCTS ENDPOINT TESTS
# ============================================================================

print_header "2. PRODUCTS ENDPOINT TESTS"

# Test 2.1: Get all products (authenticated)
products_response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/products" \
    -H "Authorization: Bearer $CUSTOMER1_TOKEN")

products_code=$(echo "$products_response" | tail -n1)
products_body=$(echo "$products_response" | sed '$d')
products_count=$(echo $products_body | jq '. | length' 2>/dev/null)

echo -e "${YELLOW}Testing:${NC} Get all products (authenticated)"
echo -e "${YELLOW}Status:${NC} $products_code"
echo -e "${YELLOW}Products count:${NC} $products_count"

if [ "$products_code" = "200" ] && [ "$products_count" -ge "12" ]; then
    print_test "Get all products returns 12+ products" "PASS"
    echo $products_body | jq -C '.[0:3]' 2>/dev/null
else
    print_test "Get all products" "FAIL"
fi
echo ""

# Test 2.2: Get products without authentication (should fail)
test_endpoint "GET" "/api/products" "" "" "401" \
    "Get products without authentication (should fail with 401)"

# ============================================================================
# 3. CREATE ORDER TESTS
# ============================================================================

print_header "3. CREATE ORDER TESTS"

# Calculate date 7 days from now
DELIVERY_DATE=$(date -v+7d +%Y-%m-%d 2>/dev/null || date -d "+7 days" +%Y-%m-%d)

# Test 3.1: Create valid order
test_endpoint "POST" "/api/orders" \
    '{
        "deliveryAddress": "Test Automated Order, Colombo 05",
        "requiredDeliveryDate": "'$DELIVERY_DATE'",
        "items": [
            {"productId": "prod-001", "quantity": 20},
            {"productId": "prod-002", "quantity": 15}
        ]
    }' \
    "$CUSTOMER1_TOKEN" \
    "201" \
    "Create valid order (7 days from now)"

# Test 3.2: Create order with invalid date (should fail)
INVALID_DATE=$(date -v+3d +%Y-%m-%d 2>/dev/null || date -d "+3 days" +%Y-%m-%d)

test_endpoint "POST" "/api/orders" \
    '{
        "deliveryAddress": "Test Address",
        "requiredDeliveryDate": "'$INVALID_DATE'",
        "items": [
            {"productId": "prod-001", "quantity": 10}
        ]
    }' \
    "$CUSTOMER1_TOKEN" \
    "400" \
    "Create order with date < 7 days (should fail with 400)"

# Test 3.3: Create order with invalid product (should fail)
test_endpoint "POST" "/api/orders" \
    '{
        "deliveryAddress": "Test Address",
        "requiredDeliveryDate": "'$DELIVERY_DATE'",
        "items": [
            {"productId": "invalid-product-id", "quantity": 10}
        ]
    }' \
    "$CUSTOMER1_TOKEN" \
    "400" \
    "Create order with invalid product (should fail with 400)"

# Test 3.4: Create order without authentication (should fail)
test_endpoint "POST" "/api/orders" \
    '{
        "deliveryAddress": "Test Address",
        "requiredDeliveryDate": "'$DELIVERY_DATE'",
        "items": [
            {"productId": "prod-001", "quantity": 10}
        ]
    }' \
    "" \
    "401" \
    "Create order without authentication (should fail with 401)"

# ============================================================================
# 4. ORDER TRACKING - GET ALL ORDERS
# ============================================================================

print_header "4. ORDER TRACKING - GET ALL ORDERS"

# Test 4.1: Get all orders for customer1
orders_response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/orders" \
    -H "Authorization: Bearer $CUSTOMER1_TOKEN")

orders_code=$(echo "$orders_response" | tail -n1)
orders_body=$(echo "$orders_response" | sed '$d')
orders_count=$(echo $orders_body | jq '. | length' 2>/dev/null)

echo -e "${YELLOW}Testing:${NC} Get all orders for customer1"
echo -e "${YELLOW}Status:${NC} $orders_code"
echo -e "${YELLOW}Orders count:${NC} $orders_count"

if [ "$orders_code" = "200" ] && [ "$orders_count" -ge "2" ]; then
    print_test "Get all orders for customer1 (has multiple orders)" "PASS"
    echo $orders_body | jq -C '.[0:2]' 2>/dev/null
else
    print_test "Get all orders for customer1" "FAIL"
fi
echo ""

# Test 4.2: Get orders without authentication (should fail)
test_endpoint "GET" "/api/orders" "" "" "401" \
    "Get orders without authentication (should fail with 401)"

# ============================================================================
# 5. ORDER TRACKING - GET SPECIFIC ORDER
# ============================================================================

print_header "5. ORDER TRACKING - GET SPECIFIC ORDER DETAILS"

# Test 5.1: Get delivered order details
test_endpoint "GET" "/api/orders/ord-delivered-001" "" "$CUSTOMER1_TOKEN" "200" \
    "Get delivered order details with status history"

# Test 5.2: Get in-transit order details
test_endpoint "GET" "/api/orders/ord-in-transit-001" "" "$CUSTOMER1_TOKEN" "200" \
    "Get in-transit order details"

# Test 5.3: Get non-existent order (should fail)
test_endpoint "GET" "/api/orders/ord-does-not-exist-999" "" "$CUSTOMER1_TOKEN" "404" \
    "Get non-existent order (should fail with 404)"

# Test 5.4: Try to access another customer's order (security test)
test_endpoint "GET" "/api/orders/ord-retail-001" "" "$CUSTOMER1_TOKEN" "404" \
    "Access another customer's order (should fail with 404 for security)"

# ============================================================================
# 6. CROSS-CUSTOMER SECURITY TESTS
# ============================================================================

print_header "6. CROSS-CUSTOMER SECURITY TESTS"

# Test 6.1: Retail customer gets only their orders
retail_orders=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/orders" \
    -H "Authorization: Bearer $RETAIL_TOKEN")

retail_orders_code=$(echo "$retail_orders" | tail -n1)
retail_orders_body=$(echo "$retail_orders" | sed '$d')
retail_orders_count=$(echo $retail_orders_body | jq '. | length' 2>/dev/null)

echo -e "${YELLOW}Testing:${NC} Retail customer gets only their orders"
echo -e "${YELLOW}Status:${NC} $retail_orders_code"
echo -e "${YELLOW}Orders count:${NC} $retail_orders_count"

if [ "$retail_orders_code" = "200" ]; then
    print_test "Retail customer can access their orders" "PASS"
    echo $retail_orders_body | jq -C '.' 2>/dev/null
else
    print_test "Retail customer orders access" "FAIL"
fi
echo ""

# Test 6.2: Retail customer accesses their own order
test_endpoint "GET" "/api/orders/ord-retail-001" "" "$RETAIL_TOKEN" "200" \
    "Retail customer can access their own order"

# Test 6.3: Retail customer tries to access customer1's order (should fail)
test_endpoint "GET" "/api/orders/ord-delivered-001" "" "$RETAIL_TOKEN" "404" \
    "Retail customer cannot access customer1's order (security)"

# ============================================================================
# 7. ROLE-BASED ACCESS CONTROL TESTS
# ============================================================================

print_header "7. ROLE-BASED ACCESS CONTROL TESTS"

# Test 7.1: Try to access customer endpoints with worker token
worker_signin=$(curl -s -X POST "$BASE_URL/auth/sign-in" \
    -H "Content-Type: application/json" \
    -d '{
        "username": "dispatcher1",
        "password": "password123"
    }')

WORKER_TOKEN=$(echo $worker_signin | jq -r '.token')

if [ -n "$WORKER_TOKEN" ] && [ "$WORKER_TOKEN" != "null" ]; then
    test_endpoint "GET" "/api/products" "" "$WORKER_TOKEN" "403" \
        "Worker cannot access customer endpoints (should fail with 403)"
else
    echo -e "${YELLOW}Skipping worker token test (couldn't get worker token)${NC}"
fi

# ============================================================================
# SUMMARY
# ============================================================================

print_header "TEST SUMMARY"

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))

echo -e "${CYAN}Total Tests:${NC} $TOTAL_TESTS"
echo -e "${GREEN}Passed:${NC} $TESTS_PASSED"
echo -e "${RED}Failed:${NC} $TESTS_FAILED"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
