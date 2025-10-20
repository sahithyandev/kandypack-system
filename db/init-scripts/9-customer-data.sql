-- =============================================================================
-- COMPREHENSIVE CUSTOMER DATA
-- Multiple customer types with diverse profiles
-- =============================================================================

-- =============================================================================
-- 1. CUSTOMER USERS (Password: password123 for all)
-- =============================================================================
INSERT INTO "User" (id, username, name, password, role) VALUES
    -- Wholesale customers
    ('cust-ws-001', 'customer1', 'Test Customer', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
    ('cust-ws-002', 'wholesalecust1', 'Mega Wholesale Center', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
    ('cust-ws-003', 'customer3', 'Premium Wholesale Ltd', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
    ('cust-ws-004', 'wholesale_galle', 'Galle Wholesale Traders', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
    ('cust-ws-005', 'wholesale_kandy', 'Kandy Distribution Center', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
    ('cust-ws-006', 'wholesale_jaffna', 'Northern Wholesale Hub', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
    ('cust-ws-007', 'wholesale_matara', 'Southern Distributors', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
    ('cust-ws-008', 'wholesale_negombo', 'Negombo Trading Co', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
    
    -- Retail customers
    ('cust-rt-001', 'retailcust1', 'Small Retail Shop', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
    ('cust-rt-002', 'customer2', 'Family Mart Colombo', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
    ('cust-rt-003', 'retail_kandy', 'Kandy Corner Shop', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
    ('cust-rt-004', 'retail_galle', 'Galle Mini Mart', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
    ('cust-rt-005', 'retail_matara', 'Matara Convenience Store', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
    ('cust-rt-006', 'retail_negombo', 'Negombo Shop', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
    ('cust-rt-007', 'retail_jaffna', 'Jaffna Store', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
    ('cust-rt-008', 'retail_kurunegala', 'Kurunegala Superette', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
    ('cust-rt-009', 'retail_badulla', 'Badulla Mini Market', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer'),
    ('cust-rt-010', 'retail_trinco', 'Trinco Quick Shop', '$2b$10$kN1v/SrHpzJE9ceRn1RD7eB3/TIXjQ.OPqKcYel9ELXaiflUAjFRa', 'Customer')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 2. CUSTOMER PROFILES (Detailed information)
-- =============================================================================
INSERT INTO customer (id, type, street_name, city, postal_code, phone_no) VALUES
    -- Wholesale customers
    ('cust-ws-001', 'Wholesale', 'Main Street', 'Colombo', '00100', '+94771234567'),
    ('cust-ws-002', 'Wholesale', '123 Galle Road', 'Galle', '80000', '+94773334444'),
    ('cust-ws-003', 'Wholesale', '56 Peradeniya Road', 'Kandy', '20000', '+94712345678'),
    ('cust-ws-004', 'Wholesale', '78 Matara Road', 'Galle', '80000', '+94776543210'),
    ('cust-ws-005', 'Wholesale', '25 Dalada Veediya', 'Kandy', '20000', '+94713456789'),
    ('cust-ws-006', 'Wholesale', '45 Hospital Road', 'Jaffna', '40000', '+94777654321'),
    ('cust-ws-007', 'Wholesale', '89 Beach Road', 'Matara', '81000', '+94719876543'),
    ('cust-ws-008', 'Wholesale', '12 Lewis Place', 'Negombo', '11500', '+94778765432'),
    
    -- Retail customers
    ('cust-rt-001', 'Retail', '45 Main Street', 'Matara', '81000', '+94771112222'),
    ('cust-rt-002', 'Retail', '23 Union Place', 'Colombo', '00200', '+94772223333'),
    ('cust-rt-003', 'Retail', '67 Station Road', 'Kandy', '20000', '+94773334455'),
    ('cust-rt-004', 'Retail', '34 Lighthouse Street', 'Galle', '80000', '+94774445566'),
    ('cust-rt-005', 'Retail', '12 Market Street', 'Matara', '81000', '+94775556677'),
    ('cust-rt-006', 'Retail', '90 Sea Street', 'Negombo', '11500', '+94776667788'),
    ('cust-rt-007', 'Retail', '56 Main Street', 'Jaffna', '40000', '+94777778899'),
    ('cust-rt-008', 'Retail', '78 Colombo Road', 'Kurunegala', '60000', '+94778889900'),
    ('cust-rt-009', 'Retail', '23 Badulla Road', 'Badulla', '90000', '+94779990011'),
    ('cust-rt-010', 'Retail', '45 Harbour Road', 'Trincomalee', '31000', '+94770001122')
ON CONFLICT (id) DO NOTHING;
