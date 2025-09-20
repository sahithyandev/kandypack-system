"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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

const schema = z.object({
	username: z.string().min(2).max(50),
	password: z.string().min(6).max(50),
});

export default function LoginForm() {
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	function onSubmit(data: z.infer<typeof schema>) {
		console.log(data);
	}

	return (
		<Card className="overflow-hidden p-0">
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
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full">
								Login
							</Button>
							<div className="text-center text-sm">
								Don&apos;t have an account?{" "}
								<a href="/sign-up" className="underline underline-offset-2">
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
