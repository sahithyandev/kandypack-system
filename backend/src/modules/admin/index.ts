import Elysia from "elysia";
import authMiddleware from "../auth/middleware";
import { AdminService } from "./service";
import { convertRecordsToCsv } from "../../utils/common";
import { AdminModel } from "./model";

export const admin = new Elysia({ prefix: "/admin" })
	.use(authMiddleware)
	.get(
		"/report/most-purchased-products",
		async ({ set }) => {
			const result = await AdminService.generateMostOrderedProductsReport();
			set.headers["Content-Disposition"] =
				`attachment; filename="KP - Most Purchased Products Report - ${new Date().toLocaleString()}.csv"`;
			set.headers["Content-Type"] = "text/csv";
			return convertRecordsToCsv(result);
		},
		{
			detail: {
				tags: ["Admin - Reports"],
				summary: "Get most purchased products report",
				description:
					"Retrieves a report of most purchased products aggregated quarterly.",
			},
		},
	)
	.get(
		"/report/truck-usage",
		async ({ set }) => {
			const report = await AdminService.generateTruckUsageReport();
			set.headers["Content-Disposition"] =
				`attachment; filename="KP - Truck Usage Report - ${new Date().toLocaleString()}.csv"`;
			set.headers["Content-Type"] = "text/csv";
			return convertRecordsToCsv(report);
		},
		{
			response: {
				200: AdminModel.reportResponse,
			},
			detail: {
				tags: ["Admin - Reports"],
				summary: "Download truck usage report",
				description: "Retrieves a report of truck usage aggregated quarterly.",
			},
		},
	);
