import { client } from "../../utils/db";
import type { AdminModel } from "./model";

export abstract class AdminService {
	static async generateSalesReport(): Promise<
		Array<AdminModel.SalesReportItem>
	> {
		const result = await client.query(
			`SELECT * FROM v_sales_report_quarterly;`,
		);
		if (!result.rows) {
			return [];
		}
		return result.rows;
	}
	static async generateMostOrderedProductsReport(): Promise<
		Array<AdminModel.MostOrderedProductItem>
	> {
		const result = await client.query(
			`SELECT * FROM v_most_ordered_products_quarterly;`,
		);
		if (!result.rows) {
			return [];
		}
		return result.rows;
	}
	static async generateCityWiseSalesReport(): Promise<
		Array<AdminModel.CityWiseSalesReportItem>
	> {
		const result = await client.query(
			`SELECT * FROM v_order_summary_by_city_quarterly;`,
		);
		if (!result.rows) {
			return [];
		}
		return result.rows;
	}
	static async generateRouteWiseSalesReport(): Promise<
		Array<AdminModel.CityWiseSalesReportItem>
	> {
		const result = await client.query(
			`SELECT * FROM v_order_summary_by_route_quarterly;`,
		);
		if (!result.rows) {
			return [];
		}
		return result.rows;
	}
	static async generateWorkerHoursReport(): Promise<
		Array<AdminModel.WorkerHoursReportItem>
	> {
		const result = await client.query(
			`SELECT * FROM v_worker_hours_summary_monthly;`,
		);
		if (!result.rows) {
			return [];
		}
		return result.rows;
	}
	static async generateTruckUsageReport(): Promise<
		Array<AdminModel.TruckUsageReportItem>
	> {
		const result = await client.query(`SELECT * FROM v_truck_usage_monthly;`);
		if (!result.rows) {
			return [];
		}
		return result.rows;
	}
	static async generateCustomerOrderHistoryReport(): Promise<
		Array<AdminModel.CustomerOrderHistoryItem>
	> {
		const result = await client.query(
			`SELECT * FROM v_customer_order_history;`,
		);
		if (!result.rows) {
			return [];
		}
		return result.rows;
	}
}
