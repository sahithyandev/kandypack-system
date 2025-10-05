"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/lib/auth";

const loginSchema = z.object({
	username: z.string().min(2, "Username must be at least 2 characters").max(50),
	password: z.string().min(6, "Password must be at least 6 characters").max(50),
});

const registerSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters").max(50),
	email: z.string().email("Please enter a valid email address"),
	username: z.string().min(2, "Username must be at least 2 characters").max(50),
	password: z.string().min(6, "Password must be at least 6 characters").max(50),
});

interface AuthFormProps {
	mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
	const [error, setError] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const schema = mode === "login" ? loginSchema : registerSchema;
	const defaultValues = mode === "login" 
		? { username: "", password: "" }
		: { name: "", email: "", username: "", password: "" };

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues,
	});

	async function onSubmit(data: z.infer<typeof schema>) {
		setIsLoading(true);
		setError("");

		try {
			let result;
			
			if (mode === "login") {
				const loginData = data as z.infer<typeof loginSchema>;
				result = AuthService.login(loginData.username, loginData.password);
			} else {
				const registerData = data as z.infer<typeof registerSchema>;
				result = AuthService.register(
					registerData.name,
					registerData.email,
					registerData.username,
					registerData.password
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
	}

	return (
		<Card className="overflow-hidden p-0">
			<CardContent className="grid p-0">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
						<div className="flex flex-col gap-6">
							<div className="flex flex-col items-center text-center">
								<h1 className="text-2xl font-bold">
									{mode === "login" ? "Welcome back" : "Create Account"}
								</h1>
								<p className="text-muted-foreground text-balance">
									{mode === "login" 
										? "Login to your Kandypack account"
										: "Join Kandypack logistics system"
									}
								</p>
							</div>

							{error && (
								<div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
									{error}
								</div>
							)}

							{mode === "register" && (
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Full Name</FormLabel>
											<FormControl>
												<Input placeholder="John Perera" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}

							{mode === "register" && (
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input type="email" placeholder="john@example.com" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}

							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input placeholder="harry.p23" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Processing..." : (mode === "login" ? "Login" : "Create Account")}
							</Button>

							<div className="text-center text-sm">
								{mode === "login" ? (
									<>
										Don&apos;t have an account?{" "}
										<a href="/register" className="underline underline-offset-2">
											Sign up
										</a>
									</>
								) : (
									<>
										Already have an account?{" "}
										<a href="/login" className="underline underline-offset-2">
											Login
										</a>
									</>
								)}
							</div>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}