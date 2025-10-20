-- =============================================================================
-- ADDITIONAL DATA FOR TESTING
-- More at-store orders without truck trip assignments
-- =============================================================================

-- =============================================================================
-- 1. DELETE SOME SCHEDULED TRIPS TO FREE UP TRUCKS AND SHIPMENTS
-- =============================================================================
-- This makes shipments and trucks available for new scheduling
DELETE FROM truck_trip WHERE id IN ('trip-scheduled-004', 'trip-scheduled-005', 'trip-scheduled-006');

-- =============================================================================
-- 2. ADD MORE AT-STORE ORDERS (Not yet assigned to truck trips)
-- =============================================================================
-- Note: Orders placed 10 days ago to satisfy 7-day advance requirement
INSERT INTO "Order" (id, store_id, customer_id, delivery_address, route_id, placed_on, required_delivery_date, status, total_value, total_space_units) VALUES
    ('ord-at-store-006', 'store-cmb-01', 'cust-ws-001', 'Cargills Colombo 07', 'route-cmb-01', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_DATE + INTERVAL '6 days', 'At_Store', 0, 0),
    ('ord-at-store-007', 'store-cmb-01', 'cust-rt-001', 'Family Shop, Colombo 06', 'route-cmb-02', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_DATE + INTERVAL '7 days', 'At_Store', 0, 0),
    ('ord-at-store-008', 'store-gdy-01', 'cust-ws-005', 'Kandy Warehouse, Peradeniya', 'route-kdy-02', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_DATE + INTERVAL '8 days', 'At_Store', 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Order items for new at-store orders
INSERT INTO order_item (id, order_id, product_id, quantity) VALUES
    ('oi-atst-006-01', 'ord-at-store-006', 'prod-001', 50),
    ('oi-atst-006-02', 'ord-at-store-006', 'prod-002', 45),
    ('oi-atst-006-03', 'ord-at-store-006', 'prod-005', 35),
    
    ('oi-atst-007-01', 'ord-at-store-007', 'prod-bev-01', 80),
    ('oi-atst-007-02', 'ord-at-store-007', 'prod-snk-02', 60),
    
    ('oi-atst-008-01', 'ord-at-store-008', 'prod-003', 65),
    ('oi-atst-008-02', 'ord-at-store-008', 'prod-004', 55)
ON CONFLICT (id) DO NOTHING;

-- Create shipments for these orders (already delivered to store by train)
INSERT INTO shipment (id, order_id, train_trip_id, allocated_space_units, shipped_quantity, status, shipped_at) VALUES
    ('ship-at-store-006', 'ord-at-store-006', 'tt-kdy-cmb-001', 170.0, 1, 'Delivered', CURRENT_TIMESTAMP - INTERVAL '4 hours'),
    ('ship-at-store-007', 'ord-at-store-007', 'tt-kdy-cmb-002', 95.0, 1, 'Delivered', CURRENT_TIMESTAMP - INTERVAL '6 hours'),
    ('ship-at-store-008', 'ord-at-store-008', 'tt-kdy-cmb-001', 135.0, 1, 'Delivered', CURRENT_TIMESTAMP - INTERVAL '5 hours')
ON CONFLICT (id) DO NOTHING;

-- Update order summaries
DO $$
DECLARE
    order_rec RECORD;
BEGIN
    FOR order_rec IN SELECT id FROM "Order" WHERE id IN ('ord-at-store-006', 'ord-at-store-007', 'ord-at-store-008')
    LOOP
        CALL update_order_summary(order_rec.id);
    END LOOP;
END $$;
