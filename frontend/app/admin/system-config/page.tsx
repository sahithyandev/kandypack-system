import MaximumWorkingHours from "@/components/admin/maximum-working-hours";
import { NAME } from "@/lib/consts";

export const metadata = {
	title: `System Config | ${NAME}`,
};

export default function AdminSystemConfig() {
	return (
		<section className="px-1">
			<header className="mb-4">
				<h1 className="text-2xl font-bold mt-3">System Configuration</h1>
				<p>You can configure various system settings from this section.</p>
			</header>

			<MaximumWorkingHours />
		</section>
	);
}
