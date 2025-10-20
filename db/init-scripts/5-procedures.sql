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
    FROM Order_Item oi
        JOIN Product p ON oi.product_id = p.id
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
    UPDATE Truck_Trip
    SET 
        status = 'In_Progress',
        actual_start = CURRENT_TIMESTAMP
    WHERE id = p_trip_id;
    
    UPDATE Worker
    SET status = 'Busy'
    WHERE id IN (
        SELECT driver_id
        FROM truck_trip
        WHERE id = p_trip_id
    );
    
    UPDATE Worker
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
    UPDATE Truck_Trip
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
    
    INSERT INTO Worker_Record (id, worker_id, date, hours_worked, truck_trip_id)
    VALUES (
        'wr-' || substr(md5(random()::text), 0, 20),
        trip_record.driver_id,
        CURRENT_DATE,
        hours_diff,
        p_trip_id
    );
    
    UPDATE Worker
    SET weekly_hours = weekly_hours + hours_diff
    WHERE id = trip_record.driver_id;
    
    IF trip_record.assistant_id IS NOT NULL THEN
    INSERT INTO Worker_Record (id, worker_id, date, hours_worked, truck_trip_id)
        VALUES (
            'wr-' || substr(md5(random()::text), 0, 20),
            trip_record.assistant_id,
            CURRENT_DATE,
            hours_diff,
            p_trip_id
        );
        
    UPDATE Worker
        SET weekly_hours = weekly_hours + hours_diff
        WHERE id = trip_record.assistant_id;
    END IF;
    
    UPDATE Worker
    SET status = 'Free'
    WHERE id = trip_record.driver_id;
    
    IF trip_record.assistant_id IS NOT NULL THEN
    UPDATE Worker
        SET status = 'Free'
        WHERE id = trip_record.assistant_id;
    END IF;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE cancel_truck_trip(p_trip_id VARCHAR) AS $$
DECLARE
    trip_record RECORD;
BEGIN
    UPDATE Truck_Trip
    SET
        status = 'Cancelled'
    WHERE id = p_trip_id
    RETURNING * INTO trip_record;

    -- Set driver and assistant back to Free, but only if they are not assigned to another active trip
    UPDATE Worker
    SET status = 'Free'
    WHERE id = trip_record.driver_id AND NOT EXISTS (
        SELECT 1 FROM Truck_Trip
        WHERE driver_id = trip_record.driver_id AND status = 'In_Progress'
    );

    UPDATE Worker
    SET status = 'Free'
    WHERE id = trip_record.assistant_id AND NOT EXISTS (
        SELECT 1 FROM Truck_Trip
        WHERE assistant_id = trip_record.assistant_id AND status = 'In_Progress'
    );
END;
$$ LANGUAGE plpgsql;