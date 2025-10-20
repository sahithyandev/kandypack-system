import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/login-form";
import { getAuthValidate } from "@/lib/api-client";

export default async function LoginPage() {
	const cookieStore = await cookies();
	const loggedInCookie = cookieStore.get("logged_in");

	if (!loggedInCookie) {
		return <LoginForm />;
	}

	const response = await getAuthValidate({
		headers: {
			Authorization: `Bearer ${loggedInCookie.value}`,
		},
	});
	if (!("valid" in response)) {
		return <div>Failed to validate login status. Please try again later.</div>;
	}
	if (response.valid) {
		const user = response.user;
		if (!user) {
			redirect("/login");
			return;
		}

		if (user.role === "Worker" && user.workerType === "Dispatcher") {
			redirect("/dispatcher/overview");
		} else if (user.role === "Worker" && user.workerType === "Store_Manager") {
			redirect("/store-manager/incoming");
		} else if (user && user.role === "Worker" && user.workerType === "Admin") {
			redirect("/admin");
		} else if (user.role === "Customer") {
			redirect("/customer");
		} else if (user.role === "Worker" && user.workerType === "Driver") {
			redirect("/driver");
		} else {
			redirect("/login");
		}
		return;
	}

	return <LoginForm />;
}
