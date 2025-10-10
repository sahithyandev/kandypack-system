"use client";
import Support from "@/components/driver/support";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SupportPage() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Support</CardTitle>
			</CardHeader>
			<CardContent>
				<Support />
			</CardContent>
		</Card>
	);
}
