INSERT INTO System_Configuration (config_key, config_value, description)
VALUES (
		'DRIVER_WEEKLY_HOUR_LIMIT',
		'40',
		'Maximum weekly working hours for a driver.'
	),
	(
		'ASSISTANT_WEEKLY_HOUR_LIMIT',
		'60',
		'Maximum weekly working hours for an assistant.'
	),
	(
		'DRIVER_CONSECUTIVE_TRIP_LIMIT',
		'1',
		'Maximum consecutive trips for a driver before a break is required.'
	),
	(
		'ASSISTANT_CONSECUTIVE_TRIP_LIMIT',
		'2',
		'Maximum consecutive routes for an assistant before a break is required.'
	) ON CONFLICT (config_key) DO NOTHING;

-- ======================
-- Sample data: Drivers
-- ======================
-- Create sample users who are also workers/drivers
INSERT INTO "User" (id, username, name, password, role)
VALUES
  ('user-driver-1', 'driver.john', 'John Doe', 'password-hash-1', 'Worker'),
  ('user-driver-2', 'driver.sara', 'Sara Miles', 'password-hash-2', 'Worker')
ON CONFLICT (id) DO NOTHING;

-- Create corresponding Worker rows
INSERT INTO Worker (id, type, hourly_pay, status, weekly_hours)
VALUES
  ('user-driver-1', 'Driver', 18.50, 'Free', 10),
  ('user-driver-2', 'Driver', 20.00, 'Free', 5)
ON CONFLICT (id) DO NOTHING;

-- Promote to Driver speciality table
INSERT INTO Driver (id, consecutive_deliveries)
VALUES
  ('user-driver-1', 0),
  ('user-driver-2', 0)
ON CONFLICT (id) DO NOTHING;

-- Sample trucks
INSERT INTO Truck (id, vehicle_no)
VALUES
  ('truck-1', 'TN-01-TR-1001'),
  ('truck-2', 'TN-01-TR-1002')
ON CONFLICT (id) DO NOTHING;

-- Sample cities and route used by truck trips
INSERT INTO City (id, name)
VALUES
  ('city-1', 'Springfield'),
  ('city-2', 'Shelbyville')
ON CONFLICT (id) DO NOTHING;

INSERT INTO Route (id, name, max_delivery_time_hours, area)
VALUES
  ('route-1', 'Springfield - Shelbyville', 5, 'Central'),
  ('route-2', 'Shelbyville - Springfield', 5, 'Central')
ON CONFLICT (id) DO NOTHING;

-- Sample train trip & shipment (so truck_trip can reference a shipment if needed)
INSERT INTO Train (id, name)
VALUES ('train-1', 'InterCity-1') ON CONFLICT (id) DO NOTHING;

INSERT INTO Train_Trip (id, train_id, from_city_id, to_city_id, scheduled_departure, scheduled_arrival, capacity_units, allocated_units)
VALUES (
  'traintrip-1', 'train-1', 'city-1', 'city-2', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '6 hours', 1000, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO Shipment (id, order_id, train_trip_id, allocated_space_units, shipped_quantity, status)
VALUES ('shipment-1', NULL, 'traintrip-1', 100, 10, 'Pending') ON CONFLICT (id) DO NOTHING;

-- Sample truck trip assigning driver to a truck and route
INSERT INTO Truck_Trip (id, truck_id, route_id, driver_id, assistant_id, shipment_id, scheduled_start, scheduled_end, status)
VALUES (
  'trucktrip-1', 'truck-1', 'route-1', 'user-driver-1', NULL, 'shipment-1', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '4 hours', 'Scheduled'
) ON CONFLICT (id) DO NOTHING;

-- Worker record for the driver (hours worked for the trip)
INSERT INTO Worker_Record (id, worker_id, "date", hours_worked, assignment_type, truck_trip_id)
VALUES (
  'wrec-1', 'user-driver-1', (NOW() + INTERVAL '2 days')::date, 4, 'Truck_Trip', 'trucktrip-1'
) ON CONFLICT (id) DO NOTHING;

-- Another driver and trip sample
INSERT INTO "User" (id, username, name, password, role)
VALUES ('user-driver-3', 'driver.lee', 'Lee Chan', 'password-hash-3', 'Worker') ON CONFLICT (id) DO NOTHING;
INSERT INTO Worker (id, type, hourly_pay, status, weekly_hours)
VALUES ('user-driver-3', 'Driver', 19.00, 'Free', 0) ON CONFLICT (id) DO NOTHING;
INSERT INTO Driver (id, consecutive_deliveries)
VALUES ('user-driver-3', 0) ON CONFLICT (id) DO NOTHING;
INSERT INTO Truck_Trip (id, truck_id, route_id, driver_id, assistant_id, shipment_id, scheduled_start, scheduled_end, status)
VALUES (
  'trucktrip-2', 'truck-2', 'route-2', 'user-driver-3', NULL, NULL, NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '3 hours', 'Scheduled'
) ON CONFLICT (id) DO NOTHING;