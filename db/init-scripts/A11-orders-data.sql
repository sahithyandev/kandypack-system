-- =============================================================================
-- COMPREHENSIVE ORDERS DATA
-- Orders in various statuses: Pending, In_Train_Transit, At_Store, In_Truck_Transit, Delivered
-- =============================================================================

-- =============================================================================
-- 1. PENDING ORDERS (Awaiting train scheduling)
-- =============================================================================
INSERT INTO "Order" (id, store_id, customer_id, delivery_address, route_id, placed_on, required_delivery_date, status, total_value, total_space_units) VALUES
    -- Colombo store orders
    ('ord-pending-001', 'store-cmb-01', 'cust-ws-001', 'Keells Super, Galle Road, Colombo 03', 'route-cmb-01', CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_DATE + INTERVAL '7 days', 'Pending', 0, 0),
    ('ord-pending-002', 'store-cmb-01', 'cust-ws-001', 'Cargills Food City, Colombo 05', 'route-cmb-02', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_DATE + INTERVAL '11 days', 'Pending', 0, 0),
    ('ord-pending-003', 'store-cmb-01', 'cust-rt-002', 'Family Mart, Union Place, Colombo 02', 'route-cmb-03', CURRENT_TIMESTAMP - INTERVAL '5 hours', CURRENT_DATE + INTERVAL '8 days', 'Pending', 0, 0),
    ('ord-pending-004', 'store-cmb-01', 'cust-ws-008', 'Negombo Trading, Lewis Place', 'route-neg-01', CURRENT_TIMESTAMP - INTERVAL '3 hours', CURRENT_DATE + INTERVAL '9 days', 'Pending', 0, 0),
    
    -- Kandy store orders
    ('ord-pending-005', 'store-gdy-01', 'cust-ws-005', 'Kandy Distribution Center, Dalada Veediya', 'route-kdy-01', CURRENT_TIMESTAMP - INTERVAL '6 hours', CURRENT_DATE + INTERVAL '10 days', 'Pending', 0, 0),
    ('ord-pending-006', 'store-gdy-01', 'cust-rt-003', 'Corner Shop, Station Road, Kandy', 'route-kdy-02', CURRENT_TIMESTAMP - INTERVAL '4 hours', CURRENT_DATE + INTERVAL '12 days', 'Pending', 0, 0),
    
    -- Galle store orders
    ('ord-pending-007', 'store-gal-01', 'cust-ws-004', 'Galle Wholesale Traders, Matara Road', 'route-gal-01', CURRENT_TIMESTAMP - INTERVAL '8 hours', CURRENT_DATE + INTERVAL '8 days', 'Pending', 0, 0),
    ('ord-pending-008', 'store-gal-01', 'cust-rt-004', 'Mini Mart, Lighthouse Street, Galle', 'route-gal-02', CURRENT_TIMESTAMP - INTERVAL '12 hours', CURRENT_DATE + INTERVAL '14 days', 'Pending', 0, 0),
    ('ord-pending-009', 'store-gal-01', 'cust-ws-002', 'Mega Wholesale, Galle Road', 'route-gal-01', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_DATE + INTERVAL '15 days', 'Pending', 0, 0),
    
    -- Matara store orders
    ('ord-pending-010', 'store-mat-01', 'cust-ws-007', 'Southern Distributors, Beach Road', 'route-mat-01', CURRENT_TIMESTAMP - INTERVAL '10 hours', CURRENT_DATE + INTERVAL '13 days', 'Pending', 0, 0),
    ('ord-pending-011', 'store-mat-01', 'cust-rt-005', 'Convenience Store, Market Street', 'route-mat-01', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_DATE + INTERVAL '9 days', 'Pending', 0, 0),
    
    -- Jaffna store orders
    ('ord-pending-012', 'store-jaf-01', 'cust-ws-006', 'Northern Hub, Hospital Road', 'route-jaf-01', CURRENT_TIMESTAMP - INTERVAL '15 hours', CURRENT_DATE + INTERVAL '16 days', 'Pending', 0, 0),
    ('ord-pending-013', 'store-jaf-01', 'cust-rt-007', 'Jaffna Store, Main Street', 'route-jaf-01', CURRENT_TIMESTAMP - INTERVAL '20 hours', CURRENT_DATE + INTERVAL '11 days', 'Pending', 0, 0),
    
    -- Negombo store orders
    ('ord-pending-014', 'store-neg-01', 'cust-rt-006', 'Negombo Shop, Sea Street', 'route-neg-01', CURRENT_TIMESTAMP - INTERVAL '7 hours', CURRENT_DATE + INTERVAL '10 days', 'Pending', 0, 0)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 2. ORDER ITEMS FOR PENDING ORDERS
