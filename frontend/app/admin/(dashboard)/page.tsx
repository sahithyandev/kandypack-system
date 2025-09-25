import { NAME } from "@/lib/consts";

export const metadata = {
	title: `Dashboard | ${NAME}`,
};

export default function AdminDashboard() {
	return (
		<section className="px-1">
			<h2 className="text-2xl font-bold mt-3">Dashboard</h2>
		</section>
	);
}
