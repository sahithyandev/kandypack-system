"use client";
import { useState } from "react";

export default function Support() {
	const [msgs, setMsgs] = useState<string[]>([
		"Welcome to support. Describe your issue.",
	]);
	const [text, setText] = useState("");

	function send() {
		if (!text.trim()) return;
		setMsgs((s) => [...s, `You: ${text.trim()}`]);
		setText("");
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="h-32 overflow-auto rounded border p-2 bg-background">
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
		</div>
	);
}
