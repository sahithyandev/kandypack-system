-- =============================================================================
-- COMPREHENSIVE TRUCK TRIPS DATA
-- Respects truck status, worker status, and all constraints
-- =============================================================================

-- =============================================================================
-- IMPORTANT: Truck trips must be inserted in chronological order
-- 1. Completed trips (historical) - workers Free, trucks available after
-- 2. Scheduled trips (future) - workers Free, trucks available
-- 3. In-progress trips (current) - workers Busy, trucks busy
-- =============================================================================

-- =============================================================================
-- 1. COMPLETED TRUCK TRIPS (Historical data)
-- =============================================================================
INSERT INTO truck_trip (id, truck_id, route_id, driver_id, assistant_id, shipment_id, scheduled_start, scheduled_end, actual_start, actual_end, status) VALUES
    -- Completed trip 1: 15 days ago
    ('trip-completed-001', 'truck-001', 'route-cmb-01', 'worker-drv-001', 'worker-ast-001', 
        'ship-delivered-001', 
        CURRENT_TIMESTAMP - INTERVAL '15 days', 
        CURRENT_TIMESTAMP - INTERVAL '15 days' + INTERVAL '4 hours',
        CURRENT_TIMESTAMP - INTERVAL '15 days',
        CURRENT_TIMESTAMP - INTERVAL '15 days' + INTERVAL '3 hours 45 minutes',
        'Completed'),
    
    -- Completed trip 2: 13 days ago
    ('trip-completed-002', 'truck-002', 'route-cmb-02', 'worker-drv-002', 'worker-ast-002', 
        'ship-delivered-002', 
        CURRENT_TIMESTAMP - INTERVAL '13 days', 
        CURRENT_TIMESTAMP - INTERVAL '13 days' + INTERVAL '5 hours',
        CURRENT_TIMESTAMP - INTERVAL '13 days',
        CURRENT_TIMESTAMP - INTERVAL '13 days' + INTERVAL '4 hours 30 minutes',
        'Completed'),
    
    -- Completed trip 3: 11 days ago
    ('trip-completed-003', 'truck-003', 'route-gal-01', 'worker-drv-003', 'worker-ast-003', 
        'ship-delivered-003', 
        CURRENT_TIMESTAMP - INTERVAL '11 days', 
        CURRENT_TIMESTAMP - INTERVAL '11 days' + INTERVAL '6 hours',
        CURRENT_TIMESTAMP - INTERVAL '11 days',
        CURRENT_TIMESTAMP - INTERVAL '11 days' + INTERVAL '5 hours 50 minutes',
        'Completed'),
    
    -- Completed trip 4: 9 days ago
    ('trip-completed-004', 'truck-004', 'route-gal-02', 'worker-drv-004', 'worker-ast-004', 
        'ship-delivered-004', 
        CURRENT_TIMESTAMP - INTERVAL '9 days', 
        CURRENT_TIMESTAMP - INTERVAL '9 days' + INTERVAL '7 hours',
        CURRENT_TIMESTAMP - INTERVAL '9 days',
        CURRENT_TIMESTAMP - INTERVAL '9 days' + INTERVAL '6 hours 45 minutes',
        'Completed'),
    
    -- Completed trip 5: 7 days ago (no assistant)
    ('trip-completed-005', 'truck-005', 'route-mat-01', 'worker-drv-005', NULL, 
        'ship-delivered-005', 
        CURRENT_TIMESTAMP - INTERVAL '7 days', 
        CURRENT_TIMESTAMP - INTERVAL '7 days' + INTERVAL '8 hours',
        CURRENT_TIMESTAMP - INTERVAL '7 days',
        CURRENT_TIMESTAMP - INTERVAL '7 days' + INTERVAL '7 hours 30 minutes',
        'Completed'),
    
    -- Completed trip 6: 5 days ago
    ('trip-completed-006', 'truck-001', 'route-cmb-03', 'worker-drv-006', 'worker-ast-005', 
        NULL, 
        CURRENT_TIMESTAMP - INTERVAL '5 days', 
        CURRENT_TIMESTAMP - INTERVAL '5 days' + INTERVAL '4 hours',
        CURRENT_TIMESTAMP - INTERVAL '5 days',
        CURRENT_TIMESTAMP - INTERVAL '5 days' + INTERVAL '3 hours 55 minutes',
        'Completed'),
    
    -- Completed trip 7: 3 days ago
    ('trip-completed-007', 'truck-002', 'route-neg-01', 'worker-drv-007', 'worker-ast-006', 
        NULL, 
        CURRENT_TIMESTAMP - INTERVAL '3 days', 
        CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '3 hours',
        CURRENT_TIMESTAMP - INTERVAL '3 days',
        CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '2 hours 50 minutes',
        'Completed')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 2. SCHEDULED TRUCK TRIPS (Future trips)
