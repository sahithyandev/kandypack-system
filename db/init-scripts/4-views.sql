-- =============================================================================
-- SECTION 4: VIEWS FOR REPORTING
-- =============================================================================

CREATE MATERIALIZED VIEW v_sales_report_quarterly AS
SELECT
    EXTRACT(YEAR FROM o.placed_on) AS year,
    EXTRACT(QUARTER FROM o.placed_on) AS quarter,
    COUNT(o.id) AS total_orders,
    SUM(oi.quantity) AS total_quantity,
    SUM(o.total_value) AS total_sales_value,
    ROUND(AVG(o.total_value), 2) AS avg_order_value
FROM "Order" o
JOIN Order_Item oi ON o.id = oi.order_id
GROUP BY year, quarter
ORDER BY year, quarter;

CREATE UNIQUE INDEX idx_v_sales_report_quarterly_key
ON v_sales_report_quarterly (year, quarter);

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

CREATE MATERIALIZED VIEW v_order_summary_by_city_quarterly AS
SELECT
    EXTRACT(YEAR FROM o.placed_on) AS year,
    EXTRACT(QUARTER FROM o.placed_on) AS quarter,
    c.city AS city_name,
    COUNT(o.id) AS total_orders,
    SUM(oi.quantity) AS total_quantity,
    SUM(o.total_value) AS total_sales_value,
    ROUND(AVG(o.total_value), 2) AS avg_order_value
FROM "Order" o
JOIN customer c ON o.customer_id = c.id
JOIN Order_Item oi ON o.id = oi.order_id
GROUP BY year, quarter, c.city
ORDER BY year, quarter, c.city;

CREATE UNIQUE INDEX idx_v_order_summary_by_city_quarterly_key
ON v_order_summary_by_city_quarterly (year, quarter, city_name);

CREATE MATERIALIZED VIEW v_order_summary_by_route_quarterly AS
SELECT
    EXTRACT(YEAR FROM o.placed_on) AS year,
    EXTRACT(QUARTER FROM o.placed_on) AS quarter,
    r.id AS route_id,
    r.name AS route_name,
    COUNT(o.id) AS total_orders,
    SUM(oi.quantity) AS total_quantity,
    SUM(o.total_value) AS total_sales_value,
    ROUND(AVG(o.total_value), 2) AS avg_order_value
FROM "Order" o
JOIN route r ON o.route_id = r.id
JOIN Order_Item oi ON o.id = oi.order_id
GROUP BY year, quarter, r.id, r.name
ORDER BY year, quarter, route_name;

CREATE UNIQUE INDEX idx_v_order_summary_by_route_quarterly_key
ON v_order_summary_by_route_quarterly (year, quarter, route_name);

CREATE MATERIALIZED VIEW v_worker_hours_summary_monthly AS
SELECT
    EXTRACT(YEAR FROM wr."date") AS year,
    EXTRACT(MONTH FROM wr."date") AS month,
    w.id AS worker_id,
    u.name AS worker_name,
    w.type AS role,
    SUM(wr.hours_worked) AS total_hours_worked,
    COUNT(DISTINCT wr.truck_trip_id) AS total_trips,
    ROUND(AVG(wr.hours_worked), 2) AS avg_hours_per_record
FROM worker_record wr
JOIN worker w ON wr.worker_id = w.id
JOIN "User" as u ON u.id = w.id
WHERE w.type IN ('Driver', 'Assistant')
GROUP BY year, month, w.id, u.name, w.type
ORDER BY year, month, w.type, w.id;

CREATE UNIQUE INDEX idx_v_worker_hours_summary_monthly_key
ON v_worker_hours_summary_monthly (year, month, worker_id);

CREATE MATERIALIZED VIEW v_truck_usage_monthly AS
SELECT
    tt.truck_id,
    t.vehicle_no,
    EXTRACT(YEAR FROM tt.actual_start) AS year,
    EXTRACT(MONTH FROM tt.actual_start) AS month,
    COUNT(tt.id) AS total_trips,
    ROUND (
        SUM(EXTRACT(EPOCH FROM (tt.actual_end - tt.actual_start)) / 3600),
        3
    ) AS total_hours_used,
    ROUND(
        AVG(EXTRACT(EPOCH FROM (tt.actual_end - tt.actual_start)) / 3600),
        3
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

CREATE MATERIALIZED VIEW v_customer_order_history AS
SELECT
    c.id AS customer_id,
    u.name AS customer_name,
    c.phone_no,
    o.id AS order_id,
    o.placed_on,
    o.required_delivery_date,
    o.status AS order_status,
    o.total_value,
    r.name AS route_name,
    p.id AS product_id,
    p.name AS product_name,
    oi.quantity,
    p.unit_price,
    (oi.quantity * p.unit_price) AS subtotal,
    tt.truck_id,
    t.vehicle_no AS truck_vehicle_no,
    tt.actual_start AS truck_start,
    tt.actual_end AS truck_end
FROM "Order" o
JOIN customer c ON o.customer_id = c.id
JOIN "User" u ON c.id = u.id
JOIN Order_Item oi ON o.id = oi.order_id
JOIN product p ON oi.product_id = p.id
LEFT JOIN route r ON o.route_id = r.id
LEFT JOIN shipment s ON s.order_id = o.id
LEFT JOIN truck_trip tt ON s.id = tt.shipment_id
LEFT JOIN truck t ON tt.truck_id = t.id
ORDER BY u.name, o.placed_on, o.id, p.name;

CREATE UNIQUE INDEX idx_v_customer_order_history_key
ON v_customer_order_history (customer_id, order_id, truck_id, product_id);
