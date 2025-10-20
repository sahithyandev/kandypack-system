-- =============================================================================
-- COMPREHENSIVE TRAIN TRIPS & SHIPMENTS DATA
-- Train schedules and shipments in various states
-- =============================================================================

-- =============================================================================
-- 1. TRAIN TRIPS (Past, Present, Future)
-- =============================================================================

-- Future train trips (for train scheduling)
INSERT INTO train_trip (id, train_id, from_city_id, to_city_id, scheduled_departure, scheduled_arrival, capacity_units, allocated_units) VALUES
    -- Kandy to Colombo routes
    ('tt-kdy-cmb-001', 'train-001', 'city-kdy', 'city-cmb', CURRENT_TIMESTAMP + INTERVAL '2 days 8 hours', CURRENT_TIMESTAMP + INTERVAL '2 days 12 hours', 300.0, 0.0),
    ('tt-kdy-cmb-002', 'train-001', 'city-kdy', 'city-cmb', CURRENT_TIMESTAMP + INTERVAL '3 days 8 hours', CURRENT_TIMESTAMP + INTERVAL '3 days 12 hours', 300.0, 0.0),
    ('tt-kdy-cmb-003', 'train-005', 'city-kdy', 'city-cmb', CURRENT_TIMESTAMP + INTERVAL '5 days 9 hours', CURRENT_TIMESTAMP + INTERVAL '5 days 13 hours', 450.0, 0.0),
    
    -- Colombo to Galle routes
    ('tt-cmb-gal-001', 'train-003', 'city-cmb', 'city-gal', CURRENT_TIMESTAMP + INTERVAL '1 day 14 hours', CURRENT_TIMESTAMP + INTERVAL '1 day 18 hours', 300.0, 0.0),
    ('tt-cmb-gal-002', 'train-003', 'city-cmb', 'city-gal', CURRENT_TIMESTAMP + INTERVAL '4 days 14 hours', CURRENT_TIMESTAMP + INTERVAL '4 days 18 hours', 300.0, 0.0),
    
    -- Colombo to Jaffna routes
    ('tt-cmb-jaf-001', 'train-004', 'city-cmb', 'city-jaf', CURRENT_TIMESTAMP + INTERVAL '4 days 6 hours', CURRENT_TIMESTAMP + INTERVAL '4 days 16 hours', 600.0, 0.0),
    ('tt-cmb-jaf-002', 'train-004', 'city-cmb', 'city-jaf', CURRENT_TIMESTAMP + INTERVAL '7 days 6 hours', CURRENT_TIMESTAMP + INTERVAL '7 days 16 hours', 600.0, 0.0),
    
    -- Colombo to Badulla routes
    ('tt-cmb-bad-001', 'train-005', 'city-cmb', 'city-bad', CURRENT_TIMESTAMP + INTERVAL '3 days 7 hours', CURRENT_TIMESTAMP + INTERVAL '3 days 16 hours', 450.0, 0.0),
    
    -- Anuradhapura routes
    ('tt-cmb-anu-001', 'train-002', 'city-cmb', 'city-anu', CURRENT_TIMESTAMP + INTERVAL '2 days 10 hours', CURRENT_TIMESTAMP + INTERVAL '2 days 16 hours', 550.0, 0.0),
    ('tt-cmb-anu-002', 'train-002', 'city-cmb', 'city-anu', CURRENT_TIMESTAMP + INTERVAL '6 days 10 hours', CURRENT_TIMESTAMP + INTERVAL '6 days 16 hours', 550.0, 0.0),
    
    -- Trincomalee routes
    ('tt-cmb-tri-001', 'train-006', 'city-cmb', 'city-tri', CURRENT_TIMESTAMP + INTERVAL '5 days 8 hours', CURRENT_TIMESTAMP + INTERVAL '5 days 17 hours', 500.0, 0.0),
    
    -- Matara routes
    ('tt-gal-mat-001', 'train-003', 'city-gal', 'city-mat', CURRENT_TIMESTAMP + INTERVAL '2 days 18 hours', CURRENT_TIMESTAMP + INTERVAL '2 days 20 hours', 300.0, 0.0)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 2. SHIPMENTS FOR DELIVERED ORDERS
-- =============================================================================
INSERT INTO shipment (id, order_id, train_trip_id, allocated_space_units, shipped_quantity, status, shipped_at) VALUES
    -- Historical shipments (delivered)
    ('ship-delivered-001', 'ord-delivered-001', 'tt-kdy-cmb-001', 220.0, 1, 'Delivered', CURRENT_TIMESTAMP - INTERVAL '20 days'),
    ('ship-delivered-002', 'ord-delivered-002', 'tt-kdy-cmb-001', 180.5, 1, 'Delivered', CURRENT_TIMESTAMP - INTERVAL '18 days'),
    ('ship-delivered-003', 'ord-delivered-003', 'tt-cmb-gal-001', 165.0, 1, 'Delivered', CURRENT_TIMESTAMP - INTERVAL '16 days'),
    ('ship-delivered-004', 'ord-delivered-004', 'tt-cmb-gal-001', 145.2, 1, 'Delivered', CURRENT_TIMESTAMP - INTERVAL '14 days'),
    ('ship-delivered-005', 'ord-delivered-005', 'tt-gal-mat-001', 98.5, 1, 'Delivered', CURRENT_TIMESTAMP - INTERVAL '12 days')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 3. SHIPMENTS FOR AT_STORE ORDERS (Train delivery completed)