-- Workers must be Free, trucks must be available
-- =============================================================================
INSERT INTO truck_trip (id, truck_id, route_id, driver_id, assistant_id, shipment_id, scheduled_start, scheduled_end, status) VALUES
    -- Scheduled trip 1: 2 hours from now
    ('trip-scheduled-001', 'truck-001', 'route-cmb-01', 'worker-drv-001', 'worker-ast-001', 
        'ship-at-store-001', 
        CURRENT_TIMESTAMP + INTERVAL '2 hours', 
        CURRENT_TIMESTAMP + INTERVAL '6 hours', 
        'Scheduled'),
    
    -- Scheduled trip 2: 4 hours from now
    ('trip-scheduled-002', 'truck-002', 'route-cmb-02', 'worker-drv-002', 'worker-ast-002', 
        'ship-at-store-002', 
        CURRENT_TIMESTAMP + INTERVAL '4 hours', 
        CURRENT_TIMESTAMP + INTERVAL '9 hours', 
        'Scheduled'),
    
    -- Scheduled trip 3: 6 hours from now (no assistant)
    ('trip-scheduled-003', 'truck-005', 'route-neg-01', 'worker-drv-006', NULL, 
        'ship-at-store-003', 
        CURRENT_TIMESTAMP + INTERVAL '6 hours', 
        CURRENT_TIMESTAMP + INTERVAL '9 hours 30 minutes', 
        'Scheduled'),
    
    -- Scheduled trip 4: tomorrow morning
    ('trip-scheduled-004', 'truck-003', 'route-gal-01', 'worker-drv-003', 'worker-ast-003', 
        'ship-at-store-004', 
        CURRENT_TIMESTAMP + INTERVAL '1 day 8 hours', 
        CURRENT_TIMESTAMP + INTERVAL '1 day 14 hours', 
        'Scheduled'),
    
    -- Scheduled trip 5: tomorrow afternoon
    ('trip-scheduled-005', 'truck-004', 'route-gal-02', 'worker-drv-004', 'worker-ast-004', 
        'ship-at-store-005', 
        CURRENT_TIMESTAMP + INTERVAL '1 day 14 hours', 
        CURRENT_TIMESTAMP + INTERVAL '1 day 21 hours', 
        'Scheduled'),
    
    -- Scheduled trip 6: day after tomorrow
    ('trip-scheduled-006', 'truck-006', 'route-kdy-01', 'worker-drv-007', 'worker-ast-005', 
        NULL, 
        CURRENT_TIMESTAMP + INTERVAL '2 days 9 hours', 
        CURRENT_TIMESTAMP + INTERVAL '2 days 15 hours 30 minutes', 
        'Scheduled')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 3. IN-PROGRESS TRUCK TRIPS (Currently active)
-- These will mark workers as Busy and trucks as busy
-- =============================================================================
INSERT INTO truck_trip (id, truck_id, route_id, driver_id, assistant_id, shipment_id, scheduled_start, scheduled_end, actual_start, status) VALUES
    -- In-progress trip 1: Started 2 hours ago
    ('trip-in-progress-001', 'truck-007', 'route-cmb-04', 'worker-drv-008', 'worker-ast-008', 
        NULL, 
        CURRENT_TIMESTAMP - INTERVAL '2 hours', 
        CURRENT_TIMESTAMP + INTERVAL '2 hours',
        CURRENT_TIMESTAMP - INTERVAL '2 hours',
        'In_Progress'),
    
    -- In-progress trip 2: Started 1 hour ago (no assistant)
    ('trip-in-progress-002', 'truck-008', 'route-kal-01', 'worker-drv-010', NULL, 
        NULL, 
        CURRENT_TIMESTAMP - INTERVAL '1 hour', 
        CURRENT_TIMESTAMP + INTERVAL '3 hours',
        CURRENT_TIMESTAMP - INTERVAL '1 hour',
        'In_Progress'),
    
    -- In-progress trip 3: Started 3 hours ago
    ('trip-in-progress-003', 'truck-010', 'route-rat-01', 'worker-drv-011', 'worker-ast-009', 
        NULL, 
        CURRENT_TIMESTAMP - INTERVAL '3 hours', 
        CURRENT_TIMESTAMP + INTERVAL '4 hours',
        CURRENT_TIMESTAMP - INTERVAL '3 hours',
        'In_Progress')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 4. UPDATE WORKER STATUS FOR IN-PROGRESS TRIPS
