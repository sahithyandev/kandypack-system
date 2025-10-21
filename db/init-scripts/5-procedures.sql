-- =============================================================================
-- SECTION 6: FUNCTIONS & PROCEDURES
-- =============================================================================

CREATE TYPE order_totals AS (
    total_value NUMERIC, 
    total_space NUMERIC
);


CREATE OR REPLACE FUNCTION calculate_order_totals(p_order_id VARCHAR) 
RETURNS order_totals AS $$
DECLARE 
    v_totals order_totals;
BEGIN
    SELECT 
        COALESCE(SUM(oi.quantity * p.unit_price), 0),
        COALESCE(SUM(oi.quantity * p.space_consumption_rate), 0) 
    INTO 
        v_totals.total_value,
        v_totals.total_space
    FROM order_item oi
        JOIN product p ON oi.product_id = p.id
    WHERE oi.order_id = p_order_id;
    
    RETURN v_totals;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE update_order_summary(p_order_id VARCHAR) AS $$
DECLARE 
    v_totals order_totals;
BEGIN 
    v_totals := calculate_order_totals(p_order_id);
    
    UPDATE "Order"
    SET 
        total_value = v_totals.total_value,
        total_space_units = v_totals.total_space
    WHERE id = p_order_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE start_truck_trip(p_trip_id VARCHAR) AS $$ 
BEGIN
    UPDATE truck_trip
    SET 
        status = 'In_Progress',
        actual_start = CURRENT_TIMESTAMP
    WHERE id = p_trip_id;
    
    UPDATE worker
    SET status = 'Busy'
    WHERE id IN (
        SELECT driver_id
        FROM truck_trip
        WHERE id = p_trip_id
    );
    
    UPDATE worker
    SET status = 'Busy'
    WHERE id IN (
        SELECT assistant_id
        FROM truck_trip
        WHERE id = p_trip_id
    );
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE complete_truck_trip(p_trip_id VARCHAR) AS $$
DECLARE 
    trip_record RECORD;
    hours_diff NUMERIC;
BEGIN
    UPDATE truck_trip
    SET 
        status = 'Completed',
        actual_end = CURRENT_TIMESTAMP
    WHERE id = p_trip_id
    RETURNING * INTO trip_record;
    
    hours_diff := EXTRACT(
        EPOCH FROM (
            trip_record.actual_end - trip_record.actual_start
        )
    ) / 3600;
    
    INSERT INTO worker_record (id, worker_id, date, hours_worked, truck_trip_id)
    VALUES (
        'wr-' || substr(md5(random()::text), 0, 20),
        trip_record.driver_id,
        CURRENT_DATE,
        hours_diff,
        p_trip_id
    );
    
    UPDATE worker
    SET weekly_hours = weekly_hours + hours_diff
    WHERE id = trip_record.driver_id;
    
    IF trip_record.assistant_id IS NOT NULL THEN
        INSERT INTO worker_record (id, worker_id, date, hours_worked, truck_trip_id)
        VALUES (
            'wr-' || substr(md5(random()::text), 0, 20),
            trip_record.assistant_id,
            CURRENT_DATE,
            hours_diff,
            p_trip_id
        );
        
        UPDATE worker
        SET weekly_hours = weekly_hours + hours_diff
        WHERE id = trip_record.assistant_id;
    END IF;
    
    UPDATE worker
    SET status = 'Free'
    WHERE id = trip_record.driver_id;
    
    IF trip_record.assistant_id IS NOT NULL THEN
        UPDATE worker
        SET status = 'Free'
        WHERE id = trip_record.assistant_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION admin_dashboard_summary()
RETURNS TABLE (
    total_orders BIGINT,
    total_sales_value NUMERIC(12,2),
    total_trips BIGINT,
    total_trucks BIGINT,
    total_shipments BIGINT,
    total_workers BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH
    orders_summary AS (
        SELECT
            COUNT(*) AS total_orders,
            COALESCE(SUM(o.total_value), 0) AS total_sales_value
        FROM "Order" o
        WHERE EXTRACT(YEAR FROM o.placed_on) = EXTRACT(YEAR FROM CURRENT_DATE)
        AND EXTRACT(MONTH FROM o.placed_on) = EXTRACT(MONTH FROM CURRENT_DATE)
    ),
    trip_summary AS (
        SELECT
            COUNT(*) AS total_trips,
            COUNT(DISTINCT tt.truck_id) AS active_trucks
        FROM truck_trip tt
        WHERE tt.actual_start IS NOT NULL
        AND EXTRACT(YEAR FROM tt.actual_start) = EXTRACT(YEAR FROM CURRENT_DATE)
        AND EXTRACT(MONTH FROM tt.actual_start) = EXTRACT(MONTH FROM CURRENT_DATE)
    ),
    shipment_summary AS (
        SELECT
            COUNT(*) AS total_shipments
        FROM shipment s
        WHERE EXTRACT(YEAR FROM s.shipped_at) = EXTRACT(YEAR FROM CURRENT_DATE)
        AND EXTRACT(MONTH FROM s.shipped_at) = EXTRACT(MONTH FROM CURRENT_DATE)
    ),
    worker_summary AS (
        SELECT
            COUNT(*) AS total_workers
        FROM worker w
    )
    SELECT
        o.total_orders,
        o.total_sales_value,
        t.total_trips,
        t.active_trucks AS total_trucks,
        s.total_shipments,
        w.total_workers
    FROM orders_summary o
    CROSS JOIN trip_summary t
    CROSS JOIN shipment_summary s
    CROSS JOIN worker_summary w;
END;
$$;
