-- =============================================================================
-- COMPREHENSIVE INFRASTRUCTURE DATA
-- Cities, Routes, Products, Stores, Trains, Trucks
-- =============================================================================

-- =============================================================================
-- 1. CITIES (Expanded to cover Sri Lanka)
-- =============================================================================
INSERT INTO city (id, name) VALUES
    ('city-cmb', 'Colombo'),
    ('city-kdy', 'Kandy'),
    ('city-gal', 'Galle'),
    ('city-jaf', 'Jaffna'),
    ('city-neg', 'Negombo'),
    ('city-kur', 'Kurunegala'),
    ('city-mat', 'Matara'),
    ('city-bad', 'Badulla'),
    ('city-tri', 'Trincomalee'),
    ('city-anu', 'Anuradhapura'),
    ('city-rat', 'Ratnapura'),
    ('city-nue', 'Nuwara Eliya'),
    ('city-amp', 'Ampara'),
    ('city-chi', 'Chilaw'),
    ('city-kal', 'Kalutara')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 2. ROUTES (Comprehensive delivery routes)
-- =============================================================================
INSERT INTO route (id, name, max_delivery_time_hours, area) VALUES
    -- Colombo routes
    ('route-cmb-01', 'Colombo Fort Area', 4.0, 'Colombo District'),
    ('route-cmb-02', 'Colombo South', 5.0, 'Colombo District'),
    ('route-cmb-03', 'Colombo North', 4.5, 'Colombo District'),
    ('route-cmb-04', 'Colombo East', 5.5, 'Colombo District'),
    
    -- Western Province routes
    ('route-neg-01', 'Negombo Coastal', 3.5, 'Gampaha District'),
    ('route-kal-01', 'Kalutara District', 4.0, 'Kalutara District'),
    ('route-chi-01', 'Chilaw Area', 3.0, 'Puttalam District'),
    
    -- Southern Province routes
    ('route-gal-01', 'Galle City', 6.0, 'Galle District'),
    ('route-gal-02', 'Galle Suburbs', 7.0, 'Galle District'),
    ('route-mat-01', 'Matara District', 8.0, 'Matara District'),
    
    -- Central Province routes
    ('route-kdy-01', 'Kandy City', 6.5, 'Kandy District'),
    ('route-kdy-02', 'Kandy Suburbs', 7.5, 'Kandy District'),
    ('route-nue-01', 'Nuwara Eliya', 9.0, 'Nuwara Eliya District'),
    
    -- Other areas
    ('route-kur-01', 'Kurunegala District', 5.0, 'Kurunegala District'),
    ('route-bad-01', 'Badulla District', 10.0, 'Badulla District'),
    ('route-jaf-01', 'Jaffna District', 12.0, 'Jaffna District'),
    ('route-tri-01', 'Trincomalee District', 9.5, 'Trincomalee District'),
    ('route-anu-01', 'Anuradhapura District', 8.0, 'Anuradhapura District'),
    ('route-rat-01', 'Ratnapura District', 7.0, 'Ratnapura District'),
    ('route-amp-01', 'Ampara District', 10.5, 'Ampara District')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 3. ROUTE STOPS (Multi-stop routes)
