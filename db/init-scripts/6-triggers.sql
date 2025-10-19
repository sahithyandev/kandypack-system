-- =============================================================================
-- SECTION 7: TRIGGERS (NOW WITH DYNAMIC RULES)
-- =============================================================================

-- =============================================================================
-- Order Summary Update Trigger Function
-- Automatically updates order totals when order items are modified
-- =============================================================================

CREATE OR REPLACE FUNCTION trg_update_order_summary_on_item_change() 
    RETURNS TRIGGER AS $$ 
BEGIN 
    -- Handle INSERT and UPDATE operations
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN 
        CALL update_order_summary(NEW.order_id);
        
    -- Handle DELETE operations
    ELSIF (TG_OP = 'DELETE') THEN 
        CALL update_order_summary(OLD.order_id);
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS order_item_change_trigger ON order_item;

-- Create the order item change trigger
CREATE TRIGGER order_item_change_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON order_item
    FOR EACH ROW EXECUTE FUNCTION trg_update_order_summary_on_item_change();

-- =============================================================================
-- Worker Assignment Validation Trigger Function
-- Validates worker availability and limits before scheduling truck trips
-- Uses dynamic configuration from system_configuration table
-- =============================================================================

CREATE OR REPLACE FUNCTION trg_validate_worker_assignment() 
    RETURNS TRIGGER AS $$
DECLARE 
    -- Worker Status & Hours Variables
    driver_status worker_status;
    assistant_status worker_status;
    driver_weekly_hours NUMERIC;
    assistant_weekly_hours NUMERIC;
    trip_duration_hours NUMERIC;
    last_trip_end TIMESTAMP;
    new_consecutive_d INT;
    new_consecutive_a INT;
    
    -- Dynamic Configuration Variables
    v_driver_hour_limit NUMERIC;
    v_assistant_hour_limit NUMERIC;
    v_driver_consecutive_limit INT;
    v_assistant_consecutive_limit INT;
    
