import type { Metadata } from "next";
import LoginForm from "@/components/auth/login-form";
import { NAME } from "@/lib/consts";

export const metadata: Metadata = {
	title: `Login | ${NAME}`,
};

export default function LoginPage() {
	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm md:max-w-md">
				<LoginForm />
			</div>
		</div>
	);
}
