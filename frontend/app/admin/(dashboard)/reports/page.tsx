import ReportGeneratorControl from "@/components/admin/report-generator-control";
import { NAME } from "@/lib/consts";

export const metadata = {
	title: `Reports | ${NAME}`,
};

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
				/>
				<ReportGeneratorControl
					title="Most Purchased Products"
					description="Generate a report of most purchased products per quarter."
					downloadUrl={`${process.env.NEXT_PUBLIC_API_URL_CLIENT}/admin/report/most-purchased-products`}
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
					downloadUrl={`${process.env.NEXT_PUBLIC_API_URL_CLIENT}/admin/report/truck-usage`}
				/>
				<ReportGeneratorControl
					title="Customer Order History"
					description="Retrieve past orders of a customer."
				/>
			</div>
		</section>
	);
}
