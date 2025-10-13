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