-- =============================================================================
INSERT INTO shipment (id, order_id, train_trip_id, allocated_space_units, shipped_quantity, status, shipped_at) VALUES
    ('ship-at-store-001', 'ord-at-store-001', 'tt-kdy-cmb-001', 136.0, 1, 'Delivered', CURRENT_TIMESTAMP - INTERVAL '2 days'),
    ('ship-at-store-002', 'ord-at-store-002', 'tt-kdy-cmb-002', 112.5, 1, 'Delivered', CURRENT_TIMESTAMP - INTERVAL '1 day'),
    ('ship-at-store-003', 'ord-at-store-003', 'tt-kdy-cmb-001', 90.0, 1, 'Delivered', CURRENT_TIMESTAMP - INTERVAL '20 hours'),
    ('ship-at-store-004', 'ord-at-store-004', 'tt-cmb-gal-001', 125.0, 1, 'Delivered', CURRENT_TIMESTAMP - INTERVAL '1 day 12 hours'),
    ('ship-at-store-005', 'ord-at-store-005', 'tt-cmb-gal-001', 108.4, 1, 'Delivered', CURRENT_TIMESTAMP - INTERVAL '18 hours')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 4. IN-TRANSIT ORDERS (Currently on trains)
-- =============================================================================
-- Create orders that are currently in train transit
INSERT INTO "Order" (id, store_id, customer_id, delivery_address, route_id, placed_on, required_delivery_date, status, total_value, total_space_units) VALUES
    ('ord-in-train-001', 'store-cmb-01', 'cust-ws-001', 'Keells Distribution, Galle Road', 'route-cmb-01', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_DATE + INTERVAL '5 days', 'In_Train_Transit', 0, 0),
    ('ord-in-train-002', 'store-cmb-01', 'cust-ws-008', 'Negombo Central Warehouse', 'route-neg-01', CURRENT_TIMESTAMP - INTERVAL '9 days', CURRENT_DATE + INTERVAL '6 days', 'In_Train_Transit', 0, 0),
    ('ord-in-train-003', 'store-gdy-01', 'cust-ws-005', 'Kandy Main Depot', 'route-kdy-01', CURRENT_TIMESTAMP - INTERVAL '8 days', CURRENT_DATE + INTERVAL '7 days', 'In_Train_Transit', 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Order items for in-train orders
INSERT INTO order_item (id, order_id, product_id, quantity) VALUES
    ('oi-train-001-01', 'ord-in-train-001', 'prod-001', 60),
    ('oi-train-001-02', 'ord-in-train-001', 'prod-002', 55),
    ('oi-train-001-03', 'ord-in-train-001', 'prod-005', 45),
    
    ('oi-train-002-01', 'ord-in-train-002', 'prod-bev-01', 120),
    ('oi-train-002-02', 'ord-in-train-002', 'prod-snk-01', 100),
    
    ('oi-train-003-01', 'ord-in-train-003', 'prod-003', 70),
    ('oi-train-003-02', 'ord-in-train-003', 'prod-004', 50)
ON CONFLICT (id) DO NOTHING;

-- Shipments for in-train orders
INSERT INTO shipment (id, order_id, train_trip_id, allocated_space_units, shipped_quantity, status, shipped_at) VALUES
    ('ship-in-train-001', 'ord-in-train-001', 'tt-kdy-cmb-001', 195.5, 1, 'In_Transit', CURRENT_TIMESTAMP - INTERVAL '4 hours'),
    ('ship-in-train-002', 'ord-in-train-002', 'tt-kdy-cmb-002', 130.0, 1, 'In_Transit', CURRENT_TIMESTAMP - INTERVAL '6 hours'),
    ('ship-in-train-003', 'ord-in-train-003', 'tt-cmb-gal-001', 142.0, 1, 'In_Transit', CURRENT_TIMESTAMP - INTERVAL '3 hours')
ON CONFLICT (id) DO NOTHING;

-- Update order summaries for new orders
DO $$
DECLARE
    order_rec RECORD;
BEGIN
    FOR order_rec IN SELECT id FROM "Order" WHERE id LIKE 'ord-in-train-%'
    LOOP
        CALL update_order_summary(order_rec.id);
    END LOOP;
END $$;

-- =============================================================================
-- 5. UPDATE TRAIN TRIP ALLOCATED UNITS
-- =============================================================================
-- Update allocated units based on shipments
UPDATE train_trip tt
SET allocated_units = (
    SELECT COALESCE(SUM(s.allocated_space_units), 0)
    FROM shipment s
    WHERE s.train_trip_id = tt.id
)
WHERE EXISTS (
    SELECT 1 FROM shipment s WHERE s.train_trip_id = tt.id
);
