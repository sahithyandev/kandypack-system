# Customer Portal API

This module provides RESTful API endpoints for the Kandypack Customer Portal.

## Base URL
All endpoints are prefixed with `/api`

## Authentication
All endpoints (except signup/signin which are handled by the auth module) require JWT authentication with Customer role.

Include the JWT token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Authentication

#### POST /auth/signup
Register a new customer account.

**Request Body:**
```json
{
  "username": "NewCustomer",
  "name": "New Customer Inc.",
  "password": "strongpassword123",
  "type": "Wholesale",
  "street_name": "123 Galle Road",
  "city": "Galle",
  "postal_code": "80000",
  "phone_no": "0912223344"
}
```

**Success Response (200 OK):**
```json
{
  "username": "NewCustomer",
  "name": "New Customer Inc.",
  "role": "Customer",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/signin
Authenticate a customer and get JWT token.

**Request Body:**
```json
{
  "username": "LankaSathosa",
  "password": "pass123"
}
```

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "LankaSathosa",
  "name": "Lanka Sathosa",
  "role": "Customer"
}
```

---

### 2. Place Order

#### GET /api/products
Get all available products that can be ordered.

**Authentication:** Required (Customer role)

**Success Response (200 OK):**
```json
[
  {
    "productId": "prod-det-01",
    "name": "Sunlight Soap 100g",
    "unitPrice": 80.00
  },
  {
    "productId": "prod-bev-01",
    "name": "Coca-Cola 500ml",
    "unitPrice": 150.00
  }
]
```

#### POST /api/orders
Submit a new order.

**Authentication:** Required (Customer role)

**Request Body:**
```json
{
  "deliveryAddress": "45, Main Street, Matara",
  "requiredDeliveryDate": "2025-10-28",
  "items": [
    {
      "productId": "prod-det-01",
      "quantity": 500
    },
    {
      "productId": "prod-snk-02",
      "quantity": 250
    }
  ]
}
```

**Validation Rules:**
- `requiredDeliveryDate` must be at least 7 days from today
- All products must exist in the database
- Quantities must be positive integers

**Success Response (201 Created):**
```json
{
  "orderId": "ord-043",
  "status": "Pending",
  "totalValue": 71250.00,
  "message": "Order placed successfully. You will be notified of its status."
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Required delivery date must be at least 7 days from today."
}
```

---

### 3. Order Tracking

#### GET /api/orders
Get a summary list of all orders placed by the authenticated customer.

**Authentication:** Required (Customer role)

**Success Response (200 OK):**
```json
[
  {
    "orderId": "ord-001",
    "placedOn": "2025-09-27T08:30:00Z",
    "totalValue": 50000.00,
    "status": "Delivered"
  },
  {
    "orderId": "ord-043",
    "placedOn": "2025-10-17T17:21:00Z",
    "totalValue": 71250.00,
    "status": "Pending"
  }
]
```

#### GET /api/orders/:orderId
Get detailed information for a specific order.

**Authentication:** Required (Customer role)

**URL Parameters:**
- `orderId` - The ID of the order to retrieve

**Success Response (200 OK):**
```json
{
  "orderId": "ord-001",
  "status": "Delivered",
  "placedOn": "2025-09-27T08:30:00Z",
  "deliveryAddress": "Sathosa Head Office, Colombo 2",
  "totalValue": 50000.00,
  "items": [
    { "productName": "Sunlight Soap 100g", "quantity": 200 },
    { "productName": "Coca-Cola 500ml", "quantity": 150 }
  ],
  "statusHistory": [
    { "status": "Pending", "timestamp": "2025-09-27T08:30:00Z" },
    { "status": "In_Train_Transit", "timestamp": "2025-10-20T08:30:00Z" },
    { "status": "At_Store", "timestamp": "2025-10-20T12:15:00Z" },
    { "status": "In_Truck_Transit", "timestamp": "2025-10-21T10:05:21Z" },
    { "status": "Delivered", "timestamp": "2025-10-21T13:45:10Z" }
  ]
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Order not found"
}
```

---

## Order Statuses

Orders progress through the following statuses:

1. **Pending** - Order placed, awaiting scheduling
2. **In_Train_Transit** - Shipment on train to destination store
3. **At_Store** - Arrived at distribution store
4. **In_Truck_Transit** - On truck for final delivery
5. **Delivered** - Successfully delivered to customer

---

## Error Responses

All endpoints may return the following error responses:

- **401 Unauthorized** - Missing or invalid JWT token
- **403 Forbidden** - User does not have Customer role
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

Error response format:
```json
{
  "error": "Error message description"
}
```

---

## Files

- **model.ts** - TypeScript type definitions and Elysia schema validation
- **service.ts** - Business logic and database queries
- **index.ts** - HTTP routing and request handling
- **README.md** - This documentation file

---

## Database Tables Used

- **User** - User authentication
- **Customer** - Customer profile information
- **Product** - Available products catalog
- **Order** - Customer orders
- **Order_Item** - Individual items in orders
- **Shipment** - Tracking shipments (for status history)

---

## Notes

- All monetary values are in LKR (Sri Lankan Rupees)
- Dates are in ISO 8601 format
- The 7-day minimum delivery date is enforced by database constraint and API validation
- Status history is built from available shipment records (simplified approach)
- For production, consider implementing a dedicated Order_Status_Log table for complete audit trail
