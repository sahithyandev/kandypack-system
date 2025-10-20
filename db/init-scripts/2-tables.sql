-- =============================================================================
-- SECTION 2: TABLE CREATION & CONSTRAINTS
-- =============================================================================
-- User Table

CREATE TABLE IF NOT EXISTS "User" (
    id varchar(50) PRIMARY KEY,
    username varchar(50) UNIQUE NOT NULL,
    name varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    role user_role NOT NULL
);

-- Customer Table

CREATE TABLE IF NOT EXISTS Customer (
    id varchar(50) PRIMARY KEY REFERENCES "User"(id) ON DELETE CASCADE,
    type customer_type NOT NULL,
    street_name varchar(100),
    city varchar(50),
    postal_code varchar(10),
    phone_no varchar(15) NOT NULL
);

-- Worker Table

CREATE TABLE IF NOT EXISTS Worker (
    id varchar(50) PRIMARY KEY REFERENCES "User"(id) ON DELETE CASCADE,
    type worker_type NOT NULL,
    hourly_pay numeric(10, 2) NOT NULL CHECK (hourly_pay >= 0),
    status worker_status NOT NULL DEFAULT 'Free',
    weekly_hours numeric(5, 2) DEFAULT 0 CHECK (weekly_hours >= 0)
);

-- Specialised Worker Roles

CREATE TABLE IF NOT EXISTS Driver (
    id varchar(50) PRIMARY KEY REFERENCES Worker(id) ON DELETE CASCADE,
    consecutive_deliveries INT DEFAULT 0 CHECK (consecutive_deliveries >= 0),
    total_trips INT DEFAULT 0 CHECK (total_trips >= 0),
    daily_driving_distance numeric(10, 2) DEFAULT 0 CHECK (daily_driving_distance >= 0),
    daily_driving_time numeric(10, 2) DEFAULT 0 CHECK (daily_driving_time >= 0),
    cumulative_distance numeric(12, 2) DEFAULT 0 CHECK (cumulative_distance >= 0),
    cumulative_time numeric(12, 2) DEFAULT 0 CHECK (cumulative_time >= 0)
);


CREATE TABLE IF NOT EXISTS Assistant (
    id varchar(50) PRIMARY KEY REFERENCES Worker(id) ON DELETE CASCADE,
    consecutive_routes INT DEFAULT 0 CHECK (consecutive_routes >= 0)
);


CREATE TABLE IF NOT EXISTS Store_Manager (
    id varchar(50) PRIMARY KEY REFERENCES Worker(id) ON DELETE CASCADE
);

-- Location and Route Tables

CREATE TABLE IF NOT EXISTS City (
    id varchar(50) PRIMARY KEY,
    name varchar(50) UNIQUE NOT NULL
);


CREATE TABLE IF NOT EXISTS Route (
    id varchar(50) PRIMARY KEY,
    name varchar(100) NOT NULL,
    max_delivery_time_hours numeric(5, 2) NOT NULL CHECK (max_delivery_time_hours > 0),
    area varchar(100)
);


CREATE TABLE IF NOT EXISTS Route_Stop (
    id varchar(50) PRIMARY KEY,
    route_id varchar(50) NOT NULL REFERENCES Route(id) ON DELETE CASCADE,
    city_id varchar(50) NOT NULL REFERENCES City(id) ON DELETE RESTRICT,
    stop_order INT NOT NULL CHECK (stop_order > 0),
    UNIQUE(route_id, stop_order)
);

-- Vehicle Tables
CREATE TABLE IF NOT EXISTS Truck (
	id VARCHAR(50) PRIMARY KEY,
	vehicle_no VARCHAR(20) UNIQUE NOT NULL,
	status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('busy','available','maintenance'))
);

-- Truck status: busy, available, or maintenance
CREATE TABLE IF NOT EXISTS Train (
	id VARCHAR(50) PRIMARY KEY,
	name VARCHAR(50) NOT NULL
);
-- Store and Product Tables

