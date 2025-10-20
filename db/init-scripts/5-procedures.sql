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
    adj_hours NUMERIC;
    trip_distance NUMERIC := 0;
BEGIN
    UPDATE Truck_Trip
    SET 
        status = 'Completed',
        actual_end = CURRENT_TIMESTAMP
    WHERE id = p_trip_id
    RETURNING * INTO trip_record;
    -- compute duration hours between actual_start and actual_end
    IF trip_record.actual_start IS NULL THEN
        hours_diff := 0;
    ELSE
        hours_diff := EXTRACT(EPOCH FROM (trip_record.actual_end - trip_record.actual_start)) / 3600;
    END IF;

    -- if scheduled_end is NULL, add 3 hours as per requirement
    IF trip_record.scheduled_end IS NULL THEN
        adj_hours := COALESCE(hours_diff, 0) + 3;
    ELSE
        adj_hours := COALESCE(hours_diff, 0);
    END IF;

    -- capture trip distance if present
    IF trip_record.distance_km IS NOT NULL THEN
        trip_distance := trip_record.distance_km;
    ELSE
        trip_distance := 0;
    END IF;
    
    INSERT INTO Worker_Record (id, worker_id, date, hours_worked, truck_trip_id)
    VALUES (
        'wr-' || substr(md5(random()::text), 0, 20),
        trip_record.driver_id,
        CURRENT_DATE,
        adj_hours,
        p_trip_id
    );
    
    UPDATE Worker
    SET weekly_hours = COALESCE(weekly_hours, 0) + adj_hours
    WHERE id = trip_record.driver_id;
    
    IF trip_record.assistant_id IS NOT NULL THEN
    INSERT INTO Worker_Record (id, worker_id, date, hours_worked, truck_trip_id)
        VALUES (
            'wr-' || substr(md5(random()::text), 0, 20),
            trip_record.assistant_id,
            CURRENT_DATE,
            adj_hours,
            p_trip_id
        );
        
    UPDATE Worker
        SET weekly_hours = COALESCE(weekly_hours, 0) + adj_hours
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

    -- update driver aggregates: total_trips, daily and cumulative distances/times
    UPDATE Driver
    SET total_trips = COALESCE(total_trips, 0) + 1,
        daily_driving_distance = COALESCE(daily_driving_distance, 0) + trip_distance,
        cumulative_distance = COALESCE(cumulative_distance, 0) + trip_distance,
        daily_driving_time = COALESCE(daily_driving_time, 0) + adj_hours,
        cumulative_time = COALESCE(cumulative_time, 0) + adj_hours
    WHERE id = trip_record.driver_id;
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