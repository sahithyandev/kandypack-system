"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/auth";

interface SimpleAuthFormProps {
	mode: "login" | "register";
}

export default function SimpleAuthForm({ mode }: SimpleAuthFormProps) {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		username: "",
		password: "",
	});
	const [error, setError] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			let result;
			
			if (mode === "login") {
				result = AuthService.login(formData.username, formData.password);
			} else {
				result = AuthService.register(
					formData.name,
					formData.email,
					formData.username,
					formData.password
				);
			}

			if (result.success) {
				router.push("/dashboard");
			} else {
				setError(result.error || "Authentication failed");
			}
		} catch (err) {
			setError("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData(prev => ({
			...prev,
			[e.target.name]: e.target.value
		}));
	};

	return (
		<div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
			<div className="p-6">
				<div className="text-center mb-6">
					<h1 className="text-2xl font-bold text-gray-900 mb-2">
						{mode === "login" ? "Welcome back" : "Create Account"}
					</h1>
					<p className="text-gray-600">
						{mode === "login" 
							? "Login to your Kandypack account"
							: "Join Kandypack logistics system"
						}
					</p>
				</div>

				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					{mode === "register" && (
						<div>
							<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
								Full Name
							</label>
							<input
								type="text"
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								placeholder="John Perera"
								required={mode === "register"}
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
					)}

					{mode === "register" && (
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="john@example.com"
								required={mode === "register"}
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
					)}

					<div>
						<label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
							Username
						</label>
						<input
							type="text"
							id="username"
							name="username"
							value={formData.username}
							onChange={handleChange}
							placeholder="harry.p23"
							required
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
							Password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{isLoading ? "Processing..." : (mode === "login" ? "Login" : "Create Account")}
					</button>
				</form>

				<div className="mt-6 text-center text-sm text-gray-600">
					{mode === "login" ? (
						<>
							Don't have an account?{" "}
							<a href="/register" className="text-blue-600 hover:text-blue-500 underline">
								Sign up
							</a>
						</>
					) : (
						<>
							Already have an account?{" "}
							<a href="/login" className="text-blue-600 hover:text-blue-500 underline">
								Login
							</a>
						</>
					)}
				</div>
			</div>
		</div>
	);
}