BEGIN 
    -- =================================================================
    -- STEP 1: Fetch dynamic configuration values from system_configuration table
    -- =================================================================
    
    -- Get driver weekly hour limit
    SELECT config_value::NUMERIC INTO v_driver_hour_limit
    FROM system_configuration
    WHERE config_key = 'DRIVER_WEEKLY_HOUR_LIMIT';
    
    -- Get assistant weekly hour limit
    SELECT config_value::NUMERIC INTO v_assistant_hour_limit
    FROM system_configuration
    WHERE config_key = 'ASSISTANT_WEEKLY_HOUR_LIMIT';
    
    -- Get driver consecutive trip limit
    SELECT config_value::INT INTO v_driver_consecutive_limit
    FROM system_configuration
    WHERE config_key = 'DRIVER_CONSECUTIVE_TRIP_LIMIT';
    
    -- Get assistant consecutive trip limit
    SELECT config_value::INT INTO v_assistant_consecutive_limit
    FROM system_configuration
    WHERE config_key = 'ASSISTANT_CONSECUTIVE_TRIP_LIMIT';
    
    -- =================================================================
    -- STEP 2: Check if workers are available ('Free' status)
    -- =================================================================
    
    -- Check driver availability
    SELECT status INTO driver_status
    FROM worker
    WHERE id = NEW.driver_id;
    
    IF driver_status != 'Free' THEN 
        RAISE EXCEPTION 'Driver % is not available (Status: %).', 
            NEW.driver_id, driver_status;
    END IF;
    
    -- Check assistant availability (if assigned)
    IF NEW.assistant_id IS NOT NULL THEN
        SELECT status INTO assistant_status
        FROM worker
        WHERE id = NEW.assistant_id;
        
        IF assistant_status != 'Free' THEN 
            RAISE EXCEPTION 'Assistant % is not available (Status: %).', 
                NEW.assistant_id, assistant_status;
        END IF;
    END IF;
    
    -- =================================================================
    -- STEP 3: Check weekly hour limits
    -- =================================================================
    
    -- Calculate trip duration in hours
    trip_duration_hours := EXTRACT(
        EPOCH FROM (NEW.scheduled_end - NEW.scheduled_start)
    ) / 3600;
    
    -- Check driver weekly hour limit
    SELECT weekly_hours INTO driver_weekly_hours
    FROM worker
    WHERE id = NEW.driver_id;
    
    IF (driver_weekly_hours + trip_duration_hours) > v_driver_hour_limit THEN 
        RAISE EXCEPTION 'Driver % will exceed %-hour weekly limit.', 
            NEW.driver_id, v_driver_hour_limit;
    END IF;
    
    -- Check assistant weekly hour limit (if assigned)
    IF NEW.assistant_id IS NOT NULL THEN
        SELECT weekly_hours INTO assistant_weekly_hours
        FROM worker
        WHERE id = NEW.assistant_id;
        
        IF (assistant_weekly_hours + trip_duration_hours) > v_assistant_hour_limit THEN 
            RAISE EXCEPTION 'Assistant % will exceed %-hour weekly limit.', 
                NEW.assistant_id, v_assistant_hour_limit;
        END IF;
    END IF;
    
    -- =================================================================
    -- STEP 4: Check and update consecutive trip counts
    -- =================================================================
    
    -- Check driver consecutive deliveries
    SELECT COALESCE(MAX(actual_end), '1970-01-01') INTO last_trip_end
    FROM truck_trip
    WHERE driver_id = NEW.driver_id
        AND status = 'Completed';
    
    -- Determine if this is a consecutive trip (within 1 hour of last trip)
    IF NEW.scheduled_start - last_trip_end <= INTERVAL '1 hour' THEN 
        new_consecutive_d := (
            SELECT consecutive_deliveries
            FROM driver
            WHERE id = NEW.driver_id
        ) + 1;
    ELSE 
        new_consecutive_d := 1;  -- Reset counter if sufficient break
    END IF;
    
    -- Validate consecutive delivery limit
    IF new_consecutive_d > v_driver_consecutive_limit THEN 
        RAISE EXCEPTION 'Driver % cannot be scheduled for more than % consecutive deliveries without a break.', 
            NEW.driver_id, v_driver_consecutive_limit;
    END IF;
    
    -- Update driver consecutive delivery count
    UPDATE driver
    SET consecutive_deliveries = new_consecutive_d
    WHERE id = NEW.driver_id;
    
    -- Check assistant consecutive routes (if assigned)
    IF NEW.assistant_id IS NOT NULL THEN
        -- Get assistant's last trip end time
        SELECT COALESCE(MAX(actual_end), '1970-01-01') INTO last_trip_end
        FROM truck_trip
        WHERE assistant_id = NEW.assistant_id
            AND status = 'Completed';
        
        -- Determine if this is a consecutive route (within 1 hour of last trip)
        IF NEW.scheduled_start - last_trip_end <= INTERVAL '1 hour' THEN 
            new_consecutive_a := (
                SELECT consecutive_routes
                FROM assistant
                WHERE id = NEW.assistant_id
            ) + 1;
        ELSE 
            new_consecutive_a := 1;  -- Reset counter if sufficient break
        END IF;
        
        -- Validate consecutive route limit
        IF new_consecutive_a > v_assistant_consecutive_limit THEN 
            RAISE EXCEPTION 'Assistant % cannot be scheduled for more than % consecutive routes.', 
                NEW.assistant_id, v_assistant_consecutive_limit;
        END IF;
        
        -- Update assistant consecutive route count
        UPDATE assistant
        SET consecutive_routes = new_consecutive_a
        WHERE id = NEW.assistant_id;
    END IF;
    
    -- All validations passed, return the new record
    RETURN NEW;
    
END;
$$ LANGUAGE plpgsql;


-- =============================================================================
-- Create Worker Assignment Validation Trigger
-- =============================================================================

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS worker_assignment_validation_trigger ON truck_trip;

-- Create the worker assignment validation trigger
CREATE TRIGGER worker_assignment_validation_trigger
    BEFORE INSERT ON truck_trip
    FOR EACH ROW EXECUTE FUNCTION trg_validate_worker_assignment();

-- =============================================================================
-- End of Triggers Script
-- =============================================================================