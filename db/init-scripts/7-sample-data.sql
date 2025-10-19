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
-- Customer User
INSERT INTO "User" (id, username, name, password, role) VALUES
('0199e745-ca10-7000-b4fe-5f5f56f4f7e4', 'customer1', 'Test Customer', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer')
ON CONFLICT (id) DO NOTHING;

-- Worker Users
INSERT INTO "User" (id, username, name, password, role) VALUES
('0199e825-4ae5-7000-9d86-8be81708d4f1', 'manager2', 'Test Store Manager 2', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('worker-mgr-001', 'manager1', 'Test Store Manager', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('0199e825-7df3-7000-ab6f-71669cef9383', 'driver1', 'Test Driver', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('0199e824-f514-7000-87e6-1bf03af11985', 'assistant1', 'Test Assistant', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('0199e7bd-d5f8-7000-9fd6-f2a853034f88', 'dispatcher1', 'Test Dispatcher', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker')
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
('prod-008', 'Soap Bar', 120.00, 0.3)
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
ON CONFLICT (id) DO NOTHING;

INSERT INTO Driver (id, consecutive_deliveries) VALUES
('0199e825-7df3-7000-ab6f-71669cef9383', 0)
ON CONFLICT (id) DO NOTHING;

-- Assistant
INSERT INTO Worker (id, type, hourly_pay, status, weekly_hours) VALUES
('0199e824-f514-7000-87e6-1bf03af11985', 'Assistant', 1200.00, 'Free', 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO Assistant (id, consecutive_routes) VALUES
('0199e824-f514-7000-87e6-1bf03af11985', 0)
ON CONFLICT (id) DO NOTHING;

-- Manager
INSERT INTO Worker (id, type, hourly_pay, status, weekly_hours) VALUES
('0199e825-4ae5-7000-9d86-8be81708d4f1', 'Store_Manager', 2500.00, 'Free', 0)
ON CONFLICT (id) DO NOTHING;


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
('0199e745-ca10-7000-b4fe-5f5f56f4f7e4', 'Wholesale', 'Main Street', 'Colombo', '00100', '+94771234567')
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
-- VERIFICATION QUERIES (For testing)
-- ============================================================================
-- Uncomment these to verify data after running the script

-- SELECT COUNT(*) as pending_orders FROM "Order" WHERE status = 'Pending';
-- SELECT COUNT(*) as train_trips FROM Train_Trip WHERE scheduled_departure > NOW();
-- SELECT COUNT(*) as at_store_orders FROM "Order" WHERE status = 'At_Store';
-- SELECT * FROM Worker WHERE type IN ('Driver', 'Assistant', 'Dispatcher');
-- SELECT * FROM Truck;

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- This seed file creates:
-- - 6 Cities
-- - 4 Routes with stops
-- - 8 Products
-- - 3 Stores (1 managed by test store manager)
-- - 1 Customer
-- - 4 Workers (1 Dispatcher, 1 Driver, 1 Assistant, 1 Store Manager)
-- - 3 Trains
-- - 3 Trucks
-- - 4 Future train trips
-- - 4 Pending orders (ready for dispatcher to schedule)
-- - 1 At_Store order (ready for truck scheduling)
-- ============================================================================
-- ======================
-- Sample data: Drivers
-- ======================
-- Create sample users who are also workers/drivers
INSERT INTO "User" (id, username, name, password, role)
VALUES
  ('user-driver-1', 'driver.john', 'John Doe', 'password-hash-1', 'Worker'),
  ('user-driver-2', 'driver.sara', 'Sara Miles', 'password-hash-2', 'Worker')
ON CONFLICT (id) DO NOTHING;

-- Create corresponding Worker rows
INSERT INTO Worker (id, type, hourly_pay, status, weekly_hours)
VALUES
  ('user-driver-1', 'Driver', 18.50, 'Free', 10),
  ('user-driver-2', 'Driver', 20.00, 'Free', 5)
ON CONFLICT (id) DO NOTHING;

-- Promote to Driver speciality table
INSERT INTO Driver (id, consecutive_deliveries)
VALUES
  ('user-driver-1', 0),
  ('user-driver-2', 0)
ON CONFLICT (id) DO NOTHING;

-- Sample trucks
INSERT INTO Truck (id, vehicle_no)
VALUES
  ('truck-1', 'TN-01-TR-1001'),
  ('truck-2', 'TN-01-TR-1002')
ON CONFLICT (id) DO NOTHING;

-- Sample cities and route used by truck trips
INSERT INTO City (id, name)
VALUES
  ('city-1', 'Springfield'),
  ('city-2', 'Shelbyville')
ON CONFLICT (id) DO NOTHING;

INSERT INTO Route (id, name, max_delivery_time_hours, area)
VALUES
  ('route-1', 'Springfield - Shelbyville', 5, 'Central'),
  ('route-2', 'Shelbyville - Springfield', 5, 'Central')
ON CONFLICT (id) DO NOTHING;

-- Sample train trip & shipment (so truck_trip can reference a shipment if needed)
INSERT INTO Train (id, name)
VALUES ('train-1', 'InterCity-1') ON CONFLICT (id) DO NOTHING;

INSERT INTO Train_Trip (id, train_id, from_city_id, to_city_id, scheduled_departure, scheduled_arrival, capacity_units, allocated_units)
VALUES (
  'traintrip-1', 'train-1', 'city-1', 'city-2', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '6 hours', 1000, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO Shipment (id, order_id, train_trip_id, allocated_space_units, shipped_quantity, status)
VALUES ('shipment-1', NULL, 'traintrip-1', 100, 10, 'Pending') ON CONFLICT (id) DO NOTHING;

-- Sample truck trip assigning driver to a truck and route
INSERT INTO Truck_Trip (id, truck_id, route_id, driver_id, assistant_id, shipment_id, scheduled_start, scheduled_end, status)
VALUES (
  'trucktrip-1', 'truck-1', 'route-1', 'user-driver-1', NULL, 'shipment-1', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '4 hours', 'Scheduled'
) ON CONFLICT (id) DO NOTHING;

-- Worker record for the driver (hours worked for the trip)
INSERT INTO Worker_Record (id, worker_id, "date", hours_worked, assignment_type, truck_trip_id)
VALUES (
  'wrec-1', 'user-driver-1', (NOW() + INTERVAL '2 days')::date, 4, 'Truck_Trip', 'trucktrip-1'
) ON CONFLICT (id) DO NOTHING;

-- Another driver and trip sample
INSERT INTO "User" (id, username, name, password, role)
VALUES ('user-driver-3', 'driver.lee', 'Lee Chan', 'password-hash-3', 'Worker') ON CONFLICT (id) DO NOTHING;
INSERT INTO Worker (id, type, hourly_pay, status, weekly_hours)
VALUES ('user-driver-3', 'Driver', 19.00, 'Free', 0) ON CONFLICT (id) DO NOTHING;
INSERT INTO Driver (id, consecutive_deliveries)
VALUES ('user-driver-3', 0) ON CONFLICT (id) DO NOTHING;
INSERT INTO Truck_Trip (id, truck_id, route_id, driver_id, assistant_id, shipment_id, scheduled_start, scheduled_end, status)
VALUES (
  'trucktrip-2', 'truck-2', 'route-2', 'user-driver-3', NULL, NULL, NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '3 hours', 'Scheduled'
) ON CONFLICT (id) DO NOTHING;
