-- =============================================================================
-- SECTION 7: TRIGGERS (NOW WITH DYNAMIC RULES)
-- =============================================================================
CREATE OR REPLACE FUNCTION trg_update_order_summary_on_item_change() RETURNS TRIGGER AS $$ BEGIN IF (
		TG_OP = 'INSERT'
		OR TG_OP = 'UPDATE'
	) THEN CALL update_order_summary(NEW.order_id);
ELSIF (TG_OP = 'DELETE') THEN CALL update_order_summary(OLD.order_id);
END IF;
RETURN NULL;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS order_item_change_trigger ON Order_Item;
CREATE TRIGGER order_item_change_trigger
AFTER
INSERT
	OR
UPDATE
	OR DELETE ON Order_Item FOR EACH ROW EXECUTE FUNCTION trg_update_order_summary_on_item_change();
-- Trigger to Validate Worker Assignment Before Scheduling (REVISED to use config table)
CREATE OR REPLACE FUNCTION trg_validate_worker_assignment() RETURNS TRIGGER AS $$
DECLARE -- Worker Status & Hours
	driver_status worker_status;
assistant_status worker_status;
driver_weekly_hours NUMERIC;
assistant_weekly_hours NUMERIC;
trip_duration_hours NUMERIC;
last_trip_end TIMESTAMP;
new_consecutive_d INT;
new_consecutive_a INT;
-- Configuration Variables
v_driver_hour_limit NUMERIC;
v_assistant_hour_limit NUMERIC;
v_driver_consecutive_limit INT;
v_assistant_consecutive_limit INT;
BEGIN -- Fetch configuration values from the new table
SELECT config_value::NUMERIC INTO v_driver_hour_limit
FROM System_Configuration
WHERE config_key = 'DRIVER_WEEKLY_HOUR_LIMIT';
SELECT config_value::NUMERIC INTO v_assistant_hour_limit
FROM System_Configuration
WHERE config_key = 'ASSISTANT_WEEKLY_HOUR_LIMIT';
SELECT config_value::INT INTO v_driver_consecutive_limit
FROM System_Configuration
WHERE config_key = 'DRIVER_CONSECUTIVE_TRIP_LIMIT';
SELECT config_value::INT INTO v_assistant_consecutive_limit
FROM System_Configuration
WHERE config_key = 'ASSISTANT_CONSECUTIVE_TRIP_LIMIT';
-- 1. Check if workers are 'Free'
SELECT status INTO driver_status
FROM Worker
WHERE id = NEW.driver_id;
IF driver_status != 'Free' THEN RAISE EXCEPTION 'Driver % is not available (Status: %).',
NEW.driver_id,
driver_status;
END IF;
IF NEW.assistant_id IS NOT NULL THEN
SELECT status INTO assistant_status
FROM Worker
WHERE id = NEW.assistant_id;
IF assistant_status != 'Free' THEN RAISE EXCEPTION 'Assistant % is not available (Status: %).',
NEW.assistant_id,
assistant_status;
END IF;
END IF;
-- 2. Check weekly hour limits
trip_duration_hours := EXTRACT(
	EPOCH
	FROM (NEW.scheduled_end - NEW.scheduled_start)
) / 3600;
SELECT weekly_hours INTO driver_weekly_hours
FROM Worker
WHERE id = NEW.driver_id;
IF (driver_weekly_hours + trip_duration_hours) > v_driver_hour_limit THEN RAISE EXCEPTION 'Driver % will exceed %-hour weekly limit.',
NEW.driver_id,
v_driver_hour_limit;
END IF;
IF NEW.assistant_id IS NOT NULL THEN
SELECT weekly_hours INTO assistant_weekly_hours
FROM Worker
WHERE id = NEW.assistant_id;
IF (assistant_weekly_hours + trip_duration_hours) > v_assistant_hour_limit THEN RAISE EXCEPTION 'Assistant % will exceed %-hour weekly limit.',
NEW.assistant_id,
v_assistant_hour_limit;
END IF;
END IF;
-- 3. Check and update consecutive trip counts
SELECT COALESCE(MAX(actual_end), '1970-01-01') INTO last_trip_end
FROM Truck_Trip
WHERE driver_id = NEW.driver_id
	AND status = 'Completed';
IF NEW.scheduled_start - last_trip_end <= INTERVAL '1 hour' THEN new_consecutive_d := (
	SELECT consecutive_deliveries
	FROM Driver
	WHERE id = NEW.driver_id
) + 1;
ELSE new_consecutive_d := 1;
END IF;
IF new_consecutive_d > v_driver_consecutive_limit THEN RAISE EXCEPTION 'Driver % cannot be scheduled for more than % consecutive deliveries without a break.',
NEW.driver_id,
v_driver_consecutive_limit;
END IF;
UPDATE Driver
SET consecutive_deliveries = new_consecutive_d
WHERE id = NEW.driver_id;
IF NEW.assistant_id IS NOT NULL THEN
SELECT COALESCE(MAX(actual_end), '1970-01-01') INTO last_trip_end
FROM Truck_Trip
WHERE assistant_id = NEW.assistant_id
	AND status = 'Completed';
IF NEW.scheduled_start - last_trip_end <= INTERVAL '1 hour' THEN new_consecutive_a := (
	SELECT consecutive_routes
	FROM Assistant
	WHERE id = NEW.assistant_id
) + 1;
ELSE new_consecutive_a := 1;
END IF;
IF new_consecutive_a > v_assistant_consecutive_limit THEN RAISE EXCEPTION 'Assistant % cannot be scheduled for more than % consecutive routes.',
NEW.assistant_id,
v_assistant_consecutive_limit;
END IF;
UPDATE Assistant
SET consecutive_routes = new_consecutive_a
WHERE id = NEW.assistant_id;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS worker_assignment_validation_trigger ON Truck_Trip;
CREATE TRIGGER worker_assignment_validation_trigger BEFORE
INSERT ON Truck_Trip FOR EACH ROW EXECUTE FUNCTION trg_validate_worker_assignment();
-- End of script