"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { postAuthSignIn } from "@/lib/api-client";
import { saveToken } from "@/lib/auth";

const loginSchema = z.object({
	username: z.string().min(2, "Username must be at least 2 characters").max(50),
	password: z.string().min(6, "Password must be at least 6 characters").max(50),
});

export default function LoginForm() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const defaultValues = { username: "sahithyan", password: "sahithyan" };

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues,
	});

	async function onSubmit(data: z.infer<typeof loginSchema>) {
		setIsLoading(true);

		try {
			const r = await postAuthSignIn({
				username: data.username,
				password: data.password,
			});
			if (!("token" in r)) {
				toast.error("Login failed. Please check your credentials.");
				return;
			}

			saveToken(r.token);
			router.push("/dashboard");
		} catch {
			toast.error("An unknown error occurred.");
			return;
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card className="p-0 min-w-md">
			<CardContent className="grid p-0">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
						<div className="flex flex-col gap-6">
							<div className="flex flex-col items-center text-center">
								<h1 className="text-2xl font-bold">Welcome back</h1>
								<p className="text-muted-foreground text-balance">
									Login to your Kandypack account
								</p>
							</div>

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
												placeholder="**********"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Processing..." : "Login"}
							</Button>

							<div className="text-center text-sm">
								Don&apos;t have an account?{" "}
								<a href="/register" className="underline underline-offset-2">
									Sign up
								</a>
							</div>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
