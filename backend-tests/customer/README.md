# Customer Portal API Tests

This directory contains HTTP test files for testing the Customer Portal API endpoints.

## Prerequisites

1. **Backend Running**: Make sure the backend server is running on `http://localhost:2000`
   ```bash
   cd backend
   bun run dev
   ```

2. **Database Seeded**: Ensure the database has been initialized with sample data
   - The `7-sample-data.sql` script should be executed
   - This creates test customers, products, and orders

3. **HTTP Client**: Use VS Code REST Client extension or similar tool to run `.http` files

## Test Files

### 1. `customer.TESTING-GUIDE.http`
**Comprehensive test suite** covering all endpoints with detailed explanations.

**What it tests:**
- ✅ Customer registration (sign-up)
- ✅ Customer authentication (sign-in)
- ✅ Product catalog retrieval
- ✅ Order creation with validation
- ✅ Order listing (all customer orders)
- ✅ Order details with status history
- ✅ Security & access control
- ✅ Error handling & edge cases

**Use this file for:** Complete end-to-end testing and validation

---

### 2. `customer.products.http`
**Quick test** for the products endpoint.

**What it tests:**
- ✅ GET /api/products endpoint
- ✅ Returns all 12 products

**Use this file for:** Quick check that products are loading correctly

---

### 3. `customer.place-order.http`
**Order creation tests** with various scenarios.

**What it tests:**
- ✅ Valid orders (different sizes and dates)
- ✅ Invalid delivery dates (< 7 days)
- ✅ Invalid products
- ✅ Missing required fields
- ✅ Empty items array

**Use this file for:** Testing order placement and validation logic

---

### 4. `customer.order-tracking.http`
**Order tracking tests** for retrieving order information.

**What it tests:**
- ✅ Get all orders (summary list)
- ✅ Get specific order details
- ✅ Orders in different statuses (Pending, In_Transit, Delivered)
- ✅ Cross-customer security (can't access other customers' orders)
- ✅ Different customer types (Retail vs Wholesale)

**Use this file for:** Testing order history and tracking features

---

## Test Credentials

The sample data includes the following test customers:

| Username | Password | Type | Orders |
|----------|----------|------|--------|
| `customer1` | `password123` | Wholesale | Multiple orders (Delivered, In_Transit, Pending) |
| `retailcust1` | `password123` | Retail | 1 Pending order |
| `wholesalecust1` | `password123` | Wholesale | 1 Pending order |

## Quick Start Guide

### Step 1: Start the Backend
```bash
cd backend
bun run dev
```

### Step 2: Open Test File
Open any `.http` file in VS Code with REST Client extension installed.

### Step 3: Run Tests
Click "Send Request" above each request, or use the shortcut (usually `Ctrl+Alt+R` or `Cmd+Alt+R`).

### Step 4: Verify Responses
Check that responses match the expected output documented in each test.

## Expected Test Results

### Products Endpoint
- **Status**: 200 OK
- **Count**: 12 products
- **Sample**: Rice 5kg (850.00), Sunlight Soap 100g (80.00), etc.

### Place Order (Valid)
- **Status**: 201 Created
- **Response**: Order ID, status "Pending", total value, success message

### Place Order (Invalid Date)
- **Status**: 400 Bad Request
- **Error**: "Required delivery date must be at least 7 days from today."

### Get All Orders (customer1)
- **Status**: 200 OK
- **Count**: 4+ orders
- **Statuses**: Mix of Pending, In_Truck_Transit, Delivered

### Get Order Details
- **Status**: 200 OK
- **Data**: Order info, items list, status history

### Security Tests
- **Accessing other customer's order**: 404 Not Found
- **Using worker token**: 403 Forbidden
- **No authentication**: 401 Unauthorized

## Database Test Data Summary

### Products (12 total)
- **Groceries**: Rice, Sugar, Flour, Milk Powder, Cooking Oil, Tea
- **Packaged**: Biscuits, Soap Bar
- **Branded**: Sunlight Soap, Coca-Cola, Potato Chips, Chocolate Bar

### Customers (3 test users)
- **customer1**: Wholesale, Main Street, Colombo
- **retailcust1**: Retail, Main Street, Matara
- **wholesalecust1**: Wholesale, Galle Road, Galle

### Orders
- **customer1**: 
  - ord-delivered-001 (Status: Delivered, 20 days old)
  - ord-in-transit-001 (Status: In_Truck_Transit, 10 days old)
  - ord-pending-003 (Status: Pending)
  - ord-pending-004 (Status: Pending)
- **retailcust1**: ord-retail-001 (Status: Pending)
- **wholesalecust1**: ord-wholesale-001 (Status: Pending)

## Troubleshooting

### Issue: 401 Unauthorized
**Solution**: Make sure you run the sign-in request first and the token is correctly set in variables.

### Issue: 404 Not Found for Order
**Solution**: Verify the database is seeded with sample data. Check order IDs in the database.

### Issue: 400 Bad Request for Invalid Date
**Solution**: Update the `requiredDeliveryDate` to be at least 7 days from the current date.

### Issue: No Products Returned
**Solution**: Ensure the database has products. Run the `7-sample-data.sql` script.

### Issue: 500 Internal Server Error
**Solution**: Check backend logs for database connection issues or other errors.

## API Endpoints Reference

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/auth/sign-up` | No | Register new customer |
| POST | `/auth/sign-in` | No | Customer login |
| GET | `/api/products` | Yes (Customer) | List all products |
| POST | `/api/orders` | Yes (Customer) | Create new order |
| GET | `/api/orders` | Yes (Customer) | List customer's orders |
| GET | `/api/orders/:orderId` | Yes (Customer) | Get order details |

## Additional Notes

- All endpoints except authentication require a valid JWT token
- Tokens expire after 7 days
- All monetary values are in LKR (Sri Lankan Rupees)
- Dates are in ISO 8601 format
- The 7-day minimum delivery date is strictly enforced

## Next Steps

After verifying all endpoints work correctly:
1. ✅ Test with the frontend customer portal
2. ✅ Test order flow end-to-end (create → track → view history)
3. ✅ Test with different customer types (Retail vs Wholesale)
4. ✅ Verify security and data isolation
