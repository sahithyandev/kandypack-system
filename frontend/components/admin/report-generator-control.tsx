"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type OptionType = "select";

interface Option {
	name: string;
	type: OptionType;
	defaultValue: string;
	values: Array<string> | readonly string[];
	required?: boolean;
}

interface ReportGeneratorControlProps {
	title: string;
	description?: string;
	downloadUrl?: string;
	options?: Option[];
}

export default function ReportGeneratorControl({
	title,
	description,
	downloadUrl,
	options,
}: ReportGeneratorControlProps) {
	const [selectedOption, setSelectedOption] = useState<string | null>(null);

	let isDisabled = !downloadUrl;
	if (options && options.length > 0) {
		for (const option of options) {
			if (option.required && !selectedOption) {
				isDisabled = true;
				break;
			}
		}
	}

	return (
		<div className="grid grid-cols-[1fr_auto] grid-rows-[auto_auto_auto] w-full">
			<h3 className="col-start-1 row-start-1 text-lg font-semibold">{title}</h3>
			<p className="col-start-1 row-start-2 max-w-prose">{description}</p>
			{options && options.length > 0 ? (
				<div className="col-start-1 row-start-3">
					{options.map((option) => {
						if (option.type === "select") {
							return (
								<Select key={option.name} onValueChange={setSelectedOption}>
									<SelectTrigger className="w-[200px] mt-2">
										<SelectValue placeholder={option.name} />
									</SelectTrigger>
									<SelectContent>
										{option.values.map((item) => {
											return (
												<SelectItem key={item} value={item}>
													{item}
												</SelectItem>
											);
										})}
									</SelectContent>
								</Select>
							);
						}
					})}
				</div>
			) : null}
			<Button
				className="cursor-pointer col-start-2 row-span-full my-auto"
				disabled={isDisabled}
				onClick={() => {
					console.log("Download button clicked");
					if (!downloadUrl) {
						return;
					}
					toast.loading("Downloading...");

					let fileName: string = "";
					fetch(downloadUrl)
						.then((response) => {
							if (!response.ok) {
								throw new Error("Network response was not ok");
							}

							fileName = response.headers
								.get("content-disposition")
								?.split("filename=")[1]
								?.replace(/['"]/g, "") as string;
							return response.blob();
						})
						.then((blob) => {
							toast.dismiss();
							const url = window.URL.createObjectURL(blob);
							const a = document.createElement("a");
							a.style.display = "none";
							a.href = url;
							a.download = fileName || "report.csv";
							document.body.appendChild(a);
							a.click();
							window.URL.revokeObjectURL(url);
						})
						.catch((error) => {
							toast.dismiss();
							toast.error("There was a problem with the download:", error);
						});
				}}
			>
				Download
			</Button>
		</div>
	);
}