-- =============================================================================
INSERT INTO route_stop (id, route_id, city_id, stop_order) VALUES
    -- Colombo routes
    ('rs-cmb-01-1', 'route-cmb-01', 'city-cmb', 1),
    ('rs-cmb-02-1', 'route-cmb-02', 'city-cmb', 1),
    ('rs-cmb-03-1', 'route-cmb-03', 'city-cmb', 1),
    ('rs-cmb-04-1', 'route-cmb-04', 'city-cmb', 1),
    
    -- Multi-stop routes
    ('rs-neg-01-1', 'route-neg-01', 'city-neg', 1),
    ('rs-neg-01-2', 'route-neg-01', 'city-chi', 2),
    
    ('rs-kal-01-1', 'route-kal-01', 'city-kal', 1),
    ('rs-kal-01-2', 'route-kal-01', 'city-rat', 2),
    
    ('rs-chi-01-1', 'route-chi-01', 'city-chi', 1),
    
    ('rs-gal-01-1', 'route-gal-01', 'city-gal', 1),
    ('rs-gal-02-1', 'route-gal-02', 'city-gal', 1),
    ('rs-gal-02-2', 'route-gal-02', 'city-mat', 2),
    
    ('rs-mat-01-1', 'route-mat-01', 'city-mat', 1),
    
    ('rs-kdy-01-1', 'route-kdy-01', 'city-kdy', 1),
    ('rs-kdy-02-1', 'route-kdy-02', 'city-kdy', 1),
    ('rs-kdy-02-2', 'route-kdy-02', 'city-nue', 2),
    
    ('rs-nue-01-1', 'route-nue-01', 'city-nue', 1),
    
    ('rs-kur-01-1', 'route-kur-01', 'city-kur', 1),
    ('rs-bad-01-1', 'route-bad-01', 'city-bad', 1),
    ('rs-jaf-01-1', 'route-jaf-01', 'city-jaf', 1),
    ('rs-tri-01-1', 'route-tri-01', 'city-tri', 1),
    ('rs-anu-01-1', 'route-anu-01', 'city-anu', 1),
    ('rs-rat-01-1', 'route-rat-01', 'city-rat', 1),
    ('rs-amp-01-1', 'route-amp-01', 'city-amp', 1)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 4. PRODUCTS (Comprehensive product catalog)
-- =============================================================================
INSERT INTO product (id, name, unit_price, space_consumption_rate) VALUES
    -- Staple foods
    ('prod-001', 'Rice 5kg', 850.00, 2.5),
    ('prod-002', 'Sugar 1kg', 180.00, 1.0),
    ('prod-003', 'Flour 1kg', 150.00, 1.0),
    ('prod-004', 'Milk Powder 400g', 950.00, 0.8),
    ('prod-005', 'Cooking Oil 1L', 650.00, 1.2),
    ('prod-006', 'Tea 200g', 420.00, 0.5),
    ('prod-007', 'Biscuits Pack', 250.00, 0.6),
    ('prod-008', 'Soap Bar', 120.00, 0.3),
    
    -- Additional groceries
    ('prod-009', 'Lentils 500g', 280.00, 0.7),
    ('prod-010', 'Chickpeas 500g', 320.00, 0.7),
    ('prod-011', 'Pasta 500g', 180.00, 0.8),
    ('prod-012', 'Noodles Pack', 90.00, 0.4),
    ('prod-013', 'Salt 1kg', 50.00, 0.5),
    ('prod-014', 'Pepper 100g', 380.00, 0.2),
    ('prod-015', 'Chili Powder 100g', 150.00, 0.2),
    
    -- Beverages
    ('prod-bev-01', 'Coca-Cola 500ml', 150.00, 0.5),
    ('prod-bev-02', 'Sprite 500ml', 150.00, 0.5),
    ('prod-bev-03', 'Milo 400g', 850.00, 0.9),
    ('prod-bev-04', 'Coffee 200g', 720.00, 0.6),
    ('prod-bev-05', 'Juice Box 200ml', 100.00, 0.3),
    
    -- Snacks
    ('prod-snk-01', 'Potato Chips 100g', 200.00, 0.4),
    ('prod-snk-02', 'Chocolate Bar', 250.00, 0.3),
    ('prod-snk-03', 'Wafers Pack', 180.00, 0.5),
    ('prod-snk-04', 'Nuts 200g', 420.00, 0.4),
    ('prod-snk-05', 'Cookies Pack', 280.00, 0.6),
    
    -- Cleaning & personal care
    ('prod-det-01', 'Sunlight Soap 100g', 80.00, 0.2),
    ('prod-det-02', 'Washing Powder 1kg', 380.00, 1.0),
    ('prod-det-03', 'Dishwashing Liquid 500ml', 280.00, 0.6),
    ('prod-det-04', 'Toothpaste 100g', 180.00, 0.3),
    ('prod-det-05', 'Shampoo 200ml', 350.00, 0.4),
    
    -- Canned goods
    ('prod-can-01', 'Canned Fish 425g', 380.00, 0.5),
    ('prod-can-02', 'Canned Beans 400g', 180.00, 0.5),
    ('prod-can-03', 'Tomato Sauce 400g', 120.00, 0.5),
    ('prod-can-04', 'Jam 450g', 480.00, 0.6),
    
    -- Dairy
    ('prod-dai-01', 'Butter 200g', 520.00, 0.4),
    ('prod-dai-02', 'Cheese 200g', 680.00, 0.4),
    ('prod-dai-03', 'Yogurt 400g', 280.00, 0.5),
    
    -- Frozen items
    ('prod-frz-01', 'Frozen Chicken 1kg', 980.00, 1.5),
    ('prod-frz-02', 'Frozen Fish 500g', 650.00, 0.8),
    ('prod-frz-03', 'Ice Cream 1L', 580.00, 1.2)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 5. TRAINS (Railway fleet)
