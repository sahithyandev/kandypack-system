"use client";
import { type ChangeEvent, useState } from "react";

export default function Documents() {
	const [files, setFiles] = useState<File[]>([]);

	function onChange(e: ChangeEvent<HTMLInputElement>) {
		if (!e.target.files) return;
		const newFiles = Array.from(e.target.files as FileList);
		setFiles((s: File[]) => [...s, ...newFiles]);
	}

	return (
		<div className="flex flex-col gap-2">
			<label htmlFor="file-upload" className="text-sm text-muted-foreground">
				Upload proof of delivery / docs
			</label>
			<input id="file-upload" type="file" multiple onChange={onChange} />
			<ul className="text-sm list-disc list-inside">
				{files.map((f: File, i: number) => (
					<li key={`${f.name}-${i}`}>
						{f.name} ({Math.round(f.size / 1024)} KB)
					</li>
				))}
			</ul>
		</div>
	);
}
