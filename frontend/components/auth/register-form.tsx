"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
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

const registerSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters").max(50),
	email: z.email("Please enter a valid email address"),
	username: z.string().min(2, "Username must be at least 2 characters").max(50),
	password: z.string().min(6, "Password must be at least 6 characters").max(50),
});

export default function RegisterForm() {
	const [error, setError] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const defaultValues = { name: "", email: "", username: "", password: "" };

	const form = useForm<z.infer<typeof registerSchema>>({
		resolver: zodResolver(registerSchema),
		defaultValues,
	});

	async function onSubmit(data: z.infer<typeof registerSchema>) {
		setIsLoading(true);
		setError("");

		try {
			const registerData = data as z.infer<typeof registerSchema>;
			const result = AuthService.register(
				registerData.name,
				registerData.email,
				registerData.username,
				registerData.password,
			);

			if (result.success) {
				router.push("/dashboard");
			} else {
				setError(result.error || "Authentication failed");
			}
		} catch {
			setError("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card className="min-w-md p-0">
			<CardContent className="grid p-0">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
						<div className="flex flex-col gap-6">
							<div className="flex flex-col items-center text-center">
								<h1 className="text-2xl font-bold">Create Account</h1>
								<p className="text-muted-foreground text-balance">
									Join Kandypack logistics system
								</p>
							</div>

							{error && (
								<div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
									{error}
								</div>
							)}

							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input placeholder="Harry Potter" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="harry.p@hogwarts.edu"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

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
											<Input
												type="password"
												placeholder="***********"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Processing..." : "Create Account"}
							</Button>

							<div className="text-center text-sm">
								Already have an account?{" "}
								<a href="/login" className="underline underline-offset-2">
									Login
								</a>
							</div>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
