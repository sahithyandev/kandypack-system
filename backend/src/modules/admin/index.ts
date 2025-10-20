import Elysia from "elysia";
import authMiddleware from "../auth/middleware";
import { AdminService } from "./service";
import { convertRecordsToCsv } from "../../utils/common";
import { AdminModel } from "./model";

export const admin = new Elysia({ prefix: "/admin" })
	.use(authMiddleware)
	.get(
		"/report/sales",
		async ({ set }) => {
			const result = await AdminService.generateSalesReport();
			set.headers["Content-Disposition"] =
				`attachment; filename="KP - Sales Report - ${new Date().toLocaleString()}.csv"`;
			set.headers["Content-Type"] = "text/csv";
			return convertRecordsToCsv(result);
		},
		{
			detail: {
				tags: ["Admin - Reports"],
				summary: "Get sales report",
				description: "Retrieves a report of sales aggregated quarterly.",
			},
		},
	)
	.get(
		"/report/most-ordered-products",
		async ({ set }) => {
			const result = await AdminService.generateMostOrderedProductsReport();
			set.headers["Content-Disposition"] =
				`attachment; filename="KP - Most Ordered Products Report - ${new Date().toLocaleString()}.csv"`;
			set.headers["Content-Type"] = "text/csv";
			return convertRecordsToCsv(result);
		},
		{
			detail: {
				tags: ["Admin - Reports"],
				summary: "Get most ordered products report",
				description:
					"Retrieves a report of most ordered products aggregated quarterly.",
			},
		},
	)
	.get(
		"/report/sales/city-wise",
		async ({ set }) => {
			const report = await AdminService.generateCityWiseSalesReport();
			set.headers["Content-Disposition"] =
				`attachment; filename="KP - City Wise Sales Report - ${new Date().toLocaleString()}.csv"`;
			set.headers["Content-Type"] = "text/csv";
			return convertRecordsToCsv(report);
		},
		{
			detail: {
				tags: ["Admin - Reports"],
				summary: "Download city wise sales report",
				description:
					"Retrieves a report of sales aggregated by city quarterly.",
			},
		},
	)
	.get(
		"/report/sales/route-wise",
		async ({ set }) => {
			const report = await AdminService.generateRouteWiseSalesReport();
			set.headers["Content-Disposition"] =
				`attachment; filename="KP - Route Wise Sales Report - ${new Date().toLocaleString()}.csv"`;
			set.headers["Content-Type"] = "text/csv";
			return convertRecordsToCsv(report);
		},
		{
			detail: {
				tags: ["Admin - Reports"],
				summary: "Download route wise sales report",
				description:
					"Retrieves a report of sales aggregated by route quarterly.",
			},
		},
	)
	.get(
		"/report/working-hours",
		async ({ set }) => {
			const report = await AdminService.generateWorkerHoursReport();
			set.headers["Content-Disposition"] =
				`attachment; filename="KP - Worker Hours Report - ${new Date().toLocaleString()}.csv"`;
			set.headers["Content-Type"] = "text/csv";
			return convertRecordsToCsv(report);
		},
		{
			detail: {
				tags: ["Admin - Reports"],
				summary: "Download worker hours report",
				description: "Retrieves a report of worker hours aggregated monthly.",
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
	)
	.get(
		"/report/customer-order-history",
		async ({ set }) => {
			const report = await AdminService.generateCustomerOrderHistoryReport();
			set.headers["Content-Disposition"] =
				`attachment; filename="KP - Customer Order History Report - ${new Date().toLocaleString()}.csv"`;
			set.headers["Content-Type"] = "text/csv";
			return convertRecordsToCsv(report);
		},
		{
			detail: {
				tags: ["Admin - Reports"],
				summary: "Get customer order history report",
				description: "Retrieves a report of customer order history.",
			},
		},
	);
