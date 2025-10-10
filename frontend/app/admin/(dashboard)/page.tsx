import StatsCard from "@/components/stats-card";
import { NAME } from "@/lib/consts";

export const metadata = {
	title: `Dashboard | ${NAME}`,
};

export default function AdminDashboard() {
	return (
		<>
			<section className="px-1">
				<h2 className="text-2xl font-bold mt-3 mb-4">Dasboard</h2>
			</section>

			<section className="grid grid-cols-3 gap-3">
				<StatsCard
					variant="big"
					title="Current Month's Revenue"
					value={"LKR 42,420"}
					className="col-span-3"
				/>
				<StatsCard
					title="Total Customers"
					value={1234}
					link="/admin/customers"
				/>
				<StatsCard title="Total Trucks" value={34} link="/admin/trucks" />
				<StatsCard
					title="Pending Orders"
					value={142}
					link="/admin/pending-orders"
				/>
			</section>
		</>
	);
}
