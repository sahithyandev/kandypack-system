-- Kandypack Supply Chain Distribution System
-- PostgreSQL Database Schema (Version 3.0)
-- This version introduces a configuration table for dynamic business rules.
-- =============================================================================
-- SECTION 1: ENUMERATED TYPES (CUSTOM DATA TYPES)
-- =============================================================================

CREATE TYPE user_role AS ENUM (
    'Customer',
    'Worker'
);

CREATE TYPE customer_type AS ENUM (
    'Wholesale',
    'Retail'
);

CREATE TYPE worker_type AS ENUM (
    'Admin',
    'Driver',
    'Assistant',
    'Store_Manager',
    'Dispatcher'
);

CREATE TYPE worker_status AS ENUM (
    'Busy',
    'Free',
    'On_Leave'
);

CREATE TYPE order_status AS ENUM (
    'Pending',
    'In_Train_Transit',
    'At_Store',
    'In_Truck_Transit',
    'Delivered'
);

CREATE TYPE trip_status AS ENUM (
    'Scheduled',
    'In_Progress',
    'Completed',
    'Cancelled'
);

CREATE TYPE shipment_status AS ENUM (
    'Pending',
    'In_Transit',
    'Delivered'
);