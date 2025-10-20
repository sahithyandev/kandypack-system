INSERT INTO system_configuration (config_key, config_value, description)
VALUES 
    ('DRIVER_WEEKLY_HOUR_LIMIT', '40', 'Maximum weekly working hours for a driver.'),
    ('ASSISTANT_WEEKLY_HOUR_LIMIT', '60', 'Maximum weekly working hours for an assistant.'),
    ('DRIVER_CONSECUTIVE_TRIP_LIMIT', '1', 'Maximum consecutive trips for a driver before a break is required.'),
    ('ASSISTANT_CONSECUTIVE_TRIP_LIMIT', '2', 'Maximum consecutive routes for an assistant before a break is required.') 
ON CONFLICT (config_key) DO NOTHING;

-- ============================================================================
-- 1. USERS (All passwords are: password123)
-- ============================================================================
-- Customer User
INSERT INTO "User" (id, username, name, password, role) VALUES
('customer-001', 'customer1', 'Test Customer', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
('customer-002', 'customer2', 'Wholesale Retailer Co.', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
('customer-003', 'customer3', 'Southern Traders', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
('customer-004', 'customer4', 'Northern Distributors', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
('customer-005', 'customer5', 'Central Province Stores', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer')
ON CONFLICT (id) DO NOTHING;

-- Worker Users
INSERT INTO "User" (id, username, name, password, role) VALUES
('worker-mgr-002', 'manager2', 'Test Store Manager 2', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('worker-mgr-001', 'manager1', 'Test Store Manager', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('worker-mgr-003', 'manager3', 'Kandy Store Manager', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('driver-001', 'driver1', 'Test Driver', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('driver-002', 'driver2', 'Second Driver', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('driver-003', 'driver3', 'Third Driver', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('driver-004', 'driver4', 'Fourth Driver', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('driver-005', 'driver5', 'Fifth Driver', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('assistant-001', 'assistant1', 'Test Assistant', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('assistant-002', 'assistant2', 'Second Assistant', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('assistant-003', 'assistant3', 'Third Assistant', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('assistant-004', 'assistant4', 'Fourth Assistant', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
('dispatcher-001', 'dispatcher1', 'Test Dispatcher', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker')
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
('city-kur', 'Kurunegala'),
('city-mtr', 'Matara'),
('city-tri', 'Trincomalee'),
('city-bad', 'Badulla'),
('city-anu', 'Anuradhapura'),
('city-kal', 'Kalutara'),
('city-nuw', 'Nuwara Eliya'),
('city-amp', 'Ampara'),
('city-pol', 'Polonnaruwa')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. ROUTES
-- ============================================================================
INSERT INTO Route (id, name, max_delivery_time_hours, area) VALUES
('route-cmb-01', 'Colombo Fort Area', 4.0, 'Colombo District'),
('route-cmb-02', 'Colombo South', 5.0, 'Colombo District'),
('route-cmb-03', 'Colombo North', 4.0, 'Colombo District'),
('route-cmb-04', 'Colombo East Suburbs', 4.5, 'Colombo District'),
('route-neg-01', 'Negombo Coastal', 3.5, 'Gampaha District'),
('route-neg-02', 'Negombo Inland', 4.5, 'Gampaha District'),
('route-gal-01', 'Galle City', 6.0, 'Galle District'),
('route-gal-02', 'Galle Coastal Ring', 6.0, 'Galle District'),
('route-kdy-01', 'Kandy City Circle', 3.0, 'Kandy District'),
('route-kdy-02', 'Kandy Hill Country', 5.0, 'Kandy District'),
('route-jaf-01', 'Jaffna Town', 6.0, 'Jaffna District'),
('route-tri-01', 'Trinco Bay', 7.0, 'Trincomalee District'),
('route-mtr-01', 'Matara Southern', 5.5, 'Matara District'),
('route-kur-01', 'Kurunegala Central', 4.0, 'Kurunegala District'),
('route-anu-01', 'Anuradhapura Ancient City', 5.0, 'Anuradhapura District')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3. ROUTE STOPS
-- ============================================================================
INSERT INTO Route_Stop (id, route_id, city_id, stop_order) VALUES
('rs-cmb-01-1', 'route-cmb-01', 'city-cmb', 1),
('rs-cmb-02-1', 'route-cmb-02', 'city-cmb', 1),
('rs-cmb-03-1', 'route-cmb-03', 'city-cmb', 1),
('rs-cmb-04-1', 'route-cmb-04', 'city-cmb', 1),
('rs-neg-01-1', 'route-neg-01', 'city-neg', 1),
('rs-neg-02-1', 'route-neg-02', 'city-neg', 1),
('rs-gal-01-1', 'route-gal-01', 'city-gal', 1),
('rs-gal-02-1', 'route-gal-02', 'city-gal', 1),
('rs-kdy-01-1', 'route-kdy-01', 'city-kdy', 1),
('rs-kdy-02-1', 'route-kdy-02', 'city-kdy', 1),
('rs-jaf-01-1', 'route-jaf-01', 'city-jaf', 1),
('rs-tri-01-1', 'route-tri-01', 'city-tri', 1),
('rs-mtr-01-1', 'route-mtr-01', 'city-mtr', 1),
('rs-kur-01-1', 'route-kur-01', 'city-kur', 1),
('rs-anu-01-1', 'route-anu-01', 'city-anu', 1)
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
('prod-009', 'Dhal 1kg', 280.00, 1.0),
('prod-010', 'Pasta 500g', 320.00, 0.7),
('prod-011', 'Salt 1kg', 80.00, 0.8),
('prod-012', 'Instant Noodles', 90.00, 0.4)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 7. WORKER DATA
-- ============================================================================
-- Dispatcher
INSERT INTO Worker (id, type, hourly_pay, status, weekly_hours) VALUES
('dispatcher-001', 'Dispatcher', 2500.00, 'Free', 0)
ON CONFLICT (id) DO NOTHING;

-- Drivers
INSERT INTO Worker (id, type, hourly_pay, status, weekly_hours) VALUES
('driver-001', 'Driver', 1500.00, 'Free', 0),
('driver-002', 'Driver', 1500.00, 'Free', 0),
('driver-003', 'Driver', 1500.00, 'Free', 0),
('driver-004', 'Driver', 1600.00, 'Free', 0),
('driver-005', 'Driver', 1550.00, 'Free', 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO Driver (id, consecutive_deliveries) VALUES
('driver-001', 0),
('driver-002', 0),
('driver-003', 0),
('driver-004', 0),
('driver-005', 0)
ON CONFLICT (id) DO NOTHING;

-- Assistants
INSERT INTO Worker (id, type, hourly_pay, status, weekly_hours) VALUES
('assistant-001', 'Assistant', 1200.00, 'Free', 0),
('assistant-002', 'Assistant', 1200.00, 'Free', 0),
('assistant-003', 'Assistant', 1250.00, 'Free', 0),
('assistant-004', 'Assistant', 1200.00, 'Free', 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO Assistant (id, consecutive_routes) VALUES
('assistant-001', 0),
('assistant-002', 0),
('assistant-003', 0),
('assistant-004', 0)
ON CONFLICT (id) DO NOTHING;

-- Store Managers
INSERT INTO Worker (id, type, hourly_pay, status, weekly_hours) VALUES
('worker-mgr-002', 'Store_Manager', 2500.00, 'Free', 0),
('worker-mgr-001', 'Store_Manager', 2500.00, 'Free', 0),
('worker-mgr-003', 'Store_Manager', 2500.00, 'Free', 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO Store_Manager (id) VALUES
('worker-mgr-002'),
('worker-mgr-001'),
('worker-mgr-003')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 5. STORES
-- ============================================================================

INSERT INTO Store (id, name, city_id, managed_by) VALUES
('store-cmb-01', 'Colombo Central Store', 'city-cmb', 'worker-mgr-002'),
('store-kdy-01', 'Kandy Main Store', 'city-kdy', 'worker-mgr-003'),
('store-gal-01', 'Galle Store', 'city-gal', 'worker-mgr-001'),
('store-neg-01', 'Negombo Store', 'city-neg', NULL),
('store-jaf-01', 'Jaffna Store', 'city-jaf', NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 6. CUSTOMER DATA
-- ============================================================================
INSERT INTO Customer (id, type, street_name, city, postal_code, phone_no) VALUES
('customer-001', 'Wholesale', 'Main Street', 'Colombo', '00100', '+94771234567'),
('customer-002', 'Wholesale', 'Galle Road', 'Colombo', '00300', '+94772345678'),
('customer-003', 'Retail', 'Beach Road', 'Galle', '80000', '+94773456789'),
('customer-004', 'Wholesale', 'Hospital Road', 'Jaffna', '40000', '+94774567890'),
('customer-005', 'Retail', 'Temple Street', 'Kandy', '20000', '+94775678901')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 8. TRAINS
-- ============================================================================
INSERT INTO Train (id, name) VALUES
('train-001', 'Udarata Menike'),
('train-002', 'Rajarata Rejina'),
('train-003', 'Ruhunu Kumari'),
('train-004', 'Yal Devi'),
('train-005', 'Podi Menike')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 9. TRUCKS
-- ============================================================================
INSERT INTO Truck (id, vehicle_no) VALUES
('truck-001', 'CBA-1234'),
('truck-002', 'CP-5678'),
('truck-003', 'WP-9012'),
('truck-004', 'CBA-3456'),
('truck-005', 'KY-7890'),
('truck-006', 'GA-2345'),
('truck-007', 'NB-6789'),
('truck-008', 'JA-0123')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 10. TRAIN TRIPS (Future scheduled trips)
-- ============================================================================
-- Note: Adjust dates to be in the future relative to when you run this
INSERT INTO Train_Trip (id, train_id, from_city_id, to_city_id, scheduled_departure, scheduled_arrival, capacity_units, allocated_units) VALUES
-- Colombo to other cities
('tt-cmb-kdy-001', 'train-001', 'city-cmb', 'city-kdy', 
    CURRENT_TIMESTAMP + INTERVAL '1 day 6 hours', 
    CURRENT_TIMESTAMP + INTERVAL '1 day 9 hours', 
    500.0, 0.0),
('tt-cmb-kdy-002', 'train-001', 'city-cmb', 'city-kdy', 
    CURRENT_TIMESTAMP + INTERVAL '2 days 14 hours', 
    CURRENT_TIMESTAMP + INTERVAL '2 days 17 hours', 
    500.0, 0.0),
('tt-cmb-gal-001', 'train-003', 'city-cmb', 'city-gal', 
    CURRENT_TIMESTAMP + INTERVAL '1 day 8 hours', 
    CURRENT_TIMESTAMP + INTERVAL '1 day 12 hours', 
    400.0, 0.0),
('tt-cmb-gal-002', 'train-003', 'city-cmb', 'city-gal', 
    CURRENT_TIMESTAMP + INTERVAL '3 days 8 hours', 
    CURRENT_TIMESTAMP + INTERVAL '3 days 12 hours', 
    400.0, 0.0),
('tt-cmb-jaf-001', 'train-004', 'city-cmb', 'city-jaf', 
    CURRENT_TIMESTAMP + INTERVAL '2 days 5 hours', 
    CURRENT_TIMESTAMP + INTERVAL '2 days 15 hours', 
    600.0, 0.0),
('tt-cmb-jaf-002', 'train-004', 'city-cmb', 'city-jaf', 
    CURRENT_TIMESTAMP + INTERVAL '5 days 5 hours', 
    CURRENT_TIMESTAMP + INTERVAL '5 days 15 hours', 
    600.0, 0.0),
('tt-cmb-bad-001', 'train-005', 'city-cmb', 'city-bad', 
    CURRENT_TIMESTAMP + INTERVAL '3 days 7 hours', 
    CURRENT_TIMESTAMP + INTERVAL '3 days 15 hours', 
    350.0, 0.0),

-- Return trips (reverse direction)
('tt-kdy-cmb-001', 'train-001', 'city-kdy', 'city-cmb', 
    CURRENT_TIMESTAMP + INTERVAL '1 day 18 hours', 
    CURRENT_TIMESTAMP + INTERVAL '1 day 21 hours', 
    500.0, 0.0),
('tt-kdy-cmb-002', 'train-001', 'city-kdy', 'city-cmb', 
    CURRENT_TIMESTAMP + INTERVAL '4 days 6 hours', 
    CURRENT_TIMESTAMP + INTERVAL '4 days 9 hours', 
    500.0, 0.0),
('tt-gal-cmb-001', 'train-003', 'city-gal', 'city-cmb', 
    CURRENT_TIMESTAMP + INTERVAL '2 days 6 hours', 
    CURRENT_TIMESTAMP + INTERVAL '2 days 10 hours', 
    400.0, 0.0),
('tt-jaf-cmb-001', 'train-004', 'city-jaf', 'city-cmb', 
    CURRENT_TIMESTAMP + INTERVAL '3 days 6 hours', 
    CURRENT_TIMESTAMP + INTERVAL '3 days 16 hours', 
    600.0, 0.0),

-- Inter-city routes (not involving Colombo)
('tt-kdy-gal-001', 'train-001', 'city-kdy', 'city-gal', 
    CURRENT_TIMESTAMP + INTERVAL '2 days 10 hours', 
    CURRENT_TIMESTAMP + INTERVAL '2 days 16 hours', 
    450.0, 0.0),
('tt-gal-kdy-001', 'train-003', 'city-gal', 'city-kdy', 
    CURRENT_TIMESTAMP + INTERVAL '3 days 11 hours', 
    CURRENT_TIMESTAMP + INTERVAL '3 days 17 hours', 
    450.0, 0.0),
('tt-kdy-jaf-001', 'train-002', 'city-kdy', 'city-jaf', 
    CURRENT_TIMESTAMP + INTERVAL '4 days 8 hours', 
    CURRENT_TIMESTAMP + INTERVAL '4 days 16 hours', 
    500.0, 0.0),

-- Additional routes for thorough coverage
('tt-cmb-anu-001', 'train-002', 'city-cmb', 'city-anu', 
    CURRENT_TIMESTAMP + INTERVAL '2 days 7 hours', 
    CURRENT_TIMESTAMP + INTERVAL '2 days 12 hours', 
    550.0, 0.0),
('tt-cmb-tri-001', 'train-002', 'city-cmb', 'city-tri', 
    CURRENT_TIMESTAMP + INTERVAL '4 days 9 hours', 
    CURRENT_TIMESTAMP + INTERVAL '4 days 17 hours', 
    500.0, 0.0),
('tt-cmb-mtr-001', 'train-003', 'city-cmb', 'city-mtr', 
    CURRENT_TIMESTAMP + INTERVAL '3 days 10 hours', 
    CURRENT_TIMESTAMP + INTERVAL '3 days 16 hours', 
    400.0, 0.0),
('tt-cmb-neg-001', 'train-005', 'city-cmb', 'city-neg', 
    CURRENT_TIMESTAMP + INTERVAL '1 day 10 hours', 
    CURRENT_TIMESTAMP + INTERVAL '1 day 11 hours', 
    300.0, 0.0),
('tt-neg-cmb-001', 'train-005', 'city-neg', 'city-cmb', 
    CURRENT_TIMESTAMP + INTERVAL '2 days 16 hours', 
    CURRENT_TIMESTAMP + INTERVAL '2 days 17 hours', 
    300.0, 0.0),
('tt-kdy-anu-001', 'train-002', 'city-kdy', 'city-anu', 
    CURRENT_TIMESTAMP + INTERVAL '5 days 8 hours', 
    CURRENT_TIMESTAMP + INTERVAL '5 days 12 hours', 
    450.0, 0.0)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 11. PENDING ORDERS (For dispatcher to schedule)
-- ============================================================================
INSERT INTO "Order" (id, store_id, customer_id, delivery_address, route_id, placed_on, required_delivery_date, status, total_value, total_space_units) 
VALUES 
-- PENDING ORDERS (15 orders)
('ord-pend-001', 'store-cmb-01', 'customer-001', 'Keells Super, Galle Road', 'route-cmb-01', NOW() - INTERVAL '2 hours', CURRENT_DATE + INTERVAL '7 days', 'Pending', 8500.00, 45.5),
('ord-pend-002', 'store-cmb-01', 'customer-002', 'Cargills Food City, Colombo 03', 'route-cmb-02', NOW() - INTERVAL '1 day', CURRENT_DATE + INTERVAL '8 days', 'Pending', 12000.00, 65.0),
('ord-pend-003', 'store-cmb-01', 'customer-002', 'Arpico Supercentre, Colombo 05', 'route-cmb-03', NOW() - INTERVAL '3 hours', CURRENT_DATE + INTERVAL '9 days', 'Pending', 9200.00, 50.0),
('ord-pend-004', 'store-cmb-01', 'customer-001', 'Laugfs Supermarket, Colombo 04', 'route-cmb-04', NOW() - INTERVAL '5 hours', CURRENT_DATE + INTERVAL '10 days', 'Pending', 7800.00, 42.0),
('ord-pend-005', 'store-gal-01', 'customer-003', 'City Mart, Galle', 'route-gal-01', NOW() - INTERVAL '6 hours', CURRENT_DATE + INTERVAL '8 days', 'Pending', 6500.00, 35.0),
('ord-pend-006', 'store-gal-01', 'customer-003', 'Sathosa, Galle Fort', 'route-gal-02', NOW() - INTERVAL '4 hours', CURRENT_DATE + INTERVAL '9 days', 'Pending', 8900.00, 48.0),
('ord-pend-007', 'store-kdy-01', 'customer-005', 'Lanka Sathosa, Kandy City', 'route-kdy-01', NOW() - INTERVAL '8 hours', CURRENT_DATE + INTERVAL '7 days', 'Pending', 9500.00, 52.0),
('ord-pend-008', 'store-kdy-01', 'customer-005', 'Cargills, Kandy', 'route-kdy-02', NOW() - INTERVAL '12 hours', CURRENT_DATE + INTERVAL '11 days', 'Pending', 11200.00, 60.0),
('ord-pend-009', 'store-neg-01', 'customer-002', 'Fish Market Store, Negombo', 'route-neg-01', NOW() - INTERVAL '2 hours', CURRENT_DATE + INTERVAL '7 days', 'Pending', 5600.00, 30.0),
('ord-pend-010', 'store-neg-01', 'customer-001', 'Negombo Town Center', 'route-neg-02', NOW() - INTERVAL '10 hours', CURRENT_DATE + INTERVAL '12 days', 'Pending', 7200.00, 39.0),
('ord-pend-011', 'store-jaf-01', 'customer-004', 'Jaffna Central Market', 'route-jaf-01', NOW() - INTERVAL '1 day', CURRENT_DATE + INTERVAL '14 days', 'Pending', 13500.00, 72.0),
('ord-pend-012', 'store-cmb-01', 'customer-002', 'Wellawatte Market', 'route-cmb-02', NOW() - INTERVAL '15 hours', CURRENT_DATE + INTERVAL '8 days', 'Pending', 8800.00, 47.0),
('ord-pend-013', 'store-gal-01', 'customer-003', 'Matara Road Store', 'route-gal-01', NOW() - INTERVAL '7 hours', CURRENT_DATE + INTERVAL '10 days', 'Pending', 6900.00, 37.0),
('ord-pend-014', 'store-kdy-01', 'customer-005', 'Peradeniya Shop', 'route-kdy-02', NOW() - INTERVAL '9 hours', CURRENT_DATE + INTERVAL '9 days', 'Pending', 10200.00, 55.0),
('ord-pend-015', 'store-cmb-01', 'customer-001', 'Mount Lavinia Store', 'route-cmb-03', NOW() - INTERVAL '11 hours', CURRENT_DATE + INTERVAL '13 days', 'Pending', 9700.00, 53.0),

-- IN_TRAIN_TRANSIT ORDERS (10 orders)
('ord-transit-001', 'store-cmb-01', 'customer-002', 'Dehiwala Market', 'route-cmb-01', NOW() - INTERVAL '2 days', CURRENT_DATE + INTERVAL '6 days', 'In_Train_Transit', 7500.00, 40.0),
('ord-transit-002', 'store-cmb-01', 'customer-001', 'Nugegoda Super', 'route-cmb-02', NOW() - INTERVAL '3 days', CURRENT_DATE + INTERVAL '8 days', 'In_Train_Transit', 8900.00, 48.0),
('ord-transit-003', 'store-kdy-01', 'customer-005', 'Ampitiya Store', 'route-kdy-01', NOW() - INTERVAL '2 days', CURRENT_DATE + INTERVAL '7 days', 'In_Train_Transit', 6200.00, 33.0),
('ord-transit-004', 'store-gal-01', 'customer-003', 'Hikkaduwa Beach Shop', 'route-gal-02', NOW() - INTERVAL '1 day', CURRENT_DATE + INTERVAL '8 days', 'In_Train_Transit', 5800.00, 31.0),
('ord-transit-005', 'store-neg-01', 'customer-002', 'Wattala Store', 'route-neg-02', NOW() - INTERVAL '2 days', CURRENT_DATE + INTERVAL '8 days', 'In_Train_Transit', 7100.00, 38.0),
('ord-transit-006', 'store-cmb-01', 'customer-002', 'Bambalapitiya Market', 'route-cmb-04', NOW() - INTERVAL '3 days', CURRENT_DATE + INTERVAL '8 days', 'In_Train_Transit', 9300.00, 50.0),
('ord-transit-007', 'store-kdy-01', 'customer-005', 'Gampola Store', 'route-kdy-02', NOW() - INTERVAL '2 days', CURRENT_DATE + INTERVAL '9 days', 'In_Train_Transit', 8600.00, 46.0),
('ord-transit-008', 'store-gal-01', 'customer-003', 'Unawatuna Shop', 'route-gal-01', NOW() - INTERVAL '1 day', CURRENT_DATE + INTERVAL '7 days', 'In_Train_Transit', 6800.00, 36.0),
('ord-transit-009', 'store-jaf-01', 'customer-004', 'Nallur Market', 'route-jaf-01', NOW() - INTERVAL '4 days', CURRENT_DATE + INTERVAL '10 days', 'In_Train_Transit', 12500.00, 67.0),
('ord-transit-010', 'store-cmb-01', 'customer-001', 'Kiribathgoda Store', 'route-cmb-03', NOW() - INTERVAL '2 days', CURRENT_DATE + INTERVAL '8 days', 'In_Train_Transit', 7900.00, 42.0),

-- AT_STORE ORDERS (12 orders)
('ord-store-001', 'store-cmb-01', 'customer-002', 'Kollupitiya Market', 'route-cmb-01', NOW() - INTERVAL '3 days', CURRENT_DATE + INTERVAL '5 days', 'At_Store', 6500.00, 35.0),
('ord-store-002', 'store-cmb-01', 'customer-001', 'Borella Junction Store', 'route-cmb-02', NOW() - INTERVAL '2 days', CURRENT_DATE + INTERVAL '6 days', 'At_Store', 7800.00, 42.0),
('ord-store-003', 'store-cmb-01', 'customer-002', 'Maradana Market', 'route-cmb-03', NOW() - INTERVAL '1 day', CURRENT_DATE + INTERVAL '7 days', 'At_Store', 8200.00, 44.0),
('ord-store-004', 'store-cmb-01', 'customer-001', 'Rajagiriya Store', 'route-cmb-04', NOW() - INTERVAL '4 days', CURRENT_DATE + INTERVAL '8 days', 'At_Store', 9100.00, 49.0),
('ord-store-005', 'store-kdy-01', 'customer-005', 'Katugastota Market', 'route-kdy-01', NOW() - INTERVAL '2 days', CURRENT_DATE + INTERVAL '8 days', 'At_Store', 7200.00, 39.0),
('ord-store-006', 'store-kdy-01', 'customer-005', 'Matale Road Store', 'route-kdy-02', NOW() - INTERVAL '3 days', CURRENT_DATE + INTERVAL '8 days', 'At_Store', 8500.00, 46.0),
('ord-store-007', 'store-gal-01', 'customer-003', 'Karapitiya Store', 'route-gal-01', NOW() - INTERVAL '1 day', CURRENT_DATE + INTERVAL '8 days', 'At_Store', 6200.00, 33.0),
('ord-store-008', 'store-gal-01', 'customer-003', 'Ahangama Shop', 'route-gal-02', NOW() - INTERVAL '2 days', CURRENT_DATE + INTERVAL '7 days', 'At_Store', 7600.00, 41.0),
('ord-store-009', 'store-neg-01', 'customer-002', 'Katunayake Store', 'route-neg-01', NOW() - INTERVAL '1 day', CURRENT_DATE + INTERVAL '8 days', 'At_Store', 5900.00, 32.0),
('ord-store-010', 'store-neg-01', 'customer-001', 'Ja-Ela Market', 'route-neg-02', NOW() - INTERVAL '3 days', CURRENT_DATE + INTERVAL '8 days', 'At_Store', 6700.00, 36.0),
('ord-store-011', 'store-cmb-01', 'customer-002', 'Kotte Municipal Store', 'route-cmb-01', NOW() - INTERVAL '2 days', CURRENT_DATE + INTERVAL '8 days', 'At_Store', 8900.00, 48.0),
('ord-store-012', 'store-cmb-01', 'customer-001', 'Maharagama Shop', 'route-cmb-02', NOW() - INTERVAL '1 day', CURRENT_DATE + INTERVAL '7 days', 'At_Store', 7400.00, 40.0),

-- IN_TRUCK_TRANSIT ORDERS (5 orders)
('ord-truck-001', 'store-cmb-01', 'customer-002', 'Pettah Market Center', 'route-cmb-01', NOW() - INTERVAL '4 days', CURRENT_DATE + INTERVAL '8 days', 'In_Truck_Transit', 9500.00, 51.0),
('ord-truck-002', 'store-kdy-01', 'customer-005', 'Kandy Central Market', 'route-kdy-01', NOW() - INTERVAL '3 days', CURRENT_DATE + INTERVAL '8 days', 'In_Truck_Transit', 8700.00, 47.0),
('ord-truck-003', 'store-gal-01', 'customer-003', 'Galle Fort Store', 'route-gal-01', NOW() - INTERVAL '2 days', CURRENT_DATE + INTERVAL '8 days', 'In_Truck_Transit', 7300.00, 39.0),
('ord-truck-004', 'store-neg-01', 'customer-002', 'Negombo Fish Market', 'route-neg-01', NOW() - INTERVAL '1 day', CURRENT_DATE + INTERVAL '8 days', 'In_Truck_Transit', 6400.00, 34.0),
('ord-truck-005', 'store-cmb-01', 'customer-001', 'Wellawatte Station Store', 'route-cmb-03', NOW() - INTERVAL '2 days', CURRENT_DATE + INTERVAL '8 days', 'In_Truck_Transit', 8100.00, 43.0),

-- DELIVERED ORDERS (3 orders)
('ord-deliv-001', 'store-cmb-01', 'customer-002', 'Union Place Market', 'route-cmb-01', NOW() - INTERVAL '10 days', CURRENT_DATE - INTERVAL '2 days', 'Delivered', 7800.00, 42.0),
('ord-deliv-002', 'store-kdy-01', 'customer-005', 'Peradeniya University Store', 'route-kdy-02', NOW() - INTERVAL '12 days', CURRENT_DATE - INTERVAL '3 days', 'Delivered', 9200.00, 50.0),
('ord-deliv-003', 'store-gal-01', 'customer-003', 'Koggala Store', 'route-gal-02', NOW() - INTERVAL '8 days', CURRENT_DATE - INTERVAL '1 day', 'Delivered', 6600.00, 35.0)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 12. ORDER ITEMS
-- ============================================================================
INSERT INTO Order_Item (id, order_id, product_id, quantity) VALUES
-- Pending Orders Items
-- Order 1 items (ord-pend-001)
('oi-p001-01', 'ord-pend-001', 'prod-001', 30),  -- Rice
('oi-p001-02', 'ord-pend-001', 'prod-002', 50),  -- Sugar
('oi-p001-03', 'ord-pend-001', 'prod-005', 20),  -- Cooking Oil

-- Order 2 items (ord-pend-002)
('oi-p002-01', 'ord-pend-002', 'prod-001', 50),  -- Rice
('oi-p002-02', 'ord-pend-002', 'prod-003', 40),  -- Flour
('oi-p002-03', 'ord-pend-002', 'prod-004', 30),  -- Milk Powder

-- Order 3 items (ord-pend-003)
('oi-p003-01', 'ord-pend-003', 'prod-006', 80),  -- Tea
('oi-p003-02', 'ord-pend-003', 'prod-007', 100), -- Biscuits
('oi-p003-03', 'ord-pend-003', 'prod-008', 120), -- Soap

-- Order 4 items (ord-pend-004)
('oi-p004-01', 'ord-pend-004', 'prod-001', 40),  -- Rice
('oi-p004-02', 'ord-pend-004', 'prod-005', 30),  -- Cooking Oil
('oi-p004-03', 'ord-pend-004', 'prod-006', 60),   -- Tea

('oi-p005-01', 'ord-pend-005', 'prod-002', 60),
('oi-p005-02', 'ord-pend-005', 'prod-008', 120),
('oi-p006-01', 'ord-pend-006', 'prod-001', 35),
('oi-p006-02', 'ord-pend-006', 'prod-006', 70),
('oi-p007-01', 'ord-pend-007', 'prod-001', 45),
('oi-p007-02', 'ord-pend-007', 'prod-009', 50),
('oi-p008-01', 'ord-pend-008', 'prod-004', 40),
('oi-p008-02', 'ord-pend-008', 'prod-005', 35),
('oi-p009-01', 'ord-pend-009', 'prod-003', 50),
('oi-p009-02', 'ord-pend-009', 'prod-007', 80),
('oi-p010-01', 'ord-pend-010', 'prod-001', 30),
('oi-p010-02', 'ord-pend-010', 'prod-010', 60),
('oi-p011-01', 'ord-pend-011', 'prod-001', 60),
('oi-p011-02', 'ord-pend-011', 'prod-002', 80),
('oi-p012-01', 'ord-pend-012', 'prod-006', 90),
('oi-p012-02', 'ord-pend-012', 'prod-008', 100),
('oi-p013-01', 'ord-pend-013', 'prod-003', 45),
('oi-p013-02', 'ord-pend-013', 'prod-009', 40),
('oi-p014-01', 'ord-pend-014', 'prod-001', 50),
('oi-p014-02', 'ord-pend-014', 'prod-004', 35),
('oi-p015-01', 'ord-pend-015', 'prod-005', 40),
('oi-p015-02', 'ord-pend-015', 'prod-006', 85),

-- Transit Orders Items
('oi-t001-01', 'ord-transit-001', 'prod-001', 35),
('oi-t001-02', 'ord-transit-001', 'prod-002', 45),
('oi-t002-01', 'ord-transit-002', 'prod-003', 60),
('oi-t002-02', 'ord-transit-002', 'prod-006', 70),
('oi-t003-01', 'ord-transit-003', 'prod-004', 25),
('oi-t003-02', 'ord-transit-003', 'prod-005', 20),
('oi-t004-01', 'ord-transit-004', 'prod-007', 90),
('oi-t004-02', 'ord-transit-004', 'prod-008', 80),
('oi-t005-01', 'ord-transit-005', 'prod-001', 30),
('oi-t005-02', 'ord-transit-005', 'prod-009', 55),
('oi-t006-01', 'ord-transit-006', 'prod-002', 70),
('oi-t006-02', 'ord-transit-006', 'prod-010', 65),
('oi-t007-01', 'ord-transit-007', 'prod-001', 40),
('oi-t007-02', 'ord-transit-007', 'prod-005', 30),
('oi-t008-01', 'ord-transit-008', 'prod-003', 50),
('oi-t008-02', 'ord-transit-008', 'prod-006', 60),
('oi-t009-01', 'ord-transit-009', 'prod-001', 55),
('oi-t009-02', 'ord-transit-009', 'prod-004', 45),
('oi-t010-01', 'ord-transit-010', 'prod-002', 55),
('oi-t010-02', 'ord-transit-010', 'prod-007', 75),

-- At Store Orders Items
('oi-s001-01', 'ord-store-001', 'prod-001', 28),
('oi-s001-02', 'ord-store-001', 'prod-005', 22),
('oi-s002-01', 'ord-store-002', 'prod-002', 65),
('oi-s002-02', 'ord-store-002', 'prod-003', 40),
('oi-s003-01', 'ord-store-003', 'prod-006', 75),
('oi-s003-02', 'ord-store-003', 'prod-008', 95),
('oi-s004-01', 'ord-store-004', 'prod-001', 42),
('oi-s004-02', 'ord-store-004', 'prod-009', 48),
('oi-s005-01', 'ord-store-005', 'prod-004', 30),
('oi-s005-02', 'ord-store-005', 'prod-010', 50),
('oi-s006-01', 'ord-store-006', 'prod-001', 38),
('oi-s006-02', 'ord-store-006', 'prod-005', 32),
('oi-s007-01', 'ord-store-007', 'prod-003', 48),
('oi-s007-02', 'ord-store-007', 'prod-007', 70),
('oi-s008-01', 'ord-store-008', 'prod-002', 58),
('oi-s008-02', 'ord-store-008', 'prod-006', 68),
('oi-s009-01', 'ord-store-009', 'prod-008', 110),
('oi-s009-02', 'ord-store-009', 'prod-009', 42),
('oi-s010-01', 'ord-store-010', 'prod-001', 32),
('oi-s010-02', 'ord-store-010', 'prod-010', 55),
('oi-s011-01', 'ord-store-011', 'prod-004', 38),
('oi-s011-02', 'ord-store-011', 'prod-005', 35),
('oi-s012-01', 'ord-store-012', 'prod-002', 52),
('oi-s012-02', 'ord-store-012', 'prod-006', 72),

-- Truck Transit Orders Items
('oi-tr001-01', 'ord-truck-001', 'prod-001', 48),
('oi-tr001-02', 'ord-truck-001', 'prod-003', 52),
('oi-tr002-01', 'ord-truck-002', 'prod-004', 35),
('oi-tr002-02', 'ord-truck-002', 'prod-005', 38),
('oi-tr003-01', 'ord-truck-003', 'prod-006', 68),
('oi-tr003-02', 'ord-truck-003', 'prod-007', 82),
('oi-tr004-01', 'ord-truck-004', 'prod-002', 48),
('oi-tr004-02', 'ord-truck-004', 'prod-008', 95),
('oi-tr005-01', 'ord-truck-005', 'prod-001', 36),
('oi-tr005-02', 'ord-truck-005', 'prod-009', 58),

-- Delivered Orders Items
('oi-d001-01', 'ord-deliv-001', 'prod-001', 34),
('oi-d001-02', 'ord-deliv-001', 'prod-005', 28),
('oi-d002-01', 'ord-deliv-002', 'prod-002', 62),
('oi-d002-02', 'ord-deliv-002', 'prod-004', 42),
('oi-d003-01', 'ord-deliv-003', 'prod-003', 52),
('oi-d003-02', 'ord-deliv-003', 'prod-006', 58)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 13. SHIPMENTS (Create shipments for in-transit and at-store orders)
-- ============================================================================

-- Shipments for In_Train_Transit orders
INSERT INTO Shipment (id, order_id, train_trip_id, allocated_space_units, shipped_quantity, status, shipped_at) VALUES
('ship-transit-001', 'ord-transit-001', 'tt-cmb-kdy-001', 40.0, 1, 'In_Transit', NULL),
('ship-transit-002', 'ord-transit-002', 'tt-cmb-kdy-001', 48.0, 1, 'In_Transit', NULL),
('ship-transit-003', 'ord-transit-003', 'tt-kdy-cmb-001', 33.0, 1, 'In_Transit', NULL),
('ship-transit-004', 'ord-transit-004', 'tt-cmb-gal-001', 31.0, 1, 'In_Transit', NULL),
('ship-transit-005', 'ord-transit-005', 'tt-cmb-neg-001', 38.0, 1, 'In_Transit', NULL),
('ship-transit-006', 'ord-transit-006', 'tt-cmb-kdy-002', 50.0, 1, 'In_Transit', NULL),
('ship-transit-007', 'ord-transit-007', 'tt-kdy-cmb-002', 46.0, 1, 'In_Transit', NULL),
('ship-transit-008', 'ord-transit-008', 'tt-cmb-gal-002', 36.0, 1, 'In_Transit', NULL),
('ship-transit-009', 'ord-transit-009', 'tt-cmb-jaf-001', 67.0, 1, 'In_Transit', NULL),
('ship-transit-010', 'ord-transit-010', 'tt-cmb-kdy-001', 42.0, 1, 'In_Transit', NULL),

-- Shipments for At_Store orders (Delivered status)
('ship-store-001', 'ord-store-001', 'tt-kdy-cmb-001', 35.0, 1, 'Delivered', NOW() - INTERVAL '6 hours'),
('ship-store-002', 'ord-store-002', 'tt-cmb-kdy-001', 42.0, 1, 'Delivered', NOW() - INTERVAL '12 hours'),
('ship-store-003', 'ord-store-003', 'tt-kdy-cmb-001', 44.0, 1, 'Delivered', NOW() - INTERVAL '18 hours'),
('ship-store-004', 'ord-store-004', 'tt-cmb-kdy-002', 49.0, 1, 'Delivered', NOW() - INTERVAL '1 day'),
('ship-store-005', 'ord-store-005', 'tt-cmb-kdy-001', 39.0, 1, 'Delivered', NOW() - INTERVAL '8 hours'),
('ship-store-006', 'ord-store-006', 'tt-cmb-kdy-002', 46.0, 1, 'Delivered', NOW() - INTERVAL '15 hours'),
('ship-store-007', 'ord-store-007', 'tt-cmb-gal-001', 33.0, 1, 'Delivered', NOW() - INTERVAL '10 hours'),
('ship-store-008', 'ord-store-008', 'tt-cmb-gal-001', 41.0, 1, 'Delivered', NOW() - INTERVAL '20 hours'),
('ship-store-009', 'ord-store-009', 'tt-cmb-neg-001', 32.0, 1, 'Delivered', NOW() - INTERVAL '7 hours'),
('ship-store-010', 'ord-store-010', 'tt-neg-cmb-001', 36.0, 1, 'Delivered', NOW() - INTERVAL '14 hours'),
('ship-store-011', 'ord-store-011', 'tt-kdy-cmb-002', 48.0, 1, 'Delivered', NOW() - INTERVAL '9 hours'),
('ship-store-012', 'ord-store-012', 'tt-cmb-kdy-001', 40.0, 1, 'Delivered', NOW() - INTERVAL '11 hours'),

-- Shipments for In_Truck_Transit orders
('ship-truck-001', 'ord-truck-001', 'tt-kdy-cmb-001', 51.0, 1, 'Delivered', NOW() - INTERVAL '2 days'),
('ship-truck-002', 'ord-truck-002', 'tt-cmb-kdy-001', 47.0, 1, 'Delivered', NOW() - INTERVAL '1 day'),
('ship-truck-003', 'ord-truck-003', 'tt-cmb-gal-001', 39.0, 1, 'Delivered', NOW() - INTERVAL '1 day'),
('ship-truck-004', 'ord-truck-004', 'tt-cmb-neg-001', 34.0, 1, 'Delivered', NOW() - INTERVAL '6 hours'),
('ship-truck-005', 'ord-truck-005', 'tt-kdy-cmb-001', 43.0, 1, 'Delivered', NOW() - INTERVAL '12 hours'),

-- Shipments for Delivered orders
('ship-deliv-001', 'ord-deliv-001', 'tt-kdy-cmb-001', 42.0, 1, 'Delivered', NOW() - INTERVAL '5 days'),
('ship-deliv-002', 'ord-deliv-002', 'tt-cmb-kdy-001', 50.0, 1, 'Delivered', NOW() - INTERVAL '6 days'),
('ship-deliv-003', 'ord-deliv-003', 'tt-cmb-gal-001', 35.0, 1, 'Delivered', NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 14. TRUCK TRIPS (Various statuses)
-- ============================================================================

-- Scheduled Truck Trips
INSERT INTO Truck_Trip (id, truck_id, route_id, driver_id, assistant_id, shipment_id, scheduled_start, scheduled_end, actual_start, actual_end, status) VALUES
-- Scheduled Truck Trips
('trip-sched-001', 'truck-001', 'route-cmb-01', 'driver-001', 'assistant-001', 'ship-store-001', CURRENT_TIMESTAMP + INTERVAL '2 hours', CURRENT_TIMESTAMP + INTERVAL '6 hours', NULL, NULL, 'Scheduled'),
('trip-sched-002', 'truck-002', 'route-cmb-02', 'driver-002', 'assistant-002', 'ship-store-002', CURRENT_TIMESTAMP + INTERVAL '3 hours', CURRENT_TIMESTAMP + INTERVAL '8 hours', NULL, NULL, 'Scheduled'),
('trip-sched-003', 'truck-003', 'route-cmb-03', 'driver-003', 'assistant-003', 'ship-store-003', CURRENT_TIMESTAMP + INTERVAL '4 hours', CURRENT_TIMESTAMP + INTERVAL '8 hours', NULL, NULL, 'Scheduled'),
('trip-sched-004', 'truck-004', 'route-kdy-01', 'driver-004', NULL, 'ship-store-005', CURRENT_TIMESTAMP + INTERVAL '5 hours', CURRENT_TIMESTAMP + INTERVAL '8 hours', NULL, NULL, 'Scheduled'),
('trip-sched-005', 'truck-005', 'route-gal-01', 'driver-005', 'assistant-004', 'ship-store-007', CURRENT_TIMESTAMP + INTERVAL '6 hours', CURRENT_TIMESTAMP + INTERVAL '12 hours', NULL, NULL, 'Scheduled'),

-- In Progress Truck Trips
('trip-prog-001', 'truck-006', 'route-cmb-01', 'driver-003', 'assistant-002', 'ship-truck-001', CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP + INTERVAL '3 hours', CURRENT_TIMESTAMP - INTERVAL '1 hour', NULL, 'In_Progress'),
('trip-prog-002', 'truck-007', 'route-kdy-01', 'driver-004', NULL, 'ship-truck-002', CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP + INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '2 hours', NULL, 'In_Progress'),
('trip-prog-003', 'truck-008', 'route-gal-01', 'driver-005', 'assistant-003', 'ship-truck-003', CURRENT_TIMESTAMP - INTERVAL '3 hours', CURRENT_TIMESTAMP + INTERVAL '3 hours', CURRENT_TIMESTAMP - INTERVAL '3 hours', NULL, 'In_Progress'),

-- Completed Truck Trips
('trip-comp-001', 'truck-001', 'route-cmb-02', 'driver-001', 'assistant-001', 'ship-deliv-001', CURRENT_TIMESTAMP - INTERVAL '2 days 6 hours', CURRENT_TIMESTAMP - INTERVAL '2 days 2 hours', CURRENT_TIMESTAMP - INTERVAL '2 days 6 hours', CURRENT_TIMESTAMP - INTERVAL '2 days 2 hours', 'Completed'),
('trip-comp-002', 'truck-002', 'route-kdy-02', 'driver-002', 'assistant-002', 'ship-deliv-002', CURRENT_TIMESTAMP - INTERVAL '3 days 5 hours', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '3 days 5 hours', CURRENT_TIMESTAMP - INTERVAL '3 days', 'Completed'),
('trip-comp-003', 'truck-003', 'route-gal-02', 'driver-003', NULL, 'ship-deliv-003', CURRENT_TIMESTAMP - INTERVAL '1 day 6 hours', CURRENT_TIMESTAMP - INTERVAL '1 day 1 hour', CURRENT_TIMESTAMP - INTERVAL '1 day 6 hours', CURRENT_TIMESTAMP - INTERVAL '1 day 1 hour', 'Completed')
ON CONFLICT (id) DO NOTHING;

-- Update worker statuses for in-progress trips
UPDATE Worker SET status = 'Busy' WHERE id IN ('driver-003', 'driver-004', 'driver-005', 'assistant-002', 'assistant-003');

-- ============================================================================
-- 15. UPDATE ORDER TOTALS (Trigger will calculate automatically, but let's ensure)
-- ============================================================================
CALL update_order_summary('ord-pend-001');
CALL update_order_summary('ord-pend-002');
CALL update_order_summary('ord-pend-003');
CALL update_order_summary('ord-pend-004');
CALL update_order_summary('ord-pend-005');
CALL update_order_summary('ord-pend-006');
CALL update_order_summary('ord-pend-007');
CALL update_order_summary('ord-pend-008');
CALL update_order_summary('ord-pend-009');
CALL update_order_summary('ord-pend-010');
CALL update_order_summary('ord-pend-011');
CALL update_order_summary('ord-pend-012');
CALL update_order_summary('ord-pend-013');
CALL update_order_summary('ord-pend-014');
CALL update_order_summary('ord-pend-015');
CALL update_order_summary('ord-transit-001');
CALL update_order_summary('ord-transit-002');
CALL update_order_summary('ord-transit-003');
CALL update_order_summary('ord-transit-004');
CALL update_order_summary('ord-transit-005');
CALL update_order_summary('ord-transit-006');
CALL update_order_summary('ord-transit-007');
CALL update_order_summary('ord-transit-008');
CALL update_order_summary('ord-transit-009');
CALL update_order_summary('ord-transit-010');
CALL update_order_summary('ord-store-001');
CALL update_order_summary('ord-store-002');
CALL update_order_summary('ord-store-003');
CALL update_order_summary('ord-store-004');
CALL update_order_summary('ord-store-005');
CALL update_order_summary('ord-store-006');
CALL update_order_summary('ord-store-007');
CALL update_order_summary('ord-store-008');
CALL update_order_summary('ord-store-009');
CALL update_order_summary('ord-store-010');
CALL update_order_summary('ord-store-011');
CALL update_order_summary('ord-store-012');
CALL update_order_summary('ord-truck-001');
CALL update_order_summary('ord-truck-002');
CALL update_order_summary('ord-truck-003');
CALL update_order_summary('ord-truck-004');
CALL update_order_summary('ord-truck-005');
CALL update_order_summary('ord-deliv-001');
CALL update_order_summary('ord-deliv-002');
CALL update_order_summary('ord-deliv-003');

-- ============================================================================
-- 16. UPDATE ORDER STATUSES BASED ON SHIPMENT STATUS
-- ============================================================================
-- Note: Orders should already have correct statuses from INSERT, but this ensures consistency

-- Ensure In_Train_Transit orders match their shipment status
UPDATE "Order" SET status = 'In_Train_Transit' 
WHERE id IN (
    SELECT order_id FROM Shipment WHERE status = 'In_Transit'
);

-- Ensure At_Store orders have shipments marked as Delivered
UPDATE "Order" SET status = 'At_Store'
WHERE id IN (
    SELECT DISTINCT s.order_id 
    FROM Shipment s
    WHERE s.status = 'Delivered' 
    AND s.order_id IN (
        SELECT id FROM "Order" 
        WHERE status = 'At_Store'
    )
);

-- Ensure In_Truck_Transit orders have associated truck trips
UPDATE "Order" SET status = 'In_Truck_Transit'
WHERE id IN (
    SELECT DISTINCT s.order_id
    FROM Shipment s
    INNER JOIN Truck_Trip tt ON s.id = tt.shipment_id
    WHERE tt.status = 'In_Progress'
);

-- Ensure Delivered orders have completed truck trips
UPDATE "Order" SET status = 'Delivered'
WHERE id IN (
    SELECT DISTINCT s.order_id
    FROM Shipment s
    INNER JOIN Truck_Trip tt ON s.id = tt.shipment_id
    WHERE tt.status = 'Completed'
    AND tt.actual_end IS NOT NULL
);

-- ============================================================================
-- 17. UPDATE TRAIN TRIP ALLOCATED UNITS (Final update after all shipments)
-- ============================================================================
UPDATE Train_Trip SET allocated_units = (
    SELECT COALESCE(SUM(allocated_space_units), 0)
    FROM Shipment
    WHERE train_trip_id = Train_Trip.id
);

-- ============================================================================
-- 18. ADD ACTUAL END TIMES FOR COMPLETED TRUCK TRIPS
-- ============================================================================
UPDATE Truck_Trip 
SET actual_end = scheduled_end - INTERVAL '15 minutes'
WHERE status = 'Completed' AND actual_end IS NULL;



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
-- CITIES: 15 cities
-- ROUTES: 15 routes (exceeds requirement of 10)
-- PRODUCTS: 12 products
-- STORES: 5 stores
-- CUSTOMERS: 5 customers
-- WORKERS:
--   - 1 Dispatcher
--   - 5 Drivers
--   - 4 Assistants
--   - 3 Store Managers
-- TRAINS: 5 trains
-- TRUCKS: 8 trucks
-- TRAIN TRIPS: 20 future train trips with defined capacities
-- ORDERS: 45 orders (exceeds requirement of 40)
--   - 15 Pending
--   - 10 In_Train_Transit
--   - 12 At_Store
--   - 5 In_Truck_Transit
--   - 3 Delivered
-- ORDER ITEMS: 90+ order items across all orders
-- SHIPMENTS: 35 shipments linking orders to train trips
-- TRUCK TRIPS: 11 truck trips
--   - 5 Scheduled
--   - 3 In_Progress
--   - 3 Completed
-- ============================================================================
