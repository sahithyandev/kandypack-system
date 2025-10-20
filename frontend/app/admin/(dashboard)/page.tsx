import StatsCard from "@/components/stats-card";
import { getAdminDashboardStats } from "@/lib/api-client";
import { NAME } from "@/lib/consts";

export const metadata = {
	title: `Dashboard | ${NAME}`,
};

export default async function AdminDashboard() {
	const stats = await getAdminDashboardStats();
	if (!stats || !("total_sales_value" in stats)) {
		return (
			<section className="px-1">
				<h2 className="text-2xl font-bold mt-3 mb-4">Dasboard</h2>
				<p>Failed to load dashboard stats.</p>
			</section>
		);
	}

	return (
		<>
			<section className="px-1">
				<h1 className="text-2xl font-bold mt-3 mb-4">Dasboard</h1>
			</section>

			<section className="grid grid-cols-5 gap-3">
				<StatsCard
					variant="big"
					title="Total Sales"
					value={`LKR ${Number.parseFloat(stats.total_sales_value).toLocaleString()}`}
					className="col-span-full"
				/>
				<StatsCard
					title="Total Orders"
					value={stats.total_orders}
					link="/admin/customers"
				/>
				<StatsCard title="Total Workers" value={stats.total_workers} />
				<StatsCard
					title="Total Shipments"
					value={stats.total_shipments}
					link="/admin/trucks"
				/>
				<StatsCard
					title="Total Trucks"
					value={stats.total_trucks}
					link="/admin/trucks"
				/>
				<StatsCard
					title="Pending Orders"
					value={142}
					link="/admin/pending-orders"
				/>
			</section>
		</>
	);
}
