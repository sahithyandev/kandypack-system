"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { postAuthSignUp } from "@/lib/api-client";
import { saveToken } from "@/lib/auth";

const registerSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters").max(50),
	email: z.email("Please enter a valid email address"),
	username: z.string().min(2, "Username must be at least 2 characters").max(50),
	password: z.string().min(6, "Password must be at least 6 characters").max(50),
});

export default function RegisterForm() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const defaultValues = {
		name: "Sahithyan",
		email: "sahithyank@gmail.com",
		username: "sahithyan",
		password: "sahithyan",
	};

	const form = useForm<z.infer<typeof registerSchema>>({
		resolver: zodResolver(registerSchema),
		defaultValues,
	});

	async function onSubmit(data: z.infer<typeof registerSchema>) {
		setIsLoading(true);

		try {
			const r = await postAuthSignUp({
				name: data.name,
				username: data.username,
				password: data.password,
			});
			if (!("token" in r)) {
				console.error(r);
				toast.error("Registration failed");
				return;
			}
			toast.success("Registration successful");

			saveToken(r.token);
			router.push("/dashboard");
		} catch (err) {
			if (!(err instanceof AxiosError) || !err.response || !err.response.data) {
				toast.error("Registration failed");
				return;
			}
			toast.error(err.response.data.message);
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
