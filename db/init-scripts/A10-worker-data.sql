-- =============================================================================
-- COMPREHENSIVE WORKER DATA
-- Admins, Dispatchers, Store Managers, Drivers, Assistants
-- =============================================================================

-- =============================================================================
-- 1. WORKER USERS (Password: password123 for all)
-- =============================================================================
INSERT INTO "User" (id, username, name, password, role) VALUES
    -- Admin
    ('worker-adm-001', 'admin1', 'System Administrator', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    
    -- Dispatchers
    ('worker-dsp-001', 'dispatcher1', 'Head Dispatcher', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-dsp-002', 'dispatcher2', 'Assistant Dispatcher', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    
    -- Store Managers
    ('worker-mgr-001', 'manager1', 'Colombo Store Manager', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-mgr-002', 'manager2', 'Kandy Store Manager', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-mgr-003', 'manager3', 'Galle Store Manager', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-mgr-004', 'manager4', 'Jaffna Store Manager', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-mgr-005', 'manager5', 'Matara Store Manager', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-mgr-006', 'manager6', 'Negombo Store Manager', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-mgr-007', 'manager7', 'Anuradhapura Store Manager', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    
    -- Drivers
    ('worker-drv-001', 'driver1', 'John Silva', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-drv-002', 'driver2', 'Nimal Perera', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-drv-003', 'driver3', 'Kamal Fernando', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-drv-004', 'driver4', 'Sunil Wickramasinghe', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-drv-005', 'driver5', 'Ranjan Jayawardena', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-drv-006', 'driver6', 'Ajith Gunasekara', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-drv-007', 'driver7', 'Prasad Mendis', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-drv-008', 'driver8', 'Mahesh Amarasinghe', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-drv-009', 'driver9', 'Chaminda Rajapakse', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-drv-010', 'driver10', 'Asanka Kumara', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-drv-011', 'driver11', 'Dilshan Priyantha', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-drv-012', 'driver12', 'Nuwan Bandara', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    
    -- Assistants
    ('worker-ast-001', 'assistant1', 'Saman Rathnayake', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-ast-002', 'assistant2', 'Thilina Dissanayake', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-ast-003', 'assistant3', 'Chathura Liyanage', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-ast-004', 'assistant4', 'Harsha Senanayake', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-ast-005', 'assistant5', 'Kasun Wijesinghe', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-ast-006', 'assistant6', 'Dinesh Weerasinghe', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-ast-007', 'assistant7', 'Sanjeewa Gamage', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-ast-008', 'assistant8', 'Gayan Fernando', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-ast-009', 'assistant9', 'Tharindu Silva', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker'),
    ('worker-ast-010', 'assistant10', 'Lahiru Perera', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Worker')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 2. WORKER BASE RECORDS
-- =============================================================================
INSERT INTO worker (id, type, hourly_pay, status, weekly_hours) VALUES
    -- Admin
    ('worker-adm-001', 'Admin', 5000.00, 'Free', 0),
    
    -- Dispatchers
    ('worker-dsp-001', 'Dispatcher', 2500.00, 'Free', 0),
    ('worker-dsp-002', 'Dispatcher', 2200.00, 'Free', 0),
    
    -- Store Managers
    ('worker-mgr-001', 'Store_Manager', 2000.00, 'Free', 0),
    ('worker-mgr-002', 'Store_Manager', 2000.00, 'Free', 0),
    ('worker-mgr-003', 'Store_Manager', 2000.00, 'Free', 0),
    ('worker-mgr-004', 'Store_Manager', 2000.00, 'Free', 0),
    ('worker-mgr-005', 'Store_Manager', 2000.00, 'Free', 0),
    ('worker-mgr-006', 'Store_Manager', 2000.00, 'Free', 0),
    ('worker-mgr-007', 'Store_Manager', 2000.00, 'Free', 0),
    
    -- Drivers (Free status initially)
    ('worker-drv-001', 'Driver', 1500.00, 'Free', 0),
    ('worker-drv-002', 'Driver', 1500.00, 'Free', 0),
    ('worker-drv-003', 'Driver', 1500.00, 'Free', 0),
    ('worker-drv-004', 'Driver', 1500.00, 'Free', 0),
    ('worker-drv-005', 'Driver', 1500.00, 'Free', 0),
    ('worker-drv-006', 'Driver', 1600.00, 'Free', 0),
    ('worker-drv-007', 'Driver', 1550.00, 'Free', 0),
    ('worker-drv-008', 'Driver', 1500.00, 'Free', 0),
    ('worker-drv-009', 'Driver', 1500.00, 'On_Leave', 0),
    ('worker-drv-010', 'Driver', 1500.00, 'Free', 0),
    ('worker-drv-011', 'Driver', 1500.00, 'Free', 0),
    ('worker-drv-012', 'Driver', 1500.00, 'Free', 0),
    
    -- Assistants (Free status initially)
    ('worker-ast-001', 'Assistant', 1200.00, 'Free', 0),
    ('worker-ast-002', 'Assistant', 1200.00, 'Free', 0),
    ('worker-ast-003', 'Assistant', 1200.00, 'Free', 0),
    ('worker-ast-004', 'Assistant', 1200.00, 'Free', 0),
    ('worker-ast-005', 'Assistant', 1250.00, 'Free', 0),
    ('worker-ast-006', 'Assistant', 1200.00, 'Free', 0),
    ('worker-ast-007', 'Assistant', 1200.00, 'On_Leave', 0),
    ('worker-ast-008', 'Assistant', 1200.00, 'Free', 0),
    ('worker-ast-009', 'Assistant', 1200.00, 'Free', 0),
    ('worker-ast-010', 'Assistant', 1200.00, 'Free', 0)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 3. DRIVER SPECIALIZATIONS
-- =============================================================================
INSERT INTO driver (id, consecutive_deliveries, total_trips, daily_driving_distance, daily_driving_time, cumulative_distance, cumulative_time) VALUES
    ('worker-drv-001', 0, 15, 0, 0, 450.50, 52.5),
    ('worker-drv-002', 0, 12, 0, 0, 380.20, 48.0),
    ('worker-drv-003', 0, 18, 0, 0, 520.75, 65.25),
    ('worker-drv-004', 0, 10, 0, 0, 320.00, 40.0),
    ('worker-drv-005', 0, 14, 0, 0, 425.30, 55.5),
    ('worker-drv-006', 0, 20, 0, 0, 580.00, 72.0),
    ('worker-drv-007', 0, 8, 0, 0, 250.00, 32.0),
    ('worker-drv-008', 0, 16, 0, 0, 490.25, 60.0),
    ('worker-drv-009', 0, 5, 0, 0, 150.00, 20.0),
    ('worker-drv-010', 0, 11, 0, 0, 340.50, 44.0),
    ('worker-drv-011', 0, 9, 0, 0, 290.00, 38.0),
    ('worker-drv-012', 0, 7, 0, 0, 220.75, 28.5)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 4. ASSISTANT SPECIALIZATIONS
-- =============================================================================
INSERT INTO assistant (id, consecutive_routes) VALUES
    ('worker-ast-001', 0),
    ('worker-ast-002', 0),
    ('worker-ast-003', 0),
    ('worker-ast-004', 0),
    ('worker-ast-005', 0),
    ('worker-ast-006', 0),
    ('worker-ast-007', 0),
    ('worker-ast-008', 0),
    ('worker-ast-009', 0),
    ('worker-ast-010', 0)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 5. STORE MANAGERS
-- =============================================================================
INSERT INTO store_manager (id) VALUES
    ('worker-mgr-001'),
    ('worker-mgr-002'),
    ('worker-mgr-003'),
    ('worker-mgr-004'),
    ('worker-mgr-005'),
    ('worker-mgr-006'),
    ('worker-mgr-007')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 6. ASSIGN MANAGERS TO STORES
-- =============================================================================
UPDATE store SET managed_by = 'worker-mgr-001' WHERE id = 'store-cmb-01';
UPDATE store SET managed_by = 'worker-mgr-002' WHERE id = 'store-gdy-01';
UPDATE store SET managed_by = 'worker-mgr-003' WHERE id = 'store-gal-01';
UPDATE store SET managed_by = 'worker-mgr-004' WHERE id = 'store-jaf-01';
UPDATE store SET managed_by = 'worker-mgr-005' WHERE id = 'store-mat-01';
UPDATE store SET managed_by = 'worker-mgr-006' WHERE id = 'store-neg-01';
UPDATE store SET managed_by = 'worker-mgr-007' WHERE id = 'store-anu-01';
