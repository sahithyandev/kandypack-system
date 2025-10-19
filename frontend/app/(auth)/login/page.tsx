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
		redirect("/");
		return;
	}

	return <LoginForm />;
}
