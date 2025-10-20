-- =============================================================================
-- WORKER RECORDS DATA
-- Historical work records for completed trips
-- =============================================================================

-- =============================================================================
-- 1. WORKER RECORDS FOR COMPLETED TRIPS
-- These are automatically created by the complete_truck_trip procedure,
-- but we add some historical records for completed trips
-- =============================================================================

INSERT INTO worker_record (id, worker_id, "date", hours_worked, assignment_type, truck_trip_id) VALUES
    -- Records for trip-completed-001
    ('wr-comp-001-drv', 'worker-drv-001', (CURRENT_TIMESTAMP - INTERVAL '15 days')::date, 3.75, 'Truck_Trip', 'trip-completed-001'),
    ('wr-comp-001-ast', 'worker-ast-001', (CURRENT_TIMESTAMP - INTERVAL '15 days')::date, 3.75, 'Truck_Trip', 'trip-completed-001'),
    
    -- Records for trip-completed-002
    ('wr-comp-002-drv', 'worker-drv-002', (CURRENT_TIMESTAMP - INTERVAL '13 days')::date, 4.50, 'Truck_Trip', 'trip-completed-002'),
    ('wr-comp-002-ast', 'worker-ast-002', (CURRENT_TIMESTAMP - INTERVAL '13 days')::date, 4.50, 'Truck_Trip', 'trip-completed-002'),
    
    -- Records for trip-completed-003
    ('wr-comp-003-drv', 'worker-drv-003', (CURRENT_TIMESTAMP - INTERVAL '11 days')::date, 5.83, 'Truck_Trip', 'trip-completed-003'),
    ('wr-comp-003-ast', 'worker-ast-003', (CURRENT_TIMESTAMP - INTERVAL '11 days')::date, 5.83, 'Truck_Trip', 'trip-completed-003'),
    
    -- Records for trip-completed-004
    ('wr-comp-004-drv', 'worker-drv-004', (CURRENT_TIMESTAMP - INTERVAL '9 days')::date, 6.75, 'Truck_Trip', 'trip-completed-004'),
    ('wr-comp-004-ast', 'worker-ast-004', (CURRENT_TIMESTAMP - INTERVAL '9 days')::date, 6.75, 'Truck_Trip', 'trip-completed-004'),
    
    -- Records for trip-completed-005 (no assistant)
    ('wr-comp-005-drv', 'worker-drv-005', (CURRENT_TIMESTAMP - INTERVAL '7 days')::date, 7.50, 'Truck_Trip', 'trip-completed-005'),
    
    -- Records for trip-completed-006
    ('wr-comp-006-drv', 'worker-drv-006', (CURRENT_TIMESTAMP - INTERVAL '5 days')::date, 3.92, 'Truck_Trip', 'trip-completed-006'),
    ('wr-comp-006-ast', 'worker-ast-005', (CURRENT_TIMESTAMP - INTERVAL '5 days')::date, 3.92, 'Truck_Trip', 'trip-completed-006'),
    
    -- Records for trip-completed-007
    ('wr-comp-007-drv', 'worker-drv-007', (CURRENT_TIMESTAMP - INTERVAL '3 days')::date, 2.83, 'Truck_Trip', 'trip-completed-007'),
    ('wr-comp-007-ast', 'worker-ast-006', (CURRENT_TIMESTAMP - INTERVAL '3 days')::date, 2.83, 'Truck_Trip', 'trip-completed-007')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 2. ADDITIONAL HISTORICAL WORKER RECORDS (Non-trip related)
-- =============================================================================

INSERT INTO worker_record (id, worker_id, "date", hours_worked, assignment_type, truck_trip_id) VALUES
    -- Additional shifts for various workers over past month
    ('wr-hist-001', 'worker-drv-001', CURRENT_DATE - INTERVAL '20 days', 8.0, 'Truck_Trip', NULL),
    ('wr-hist-002', 'worker-drv-001', CURRENT_DATE - INTERVAL '18 days', 7.5, 'Truck_Trip', NULL),
    ('wr-hist-003', 'worker-drv-002', CURRENT_DATE - INTERVAL '19 days', 8.0, 'Truck_Trip', NULL),
    ('wr-hist-004', 'worker-drv-002', CURRENT_DATE - INTERVAL '16 days', 6.5, 'Truck_Trip', NULL),
    ('wr-hist-005', 'worker-drv-003', CURRENT_DATE - INTERVAL '21 days', 7.0, 'Truck_Trip', NULL),
    ('wr-hist-006', 'worker-drv-003', CURRENT_DATE - INTERVAL '17 days', 8.5, 'Truck_Trip', NULL),
    ('wr-hist-007', 'worker-drv-004', CURRENT_DATE - INTERVAL '22 days', 7.5, 'Truck_Trip', NULL),
    ('wr-hist-008', 'worker-drv-005', CURRENT_DATE - INTERVAL '23 days', 8.0, 'Truck_Trip', NULL),
    ('wr-hist-009', 'worker-drv-006', CURRENT_DATE - INTERVAL '24 days', 6.0, 'Truck_Trip', NULL),
    ('wr-hist-010', 'worker-drv-007', CURRENT_DATE - INTERVAL '25 days', 7.0, 'Truck_Trip', NULL),
    
    -- Assistant records
    ('wr-hist-011', 'worker-ast-001', CURRENT_DATE - INTERVAL '20 days', 8.0, 'Truck_Trip', NULL),
    ('wr-hist-012', 'worker-ast-002', CURRENT_DATE - INTERVAL '19 days', 7.5, 'Truck_Trip', NULL),
    ('wr-hist-013', 'worker-ast-003', CURRENT_DATE - INTERVAL '21 days', 8.5, 'Truck_Trip', NULL),
    ('wr-hist-014', 'worker-ast-004', CURRENT_DATE - INTERVAL '22 days', 7.0, 'Truck_Trip', NULL),
    ('wr-hist-015', 'worker-ast-005', CURRENT_DATE - INTERVAL '23 days', 8.0, 'Truck_Trip', NULL)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 3. RESET WEEKLY HOURS (Since we're simulating current week)
-- In production, this would be handled by a cron job
-- =============================================================================
UPDATE worker SET weekly_hours = 0 WHERE type IN ('Driver', 'Assistant');

-- Note: Worker records remain for historical tracking, but weekly_hours is reset
-- This simulates the weekly reset that would happen via cron job
