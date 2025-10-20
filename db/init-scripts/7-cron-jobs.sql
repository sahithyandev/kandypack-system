-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'refresh_v_sales_report_quarterly',
  '0 0 1 * *',   -- Runs every month's 1st day at midnight
  $$ REFRESH MATERIALIZED VIEW CONCURRENTLY v_sales_report_quarterly; $$
);
SELECT cron.schedule(
  'refresh_v_most_ordered_products_quarterly',
  '0 0 1 * *',   -- Runs every month's 1st day at midnight
  $$ REFRESH MATERIALIZED VIEW CONCURRENTLY v_most_ordered_products_quarterly; $$
);
SELECT cron.schedule(
  'refresh_v_order_summary_by_city_quarterly',
  '0 0 1 * *',   -- Runs every month's 1st day at midnight
  $$ REFRESH MATERIALIZED VIEW CONCURRENTLY v_order_summary_by_city_quarterly; $$
);
SELECT cron.schedule(
  'refresh_v_order_summary_by_route_quarterly',
  '0 0 1 * *',   -- Runs every month's 1st day at midnight
  $$ REFRESH MATERIALIZED VIEW CONCURRENTLY v_order_summary_by_route_quarterly; $$
);
SELECT cron.schedule(
  'refresh_worker_hours_monthly',
  '0 0 1 * *',  -- 1st day of month at midnight
  $$ REFRESH MATERIALIZED VIEW CONCURRENTLY v_worker_hours_summary_monthly; $$
);
SELECT cron.schedule(
  'refresh_v_truck_usage_monthly',
  '0 0 1 * *',   -- Runs every month's 1st day at midnight
  $$ REFRESH MATERIALIZED VIEW CONCURRENTLY v_truck_usage_monthly; $$
);
SELECT cron.schedule(
  'refresh_v_customer_order_history',
  '0 0 * * *',   -- Runs every day at midnight
  $$ REFRESH MATERIALIZED VIEW CONCURRENTLY v_customer_order_history; $$
);