-- =============================================================================
INSERT INTO order_item (id, order_id, product_id, quantity) VALUES
    -- Order 001: Large wholesale order
    ('oi-pend-001-01', 'ord-pending-001', 'prod-001', 50),
    ('oi-pend-001-02', 'ord-pending-001', 'prod-002', 80),
    ('oi-pend-001-03', 'ord-pending-001', 'prod-005', 40),
    ('oi-pend-001-04', 'ord-pending-001', 'prod-003', 60),
    
    -- Order 002: Mixed items
    ('oi-pend-002-01', 'ord-pending-002', 'prod-004', 30),
    ('oi-pend-002-02', 'ord-pending-002', 'prod-006', 100),
    ('oi-pend-002-03', 'ord-pending-002', 'prod-007', 120),
    ('oi-pend-002-04', 'ord-pending-002', 'prod-008', 150),
    
    -- Order 003: Retail order
    ('oi-pend-003-01', 'ord-pending-003', 'prod-001', 10),
    ('oi-pend-003-02', 'ord-pending-003', 'prod-002', 15),
    ('oi-pend-003-03', 'ord-pending-003', 'prod-bev-01', 24),
    
    -- Order 004: Wholesale beverages & snacks
    ('oi-pend-004-01', 'ord-pending-004', 'prod-bev-01', 200),
    ('oi-pend-004-02', 'ord-pending-004', 'prod-snk-01', 150),
    ('oi-pend-004-03', 'ord-pending-004', 'prod-snk-02', 180),
    
    -- Order 005: Kandy wholesale
    ('oi-pend-005-01', 'ord-pending-005', 'prod-001', 80),
    ('oi-pend-005-02', 'ord-pending-005', 'prod-003', 70),
    ('oi-pend-005-03', 'ord-pending-005', 'prod-009', 50),
    ('oi-pend-005-04', 'ord-pending-005', 'prod-010', 60),
    
    -- Order 006: Kandy retail
    ('oi-pend-006-01', 'ord-pending-006', 'prod-006', 30),
    ('oi-pend-006-02', 'ord-pending-006', 'prod-007', 40),
    ('oi-pend-006-03', 'ord-pending-006', 'prod-bev-03', 20),
    
    -- Order 007: Galle wholesale
    ('oi-pend-007-01', 'ord-pending-007', 'prod-001', 100),
    ('oi-pend-007-02', 'ord-pending-007', 'prod-002', 90),
    ('oi-pend-007-03', 'ord-pending-007', 'prod-005', 60),
    ('oi-pend-007-04', 'ord-pending-007', 'prod-det-02', 40),
    
    -- Order 008: Galle retail
    ('oi-pend-008-01', 'ord-pending-008', 'prod-snk-03', 50),
    ('oi-pend-008-02', 'ord-pending-008', 'prod-snk-04', 30),
    ('oi-pend-008-03', 'ord-pending-008', 'prod-bev-02', 48),
    
    -- Order 009: Large wholesale
    ('oi-pend-009-01', 'ord-pending-009', 'prod-001', 120),
    ('oi-pend-009-02', 'ord-pending-009', 'prod-003', 100),
    ('oi-pend-009-03', 'ord-pending-009', 'prod-004', 50),
    ('oi-pend-009-04', 'ord-pending-009', 'prod-011', 80),
    
    -- Order 010: Matara wholesale
    ('oi-pend-010-01', 'ord-pending-010', 'prod-can-01', 60),
    ('oi-pend-010-02', 'ord-pending-010', 'prod-can-02', 70),
    ('oi-pend-010-03', 'ord-pending-010', 'prod-can-03', 80),
    
    -- Order 011: Matara retail
    ('oi-pend-011-01', 'ord-pending-011', 'prod-dai-01', 20),
    ('oi-pend-011-02', 'ord-pending-011', 'prod-dai-02', 15),
    ('oi-pend-011-03', 'ord-pending-011', 'prod-dai-03', 25),
    
    -- Order 012: Jaffna wholesale
    ('oi-pend-012-01', 'ord-pending-012', 'prod-001', 90),
    ('oi-pend-012-02', 'ord-pending-012', 'prod-002', 85),
    ('oi-pend-012-03', 'ord-pending-012', 'prod-013', 40),
    ('oi-pend-012-04', 'ord-pending-012', 'prod-014', 30),
    
    -- Order 013: Jaffna retail
    ('oi-pend-013-01', 'ord-pending-013', 'prod-015', 20),
    ('oi-pend-013-02', 'ord-pending-013', 'prod-012', 50),
    ('oi-pend-013-03', 'ord-pending-013', 'prod-snk-05', 30),
    
    -- Order 014: Negombo retail
    ('oi-pend-014-01', 'ord-pending-014', 'prod-det-04', 40),
    ('oi-pend-014-02', 'ord-pending-014', 'prod-det-05', 35),
    ('oi-pend-014-03', 'ord-pending-014', 'prod-det-03', 30)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 3. AT_STORE ORDERS (Ready for truck scheduling)
