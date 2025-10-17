import { cookies } from "next/headers";
import RegisterForm from "@/components/auth/register-form";
import { getAuthValidate } from "@/lib/api-client";

export default async function RegisterPage() {
	const cookieStore = await cookies();
	const loggedInCookie = cookieStore.get("logged_in");

	if (!loggedInCookie) {
		return <RegisterForm />;
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
		return <div>You are already logged in.</div>;
	}

	return <RegisterForm />;
}