CREATE TABLE IF NOT EXISTS Store (
    id varchar(50) PRIMARY KEY,
    name varchar(100) NOT NULL,
    city_id varchar(50) NOT NULL REFERENCES City(id) ON DELETE RESTRICT,
    managed_by varchar(50) UNIQUE REFERENCES Store_Manager(id) ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS Product (
    id varchar(50) PRIMARY KEY,
    name varchar(100) NOT NULL,
    unit_price numeric(10, 2) NOT NULL CHECK (unit_price > 0),
    space_consumption_rate numeric(10, 2) NOT NULL CHECK (space_consumption_rate > 0)
);

CREATE TABLE IF NOT EXISTS "Order" (
	id VARCHAR(50) PRIMARY KEY,
    store_id VARCHAR(50) REFERENCES Store(id) ON DELETE RESTRICT,
    customer_id VARCHAR(50) NOT NULL REFERENCES Customer(id) ON DELETE CASCADE,
	delivery_address VARCHAR(255) NOT NULL,
    route_id VARCHAR(50) REFERENCES Route(id) ON DELETE SET NULL,
	placed_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	required_delivery_date DATE NOT NULL,
	status order_status NOT NULL DEFAULT 'Pending',
	total_value NUMERIC(12, 2) DEFAULT 0,
	total_space_units NUMERIC(12, 2) DEFAULT 0,
	CONSTRAINT chk_delivery_date CHECK (
		required_delivery_date >= (placed_on::date + INTERVAL '7 day')
	)
);
CREATE TABLE IF NOT EXISTS Order_Item (
	id VARCHAR(50) PRIMARY KEY,
	order_id VARCHAR(50) NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
    product_id VARCHAR(50) NOT NULL REFERENCES Product(id) ON DELETE RESTRICT,
	quantity INT NOT NULL CHECK (quantity > 0),
	UNIQUE(order_id, product_id)
);
-- Logistics and Trip Tables

CREATE TABLE IF NOT EXISTS Train_Trip (
    id varchar(50) PRIMARY KEY,
    train_id varchar(50) NOT NULL REFERENCES Train(id),
    from_city_id varchar(50) NOT NULL REFERENCES City(id),
    to_city_id varchar(50) NOT NULL REFERENCES City(id),
    scheduled_departure TIMESTAMP NOT NULL,
    scheduled_arrival TIMESTAMP NOT NULL,
    capacity_units numeric(12, 2) NOT NULL CHECK (capacity_units > 0),
    allocated_units numeric(12, 2) DEFAULT 0,
    CONSTRAINT chk_arrival_after_departure CHECK (scheduled_arrival > scheduled_departure)
);


CREATE TABLE IF NOT EXISTS Shipment (
    id varchar(50) PRIMARY KEY,
    order_id varchar(50) NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
    train_trip_id varchar(50) NOT NULL REFERENCES Train_Trip(id) ON DELETE RESTRICT,
    allocated_space_units numeric(10, 2) NOT NULL,
    shipped_quantity INT NOT NULL,
    status shipment_status NOT NULL DEFAULT 'Pending',
    shipped_at TIMESTAMP
);


CREATE TABLE IF NOT EXISTS Truck_Trip (
    id varchar(50) PRIMARY KEY,
    truck_id varchar(50) NOT NULL REFERENCES Truck(id),
    route_id varchar(50) NOT NULL REFERENCES Route(id),
    driver_id varchar(50) NOT NULL REFERENCES Driver(id),
    assistant_id varchar(50) REFERENCES Assistant(id),
    shipment_id varchar(50) UNIQUE REFERENCES Shipment(id),
    scheduled_start TIMESTAMP NOT NULL,
    scheduled_end TIMESTAMP,
    -- distance for the trip in kilometers (optional at creation)
    distance_km numeric(10, 2),
    actual_start TIMESTAMP,
    actual_end TIMESTAMP,
    status trip_status NOT NULL DEFAULT 'Scheduled',
    CONSTRAINT chk_end_after_start CHECK (scheduled_end IS NULL OR scheduled_end > scheduled_start)
);


CREATE TABLE IF NOT EXISTS Worker_Record (
    id varchar(50) PRIMARY KEY,
    worker_id varchar(50) NOT NULL REFERENCES Worker(id),
    "date" DATE NOT NULL,
    hours_worked numeric(4, 2) CHECK (hours_worked > 0),
    assignment_type varchar(20) DEFAULT 'Truck_Trip',
    truck_trip_id varchar(50) REFERENCES Truck_Trip(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS System_Configuration (
    config_key varchar(50) PRIMARY KEY,
    config_value varchar(255) NOT NULL,
    description TEXT
);