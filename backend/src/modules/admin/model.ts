import { t } from "elysia";

export namespace AdminModel {
	export const dashboardStats = t.Object({
		total_orders: t.String(),
		total_workers: t.String(),
		total_trucks: t.String(),
		total_shipments: t.String(),
		total_sales_value: t.String(),
		total_trips: t.String(),
	});
	export type DashboardStats = typeof dashboardStats.static;

	export const salesReportItem = t.Object({
		year: t.Number(),
		quarter: t.Number(),
		total_orders: t.Number(),
		total_quantity: t.Number(),
		total_sales_value: t.Number(),
		avg_order_value: t.Number(),
	});
	export type SalesReportItem = typeof salesReportItem.static;

	export const mostOrderedProductItem = t.Object({
		year: t.Number(),
		quarter: t.Number(),
		product_id: t.String(),
		product_name: t.String(),
		total_quantity: t.Number(),
		total_revenue: t.Number(),
	});
	export type MostOrderedProductItem = typeof mostOrderedProductItem.static;

	export const cityWiseSalesReportItem = t.Object({
		year: t.Number(),
		quarter: t.Number(),
		city_name: t.String(),
		total_orders: t.Number(),
		total_quantity: t.Number(),
		total_sales_value: t.Number(),
		avg_order_value: t.Number(),
	});
	export type CityWiseSalesReportItem = typeof cityWiseSalesReportItem.static;

	export const routeWiseSalesReportItem = t.Object({
		year: t.Number(),
		quarter: t.Number(),
		route_id: t.String(),
		route_name: t.String(),
		total_orders: t.Number(),
		total_quantity: t.Number(),
		total_sales_value: t.Number(),
		avg_order_value: t.Number(),
	});
	export type RouteWiseSalesReportItem = typeof routeWiseSalesReportItem.static;

	export const workerHoursReportItem = t.Object({
		year: t.Number(),
		month: t.Number(),
		worker_id: t.String(),
		worker_name: t.String(),
		role: t.String(),
		total_hours_worked: t.Number(),
		total_trips: t.Number(),
		avg_hours_per_record: t.Number(),
	});
	export type WorkerHoursReportItem = typeof workerHoursReportItem.static;

	export const truckUsageReportItem = t.Object({
		truck_id: t.String(),
		vehicle_no: t.String(),
		year: t.Number(),
		month: t.Number(),
		total_trips: t.Number(),
		total_hours_used: t.Number(),
		avg_hours_per_trip: t.Number(),
		unique_routes: t.Number(),
		unique_drivers: t.Number(),
		total_shipments: t.Number(),
	});
	export type TruckUsageReportItem = typeof truckUsageReportItem.static;

	export const customerOrderHistoryItem = t.Object({
		customer_id: t.String(),
		customer_name: t.String(),
		phone_no: t.String(),
		order_id: t.String(),
		placed_on: t.String(),
		required_delivery_date: t.String(),
		order_status: t.String(),
		total_value: t.Number(),
		route_name: t.String(),
		product_name: t.String(),
		quantity: t.Number(),
		unit_price: t.Number(),
		subtotal: t.Number(),
		truck_id: t.String(),
		truck_vehicle_no: t.String(),
		truck_start: t.String(),
		truck_end: t.String(),
	});
	export type CustomerOrderHistoryItem = typeof customerOrderHistoryItem.static;

	export const reportResponse = t.String();
	export type ReportResponse = typeof reportResponse.static;
}
