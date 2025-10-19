-- =============================================================================
-- SECTION 3: INDEXING
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_user_username ON "User"(username);

CREATE INDEX IF NOT EXISTS idx_worker_status ON worker(status);

CREATE INDEX IF NOT EXISTS idx_order_customer_id ON "Order"(customer_id);

CREATE INDEX IF NOT EXISTS idx_order_status ON "Order"(status);

CREATE INDEX IF NOT EXISTS idx_traintrip_from_to_city ON train_trip(from_city_id, to_city_id);

CREATE INDEX IF NOT EXISTS idx_trucktrip_driver_id ON truck_trip(driver_id);

CREATE INDEX IF NOT EXISTS idx_workerrecord_worker_id ON worker_record(worker_id);