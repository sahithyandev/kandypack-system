import Dashboard from "@/components/admin/dashboard";
import { NAME } from "@/lib/consts";

export const metadata = {
	title: `Dashboard | ${NAME}`,
};

export default async function AdminDashboard() {
	return <Dashboard />;
}
