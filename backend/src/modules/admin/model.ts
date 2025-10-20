import { t } from "elysia";

export namespace AdminModel {
	export const mostOrderedProductItem = t.Object({
		year: t.String(),
		quarter: t.String(),
		product_id: t.String(),
		product_name: t.String(),
		total_quantity: t.String(),
		total_revenue: t.String(),
	});
	export type MostOrderedProductItem = typeof mostOrderedProductItem.static;

	export const truckUsageReportItem = t.Object({
		truckId: t.String(),
		vehicleNo: t.String(),
		year: t.Number(),
		month: t.Number(),
		totalTrips: t.Number(),
		totalDistanceKm: t.Number(),
		totalHours: t.Number(),
	});
	export type TruckUsageReportItem = typeof truckUsageReportItem.static;

	export const reportResponse = t.String();
	export type ReportResponse = typeof reportResponse.static;
}
