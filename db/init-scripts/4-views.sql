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
    JOIN customer c ON o.customer_id = c.id
    JOIN "User" u ON c.id = u.id
    JOIN order_item oi ON o.id = oi.order_id
    JOIN product p ON oi.product_id = p.id
    LEFT JOIN store s ON o.store_id = s.id
    LEFT JOIN city s_city ON s.city_id = s_city.id;


CREATE OR REPLACE VIEW v_workerassignments AS
SELECT 
    w.id AS worker_id,
    u.name AS worker_name,
    w.type AS worker_type,
    w.status AS worker_status,
    tt.id AS truck_trip_id,
    tt.status AS trip_status,
    tt.scheduled_start,
    tt.scheduled_end
FROM worker w
    JOIN "User" u ON w.id = u.id
    LEFT JOIN truck_trip tt ON (
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
    JOIN route r ON o.route_id = r.id
    JOIN route_stop rs ON r.id = rs.route_id
    JOIN city c ON rs.city_id = c.id
WHERE o.status = 'Delivered'
GROUP BY 
    r.name,
    c.name,
    sales_year,
    sales_quarter;


CREATE MATERIALIZED VIEW v_most_ordered_products_quarterly AS
WITH ranked_items AS (
    SELECT
        EXTRACT(YEAR FROM o.placed_on) AS year,
        EXTRACT(QUARTER FROM o.placed_on) AS quarter,
        p.id AS product_id,
        p.name AS product_name,
        SUM(oi.quantity) AS total_quantity,
        SUM(oi.quantity * p.unit_price) AS total_revenue,
        -- assigns a rank based on ordered quantity within each year and quarter
        ROW_NUMBER() OVER (
            PARTITION BY EXTRACT(YEAR FROM o.placed_on),
                         EXTRACT(QUARTER FROM o.placed_on)
            ORDER BY SUM(oi.quantity) DESC
        ) AS rn
    FROM "Order" o
    JOIN Order_Item oi ON o.id = oi.order_id
    JOIN product p ON oi.product_id = p.id
    GROUP BY year, quarter, p.id, p.name
)
SELECT
    year,
    quarter,
    product_id,
    product_name,
    total_quantity,
    total_revenue
FROM ranked_items
WHERE rn <= 3
ORDER BY year, quarter, total_quantity DESC;

CREATE UNIQUE INDEX idx_v_most_ordered_products_quarterly_key
ON v_most_ordered_products_quarterly (year, quarter, product_id);

CREATE OR REPLACE VIEW v_workerhoursreport AS
SELECT 
    w.id AS worker_id,
    u.name AS worker_name,
    w.type,
    wr.date,
    wr.hours_worked,
    wr.truck_trip_id
FROM worker_record wr
    JOIN worker w ON wr.worker_id = w.id
    JOIN "User" u ON w.id = u.id;
    
CREATE MATERIALIZED VIEW v_truck_usage_monthly AS
SELECT
    tt.truck_id,
    t.vehicle_no,
    EXTRACT(YEAR FROM tt.actual_start) AS year,
    EXTRACT(MONTH FROM tt.actual_start) AS month,
    COUNT(tt.id) AS total_trips,
    SUM(EXTRACT(EPOCH FROM (tt.actual_end - tt.actual_start)) / 3600) AS total_hours_used,
    ROUND(
        AVG(EXTRACT(EPOCH FROM (tt.actual_end - tt.actual_start)) / 3600),
        2
    ) AS avg_hours_per_trip,
    COUNT(DISTINCT tt.route_id) AS unique_routes,
    COUNT(DISTINCT tt.driver_id) AS unique_drivers,
    COUNT(DISTINCT tt.shipment_id) AS total_shipments,
    SUM(o.total_value) AS total_revenue
FROM truck_trip tt
LEFT JOIN truck t ON tt.truck_id = t.id
LEFT JOIN shipment s ON tt.shipment_id = s.id
LEFT JOIN "Order" o ON s.order_id = o.id
WHERE tt.actual_start IS NOT NULL
  AND tt.actual_end IS NOT NULL
GROUP BY tt.truck_id, t.vehicle_no, year, month
ORDER BY tt.truck_id, t.vehicle_no, year, month;

CREATE UNIQUE INDEX idx_v_truck_usage_monthly_key
ON v_truck_usage_monthly (truck_id, year, month);
