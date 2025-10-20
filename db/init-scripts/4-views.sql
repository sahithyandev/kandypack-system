-- =============================================================================
-- SECTION 4: VIEWS FOR REPORTING
-- =============================================================================

CREATE OR REPLACE VIEW v_orderdetails AS
SELECT 
    o.id AS order_id,
    o.status AS order_status,
    o.placed_on,
    o.required_delivery_date,
    c.id AS customer_id,
    u.name AS customer_name,
    oi.quantity,
    p.name AS product_name,
    p.unit_price,
    (oi.quantity * p.unit_price) AS item_total_value,
    s.name AS store_name,
    s_city.name AS store_city
FROM "Order" o
    JOIN Customer c ON o.customer_id = c.id
    JOIN "User" u ON c.id = u.id
    JOIN Order_Item oi ON o.id = oi.order_id
    JOIN Product p ON oi.product_id = p.id
    LEFT JOIN Store s ON o.store_id = s.id
    LEFT JOIN City s_city ON s.city_id = s_city.id;


CREATE OR REPLACE VIEW v_workerassignments AS
SELECT 
    w.id AS worker_id,
    u.name AS worker_name,
    w.type AS worker_type,
    w.status AS worker_status,
    tt.id AS truck_trip_id,
    tt.status AS trip_status,
    tt.distance_km,
    tt.scheduled_start,
    tt.scheduled_end
FROM Worker w
    JOIN "User" u ON w.id = u.id
    LEFT JOIN Truck_Trip tt ON (
        w.id = tt.driver_id OR w.id = tt.assistant_id
    )
    AND tt.status IN ('Scheduled', 'In_Progress');


CREATE OR REPLACE VIEW v_salesbylocation AS
SELECT 
    r.name AS route_name,
    c.name AS city_name,
    EXTRACT(YEAR FROM o.placed_on) AS sales_year,
    EXTRACT(QUARTER FROM o.placed_on) AS sales_quarter,
    COUNT(o.id) AS number_of_orders,
    SUM(o.total_value) AS total_sales_value
FROM "Order" o
    JOIN Route r ON o.route_id = r.id
    JOIN Route_Stop rs ON r.id = rs.route_id
    JOIN City c ON rs.city_id = c.id
WHERE o.status = 'Delivered'
GROUP BY 
    r.name,
    c.name,
    sales_year,
    sales_quarter;


CREATE OR REPLACE VIEW v_productpopularity AS
SELECT 
    p.name AS product_name,
    SUM(oi.quantity) AS total_quantity_ordered,
    COUNT(DISTINCT o.id) AS number_of_orders
FROM Order_Item oi
    JOIN Product p ON oi.product_id = p.id
    JOIN "Order" o ON oi.order_id = o.id
GROUP BY p.name
ORDER BY total_quantity_ordered DESC;


CREATE OR REPLACE VIEW v_workerhoursreport AS
SELECT 
    w.id AS worker_id,
    u.name AS worker_name,
    w.type,
    wr.date,
    wr.hours_worked,
    wr.truck_trip_id
FROM Worker_Record wr
    JOIN Worker w ON wr.worker_id = w.id
    JOIN "User" u ON w.id = u.id;


CREATE OR REPLACE VIEW v_truckutilization AS
SELECT 
    t.vehicle_no,
    EXTRACT(YEAR FROM tt.actual_start) AS trip_year,
    EXTRACT(MONTH FROM tt.actual_start) AS trip_month,
    COUNT(tt.id) AS number_of_trips,
    SUM(EXTRACT(EPOCH FROM (tt.actual_end - tt.actual_start)) / 3600) AS total_hours_in_use,
    SUM(COALESCE(tt.distance_km, 0)) AS total_distance_km
FROM Truck_Trip tt
    JOIN Truck t ON tt.truck_id = t.id
WHERE tt.status = 'Completed'
GROUP BY 
    t.vehicle_no,
    trip_year,
    trip_month;