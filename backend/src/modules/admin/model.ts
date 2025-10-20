import { t } from "elysia";

export namespace AdminModel {
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