-- =============================================================================
INSERT INTO "Order" (id, store_id, customer_id, delivery_address, route_id, placed_on, required_delivery_date, status, total_value, total_space_units) VALUES
    ('ord-at-store-001', 'store-cmb-01', 'cust-ws-001', 'Arpico Supercenter, Colombo 05', 'route-cmb-02', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_DATE + INTERVAL '7 days', 'At_Store', 0, 0),
    ('ord-at-store-002', 'store-cmb-01', 'cust-rt-002', 'Laugfs Supermarket, Colombo 04', 'route-cmb-01', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_DATE + INTERVAL '8 days', 'At_Store', 0, 0),
    ('ord-at-store-003', 'store-cmb-01', 'cust-ws-008', 'Negombo Warehouse, Lewis Place', 'route-neg-01', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_DATE + INTERVAL '9 days', 'At_Store', 0, 0),
    ('ord-at-store-004', 'store-gdy-01', 'cust-ws-005', 'Kandy Central Depot, Peradeniya Road', 'route-kdy-01', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_DATE + INTERVAL '10 days', 'At_Store', 0, 0),
    ('ord-at-store-005', 'store-gal-01', 'cust-ws-004', 'Galle Main Warehouse', 'route-gal-01', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_DATE + INTERVAL '11 days', 'At_Store', 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Order items for at-store orders
INSERT INTO order_item (id, order_id, product_id, quantity) VALUES
    ('oi-atst-001-01', 'ord-at-store-001', 'prod-001', 40),
    ('oi-atst-001-02', 'ord-at-store-001', 'prod-005', 30),
    
    ('oi-atst-002-01', 'ord-at-store-002', 'prod-003', 35),
    ('oi-atst-002-02', 'ord-at-store-002', 'prod-006', 50),
    
    ('oi-atst-003-01', 'ord-at-store-003', 'prod-bev-01', 100),
    ('oi-atst-003-02', 'ord-at-store-003', 'prod-snk-01', 80),
    
    ('oi-atst-004-01', 'ord-at-store-004', 'prod-001', 60),
    ('oi-atst-004-02', 'ord-at-store-004', 'prod-002', 50),
    
    ('oi-atst-005-01', 'ord-at-store-005', 'prod-004', 40),
    ('oi-atst-005-02', 'ord-at-store-005', 'prod-006', 70)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 4. DELIVERED ORDERS (Historical data)
-- =============================================================================
INSERT INTO "Order" (id, store_id, customer_id, delivery_address, route_id, placed_on, required_delivery_date, status, total_value, total_space_units) VALUES
    ('ord-delivered-001', 'store-cmb-01', 'cust-ws-001', 'Sathosa Head Office, Colombo 02', 'route-cmb-01', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '10 days', 'Delivered', 0, 0),
    ('ord-delivered-002', 'store-cmb-01', 'cust-ws-002', 'Mega Wholesale Center, Galle Road', 'route-cmb-02', CURRENT_TIMESTAMP - INTERVAL '22 days', CURRENT_TIMESTAMP - INTERVAL '8 days', 'Delivered', 0, 0),
    ('ord-delivered-003', 'store-gdy-01', 'cust-ws-005', 'Kandy Distribution, Dalada Veediya', 'route-kdy-01', CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '7 days', 'Delivered', 0, 0),
    ('ord-delivered-004', 'store-gal-01', 'cust-ws-004', 'Galle Wholesale, Matara Road', 'route-gal-01', CURRENT_TIMESTAMP - INTERVAL '18 days', CURRENT_TIMESTAMP - INTERVAL '5 days', 'Delivered', 0, 0),
    ('ord-delivered-005', 'store-mat-01', 'cust-ws-007', 'Southern Distributors, Beach Road', 'route-mat-01', CURRENT_TIMESTAMP - INTERVAL '16 days', CURRENT_TIMESTAMP - INTERVAL '3 days', 'Delivered', 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Order items for delivered orders
INSERT INTO order_item (id, order_id, product_id, quantity) VALUES
    ('oi-deliv-001-01', 'ord-delivered-001', 'prod-det-01', 200),
    ('oi-deliv-001-02', 'ord-delivered-001', 'prod-bev-01', 150),
    ('oi-deliv-001-03', 'ord-delivered-001', 'prod-001', 50),
    
    ('oi-deliv-002-01', 'ord-delivered-002', 'prod-001', 100),
    ('oi-deliv-002-02', 'ord-delivered-002', 'prod-002', 80),
    ('oi-deliv-002-03', 'ord-delivered-002', 'prod-005', 60),
    
    ('oi-deliv-003-01', 'ord-delivered-003', 'prod-009', 70),
    ('oi-deliv-003-02', 'ord-delivered-003', 'prod-010', 65),
    ('oi-deliv-003-03', 'ord-delivered-003', 'prod-011', 80),
    
    ('oi-deliv-004-01', 'ord-delivered-004', 'prod-can-01', 90),
    ('oi-deliv-004-02', 'ord-delivered-004', 'prod-can-02', 85),
    
    ('oi-deliv-005-01', 'ord-delivered-005', 'prod-frz-01', 40),
    ('oi-deliv-005-02', 'ord-delivered-005', 'prod-frz-02', 50)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 5. UPDATE ALL ORDER SUMMARIES (Trigger will calculate totals)
-- =============================================================================
DO $$
DECLARE
    order_rec RECORD;
BEGIN
    FOR order_rec IN SELECT id FROM "Order" WHERE id LIKE 'ord-pending-%' OR id LIKE 'ord-at-store-%' OR id LIKE 'ord-delivered-%'
    LOOP
        CALL update_order_summary(order_rec.id);
    END LOOP;
END $$;
