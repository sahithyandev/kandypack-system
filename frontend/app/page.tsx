"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthService } from "@/lib/auth";

export default function HomePage() {
	const router = useRouter();

	useEffect(() => {
		const user = AuthService.getCurrentUser();
		if (user) {
			router.push("/dashboard");
		} else {
			router.push("/login");
		}
	}, [router]);

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="text-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
				<p className="mt-2 text-sm text-gray-600">Redirecting...</p>
			</div>
		</div>
	);
}
