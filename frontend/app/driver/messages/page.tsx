"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MessagesPage() {
	const [msgs, setMsgs] = useState<string[]>(["Welcome to messages."]);
	const [text, setText] = useState("");

	function send() {
		if (!text.trim()) return;
		setMsgs((s) => [...s, `You: ${text.trim()}`]);
		setText("");
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Messages</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="h-56 overflow-auto p-2 border rounded mb-2">
					{msgs.map((m) => (
						<div key={m} className="text-sm">
							{m}
						</div>
					))}
				</div>
				<div className="flex gap-2">
					<input
						className="flex-1 rounded border px-2"
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
					<button
						type="button"
						className="rounded bg-primary px-3 text-white"
						onClick={send}
					>
						Send
					</button>
				</div>
			</CardContent>
		</Card>
	);
}
