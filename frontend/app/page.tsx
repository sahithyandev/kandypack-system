"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "@/lib/auth";

export default function HomePage() {
	const router = useRouter();

	useEffect(() => {
		const user = getUserFromToken();
		
		if (!user) {
			// No JWT token, redirect to login
			router.push("/login");
			return;
		}

		// Check role and workerType
		if (user.role === "Worker" && user.workerType === "Dispatcher") {
			router.push("/dispatcher/overview");
		} else if (user.role === "Worker" && user.workerType === "Store_Manager") {
			router.push("/store-manager/incoming");
		} else {
			// For other roles, redirect to a default dashboard or login
			// You can customize this based on your requirements
			router.push("/dashboard");
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
