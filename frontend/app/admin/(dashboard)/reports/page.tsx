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
					downloadUrl={`${process.env.NEXT_PUBLIC_API_URL_CLIENT}/admin/report/sales`}
				/>
				<ReportGeneratorControl
					title="Most Ordered Products"
					description="Generate a report of most ordered products per quarter."
					downloadUrl={`${process.env.NEXT_PUBLIC_API_URL_CLIENT}/admin/report/most-ordered-products`}
				/>
				<ReportGeneratorControl
					title="City-wise Sales Breakdown"
					description="Generate a report for customer data."
					downloadUrl={`${process.env.NEXT_PUBLIC_API_URL_CLIENT}/admin/report/sales/city-wise`}
				/>
				<ReportGeneratorControl
					title="Route-wise Sales Breakdown"
					description="Generate a report for product data."
					downloadUrl={`${process.env.NEXT_PUBLIC_API_URL_CLIENT}/admin/report/sales/route-wise`}
				/>
				<ReportGeneratorControl
					title="Driver & Assistant Working Hours Report"
					description="Generate a report for order data."
					downloadUrl={`${process.env.NEXT_PUBLIC_API_URL_CLIENT}/admin/report/working-hours`}
				/>
				<ReportGeneratorControl
					title="Truck Usage Analysis"
					description="Generate a report for a month's truck usage."
					downloadUrl={`${process.env.NEXT_PUBLIC_API_URL_CLIENT}/admin/report/truck-usage`}
				/>
				<ReportGeneratorControl
					title="Customer Order History"
					description="Retrieve past orders of a customer."
					downloadUrl={`${process.env.NEXT_PUBLIC_API_URL_CLIENT}/admin/report/customer-order-history`}
				/>
			</div>
		</section>
	);
}