-- =============================================================================
INSERT INTO train (id, name) VALUES
    ('train-001', 'Udarata Menike'),
    ('train-002', 'Rajarata Rejina'),
    ('train-003', 'Ruhunu Kumari'),
    ('train-004', 'Yal Devi'),
    ('train-005', 'Podi Menike'),
    ('train-006', 'Intercity Express')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 6. TRUCKS (Fleet with proper initial status)
-- =============================================================================
INSERT INTO truck (id, vehicle_no, status) VALUES
    ('truck-001', 'CBA-1234', 'available'),
    ('truck-002', 'CP-5678', 'available'),
    ('truck-003', 'WP-9012', 'available'),
    ('truck-004', 'KY-3456', 'available'),
    ('truck-005', 'GL-7890', 'available'),
    ('truck-006', 'NE-2468', 'available'),
    ('truck-007', 'KU-1357', 'available'),
    ('truck-008', 'JF-9753', 'available'),
    ('truck-009', 'MT-8642', 'maintenance'),
    ('truck-010', 'TR-1928', 'available')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 7. STORES (Distribution centers across Sri Lanka)
-- =============================================================================
-- Note: managed_by will be set after store managers are created
INSERT INTO store (id, name, city_id, managed_by) VALUES
    ('store-cmb-01', 'Colombo Central Store', 'city-cmb', NULL),
    ('store-gdy-01', 'Kandy Main Store', 'city-kdy', NULL),
    ('store-gal-01', 'Galle Store', 'city-gal', NULL),
    ('store-jaf-01', 'Jaffna Store', 'city-jaf', NULL),
    ('store-mat-01', 'Matara Store', 'city-mat', NULL),
    ('store-neg-01', 'Negombo Store', 'city-neg', NULL),
    ('store-anu-01', 'Anuradhapura Store', 'city-anu', NULL)
ON CONFLICT (id) DO NOTHING;


INSERT INTO system_configuration (config_key, config_value, description)
VALUES 
    ('DRIVER_WEEKLY_HOUR_LIMIT', '40', 'Maximum weekly working hours for a driver.'),
    ('ASSISTANT_WEEKLY_HOUR_LIMIT', '60', 'Maximum weekly working hours for an assistant.'),
    ('DRIVER_CONSECUTIVE_TRIP_LIMIT', '1', 'Maximum consecutive trips for a driver before a break is required.'),
    ('ASSISTANT_CONSECUTIVE_TRIP_LIMIT', '2', 'Maximum consecutive routes for an assistant before a break is required.') 
ON CONFLICT (config_key) DO NOTHING;
