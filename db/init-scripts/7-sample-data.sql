INSERT INTO System_Configuration (config_key, config_value, description)
VALUES (
		'DRIVER_WEEKLY_HOUR_LIMIT',
		'40',
		'Maximum weekly working hours for a driver.'
	),
	(
		'ASSISTANT_WEEKLY_HOUR_LIMIT',
		'60',
		'Maximum weekly working hours for an assistant.'
	),
	(
		'DRIVER_CONSECUTIVE_TRIP_LIMIT',
		'1',
		'Maximum consecutive trips for a driver before a break is required.'
	),
	(
		'ASSISTANT_CONSECUTIVE_TRIP_LIMIT',
		'2',
		'Maximum consecutive routes for an assistant before a break is required.'
	) ON CONFLICT (config_key) DO NOTHING;



-- ============================================================================
-- 1. USERS (All passwords are: password123)
-- ============================================================================


-- Worker Users
INSERT INTO "User" (id, username, name, password, role) VALUES
('0199e745-ca10-7000-b4fe-5f5f56f4f7e4', 'customer1', 'Test Customer', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
('cust-retail-001', 'retailcust1', 'Retail Customer 1', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
('cust-wholesale-001', 'wholesalecust1', 'Wholesale Customer 1', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
('0199e825-4ae5-7000-9d86-8be81708d4f1', 'manager2', 'Test Store Manager 2', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('worker-mgr-001', 'manager1', 'Test Store Manager', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('0199e825-7df3-7000-ab6f-71669cef9383', 'driver1', 'Test Driver', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('0199e824-f514-7000-87e6-1bf03af11985', 'assistant1', 'Test Assistant', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('0199e7bd-d5f8-7000-9fd6-f2a853034f88', 'dispatcher1', 'Test Dispatcher', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('driver-002', 'driver2', 'Second Driver', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('driver-003', 'driver3', 'Third Driver', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('driver-004', 'driver4', 'Fourth Driver', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('driver-005', 'driver5', 'Fifth Driver', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('assistant-002', 'assistant2', 'Second Assistant', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('assistant-003', 'assistant3', 'Third Assistant', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('assistant-004', 'assistant4', 'Fourth Assistant', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 1. CITIES
-- ============================================================================
INSERT INTO City (id, name) VALUES
('city-cmb', 'Colombo'),
('city-kdy', 'Kandy'),
('city-gal', 'Galle'),
('city-jaf', 'Jaffna'),
('city-neg', 'Negombo'),
('city-kur', 'Kurunegala')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. ROUTES
-- ============================================================================
INSERT INTO Route (id, name, max_delivery_time_hours, area) VALUES
('route-cmb-01', 'Colombo Fort Area', 4.0, 'Colombo District'),
('route-cmb-02', 'Colombo South', 5.0, 'Colombo District'),
('route-neg-01', 'Negombo Coastal', 3.5, 'Gampaha District'),
('route-gal-01', 'Galle City', 6.0, 'Galle District')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3. ROUTE STOPS
-- ============================================================================
INSERT INTO Route_Stop (id, route_id, city_id, stop_order) VALUES
('rs-cmb-01-1', 'route-cmb-01', 'city-cmb', 1),
('rs-cmb-02-1', 'route-cmb-02', 'city-cmb', 1),
('rs-neg-01-1', 'route-neg-01', 'city-neg', 1),
('rs-gal-01-1', 'route-gal-01', 'city-gal', 1)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 4. PRODUCTS
-- ============================================================================
INSERT INTO Product (id, name, unit_price, space_consumption_rate) VALUES
('prod-001', 'Rice 5kg', 850.00, 2.5),
('prod-002', 'Sugar 1kg', 180.00, 1.0),
('prod-003', 'Flour 1kg', 150.00, 1.0),
('prod-004', 'Milk Powder 400g', 950.00, 0.8),
('prod-005', 'Cooking Oil 1L', 650.00, 1.2),
('prod-006', 'Tea 200g', 420.00, 0.5),
('prod-007', 'Biscuits Pack', 250.00, 0.6),
('prod-008', 'Soap Bar', 120.00, 0.3),
('prod-det-01', 'Sunlight Soap 100g', 80.00, 0.2),
('prod-bev-01', 'Coca-Cola 500ml', 150.00, 0.5),
('prod-snk-01', 'Potato Chips 100g', 200.00, 0.4),
('prod-snk-02', 'Chocolate Bar', 250.00, 0.3)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 7. WORKER DATA
-- ============================================================================
-- Dispatcher
INSERT INTO Worker (id, type, hourly_pay, status, weekly_hours) VALUES
('0199e7bd-d5f8-7000-9fd6-f2a853034f88', 'Dispatcher', 2500.00, 'Free', 0)
ON CONFLICT (id) DO NOTHING;

-- Driver
INSERT INTO Worker (id, type, hourly_pay, status, weekly_hours) VALUES
('0199e825-7df3-7000-ab6f-71669cef9383', 'Driver', 1500.00, 'Free', 0)
ON CONFLICT (id) DO UPDATE SET status = 'Free', weekly_hours = 0;

INSERT INTO Driver (id, consecutive_deliveries) VALUES
('0199e825-7df3-7000-ab6f-71669cef9383', 0)
ON CONFLICT (id) DO UPDATE SET consecutive_deliveries = 0;

-- Assistant
INSERT INTO Worker (id, type, hourly_pay, status, weekly_hours) VALUES
('0199e824-f514-7000-87e6-1bf03af11985', 'Assistant', 1200.00, 'Free', 0)
ON CONFLICT (id) DO UPDATE SET status = 'Free', weekly_hours = 0;

INSERT INTO Assistant (id, consecutive_routes) VALUES
('0199e824-f514-7000-87e6-1bf03af11985', 0)
ON CONFLICT (id) DO UPDATE SET consecutive_routes = 0;

-- Manager
INSERT INTO Worker (id, type, hourly_pay, status, weekly_hours) VALUES
('0199e825-4ae5-7000-9d86-8be81708d4f1', 'Store_Manager', 2500.00, 'Free', 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO Worker (id, type, hourly_pay, status, weekly_hours) VALUES
('driver-002', 'Driver', 1500.00, 'Free', 0),
('driver-003', 'Driver', 1500.00, 'Free', 0),
('driver-004', 'Driver', 1500.00, 'Free', 0),
('driver-005', 'Driver', 1500.00, 'Free', 0),
('assistant-002', 'Assistant', 1200.00, 'Free', 0),
('assistant-003', 'Assistant', 1200.00, 'Free', 0),
('assistant-004', 'Assistant', 1200.00, 'Free', 0)
ON CONFLICT (id) DO UPDATE SET status = 'Free', weekly_hours = 0;


-- ============================================================================
-- 5. STORES
-- ============================================================================
-- Store Manager
INSERT INTO Store_Manager (id) VALUES
('0199e825-4ae5-7000-9d86-8be81708d4f1')
ON CONFLICT (id) DO NOTHING;

INSERT INTO Store (id, name, city_id, managed_by) VALUES
('store-cmb-01', 'Colombo Central Store', 'city-cmb', '0199e825-4ae5-7000-9d86-8be81708d4f1'),
('store-kdy-01', 'Kandy Main Store', 'city-kdy', NULL),
('store-gal-01', 'Galle Store', 'city-gal', NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 6. CUSTOMER DATA
-- ============================================================================
INSERT INTO Customer (id, type, street_name, city, postal_code, phone_no) VALUES
('0199e745-ca10-7000-b4fe-5f5f56f4f7e4', 'Wholesale', 'Main Street', 'Colombo', '00100', '+94771234567'),
('cust-retail-001', 'Retail', '45 Main Street', 'Matara', '81000', '+94771112222'),
('cust-wholesale-001', 'Wholesale', '123 Galle Road', 'Galle', '80000', '+94773334444')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 8. TRAINS
-- ============================================================================
INSERT INTO Train (id, name) VALUES
('train-001', 'Udarata Menike'),
('train-002', 'Rajarata Rejina'),
('train-003', 'Ruhunu Kumari')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 9. TRUCKS
-- ============================================================================
INSERT INTO Truck (id, vehicle_no) VALUES
('truck-001', 'CBA-1234'),
('truck-002', 'CP-5678'),
('truck-003', 'WP-9012')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 10. TRAIN TRIPS (Future scheduled trips)
-- ============================================================================
-- Note: Adjust dates to be in the future relative to when you run this
INSERT INTO Train_Trip (id, train_id, from_city_id, to_city_id, scheduled_departure, scheduled_arrival, capacity_units, allocated_units) VALUES
('tt-kdy-cmb-001', 'train-001', 'city-kdy', 'city-cmb', 
    CURRENT_TIMESTAMP + INTERVAL '2 days 8 hours', 
    CURRENT_TIMESTAMP + INTERVAL '2 days 12 hours', 
    500.0, 0.0),
('tt-kdy-cmb-002', 'train-001', 'city-kdy', 'city-cmb', 
    CURRENT_TIMESTAMP + INTERVAL '3 days 8 hours', 
    CURRENT_TIMESTAMP + INTERVAL '3 days 12 hours', 
    500.0, 0.0),
('tt-cmb-gal-001', 'train-003', 'city-cmb', 'city-gal', 
    CURRENT_TIMESTAMP + INTERVAL '1 day 14 hours', 
    CURRENT_TIMESTAMP + INTERVAL '1 day 18 hours', 
    400.0, 0.0),
('tt-cmb-jaf-001', 'train-002', 'city-cmb', 'city-jaf', 
    CURRENT_TIMESTAMP + INTERVAL '4 days 6 hours', 
    CURRENT_TIMESTAMP + INTERVAL '4 days 16 hours', 
    600.0, 0.0)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 11. PENDING ORDERS (For dispatcher to schedule)
-- ============================================================================
INSERT INTO "Order" (id, store_id, customer_id, delivery_address, route_id, placed_on, required_delivery_date, status, total_value, total_space_units) 
VALUES 
-- Orders for Colombo store
('ord-pending-001', 'store-cmb-01', '0199e745-ca10-7000-b4fe-5f5f56f4f7e4', 
    'Keells Super, Galle Road', 'route-cmb-01', 
    NOW() - INTERVAL '2 hours', 
    CURRENT_DATE + INTERVAL '7 days', 
    'Pending', 8500.00, 45.5),

('ord-pending-002', 'store-cmb-01', '0199e745-ca10-7000-b4fe-5f5f56f4f7e4', 
    'Cargills Food City, Colombo 03', 'route-cmb-02', 
    NOW() - INTERVAL '1 day', 
    CURRENT_DATE + INTERVAL '11 days', 
    'Pending', 12000.00, 65.0),

-- Orders for Galle store
('ord-pending-003', 'store-gal-01', '0199e745-ca10-7000-b4fe-5f5f56f4f7e4', 
    'Arpico Supercentre, Galle', 'route-gal-01', 
    NOW() - INTERVAL '5 hours', 
    CURRENT_DATE + INTERVAL '10 days', 
    'Pending', 6500.00, 35.0),

-- Order for Kandy store  
('ord-pending-004', 'store-kdy-01', '0199e745-ca10-7000-b4fe-5f5f56f4f7e4', 
    'Lanka Sathosa, Kandy City', 'route-cmb-01', 
    NOW() - INTERVAL '3 hours', 
    CURRENT_DATE + INTERVAL '8 days', 
    'Pending', 9500.00, 52.0)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 12. ORDER ITEMS
-- ============================================================================
INSERT INTO Order_Item (id, order_id, product_id, quantity) VALUES
-- Order 1 items (ord-pending-001)
('oi-p001-01', 'ord-pending-001', 'prod-001', 30),  -- Rice
('oi-p001-02', 'ord-pending-001', 'prod-002', 50),  -- Sugar
('oi-p001-03', 'ord-pending-001', 'prod-005', 20),  -- Cooking Oil

-- Order 2 items (ord-pending-002)
('oi-p002-01', 'ord-pending-002', 'prod-001', 50),  -- Rice
('oi-p002-02', 'ord-pending-002', 'prod-003', 40),  -- Flour
('oi-p002-03', 'ord-pending-002', 'prod-004', 30),  -- Milk Powder

-- Order 3 items (ord-pending-003)
('oi-p003-01', 'ord-pending-003', 'prod-006', 80),  -- Tea
('oi-p003-02', 'ord-pending-003', 'prod-007', 100), -- Biscuits
('oi-p003-03', 'ord-pending-003', 'prod-008', 120), -- Soap

-- Order 4 items (ord-pending-004)
('oi-p004-01', 'ord-pending-004', 'prod-001', 40),  -- Rice
('oi-p004-02', 'ord-pending-004', 'prod-005', 30),  -- Cooking Oil
('oi-p004-03', 'ord-pending-004', 'prod-006', 60)   -- Tea
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 13. UPDATE ORDER TOTALS (Trigger will calculate automatically, but let's ensure)
-- ============================================================================
CALL update_order_summary('ord-pending-001');
CALL update_order_summary('ord-pending-002');
CALL update_order_summary('ord-pending-003');
CALL update_order_summary('ord-pending-004');

-- ============================================================================
-- 14. SAMPLE DATA FOR TRUCK SCHEDULING TEST
-- Create one shipment that's already at store (for truck scheduling)
-- ============================================================================
INSERT INTO "Order" (id, store_id, customer_id, delivery_address, route_id, placed_on, required_delivery_date, status, total_value, total_space_units) VALUES
('ord-at-store-001', 'store-cmb-01', '0199e745-ca10-7000-b4fe-5f5f56f4f7e4', 
    'Test Delivery Address, Colombo 03', 'route-cmb-02', 
    CURRENT_TIMESTAMP - INTERVAL '3 days', 
    CURRENT_DATE + INTERVAL '7 days', 
    'At_Store', 5000.00, 25.0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO Order_Item (id, order_id, product_id, quantity) VALUES
('oi-at-store-01', 'ord-at-store-001', 'prod-001', 30),
('oi-at-store-02', 'ord-at-store-001', 'prod-005', 20)
ON CONFLICT (id) DO NOTHING;

-- Create shipment for the at-store order
INSERT INTO Shipment (id, order_id, train_trip_id, allocated_space_units, shipped_quantity, status, shipped_at) VALUES
('ship-at-store-001', 'ord-at-store-001', 'tt-kdy-cmb-001', 25.0, 1, 'Delivered', CURRENT_TIMESTAMP - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 15. STORE MANAGER TEST DATA
-- ============================================================================

INSERT INTO Driver (id, consecutive_deliveries) VALUES
('driver-002', 0),
('driver-003', 0),
('driver-004', 0),
('driver-005', 0)
ON CONFLICT (id) DO UPDATE SET consecutive_deliveries = 0;

INSERT INTO Assistant (id, consecutive_routes) VALUES
('assistant-002', 0),
('assistant-003', 0),
('assistant-004', 0)
ON CONFLICT (id) DO UPDATE SET consecutive_routes = 0;

-- Create shipments arriving at Colombo store (for incoming deliveries endpoint)
INSERT INTO Shipment (id, order_id, train_trip_id, allocated_space_units, shipped_quantity, status, shipped_at) VALUES
('ship-incoming-001', 'ord-pending-001', 'tt-kdy-cmb-001', 45.5, 1, 'In_Transit', NULL),
('ship-incoming-002', 'ord-pending-002', 'tt-kdy-cmb-002', 65.0, 1, 'In_Transit', NULL)
ON CONFLICT (id) DO NOTHING;

-- Update order status to In_Train_Transit for the shipments
UPDATE "Order" SET status = 'In_Train_Transit' WHERE id IN ('ord-pending-001', 'ord-pending-002');

-- Create more At_Store orders for truck scheduling
INSERT INTO "Order" (id, store_id, customer_id, delivery_address, route_id, placed_on, required_delivery_date, status, total_value, total_space_units) VALUES
('ord-at-store-002', 'store-cmb-01', '0199e745-ca10-7000-b4fe-5f5f56f4f7e4', 
    'Arpico Supercenter, Colombo 05', 'route-cmb-01', 
    CURRENT_TIMESTAMP - INTERVAL '2 days', 
    CURRENT_DATE + INTERVAL '8 days', 
    'At_Store', 7500.00, 40.0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO Order_Item (id, order_id, product_id, quantity) VALUES
('oi-at-store-03', 'ord-at-store-002', 'prod-001', 25),
('oi-at-store-04', 'ord-at-store-002', 'prod-002', 35)
ON CONFLICT (id) DO NOTHING;

-- Create shipment for second at-store order
INSERT INTO Shipment (id, order_id, train_trip_id, allocated_space_units, shipped_quantity, status, shipped_at) VALUES
('ship-at-store-002', 'ord-at-store-002', 'tt-kdy-cmb-001', 40.0, 1, 'Delivered', CURRENT_TIMESTAMP - INTERVAL '6 hours')
ON CONFLICT (id) DO NOTHING;

-- Create third at-store order for in-progress trip test
INSERT INTO "Order" (id, store_id, customer_id, delivery_address, route_id, placed_on, required_delivery_date, status, total_value, total_space_units) VALUES
('ord-at-store-003', 'store-cmb-01', '0199e745-ca10-7000-b4fe-5f5f56f4f7e4', 
    'Laugfs Supermarket, Colombo 04', 'route-cmb-01', 
    CURRENT_TIMESTAMP - INTERVAL '1 day', 
    CURRENT_DATE + INTERVAL '9 days', 
    'At_Store', 6200.00, 32.0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO Order_Item (id, order_id, product_id, quantity) VALUES
('oi-at-store-05', 'ord-at-store-003', 'prod-003', 40),
('oi-at-store-06', 'ord-at-store-003', 'prod-006', 50)
ON CONFLICT (id) DO NOTHING;

-- Create shipment for third at-store order (for in-progress trip)
INSERT INTO Shipment (id, order_id, train_trip_id, allocated_space_units, shipped_quantity, status, shipped_at) VALUES
('ship-at-store-003', 'ord-at-store-003', 'tt-kdy-cmb-002', 32.0, 1, 'Delivered', CURRENT_TIMESTAMP - INTERVAL '4 hours')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES (For testing)
-- ============================================================================
-- Uncomment these to verify data after running the script

-- SELECT COUNT(*) as pending_orders FROM "Order" WHERE status = 'Pending';
-- SELECT COUNT(*) as train_trips FROM Train_Trip WHERE scheduled_departure > NOW();
-- SELECT COUNT(*) as at_store_orders FROM "Order" WHERE status = 'At_Store';
-- SELECT * FROM Worker WHERE type IN ('Driver', 'Assistant', 'Dispatcher');
-- SELECT * FROM Truck;

-- ============================================================================
-- 16. ADDITIONAL CUSTOMER PORTAL TEST DATA
-- ============================================================================

-- Add more customer users with different types
INSERT INTO "User" (id, username, name, password, role) VALUES
('cust-retail-001', 'retailcust1', 'Small Retail Shop', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
('cust-wholesale-001', 'wholesalecust1', 'Mega Wholesale Center', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer')
ON CONFLICT (id) DO NOTHING;

-- Create completed orders for customer1 to test order history
-- Order 1: Fully delivered order
INSERT INTO "Order" (id, store_id, customer_id, delivery_address, route_id, placed_on, required_delivery_date, status, total_value, total_space_units) VALUES
('ord-delivered-001', 'store-cmb-01', '0199e745-ca10-7000-b4fe-5f5f56f4f7e4', 
    'Sathosa Head Office, Colombo 02', 'route-cmb-01', 
    CURRENT_TIMESTAMP - INTERVAL '20 days', 
    CURRENT_TIMESTAMP - INTERVAL '5 days', 
    'Delivered', 50000.00, 220.0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO Order_Item (id, order_id, product_id, quantity) VALUES
('oi-del-001-01', 'ord-delivered-001', 'prod-det-01', 200),  -- Sunlight Soap
('oi-del-001-02', 'ord-delivered-001', 'prod-bev-01', 150),  -- Coca-Cola
('oi-del-001-03', 'ord-delivered-001', 'prod-001', 50)       -- Rice
ON CONFLICT (id) DO NOTHING;

-- Create shipment for delivered order (to show status history)
INSERT INTO Shipment (id, order_id, train_trip_id, allocated_space_units, shipped_quantity, status, shipped_at) VALUES
('ship-delivered-001', 'ord-delivered-001', 'tt-kdy-cmb-001', 220.0, 1, 'Delivered', CURRENT_TIMESTAMP - INTERVAL '15 days')
ON CONFLICT (id) DO NOTHING;

-- Note: Truck trip for delivered order is created later in section 17

-- Order 2: Currently in truck transit
INSERT INTO "Order" (id, store_id, customer_id, delivery_address, route_id, placed_on, required_delivery_date, status, total_value, total_space_units) VALUES
('ord-in-transit-001', 'store-cmb-01', '0199e745-ca10-7000-b4fe-5f5f56f4f7e4', 
    'Keells Super, Galle Road, Colombo 03', 'route-cmb-02', 
    CURRENT_TIMESTAMP - INTERVAL '10 days', 
    CURRENT_DATE + INTERVAL '2 days', 
    'In_Truck_Transit', 30000.00, 150.0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO Order_Item (id, order_id, product_id, quantity) VALUES
('oi-transit-001-01', 'ord-in-transit-001', 'prod-001', 100),  -- Rice
('oi-transit-001-02', 'ord-in-transit-001', 'prod-002', 80),   -- Sugar
('oi-transit-001-03', 'ord-in-transit-001', 'prod-005', 50)    -- Cooking Oil
ON CONFLICT (id) DO NOTHING;

-- Create shipment for in-transit order
INSERT INTO Shipment (id, order_id, train_trip_id, allocated_space_units, shipped_quantity, status, shipped_at) VALUES
('ship-in-transit-001', 'ord-in-transit-001', 'tt-kdy-cmb-002', 150.0, 1, 'Delivered', CURRENT_TIMESTAMP - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

-- Note: Truck trip for in-transit order is created later in section 17

-- Orders for other customers to test
INSERT INTO "Order" (id, store_id, customer_id, delivery_address, route_id, placed_on, required_delivery_date, status, total_value, total_space_units) VALUES
-- Retail customer order
('ord-retail-001', 'store-gal-01', 'cust-retail-001', 
    '45, Main Street, Matara', 'route-gal-01', 
    CURRENT_TIMESTAMP - INTERVAL '3 days', 
    CURRENT_DATE + INTERVAL '10 days', 
    'Pending', 15000.00, 75.0),
-- Wholesale customer order
('ord-wholesale-001', 'store-gal-01', 'cust-wholesale-001', 
    '123 Galle Road, Galle', 'route-gal-01', 
    CURRENT_TIMESTAMP - INTERVAL '1 day', 
    CURRENT_DATE + INTERVAL '12 days', 
    'Pending', 45000.00, 200.0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO Order_Item (id, order_id, product_id, quantity) VALUES
-- Retail order items
('oi-retail-001-01', 'ord-retail-001', 'prod-det-01', 500),
('oi-retail-001-02', 'ord-retail-001', 'prod-snk-02', 250),
-- Wholesale order items
('oi-wholesale-001-01', 'ord-wholesale-001', 'prod-001', 200),
('oi-wholesale-001-02', 'ord-wholesale-001', 'prod-002', 150),
('oi-wholesale-001-03', 'ord-wholesale-001', 'prod-003', 180),
('oi-wholesale-001-04', 'ord-wholesale-001', 'prod-005', 100)
ON CONFLICT (id) DO NOTHING;

-- Update order summaries
CALL update_order_summary('ord-delivered-001');
CALL update_order_summary('ord-in-transit-001');
CALL update_order_summary('ord-retail-001');
CALL update_order_summary('ord-wholesale-001');

-- ============================================================================
-- 17. TRUCK TRIPS (Insert in chronological order: completed -> scheduled -> in-progress)
-- Each trip uses different workers to avoid conflicts
-- ============================================================================

-- COMPLETED HISTORICAL TRIPS (Insert first to avoid worker status conflicts)
-- Truck trip for delivered order (completed 6 days ago) - driver1 + assistant1
INSERT INTO Truck_Trip (id, truck_id, route_id, driver_id, assistant_id, shipment_id, scheduled_start, scheduled_end, actual_start, actual_end, status) VALUES
('trip-delivered-001', 'truck-001', 'route-cmb-01', '0199e825-7df3-7000-ab6f-71669cef9383', '0199e824-f514-7000-87e6-1bf03af11985', 
    'ship-delivered-001', 
    CURRENT_TIMESTAMP - INTERVAL '6 days', 
    CURRENT_TIMESTAMP - INTERVAL '6 days' + INTERVAL '4 hours',
    CURRENT_TIMESTAMP - INTERVAL '6 days',
    CURRENT_TIMESTAMP - INTERVAL '6 days' + INTERVAL '3 hours 45 minutes',
    'Completed')
ON CONFLICT (id) DO NOTHING;

-- SCHEDULED TRIPS (Future trips - each uses different workers)
-- Scheduled trip 1: driver-002 + assistant-002
INSERT INTO Truck_Trip (id, truck_id, route_id, driver_id, assistant_id, shipment_id, scheduled_start, scheduled_end, status) VALUES
('trip-scheduled-001', 'truck-001', 'route-cmb-01', 'driver-002', 'assistant-002', 
    'ship-at-store-001', 
    CURRENT_TIMESTAMP + INTERVAL '2 hours', 
    CURRENT_TIMESTAMP + INTERVAL '6 hours', 
    'Scheduled'),
-- Scheduled trip 2: driver-003 + assistant-003
('trip-scheduled-002', 'truck-002', 'route-cmb-02', 'driver-003', 'assistant-003', 
    'ship-at-store-002', 
    CURRENT_TIMESTAMP + INTERVAL '4 hours', 
    CURRENT_TIMESTAMP + INTERVAL '9 hours', 
    'Scheduled')
ON CONFLICT (id) DO NOTHING;

-- IN-PROGRESS TRIPS (Currently active - each uses different workers)
-- In-progress trip 1 (for customer portal testing): driver-004 + assistant-004
INSERT INTO Truck_Trip (id, truck_id, route_id, driver_id, assistant_id, shipment_id, scheduled_start, scheduled_end, actual_start, status) VALUES
('trip-in-transit-001', 'truck-002', 'route-cmb-02', 'driver-004', 'assistant-004', 
    'ship-in-transit-001', 
    CURRENT_TIMESTAMP - INTERVAL '2 hours', 
    CURRENT_TIMESTAMP + INTERVAL '2 hours',
    CURRENT_TIMESTAMP - INTERVAL '2 hours',
    'In_Progress')
ON CONFLICT (id) DO NOTHING;

-- In-progress trip 2 (for store manager testing): driver-005 (no assistant)
INSERT INTO Truck_Trip (id, truck_id, route_id, driver_id, assistant_id, shipment_id, scheduled_start, scheduled_end, actual_start, status) VALUES
('trip-in-progress-001', 'truck-003', 'route-cmb-01', 'driver-005', NULL, 
    'ship-at-store-003', 
    CURRENT_TIMESTAMP - INTERVAL '1 hour', 
    CURRENT_TIMESTAMP + INTERVAL '3 hours',
    CURRENT_TIMESTAMP - INTERVAL '1 hour', 
    'In_Progress')
ON CONFLICT (id) DO NOTHING;

-- Mark workers as Busy for in-progress trips only
UPDATE Worker SET status = 'Busy' WHERE id IN ('driver-004', 'assistant-004', 'driver-005');

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- This seed file creates:
-- - 6 Cities
-- - 4 Routes with stops
-- - 12 Products (8 basic + 4 additional for customer portal)
-- - 3 Stores (1 managed by test store manager: Colombo Central Store)
-- - 3 Customers (1 test, 1 retail, 1 wholesale)
-- - 11 Workers (1 Dispatcher, 5 Drivers, 4 Assistants, 1 Store Manager)
-- - 3 Trains
-- - 3 Trucks
-- - 4 Future train trips
-- - Multiple orders in various states (Pending, At_Store, In_Train_Transit, In_Truck_Transit, Delivered)
-- - Shipments and truck trips with complete status history
-- - 5 Truck trips total (1 Completed, 2 Scheduled, 2 In-Progress)
-- - Each truck trip uses different workers (no conflicts)
-- - 2 In-Transit shipments arriving at Colombo (for incoming deliveries testing)
--
-- Test Credentials:
-- Customer Portal:
--   - customer1 / password123 (Wholesale, multiple orders in different states)
--   - retailcust1 / password123 (Retail, one pending order)
--   - wholesalecust1 / password123 (Wholesale, one pending order)
-- Store Manager:
--   - manager2 / password123 (Manages Colombo Central Store)
-- Dispatcher:
--   - dispatcher1 / password123
--
-- Worker Assignments (No Conflicts):
--   - driver1 + assistant1: trip-delivered-001 (Completed)
--   - driver-002 + assistant-002: trip-scheduled-001 (Scheduled)
--   - driver-003 + assistant-003: trip-scheduled-002 (Scheduled)
--   - driver-004 + assistant-004: trip-in-transit-001 (In-Progress) [BUSY]
--   - driver-005: trip-in-progress-001 (In-Progress) [BUSY]
-- ============================================================================
