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
	options?: Option[];
}

export default function ReportGeneratorControl({
	title,
	description,
	options,
}: ReportGeneratorControlProps) {
	const [selectedOption, setSelectedOption] = useState<string | null>(null);

	let isDisabled = false;
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
			>
				Download
			</Button>
		</div>
	);
}
