-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'refresh_v_truck_usage_monthly',
  '0 0 1 * *',   -- Runs every month's 1st day at midnight
  $$ REFRESH MATERIALIZED VIEW CONCURRENTLY v_truck_usage_monthly; $$
);
