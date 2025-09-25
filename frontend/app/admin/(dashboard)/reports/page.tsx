import ReportGeneratorControl from "@/components/admin/report-generator-control";
import { NAME } from "@/lib/consts";

export const metadata = {
	title: `Reports | ${NAME}`,
};

const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
] as const;

export default function AdminReports() {
	return (
		<section className="px-1">
			<header className="mb-4">
				<h1 className="text-2xl font-bold mt-3">Reports</h1>
				<p>You can generate various reports from this section.</p>
			</header>
			<div className="space-y-4 w-full">
				<ReportGeneratorControl
					title="Quarterly Sales Report"
					description="Generate a report for sales data."
					options={[
						{
							name: "Quarter",
							type: "select",
							defaultValue: "Q1",
							values: ["Q1", "Q2", "Q3", "Q4"],
							required: true,
						},
					]}
				/>
				<ReportGeneratorControl
					title="Most Purchased Items (Quarterly)"
					description="Generate a report for inventory data."
				/>
				<ReportGeneratorControl
					title="City-wise Sales Breakdown"
					description="Generate a report for customer data."
				/>
				<ReportGeneratorControl
					title="Route-wise Sales Breakdown"
					description="Generate a report for product data."
				/>
				<ReportGeneratorControl
					title="Driver & Assistant Working Hours Report"
					description="Generate a report for order data."
				/>
				<ReportGeneratorControl
					title="Truck Usage Analysis"
					description="Generate a report for a month's truck usage."
					options={[
						{
							name: "Month",
							type: "select",
							defaultValue: "January",
							values: MONTHS,
							required: true,
						},
					]}
				/>
				<ReportGeneratorControl
					title="Customer Order History"
					description="Retrieve past orders of a customer."
				/>
			</div>
		</section>
	);
}