-- =============================================================================
UPDATE worker SET status = 'Busy' WHERE id IN (
    'worker-drv-008', 'worker-ast-008',  -- trip-in-progress-001
    'worker-drv-010',                     -- trip-in-progress-002
    'worker-drv-011', 'worker-ast-009'    -- trip-in-progress-003
);

-- =============================================================================
-- 5. UPDATE TRUCK STATUS FOR IN-PROGRESS TRIPS
-- =============================================================================
UPDATE truck SET status = 'busy' WHERE id IN (
    'truck-007',  -- trip-in-progress-001
    'truck-008',  -- trip-in-progress-002
    'truck-010'   -- trip-in-progress-003
);

-- =============================================================================
-- 6. CREATE IN-TRUCK-TRANSIT ORDERS
-- =============================================================================
-- Orders currently being delivered by trucks
INSERT INTO "Order" (id, store_id, customer_id, delivery_address, route_id, placed_on, required_delivery_date, status, total_value, total_space_units) VALUES
    ('ord-in-truck-001', 'store-cmb-01', 'cust-ws-001', 'Cargills Main Warehouse, Colombo 05', 'route-cmb-04', 
        CURRENT_TIMESTAMP - INTERVAL '12 days', CURRENT_DATE + INTERVAL '3 days', 'In_Truck_Transit', 0, 0),
    ('ord-in-truck-002', 'store-cmb-01', 'cust-rt-002', 'Family Store, Kalutara', 'route-kal-01', 
        CURRENT_TIMESTAMP - INTERVAL '11 days', CURRENT_DATE + INTERVAL '4 days', 'In_Truck_Transit', 0, 0),
    ('ord-in-truck-003', 'store-cmb-01', 'cust-ws-003', 'Distribution Hub, Ratnapura', 'route-rat-01', 
        CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_DATE + INTERVAL '5 days', 'In_Truck_Transit', 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Order items for in-truck orders
INSERT INTO order_item (id, order_id, product_id, quantity) VALUES
    ('oi-truck-001-01', 'ord-in-truck-001', 'prod-001', 70),
    ('oi-truck-001-02', 'ord-in-truck-001', 'prod-002', 65),
    
    ('oi-truck-002-01', 'ord-in-truck-002', 'prod-006', 40),
    ('oi-truck-002-02', 'ord-in-truck-002', 'prod-007', 45),
    
    ('oi-truck-003-01', 'ord-in-truck-003', 'prod-009', 55),
    ('oi-truck-003-02', 'ord-in-truck-003', 'prod-010', 60)
ON CONFLICT (id) DO NOTHING;

-- Shipments for in-truck orders
INSERT INTO shipment (id, order_id, train_trip_id, allocated_space_units, shipped_quantity, status, shipped_at) VALUES
    ('ship-in-truck-001', 'ord-in-truck-001', 'tt-kdy-cmb-001', 168.75, 1, 'Delivered', CURRENT_TIMESTAMP - INTERVAL '4 days'),
    ('ship-in-truck-002', 'ord-in-truck-002', 'tt-kdy-cmb-002', 77.0, 1, 'Delivered', CURRENT_TIMESTAMP - INTERVAL '3 days'),
    ('ship-in-truck-003', 'ord-in-truck-003', 'tt-cmb-gal-001', 80.5, 1, 'Delivered', CURRENT_TIMESTAMP - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- Link in-truck orders to their truck trips
UPDATE truck_trip SET shipment_id = 'ship-in-truck-001' WHERE id = 'trip-in-progress-001';
UPDATE truck_trip SET shipment_id = 'ship-in-truck-002' WHERE id = 'trip-in-progress-002';
UPDATE truck_trip SET shipment_id = 'ship-in-truck-003' WHERE id = 'trip-in-progress-003';

-- Update order summaries for in-truck orders
DO $$
DECLARE
    order_rec RECORD;
BEGIN
    FOR order_rec IN SELECT id FROM "Order" WHERE id LIKE 'ord-in-truck-%'
    LOOP
        CALL update_order_summary(order_rec.id);
    END LOOP;
END $$;

-- =============================================================================
-- VERIFICATION SUMMARY
-- =============================================================================
-- Trucks status:
--   - truck-001 to truck-006: available (used in completed or scheduled trips)
--   - truck-007, truck-008, truck-010: busy (in-progress trips)
--   - truck-009: maintenance
--
-- Workers status:
--   - worker-drv-001 to worker-drv-007: Free (available for scheduling)
--   - worker-drv-008, worker-drv-010, worker-drv-011: Busy (in-progress trips)
--   - worker-drv-009: On_Leave
--   - worker-ast-001 to worker-ast-006: Free
--   - worker-ast-007: On_Leave
--   - worker-ast-008, worker-ast-009: Busy (in-progress trips)
--   - worker-ast-010: Free
-- =============================================================================
